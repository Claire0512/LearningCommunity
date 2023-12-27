import { NextResponse, type NextRequest } from 'next/server';

import { sql, eq, desc } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import {
	postsTable,
	usersTable,
	commentsTable,
	favoritesTable,
	upvotesTable,
	downvotesTable,
} from '@/db/schema';

const GetResponseSchema = z.array(
	z.object({
		postId: z.number().min(1),
		postTitle: z.string(),
		postContext: z.string().min(1),
		posterId: z.number(),
		upvotes: z.number(),
		downvotes: z.number(),
		commentsCount: z.number(),
		favorites: z.number(),
		tags: z.array(z.string()),
	}),
);

type GetResponse = z.infer<typeof GetResponseSchema>;

export async function GET(req: NextRequest) {
	const upvotesSubQuery = db
		.select({
			postId: upvotesTable.postId,
			upvotesCount: sql<number>`cast(count(*) as int)`.as('upvotes'),
		})
		.from(upvotesTable)
		.groupBy(upvotesTable.postId)
		.as('upvotesSubQuery');

	const downvotesSubQuery = db
		.select({
			postId: downvotesTable.postId,
			downvotesCount: sql<number>`cast(count(*) as int)`.as('downvotesCount'),
		})
		.from(downvotesTable)
		.groupBy(downvotesTable.postId)
		.as('downvotesSubQuery');

	const commentsSubQuery = db
		.select({
			postId: commentsTable.postId,
			commentsCount: sql<number>`cast(count(*) as int)`.as('commentsCount'),
		})
		.from(commentsTable)
		.groupBy(commentsTable.postId)
		.as('commentsSubQuery');

	const favoritesSubQuery = db
		.select({
			postId: favoritesTable.postId,
			favoritesCount: sql<number>`cast(count(*) as int)`.as('favoritesCount'),
		})
		.from(favoritesTable)
		.groupBy(favoritesTable.postId)
		.as('favoritesSubQuery');

	const postDetails = db
		.select({
			postId: postsTable.postId,
			postTitle: postsTable.postTitle,
			postContext: postsTable.postContext,
			posterId: postsTable.posterId,
			createdAt: postsTable.createdAt,
			posterName: usersTable.name,
			profilePicture: usersTable.profilePicture,
			upvotes: upvotesSubQuery.upvotesCount,
			downvotes: downvotesSubQuery.downvotesCount,
			commentsCount: commentsSubQuery.commentsCount,
			favorites: favoritesSubQuery.favoritesCount,
		})
		.from(postsTable)
		.leftJoin(upvotesSubQuery, eq(upvotesSubQuery.postId, postsTable.postId))
		.leftJoin(downvotesSubQuery, eq(downvotesSubQuery.postId, postsTable.postId))
		.leftJoin(commentsSubQuery, eq(commentsSubQuery.postId, postsTable.postId))
		.leftJoin(favoritesSubQuery, eq(favoritesSubQuery.postId, postsTable.postId))
		.leftJoin(usersTable, eq(usersTable.userId, postsTable.posterId))
		.orderBy(desc(postsTable.createdAt));

	const postTags = db.query.postsTable.findMany({
		columns: {
			postId: true,
		},
		with: {
			tags: {
				with: {
					tag: {
						columns: {
							name: true,
						},
					},
				},
			},
		},
		orderBy: [desc(postsTable.createdAt)],
	});

	const [details, allTags] = await Promise.all([postDetails, postTags]);
	const combined = details.map((detail, index) => ({
		...detail,
		upvotes: detail.upvotes ? detail.upvotes : 0,
		downvotes: detail.downvotes ? detail.downvotes : 0,
		favorites: detail.favorites ? detail.favorites : 0,
		commentsCount: detail.commentsCount ? detail.commentsCount : 0,
		tags: allTags[index].tags.map((singleTag) => {
			return singleTag.tag.name;
		}),
	}));

	try {
		GetResponseSchema.parse(combined);
	} catch (error) {
		console.log('Error parsing response in api/posts/route.ts', error);
		return NextResponse.json({ error: 'Server Error' }, { status: 500 });
	}

	const sorted = combined.sort((a, b) => {
		const popularityA = a.upvotes + a.downvotes + a.favorites;
		const popularityB = b.upvotes + b.downvotes + b.favorites;
		return popularityB - popularityA;
	});

	const data = sorted.slice(0, 3);

	return NextResponse.json(data, { status: 200 });
}
