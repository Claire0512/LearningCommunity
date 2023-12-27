import { NextResponse, type NextRequest } from 'next/server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { usersTable } from '@/db/schema';

const GetRequestSchema = z.number().min(1);

const PutRequestSchema = z.object({
	userId: z.number().min(1),
	name: z.string().min(1),
	email: z.string().email().min(1),
	profilePicture: z.string().optional(),
	resumeFile: z.string().optional(),
});

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
	});

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}
	return NextResponse.json(user, { status: 200 });
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
