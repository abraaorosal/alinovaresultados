import type { FC } from 'react';
import type { DateRangeOption } from '../hooks/useWasteAnalytics';
import './FilterBar.css';

interface FilterBarProps {
  reasons: string[];
  products: string[];
  selectedReason: string;
  selectedProduct: string;
  selectedRange: DateRangeOption;
  onReasonChange: (value: string) => void;
  onProductChange: (value: string) => void;
  onRangeChange: (value: DateRangeOption) => void;
}

const rangeLabels: Record<DateRangeOption, string> = {
  mes: 'Mês atual',
  ultimos7: 'Últimos 7 dias',
  ultimos14: 'Últimos 14 dias'
};

export const FilterBar: FC<FilterBarProps> = ({
  reasons,
  products,
  selectedReason,
  selectedProduct,
  selectedRange,
  onReasonChange,
  onProductChange,
  onRangeChange
}) => (
  <section className="filter-bar">
    <div className="filter-group">
      <label htmlFor="reason-filter">Motivo</label>
      <select
        id="reason-filter"
        value={selectedReason}
        onChange={(event) => onReasonChange(event.target.value)}
      >
        <option value="todos">Todos</option>
        {reasons.map((reason) => (
          <option key={reason} value={reason}>
            {reason}
          </option>
        ))}
      </select>
    </div>

    <div className="filter-group">
      <label htmlFor="product-filter">Produto</label>
      <select
        id="product-filter"
        value={selectedProduct}
        onChange={(event) => onProductChange(event.target.value)}
      >
        <option value="todos">Todos</option>
        {products.map((product) => (
          <option key={product} value={product}>
            {product}
          </option>
        ))}
      </select>
    </div>

    <div className="range-group" role="group" aria-label="Período">
      {Object.entries(rangeLabels).map(([value, label]) => {
        const rangeValue = value as DateRangeOption;
        const isActive = selectedRange === rangeValue;
        return (
          <button
            key={rangeValue}
            type="button"
            className={isActive ? 'range-button range-button--active' : 'range-button'}
            onClick={() => onRangeChange(rangeValue)}
          >
            {label}
          </button>
        );
      })}
    </div>
  </section>
);

export default FilterBar;
