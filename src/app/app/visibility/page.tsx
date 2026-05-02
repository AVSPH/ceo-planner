import React from "react";

function ContentPlan({
  data,
}: {
  data: { promo: string; idea: string; cta: string; platforms: string[] };
}) {
  return (
    <section className="p-4 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold">Content Plan</h2>
      <div className="mt-3 space-y-3">
        <div>
          <div className="text-sm text-muted-foreground">Promo</div>
          <div className="mt-1">{data.promo}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Idea</div>
          <div className="mt-1">{data.idea}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Call to action</div>
          <div className="mt-1">{data.cta}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Platforms</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {data.platforms.map((p) => (
              <span key={p} className="text-xs px-2 py-1 rounded bg-muted">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentReflection({
  data,
}: {
  data: { pillar: string; audience: string; convo: string; engage: string };
}) {
  return (
    <section className="p-4 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold">Content Reflection</h2>
      <div className="mt-3 space-y-3">
        <div>
          <div className="text-sm text-muted-foreground">Pillar</div>
          <div className="mt-1">{data.pillar}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Audience</div>
          <div className="mt-1">{data.audience}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Conversation</div>
          <div className="mt-1">{data.convo}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Engagement plan</div>
          <div className="mt-1">{data.engage}</div>
        </div>
      </div>
    </section>
  );
}

export default function VisibilityPage() {
  const plan = {
    promo: "Launch mini-course on creating lead magnets",
    idea: "5-part carousel teaching quick lead magnet ideas",
    cta: "Sign up for early access",
    platforms: ["IG", "FB", "LI"],
  };

  const reflect = {
    pillar: "Educational",
    audience: "Early-stage founders",
    convo: "How to get first 100 leads",
    engage: "Ask followers to share biggest lead gen problem",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Visibility</h1>
        <p className="text-sm text-muted-foreground">
          Phase 4 — Visibility (static demo)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ContentPlan data={plan} />
        </div>
        <div className="lg:col-span-1">
          <ContentReflection data={reflect} />
        </div>
      </div>
    </div>
  );
}
