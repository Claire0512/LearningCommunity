import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSessionUserId } from "@/utils/apiAuthentication";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            // This code runs on your server before upload
            const userId = await getSessionUserId();
            // If you throw, the user will not be able to upload
            if (!userId) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

			console.log('file url', file.url);

			return { uploadedBy: metadata.userId };
		}),

	profileUploader: f({ image: { maxFileSize: '4MB' } })
		.middleware(async ({ req }) => {
            const userId = await getSessionUserId();
			if (!userId) throw new Error('Unauthorized');
			return { userId: userId };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete for userId:', metadata.userId);

			console.log('file url', file.url);

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
