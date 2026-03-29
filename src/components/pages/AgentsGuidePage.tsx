import { BookOpen, Send, Settings } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useAgents } from "@/hooks/use-api";

const TABS = [
	{ id: "overview", label: "סקירה", icon: BookOpen },
	{ id: "dispatch", label: "שיגור", icon: Send },
	{ id: "config", label: "הגדרות", icon: Settings },
];

const PROVIDER_COMMANDS = [
	{
		name: "Codex",
		color: "var(--color-accent-blue)",
		command: `codex exec --dangerously-bypass-approvals-and-sandbox \\
  --skip-git-repo-check --ephemeral -C "$dir" - <<< "$prompt"`,
	},
	{
		name: "Kimi",
		color: "var(--color-accent-purple)",
		command: `kimi --quiet --yolo -p "$prompt" -w "$dir"`,
	},
	{
		name: "Gemini",
		color: "var(--color-accent-cyan)",
		command: `env -u GEMINI_API_KEY gemini -m gemini-3.1-pro-preview \\
  --yolo -p "$prompt"`,
	},
	{
		name: "MiniMax",
		color: "var(--color-accent-amber)",
		command: `minimax --batch "$prompt"`,
	},
];

export function AgentsGuidePage() {
	const { data: agents } = useAgents();

	const agentCount = agents?.length ?? 0;

	return (
		<>
			<PageHeader
				icon={Send}
				title="מדריך סוכנים"
				description="איך עובדים עם סוכנים, שיגור משימות, וניתוב"
			/>

			<Tabs tabs={TABS}>
				{(activeTab) => {
					if (activeTab === "overview") {
						return (
							<div className="space-y-4">
								<GlassCard title="מהם סוכנים?" icon={<BookOpen size={16} />}>
									<p className="text-sm text-text-secondary leading-relaxed">
										סוכנים הם תת-תהליכים אוטונומיים שמבצעים משימות ספציפיות. כל
										סוכן מוגדר עם כלים, הרשאות, והוראות ייחודיות. המערכת כוללת{" "}
										<span className="font-semibold text-accent-blue">
											{agentCount} סוכנים
										</span>
										.
									</p>
								</GlassCard>

								<GlassCard
									title="קטגוריות סוכנים"
									icon={<Settings size={16} />}
								>
									<div className="flex flex-wrap gap-2">
										{[
											"GSD",
											"security",
											"quality",
											"testing",
											"performance",
											"infra",
											"general",
										].map((cat) => (
											<Badge key={cat} variant="default">
												{cat}
											</Badge>
										))}
									</div>
								</GlassCard>

								<GlassCard title="זרימת עבודה" icon={<BookOpen size={16} />}>
									<ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
										<li>
											משימה נכנסת לתור{" "}
											<code className="text-xs bg-bg-elevated px-1 rounded">
												pending/
											</code>
										</li>
										<li>Hydra מנתב לספק המתאים לפי ציון ביינסיאני</li>
										<li>הסוכן מבצע את המשימה</li>
										<li>תוצאה עוברת אימות</li>
										<li>ציון הספק מתעדכן</li>
									</ol>
								</GlassCard>
							</div>
						);
					}

					if (activeTab === "dispatch") {
						return (
							<div className="space-y-4">
								<p className="text-sm text-text-secondary mb-4">
									פקודות שיגור לכל אחד מ-4 הספקים. כל פקודה כוללת את הדגלים
									הנדרשים לביצוע אוטונומי.
								</p>
								{PROVIDER_COMMANDS.map((p) => (
									<div key={p.name}>
										<div className="flex items-center gap-2 mb-2">
											<span
												className="w-2 h-2 rounded-full"
												style={{ background: p.color }}
											/>
											<span className="text-sm font-semibold text-text-primary">
												{p.name}
											</span>
										</div>
										<CodeBlock code={p.command} />
									</div>
								))}
							</div>
						);
					}

					// config tab
					return (
						<div className="space-y-4">
							<GlassCard title="קבצי הגדרות" icon={<Settings size={16} />}>
								<div className="space-y-3 text-sm">
									{[
										{
											label: "Claude agents",
											path: "~/.claude/agents/",
										},
										{
											label: "Codex agents",
											path: "~/.codex/agents/",
										},
										{
											label: "Gemini agents",
											path: "~/.gemini/agents/",
										},
										{
											label: "Kimi agents",
											path: "~/.kimi/agents/",
										},
										{
											label: "Hydra config",
											path: "~/.claude/scripts/hydra-v2/hydra.json",
										},
									].map((item) => (
										<div
											key={item.path}
											className="flex items-center justify-between gap-2"
										>
											<span className="text-text-secondary">{item.label}</span>
											<code className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded">
												{item.path}
											</code>
										</div>
									))}
								</div>
							</GlassCard>
						</div>
					);
				}}
			</Tabs>
		</>
	);
}
