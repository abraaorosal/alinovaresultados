# alinovaresultados

Dashboard de desperdício de alimentos usado pela DONANA Gourmert para acompanhar indicadores de perdas por produto, motivo e período.

## Requisitos

- Node 18+
- npm 10+

## Como rodar localmente

```bash
npm install
npm run dev
```

## Atualizar dados a partir da planilha

Coloque/atualize o arquivo `Planilha de desperdício.xlsx` na raiz do projeto e rode:

```bash
python3 scripts/update_waste_data.py
```

O script gera `src/data/waste-data.json`, usado pelo dashboard.

## Build

O comando `npm run build` usa TypeScript + Vite. Ajuste o `tsconfig.json` conforme necessário para o seu ambiente antes de publicar.
