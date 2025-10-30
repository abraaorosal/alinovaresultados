import { useMemo, useState } from 'react';
import type { WasteDataset } from './data/types';
import rawData from './data/waste-data.json';
import {
  useWasteAnalytics,
  type DateRangeOption
} from './hooks/useWasteAnalytics';
import FilterBar from './components/FilterBar';
import KpiGrid from './components/KpiGrid';
import WasteTrendChart from './components/WasteTrendChart';
import ProductWasteChart from './components/ProductWasteChart';
import WasteReasonChart from './components/WasteReasonChart';
import WasteTable from './components/WasteTable';
import './styles/dashboard.css';

const dataset = rawData as WasteDataset;

const formatMonth = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

const App = () => {
  const [selectedReason, setSelectedReason] = useState<string>('todos');
  const [selectedProduct, setSelectedProduct] = useState<string>('todos');
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('acumulado');

  const { clientInfo } = dataset;

  const reasons = useMemo(
    () =>
      Array.from(
        new Set(
          dataset.wasteRecords
            .map((record) => record.reason)
            .filter((reason): reason is string => Boolean(reason))
        )
      ),
    []
  );

  const products = useMemo(
    () => Array.from(new Set(dataset.wasteRecords.map((record) => record.product))),
    []
  );

  const analytics = useWasteAnalytics(dataset, {
    reason: selectedReason,
    product: selectedProduct,
    range: selectedRange
  });

  const periodLabel = useMemo(() => {
    if (clientInfo.monthStart && clientInfo.monthEnd) {
      const sameMonth = clientInfo.monthStart === clientInfo.monthEnd;
      const startLabel = formatMonth(clientInfo.monthStart);
      const endLabel = formatMonth(clientInfo.monthEnd);
      return sameMonth ? startLabel : `${startLabel} a ${endLabel}`;
    }
    return formatMonth(clientInfo.month);
  }, [clientInfo.month, clientInfo.monthEnd, clientInfo.monthStart]);

  return (
    <main className="dashboard">
      <header className="dashboard__hero">
        <div>
          <span className="dashboard__badge">Relatório de desperdício</span>
          <h1>{clientInfo.client}</h1>
          <p>
            Visão analítica do desperdício de alimentos, com indicadores do período de{' '}
            <strong>{periodLabel}</strong> e comparativos de custo, volume e motivos.
          </p>
        </div>
        <div className="dashboard__highlights">
          <div>
            <small>Faturamento médio</small>
            <strong>
              {clientInfo.faturamentoMedio.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </strong>
          </div>
          <div>
            <small>CMV em reais</small>
            <strong>
              {clientInfo.cmvEmReais.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </strong>
          </div>
          <div>
            <small>CMV (%)</small>
            <strong>{(clientInfo.cmvAtual * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </header>

      <FilterBar
        reasons={reasons}
        products={products}
        selectedReason={selectedReason}
        selectedProduct={selectedProduct}
        selectedRange={selectedRange}
        onReasonChange={setSelectedReason}
        onProductChange={setSelectedProduct}
        onRangeChange={setSelectedRange}
      />

      <KpiGrid items={analytics.kpis} />

      <section className="dashboard__visuals">
        <WasteTrendChart data={analytics.dailyWasteSeries} />
        <ProductWasteChart data={analytics.productWasteSeries} />
        <WasteReasonChart data={analytics.reasonDistribution} />
      </section>

      <WasteTable records={analytics.filteredRecords} />
    </main>
  );
};

export default App;
