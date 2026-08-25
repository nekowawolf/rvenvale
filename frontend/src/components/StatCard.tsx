"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  loading?: boolean;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  loading = false,
  description,
}: StatCardProps) {
  return (
    <div className="bg-[var(--fill-color)] rounded-2xl border border-[var(--border-divider)] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-xl">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-secondary truncate">{title}</p>
        {loading ? (
          <div className="mt-1 h-7 w-24 bg-[var(--border-divider)] rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-primary mt-0.5 truncate">
            {value}
          </p>
        )}
        {description && !loading && (
          <p className="text-xs text-muted mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}