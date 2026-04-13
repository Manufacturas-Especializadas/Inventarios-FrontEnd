export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("es-Mx", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};
