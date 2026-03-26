import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	ExternalLink,
	Globe,
	Lock,
	LockOpen,
	Server,
	ShieldCheck,
	TrendingDown,
	Wifi,
} from "lucide-react";
import { cn } from "@/lib/cn";

// ── Types ─────────────────────────────────────────────────────────────────────

type DomainStatus = "active" | "pending" | "issue";
type Platform = "cloudflare" | "netlify";

interface DomainEntry {
	domain: string;
	platform: Platform;
	project: string;
	status: DomainStatus;
	ssl: boolean;
	note?: string;
}

// ── Static domain data ────────────────────────────────────────────────────────

const DOMAINS: DomainEntry[] = [
	{
		domain: "mexicani.nadav.ai",
		platform: "cloudflare",
		project: "Mexicani",
		status: "active",
		ssl: true,
	},
	{
		domain: "chance-pro.nadav.ai",
		platform: "cloudflare",
		project: "Chance Pro",
		status: "active",
		ssl: true,
	},
	{
		domain: "nadav.ai",
		platform: "cloudflare",
		project: "nadavai",
		status: "active",
		ssl: true,
	},
	{
		domain: "dashboard.nadav.ai",
		platform: "cloudflare",
		project: "APEX Dashboard",
		status: "pending",
		ssl: false,
		note: "ממתין לרשומת CNAME",
	},
	{
		domain: "cash-control.nadav.ai",
		platform: "cloudflare",
		project: "Z",
		status: "active",
		ssl: true,
	},
	{
		domain: "shifts.nadav.ai",
		platform: "cloudflare",
		project: "Shifts",
		status: "active",
		ssl: true,
	},
	{
		domain: "hatumdigital.nadav.ai",
		platform: "cloudflare",
		project: "Hatumdigital",
		status: "active",
		ssl: true,
	},
	{
		domain: "brain.nadav.ai",
		platform: "cloudflare",
		project: "Brain",
		status: "active",
		ssl: true,
	},
	{
		domain: "signature-pro.nadav.ai",
		platform: "cloudflare",
		project: "Signature Pro",
		status: "active",
		ssl: true,
	},
	{
		domain: "mediflow.netlify.app",
		platform: "netlify",
		project: "MediFlow",
		status: "issue",
		ssl: true,
		note: "בעיות build",
	},
	{
		domain: "vibechat.netlify.app",
		platform: "netlify",
		project: "vibechat",
		status: "issue",
		ssl: true,
		note: "בעיות build",
	},
];

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
	label,
	value,
	icon: Icon,
	color,
}: {
	label: string;
	value: number | string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
	color: string;
}) {
	return (
		<div className="glass-card px-5 py-3 flex items-center gap-3 min-w-[120px]">
			<Icon size={16} className={color} />
			<div>
				<p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">
					{label}
				</p>
				<p
					className="text-xl font-bold text-[var(--color-text-primary)] tabular-nums"
					dir="ltr"
				>
					{value}
				</p>
			</div>
		</div>
	);
}

// ── Platform badge ─────────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: Platform }) {
	const isCf = platform === "cloudflare";
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-[10px] font-semibold shrink-0",
				"px-2 py-0.5 rounded-full uppercase tracking-wide",
				isCf
					? "bg-[oklch(0.65_0.18_250_/_0.15)] text-[var(--color-accent-blue)]"
					: "bg-[oklch(0.78_0.16_75_/_0.15)] text-[var(--color-accent-amber)]",
			)}
		>
			{isCf ? "CF Pages" : "Netlify"}
		</span>
	);
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({
	status,
	note,
}: {
	status: DomainStatus;
	note?: string;
}) {
	if (status === "active") {
		return (
			<span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[oklch(0.72_0.19_155_/_0.12)] text-[var(--color-status-healthy)]">
				<CheckCircle2 size={11} aria-hidden="true" />
				פעיל
			</span>
		);
	}
	if (status === "pending") {
		return (
			<span
				className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[oklch(0.78_0.16_75_/_0.12)] text-[var(--color-accent-amber)]"
				title={note}
			>
				<Clock size={11} aria-hidden="true" />
				{note ?? "ממתין"}
			</span>
		);
	}
	return (
		<span
			className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[oklch(0.62_0.22_25_/_0.12)] text-[var(--color-status-critical)]"
			title={note}
		>
			<AlertTriangle size={11} aria-hidden="true" />
			{note ?? "בעיה"}
		</span>
	);
}

