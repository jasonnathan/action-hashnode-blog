export function atag(link, title, content) {
	return link !== "" ? `<a href="${link}" title="${title}">${content}</a>` : content;
}

export function imgtag(src, link, title, align = "", width = "") {
	const widthAttr = width ? `width="${width}"` : "";
	const alignAttr = align ? `align="${align}"` : "";
	const altAttr = title ? `alt="${title}"` : "";
	const imgTag = `<img src="${src}" ${[altAttr, widthAttr, alignAttr].filter(Boolean).join(" ")} />`;

	return src ? atag(link, title, imgTag) : "";
}


export function post_link(post, BLOG_URL = "") {
	return post.url ? post.url : `https://${BLOG_URL}/p/${post.slug}`;
}

export function image_size(user_value, _default, small, large) {
	if (user_value === "small") return small;
	if (user_value === "large") return large;
	if (user_value === "") return _default;
	return user_value;
}

export function parseDate(date) {
	if (!date) return "Unknown Date"; 
	const parsedData = new Date(date);
	if (isNaN(parsedData.getTime())) return "Invalid Date";
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	return `${parsedData.getDate()} ${months[parsedData.getMonth()]} ${parsedData.getFullYear()}`;
}

export function formatDateRange(dateAdded, dateUpdated) {
	const added = `<strong>${parseDate(dateAdded)}</strong>`;
	const updated = dateUpdated && !isNaN(new Date(dateUpdated))
			? ` | <strong>Updated: ${parseDate(dateUpdated)}</strong>`
			: "";
	return `<div>${added}${updated}</div>`;
}
