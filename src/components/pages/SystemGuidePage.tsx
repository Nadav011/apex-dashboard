import { Brain, Eye, Puzzle, Server } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { useMcp, useMemory, useObsidian, useSkills } from "@/hooks/use-api";

const TABS = [
	{ id: "memory", label: "זיכרון", icon: Brain },
	{ id: "mcp", label: "MCP", icon: Server },
	{ id: "skills", label: "מיומנויות", icon: Puzzle },
	{ id: "obsidian", label: "Obsidian", icon: Eye },
];

export function SystemGuidePage() {
	const { data: memory } = useMemory();
	const { data: mcp } = useMcp();
	const { data: skills } = useSkills();
	// @ts-expect-error used in conditional tab rendering
	const { data: obsidian } = useObsidian();

	return (
		<>
			<PageHeader
				icon={Brain}
				title="מדריך מערכת"
				description="זיכרון, שרתי MCP, ומיומנויות — איך הכל עובד"
			/>

			<Tabs tabs={TABS}>
				{(activeTab) => {
					if (activeTab === "memory") {
						return (
							<div className="space-y-4">
								<div className="grid-cards stagger-grid">
									<StatCard
										label="שורות זיכרון"
										value={memory?.line_count ?? 0}
										icon={Brain}
									/>
									<StatCard
										label="קבצי ידע"
										value={memory?.knowledge_files ?? 0}
										icon={Brain}
									/>
									<StatCard
										label="קבצי כללים"
										value={memory?.rules_files ?? 0}
										icon={Brain}
									/>
								</div>

								<GlassCard title="סוגי זיכרון" icon={<Brain size={16} />}>
									<div className="space-y-3 text-sm text-text-secondary">
										<p>
											<strong className="text-text-primary">LanceDB</strong> —
											זיכרון סמנטי עם cognitive scoring (similarity 50% +
											recency 30% + importance 20%)
										</p>
										<p>
											<strong className="text-text-primary">SQLite</strong> —
											checkpointing לגרף LangGraph, crash-safe resume
										</p>
										<p>
											<strong className="text-text-primary">JSONL</strong> —
											beads audit trail, corrections, knowledge capture
										</p>
									</div>
								</GlassCard>

								{memory?.sections && memory.sections.length > 0 && (
									<GlassCard title="סקשנים בזיכרון" icon={<Brain size={16} />}>
										<div className="flex flex-wrap gap-1.5">
											{memory.sections.map((s: string) => (
												<Badge key={s} variant="default">
													{s}
												</Badge>
											))}
										</div>
									</GlassCard>
								)}
							</div>
						);
					}

					if (activeTab === "mcp") {
						const servers = mcp?.servers ?? [];
						const enabled = servers.filter(
							(s: { enabled: boolean }) => s.enabled,
						).length;

						return (
							<div className="space-y-4">
								<div className="grid-cards stagger-grid">
									<StatCard
										label="סה״כ שרתים"
										value={servers.length}
										icon={Server}
									/>
									<StatCard label="פעילים" value={enabled} icon={Server} />
									<StatCard
										label="מושבתים"
										value={servers.length - enabled}
										icon={Server}
									/>
								</div>

								<div className="grid-cards stagger-grid">
									{servers.map(
										(s: {
											name: string;
											source: string;
											enabled: boolean;
											transport?: string;
										}) => (
											<GlassCard
												key={s.name}
												title={s.name}
												icon={<Server size={16} />}
												subtitle={s.source}
											>
												<div className="flex items-center gap-2">
													<Badge variant={s.enabled ? "success" : "default"}>
														{s.enabled ? "פעיל" : "מושבת"}
													</Badge>
													{s.transport && (
														<Badge variant="info">{s.transport}</Badge>
													)}
												</div>
											</GlassCard>
										),
									)}
								</div>
							</div>
						);
					}

					// skills tab
					const totalSkills = skills?.total ?? 0;
					const categories = skills?.categories ?? {};

					return (
						<div className="space-y-4">
							<StatCard
								label="סה״כ מיומנויות"
								value={totalSkills}
								icon={Puzzle}
							/>

							{Object.keys(categories).length > 0 && (
								<GlassCard title="לפי קטגוריה" icon={<Puzzle size={16} />}>
									<div className="flex flex-wrap gap-2">
										{Object.entries(categories).map(([cat, count]) => (
											<Badge key={cat} variant="info">
												{cat}: {count}
											</Badge>
										))}
									</div>
								</GlassCard>
							)}
						</div>
					);
				}}
			</Tabs>
		</>
	);
}
