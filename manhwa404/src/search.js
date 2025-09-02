
load("config.js");

// =========================
// search.js
// Tìm kiếm theo từ khoá và phân trang
// key: chuỗi tìm kiếm
// page: số trang (mặc định 1)
// =========================

function execute(key, page) {
  if (!key) return Response.success([]);
  page = page || "1";

  // Thử với tham số "page=" (nhiều site chấp nhận). Nếu gặp vấn đề có thể đổi sang "paged=".
  var url = BASE_URL + "?s=" + encodeURIComponent(key) + "&page=" + page;

  var html = fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }});
  if (!html || !html.ok) return Response.error("Không tải được trang tìm kiếm.");

  var doc = html.html();
  var items = doc.select("div.listupd div.bsx, div.listupd div.utao.styletwo, ul.manga-list li, div.listing div.bs");
  var out = [];

  items.forEach(function(it) {
    var a = it.select("a").first();
    var img = it.select("img").first();

    var href = normalizeUrl(a ? a.attr("href") : null);
    var title = text(it.select(".tt, .title, h3, h2").first()) || text(a);
    var cover = normalizeUrl(pickImageSrc(img));

    if (href && title) {
      out.push({
        title: title,
        name: title,
        input: href,
        script: "detail.js",
        cover: cover
      });
    }
  });

  // Phân trang: cố gắng phát hiện liên kết "Next" hoặc ký tự »
  var hasNext = false;
  var nextA = doc.select(".pagination a.next, .wp-pagenavi a.next").first();
  if (!nextA) {
    // Tìm anchor chứa dấu » hoặc "Next"
    var anchors = doc.select(".pagination a, .wp-pagenavi a");
    for (var i = 0; i < anchors.size(); i++) {
      var t = text(anchors.get(i));
      if (t === "»" || /next/i.test(t)) {
        hasNext = true;
        break;
      }
    }
  } else {
    hasNext = true;
  }

  return Response.success(out, hasNext);
}
