"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Sparkles, MessageSquare } from "lucide-react";

const PROMPT_MODULES = [
  {
    title: "Module 1: Daily Structure Pages",
    description: "Use these prompts each morning before you fill in your daily page. Five minutes with Claude replaces an hour of staring at your to-do list.",
    prompts: [
      {
        id: "p1",
        name: "The CEO Morning Brief",
        text: "Act as my business operations assistant. Here's everything on my plate today: [paste your full to-do list, even the messy version]. I'm a solo mompreneur with about [X] focused work hours today. Pick my top 3 priorities, tell me what to delegate or drop, and give me a simple order to do them in. Be direct."
      },
      {
        id: "p2",
        name: "The Overwhelm Sorter",
        text: "My brain is scattered today and everything feels urgent. Here's what's swirling around in my head: [brain dump everything, no editing]. Sort this into 4 buckets for me: do today, schedule for later, delegate, and let go. Keep it simple."
      },
      {
        id: "p3",
        name: "The 15-Minute Win",
        text: "I only have 15 minutes before [school pickup / my next obligation]. Here's my list: [paste list]. What's the one task I can fully complete in 15 minutes that moves my business forward? Just one. Tell me why."
      }
    ]
  },
  {
    title: "Module 2: Weekly Planning System",
    description: "Use these on Sunday night or Monday morning when you set up your week. They turn your weekly planning page from a wish list into a real plan.",
    prompts: [
      {
        id: "p4",
        name: "The Weekly CEO Meeting",
        text: "You're my business strategist. My main goal this month is [your goal]. Last week I completed: [list wins]. I didn't get to: [list what slipped]. Help me plan this week so every day builds toward my monthly goal. Give me one main focus per day, Monday to Friday. Keep it realistic for a solo mom."
      },
      {
        id: "p5",
        name: "The Reality Check",
        text: "Here's my plan for the week: [paste your weekly plan]. Here's my real life this week: [school events, appointments, kid schedules, anything fixed]. Tell me honestly where this plan will break, and fix it so it survives my actual week."
      },
      {
        id: "p6",
        name: "The Friday Review",
        text: "It's the end of my week. Here's what I planned: [paste plan]. Here's what actually happened: [be honest]. No judgment. Tell me: what worked, what didn't, and one change to make next week 10% smoother. Keep it short and kind."
      }
    ]
  },
  {
    title: "Module 3: Income Planning + Tracking",
    description: "Structure is not the end goal. Money is. These prompts connect your daily effort to your income page.",
    prompts: [
      {
        id: "p7",
        name: "The Income Goal Breakdown",
        text: "My income goal this month is [$ amount]. My offers are: [list your offers and prices]. Break my goal down: how many sales of each offer do I need? Then give me 3 simple actions I can take this week to move toward those numbers. No hustle culture. Sustainable only."
      },
      {
        id: "p8",
        name: "The Money Pattern Finder",
        text: "Here are my income numbers from the last [4 weeks / 3 months]: [paste your tracking numbers from the planner]. What patterns do you see? What's working that I should do more of? What's draining time but not making money?"
      },
      {
        id: "p9",
        name: "The Offer Sanity Check",
        text: "I'm thinking about [new offer or price change idea]. My audience is [describe your people]. My current offers are [list them]. Ask me 5 tough questions a smart business advisor would ask before I commit to this."
      }
    ]
  },
  {
    title: "Module 4: Consistency System",
    description: "Consistency isn't a willpower problem. It's a system problem. These prompts keep the system running on the heavy days.",
    prompts: [
      {
        id: "p10",
        name: "The Hard Day Plan",
        text: "Today is a low-energy day. Life is heavy right now. I still want to keep my streak alive without burning out. Here's my list: [paste list]. Give me a bare-minimum version of today: the smallest set of actions that still counts as showing up. Permission to skip the rest."
      },
      {
        id: "p11",
        name: "The Restart Button",
        text: "I fell off my routine for [X days/weeks] and I'm tempted to spiral about it. Don't lecture me. Just give me a gentle 3-day restart plan to get back into my planner habit, starting with something so small I can't say no."
      },
      {
        id: "p12",
        name: "The Habit Anchor",
        text: "I want to make [habit, e.g. filling in my daily page] automatic. Here's my current morning: [describe your real morning, chaos included]. Find the best existing moment in my routine to attach this habit to, and tell me exactly how to anchor it there."
      }
    ]
  },
  {
    title: "Module 5: Simple Routines",
    description: "Morning and evening rituals that calm your nervous system. Let Claude design them around your real life, not a fantasy version of it.",
    prompts: [
      {
        id: "p13",
        name: "The Calm Morning Builder",
        text: "Design me a simple morning routine. Constraints: I have [X] minutes before the kids wake up / before the day starts. I want to feel calm and focused, not rushed. I like [coffee, quiet, journaling, movement, whatever's true]. Maximum 4 steps. Nothing that requires willpower at 6am."
      },
      {
        id: "p14",
        name: "The Shutdown Ritual",
        text: "Create a 10-minute evening shutdown routine for a solo mompreneur. It should close out my workday, set up tomorrow's planner page, and help my brain actually stop working. Simple steps only."
      },
      {
        id: "p15",
        name: "The Sunday Reset",
        text: "Build me a 30-minute Sunday reset: review last week, set up this week in my planner, and one small act of self-care. Make it feel peaceful, not like a chore. Give it to me as a checklist."
      }
    ]
  },
  {
    title: "Bonus: The Monthly CEO Review",
    description: "Once a month, sit down with your planner and run this. It's your board meeting. You're the board.",
    prompts: [
      {
        id: "p16",
        name: "The Monthly Board Meeting",
        text: "Act as my board of advisors. Here's my month in review: Income: [numbers]. Wins: [list]. What flopped: [list]. How I feel about my business right now: [be honest]. Give me: 1) the one thing to double down on next month, 2) the one thing to stop doing, 3) one blind spot I might be missing. Be direct but kind."
      }
    ]
  }
];

