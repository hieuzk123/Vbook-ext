function execute(url) {
    const doc = fetch(url).html();

    const name = doc.select("div.post-title > h1").text();
    const cover = doc.select("div.summary_image img").attr("src");
    const author = doc.select("div.author-content").text();
    const description = doc.select("div.summary__content").text();
    const detail = doc.select("div.post-content_item").text();
    const ongoing = doc.select("div.post-status > div.summary-content").text().toLowerCase().includes("ongoing");

    const genres = doc.select("div.genres-content a").map(e => ({
        title: e.text(),
        input: e.attr("href"),
        script: "gen.js"
    }));

    const suggests = doc.select("div.related-posts a").map(e => ({
        title: e.text(),
        input: e.attr("href"),
        script: "gen.js"
    }));

    return Response.success({
        name,
        cover,
        host: "manhwa404.com",
        author,
        description,
        detail,
        ongoing,
        genres,
        suggests
    });
}
