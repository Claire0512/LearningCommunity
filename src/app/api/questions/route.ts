import { NextResponse, type NextRequest } from 'next/server';

import { sql, eq, desc } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import {
	questionsTable,
	usersTable,
	commentsTable,
	favoritesTable,
	upvotesTable,
	tagsTable,
	questionTagsTable,
} from '@/db/schema';

const GetResponseSchema = z.array(
	z.object({
		questionId: z.number().min(1),
		questionTitle: z.string().min(1),
		questionContext: z.string().min(1),
		questionerId: z.number(),
		createdAt: z.date(),
		questionerName: z.string(),
		profilePicture: z.string().optional().nullable(),
		upvotes: z.number().default(0),
		downvotes: z.number().default(0),
		commentsCount: z.number().default(0),
		favorites: z.number().default(0),
		tags: z.array(z.string()),
	}),
);

const questionRequestSchema = z.object({
	questionTitle: z.string().min(1),
	questionContext: z.string().min(1),
	questionerId: z.number(),
	questionImage: z.string().optional(),
	tags: z.array(z.string()),
});

type GetResponse = z.infer<typeof GetResponseSchema>;

type questionRequest = z.infer<typeof questionRequestSchema>;

export async function GET(req: NextRequest) {
	const upvotesSubQuery = db
		.select({
			questionId: upvotesTable.questionId,
			upvotesCount: sql<number>`cast(count(*) as int)`.as('upvotes'),
		})
		.from(upvotesTable)
		.groupBy(upvotesTable.questionId)
		.as('upvotesSubQuery');

	const commentsSubQuery = db
		.select({
			questionId: commentsTable.questionId,
			commentsCount: sql<number>`cast(count(*) as int)`.as('commentsCount'),
		})
		.from(commentsTable)
		.groupBy(commentsTable.questionId)
		.as('commentsSubQuery');

	const favoritesSubQuery = db
		.select({
			questionId: favoritesTable.questionId,
			favoritesCount: sql<number>`cast(count(*) as int)`.as('favoritesCount'),
		})
		.from(favoritesTable)
		.groupBy(favoritesTable.questionId)
		.as('favoritesSubQuery');

	const questionDetails = db
		.select({
			questionId: questionsTable.questionId,
			questionTitle: questionsTable.questionTitle,
			questionContext: questionsTable.questionContext,
			questionerId: questionsTable.questionerId,
			isSolved: questionsTable.isSolved,
			createdAt: questionsTable.createdAt,
			questionerName: usersTable.name,
			profilePicture: usersTable.profilePicture,
			upvotes: upvotesSubQuery.upvotesCount,
			commentsCount: commentsSubQuery.commentsCount,
			favorites: favoritesSubQuery.favoritesCount,
		})
		.from(questionsTable)
		.leftJoin(upvotesSubQuery, eq(upvotesSubQuery.questionId, questionsTable.questionId))
		.leftJoin(commentsSubQuery, eq(commentsSubQuery.questionId, questionsTable.questionId))
		.leftJoin(favoritesSubQuery, eq(favoritesSubQuery.questionId, questionsTable.questionId))
		.leftJoin(usersTable, eq(usersTable.userId, questionsTable.questionerId))
		.orderBy(desc(questionsTable.createdAt));

	const questionTags = db.query.questionsTable.findMany({
		columns: {
			questionId: true,
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
		orderBy: [desc(questionsTable.createdAt)],
	});

	const [details, allTags] = await Promise.all([questionDetails, questionTags]);
	const combined = details.map((detail, index) => ({
		...detail,
		upvotes: detail.upvotes ? detail.upvotes : 0,
		favorites: detail.favorites ? detail.favorites : 0,
		commentsCount: detail.commentsCount ? detail.commentsCount : 0,
		tags: allTags[index].tags.map((singleTag) => {
			return singleTag.tag.name;
		}),
	}));

	try {
		GetResponseSchema.parse(combined);
	} catch (error) {
		console.log('Error parsing response in api/questions/route.ts', error);
		return NextResponse.json({ error: 'Server Error' }, { status: 500 });
	}

	const data = combined;
	return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
	const data = await req.json();
	console.log(data);
	try {
		questionRequestSchema.parse(data);
	} catch (error) {
		console.log('Error parsing request in api/questions/route.ts', error);
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}
	const { tags, ...newQuestion } = data as questionRequest;

	let questionId = -1;
	try {
		const inserted = await db
			.insert(questionsTable)
			.values(newQuestion)
			.returning({ questionId: questionsTable.questionId });
		questionId = inserted[0].questionId;
	} catch (error) {
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	}

	let tagIds: number[] = [];
	async function getTagIds(tags: string[]) {
		const tagPromises = tags.map(async (tag) => {
			const exist = await db.query.tagsTable.findFirst({
				columns: {
					tagId: true,
				},
				where: (tagsTable, { eq }) => eq(tagsTable.name, tag),
			});

			if (exist) {
				return exist.tagId;
			} else {
				const newTag = await db
					.insert(tagsTable)
					.values({ name: tag })
					.returning({ tagId: tagsTable.tagId });
				return newTag[0].tagId;
			}
		});
		return await Promise.all(tagPromises);
	}

	try {
		tagIds = await getTagIds(tags);
	} catch (error) {
		console.log('Failed getting id of tags!');
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	}

	const questionTagIds = tagIds.map((tagId) => ({
		questionId,
		tagId,
	}));

	try {
		if (questionTagIds.length > 0) {
			await db.insert(questionTagsTable).values(questionTagIds);
		}
		return NextResponse.json({ result: 'success' }, { status: 200 });
	} catch (error) {
		console.log('Failed inserting question and tags relationship!', error);
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	}
}
