import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";

import { 
    postsTable, 
    usersTable, 
    commentsTable, 
    favoritesTable, 
    upvotesTable,
    downvotesTable
} from "@/db/schema";
import { sql, eq, desc } from "drizzle-orm";

const GetRequestSchema = z.number().min(1)

const GetResponseSchema = z.array(z.object({
    postId: z.number().min(1),
    postTitle: z.string(),
    postContext: z.string().min(1),
    posterId: z.number(),
    upvotes: z.number(),
    downvotes: z.number(),
    commentsCount: z.number(),
    favorites: z.number(),
    tags: z.array(z.string())
}))

type GetRequest = z.infer<typeof GetRequestSchema>;

type GetResponse = z.infer<typeof GetResponseSchema>;

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const pageNumber = parseInt(params.get('pageNumber') || '');

    try {
        GetRequestSchema.parse(pageNumber);
    } 
    catch(error) {
        console.log("Error parsing request in api/posts/route.ts")
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const upvotesSubQuery = db.select({
        postId: upvotesTable.postId,
        upvotesCount: sql<number>`cast(count(*) as int)`.as('upvotes'),
    })
    .from(upvotesTable)
    .groupBy(upvotesTable.postId)
    .as('upvotesSubQuery');
    
    const downvotesSubQuery = db.select({
        postId: downvotesTable.postId,
        downvotesCount: sql<number>`cast(count(*) as int)`.as('downvotesCount'),
    })
    .from(downvotesTable)
    .groupBy(downvotesTable.postId)
    .as('downvotesSubQuery');

    const commentsSubQuery = db.select({
        postId: commentsTable.postId,
        commentsCount: sql<number>`cast(count(*) as int)`.as('commentsCount')
    })
    .from(commentsTable)
    .groupBy(commentsTable.postId)
    .as('commentsSubQuery');

    const favoritesSubQuery = db.select({
        postId: favoritesTable.postId,
        favoritesCount: sql<number>`cast(count(*) as int)`.as('favoritesCount')
    })
    .from(favoritesTable)
    .groupBy(favoritesTable.postId)
    .as('favoritesSubQuery');

    
    const postDetails = db.select({
        postId: postsTable.postId,
        postTitle: postsTable.title,
        postContext: postsTable.context,
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
    .orderBy(desc(postsTable.createdAt))
    
    const postTags = db.query.postsTable.findMany({
        columns: {
            postId: true,
        },
        with: {
            tags: true
        },
        orderBy: [desc(postsTable.createdAt)],
    })

    const [details, allTags] = await Promise.all([postDetails, postTags]);

    const combined = details.map((detail, index) => ({
        ...detail,
        tags: allTags[index].tags
    }))

    try {
        GetResponseSchema.parse(combined);
    }
    catch (error) {
        console.log("Error parsing response in api/posts/route.ts")
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }

    const data = combined;
    return NextResponse.json(data, { status: 200 });
}
