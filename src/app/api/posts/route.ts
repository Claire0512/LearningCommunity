import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { postsTable, usersTable, tagsTable, postTagsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const getSchema = z.object({
    pageNumber: z.number().min(1),
});

type GetRequest = z.infer<typeof getSchema>;

export async function GET(req: NextRequest, { params }: { params: GetRequest }) {
    
    const postDetails = await db.select({
        postId: postsTable.post_id,
        postTitle: postsTable.title,
        postContext: postsTable.context,
        posterId: usersTable.user_id,
        profilePicture: usersTable.profile_picture,
        total_upvotes: postsTable.total_upvotes,
        total_downvotes: postsTable.total_downvotes,
        total_comments: postsTable.total_comments,
        total_favorites: postsTable.total_favorites,
        tags: tagsTable.name,
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(
        postsTable.poster_id,
        usersTable.user_id
    ))
    .leftJoin(postTagsTable, eq(
        postsTable.post_id,
        postTagsTable.post_id
    ))
    .leftJoin(tagsTable, eq(
        postTagsTable.tag_id,
        tagsTable.tag_id
    ))
    .groupBy(postsTable.post_id, usersTable.user_id)
    .execute();

    return postDetails

}
