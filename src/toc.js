function execute(url) {
    const doc = fetch(url).html();
    const chapters = doc.select('div#chapterlist li div.eph-num a');
    const list = [];

    chapters.forEach(chap => {
        const name = chap.text();
        const link = chap.attr('href');

        list.push({
            name,
            url: link,
            host: "manhwa404.com"
        });
    });

    if (list.length === 0) {
        return Response.error("Không tìm thấy chương nào.");
    }

    return Response.success(list);
}
