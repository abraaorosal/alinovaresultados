import type { FC } from 'react';
import type { KpiCard } from '../hooks/useWasteAnalytics';
import './KpiGrid.css';

interface KpiGridProps {
  items: KpiCard[];
}

export const KpiGrid: FC<KpiGridProps> = ({ items }) => (
  <section className="kpi-grid">
    {items.map((item) => (
      <article key={item.id} className="kpi-card">
        <header className="kpi-card__label">{item.label}</header>
        <strong className="kpi-card__value">{item.value}</strong>
        <span className="kpi-card__helper">{item.helper}</span>
      </article>
    ))}
  </section>
);

export default KpiGrid;
