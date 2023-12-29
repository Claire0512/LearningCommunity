import { NextResponse, type NextRequest } from 'next/server';

import { z } from 'zod';

import { db } from '@/db';
import { tagsTable } from '@/db/schema';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next"

const GetRequestSchema = z.array(z.object({}));

const PostRequestSchema = z.object({
	name: z.string().min(1),
});

type PostRequestType = z.infer<typeof PostRequestSchema>;

export async function GET(req: NextRequest) {
	const result = await db.query.tagsTable.findMany();
	const data = result.map((tag) => tag.name);
	return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const data = await req.json();
	try {
		PostRequestSchema.parse(data);
	} catch (error) {
		console.error('Error parsing request in api/sign-up/route.ts');
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}
	const { name } = data as PostRequestType;

	const tagExists = await db.query.tagsTable.findFirst({
		where: (existTag, { eq }) => eq(existTag.name, name),
	});

	if (tagExists) {
		const tagId = tagExists.tagId;
		return NextResponse.json(tagId, { status: 200 });
	}

	const newTag = await db
		.insert(tagsTable)
		.values({ name })
		.returning({ tagId: tagsTable.tagId });

	if (newTag) {
		const tagId = newTag[0].tagId;
		return NextResponse.json(tagId, { status: 201 });
	} else {
		return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
	}
}
