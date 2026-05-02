import React from "react";

function MorningGlance({
  data,
}: {
  data: { feel: string; priorities: string[]; energy: number };
}) {
  return (
    <section className="p-4 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold">Morning Glance</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="col-span-1">
          <div className="text-sm text-muted-foreground">Feel</div>
          <div className="text-xl font-medium mt-1">{data.feel}</div>
        </div>
        <div className="col-span-1 sm:col-span-1">
          <div className="text-sm text-muted-foreground">Top priorities</div>
          <ul className="mt-1 space-y-1">
            {data.priorities.map((p, i) => (
              <li key={i} className="text-sm">
                • {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1">
          <div className="text-sm text-muted-foreground">Energy</div>
          <div className="mt-1">
            <div className="w-full bg-muted h-3 rounded">
              <div
                className="bg-primary h-3 rounded"
                style={{ width: `${data.energy}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.energy}%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EODReflection({
  data,
}: {
  data: { worked: string; celebrate: string; release: string };
}) {
  return (
    <section className="p-4 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold">End of Day</h2>
      <div className="mt-3 grid grid-cols-1 gap-3">
        <div>
          <div className="text-sm text-muted-foreground">What I worked on</div>
          <div className="mt-1">{data.worked}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Celebrate</div>
          <div className="mt-1">{data.celebrate}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Release</div>
          <div className="mt-1">{data.release}</div>
        </div>
      </div>
    </section>
  );
}

function DailyTasks({
  tasks,
}: {
  tasks: { id: string; title: string; category: string; done: boolean }[];
}) {
  return (
    <section className="p-4 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold">Daily Tasks</h2>
      <div className="mt-3 space-y-2">
        {tasks.map((t) => (
          <label key={t.id} className="flex items-start gap-3">
            <input
              type="checkbox"
              defaultChecked={t.done}
              className="mt-1"
              disabled
            />
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-muted-foreground">{t.category}</div>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const morning = {
    feel: "Focused",
    priorities: ["Call top client", "Ship landing page", "Plan IG post"],
    energy: 78,
  };
  const eod = {
    worked: "Worked on landing page content and client email sequence.",
    celebrate: "Launched signup modal.",
    release: "Let go of perfection on CTA copy.",
  };
  const tasks = [
    {
      id: "t1",
      title: "Reply to client emails",
      category: "admin",
      done: true,
    },
    { id: "t2", title: "Record IG idea", category: "visibility", done: false },
    { id: "t3", title: "Invoice client", category: "money", done: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Phase 2 — Daily dashboard (static demo)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MorningGlance data={morning} />
          <EODReflection data={eod} />
        </div>
        <div className="lg:col-span-1">
          <DailyTasks tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
