import { BookOpen, HelpCircle, Network, Rocket, Shield } from "lucide-react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";

const TABS = [
	{ id: "architecture", label: "ארכיטקטורה", icon: Network },
	{ id: "security", label: "אבטחה", icon: Shield },
	{ id: "gsd", label: "GSD", icon: Rocket },
	{ id: "faq", label: "שאלות נפוצות", icon: HelpCircle },
];

export function KnowledgePage() {
	return (
		<>
			<PageHeader
				icon={BookOpen}
				title="בסיס ידע"
				description="ארכיטקטורה, אבטחה, GSD, ושאלות נפוצות"
			/>

			<Tabs tabs={TABS}>
				{(activeTab) => {
					if (activeTab === "architecture") return <ArchitectureContent />;
					if (activeTab === "security") return <SecurityContent />;
					if (activeTab === "gsd") return <GsdContent />;
					return <FaqContent />;
				}}
			</Tabs>
		</>
	);
}

function ArchitectureContent() {
	return (
		<div className="space-y-4">
			<GlassCard title="טופולוגיית מכונות" icon={<Network size={16} />}>
				<div className="space-y-3 text-sm text-text-secondary">
					<p>
						<strong className="text-text-primary">Pop-OS (ראשי)</strong> — 24
						cores, 64GB RAM, 1TB NVMe. כל השירותים הפעילים רצים כאן.
					</p>
					<p>
						<strong className="text-text-primary">MSI (משני)</strong> — מקושר
						דרך Tailscale. סנכרון דו-כיווני עם claude-sync.
					</p>
				</div>
			</GlassCard>

			<GlassCard title="Hydra v2 — LangGraph" icon={<Network size={16} />}>
				<div className="text-sm text-text-secondary space-y-2">
					<p>מנוע שיגור מבוסס LangGraph StateGraph עם 5 צמתים:</p>
					<CodeBlock
						code={`decide_node → route_node → execute_node → verify_node → END
                                    ↑                                          |
                                    └──────── retry (on failure) ──────────────┘`}
					/>
					<p>
						SqliteSaver לחידוש לאחר קריסה. LanceDB לזיכרון סמנטי. 4 ספקים:
						Codex, Kimi, Gemini, MiniMax.
					</p>
				</div>
			</GlassCard>

			<GlassCard title="שכבת אחסון" icon={<Network size={16} />}>
				<div className="text-sm text-text-secondary space-y-1">
					<p>
						<code className="bg-bg-elevated px-1 rounded text-xs">
							hydra-state.db
						</code>{" "}
						— SQLite checkpoints
					</p>
					<p>
						<code className="bg-bg-elevated px-1 rounded text-xs">
							lancedb_memory/
						</code>{" "}
						— LanceDB vectors
					</p>
					<p>
						<code className="bg-bg-elevated px-1 rounded text-xs">
							hydra-bayesian.json
						</code>{" "}
						— Bayesian provider scores
					</p>
					<p>
						<code className="bg-bg-elevated px-1 rounded text-xs">
							beads.jsonl
						</code>{" "}
						— audit trail
					</p>
				</div>
			</GlassCard>
		</div>
	);
}