// ── SSL badge ─────────────────────────────────────────────────────────────────

function SslBadge({ ssl }: { ssl: boolean }) {
	if (ssl) {
		return (
			<span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--color-status-healthy)]">
				<Lock size={10} aria-hidden="true" />
				SSL
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--color-text-muted)]">
			<LockOpen size={10} aria-hidden="true" />
			ללא SSL
		</span>
	);
}

// ── Domain card ───────────────────────────────────────────────────────────────

function DomainCard({ entry }: { entry: DomainEntry }) {
	const borderColor =
		entry.status === "active"
			? "border-[oklch(0.72_0.19_155_/_0.15)]"
			: entry.status === "pending"
				? "border-[oklch(0.78_0.16_75_/_0.2)]"
				: "border-[oklch(0.62_0.22_25_/_0.25)]";

	return (
		<article
			className={cn(
				"glass-card p-4 flex flex-col gap-3 transition-colors duration-200",
				borderColor,
			)}
			aria-label={entry.domain}
		>
			{/* Top row: project name + platform */}
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<p className="text-xs text-[var(--color-text-muted)] mb-0.5">
						{entry.project}
					</p>
					<a
						href={`https://${entry.domain}`}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							"inline-flex items-center gap-1 text-sm font-semibold",
							"text-[var(--color-text-primary)] hover:text-[var(--color-accent-blue)]",
							"transition-colors duration-150 min-h-8 rounded",
						)}
						dir="ltr"
					>
						<ExternalLink size={12} aria-hidden="true" className="shrink-0" />
						<span className="truncate">{entry.domain}</span>
					</a>
				</div>
				<PlatformBadge platform={entry.platform} />
			</div>

			{/* Status row */}
			<div className="flex items-center justify-between gap-2 flex-wrap">
				<StatusBadge status={entry.status} note={entry.note} />
				<SslBadge ssl={entry.ssl} />
			</div>
		</article>
	);
}

// ── DNS Record row ────────────────────────────────────────────────────────────

function DnsRecord({
	type,
	name,
	value,
	note,
}: {
	type: string;
	name: string;
	value: string;
	note?: string;
}) {
	return (
		<div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 border-b border-[var(--color-border)] last:border-0">
			<span className="inline-flex items-center justify-center w-14 text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-accent-blue)] font-mono shrink-0">
				{type}
			</span>
			<span
				className="text-xs font-mono text-[var(--color-text-secondary)] min-w-[140px]"
				dir="ltr"
			>
				{name}
			</span>
			<span
				className="text-xs font-mono text-[var(--color-text-muted)] flex-1"
				dir="ltr"
			>
				{value}
			</span>
			{note && (
				<span className="text-[10px] text-[var(--color-text-muted)] italic">
					{note}
				</span>
			)}
		</div>
	);
}

// ── Migration timeline item ────────────────────────────────────────────────────

