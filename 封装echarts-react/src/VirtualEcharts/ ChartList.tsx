// ChartList.tsx
import React, { useState, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import ChartCard from './ChartCard';

interface ChartDataItem {
  label: string;
  value: number;
}

interface ChartListProps {
  chartCount: number;
  fetchChartData: (id: number) => Promise<ChartDataItem[]>;
  generateOption: (data: ChartDataItem[]) => any;
  renderSearch?: (id: number, onFilter: (data: ChartDataItem[]) => void) => React.ReactNode;
  columnCount?: number;
}

const ChartList: React.FC<ChartListProps> = ({
  chartCount,
  fetchChartData,
  generateOption,
  renderSearch,
  columnCount = 2,
}) => {
  const [dataMap, setDataMap] = useState<Record<number, ChartDataItem[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const loadChart = async (index: number) => {
    if (dataMap[index]) return;
    setLoadingMap(prev => ({ ...prev, [index]: true }));
    const data = await fetchChartData(index);
    setDataMap(prev => ({ ...prev, [index]: data }));
    setLoadingMap(prev => ({ ...prev, [index]: false }));
  };

  const totalRows = Math.ceil(chartCount / columnCount);
  const columnWidth = Math.floor(window.innerWidth / columnCount);
  const rowHeight = 360;

  // 虚拟滚动内的单元格
  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= chartCount) return null;

    // 放大时，列表内对应项不渲染，防止重复
    if (expandedIndex === index) return <div style={style} />;

    const data = dataMap[index] || [];
    const loading = loadingMap[index] || false;

    return (
      <div style={{ ...style, padding: 8 }}>
        <ChartCard
          loading={loading}
          header={`图表 ${index}`}
          option={generateOption(data)}
          renderSearch={
            renderSearch?.(index, (filteredData) =>
              setDataMap(prev => ({ ...prev, [index]: filteredData }))
            )
          }
          onExpand={() => setExpandedIndex(index)}
        />
      </div>
    );
  };

  return (
    <>
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={window.innerHeight - 40}
        rowCount={totalRows}
        rowHeight={rowHeight}
        width={window.innerWidth}
        onItemsRendered={({ visibleRowStartIndex, visibleRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex }) => {
          for (let row = visibleRowStartIndex; row <= visibleRowStopIndex; row++) {
            for (let col = visibleColumnStartIndex; col <= visibleColumnStopIndex; col++) {
              const index = row * columnCount + col;
              if (index < chartCount) loadChart(index);
            }
          }
        }}
      >
        {Cell}
      </Grid>

      {expandedIndex !== null && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            backgroundColor: '#fff',
            zIndex: 9999,
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ChartCard
            loading={loadingMap[expandedIndex]}
            header={`图表 ${expandedIndex}`}
            option={generateOption(dataMap[expandedIndex] || [])}
            renderSearch={
              renderSearch?.(expandedIndex, (filteredData) =>
                setDataMap(prev => ({ ...prev, [expandedIndex]: filteredData }))
              )
            }
            height={window.innerHeight - 100}
            expanded
            onCollapse={() => setExpandedIndex(null)}
          />
        </div>
      )}
    </>
  );
};

export default ChartList;