export function PromptLibrary() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="max-w-3xl rounded-2xl bg-card border border-border p-8 text-left space-y-4 shadow-sm">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              How to Use This Prompt Library
            </h3>
            <p className="text-sm text-card-foreground">
              Your planner gives you the structure. Claude gives you the thinking partner. Together they run your business like a CEO would.
            </p>
            <ul className="text-sm text-card-foreground space-y-2 mt-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Open Claude (claude.ai). The free version works fine.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Pick the prompt that matches the planner section you're working in.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Copy it, paste it into Claude, and fill in the [brackets] with your own details.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Take Claude's answer and write your plan into your planner.</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-foreground font-medium">
                One rule: Claude drafts, you decide. You're the CEO. AI is your assistant, not your boss.
              </p>
            <p className="text-xs text-muted-foreground mt-1 italic">
              No tech skills needed. If you can copy and paste, you can do this.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-16">
          {PROMPT_MODULES.map((module, mIdx) => (
            <motion.div 
              key={mIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="space-y-2 border-b border-border pb-4">
                <h3 className="text-xl font-display italic font-bold text-foreground">{module.title}</h3>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {module.prompts.map((prompt) => (
                  <div 
                    key={prompt.id}
                    className="group relative rounded-xl border border-border bg-muted p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="size-4 text-primary" />
                        <h4 className="font-semibold text-foreground text-sm">{prompt.name}</h4>
                      </div>
                      <button
                        onClick={() => handleCopy(prompt.id, prompt.text)}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10/70"
                        title="Copy prompt"
                      >
                        {copiedId === prompt.id ? (
                          <>
                            <Check className="size-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="rounded-lg bg-background p-4 border border-border">
                      <p className="text-sm leading-relaxed text-card-foreground select-text whitespace-pre-wrap font-serif">
                        {prompt.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
    </div>
  );
}
