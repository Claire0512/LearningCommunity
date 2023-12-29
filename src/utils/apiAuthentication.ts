import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next"

export const getSessionUserId: () => Promise<number|null> = async () => {
    const session = await getServerSession(authOptions)
    if (!session) return null;
    return session.user.userId || null;
}