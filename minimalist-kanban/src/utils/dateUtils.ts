import { differenceInCalendarDays, format, parseISO } from "date-fns";

/** returns short label like "Aug 9" */
export function formatDueDate(iso?: string) {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM d");
  } catch {
    return "";
  }
}

/** returns material chip color string */
export function dueChipColor(iso?: string): "default" | "success" | "warning" | "error" {
  if (!iso) return "default";
  try {
    const days = differenceInCalendarDays(parseISO(iso), new Date());
    if (days < 0) return "error";
    if (days <= 2) return "warning";
    return "success";
  } catch {
    return "default";
  }
}
