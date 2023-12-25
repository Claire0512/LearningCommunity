import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { commentsTable } from "@/db/schema";

const GetRequestSchema = z.object({
    postId: z.number().min(1),
});

const GetResponseSchema = z.array(z.object({
    postId: z.number().min(1),
    postTitle: z.string(),
    postContext: z.string().min(1),
    posterId: z.number(),
    posterName: z.string(),
    tags: z.array(z.string())
}))

type GetRequest = z.infer<typeof GetRequestSchema>;

export async function GET(req: NextRequest, { params }: { params: GetRequest }) {
    try {
        GetRequestSchema.parse(params);
    } 
    catch(error) {
        console.log("Error parsing request in api/posts/[postId]/route.ts")
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const postDetail = await db.query.postsTable.findFirst({
        with: {
            user: true,
            tags: true,
            upvotes: true,
            downvotes: true,
            comments: {
                with: {
                    user: true,
                    replies: true,
                    upvotes: true,
                    downvotes: true
                }
            },
        }, 
        where: (post, { eq }) => eq(post.postId, params.postId),
    });

    if (!postDetail) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // postDetail.comments = postDetail.comments.map(async (comment) => {
    //     const commentWithReplies = await db.query.commentsTable.findFirst({
    //         with: {
    //             replies: true,
    //         },
    //         where: (singleComment, { eq }) => eq(singleComment.commentId, comment.commentId),
    //     })
    //     return commentWithReplies;
    // })

    const response = {
        ...postDetail,
        // TODO
    }

    try {
        GetResponseSchema.parse(response);
    }
    catch (error) {
        console.log("Error parsing response in api/posts/[postId]/route.ts")
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }

    return NextResponse.json(response, { status: 200 });
}
