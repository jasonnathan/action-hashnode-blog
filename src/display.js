import { imgtag, atag, formatDateRange } from "./helpers.js";

const LIST_ITEM = (index, title, url) => `${index} [${title}](${url})`;
const GIST_ITEM = (index, title) => `${index}. ${title}`;

const BLOG_ITEM = (title, url, coverImage, publishedAt, updatedAt, description) => `
<h3>${atag(url, title, title)}</h3>
${coverImage ? imgtag(coverImage, url, title, "", "400px") : ""}
${formatDateRange(publishedAt, updatedAt)}
<p>${description || ""}</p>`;

const BLOG_SIDE_ITEM = (title, url, coverImage, publishedAt, updatedAt, description, align) => `
<p align="left">
${coverImage ? imgtag(coverImage, url, title, align, "250px") : ""}
${atag(url, title, `<strong>${title}</strong>`)}
${formatDateRange(publishedAt, updatedAt)}
<br/> ${description || ""}
</p><br/>`;

const blog_table = (posts, style) => {
	let column = style.split("-")[2] || 2;
	let html = "<table><tr>";

	return posts.reduce((acc, { url, title, seo, coverImage, updatedAt, publishedAt }, i) => {
		if (i !== 0 && i % column === 0) acc += "</tr><tr>";
		return acc + `<td>${coverImage?.url ? imgtag(coverImage.url, url, title, "", "") : ""}
		${atag(url, title, `<strong>${title}</strong>`)}
		${formatDateRange(publishedAt, updatedAt)}
		<br/> ${seo?.description || ""}</td>`;
	}, html) + "</tr></table>";
};

// List Renderer
export function list(posts, STYLE) {
	STYLE = STYLE.toLowerCase();

	return posts.reduce((acc, { title, url }, i) => {
		switch (STYLE) {
			case "list":
			case "list-unordered":
				return acc + "\n" + LIST_ITEM("-", title, url);
			case "list-ordered":
				return acc + "\n" + LIST_ITEM(`${i + 1}.`, title, url);
			case "list-gist":
				return acc + "\n" + GIST_ITEM(i + 1, title);
			default:
				return acc;
		}
	}, "");
}

// Blog Renderer
export function blog(posts, STYLE) {
	STYLE = STYLE.toLowerCase();

	if (STYLE.startsWith("blog-grid")) return blog_table(posts, STYLE);

	let nextStyle = "blog-left";

	return posts.reduce((acc, { url, title, seo, coverImage, updatedAt, publishedAt }) => {
		const imageUrl = coverImage?.url || "";
		const description = seo?.description || "";

		switch (STYLE) {
			case "blog":
				return acc + BLOG_ITEM(title, url, imageUrl, publishedAt, updatedAt, description);

			case "blog-left":
			case "blog-right":
				let align = STYLE === "blog-left" ? "left" : "right";
				return acc + BLOG_SIDE_ITEM(title, url, imageUrl, publishedAt, updatedAt, description, align);

			case "blog-alternate":
				let altAlign = nextStyle === "blog-left" ? "left" : "right";
				let result = BLOG_SIDE_ITEM(title, url, imageUrl, publishedAt, updatedAt, description, altAlign);
				// Flip next row
				nextStyle = nextStyle === "blog-left" ? "blog-right" : "blog-left";
				return acc + result;

			default:
				return acc;
		}
	}, "");
}