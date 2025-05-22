import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
} from 'echarts/components';
import {
  LineChart,
  BarChart,
  MapChart,
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  LineChart,
  BarChart,
  MapChart,
  CanvasRenderer,
]);

interface ChartCardProps {
  option: echarts.EChartsOption;
  loading?: boolean;
  error?: string | null;
  renderSearch?: React.ReactNode;
  height?: number;
  header?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  option,
  loading,
  error,
  renderSearch,
  height = 300,
  header,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [expanded, setExpanded] = useState(false);

  // 初始化一次
  useEffect(() => {
    if (ref.current && !chartInstance.current) {
      chartInstance.current = echarts.init(ref.current);
    }

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  // 设置 option
  useEffect(() => {
    chartInstance.current?.setOption(
      {
        ...option,
      },
    );
  }, [option]);

  // ResizeObserver 替代 setTimeout
  useEffect(() => {
    if (!ref.current || !chartInstance.current) return;

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = '';
    };
  }, [expanded]);

  const containerStyle: React.CSSProperties = expanded
    ? {
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
      }
    : {
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 12,
        height,
        display: 'flex',
        flexDirection: 'column',
      };

  return (
    <div style={containerStyle}>
      <div
        style={{
          marginBottom: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>{header}</div>
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{ cursor: 'pointer' }}
        >
          {expanded ? '关闭' : '放大'}
        </button>
      </div>

      {renderSearch && <div style={{ marginBottom: 8 }}>{renderSearch}</div>}

      {loading && <div>加载中...</div>}
      {error && <div style={{ color: 'red' }}>错误：{error}</div>}

      <div ref={ref} style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
};

export default ChartCard;