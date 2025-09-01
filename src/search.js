function execute(key, page) {
    if (!page) page = '1';

    const url = `https://manhwa404.com/?s=${encodeURIComponent(key)}&page=${page}`;
    const doc = fetch(url).html();

    const items = doc.select("div.listupd div.bsx");
    const results = [];

    items.forEach(item => {
        const a = item.select("a");
        const name = a.attr("title");
        const link = a.attr("href");
        const cover = a.select("img").attr("data-src") || a.select("img").attr("src");
        const description = item.select(".tt").text();

        results.push({
            name,
            link,
            cover,
            description,
            host: "manhwa404.com"
        });
    });

    const hasNext = doc.select("ul.pagination li").last().text().includes("»");
    const nextPage = hasNext ? (parseInt(page) + 1).toString() : null;

    return Response.success(results, nextPage);
}
