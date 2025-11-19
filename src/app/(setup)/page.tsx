// TODO:  make this client side and show loader telling user their account is being prepared
import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { getOrCreateProfile } from "@/lib/initial-profile"

const SetupPage = async () => {
    const profile = await getOrCreateProfile();

    if (!profile)
        return redirectToSignIn();

    return redirect("/me");
}

export default SetupPage