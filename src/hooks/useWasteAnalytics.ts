import { useMemo } from 'react';
import {
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  subDays
} from 'date-fns';
import type { WasteDataset, WasteRecord } from '../data/types';

export type DateRangeOption = 'acumulado' | 'mes' | 'ultimos7' | 'ultimos14';

export interface WasteFilters {
  reason: string;
  product: string;
  range: DateRangeOption;
}

export interface KpiCard {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface WasteAnalytics {
  filteredRecords: WasteRecord[];
  kpis: KpiCard[];
  dailyWasteSeries: Array<{
    date: string;
    wasteCost: number;
    wasteKg: number;
    wastePrice: number;
  }>;
  productWasteSeries: Array<{
    product: string;
    wasteCost: number;
    wastePrice: number;
  }>;
  reasonDistribution: Array<{ reason: string; wasteCost: number }>;
  peakDay: { date: string; wasteCost: number } | null;
}

const normalizeNumber = (value: number | null | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const applyFilters = (
  records: WasteRecord[],
  { reason, product, range }: WasteFilters,
  referenceDate: Date
): WasteRecord[] => {
  const endDate = referenceDate;
  const baseStart = startOfMonth(endDate);
  const startDate =
    range === 'mes'
      ? baseStart
      : range === 'ultimos7'
        ? subDays(endDate, 7)
        : range === 'ultimos14'
          ? subDays(endDate, 14)
          : null;

  return records.filter((record) => {
    const recordDate = parseISO(record.date);
    if (
      range !== 'acumulado' &&
      startDate &&
      (isBefore(recordDate, startDate) || isAfter(recordDate, endDate))
    ) {
      return false;
    }
    if (reason !== 'todos' && record.reason !== reason) {
      return false;
    }
    if (product !== 'todos' && record.product !== product) {
      return false;
    }
    return true;
  });
};

const WASTE_REASON_FALLBACK = 'Sem motivo informado';

export const useWasteAnalytics = (
  dataset: WasteDataset,
  filters: WasteFilters
): WasteAnalytics =>
  useMemo(() => {
    const latestRecordDate = dataset.wasteRecords.reduce<Date>(
      (acc, record) => {
        const current = parseISO(record.date);
        return current > acc ? current : acc;
      },
      dataset.wasteRecords.length > 0
        ? parseISO(dataset.wasteRecords[0].date)
        : new Date()
    );

    const filteredRecords = applyFilters(
      dataset.wasteRecords,
      filters,
      latestRecordDate
    );

    const totals = filteredRecords.reduce(
      (acc, record) => {
        const wasteCost = normalizeNumber(record.wasteCost);
        const wasteKg = normalizeNumber(record.wasteKg);
        const wastePrice = normalizeNumber(record.wastePrice);
        acc.wasteCost += wasteCost;
        acc.wasteKg += wasteKg;
        acc.wastePrice += wastePrice;
        const key = format(parseISO(record.date), 'yyyy-MM-dd');
        if (!acc.byDay[key]) {
          acc.byDay[key] = { wasteCost: 0, wasteKg: 0, wastePrice: 0 };
        }
        acc.byDay[key].wasteCost += wasteCost;
        acc.byDay[key].wasteKg += wasteKg;
        acc.byDay[key].wastePrice += wastePrice;
        if (!acc.byProduct[record.product]) {
          acc.byProduct[record.product] = { wasteCost: 0, wastePrice: 0 };
        }
        acc.byProduct[record.product].wasteCost += wasteCost;
        acc.byProduct[record.product].wastePrice += wastePrice;
        const category = record.category ?? 'Sem categoria';
        if (!acc.byCategory[category]) {
          acc.byCategory[category] = { wasteCost: 0, wastePrice: 0 };
        }
        acc.byCategory[category].wasteCost += wasteCost;
        acc.byCategory[category].wastePrice += wastePrice;
        const reason = record.reason ?? WASTE_REASON_FALLBACK;
        if (!acc.byReason[reason]) {
          acc.byReason[reason] = 0;
        }
        acc.byReason[reason] += wasteCost;
        return acc;
      },
      {
        wasteCost: 0,
        wasteKg: 0,
        wastePrice: 0,
        byDay: {} as Record<string, { wasteCost: number; wasteKg: number; wastePrice: number }>,
        byProduct: {} as Record<string, { wasteCost: number; wastePrice: number }>,
        byCategory: {} as Record<string, { wasteCost: number; wastePrice: number }>,
        byReason: {} as Record<string, number>
      }
    );

    const { clientInfo } = dataset;
    const dailyEntries = Object.entries(totals.byDay)
      .map(([date, value]) => ({
        date,
        wasteCost: value.wasteCost,
        wasteKg: value.wasteKg,
        wastePrice: value.wastePrice
      }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    const productWasteSeries = Object.entries(totals.byProduct)
      .map(([product, metrics]) => ({
        product,
        wasteCost: metrics.wasteCost,
        wastePrice: metrics.wastePrice
      }))
      .sort(
        (a, b) =>
          b.wasteCost + b.wastePrice - (a.wasteCost + a.wastePrice)
      )
      .slice(0, 6);

    const reasonDistribution = Object.entries(totals.byReason)
      .map(([reason, wasteCost]) => ({ reason, wasteCost }))
      .sort((a, b) => b.wasteCost - a.wasteCost);

    const peakDay = dailyEntries.reduce<WasteAnalytics['peakDay']>(
      (acc, entry) => {
        if (!acc || entry.wasteCost > acc.wasteCost) {
          return entry;
        }
        return acc;
      },
      null
    );

    const daysConsidered = dailyEntries.length || 1;
    const monthSegments =
      filteredRecords.length > 0
        ? new Set(
            filteredRecords.map((record) =>
              format(parseISO(record.date), 'yyyy-MM')
            )
          ).size
        : 1;
    const averageDailyWaste = totals.wasteCost / daysConsidered;
    const faturamentoMedio = normalizeNumber(clientInfo.faturamentoMedio);
    const faturamentoReferencia =
      monthSegments > 1 ? faturamentoMedio * monthSegments : faturamentoMedio;
    const wasteAgainstRevenue =
      faturamentoReferencia > 0
        ? (totals.wasteCost / faturamentoReferencia) * 100
        : 0;
    const vendaDesperdicadaPercent =
      faturamentoReferencia > 0
        ? (totals.wastePrice / faturamentoReferencia) * 100
        : 0;

    const kpis: KpiCard[] = [
      {
        id: 'wasteCost',
        label: 'Custo de desperdício',
        value: totals.wasteCost.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        helper: `Índice atual: ${(clientInfo.percentualDesperdicio * 100).toFixed(
          2
        )}%`
      },
      {
        id: 'wasteRevenue',
        label: 'Venda desperdiçada',
        value: totals.wastePrice.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        helper: `Impacto no faturamento: ${vendaDesperdicadaPercent.toFixed(2)}%`
      },
      {
        id: 'wasteKg',
        label: 'Total descartado',
        value: `${totals.wasteKg.toFixed(2)} kg`,
        helper: `Média diária: ${(totals.wasteKg / daysConsidered).toFixed(
          2
        )} kg`
      },
      {
        id: 'avgDaily',
        label: 'Custo médio/dia',
        value: averageDailyWaste.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        helper: peakDay
          ? `Pico em ${format(parseISO(peakDay.date), 'dd/MM')}`
          : 'Sem picos registrados'
      },
      {
        id: 'wasteVsRevenue',
        label: 'Desperdício vs. faturamento',
        value: `${wasteAgainstRevenue.toFixed(2)}%`,
        helper: `CMV atual: ${(clientInfo.cmvAtual * 100).toFixed(1)}%`
      }
    ];

    return {
      filteredRecords,
      kpis,
      dailyWasteSeries: dailyEntries,
      productWasteSeries,
      reasonDistribution,
      peakDay
    };
  }, [dataset, filters]);
