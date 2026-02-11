export default function StarRating({
  rating,
  count,
}: {
  rating: number;
  count?: number;
}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-amber-400">
            ★
          </span>
        ))}
        {hasHalf && <span className="text-amber-400">★</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-zinc-200">
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-zinc-700">{rating}</span>
      {count !== undefined && (
        <span className="text-xs text-zinc-400">({count})</span>
      )}
    </div>
  );
}
