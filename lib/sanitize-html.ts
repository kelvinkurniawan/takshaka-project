import sanitizeHtml from "sanitize-html";

export function sanitizeRichText(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: sanitizeHtml.defaults.allowedTags,
		allowedAttributes: {
			a: ["href", "name", "target", "rel"],
			img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
			"*": ["class"],
		},
		allowedSchemes: ["http", "https", "mailto", "tel"],
		transformTags: {
			a: (tagName, attribs) => ({
				tagName,
				attribs:
					attribs.target === "_blank"
						? { ...attribs, rel: "noopener noreferrer" }
						: attribs,
			}),
		},
	});
}
