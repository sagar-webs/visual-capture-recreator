import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/components/demo";
import { DIFFERENTIATORS, FRAMEWORK, PRODUCTS, SERVICES, SITE } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/presentation")({
  head: () => seo({ title: "TechThrust Company Presentation", description: "An interactive, slide-by-slide introduction to TechThrust, its AI products and services.", path: "/presentation" }),
  component: Presentation,
});

function S({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
      {children && <div className="mt-6 text-muted-foreground md:mt-8 md:text-lg">{children}</div>}
    </div>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="grid gap-2 sm:grid-cols-2">{items.map((i) => <li key={i} className="flex gap-2"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />{i}</li>)}</ul>
);

function Presentation() {
  const { openDemo } = useDemo();
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const slides: ReactNode[] = [
    <S eyebrow="Introducing TechThrust" title="Build Smarter. Engage Better.">{SITE.description}</S>,
    <S eyebrow="Who we are" title="An AI-first technology company.">Based in the United Arab Emirates and serving businesses internationally, TechThrust builds proprietary AI products and delivers automation and engineering services that turn AI into meaningful business outcomes.</S>,
    <S eyebrow="Vision & Mission" title="Technology should move business forward.">
      <div className="grid gap-4 md:grid-cols-2">
        <p><span className="font-semibold text-foreground">Vision. </span>A future where intelligent technology enables businesses to operate smarter, serve customers better and unlock new growth.</p>
        <p><span className="font-semibold text-foreground">Mission. </span>Empower businesses through practical AI products, intelligent automation and technology solutions.</p>
      </div>
    </S>,
    <S eyebrow="Our AI-first approach" title="Understand → Identify → Deliver → Evolve"><List items={FRAMEWORK.map((f) => `${f.title}: ${f.text}`)} /></S>,
    <S eyebrow="AI product portfolio" title="Three products. Distinct needs.">
      <div className="grid gap-4 md:grid-cols-3">{PRODUCTS.map((p) => <div key={p.slug} className="rounded-xl border border-border p-4"><p className="font-display text-lg font-semibold text-foreground">{p.name}</p><p className="text-sm">{p.positioning}</p></div>)}</div>
    </S>,
    <S eyebrow="Velynora" title="Turn customer conversations into business action."><List items={["Sales conversion & lead qualification", "Outbound campaigns", "Lead nurture & appointments", "Customer support", "Feedback & NPS", "Reception & booking"]} /></S>,
    <S eyebrow="Velynora Lite" title="The right message. The right time. At scale."><List items={["Automated voice calls", "WhatsApp or email follow-ups", "Appointment & event reminders", "Announcements & notifications", "Self-service or managed campaigns"]} /></S>,
    <S eyebrow="Vocalis" title="Your website. Now it talks, thinks & acts."><List items={["Voice and text interaction", "Voice-directed navigation", "Discovery & recommendations", "Appointment booking & human handoff", "Shopify & WooCommerce", "80+ languages"]} /></S>,
    <S eyebrow="Services & applications" title="Technology that moves business forward."><List items={[...SERVICES.map((s) => s.name), ...DIFFERENTIATORS.slice(0, 0).map((d) => d.title)]} /></S>,
    <S eyebrow="Next step" title="Let's Build What's Next.">
      <p>Tell us what you're trying to achieve. We'll discuss the right approach for your business.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="hero" size="lg" onClick={() => openDemo()}>Book a Demo</Button>
        <Button variant="heroOutline" size="lg" asChild><Link to="/contact">Contact Us</Link></Button>
      </div>
    </S>,
  ];
  const n = slides.length;
  const go = useCallback((d: number) => setI((x) => Math.min(n - 1, Math.max(0, x + d))), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,textarea,select,[role=dialog]")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
      if (e.key === "Home") setI(0);
      if (e.key === "End") setI(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, n]);

  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else ref.current?.requestFullscreen?.();
  };

  return (
    <div ref={ref} className="flex min-h-screen flex-col bg-background">
      <div className="container-site flex h-16 items-center justify-between">
        <span className="font-display font-semibold">Tech<span className="text-primary">Thrust</span> · Presentation</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={fullscreen} aria-label="Toggle fullscreen" className="hidden size-10 items-center justify-center rounded-full border border-border hover:text-primary md:inline-flex"><Maximize2 className="size-4" /></button>
          <Link to="/" aria-label="Exit presentation" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm hover:text-primary"><X className="size-4" /> Exit</Link>
        </div>
      </div>
      <div className="container-site flex flex-1 items-center py-4">
        <section aria-roledescription="slide" aria-label={`Slide ${i + 1} of ${n}`} className="card-premium relative w-full overflow-hidden p-6 md:aspect-video md:p-14">
          <div className="bg-hero absolute inset-0" aria-hidden />
          <div key={i} className="relative h-full animate-in fade-in duration-500">{slides[i]}</div>
        </section>
      </div>
      <div className="container-site pb-6">
        <div className="h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={n} aria-valuenow={i + 1} aria-label="Presentation progress">
          <div className="h-full bg-primary transition-all" style={{ width: `${((i + 1) / n) * 100}%` }} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button variant="heroOutline" onClick={() => go(-1)} disabled={i === 0}><ChevronLeft /> Previous</Button>
          <span className="text-sm text-muted-foreground" aria-live="polite">{i + 1} / {n}</span>
          <Button variant="hero" onClick={() => go(1)} disabled={i === n - 1}>Next <ChevronRight /></Button>
        </div>
      </div>
    </div>
  );
}
