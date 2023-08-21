import * as echarts from 'echarts';
import React, { useEffect } from 'react';

export default function () {
  useEffect(() => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };

    option && myChart.setOption(option);
  }, [])
  return (
    <div>
      详情页内容
      <div id="main" style={{width:500,height:500}}></div>
    </div>
  )
}