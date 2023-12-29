import { NextResponse, type NextRequest } from 'next/server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { isSameDateInUTC8 } from '@/lib/utils';
import { getSessionUserId } from '@/utils/apiAuthentication';

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
	const sessionUserId = await getSessionUserId();
	if (!sessionUserId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userId = parseInt(params.userId);

	if (userId !== sessionUserId) {
		return NextResponse.json({ error: 'Wrong endpoints [userId]' }, { status: 401 });
	}

	try {
		const updatedUsers = await db.transaction(async (tx) => {
			const [user] = await tx
				.select({
					lastSigned: usersTable.lastSigned,
					points: usersTable.points,
				})
				.from(usersTable)
				.where(eq(usersTable.userId, sessionUserId));

			if (!user) return;
			if (!user.points) user.points = 0;

			const currentDate = new Date();
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
				.where(eq(usersTable.userId, sessionUserId))
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
