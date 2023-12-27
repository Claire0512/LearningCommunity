import { NextResponse, type NextRequest } from 'next/server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { usersTable } from '@/db/schema';

const GetRequestSchema = z.number().min(1);

const GetResponseSchema = z.object({
	userId: z.number(),
	name: z.string(),
	email: z.string(),
	profilePicture: z.string().optional().nullable(),
	points: z.number(),
	posts: z.array(z.object({
		upvotes: z.array(z.object({
			userId: z.number(),
		})),
		downvotes: z.array(z.object({
			userId: z.number(),
		})),
		favorites: z.array(z.object({
			userId: z.number(),
		})),
	})),
	questions: z.array(z.object({
		upvotes: z.array(z.object({
			userId: z.number(),
		})),
		favorites: z.array(z.object({
			userId: z.number(),
		})),
	})),
	comments: z.array(z.object({
		upvotes: z.array(z.object({
			userId: z.number(),
		})),
		downvotes: z.array(z.object({
			userId: z.number(),
		})),
		isHelpful: z.boolean()
	}))
})

const PutRequestSchema = z.object({
	userId: z.number().min(1),
	name: z.string().min(1),
	email: z.string().email().min(1),
	profilePicture: z.string().optional(),
	resumeFile: z.string().optional(),
});

type GetResponseType = z.infer<typeof GetResponseSchema>;

type PutRequestType = z.infer<typeof PutRequestSchema>;

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
	const userId = parseInt(params.userId);
	try {
		GetRequestSchema.parse(userId);
	} catch (error) {
		console.log('Error parsing request in api/sign-up/route.ts');
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	const user = await db.query.usersTable.findFirst({
		where: (user, { eq }) => eq(user.userId, userId),
		columns: {
			password: false
		},
		with: {
			posts: {
				columns: {},
				with: {
					upvotes: {
						columns: {
							userId: true
						}
					},
					downvotes: {
						columns: {
							userId: true
						}
					},
					favorites: {
						columns: {
							userId: true
						}
					},
				}
			},
			questions: {
				columns: {},
				with: {
					upvotes: {
						columns: {
							userId: true
						}
					},
					favorites: {
						columns: {
							userId: true
						}
					},
				}
			},
			comments: {
				columns: {
					isHelpful: true
				},
				with: {
					upvotes: {
						columns: {
							userId: true
						}
					},
					downvotes: {
						columns: {
							userId: true
						}
					},
				}
			}
		}
	});
	
	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}

	console.log(user);

	try {
		GetResponseSchema.parse(user);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: 'Server fetch error' }, { status: 500 });
	}

	const parsedUser = user as unknown as GetResponseType;

	const aggUser = {
		userId: parsedUser.userId,
        name: parsedUser.name,
        email: parsedUser.email,
        profilePicture: parsedUser.profilePicture,
        points: parsedUser.points,
		upvotes: 0,
		downvotes: 0,
		hearts: 0,
		favorites: 0,
		checkmarks: 0,
	}

	parsedUser.posts.forEach(post => {
		aggUser.upvotes += post.upvotes.length;
        aggUser.downvotes += post.downvotes.length;
        aggUser.favorites += post.favorites.length;
	})

	parsedUser.questions.forEach(question => {
		aggUser.hearts += question.upvotes.length;
        aggUser.favorites += question.favorites.length;
	})

	parsedUser.comments.forEach(comment => {
		aggUser.upvotes += comment.upvotes.length;
		aggUser.downvotes += comment.downvotes.length;
		aggUser.checkmarks += (comment.isHelpful === true) ? 1 : 0;
	})

	return NextResponse.json(aggUser, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
	const userId = parseInt(params.userId);
	try {
		GetRequestSchema.parse(userId);
	} catch (error) {
		console.log('Error parsing request in api/sign-up/route.ts');
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	const data = await req.json();

	try {
		PutRequestSchema.parse(data);
	} catch (error) {
		console.log('Error parsing request in api/sign-up/route.ts');
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	const newUser = data as PutRequestType;

	const updatedUsers = await db
		.update(usersTable)
		.set(newUser)
		.where(eq(usersTable.userId, userId))
		.returning();

	if (!updatedUsers) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}

	const updatedUser = updatedUsers[0];
	return NextResponse.json(updatedUser, { status: 200 });
}
