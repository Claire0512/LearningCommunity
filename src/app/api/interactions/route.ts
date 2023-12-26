import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { upvotesTable, downvotesTable, favoritesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm"

const PostRequestSchema = z.object({
    postId: z.number().optional(),
    questionId: z.number().optional(),
    commentId: z.number().optional(),
    userId: z.number().min(1),
    actionType: z.enum([
        "add_upvote", "add_downvote", "add_favorite",
        "remove_upvote", "remove_downvote", "remove_favorite",
    ])
})

type PostRequestType = z.infer<typeof PostRequestSchema>;

export async function POST(req: NextRequest) {
    const data = await req.json();
    try {
        PostRequestSchema.parse(data);
    } 
    catch(error) {
        console.log("Error parsing request in api/comments/route.ts")
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const newInteraction = data as PostRequestType;

    if ( !newInteraction.postId && !newInteraction.questionId && !newInteraction.commentId ) {
        return NextResponse.json({ error: "No parent specified in api/interactions/route.ts" }, { status: 400 });
    }

    let multipleId = 0;
    if (newInteraction.commentId) multipleId += 1;
    if (newInteraction.questionId) multipleId += 1;
    if (newInteraction.postId) multipleId += 1;
    if (multipleId > 1) {
        return NextResponse.json({ error: "Only one parent can be specified in api/interactions/route.ts" }, { status: 400 });
    }

    if (newInteraction.actionType === "add_upvote") {
        await db.insert(upvotesTable).values(newInteraction)
        if (newInteraction.postId) {
            await db.delete(downvotesTable).where(
                and(
                    eq(downvotesTable.postId, newInteraction.postId),
                    eq(downvotesTable.userId, newInteraction.userId)
                )
            )
        }
        else if (newInteraction.commentId) {
            await db.delete(downvotesTable).where(
                and(
                    eq(downvotesTable.commentId, newInteraction.commentId),
                    eq(downvotesTable.userId, newInteraction.userId)
                )
            )
        }
    }
    else if (newInteraction.actionType === "add_downvote") {
        await db.insert(downvotesTable).values(newInteraction);
        if (newInteraction.postId) {
            await db.delete(upvotesTable).where(
                and(
                    eq(upvotesTable.postId, newInteraction.postId),
                    eq(upvotesTable.userId, newInteraction.userId)
                )
            )
        }
        else if (newInteraction.commentId) {
            await db.delete(upvotesTable).where(
                and(
                    eq(upvotesTable.commentId, newInteraction.commentId),
                    eq(upvotesTable.userId, newInteraction.userId)
                )
            )
        }
        else if (newInteraction.questionId) {
            return NextResponse.json({ error: "Cannot downvote a question" }, { status: 400 });
        }
    } 
    else if (newInteraction.actionType === "add_favorite") {
        if (newInteraction.commentId) {
            return NextResponse.json({ error: "Cannot favorite a comment" }, { status: 400 });
        }
        await db.insert(favoritesTable).values(newInteraction);
    }
    else if (newInteraction.actionType === "remove_upvote") {
        if (newInteraction.postId) {
            await db.delete(upvotesTable).where(
                and(
                    eq(upvotesTable.postId, newInteraction.postId),
                    eq(upvotesTable.userId, newInteraction.userId)
                )
            )
        }
        else if (newInteraction.commentId) {
            await db.delete(upvotesTable).where(
                and(
                    eq(upvotesTable.commentId, newInteraction.commentId),
                    eq(upvotesTable.userId, newInteraction.userId)
                )
            )
        }
        else if (newInteraction.questionId) {
            await db.delete(upvotesTable).where(
                and(
                    eq(upvotesTable.questionId, newInteraction.questionId),
                    eq(upvotesTable.userId, newInteraction.userId)
                )
            )
        }
    }
    else if (newInteraction.actionType === "remove_downvote") {
        if (newInteraction.postId) {
            await db.delete(downvotesTable).where(
                and(
                    eq(downvotesTable.postId, newInteraction.postId),
                    eq(downvotesTable.userId, newInteraction.userId)
                )
            )
        }
        else if (newInteraction.commentId) {
            await db.delete(downvotesTable).where(
                and(
                    eq(downvotesTable.commentId, newInteraction.commentId),
                    eq(downvotesTable.userId, newInteraction.userId)
                )
            )
        }
        else if (newInteraction.questionId) {
            return NextResponse.json({ error: "Cannot downvote a question" }, { status: 400 });
        }
    }
    else if (newInteraction.actionType === "remove_favorite") {
        if (newInteraction.commentId) {
            return NextResponse.json({ error: "Cannot favorite a comment" }, { status: 400 });
        }
        if (newInteraction.postId) {
            await db.delete(favoritesTable).where(
                and(
                    eq(favoritesTable.postId, newInteraction.postId),
                    eq(favoritesTable.userId, newInteraction.userId)
                )
            )
        }
        else if (newInteraction.questionId) {
            await db.delete(favoritesTable).where(
                and(
                    eq(favoritesTable.questionId, newInteraction.questionId),
                    eq(favoritesTable.userId, newInteraction.userId)
                )
            )
        }
    }
    else {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
}