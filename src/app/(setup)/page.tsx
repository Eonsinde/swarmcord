import { redirect } from "next/navigation"
import { currentProfile } from "@/lib/current-profile"
import { redirectToSignIn } from "@clerk/nextjs"
import { getOrCreateProfile } from "@/lib/initial-profile";

const SetupPage = async () => {
    const profile = await getOrCreateProfile();

    if (!profile)
        return redirectToSignIn();

    return redirect("/me");
}

export default SetupPage