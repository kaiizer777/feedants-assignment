const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Formats a date string into "10 Aug 26" format matching Objective_Page.png
 */
export const formatDateDisplay = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "--";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "--";

  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day} ${month} ${year}`;
};

/**
 * Formats time into "11:50 PM" or "04:00 AM" matching Objective_Page.png
 */
export const formatTimeDisplay = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "--";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "--";

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");

  return `${hoursStr}:${minutesStr} ${ampm}`;
};

/**
 * Formats currency amount with rupee symbol and Indian number formatting: ₹ 1,500
 */
export const formatCurrency = (amount: number | undefined): string => {
  if (typeof amount !== "number" || isNaN(amount)) return "₹ 0";
  return `₹ ${amount.toLocaleString("en-IN")}`;
};

/**
 * Formats milliseconds remaining into "01d : 06h : 28m : 32s" format
 */
export const formatCountdownUnits = (
  msRemaining: number
): {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  formatted: string;
  isExpired: boolean;
} => {
  if (msRemaining <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      formatted: "00d : 00h : 00m : 00s",
      isExpired: true,
    };
  }

  const totalSeconds = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const dStr = String(days).padStart(2, "0");
  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  return {
    days: dStr,
    hours: hStr,
    minutes: mStr,
    seconds: sStr,
    formatted: `${dStr}d : ${hStr}h : ${mStr}m : ${sStr}s`,
    isExpired: false,
  };
};
