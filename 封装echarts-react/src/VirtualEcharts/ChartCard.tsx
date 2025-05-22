// ChartCard.tsx
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
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { Button } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
]);

interface ChartCardProps {
  option: echarts.EChartsOption;
  loading?: boolean;
  error?: string | null;
  renderSearch?: React.ReactNode;
  height?: number;
  header?: React.ReactNode;
  onExpand?: () => void;
  onCollapse?: () => void;
  expanded?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({
  option,
  loading,
  error,
  renderSearch,
  height = 300,
  header,
  onExpand,
  onCollapse,
  expanded,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (ref.current && !chartInstance.current) {
      chartInstance.current = echarts.init(ref.current);
    }
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    chartInstance.current?.setOption(
      {
        animation: false,
        ...option,
      },
      true
    );
  }, [option]);

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

  const containerStyle: React.CSSProperties = expanded
    ? {
        position: 'relative',
        height: height,
        borderRadius: 8,
        padding: 12,
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
        {!expanded ? (
          <Button icon={<ExpandOutlined />} onClick={onExpand}>
            放大
          </Button>
        ) : (
          <Button onClick={onCollapse}>关闭</Button>
        )}
      </div>

      {renderSearch && <div style={{ marginBottom: 8 }}>{renderSearch}</div>}

      {loading && <div>加载中...</div>}
      {error && <div style={{ color: 'red' }}>错误：{error}</div>}

      <div ref={ref} style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
};

export default ChartCard;