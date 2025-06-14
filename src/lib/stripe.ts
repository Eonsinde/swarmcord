import Stripe from "stripe"
import { PLANS } from "@/config/payment-plans"
import { currentProfile } from "./current-profile"

export const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY ?? "",
    {
        apiVersion: "2024-06-20",
        appInfo: {
            name: "Swarmcord",
            version: "0.1.0"
        },
        typescript: true
    }
);

export async function getUserSubscriptionPlan() {
    const profile = await currentProfile();

    if (!profile) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            stripeCurrentPeriodEnd: null
        }
    }

    // check to see if there is an active subscription linked with user account
    const isSubscribed = Boolean(
        profile.stripePriceId &&
        profile.stripeCurrentPeriodEnd && // 86400000 = 1 day
        profile.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    );

    const plan = isSubscribed
        ? PLANS.find((plan) => plan.pricing.priceIds.test === profile.stripePriceId)
        : null

    let isCanceled = false;

    if (isSubscribed && profile.stripeSubscriptionId) {
        // get stripePlan using the user's subscriptionId
        const stripePlan = await stripe.subscriptions.retrieve(
            profile.stripeSubscriptionId
        );

        isCanceled = stripePlan.cancel_at_period_end;
    }

    return {
        ...plan,
        stripeSubscriptionId: profile.stripeSubscriptionId,
        stripeCurrentPeriodEnd: profile.stripeCurrentPeriodEnd,
        stripeCustomerId: profile.stripeCustomerId,
        isSubscribed,
        isCanceled
    }
}