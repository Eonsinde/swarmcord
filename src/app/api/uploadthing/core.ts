import { NextRequest } from "next/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { currentProfile } from "@/lib/current-profile"
import { getUserSubscriptionPlan } from "@/lib/stripe"

const f = createUploadthing();

const middleware = async ({ req }: { req: NextRequest }) => {
    // This code runs on your server before upload
    const profile = await currentProfile();

    // If you throw, the profile will not be able to upload
    if (!profile) throw new UploadThingError("Unauthorized");

    const subscriptionPlan = await getUserSubscriptionPlan();

    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return { profileId: profile.id, subscriptionPlan };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(middleware)
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
