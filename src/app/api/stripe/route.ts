// to create stripe checkout session
import { NextResponse } from "next/server"
import { currentProfile } from "@/lib/current-profile"
import { stripe } from "@/lib/stripe"
import { PLANS } from "@/config/payment-plans"
import { absoluteUrl } from "@/lib/absolute-url";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const { priceId } = await req.json();

        if (!priceId)
            return new NextResponse("Price Id is missing", { status: 400 });

        // check to see if there is an active subscription linked with user account
        const isSubscribed = Boolean(
            profile.stripePriceId &&
            profile.stripeCurrentPeriodEnd && // 86400000 = 1 day
            profile.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
        );

        // use process.env.NODE_ENV to dynamically select priceId
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

        const subscriptionPlan = {
            ...plan,
            stripeSubscriptionId: profile.stripeSubscriptionId,
            stripeCurrentPeriodEnd: profile.stripeCurrentPeriodEnd,
            stripeCustomerId: profile.stripeCustomerId,
            isSubscribed,
            isCanceled
        }

        const billingUrl = absoluteUrl("/rocket");

        // if user is subscribed, redirect to their billing portal
        if (subscriptionPlan.isSubscribed && profile.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: profile.stripeCustomerId,
                return_url: billingUrl
            });

            return NextResponse.json({ url: stripeSession.url });
        }

        // if user isn't subscribed, create checkout session for user
        const stripeSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            success_url: billingUrl,
            return_url: billingUrl,
            billing_address_collection: "auto",
            line_items: [
                {
                    // use process.env.NODE_ENV to dynamically select priceIds
                    price: PLANS.find((plan) => plan.pricing.priceIds.test === priceId)?.pricing.priceIds.test,
                    quantity: 1
                }
            ],
            metadata: {
                // this will be sent to our webhook
                userId: profile.id
            }
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.log("[CREATE_STRIPE_CHECKOUT_SESSION]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}