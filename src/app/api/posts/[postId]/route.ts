import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";

const GetRequestSchema = z.object({
    postId: z.number().min(1),
});


const ReplySchema = z.object({
    commentId: z.number().min(1),
    commenterId: z.number().min(1),
    parentCommentId: z.number().min(1),
    text: z.string().min(1),
    createdAt: z.date(),  
    isHelpful: z.boolean(),
    upvotes: z.array(z.object({
        userId: z.number().min(1),
    })),
    downvotes: z.array(z.object({
        userId: z.number().min(1),
    })),
    user: z.object({
        name: z.string().min(1),
        profilePicture: z.string().min(1)
    }),
})


const CommentSchema = z.object({
    commentId: z.number().min(1),
    commenterId: z.number().min(1),
    postId: z.number().min(1),
    text: z.string().min(1),
    createdAt: z.date(),  
    isHelpful: z.boolean(),
    upvotes: z.array(z.object({
        userId: z.number().min(1),
    })),
    downvotes: z.array(z.object({
        userId: z.number().min(1),
    })),
    user: z.object({
        name: z.string().min(1),
        profilePicture: z.string().min(1)
    }),
    replies: z.array(ReplySchema),
})

const GetResponseSchema = z.object({
    postId: z.number().min(1),
    postTitle: z.string(),
    postContext: z.string().min(1),
    posterId: z.number(),
    tags: z.array(z.string()),
    isSolved: z.boolean(),
    comments: z.array(CommentSchema),
    user: z.object({
        name: z.string().min(1),
        profilePicture: z.string().min(1)
    }),
    upvotes: z.array(z.object({
        userId: z.number().min(1),
    })),
    downvotes: z.array(z.object({
        userId: z.number().min(1),
    })),
})


type GetRequest = z.infer<typeof GetRequestSchema>;
type GetResponse = z.infer<typeof GetResponseSchema>;
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
                    replies: {
                        with: {
                            user: true,
                            upvotes: true,
                            downvotes: true        
                        }
                    },
                    upvotes: true,
                    downvotes: true
                }
            },
        }, 
        where: (post, { eq }) => eq(post.postId, params.postId),
    });

    if (!postDetail) {
        return NextResponse.json({ error: "post not found" }, { status: 404 });
    }

    try {
        CommentSchema.parse(postDetail);
    } catch (err) {
        console.log("Error parsing response in api/posts/[postId]/route.ts");
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }

    const parsedDetail = postDetail as unknown as GetResponse

    const response = {
        postId: parsedDetail.postId,
        postTitle: parsedDetail.postTitle,
        postContext: parsedDetail.postContext,
        posterId: parsedDetail.posterId,
        posterName: parsedDetail.user.name,
        isSolved: parsedDetail.isSolved,
        tags: parsedDetail.tags,
        upvotes: parsedDetail.upvotes.length,
        downvotes: parsedDetail.downvotes.length,
        commentsCount: parsedDetail.comments.length,
        comments: parsedDetail.comments.map((comment) => ({
            commentId: comment.commentId,
            commenterId: comment.commenterId,
            commenterName: comment.user.name,
            commenterProfilePicture: comment.user.profilePicture,
            text: comment.text,
            isHelpful: comment.isHelpful,
            replies: comment.replies.map((reply) => ({
                commentId: reply.commentId,
                commenterId: reply.commenterId,
                commenterName: reply.user.name,
                commenterProfilePicture: reply.user.profilePicture,
                text: reply.text,
                isHelpful: reply.isHelpful,
            }))
        }))
    }

    return NextResponse.json(response, { status: 200 });
}
