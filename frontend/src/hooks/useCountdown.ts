import { useEffect, useState } from "react";
import { formatCountdownUnits } from "../utils/formatters";

export interface CountdownResult {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  formatted: string;
  isExpired: boolean;
}

export const useCountdown = (targetDate: string | Date | undefined): CountdownResult => {
  const calculateRemaining = (): number => {
    if (!targetDate) return 0;
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    return Math.max(0, target - now);
  };

  const [msRemaining, setMsRemaining] = useState<number>(calculateRemaining);

  useEffect(() => {
    // Reset immediately when target changes
    setMsRemaining(calculateRemaining());

    if (!targetDate) return;

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setMsRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return formatCountdownUnits(msRemaining);
};
