import type { FC } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import './ChartCard.css';

interface ProductWasteChartProps {
  data: Array<{ product: string; wasteCost: number }>;
}

const currencyFormatter = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  });

export const ProductWasteChart: FC<ProductWasteChartProps> = ({ data }) => (
  <section className="chart-card">
    <header className="chart-card__header">
      <div>
        <h2>Top desperdícios por produto</h2>
        <span>Ranking dos itens com maior impacto financeiro</span>
      </div>
    </header>
    <div className="chart-card__body">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(249, 115, 22, 0.15)" />
          <XAxis
            dataKey="product"
            tick={{ fill: 'rgba(31,31,31,0.7)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={currencyFormatter}
            tick={{ fill: 'rgba(31,31,31,0.7)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => currencyFormatter(value)}
            contentStyle={{
              backgroundColor: '#fff7ed',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              borderRadius: '0.75rem',
              color: '#1f1f1f'
            }}
          />
          <Bar
            dataKey="wasteCost"
            fill="url(#orangeBar)"
            radius={[12, 12, 12, 12]}
          />
          <defs>
            <linearGradient id="orangeBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export default ProductWasteChart;
