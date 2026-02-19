"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Mark } from "@tiptap/core";
import { useState } from "react";
import "@tiptap/core";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		fontSize: {
			setFontSize: (fontSize: string) => ReturnType;
			unsetFontSize: () => ReturnType;
		};
	}
}
import {
	Bold,
	Italic,
	Strikethrough,
	Code as CodeIcon,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
	Undo,
	Redo,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
} from "lucide-react";

// Custom FontSize Mark Extension
const FontSizeMark = Mark.create({
	name: "fontSize",
	addAttributes() {
		return {
			fontSize: {
				default: null,
				parseHTML: (element) => {
					const style = element.getAttribute("style") || "";
					const match = style.match(/font-size:\s*([^;]+)/);
					return match ? match[1].trim() : null;
				},
				renderHTML: (attributes) => {
					if (!attributes.fontSize) {
						return {};
					}
					return {
						style: `font-size: ${attributes.fontSize}`,
					};
				},
			},
		};
	},
	parseHTML() {
		return [
			{
				tag: "span",
				getAttrs: (element) => {
					if (typeof element === "string") return false;
					const style = element.getAttribute("style") || "";
					if (!style.includes("font-size")) return false;
					return {};
				},
			},
		];
	},
	renderHTML({ mark }) {
		const fontSize = mark.attrs.fontSize;
		if (!fontSize) {
			return ["span", {}, 0];
		}
		return [
			"span",
			{
				style: `font-size: ${fontSize}`,
			},
			0,
		];
	},
	addCommands() {
		return {
			setFontSize:
				(fontSize: string) =>
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				({ commands }: any) => {
					return commands.setMark(this.name, { fontSize });
				},
			unsetFontSize:
				() =>
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				({ commands }: any) => {
					return commands.unsetMark(this.name);
				},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any;
	},
});

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export default function RichTextEditor({
	content,
	onChange,
	placeholder = "Enter text content...",
}: RichTextEditorProps) {
	const [updateCount, setUpdateCount] = useState(0);

	const editor = useEditor({
		extensions: [
			StarterKit,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			FontSizeMark,
		],
		content: content,
		immediatelyRender: false,
		onUpdate({ editor }) {
			onChange(editor.getHTML());
			setUpdateCount((prev) => prev + 1);
		},
		onSelectionUpdate({ editor }) {
			setUpdateCount((prev) => prev + 1);
		},
	});

	if (!editor) {
		return null;
	}

	const buttonClass =
		"editor-toolbar-btn" +
		` p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`;
	const activeButtonClass = buttonClass + " bg-blue-100 dark:bg-blue-900/50";

	return (
		<div className="rich-text-editor">
			<div className="editor-toolbar">
				<div className="editor-toolbar-group">
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={
							editor.isActive("bold") ? activeButtonClass : buttonClass
						}
						title="Bold (Ctrl+B)"
					>
						<Bold className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={
							editor.isActive("italic") ? activeButtonClass : buttonClass
						}
						title="Italic (Ctrl+I)"
					>
						<Italic className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().toggleStrike().run()}
						className={
							editor.isActive("strike") ? activeButtonClass : buttonClass
						}
						title="Strikethrough"
					>
						<Strikethrough className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().toggleCode().run()}
						className={
							editor.isActive("code") ? activeButtonClass : buttonClass
						}
						title="Code (Ctrl+`)"
					>
						<CodeIcon className="w-4 h-4" />
					</button>
				</div>

				<div className="editor-toolbar-divider"></div>

				<div className="editor-toolbar-group">
					<button
						type="button"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
						className={
							editor.isActive("heading", { level: 1 })
								? activeButtonClass
								: buttonClass
						}
						title="Heading 1"
					>
						<Heading1 className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						className={
							editor.isActive("heading", { level: 2 })
								? activeButtonClass
								: buttonClass
						}
						title="Heading 2"
					>
						<Heading2 className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						className={
							editor.isActive("heading", { level: 3 })
								? activeButtonClass
								: buttonClass
						}
						title="Heading 3"
					>
						<Heading3 className="w-4 h-4" />
					</button>
				</div>

				<div className="editor-toolbar-divider"></div>

				<div className="editor-toolbar-group">
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={
							editor.isActive("bulletList") ? activeButtonClass : buttonClass
						}
						title="Bullet List"
					>
						<List className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={
							editor.isActive("orderedList") ? activeButtonClass : buttonClass
						}
						title="Ordered List"
					>
						<ListOrdered className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
						className={
							editor.isActive("blockquote") ? activeButtonClass : buttonClass
						}
						title="Blockquote"
					>
						<Quote className="w-4 h-4" />
					</button>
				</div>

				<div className="editor-toolbar-divider"></div>

				<div className="editor-toolbar-group">
					<button
						type="button"
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
						className={
							editor.isActive({ textAlign: "left" })
								? activeButtonClass
								: buttonClass
						}
						title="Align Left"
					>
						<AlignLeft className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
						className={
							editor.isActive({ textAlign: "center" })
								? activeButtonClass
								: buttonClass
						}
						title="Align Center"
					>
						<AlignCenter className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().setTextAlign("right").run()}
						className={
							editor.isActive({ textAlign: "right" })
								? activeButtonClass
								: buttonClass
						}
						title="Align Right"
					>
						<AlignRight className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().setTextAlign("justify").run()}
						className={
							editor.isActive({ textAlign: "justify" })
								? activeButtonClass
								: buttonClass
						}
						title="Align Justify"
					>
						<AlignJustify className="w-4 h-4" />
					</button>
				</div>

				<div className="editor-toolbar-divider"></div>

				<div className="editor-toolbar-group">
					<select
						key={updateCount}
						value={editor.getAttributes("fontSize").fontSize || "default"}
						onChange={(e) => {
							const fontSize = e.target.value;
							if (fontSize === "default") {
								editor.chain().focus().unsetFontSize().run();
							} else {
								editor.chain().focus().setFontSize(fontSize).run();
							}
						}}
						className="px-2 py-2 rounded bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
						title="Font Size"
					>
						<option value="default">Default</option>
						<option value="12px">12px</option>
						<option value="14px">14px</option>
						<option value="16px">16px</option>
						<option value="18px">18px</option>
						<option value="20px">20px</option>
						<option value="24px">24px</option>
						<option value="28px">28px</option>
						<option value="32px">32px</option>
					</select>
				</div>

				<div className="editor-toolbar-divider"></div>

				<div className="editor-toolbar-group">
					<button
						type="button"
						onClick={() => editor.chain().focus().undo().run()}
						className={buttonClass}
						title="Undo (Ctrl+Z)"
						disabled={!editor.can().undo()}
					>
						<Undo className="w-4 h-4" />
					</button>

					<button
						type="button"
						onClick={() => editor.chain().focus().redo().run()}
						className={buttonClass}
						title="Redo (Ctrl+Shift+Z)"
						disabled={!editor.can().redo()}
					>
						<Redo className="w-4 h-4" />
					</button>
				</div>
			</div>

			<EditorContent
				editor={editor}
				className="editor-content"
				data-placeholder={placeholder}
			/>
		</div>
	);
}
