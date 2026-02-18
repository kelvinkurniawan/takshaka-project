"use client";

import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface Comment {
	id: number;
	contentId: number;
	name: string;
	email: string;
	content: string;
	status: string;
	createdAt: string;
}

interface CommentsListProps {
	contentId: number;
}

export default function CommentsList({ contentId }: CommentsListProps) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [limit] = useState(20);
	const [offset, setOffset] = useState(0);

	const fetchComments = async (off: number = 0) => {
		try {
			setLoading(true);
			const response = await fetch(
				`/api/comments?contentId=${contentId}&limit=${limit}&offset=${off}`,
			);
			const data = await response.json();
			setComments(data.data || []);
			setTotal(data.total || 0);
			setOffset(off);
		} catch (error) {
			console.error("Failed to fetch comments:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchComments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentId]);

	const handleCommentSuccess = () => {
		fetchComments(0);
	};

	const hasNextPage = offset + limit < total;
	const hasPrevPage = offset > 0;

	return (
		<section className="max-w-3xl mx-auto px-4 py-12">
			{/* Comments Section Header */}
			<h2 className="text-3xl font-bold mb-8">Komentar</h2>

			{/* Comment Form */}
			<div className="bg-gray-50 p-8 rounded-lg mb-12 border border-gray-200">
				<h3 className="text-lg font-semibold mb-6">Tinggalkan Komentar</h3>
				<CommentForm contentId={contentId} onSuccess={handleCommentSuccess} />
			</div>

			{/* Comments Count */}
			<div className="mb-8">
				<p className="text-gray-600">
					{total === 0 ? "Belum ada komentar" : `${total} komentar`}
				</p>
			</div>

			{/* Comments List */}
			{loading ? (
				<div className="text-center py-12">
					<p className="text-gray-500">Memuat komentar...</p>
				</div>
			) : comments.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-gray-500">
						Jadilah yang pertama memberikan komentar
					</p>
				</div>
			) : (
				<>
					<div className="space-y-8 mb-8">
						{comments.map((comment) => (
							<CommentItem
								key={comment.id}
								id={comment.id}
								name={comment.name}
								content={comment.content}
								createdAt={comment.createdAt}
								onReplySuccess={handleCommentSuccess}
							/>
						))}
					</div>

					{/* Pagination */}
					{(hasNextPage || hasPrevPage) && (
						<div className="flex justify-between items-center mt-8 pt-8 border-t">
							<button
								onClick={() => fetchComments(offset - limit)}
								disabled={!hasPrevPage}
								className="px-4 py-2 bg-primary text-white rounded-lg disabled:bg-gray-300 hover:bg-primary/90 transition"
							>
								← Sebelumnya
							</button>

							<span className="text-sm text-gray-600">
								{offset + 1} - {Math.min(offset + limit, total)} dari {total}
							</span>

							<button
								onClick={() => fetchComments(offset + limit)}
								disabled={!hasNextPage}
								className="px-4 py-2 bg-primary text-white rounded-lg disabled:bg-gray-300 hover:bg-primary/90 transition"
							>
								Selanjutnya →
							</button>
						</div>
					)}
				</>
			)}

			{/* Security Notice */}
			<div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
				<p className="font-medium mb-2">💡 Catatan Keamanan</p>
				<ul className="list-disc list-inside space-y-1 text-xs">
					<li>Komentar Anda akan dimoderasi sebelum ditampilkan</li>
					<li>Jangan bagikan informasi pribadi atau data sensitif</li>
					<li>Komentar spam atau tidak pantas akan dihapus</li>
					<li>
						Kami menggunakan sistem deteksi spam untuk menjaga kualitas komentar
					</li>
				</ul>
			</div>
		</section>
	);
}
