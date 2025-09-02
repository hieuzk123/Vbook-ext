
load("config.js");

// =========================
// home.js
// Trả về các mục entry ở tab "Home" (ví dụ danh sách mới nhất)
// =========================

function execute() {
  // Mặc định cung cấp một mục "Mới nhất" dùng gen.js để phân trang
  return Response.success([
    {
      title: "Mới nhất",
      input: BASE_URL + "manga/?m_orderby=latest",
      script: "gen.js"
    },
    {
      title: "Mới cập nhật",
      input: BASE_URL + "manga/?m_orderby=update",
      script: "gen.js"
    },
    {
      title: "Truyện mới",
      input: BASE_URL + "manga/?m_orderby=new-manga",
      script: "gen.js"
    }
  ]);
}
