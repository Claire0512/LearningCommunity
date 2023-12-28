import { NextResponse, type NextRequest } from 'next/server';

import { z } from 'zod';

import { db } from '@/db';
import { commentsTable } from '@/db/schema';

const PostRequestSchema = z.object({
	postId: z.number().optional(),
	questionId: z.number().optional(),
	parentCommentId: z.number().optional(),
	commenterId: z.number().min(1),
	text: z.string().min(1),
});

type PostRequestType = z.infer<typeof PostRequestSchema>;

export async function POST(req: NextRequest) {
	const data = await req.json();
	try {
		PostRequestSchema.parse(data);
	} catch (error) {
		console.error('Error parsing request in api/comments/route.ts');
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}
	const newComment = data as PostRequestType;

	if (!newComment.postId && !newComment.questionId && !newComment.parentCommentId) {
		return NextResponse.json(
			{ error: 'No parent specified in api/comments/route.ts' },
			{ status: 400 },
		);
	}

	try {
		await db
			.insert(commentsTable)
			.values(newComment)
			.returning({ commentId: commentsTable.commentId });
		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	}
}
