import type { FC } from 'react';
import type { WasteRecord } from '../data/types';
import './WasteTable.css';

interface WasteTableProps {
  records: WasteRecord[];
}

export const WasteTable: FC<WasteTableProps> = ({ records }) => (
  <section className="table-card">
    <header className="table-card__header">
      <div>
        <h2>Detalhamento das ocorrências</h2>
        <span>Acompanhe cada registro filtrado</span>
      </div>
    </header>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Motivo</th>
            <th>Kg descartados</th>
            <th>Custo</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={5} className="table-empty">
                Nenhum registro para o filtro selecionado.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={`${record.date}-${record.product}-${record.reason ?? 'na'}`}>
                <td data-label="Data">
                  {new Date(record.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </td>
                <td data-label="Produto">{record.product}</td>
                <td data-label="Motivo">{record.reason ?? 'Não informado'}</td>
                <td data-label="Kg descartados">{record.wasteKg?.toFixed(2) ?? '-'}</td>
                <td data-label="Custo">
                  {record.wasteCost?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }) ?? '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default WasteTable;
