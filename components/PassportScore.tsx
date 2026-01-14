'use client';

interface PassportScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function PassportScore({ score, size = 'md', showLabel = true }: PassportScoreProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: '#10b981', bg: '#064e3b', text: 'text-emerald-400' }; // Green
    if (score >= 60) return { stroke: '#fbbf24', bg: '#78350f', text: 'text-amber-400' }; // Yellow
    return { stroke: '#ef4444', bg: '#7f1d1d', text: 'text-red-400' }; // Red
  };

  const colors = getScoreColor(score);

  const sizes = {
    sm: { container: 'w-16 h-16', strokeWidth: 4, fontSize: 'text-lg', labelSize: 'text-xs' },
    md: { container: 'w-24 h-24', strokeWidth: 5, fontSize: 'text-2xl', labelSize: 'text-sm' },
    lg: { container: 'w-32 h-32', strokeWidth: 6, fontSize: 'text-3xl', labelSize: 'text-base' },
  };

  const { container, strokeWidth, fontSize, labelSize } = sizes[size];

  // Calculate circle parameters
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={`${container} relative`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colors.bg}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Score number in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${fontSize} font-bold ${colors.text}`}>{score}</span>
        </div>
      </div>
      {showLabel && (
        <span className={`mt-2 ${labelSize} font-medium text-neutral-400`}>Passport Score</span>
      )}
    </div>
  );
}
