
load("config.js");

// =========================
// toc.js
// Lấy danh sách chương từ trang chi tiết truyện
// =========================

function execute(url) {
  var res = fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }});
  if (!res || !res.ok) return Response.error("Không tải được TOC.");

  var html = res.text();
  var doc = Html.parse(html);

  // Ghép nhiều selector để phù hợp với các theme WP-Manga khác nhau
  var chapterLinkSelectors = [
    ".listing-chapters_wrap .chapter-item a",
    ".wp-manga-chapter a",
    ".list-chap a",
    ".chapter a",
    ".chapters a",
    ".eplister a"
  ].join(", ");

  var aEls = doc.select(chapterLinkSelectors);
  if (!aEls || !aEls.size()) return Response.success([]);

  var list = [];
  aEls.forEach(function(a) {
    var name = text(a);
    var link = normalizeUrl(a.attr("href"), url);
    if (name && link) {
      list.push({ name: name, input: link, script: "chap.js" });
    }
  });

  // Một số site để chương mới nhất nằm trên cùng (đảo thứ tự nếu muốn)
  // list.reverse();

  return Response.success(list);
}
