import ReactApexChart from 'react-apexcharts';
import { FaCircle } from 'react-icons/fa';

const CrowdConcentration = () => {
  const value = 75; // Risk level percentage
  
  const options = {
    chart: {
      height: 200,
      type: 'bar',
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '40%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Risk Level'],
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    grid: {
      show: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          {
            offset: 0,
            color: '#f97316',
            opacity: 1
          },
          {
            offset: 100,
            color: '#fb923c',
            opacity: 1
          }
        ]
      }
    },
    tooltip: {
      enabled: false
    }
  };

  const legendItems = [
    { label: 'Safe', range: '0-60%', color: '#22c55e' },
    { label: 'Warning', range: '61-80%', color: '#f97316' },
    { label: 'Critical', range: '81-100%', color: '#ef4444' }
  ];

  return (
    <div className="flex flex-col bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
      transition-all duration-300 hover:bg-white/[0.04] hover:scale-[1.02] hover:border-white/[0.12]
      hover:shadow-[0_8px_30px_rgb(0,0,0,0.12),_inset_0_1px_0_0_rgba(255,255,255,0.1)]
      group cursor-pointer">
      <h3 className="text-sm font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">Crowd Concentration</h3>
      <div className="w-full h-24 group-hover:scale-[1.02] transition-transform">
        <ReactApexChart
          options={options}
          series={[{
            name: 'Risk Level',
            data: [value]
          }]}
          type="bar"
          height="100%"
        />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 group-hover:scale-[1.02] transition-transform">
        {legendItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <FaCircle className="text-xs" style={{ color: item.color }} />
              <span className="text-xs font-medium text-white group-hover:text-gray-300 transition-colors">{item.label}</span>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-gray-300 transition-colors">{item.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrowdConcentration; 