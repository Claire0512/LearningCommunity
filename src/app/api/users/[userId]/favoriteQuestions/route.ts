import { NextResponse, type NextRequest } from 'next/server';

import { z } from 'zod';
import { db } from '@/db';

const GetRequestSchema = z.number().min(1);

const GetResponseSchema = z.array(z.object({
    questionId: z.number().min(1),
    questionTitle: z.string().min(1),
    questionContext: z.string(),
    questionerId: z.number(),
    isSolved: z.boolean(),
    user: z.object({
        name: z.string(),
        profilePicture: z.string().optional(),
    }),
    upvotes: z.array(z.object({
        userId: z.number().min(1),
    })),
    comments: z.array(z.object({
        commenterId: z.number().min(1),
    })),
    favorites: z.array(z.object({
        userId: z.number().min(1),
    })),
    tags: z.array(z.object({
        name: z.string()
    }))
}))

type GetResponse = z.infer<typeof GetResponseSchema>;

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
	const userId = parseInt(params.userId);
	try {
		GetRequestSchema.parse(userId);
	} catch (error) {
		console.log('Error parsing request in api/sign-up/route.ts');
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	const user = await db.query.usersTable.findFirst({
        columns: {},
        with: {
            favorites: {
                with: {
                    questions: {
                        with: {
                            tags: true,
                            user: true,
                            upvotes: true,
                            favorites: true,
                            comments: {
                                fields: {
                                    commenterId: true,
                                }
                            }
                        }
                    }        
                }
            }
        },
		where: (user, { eq }) => eq(user.userId, userId),
	});

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}

    const rawQuestions = user.favorites.map(favorite => favorite.post).filter(post => post !== null);;

    try {
        GetResponseSchema.parse(rawQuestions);
    } catch (error) {
        console.log('Error parsing response in api/users/[userId]/questions/route.ts');
        return NextResponse.json({ error: 'Invalid response' }, { status: 500 });
    }

    const parsedQuestions = rawQuestions as GetResponse

    const questions = parsedQuestions.map((question) => ({
        questionId: question.questionId,
        questionTitle: question.questionTitle,
        questionContext: question.questionContext,
        questionerId: question.questionerId,
        profilePicture: question.user.profilePicture,
        questionerName: question.user.name,
        upvotes: question.upvotes.length,
        favorites: question.favorites.length,
        commentsCount: question.comments.length,
        tags: question.tags.map((tag: { name: string; }) => tag.name)
    }));

	return NextResponse.json(questions, { status: 200 });
}