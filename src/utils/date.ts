const DEFAULT_LOCALE = "ru-RU";

const normalizeDateInput = (value?: string | Date | null) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const normalizedValue =
    /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}Z`;
  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const parseDate = (value?: string | Date | null) =>
  normalizeDateInput(value);

export const formatDateTime = (
  value?: string | Date | null,
  locale = DEFAULT_LOCALE,
  options?: Intl.DateTimeFormatOptions,
) => {
  const date = normalizeDateInput(value);

  if (!date) return "Нет данных";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(date);
};

export const formatDateOnly = (
  value?: string | Date | null,
  locale = DEFAULT_LOCALE,
  options?: Intl.DateTimeFormatOptions,
) =>
  formatDateTime(value, locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: undefined,
    minute: undefined,
    ...options,
  });

export const formatTimeOnly = (
  value?: string | Date | null,
  locale = DEFAULT_LOCALE,
  options?: Intl.DateTimeFormatOptions,
) =>
  formatDateTime(value, locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: undefined,
    month: undefined,
    year: undefined,
    ...options,
  });
