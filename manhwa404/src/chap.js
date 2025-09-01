function execute(url) {
    const response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    });

    if (!response.ok) {
        return Response.error("Không thể tải trang: " + url);
    }

    const html = response.text();

    // Regex để lấy ảnh .webp hoặc .jpg từ thư mục uploads
    const regex = /https?:\/\/manhwa404\.com\/wp-content\/uploads\/[^"]+\.(webp|jpg)/g;
    const urls = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
        urls.push(match[0]);
    }

    if (urls.length === 0) {
        return Response.error("Không tìm thấy ảnh nào trong chương.");
    }

    return Response.success(urls);
}
