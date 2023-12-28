import { NextResponse, type NextRequest } from 'next/server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { isSameDateInUTC8 } from '@/lib/utils';

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
	const userId = parseInt(params.userId);

	try {
		const updatedUsers = await db.transaction(async (tx) => {
			const [user] = await tx
				.select({
					lastSigned: usersTable.lastSigned,
					points: usersTable.points,
				})
				.from(usersTable)
				.where(eq(usersTable.userId, userId));

			if (!user) return;
			if (!user.points) user.points = 0;

			const currentDate = new Date();
			//
			// currentDate.setDate(currentDate.getDate() - 1);
			if (isSameDateInUTC8(user.lastSigned as Date, currentDate)) {
				tx.rollback();
				return;
			}

			const results = await tx
				.update(usersTable)
				.set({
					lastSigned: currentDate,
					points: user.points + 1,
				})
				.where(eq(usersTable.userId, userId))
				.returning({
					userId: usersTable.userId,
					lastSigned: usersTable.lastSigned,
				});
			return results;
		});
		if (!updatedUsers) {
			return NextResponse.json({ error: 'User Not Found' }, { status: 404 });
		}
	} catch (error) {
		return NextResponse.json({ error: 'Already Signed!' }, { status: 400 });
	}
	return NextResponse.json({ success: true }, { status: 200 });
}
