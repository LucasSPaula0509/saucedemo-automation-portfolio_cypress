/**
 * Métricas de uma navegação completa (Navigation Timing Level 2 + Largest Contentful Paint), em
 * milissegundos a partir do início da navegação. lcpMs é null quando o navegador não expõe LCP.
 */
export interface NavigationMetrics {
  readonly url: string;
  readonly timeToFirstByteMs: number;
  readonly domContentLoadedMs: number;
  readonly loadMs: number;
  readonly lcpMs: number | null;
}

export function navigationMetricsToJson(metrics: NavigationMetrics): string {
  const round = (value: number): number => Math.round(value * 10) / 10;
  return JSON.stringify(
    {
      url: metrics.url,
      timeToFirstByteMs: round(metrics.timeToFirstByteMs),
      domContentLoadedMs: round(metrics.domContentLoadedMs),
      loadMs: round(metrics.loadMs),
      largestContentfulPaintMs: metrics.lcpMs === null ? null : round(metrics.lcpMs),
    },
    null,
    2,
  );
}
