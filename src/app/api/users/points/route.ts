import { NextResponse, type NextRequest } from 'next/server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { usersTable } from '@/db/schema';

const PutRequestSchema = z.object({
	userId: z.number().min(1),
	pointsDiff: z.number()
});

type PutRequestType = z.infer<typeof PutRequestSchema>;

export async function PUT(req: NextRequest) {

	const data = await req.json();

	try {
		PutRequestSchema.parse(data);
	} catch (error) {
		console.log('Error parsing request in api/users/points/route.ts');
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	const newUser = data as PutRequestType;

	const updatedUsers = await db
		.update(usersTable)
		.set(newUser)
		.where(eq(usersTable.userId, data.userId))
		.returning();

	if (updatedUsers.length !== 1) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}

	const updatedUser = updatedUsers[0];
	return NextResponse.json(updatedUser, { status: 200 });
}
