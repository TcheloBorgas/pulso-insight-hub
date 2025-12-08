import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Price IDs for all plans (monthly and yearly, with and without API key discount)
const priceIds: Record<string, Record<string, Record<string, string>>> = {
  monthly: {
    basic: {
      withoutKey: "price_1SbZI5H87hLQFAO3IIfVqEBb", // $29.99
      withKey: "price_1SbZJYH87hLQFAO3L8r4OObN"     // $24.99
    },
    plus: {
      withoutKey: "price_monthly_plus",           // placeholder - replace with actual
      withKey: "price_monthly_plus_discount"      // placeholder - replace with actual
    },
    pro: {
      withoutKey: "price_monthly_pro",            // placeholder - replace with actual
      withKey: "price_monthly_pro_discount"       // placeholder - replace with actual
    },
    elite: {
      withoutKey: "price_monthly_elite",          // placeholder - replace with actual
      withKey: "price_monthly_elite_discount"     // placeholder - replace with actual
    }
  },
  yearly: {
    basic: {
      withoutKey: "price_yearly_basic",           // placeholder - replace with actual
      withKey: "price_yearly_basic_discount"      // placeholder - replace with actual
    },
    plus: {
      withoutKey: "price_yearly_plus",            // placeholder - replace with actual
      withKey: "price_yearly_plus_discount"       // placeholder - replace with actual
    },
    pro: {
      withoutKey: "price_yearly_pro",             // placeholder - replace with actual
      withKey: "price_yearly_pro_discount"        // placeholder - replace with actual
    },
    elite: {
      withoutKey: "price_yearly_elite",           // placeholder - replace with actual
      withKey: "price_yearly_elite_discount"      // placeholder - replace with actual
    }
  }
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    const { planId, billingCycle, hasApiKey, email, cardholderName } = await req.json();
    logStep("Request parsed", { planId, billingCycle, hasApiKey, email });

    if (!planId || !billingCycle || !email) {
      throw new Error("Missing required fields: planId, billingCycle, or email");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get the correct price ID
    const cycleKey = billingCycle as "monthly" | "yearly";
    const planPrices = priceIds[cycleKey]?.[planId];
    if (!planPrices) {
      throw new Error(`Invalid plan: ${planId} or billing cycle: ${billingCycle}`);
    }
    
    const priceId = hasApiKey ? planPrices.withKey : planPrices.withoutKey;
    logStep("Price ID selected", { priceId, hasApiKey });

    // Check if customer exists
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string | undefined;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      // Create new customer
      const newCustomer = await stripe.customers.create({
        email,
        name: cardholderName,
      });
      customerId = newCustomer.id;
      logStep("New customer created", { customerId });
    }

    // Create checkout session
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/billing?success=true&plan=${planId}`,
      cancel_url: `${origin}/billing?canceled=true`,
      metadata: {
        planId,
        billingCycle,
        hasApiKey: String(hasApiKey),
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
