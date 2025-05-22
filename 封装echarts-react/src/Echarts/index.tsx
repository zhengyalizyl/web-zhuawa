import React, { useState, useEffect } from 'react';
import ChartCard from './ChartCard';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([LineChart, TooltipComponent, GridComponent, CanvasRenderer]);

interface DataItem {
  label: string;
  value: number;
}

const fetchChartData = (chartId: number): Promise<DataItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        label: `Label ${i + 1}`,
        value: Math.floor(Math.random() * 100) + chartId * 10,
      }));
      resolve(data);
    }, 800);
  });
};

const ParentComponent: React.FC = () => {
  const [chartsData, setChartsData] = useState<Record<number, DataItem[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
  const [searchMap, setSearchMap] = useState<Record<number, string>>({});

  const chartIds = [1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,177];

  useEffect(() => {
    chartIds.forEach(async (id) => {
      setLoadingMap((prev) => ({ ...prev, [id]: true }));
      const data = await fetchChartData(id);
      setChartsData((prev) => ({ ...prev, [id]: data }));
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    });
  }, []);

  const handleSearchChange = (id: number, keyword: string) => {
    setSearchMap((prev) => ({ ...prev, [id]: keyword }));
  };

  // 根据搜索关键字过滤数据，生成option
  const getOption = (id: number): echarts.EChartsOption => {
    const keyword = searchMap[id]?.toLowerCase() || '';
    const originalData = chartsData[id] || [];

    const filtered = keyword
      ? originalData.filter((item) => item.label.toLowerCase().includes(keyword))
      : originalData;

    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category' ,
        data: filtered.map((d) => d.label),
        axisLabel: { rotate: 45 },
      },
      yAxis: { type: 'value' },
      grid: { bottom: 80, left: 50, right: 30, top: 50 },
      series: [
        {
          data: filtered.map((d) => d.value),
          type:id===1? 'line':'bar',
          smooth: true,
          areaStyle: {},
        },
      ],
    };
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        padding: 12,
        height:'100vh',
        flex:1,
        // overflow:'hidden'
      }}
    >
      {chartIds.map((id) => (
        <ChartCard
          key={id}
          option={getOption(id)}
          loading={loadingMap[id]}
          header={`图表 ${id}`}
          renderSearch={
            <input
              placeholder={`图表${id} 搜索`}
              value={searchMap[id] || ''}
              onChange={(e) => handleSearchChange(id, e.target.value)}
              style={{ padding: '4px 8px', width: '100%' }}
            />
          }
          height={300}
        />
      ))}
    </div>
  );
};

export default ParentComponent;