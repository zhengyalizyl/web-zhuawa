// App.tsx
import React from 'react';
import ChartList from './ChartList';

const fetchChartData = async (id: number) => {
  await new Promise(res => setTimeout(res, 300));
  return Array.from({ length: 10 }, (_, i) => ({
    label: `Label ${i + 1}`,
    value: Math.floor(Math.random() * 100) + id * 10,
  }));
};

const generateOption = (data: { label: string; value: number }[]) => ({
  title: { text: '示例图' },
  tooltip: {},
  xAxis: { type: 'category', data: data.map(d => d.label) },
  yAxis: { type: 'value' },
  series: [
    {
      type: Math.random() > 0.5 ? 'line' : 'bar',
      data: data.map(d => d.value),
    },
  ],
});

const App = () => {
  return (
    <div style={{ padding: 12 }}>
      <ChartList
        chartCount={100}
        fetchChartData={fetchChartData}
        generateOption={generateOption}
        renderSearch={(id, onFilter) => (
          <input
            placeholder={`搜索图表 ${id}`}
            onChange={(e) => {
              const keyword = e.target.value.trim().toLowerCase();
              fetchChartData(id).then((data) => {
                const filtered = data.filter(item =>
                  item.label.toLowerCase().includes(keyword)
                );
                onFilter(filtered);
              });
            }}
          />
        )}
      />
    </div>
  );
};

export default App;