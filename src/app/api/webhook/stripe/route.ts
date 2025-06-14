import { headers } from "next/headers"
import type Stripe from "stripe"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get("Stripe-Signature") ?? "";

    let evt: Stripe.Event

    try {
        evt = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ""
        );
    } catch (err) {
        return new Response(
            `Stripe Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
            { status: 400 }
        );
    }

    const session = evt.data.object as Stripe.Checkout.Session;

    if (!session?.metadata?.profileId) {
        return new Response(null, { status: 200 });
    }

    if (evt.type === "checkout.session.completed") {
        const subscription =
            await stripe.subscriptions.retrieve(
                session.subscription as string
            );

        await db.profile.update({
            where: {
                id: session.metadata.profileId
            },
            data: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }
        });
    }

    if (evt.type === "invoice.payment_succeeded") {
        // retrieve the subscription details from Stripe.
        const subscription =
        await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        await db.profile.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }
        });
    }

    return new Response(null, { status: 200 });
}