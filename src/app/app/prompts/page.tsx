import { PromptLibrary } from "@/components/app/prompt-library";

export const metadata = {
  title: "AI Prompt Library | Life & CEO Planner",
  description: "Claude AI prompts to help you plan your business.",
};

export default function PromptsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Prompt Library</h1>
        <p className="text-muted-foreground">
          Use these proven Claude AI prompts to get unstuck, plan your week, and run your business like a CEO.
        </p>
      </div>
      
      <PromptLibrary />
    </div>
  );
}
