import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const getColorScheme = (percentage) => {
  if (percentage >= 90) return ['#ef4444', '#f87171'];  // Red
  if (percentage >= 75) return ['#f97316', '#fb923c'];  // Orange
  if (percentage >= 60) return ['#eab308', '#facc15'];  // Yellow
  return ['#22c55e', '#4ade80'];  // Green
};

const RadialDial = () => {
  const value = 8000;
  const maxValue = 10000;
  const percentage = 80;
  const [color1, color2] = getColorScheme(percentage);
  
  const options = {
    series: [percentage],
    chart: {
      height: 200,
      type: 'radialBar',
      offsetY: -10,
      background: 'transparent',
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '14px',
            color: '#9ca3af',
            offsetY: 90
          },
          value: {
            offsetY: 50,
            fontSize: '20px',
            color: '#ffffff',
            formatter: function (val) {
              return val + "%";
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
        colorStops: [
          {
            offset: 0,
            color: color1,
            opacity: 1
          },
          {
            offset: 100,
            color: color2,
            opacity: 1
          }
        ]
      },
    },
    stroke: {
      dashArray: 4
    },
    labels: ['Capacity'],
  };

  return (
    <div className="flex flex-col items-center bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] 
      transition-all duration-300 hover:bg-white/[0.04] hover:scale-[1.02] hover:border-white/[0.12]
      hover:shadow-[0_8px_30px_rgb(0,0,0,0.12),_inset_0_1px_0_0_rgba(255,255,255,0.1)]
      group cursor-pointer">
      <h3 className="text-sm font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">Crowd Capacity</h3>
      <div className="w-48 h-48 group-hover:scale-[1.02] transition-transform">
        <ReactApexChart
          options={options}
          series={[percentage]}
          type="radialBar"
          height="100%"
        />
      </div>
      <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
        {value.toLocaleString()} / {maxValue.toLocaleString()}
      </div>
    </div>
  );
};

export default RadialDial; 