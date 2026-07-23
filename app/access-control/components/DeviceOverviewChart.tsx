'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type Props = {
  approved: number;
  blocked: number;
  quarantined: number;
  unknown: number;
  total: number;
};

const COLORS = ['#35c25b', '#ef4444', '#f59e0b', '#8b5cf6'];

export function DeviceOverviewChart({ approved, blocked, quarantined, unknown, total }: Props) {
  const data = [
    { name: 'Approved', value: approved },
    { name: 'Blocked', value: blocked },
    { name: 'Quarantined', value: quarantined },
    { name: 'Unknown', value: unknown },
  ];

  const legend = [
    { label: 'Approved', value: `${approved} (${total > 0 ? ((approved / total) * 100).toFixed(1) : 0}%)`, color: '#35c25b' },
    { label: 'Blocked', value: `${blocked} (${total > 0 ? ((blocked / total) * 100).toFixed(1) : 0}%)`, color: '#ef4444' },
    { label: 'Quarantined', value: `${quarantined} (${total > 0 ? ((quarantined / total) * 100).toFixed(1) : 0}%)`, color: '#f59e0b' },
    { label: 'Unknown', value: `${unknown} (${total > 0 ? ((unknown / total) * 100).toFixed(1) : 0}%)`, color: '#8b5cf6' },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-20 w-20 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={26}
              outerRadius={38}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{total}</span>
          <span className="text-[9px] text-slate-400">Devices</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.label}</span>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