function SecurityContent() {
	return (
		<div className="space-y-4">
			<GlassCard title="Zero Trust — 3 עקרונות" icon={<Shield size={16} />}>
				<ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
					<li>
						<strong className="text-text-primary">Never Trust</strong> — אמת כל
						בקשה (token, claims, revocation)
					</li>
					<li>
						<strong className="text-text-primary">Always Verify</strong> — Auth
						+ authz בכל קריאה
					</li>
					<li>
						<strong className="text-text-primary">Least Privilege</strong> —
						RBAC, מספיק, בזמן הנכון
					</li>
				</ol>
			</GlassCard>

			<GlassCard title="כלי סריקה" icon={<Shield size={16} />}>
				<div className="space-y-2 text-sm">
					{[
						{ name: "trivy", cmd: "trivy fs . --severity HIGH,CRITICAL" },
						{ name: "semgrep", cmd: "semgrep scan . --config=auto" },
						{ name: "gitleaks", cmd: "gitleaks detect (CI auto)" },
						{ name: "socket", cmd: "socket npm install <pkg>" },
					].map((tool) => (
						<div key={tool.name} className="flex items-center gap-3">
							<span className="text-text-primary font-medium min-w-20">
								{tool.name}
							</span>
							<code className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded">
								{tool.cmd}
							</code>
						</div>
					))}
				</div>
			</GlassCard>

			<GlassCard title="CVE מינימום" icon={<Shield size={16} />}>
				<div className="table-scroll">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-border text-text-muted">
								<th scope="col" className="text-start py-2 pe-4">
									חבילה
								</th>
								<th scope="col" className="text-start py-2 pe-4">
									גרסה מינימלית
								</th>
							</tr>
						</thead>
						<tbody className="text-text-secondary">
							{[
								["React", "19.2.4+"],
								["Next.js", "16.1.6+"],
								["Hono", "4.12.2+"],
								["Node.js", "24.14.0+"],
								["pnpm", "10.30.3+"],
								["MCP SDK", "1.27.1+"],
							].map(([pkg, ver]) => (
								<tr key={pkg} className="border-b border-border/50">
									<td className="py-2 pe-4 font-medium text-text-primary">
										{pkg}
									</td>
									<td className="py-2 font-mono text-xs">{ver}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</GlassCard>
		</div>
	);
}

function GsdContent() {
	return (
		<div className="space-y-4">
			<GlassCard title="מה זה GSD?" icon={<Rocket size={16} />}>
				<p className="text-sm text-text-secondary leading-relaxed">
					Get Stuff Done — מתודולוגיית עבודה מבוססת פאזות. כל פאזה: research →
					plan → execute → verify → review. בקרת איכות מובנית עם verification
					gates.
				</p>
			</GlassCard>

			<GlassCard title="פקודות GSD" icon={<Rocket size={16} />}>
				<div className="space-y-1.5 text-sm">
					{[
						["/gsd:new-project", "אתחול פרויקט חדש"],
						["/gsd:plan-phase", "תכנון פאזה"],
						["/gsd:execute-phase", "ביצוע פאזה"],
						["/gsd:verify-work", "אימות תוצאות"],
						["/gsd:progress", "סטטוס התקדמות"],
						["/gsd:autonomous", "ריצה אוטונומית"],
					].map(([cmd, desc]) => (
						<div key={cmd} className="flex items-center gap-3">
							<code className="text-xs text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded min-w-36">
								{cmd}
							</code>
							<span className="text-text-muted">{desc}</span>
						</div>
					))}
				</div>
			</GlassCard>
		</div>
	);
}

function FaqContent() {
	const faqs = [
		{
			q: "איך מוסיפים סוכן חדש?",
			a: "יוצרים קובץ .md ב-~/.claude/agents/ עם frontmatter שמגדיר name, description, tools.",
		},
		{
			q: "איך מאפסים את Hydra?",
			a: "עוצרים עם Stop Hydra בלוח שליטה, מוחקים hydra-state.db, מפעילים מחדש.",
		},
		{
			q: "מה עושים כשכל הספקים נכשלים?",
			a: "ממתינים 10 דקות (rate limits), מפעילים health check, בודקים בלוגים.",
		},
		{
			q: "איך מסנכרנים בין המכונות?",
			a: "claude-sync push ממכונת המקור, claude-sync pull ביעד. JSONL — checkout --theirs.",
		},
		{
			q: "למה Gemini לא מגיב?",
			a: "בדוק thinkingBudget (צריך להיות 1024), בדוק antigravity/mcp_config.json — אסור npx.",
		},
	];

	return (
		<div className="space-y-3">
			{faqs.map((faq) => (
				<GlassCard key={faq.q} title={faq.q} icon={<HelpCircle size={16} />}>
					<p className="text-sm text-text-secondary">{faq.a}</p>
				</GlassCard>
			))}
		</div>
	);
}
