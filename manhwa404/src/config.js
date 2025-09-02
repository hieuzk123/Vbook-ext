
// =========================
// config.js
// Cấu hình và tiện ích dùng chung cho toàn bộ plugin
// =========================

// Bạn có thể override BASE_URL bằng cách khai báo biến toàn cục CONFIG_URL ở môi trường chạy.
var BASE_URL = (typeof CONFIG_URL !== "undefined" && CONFIG_URL)
  ? (CONFIG_URL.endsWith("/") ? CONFIG_URL : CONFIG_URL + "/")
  : "https://manhwa404.com/";

// ---- Tiện ích chuẩn hoá URL ----

// Chuẩn hoá một URL bất kỳ (loại bỏ anchor, thêm protocol nếu thiếu, nối host nếu là path).
function normalizeUrl(u, origin) {
  if (!u) return null;
  u = String(u).split("#")[0].trim();

  // Một số site trả về //cdn... => thêm protocol
  if (u.startsWith("//")) u = "https:" + u;

  // Nếu là đường dẫn tương đối thì ghép với origin (hoặc BASE_URL nếu không truyền origin)
  if (u.startsWith("/")) {
    var base = (origin || BASE_URL).replace(/^(https?:\/\/[^/]+).*/, "$1");
    u = base + u;
  }

  return u;
}

// Lấy text của element (trim + gộp khoảng trắng)
function text(el) {
  return (el ? el.text() : "").replace(/\s+/g, " ").trim();
}

// Lấy attribute src ưu tiên các biến thể lazy-load
function pickImageSrc(el) {
  if (!el) return null;
  return el.attr("data-src") || el.attr("data-lazy-src") || el.attr("src") || null;
}

// Xuất tiện ích ra phạm vi toàn cục (để các file khác có thể dùng khi load("config.js"))
this.BASE_URL = BASE_URL;
this.normalizeUrl = normalizeUrl;
this.text = text;
this.pickImageSrc = pickImageSrc;
