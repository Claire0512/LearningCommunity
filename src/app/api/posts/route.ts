import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";

import { 
    postsTable, 
    usersTable, 
    commentsTable, 
    favoritesTable, 
    upvotesTable,
    downvotesTable,
    tagsTable,
    postTagsTable
} from "@/db/schema";
import { sql, eq, desc } from "drizzle-orm";

const GetRequestSchema = z.number().min(1)

const GetResponseSchema = z.array(z.object({
    postId: z.number().min(1),
    postTitle: z.string().min(1),
    postContext: z.string().min(1),
    posterId: z.number(),
    upvotes: z.number(),
    downvotes: z.number(),
    commentsCount: z.number(),
    favorites: z.number(),
    tags: z.array(z.string())
}))

const PostRequestSchema = z.object({
    postTitle: z.string().min(1),
    postContext: z.string().min(1),
    posterId: z.number(),
    postImage: z.string().optional(),
    tags: z.array(z.string())
})

type GetRequest = z.infer<typeof GetRequestSchema>;

type GetResponse = z.infer<typeof GetResponseSchema>;

type PostRequest = z.infer<typeof PostRequestSchema>;

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
        postTitle: postsTable.postTitle,
        postContext: postsTable.postContext,
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

export async function POST(req: NextRequest) {
    const data = await req.json();
    try {
        PostRequestSchema.parse(data);
    } 
    catch(error) {
        console.log("Error parsing request in api/posts/route.ts")
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { tags, ...newPost } = data as PostRequest;

    let postId = -1;
    try {
        const inserted = await db.insert(postsTable)
        .values(newPost)
        .returning({postId: postsTable.postId});
        postId = inserted[0].postId;
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }   

    let tagIds: number[] = [];
    async function getTagIds(tags: string[]) {
        const tagPromises = tags.map(async (tag) => {
            const exist = await db.query.tagsTable.findFirst({
                columns: {
                    tagId: true,
                },
                where: (tagsTable, { eq }) => eq(tagsTable.name, tag),
            });
    
            if (exist) {
                return exist.tagId;
            } else {
                const newTag = await db.insert(tagsTable)
                    .values({ name: tag })
                    .returning({ tagId: tagsTable.tagId });
                return newTag[0].tagId;
            }
        });
        return await Promise.all(tagPromises);
    }
    
    try {
        getTagIds(tags).then(ids => {
            tagIds = ids;
        });
    } catch (error) {
        console.log("Failed getting id of tags!");
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    const postTagIds = tagIds.map(tagId => ({
        postId, tagId
    }))

    try {
        await db.insert(postTagsTable).values(postTagIds);
        return NextResponse.json({ result: "success" }, { status: 200 });
    } catch (error) {
        console.log("Failed inserting post and tags relationship!");
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}