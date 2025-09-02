
load("config.js");

// =========================
// gen.js
// Dùng để đọc 1 trang "listing" (home/genre/latest...) và trả về danh sách truyện có phân trang
// input: URL listing đầy đủ (ví dụ .../manga/?m_orderby=latest)
// page: số trang (mặc định 1)
// =========================

function execute(url, page) {
  page = page || "1";

  // Sinh URL phân trang đơn giản: nếu đã có dấu ?, thêm &page=; ngược lại dùng ?page=
  var listUrl = url + (url.indexOf("?") >= 0 ? "&" : "?") + "page=" + page;
  var html = fetch(listUrl, { headers: { "User-Agent": "Mozilla/5.0" }});
  if (!html || !html.ok) return Response.error("Không tải được trang danh sách.");

  var doc = html.html();

  // Một số theme của WP-Manga dùng các layout khác nhau, ghép nhiều selector để bền hơn
  var cards = doc.select("div.listupd div.utao.styletwo, div.listupd div.bsx, ul.manga-list li, div.listing div.bs");
  if (!cards || !cards.size()) return Response.success([]);

  var data = [];
  cards.forEach(function(card) {
    var a = card.select("a").first();
    var img = card.select("img").first();

    var href = normalizeUrl(a ? a.attr("href") : null);
    var title = text(card.select(".tt, .title, h3, h2").first()) || text(a);
    var cover = normalizeUrl(pickImageSrc(img));

    if (href && title) {
      data.push({
        title: title,
        name: title,
        input: href,
        script: "detail.js",
        cover: cover
      });
    }
  });

  // Kiểm tra tồn tại trang kế tiếp
  var hasNext = false;
  var nextLink = doc.select(".pagination a.next, .nav-previous a, a[rel=next]").first();
  if (nextLink && nextLink.attr("href")) {
    hasNext = true;
  } else {
    // Một số theme không có thẻ a.next mà chỉ hiện số/trang cuối ⇒ so sánh số page hiện tại với max
    var pagTexts = doc.select(".pagination, .wp-pagenavi").text();
    if (pagTexts) {
      var m = pagTexts.match(/page\s+(\d+)\s+of\s+(\d+)/i);
      if (m && +m[1] < +m[2]) hasNext = true;
    }
  }

  return Response.success(data, hasNext);
}
