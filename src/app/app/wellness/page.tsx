import React from "react";

function MindSection({
  data,
}: {
  data: {
    grat: string;
    journal: string;
    affirm: string;
    mental: string;
    mood: string;
  };
}) {
  return (
    <section className="p-4 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold">Mind</h2>
      <div className="mt-3 space-y-3">
        <div>
          <div className="text-sm text-muted-foreground">Gratitude</div>
          <div className="mt-1">{data.grat}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Journal</div>
          <div className="mt-1">{data.journal}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Affirmation</div>
          <div className="mt-1">{data.affirm}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Mental notes</div>
          <div className="mt-1">{data.mental}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Mood</div>
          <div className="mt-1">{data.mood}</div>
        </div>
      </div>
    </section>
  );
}

function BodySection({
  data,
}: {
  data: {
    water: boolean;
    move: boolean;
    meals: boolean;
    walk: boolean;
    sleep: boolean;
    cycle: boolean;
    notes: string;
  };
}) {
  const items = [
    ["Water", data.water],
    ["Move", data.move],
    ["Meals", data.meals],
    ["Walk", data.walk],
    ["Sleep", data.sleep],
    ["Cycle", data.cycle],
  ] as [string, boolean][];

  return (
    <section className="p-4 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold">Body</h2>
      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap gap-3">
          {items.map(([label, val]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={val} readOnly disabled />
              <div>{label}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Notes</div>
          <div className="mt-1">{data.notes}</div>
        </div>
      </div>
    </section>
  );
}

function SpiritSection({
  data,
}: {
  data: {
    prayer: boolean;
    meditate: boolean;
    scripture: boolean;
    breath: boolean;
    visual: boolean;
    intuition: boolean;
    notes: string;
    scripture_text: string;
  };
}) {
  const items = [
    ["Prayer", data.prayer],
    ["Meditation", data.meditate],
    ["Scripture", data.scripture],
    ["Breath", data.breath],
    ["Visualization", data.visual],
    ["Intuition", data.intuition],
  ] as [string, boolean][];

  return (
    <section className="p-4 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold">Spirit</h2>
      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap gap-3">
          {items.map(([label, val]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={val} readOnly disabled />
              <div>{label}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Notes</div>
          <div className="mt-1">{data.notes}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">
            Scripture / Devotional
          </div>
          <div className="mt-1">{data.scripture_text}</div>
        </div>
      </div>
    </section>
  );
}

export default function WellnessPage() {
  const mind = {
    grat: "Grateful for client win",
    journal: "Wrote ideas for landing page.",
    affirm: "I ship value.",
    mental: "Focus on next steps.",
    mood: "Calm",
  };
  const body = {
    water: true,
    move: true,
    meals: true,
    walk: false,
    sleep: true,
    cycle: false,
    notes: "Slept 7 hours. Skipped walk.",
  };
  const spirit = {
    prayer: true,
    meditate: false,
    scripture: true,
    breath: true,
    visual: false,
    intuition: true,
    notes: "Quiet morning.",
    scripture_text: "Psalm 23:1 - The Lord is my shepherd.",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wellness</h1>
        <p className="text-sm text-muted-foreground">
          Phase 3 — Wellness (static demo)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MindSection data={mind} />
          <BodySection data={body} />
        </div>
        <div className="lg:col-span-1">
          <SpiritSection data={spirit} />
        </div>
      </div>
    </div>
  );
}
