import type { FC } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import './ChartCard.css';

interface WasteReasonChartProps {
  data: Array<{ reason: string; wasteCost: number }>;
}

const palette = ['#f97316', '#fb923c', '#ea580c', '#facc15', '#1f2933', '#fbbf24'];

const currencyFormatter = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  });

export const WasteReasonChart: FC<WasteReasonChartProps> = ({ data }) => (
  <section className="chart-card">
    <header className="chart-card__header">
      <div>
        <h2>Motivos do desperdício</h2>
        <span>Distribuição do custo por motivo registrado</span>
      </div>
    </header>
    <div className="chart-card__body">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="wasteCost"
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.reason} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name, { payload }) => [
              currencyFormatter(value),
              payload.reason
            ]}
            contentStyle={{
              backgroundColor: '#fff7ed',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              borderRadius: '0.75rem',
              color: '#1f1f1f'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export default WasteReasonChart;
