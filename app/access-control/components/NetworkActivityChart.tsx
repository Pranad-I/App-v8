'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from 'recharts';

export type ActivityPoint = {
  hour_label: string;
  connections: number;
  approvals: number;
  blocks: number;
  quarantines: number;
  unknowns: number;
};

type Props = {
  data: ActivityPoint[];
  legendCounts: { connections: number; approvals: number; blocks: number; quarantines: number; unknowns: number };
};

const activityLegend = [
  { label: 'Connections', color: '#2b65ff', key: 'connections' as const },
  { label: 'Approvals', color: '#35c25b', key: 'approvals' as const },
  { label: 'Blocks', color: '#ff4d57', key: 'blocks' as const },
  { label: 'Quarantines', color: '#f59e0b', key: 'quarantines' as const },
  { label: 'Unknowns', color: '#8b5cf6', key: 'unknowns' as const },
];

export function NetworkActivityChart({ data, legendCounts }: Props) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3">
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="hour_label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 11, padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            {activityLegend.map((item) => (
              <Line key={item.key} type="monotone" dataKey={item.key} stroke={item.color} strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex min-w-[90px] flex-col justify-center gap-2">
        {activityLegend.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.label}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
              {legendCounts[item.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
