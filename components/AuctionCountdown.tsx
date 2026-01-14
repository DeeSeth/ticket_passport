'use client';

import { useState, useEffect } from 'react';

interface AuctionCountdownProps {
  endsAt: Date | string;
  onEnd?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(endsAt: Date): TimeLeft {
  const difference = endsAt.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export default function AuctionCountdown({
  endsAt,
  onEnd,
  size = 'md',
  showLabel = true,
  className = '',
}: AuctionCountdownProps) {
  const endDate = typeof endsAt === 'string' ? new Date(endsAt) : endsAt;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(endDate));
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0 && !hasEnded) {
        setHasEnded(true);
        onEnd?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, hasEnded, onEnd]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const boxSizeClasses = {
    sm: 'px-1.5 py-0.5 min-w-[28px]',
    md: 'px-2 py-1 min-w-[36px]',
    lg: 'px-3 py-1.5 min-w-[44px]',
  };

  const labelSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  // Determine urgency level for styling
  const isUrgent = timeLeft.total > 0 && timeLeft.total <= 1000 * 60 * 60; // < 1 hour
  const isEnding = timeLeft.total > 0 && timeLeft.total <= 1000 * 60 * 60 * 24; // < 24 hours

  if (hasEnded || timeLeft.total <= 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className={`font-medium text-red-400 ${sizeClasses[size]}`}>
            Auction Ended
          </span>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={`${className}`}>
      {showLabel && (
        <p className={`text-neutral-500 mb-1 ${labelSizeClasses[size]}`}>
          {isUrgent ? 'Ending soon!' : isEnding ? 'Ends in' : 'Time remaining'}
        </p>
      )}
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <div
              className={`bg-neutral-700 rounded text-center ${boxSizeClasses[size]} ${
                isUrgent ? 'bg-red-900/50' : isEnding ? 'bg-amber-900/30' : ''
              }`}
            >
              <span
                className={`font-mono font-bold ${sizeClasses[size]} ${
                  isUrgent ? 'text-red-400' : isEnding ? 'text-amber-200' : 'text-white'
                }`}
              >
                {timeLeft.days}
              </span>
              <span className={`text-neutral-500 ml-0.5 ${labelSizeClasses[size]}`}>d</span>
            </div>
            <span className="text-neutral-600">:</span>
          </>
        )}
        <div
          className={`bg-neutral-700 rounded text-center ${boxSizeClasses[size]} ${
            isUrgent ? 'bg-red-900/50' : isEnding ? 'bg-amber-900/30' : ''
          }`}
        >
          <span
            className={`font-mono font-bold ${sizeClasses[size]} ${
              isUrgent ? 'text-red-400' : isEnding ? 'text-amber-200' : 'text-white'
            }`}
          >
            {formatNumber(timeLeft.hours)}
          </span>
          <span className={`text-neutral-500 ml-0.5 ${labelSizeClasses[size]}`}>h</span>
        </div>
        <span className="text-neutral-600">:</span>
        <div
          className={`bg-neutral-700 rounded text-center ${boxSizeClasses[size]} ${
            isUrgent ? 'bg-red-900/50' : isEnding ? 'bg-amber-900/30' : ''
          }`}
        >
          <span
            className={`font-mono font-bold ${sizeClasses[size]} ${
              isUrgent ? 'text-red-400' : isEnding ? 'text-amber-200' : 'text-white'
            }`}
          >
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className={`text-neutral-500 ml-0.5 ${labelSizeClasses[size]}`}>m</span>
        </div>
        <span className="text-neutral-600">:</span>
        <div
          className={`bg-neutral-700 rounded text-center ${boxSizeClasses[size]} ${
            isUrgent ? 'bg-red-900/50 animate-pulse' : isEnding ? 'bg-amber-900/30' : ''
          }`}
        >
          <span
            className={`font-mono font-bold ${sizeClasses[size]} ${
              isUrgent ? 'text-red-400' : isEnding ? 'text-amber-200' : 'text-white'
            }`}
          >
            {formatNumber(timeLeft.seconds)}
          </span>
          <span className={`text-neutral-500 ml-0.5 ${labelSizeClasses[size]}`}>s</span>
        </div>
      </div>
    </div>
  );
}
