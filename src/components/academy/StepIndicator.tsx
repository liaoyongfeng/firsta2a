export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-indigo-600 text-white'
                    : isCurrent
                      ? 'border-2 border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-2 border-zinc-200 bg-white text-zinc-400'
                }`}
              >
                {isCompleted ? '✓' : step}
              </div>
              {labels && labels[i] && (
                <span
                  className={`text-xs ${isCurrent ? 'font-medium text-indigo-600' : 'text-zinc-400'}`}
                >
                  {labels[i]}
                </span>
              )}
            </div>
            {step < totalSteps && (
              <div
                className={`h-0.5 w-12 transition-colors ${
                  isCompleted ? 'bg-indigo-600' : 'bg-zinc-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
