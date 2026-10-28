import { createServerFn } from "@tanstack/react-start";
import { demoSchema } from "./demo-schema";

const NOTIFY_TO = "sagar.breez@gmail.com";

/**
 * Accepts a demo request: validates, rate-limits, stores it, then attempts
 * the email notification. Success is returned only after the row is stored.
 */
export const submitDemoRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => demoSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const }; // silently drop bots

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("demo_requests")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return { ok: false as const, error: "Too many requests. Please try again in a few minutes." };
    }

    const { data: row, error } = await supabaseAdmin
      .from("demo_requests")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        product: data.product,
        message: data.message ?? "",
        source_page: data.sourcePage ?? null,
      })
      .select("id, created_at")
      .single();
    if (error || !row) {
      console.error("demo insert failed", error);
      return { ok: false as const, error: "We couldn't submit your request. Please try again." };
    }

    const status = await sendLeadNotification({ ...data, submittedAt: row.created_at });
    await supabaseAdmin.from("demo_requests").update({ notification_status: status }).eq("id", row.id);

    return { ok: true as const };
  });

type Lead = {
  name: string;
  email: string;
  phone: string;
  company: string;
  product: string;
  message?: string | undefined;
  sourcePage?: string | undefined;
  submittedAt: string;
};

/**
 * Email notification hook. Returns "not_configured" until a sender domain is
 * set up in Lovable Cloud emails; leads are still stored and visible in the
 * demo_requests table. Replace the body with the generated app-email sender.
 */
async function sendLeadNotification(lead: Lead): Promise<string> {
  void NOTIFY_TO;
  void lead;
  return "not_configured";
}