function TimelineItem({
	date,
	title,
	description,
	done,
}: {
	date: string;
	title: string;
	description: string;
	done: boolean;
}) {
	return (
		<div className="flex gap-4">
			{/* Dot + line */}
			<div className="flex flex-col items-center shrink-0">
				<div
					className={cn(
						"w-3 h-3 rounded-full mt-0.5 shrink-0",
						done
							? "bg-[var(--color-status-healthy)] shadow-[0_0_8px_oklch(0.72_0.19_155_/_0.6)]"
							: "bg-[var(--color-accent-amber)] shadow-[0_0_8px_oklch(0.78_0.16_75_/_0.5)]",
					)}
				/>
				<div
					className="w-px flex-1 bg-[var(--color-border)] mt-1"
					aria-hidden="true"
				/>
			</div>
			{/* Content */}
			<div className="pb-5 min-w-0">
				<p
					className="text-[10px] text-[var(--color-text-muted)] font-mono mb-0.5"
					dir="ltr"
				>
					{date}
				</p>
				<p
					className={cn(
						"text-sm font-semibold mb-1",
						done
							? "text-[var(--color-text-primary)]"
							: "text-[var(--color-accent-amber)]",
					)}
				>
					{title}
				</p>
				<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DomainsPage() {
	const totalDomains = DOMAINS.length;
	const cfCount = DOMAINS.filter((d) => d.platform === "cloudflare").length;
	const netlifyCount = DOMAINS.filter((d) => d.platform === "netlify").length;
	const activeCount = DOMAINS.filter((d) => d.status === "active").length;

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Globe
					size={20}
					className="text-[var(--color-accent-blue)] shrink-0"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						דומיינים ו-DNS
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						כל הדומיינים, DNS, ופלטפורמות הפריסה
					</p>
				</div>
			</div>

			{/* Section 1: Overview stats */}
			<section aria-labelledby="overview-heading">
				<h2
					id="overview-heading"
					className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3"
				>
					סקירה כללית
				</h2>
				<div className="flex flex-wrap gap-3">
					<StatCard
						label="סה״כ דומיינים"
						value={totalDomains}
						icon={Globe}
						color="text-[var(--color-accent-blue)]"
					/>
					<StatCard
						label="CF Pages"
						value={cfCount}
						icon={Wifi}
						color="text-[var(--color-accent-blue)]"
					/>
					<StatCard
						label="Netlify"
						value={netlifyCount}
						icon={Server}
						color="text-[var(--color-accent-amber)]"
					/>
					<StatCard
						label="פעילים"
						value={activeCount}
						icon={ShieldCheck}
						color="text-[var(--color-status-healthy)]"
					/>
				</div>
			</section>

			{/* Section 2: All deployed sites */}
			<section aria-labelledby="sites-heading">
				<h2
					id="sites-heading"
					className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3"
				>
					כל האתרים הפרוסים
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{DOMAINS.map((entry) => (
						<DomainCard key={entry.domain} entry={entry} />
					))}
				</div>
			</section>

			{/* Section 3: DNS configuration */}
			<section aria-labelledby="dns-heading">
				<h2
					id="dns-heading"
					className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3"
				>
					קונפיגורציית DNS
				</h2>
				<div className="glass-card p-5 flex flex-col gap-4">
					{/* Info row */}
					<div className="flex flex-wrap gap-4 pb-4 border-b border-[var(--color-border)]">
						<div className="flex flex-col gap-0.5">
							<p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">
								רשם דומיין
							</p>
							<p className="text-sm font-semibold text-[var(--color-text-primary)]">
								GoDaddy
							</p>
							<p className="text-xs text-[var(--color-text-muted)]">nadav.ai</p>
						</div>
						<div className="flex flex-col gap-0.5">
							<p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">
								ספק DNS
							</p>
							<p className="text-sm font-semibold text-[var(--color-text-primary)]">
								Cloudflare
							</p>
							<p className="text-xs text-[var(--color-text-muted)]">
								Nameservers managed by CF
							</p>
						</div>
						<div className="flex flex-col gap-0.5">
							<p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">
								פרוקסי
							</p>
							<p className="text-sm font-semibold text-[var(--color-text-primary)]">
								Cloudflare Proxy
							</p>
							<p className="text-xs text-[var(--color-text-muted)]">
								כל ה-subdomains דרך CF
							</p>
						</div>
					</div>

					{/* DNS records table */}
					<div>
						<p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
							רשומות DNS עיקריות
						</p>
						<DnsRecord
							type="NS"
							name="nadav.ai"
							value="chad.ns.cloudflare.com"
							note="Nameserver ראשי"
						/>
						<DnsRecord
							type="NS"
							name="nadav.ai"
							value="rose.ns.cloudflare.com"
							note="Nameserver משני"
						/>
						<DnsRecord
							type="CNAME"
							name="*.nadav.ai"
							value="<project>.pages.dev"
							note="כל ה-subdomains"
						/>
						<DnsRecord
							type="CNAME"
							name="nadav.ai"
							value="nadavai.pages.dev"
							note="Apex domain"
						/>
						<DnsRecord
							type="CNAME"
							name="dashboard.nadav.ai"
							value="ממתין"
							note="לא מוגדר עדיין"
						/>
					</div>

					{/* Note */}
					<p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] rounded-lg px-3 py-2">
						כל ה-subdomains תחת nadav.ai מנותבים דרך Cloudflare Pages. שגיאות
						SSL נפתרות אוטומטית ע"י CF.
					</p>
				</div>
			</section>

			{/* Section 4: Migration history */}
			<section aria-labelledby="migration-heading">
				<h2
					id="migration-heading"
					className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3"
				>
					היסטוריית מיגרציה
				</h2>
				<div className="glass-card p-5">
					{/* Migration highlight banner */}
					<div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-[oklch(0.72_0.19_155_/_0.08)] border border-[oklch(0.72_0.19_155_/_0.2)]">
						<TrendingDown
							size={18}
							className="text-[var(--color-status-healthy)] shrink-0"
							aria-hidden="true"
						/>
						<div>
							<p className="text-sm font-bold text-[var(--color-status-healthy)]">
								חיסכון: $170/חודש → $0
							</p>
							<p className="text-xs text-[var(--color-text-secondary)]">
								Vercel Pro → Cloudflare Pages + Netlify (חינם)
							</p>
						</div>
					</div>

					{/* Timeline */}
					<div>
						<TimelineItem
							date="מרץ 2026 — שלב 1"
							title="מיגרציה מ-Vercel Pro"
							description="הגדרת Cloudflare Pages לכל 8 אתרי React/Next.js. חיבור nameservers ל-Cloudflare."
							done
						/>
						<TimelineItem
							date="מרץ 2026 — שלב 2"
							title="8 CF Pages + Netlify פעילים"
							description="mexicani, chance-pro, nadavai, cash-control, shifts, hatumdigital, brain, signature-pro על CF Pages. mediflow ו-vibechat על Netlify."
							done
						/>
						<TimelineItem
							date="מרץ 2026 — שלב 3"
							title="dashboard.nadav.ai — ממתין CNAME"
							description="APEX Dashboard עדיין ממתין לרשומת CNAME ב-GoDaddy. SSL לא פעיל עד שהרשומה תוגדר."
							done={false}
						/>
						<TimelineItem
							date="ממתין"
							title="ביטול Vercel Pro"
							description="לאחר אימות שכל האתרים פועלים תקין על CF Pages ו-Netlify, לבטל את מנוי Vercel Pro. חיסכון שוטף $170/חודש."
							done={false}
						/>
					</div>

					{/* Platform summary */}
					<div className="mt-2 pt-4 border-t border-[var(--color-border)] grid grid-cols-2 gap-3">
						<div className="p-3 rounded-xl bg-[var(--color-bg-elevated)] flex flex-col gap-1">
							<p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">
								CF Pages
							</p>
							<p
								className="text-2xl font-bold text-[var(--color-accent-blue)] tabular-nums"
								dir="ltr"
							>
								8
							</p>
							<p className="text-xs text-[var(--color-text-secondary)]">
								אתרים פעילים
							</p>
						</div>
						<div className="p-3 rounded-xl bg-[var(--color-bg-elevated)] flex flex-col gap-1">
							<p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">
								Netlify
							</p>
							<p
								className="text-2xl font-bold text-[var(--color-accent-amber)] tabular-nums"
								dir="ltr"
							>
								2
							</p>
							<p className="text-xs text-[var(--color-text-secondary)]">
								אתרים (build issues)
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
