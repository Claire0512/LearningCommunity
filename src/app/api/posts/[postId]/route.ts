import { NextResponse, type NextRequest } from 'next/server';

import { z } from 'zod';

import { db } from '@/db';

const GetRequestSchema = z.object({
	postId: z.string().min(1),
});

const ReplySchema = z.object({
	commentId: z.number().min(1),
	commenterId: z.number().min(1),
	parentCommentId: z.number().min(1),
	text: z.string().min(1),
	createdAt: z.date(),
	isHelpful: z.boolean(),
	upvotes: z.array(
		z.object({
			userId: z.number().min(1),
		}),
	),
	downvotes: z.array(
		z.object({
			userId: z.number().min(1),
		}),
	),
	user: z.object({
		userId: z.number().min(1),
		name: z.string().min(1),
		profilePicture: z.string().nullable(),
	}),
});

const CommentSchema = z.object({
	commentId: z.number().min(1),
	commenterId: z.number().min(1),
	postId: z.number().min(1),
	text: z.string().min(1),
	createdAt: z.date(),
	isHelpful: z.boolean(),
	upvotes: z.array(
		z.object({
			userId: z.number().min(1),
		}),
	),
	downvotes: z.array(
		z.object({
			userId: z.number().min(1),
		}),
	),
	user: z.object({
		userId: z.number().min(1),
		name: z.string().min(1),
		profilePicture: z.string().nullable(),
	}),
	replies: z.array(ReplySchema),
});

const GetResponseSchema = z.object({
	postId: z.number().min(1),
	postTitle: z.string(),
	postContext: z.string().min(1),
	posterId: z.number(),
	postImage: z.string().nullable(),
	createdAt: z.date(),
	user: z.object({
		userId: z.number().min(1),
		name: z.string().min(1),
		profilePicture: z.string().nullable(),
	}),
	tags: z.array(
		z.object({
			tag: z.object({
				name: z.string(),
			}),
		}),
	),
	upvotes: z.array(
		z.object({
			userId: z.number().min(1),
		}),
	),
	downvotes: z.array(
		z.object({
			userId: z.number().min(1),
		}),
	),
	favorites: z.array(
		z.object({
			userId: z.number().min(1),
		}),
	),
	comments: z.array(CommentSchema),
});

type GetRequest = z.infer<typeof GetRequestSchema>;
type GetResponse = z.infer<typeof GetResponseSchema>;
export async function GET(req: NextRequest, { params }: { params: GetRequest }) {
	const postId = parseInt(params.postId);
	const searchParams = req.nextUrl.searchParams;
	const userId = parseInt(searchParams.get('userId') || '');

	if (!postId) {
		return NextResponse.json({ error: 'Post id invalid' }, { status: 400 });
	}

	const postDetail = await db.query.postsTable.findFirst({
		with: {
			user: {
				columns: {
					userId: true,
					name: true,
					profilePicture: true,
				},
			},
			tags: {
				columns: {},
				with: {
					tag: {
						columns: {
							name: true,
						},
					},
				},
			},
			upvotes: {
				columns: {
					userId: true,
				},
			},
			downvotes: {
				columns: {
					userId: true,
				},
			},
			favorites: {
				columns: {
					userId: true,
				},
			},
			comments: {
				with: {
					user: {
						columns: {
							userId: true,
							name: true,
							profilePicture: true,
						},
					},
					replies: {
						with: {
							user: true,
							upvotes: true,
							downvotes: true,
						},
					},
					upvotes: true,
					downvotes: true,
				},
			},
		},
		where: (post, { eq }) => eq(post.postId, postId),
	});

	if (!postDetail) {
		return NextResponse.json({ error: 'Post not found' }, { status: 404 });
	}

	console.log(postDetail);

	try {
		GetResponseSchema.parse(postDetail);
	} catch (err) {
		console.log('Error parsing response in api/posts/[postId]/route.ts');
		console.log(err);
		return NextResponse.json({ error: 'Server Error' }, { status: 500 });
	}

	const parsedDetail = postDetail as unknown as GetResponse;

	const data = {
		postId: parsedDetail.postId,
		postTitle: parsedDetail.postTitle,
		postContext: parsedDetail.postContext,
		posterId: parsedDetail.posterId,
		posterName: parsedDetail.user.name,
		profilePicture: parsedDetail.user.profilePicture,
		tags: parsedDetail.tags.map((singleTag) => {
			return singleTag.tag.name;
		}),
		createdAt: parsedDetail.createdAt,
		upvotes: parsedDetail.upvotes.length,
		hasUpvote: parsedDetail.upvotes.some((upvote) => upvote.userId === userId),
		downvotes: parsedDetail.downvotes.length,
		hasDownvote: parsedDetail.downvotes.some((downvote) => downvote.userId === userId),
		favorites: parsedDetail.favorites.length,
		hasFavorite: parsedDetail.favorites.some((favorite) => favorite.userId === userId),
		commentsCount: parsedDetail.comments.length,
		hasComment: parsedDetail.comments.some((comment) => {
			if (comment.commenterId === userId) return true;
			comment.replies.forEach((reply) => {
				if (reply.commenterId === userId) return true;
			});
			return false;
		}),
		comments: parsedDetail.comments.map((comment) => ({
			commentId: comment.commentId,
			commenterId: comment.commenterId,
			commenterName: comment.user.name,
			commenterProfilePicture: comment.user.profilePicture,
			text: comment.text,
			upvotes: comment.upvotes.length,
			isHelpful: comment.isHelpful,
			hasUpvote: comment.upvotes.some((upvote) => upvote.userId === userId),
			downvotes: comment.downvotes.length,
			hasDownvote: comment.downvotes.some((downvote) => downvote.userId === userId),
			createdAt: comment.createdAt,
			replies: comment.replies.map((reply) => ({
				commentId: reply.commentId,
				commenterId: reply.commenterId,
				commenterName: reply.user.name,
				commenterProfilePicture: reply.user.profilePicture,
				text: reply.text,
				isHelpful: reply.isHelpful,
				upvotes: reply.upvotes.length,
				hasUpvote: reply.upvotes.some((upvote) => upvote.userId === userId),
				downvotes: reply.downvotes.length,
				hasDownvote: reply.downvotes.some((downvote) => downvote.userId === userId),
				createdAt: reply.createdAt,
			})),
		})),
	};

	console.log(data);
	return NextResponse.json(data, { status: 200 });
}
