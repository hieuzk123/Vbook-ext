
load("config.js");

// =========================
// detail.js
// Lấy thông tin chi tiết của 1 tựa truyện từ trang /manga/slug
// =========================

function execute(url) {
  var res = fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }});
  if (!res || !res.ok) return Response.error("Không tải được trang chi tiết.");

  var doc = res.html();

  // Tên truyện
  var name = text(doc.select(".entry-title, h1.entry-title, h1.post-title").first()) ||
             text(doc.select(".post-title h1").first());

  // Ảnh bìa
  var cover = normalizeUrl(
    pickImageSrc(doc.select(".thumbook img, .summary_image img, .thumb img, .series-thumb img").first())
  );

  // Tác giả (một số theme dùng .author-content, .fmed b:contains(Author), vv.)
  var author = text(doc.select(".author-content, .fmed b:contains(Author) + a, .author a, a[rel=author]").first());

  // Tình trạng
  var statusText = text(doc.select(".post-status, .status, .tsinfo .imptdt:contains(Status) i, .summary-content .status").first()).toLowerCase();
  var ongoing = /ongoing|đang|on-going/.test(statusText);

  // Mô tả
  var desc = text(doc.select(".entry-content p, .description, .summary__content, .desc p").first());

  // Thể loại
  var genreEls = doc.select(".genxed a, .mgen a, .genres a, .seriestugenre a");
  var genres = [];
  genreEls.forEach(function(g) {
    var t = text(g);
    var href = normalizeUrl(g.attr("href"));
    if (t && href) {
      genres.push({ title: t, input: href, script: "gen.js" });
    }
  });

  // Gợi ý (nếu có khối "related")
  var suggests = [];
  var sugCards = doc.select(".listupd .utao.styletwo, .related .bsx, .post-related .bs");
  sugCards.forEach(function(card) {
    var a = card.select("a").first();
    var img = card.select("img").first();

    var href = normalizeUrl(a ? a.attr("href") : null);
    var title = text(card.select(".tt, .title, h3, h2").first()) || text(a);
    var sCover = normalizeUrl(pickImageSrc(img));
    if (href && title) {
      suggests.push({ title: title, input: href, script: "detail.js", cover: sCover });
    }
  });

  // Kết quả
  var detail = {
    name: name,
    cover: cover,
    author: author,
    ongoing: ongoing,
    host: BASE_URL.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
    description: desc,
    genres: genres,
    suggests: suggests
  };

  return Response.success(detail);
}
