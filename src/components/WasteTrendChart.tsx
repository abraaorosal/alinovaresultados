import type { FC } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import './ChartCard.css';

interface WasteTrendChartProps {
  data: Array<{ date: string; wasteCost: number; wasteKg: number; wastePrice: number }>;
}

const currencyFormatter = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  });

export const WasteTrendChart: FC<WasteTrendChartProps> = ({ data }) => (
  <section className="chart-card">
    <header className="chart-card__header">
      <div>
        <h2>Desperdício diário</h2>
        <span>Custo total e volume descartado por dia</span>
      </div>
    </header>
    <div className="chart-card__body">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="wasteCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.12} />
            </linearGradient>
            <linearGradient id="wasteKg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1f2933" stopOpacity={0.65} />
              <stop offset="95%" stopColor="#1f2933" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(249, 115, 22, 0.15)" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short'
              })
            }
            tick={{ fill: 'rgba(31,31,31,0.7)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={currencyFormatter}
            tick={{ fill: 'rgba(31,31,31,0.7)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => `${value.toFixed(1)} kg`}
            tick={{ fill: 'rgba(31,31,31,0.7)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip
            formatter={(value: number, name) => {
              if (name === 'wasteCost' || name === 'wastePrice') {
                return currencyFormatter(value);
              }
              return `${value.toFixed(2)} kg`;
            }}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long'
              })
            }
            contentStyle={{
              backgroundColor: '#fff7ed',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              borderRadius: '0.75rem',
              color: '#1f1f1f'
            }}
          />
          <Area
            type="monotone"
            dataKey="wasteCost"
            stroke="#f97316"
            fillOpacity={1}
            fill="url(#wasteCost)"
            yAxisId="left"
            strokeWidth={2}
            name="Custo"
          />
          <Line
            type="monotone"
            dataKey="wastePrice"
            stroke="#fb923c"
            strokeWidth={2}
            dot={false}
            name="Venda desperdiçada"
            yAxisId="left"
          />
          <Area
            type="monotone"
            dataKey="wasteKg"
            stroke="#1f2933"
            fillOpacity={1}
            fill="url(#wasteKg)"
            yAxisId="right"
            strokeWidth={2}
            name="Kg descartados"
          />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export default WasteTrendChart;
