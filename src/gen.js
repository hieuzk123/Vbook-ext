function execute(url, page) {
    if (!page) page = '1';

    const doc = fetch(url + "?page=" + page).html();
    const elements = doc.select("div.listupd div.utao.styletwo");

    const books = elements.map(el => {
        const a = el.select("h3 a");
        const img = el.select(".imgu img");
        const status = el.select(".statusind");

        const name = a ? a.attr("title") : "";
        const link = a ? a.attr("href") : "";
        const cover = img ? img.attr("data-src") || img.attr("src") : "";
        const description = status ? status.text() : "";

        return {
            name,
            link,
            cover,
            description
        };
    });

    const hasNext = doc.select("ul.pagination li").last().text().includes("»");
    const next = hasNext ? (parseInt(page) + 1).toString() : null;

    return Response.success(books, next);
}
