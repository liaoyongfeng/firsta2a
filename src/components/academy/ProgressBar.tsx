export default function ProgressBar({
  percent,
  color = 'indigo',
}: {
  percent: number;
  color?: 'indigo' | 'green' | 'purple';
}) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  const bgMap: Record<string, string> = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${bgMap[color]}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">
        {clampedPercent}%
      </span>
    </div>
  );
}
