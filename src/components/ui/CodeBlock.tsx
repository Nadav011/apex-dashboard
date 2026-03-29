import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

interface CodeBlockProps {
	code: string;
	title?: string;
	className?: string;
}

export function CodeBlock({ code, title, className }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		void navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [code]);

	return (
		<div
			className={cn(
				"rounded-lg border border-border overflow-hidden",
				className,
			)}
		>
			{title && (
				<div className="flex items-center justify-between px-4 py-2 bg-bg-elevated border-b border-border">
					<span className="text-xs font-medium text-text-secondary">
						{title}
					</span>
					<CopyButton copied={copied} onClick={handleCopy} />
				</div>
			)}
			<div className="relative">
				{!title && (
					<div className="absolute top-2 end-2 z-10">
						<CopyButton copied={copied} onClick={handleCopy} />
					</div>
				)}
				<pre
					className="overflow-x-auto p-4 text-sm font-mono leading-relaxed text-text-primary bg-bg-primary"
					dir="ltr"
				>
					<code>{code}</code>
				</pre>
			</div>
		</div>
	);
}

function CopyButton({
	copied,
	onClick,
}: {
	copied: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex items-center gap-1 px-2 py-1 rounded text-xs",
				"border border-border hover:bg-bg-tertiary transition-colors duration-150",
				copied ? "text-accent-green" : "text-text-muted",
			)}
		>
			{copied ? <Check size={12} /> : <Copy size={12} />}
			{copied ? "הועתק" : "העתק"}
		</button>
	);
}
