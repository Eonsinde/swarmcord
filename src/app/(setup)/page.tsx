import { redirect } from "next/navigation"
import { currentProfile } from "@/lib/current-profile"
import { redirectToSignIn } from "@clerk/nextjs"

const SetupPage = async () => {
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    return redirect("/me");
}

export default SetupPage