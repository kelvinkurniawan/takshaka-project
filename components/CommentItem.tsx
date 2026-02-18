"use client";

import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";

interface Reply {
	id: number;
	commentId: number;
	name: string;
	email: string;
	content: string;
	status: string;
	createdAt: string;
}

interface CommentItemProps {
	id: number;
	name: string;
	content: string;
	createdAt: string;
	onReplySuccess?: () => void;
}

export default function CommentItem({
	id,
	name,
	content,
	createdAt,
	onReplySuccess,
}: CommentItemProps) {
	const [replies, setReplies] = useState<Reply[]>([]);
	const [loadingReplies, setLoadingReplies] = useState(false);
	const [showReplyForm, setShowReplyForm] = useState(false);

	const fetchReplies = async () => {
		try {
			setLoadingReplies(true);
			const response = await fetch(`/api/comments/${id}`);
			const data = await response.json();
			setReplies(data.data || []);
		} catch (error) {
			console.error("Failed to fetch replies:", error);
		} finally {
			setLoadingReplies(false);
		}
	};

	useEffect(() => {
		fetchReplies();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleReplySuccess = () => {
		fetchReplies();
		setShowReplyForm(false);
		if (onReplySuccess) {
			onReplySuccess();
		}
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="border-l-4 border-primary pl-6 py-4">
			{/* Comment Header */}
			<div className="flex items-start gap-4 mb-4">
				<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span className="text-sm font-semibold text-primary">
						{getInitials(name)}
					</span>
				</div>
				<div className="flex-1">
					<h4 className="font-semibold text-gray-900">{name}</h4>
					<p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
				</div>
			</div>

			{/* Comment Content */}
			<p className="text-gray-700 mb-4 leading-relaxed">{content}</p>

			{/* Reply Button */}
			<button
				onClick={() => setShowReplyForm(!showReplyForm)}
				className="text-primary font-medium hover:underline mb-4 text-sm"
			>
				{showReplyForm ? "Batal" : "Balas"}
			</button>

			{/* Reply Form */}
			{showReplyForm && (
				<div className="bg-gray-50 p-4 rounded-lg mb-4">
					<CommentForm
						contentId={0}
						parentCommentId={id}
						isReply={true}
						onSuccess={handleReplySuccess}
					/>
				</div>
			)}

			{/* Replies */}
			{replies.length > 0 && (
				<div className="space-y-4 mt-4">
					<p className="text-sm font-medium text-gray-600">
						{replies.length} {replies.length === 1 ? "Balasan" : "Balasan"}
					</p>
					{replies.map((reply) => (
						<div
							key={reply.id}
							className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary/50"
						>
							{/* Reply Header */}
							<div className="flex items-start gap-3 mb-3">
								<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
									<span className="text-xs font-semibold text-primary">
										{getInitials(reply.name)}
									</span>
								</div>
								<div className="flex-1">
									<h5 className="font-medium text-gray-900 text-sm">
										{reply.name}
									</h5>
									<p className="text-xs text-gray-500">
										{formatDate(reply.createdAt)}
									</p>
								</div>
							</div>

							{/* Reply Content */}
							<p className="text-gray-700 text-sm leading-relaxed">
								{reply.content}
							</p>
						</div>
					))}
				</div>
			)}

			{/* Loading Replies */}
			{loadingReplies && (
				<div className="text-sm text-gray-500 italic">Memuat balasan...</div>
			)}
		</div>
	);
}
