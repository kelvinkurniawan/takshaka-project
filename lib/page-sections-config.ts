export const pageSectionsConfig = {
	home: {
		hero: [
			{
				type: "string",
				label: "Title",
				target: "title",
			},
			{
				type: "string",
				label: "Subtitle",
				target: "subtitle",
			},
			{
				type: "image/video",
				label: "Background Image",
				target: "background",
			},
		],
		threeItemSection: [
			{
				type: "string",
				label: "Heading",
				target: "heading",
			},
			{
				type: "arrayItems",
				label: "Images",
				target: "images",
				fields: [
					{
						type: "image",
						label: "Image",
						target: "image",
					},
					{
						type: "string",
						label: "Alt Text",
						target: "alt",
					},
					{
						type: "string",
						label: "Title",
						target: "title",
					},
					{
						type: "string",
						label: "Description",
						target: "description",
						multiline: true,
					},
				],
			},
		],
		imagesSection: [
			{
				type: "arrayItems",
				label: "Images",
				target: "images",
				fields: [
					{
						type: "image",
						label: "Image",
						target: "src",
					},
					{
						type: "string",
						label: "Alt Text",
						target: "alt",
					},
				],
			},
			{
				type: "string",
				label: "Description",
				target: "description",
				multiline: true,
			},
		],
		curatedExperiences: [
			{
				type: "tabs",
				label: "Experience Tabs",
				target: "tabs",
				tabFields: [
					{
						type: "string",
						label: "Tab ID",
						target: "id",
					},
					{
						type: "string",
						label: "Tab Label",
						target: "label",
					},
					{
						type: "arrayItems",
						label: "Items",
						target: "items",
						fields: [
							{
								type: "string",
								label: "ID",
								target: "id",
							},
							{
								type: "string",
								label: "Title",
								target: "title",
							},
							{
								type: "string",
								label: "Description",
								target: "description",
								multiline: true,
							},
							{
								type: "image",
								label: "Image",
								target: "image",
							},
						],
					},
				],
			},
		],
		experiencesShared: [
			{
				type: "arrayItems",
				label: "Experiences",
				target: "experiences",
				fields: [
					{
						type: "string",
						label: "ID",
						target: "id",
					},
					{
						type: "string",
						label: "Title",
						target: "title",
					},
					{
						type: "string",
						label: "Description",
						target: "description",
						multiline: true,
					},
					{
						type: "image",
						label: "Image",
						target: "image",
					},
				],
			},
		],
	},
	"our-inspiration": {
		hero: [
			{
				type: "string",
				label: "Title",
				target: "title",
			},
			{
				type: "string",
				label: "Description",
				target: "description",
			},
			{
				type: "image",
				label: "Background Image",
				target: "background",
			},
		],
		boardLetter: [
			{
				type: "image",
				label: "Image",
				target: "imageUrl",
			},
			{
				type: "arrayItems",
				label: "Paragraphs",
				target: "paragraphs",
				fields: [
					{
						type: "string",
						label: "Paragraph Text",
						target: null,
						multiline: true,
					},
				],
			},
			{
				type: "string",
				label: "Signature Name",
				target: "signatureName",
			},
			{
				type: "string",
				label: "Signature Title",
				target: "signatureTitle",
			},
		],
		fullwidthImage: [
			{
				type: "image",
				label: "Image",
				target: "src",
			},
			{
				type: "string",
				label: "Alt Text",
				target: "alt",
			},
		],
		takskaWay: [
			{
				type: "string",
				label: "Section Title",
				target: "sectionTitle",
			},
			{
				type: "arrayItems",
				label: "Items",
				target: "items",
				fields: [
					{
						type: "string",
						label: "ID",
						target: "id",
					},
					{
						type: "string",
						label: "Title",
						target: "title",
					},
					{
						type: "image",
						label: "Image",
						target: "imageUrl",
					},
				],
			},
		],
		brandStory: [
			{
				type: "image",
				label: "Background Image",
				target: "backgroundImage",
			},
			{
				type: "string",
				label: "Section Title",
				target: "sectionTitle",
			},
			{
				type: "arrayItems",
				label: "Items",
				target: "items",
				fields: [
					{
						type: "string",
						label: "ID",
						target: "id",
					},
					{
						type: "string",
						label: "Title",
						target: "title",
					},
					{
						type: "string",
						label: "Description",
						target: "description",
						multiline: true,
					},
					{
						type: "image",
						label: "Image",
						target: "imageUrl",
					},
				],
			},
		],
		timeline: [
			{
				type: "string",
				label: "Section Title",
				target: "sectionTitle",
			},
			{
				type: "arrayItems",
				label: "Timeline Items",
				target: "items",
				fields: [
					{
						type: "string",
						label: "ID",
						target: "id",
					},
					{
						type: "string",
						label: "Title",
						target: "title",
					},
					{
						type: "string",
						label: "Description",
						target: "description",
					},
				],
			},
		],
	},
	"prestige-events": {
		hero: [
			{
				type: "string",
				label: "Title",
				target: "title",
			},
			{
				type: "string",
				label: "Description",
				target: "description",
			},
			{
				type: "image",
				label: "Background Image",
				target: "background",
			},
		],
		heroContent: [
			{
				type: "arrayItems",
				label: "Hero Content Slides",
				target: "slides",
				fields: [
					{
						type: "image",
						label: "Background Image",
						target: "backgroundImage",
					},
					{
						type: "string",
						label: "Alt Text",
						target: "alt",
					},
					{
						type: "string",
						label: "Badge",
						target: "badge",
					},
					{
						type: "string",
						label: "Heading",
						target: "heading",
						multiline: true,
					},
					{
						type: "string",
						label: "Description",
						target: "description",
						multiline: true,
					},
				],
			},
		],
		twoColumn: [
			{
				type: "string",
				label: "Title",
				target: "title",
			},
			{
				type: "string",
				label: "Title (Italic)",
				target: "titleItalic",
			},
			{
				type: "string",
				label: "Title (Bold)",
				target: "titleBold",
			},
			{
				type: "string",
				label: "Description",
				target: "description",
				multiline: true,
			},
			{
				type: "image",
				label: "Image",
				target: "imageUrl",
			},
		],
		imageGallery: [
			{
				type: "arrayItems",
				label: "Gallery Images",
				target: "images",
				fields: [
					{
						type: "string",
						label: "ID",
						target: "id",
					},
					{
						type: "image",
						label: "Image",
						target: "src",
					},
					{
						type: "string",
						label: "Alt Text",
						target: "alt",
					},
					{
						type: "string",
						label: "Caption",
						target: "caption",
						multiline: true,
					},
					{
						type: "string",
						label: "Link URL",
						target: "link",
					},
					{
						type: "string",
						label: "Link Text",
						target: "linkText",
					},
				],
			},
		],
		whatMakesUsDifferent: [
			{
				type: "string",
				label: "Section Title",
				target: "title",
			},
			{
				type: "arrayItems",
				label: "Items",
				target: "items",
				fields: [
					{
						type: "string",
						label: "Item Title",
						target: "title",
					},
					{
						type: "string",
						label: "Description",
						target: "description",
						multiline: true,
					},
				],
			},
		],
	},
	"signature-voyage": {
		hero: [
			{
				type: "string",
				label: "Title",
				target: "title",
			},
			{
				type: "string",
				label: "Description",
				target: "description",
			},
			{
				type: "image",
				label: "Background Image",
				target: "background",
			},
		],
		topDestinations: [
			{
				type: "string",
				label: "Title",
				target: "title",
			},
			{
				type: "string",
				label: "Subtitle",
				target: "subtitle",
				multiline: true,
			},
			{
				type: "arrayItems",
				label: "Destinations",
				target: "destinations",
				fields: [
					{
						type: "string",
						label: "Title",
						target: "title",
					},
					{
						type: "string",
						label: "Subtitle",
						target: "subtitle",
					},
					{
						type: "string",
						label: "Description",
						target: "description",
						multiline: true,
					},
					{
						type: "image",
						label: "Image",
						target: "image",
					},
				],
			},
		],
		exclusiveExperiences: [
			{
				type: "string",
				label: "Title",
				target: "title",
			},
			{
				type: "arrayItems",
				label: "Experiences",
				target: "experiences",
				fields: [
					{
						type: "string",
						label: "Title",
						target: "title",
					},
					{
						type: "string",
						label: "Description",
						target: "description",
						multiline: true,
					},
					{
						type: "image",
						label: "Image",
						target: "image",
					},
				],
			},
		],
	},
} as const;
