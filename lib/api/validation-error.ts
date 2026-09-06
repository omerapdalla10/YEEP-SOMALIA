import type { ZodError, ZodIssue } from "zod";

/** "currentPassword" / "user.email" -> "Current password" / "Email". */
export function humanizeField(path: (string | number)[]): string {
  const last = String(path[path.length - 1] ?? "value");
  const words = last
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Turn one Zod issue into a plain-English sentence naming the field. */
export function humanizeIssue(issue: ZodIssue): string {
  const field = humanizeField(issue.path);

  switch (issue.code) {
    case "invalid_type":
      return issue.received === "undefined" || issue.received === "null"
        ? `${field} is required.`
        : `${field} has the wrong type.`;
    case "too_small": {
      const n = Number(issue.minimum);
      if (issue.type === "string")
        return n <= 1 ? `${field} is required.` : `${field} must be at least ${n} characters.`;
      if (issue.type === "array")
        return `${field} must have at least ${n} item${n === 1 ? "" : "s"}.`;
      return `${field} must be at least ${n}.`;
    }
    case "too_big": {
      const n = Number(issue.maximum);
      if (issue.type === "string") return `${field} must be at most ${n} characters.`;
      if (issue.type === "array")
        return `${field} must have at most ${n} item${n === 1 ? "" : "s"}.`;
      return `${field} must be at most ${n}.`;
    }
    case "invalid_string":
      if (issue.validation === "email") return `${field} must be a valid email address.`;
      if (issue.validation === "url") return `${field} must be a valid URL.`;
      if (issue.validation === "datetime") return `${field} must be a valid date.`;
      return `${field} is not in the right format.`;
    case "invalid_enum_value":
      return `${field} must be one of: ${(issue.options as unknown[]).join(", ")}.`;
    case "unrecognized_keys":
      return `Unexpected field${issue.keys.length === 1 ? "" : "s"}: ${issue.keys.join(", ")}.`;
    case "invalid_union":
      return `${field} is not valid.`;
    default:
      return issue.message.endsWith(".") ? issue.message : `${issue.message}.`;
  }
}

export interface FormattedValidationError {
  message: string;
  fields: Record<string, string>;
}

/** Build a friendly `{ message, fields }` payload from a ZodError. */
export function formatZodError(err: ZodError): FormattedValidationError {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_form";
    if (!fields[key]) fields[key] = humanizeIssue(issue);
  }
  const keys = Object.keys(fields);
  const message =
    keys.length === 1 ? fields[keys[0]] : `Please fix ${keys.length} fields and try again.`;
  return { message, fields };
}
