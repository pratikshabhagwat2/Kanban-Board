import { Priority } from "../types";

export const getPriorityColor = (priority?: Priority): string => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "info";
  }
};

export const getPriorityLabel = (priority?: Priority): string => {
  return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "Medium";
};
