"use client";

import { useState, useRef } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { Copy, Check, Wand2 } from "lucide-react";
import prettier from "prettier";
import parserHtml from "prettier/parser-html";

interface CodeEditorProps {
	id: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export default function CodeEditor({
	id,
	value,
	onChange,
	placeholder = "Embed code (HTML/iframe)",
}: CodeEditorProps) {
	const [isCopied, setIsCopied] = useState(false);
	const [isFormatting, setIsFormatting] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const handleFormat = async () => {
		try {
			setIsFormatting(true);
			const formatted = await prettier.format(value, {
				parser: "html",
				plugins: [parserHtml],
				htmlWhitespaceSensitivity: "css",
				tabWidth: 2,
				trailingComma: "es5",
			});
			onChange(formatted.trim());
		} catch (err) {
			console.error("Failed to format:", err);
			alert("Format gagal. Pastikan HTML valid.");
		} finally {
			setIsFormatting(false);
		}
	};

	// Detect language (simple detection)
	const getLanguage = () => {
		if (value.includes("<iframe")) {
			return "html";
		}
		if (value.trim().startsWith("<")) {
			return "html";
		}
		return "xml";
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label
					htmlFor={id}
					className="block text-xs font-medium text-gray-700 dark:text-gray-300"
				>
					HTML/Embed Code
				</label>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handleFormat}
						disabled={isFormatting || !value.trim()}
						className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
						title="Format code"
					>
						<Wand2 className="w-3 h-3" />
						<span>Format</span>
					</button>
					<button
						type="button"
						onClick={handleCopy}
						disabled={!value.trim()}
						className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
						title="Copy code"
					>
						{isCopied ? (
							<>
								<Check className="w-3 h-3" />
								<span>Copied</span>
							</>
						) : (
							<>
								<Copy className="w-3 h-3" />
								<span>Copy</span>
							</>
						)}
					</button>
				</div>
			</div>

			<div className="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-[#1e1e1e]">
				{/* Syntax Highlighter Preview */}
				{value.trim() && (
					<div className="relative">
						<SyntaxHighlighter
							language={getLanguage()}
							style={atomOneDark}
							customStyle={{
								margin: 0,
								padding: "12px",
								backgroundColor: "transparent",
								fontSize: "13px",
								lineHeight: "1.5",
								minHeight: "200px",
								maxHeight: "400px",
								overflow: "auto",
							}}
							wrapLongLines={true}
						>
							{value}
						</SyntaxHighlighter>
						{/* Textarea overlay */}
						<textarea
							ref={textareaRef}
							id={id}
							value={value}
							onChange={(e) => onChange(e.target.value)}
							placeholder={placeholder}
							className="absolute inset-0 w-full h-full opacity-0 resize-none focus:outline-none cursor-text font-mono text-sm"
							style={{
								minHeight: "200px",
							}}
							spellCheck="false"
						/>
					</div>
				)}

				{/* Show textarea when empty */}
				{!value.trim() && (
					<textarea
						ref={textareaRef}
						id={id}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						className="w-full p-3 font-mono text-sm bg-transparent text-gray-700 dark:text-gray-300 resize-none focus:outline-none"
						style={{
							minHeight: "200px",
						}}
						spellCheck="false"
					/>
				)}
			</div>

			<div className="text-xs text-gray-500 dark:text-gray-400">
				{value.length} characters
				{value.trim() && (
					<>
						{" • "}
						{value.split("\n").length} lines
					</>
				)}
			</div>
		</div>
	);
}
