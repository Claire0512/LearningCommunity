export type PostCardType = {
	postId: number;
	postTitle: string;
	postContext: string;
	posterId: number;
	posterName: string;
	profilePicture: string;
	upvotes: number;
	downvotes: number;
	commentsCount: number;
	favorites: number;
	tags: string[];
	createdAt: string;
};
export type CommentType = {
	commentId: number;
	commenterId: number;
	commenterName: string;
	commenterProfilePicture: string | null | undefined;
	upvotes: number;
	hasUpvote: boolean;
	downvotes: number;
	hasDownvote: boolean;
	text: string;
	isHelpful: boolean;
	createdAt: string;
	replies: ReplyType[];
};
export type ReplyType = Omit<CommentType, 'replies'>;
export type PostCardDetailType = {
	postId: number;
	postTitle: string;
	postContext: string;
	posterId: number;
	posterName: string;
	profilePicture: string | null | undefined;
	tags: string[];
	createdAt: string;
	upvotes: number;
	hasUpvote: boolean;
	downvotes: number;
	hasDownvote: boolean;
	favorites: number;
	hasFavorite: boolean;
	commentsCount: number;
	comments: Comment[];
};
export type NewPostType = {
	postTitle: string;
	postContext: string;
	posterId: number;
	postImage?: string;
	tags: string[];
};

export type NewQuestionType = {
	questionTitle: string;
	questionContext: string;
	questionerId: number;
	questionImage?: string;
	tags: string[];
};

export type QuestionCardType = {
	questionId: number;
	questionTitle: string;
	questionContext: string;
	questionerId: number;
	questionerName: string;
	profilePicture: string;
	upvotes: number;
	commentsCount: number;
	favorites: number;
	isSolved: boolean;
	tags: string[];
	createdAt: string;
};
export type NotificationType = {
	userId: number;
	replierId: number;
	replierName: string;
	postTitle: string;
	questionTitle: null;
	isRead: boolean;
	createdAt: string;
	NotificationId: number;
	postId: number;
	questionId: null;
};

// export type CommentType = {
// 	commentId: number;
// 	commenterId: string;
// 	commenterName: string;
// 	commenterProfilePicture: string;
// 	upvotes: number;
// 	downvotes: number;
// 	hasUpvoted: boolean;
// 	hasDownvoted: boolean;
// 	text: string;
// 	createdAt: string;
// 	replies?: Comment[];
// };
