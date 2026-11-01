import React from 'react';
import { CivicIssue, IssueCategory } from '../types';
import { CATEGORIES } from '../utils/helpers';

interface CategoryChartProps {
  issues: CivicIssue[];
}

export const CategoryDistributionChart: React.FC<CategoryChartProps> = ({ issues }) => {
  const total = issues.length;

  const countsByCategory: Record<IssueCategory, number> = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = issues.filter((i) => i.category === cat).length;
      return acc;
    },
    {} as Record<IssueCategory, number>
  );

  const colors = [
    '#3B82F6', // Blue
    '#0EA5E9', // Sky
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#6366F1', // Indigo
    '#EF4444', // Red
    '#8B5CF6', // Purple
  ];

  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-slate-400">
        No complaint data available
      </div>
    );
  }

  // Calculate angles for donut chart
  let cumulativeAngle = 0;
  const radius = 64;
  const cx = 90;
  const cy = 90;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0 w-[180px] h-[180px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180" aria-label="Issue category chart">
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
          />
          {CATEGORIES.map((cat, idx) => {
            const count = countsByCategory[cat];
            if (count === 0) return null;
            const fraction = count / total;
            const dashArray = `${fraction * circumference} ${circumference}`;
            const dashOffset = -cumulativeAngle * circumference;
            cumulativeAngle += fraction;

            return (
              <circle
                key={cat}
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={colors[idx % colors.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-300 hover:opacity-80"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {total}
          </span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total Issues
          </span>
        </div>
      </div>

      <div className="flex-1 w-full grid grid-cols-1 gap-2 text-xs">
        {CATEGORIES.map((cat, idx) => {
          const count = countsByCategory[cat];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={cat} className="flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                  aria-hidden="true"
                />
                <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                  {cat}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                <span className="text-slate-400 dark:text-slate-600">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface MonthlyTrendProps {
  issues: CivicIssue[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendProps> = ({ issues }) => {
  // Aggregate last 6 months from 2026-11 down or based on current date
  const now = new Date('2026-11-01T00:00:00Z');
  const monthLabels: { key: string; label: string; year: number; month: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'short' });
    monthLabels.push({ key, label, year: d.getFullYear(), month: d.getMonth() });
  }

  const monthlyData = monthLabels.map(({ key, label }) => {
    const reportedInMonth = issues.filter((i) => {
      try {
        const d = new Date(i.reportedAt);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return k === key;
      } catch {
        return false;
      }
    });

    const resolvedInMonth = issues.filter((i) => {
      if (i.currentStatus !== 'Resolved') return false;
      try {
        const d = new Date(i.lastUpdatedAt);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return k === key;
      } catch {
        return false;
      }
    });

    return {
      month: label,
      key,
      reported: reportedInMonth.length,
      resolved: resolvedInMonth.length,
    };
  });

  const maxVal = Math.max(...monthlyData.map((d) => Math.max(d.reported, d.resolved, 3)));
  const chartHeight = 130;

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-5 mb-4 text-xs font-medium">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-3 h-3 rounded-xs bg-sky-500" />
          <span>Reported</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-3 h-3 rounded-xs bg-emerald-500" />
          <span>Resolved</span>
        </div>
      </div>

      <div className="relative h-[160px] flex items-end justify-between gap-2 pt-6 border-b border-slate-200 dark:border-slate-800">
        {monthlyData.map((d) => {
          const repHeight = (d.reported / maxVal) * chartHeight;
          const resHeight = (d.resolved / maxVal) * chartHeight;

          return (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                {/* Reported bar */}
                <div
                  className="w-3 sm:w-5 bg-sky-500/80 hover:bg-sky-500 rounded-t-xs transition-all relative"
                  style={{ height: `${Math.max(repHeight, 4)}px` }}
                  title={`${d.reported} reported in ${d.month}`}
                >
                  {d.reported > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono tabular-nums text-slate-600 dark:text-slate-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.reported}
                    </span>
                  )}
                </div>

                {/* Resolved bar */}
                <div
                  className="w-3 sm:w-5 bg-emerald-500/80 hover:bg-emerald-500 rounded-t-xs transition-all relative"
                  style={{ height: `${Math.max(resHeight, 4)}px` }}
                  title={`${d.resolved} resolved in ${d.month}`}
                >
                  {d.resolved > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.resolved}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate">
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PrioritySegmentBar: React.FC<{ issues: CivicIssue[] }> = ({ issues }) => {
  const total = issues.length;
  const critical = issues.filter((i) => i.priority === 'Critical').length;
  const high = issues.filter((i) => i.priority === 'High').length;
  const medium = issues.filter((i) => i.priority === 'Medium').length;
  const low = issues.filter((i) => i.priority === 'Low').length;

  if (total === 0) return null;

  const critPct = (critical / total) * 100;
  const highPct = (high / total) * 100;
  const medPct = (medium / total) * 100;
  const lowPct = (low / total) * 100;

  return (
    <div className="space-y-3">
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
        {critical > 0 && (
          <div
            style={{ width: `${critPct}%` }}
            className="bg-rose-500 h-full transition-all"
            title={`Critical: ${critical}`}
          />
        )}
        {high > 0 && (
          <div
            style={{ width: `${highPct}%` }}
            className="bg-amber-500 h-full transition-all"
            title={`High: ${high}`}
          />
        )}
        {medium > 0 && (
          <div
            style={{ width: `${medPct}%` }}
            className="bg-blue-500 h-full transition-all"
            title={`Medium: ${medium}`}
          />
        )}
        {low > 0 && (
          <div
            style={{ width: `${lowPct}%` }}
            className="bg-slate-400 h-full transition-all"
            title={`Low: ${low}`}
          />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-slate-600 dark:text-slate-400">Critical</span>
          <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white ml-auto">
            {critical}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-slate-600 dark:text-slate-400">High</span>
          <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white ml-auto">
            {high}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-slate-600 dark:text-slate-400">Medium</span>
          <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white ml-auto">
            {medium}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-slate-600 dark:text-slate-400">Low</span>
          <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white ml-auto">
            {low}
          </span>
        </div>
      </div>
    </div>
  );
};
