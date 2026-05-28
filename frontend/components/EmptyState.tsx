import Link from "next/link";

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 border border-teal-100">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="3"
            stroke="#0d9488"
            strokeWidth="1.5"
          />
          <path
            d="M8 2v4M16 2v4M3 10h18"
            stroke="#0d9488"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 14h1M12 14h1M16 14h1M8 17h1M12 17h1"
            stroke="#0d9488"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary text-sm">
          + {actionLabel}
        </Link>
      )}
    </div>
  );
}
