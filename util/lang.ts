const intFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

const floatFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

export function pluralize(n: number, singular: string, plural: string) {
  return `${intFormatter.format(n)} ${n !== 1 ? plural : singular}`;
}

export function formatInt(n: number) {
  return intFormatter.format(n);
}

export function formatFloat(n: number) {
  return floatFormatter.format(n);
}
