export function formatDate(date?: string | null) {
  if (!date) return "Present";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatLongDate(date?: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function groupBy<T>(items: T[], key: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] ?? [];
    groups[group].push(item);
    return groups;
  }, {});
}

export function plainText(input?: string | null) {
  return (input ?? "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/<\/?(?:h[1-6]|p|ul|ol|li|strong|em|br|blockquote|div|span|a|img)/gi, " ")
    .replace(/[#*_>`~\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
