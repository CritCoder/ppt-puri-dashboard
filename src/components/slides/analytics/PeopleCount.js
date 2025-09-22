import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  FaUsers, FaSpinner, FaCrosshairs, 
  FaDoorOpen, FaArrowUp, FaArrowDown,
  FaChartLine, FaHistory, FaClock, FaExclamationTriangle
} from 'react-icons/fa';
import ShimmerCard from './ShimmerCard';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';

const sampleGates = [
  { id: 1, src: '/puri2.jpeg', label: 'Jagannath Temple Entry' },
  { id: 2, src: '/puri1.jpeg', label: 'Grand Road Entrance' },
  { id: 3, src: '/images/entry1.png', label: 'Swargadwar Beach' },
];

// Sample data structure for people counting at Jagannath Temple
const gateData = {
  flow_metrics: {
    gates: [
      {
        name: "Singhadwara (East Gate)",
        current_count: 3200,
        total_entries: 12500,
        total_exits: 9300,
        flow_rate: "high",
        status: "normal"
      },
      {
        name: "Ashwadwara (South Gate)",
        current_count: 1850,
        total_entries: 7200,
        total_exits: 5350,
        flow_rate: "medium",
        status: "warning"
      },
      {
        name: "Vyaghradwara (West Gate)",
        current_count: 1200,
        total_entries: 4800,
        total_exits: 3600,
        flow_rate: "low",
        status: "normal"
      }
    ],
    total_metrics: {
      current_occupancy: 6250,
      max_capacity: 15000,
      peak_time: "11:30",
      average_duration: "90 mins"
    },
    alerts: [
      "High devotee flow at Singhadwara",
      "Approaching capacity at inner sanctum",
      "Queue building at Ratna Bhandar viewing area"
    ]
  }
};

// Add these after the gateData constant
const topPoints = [
  { name: "Singhadwara (East Gate)", rate: 950, change: "+15%", status: "high" },
  { name: "Inner Sanctum", rate: 780, change: "+8%", status: "high" },
  { name: "Ashwadwara (South Gate)", rate: 650, change: "+5%", status: "medium" },
  { name: "Ratna Bhandar Area", rate: 580, change: "+12%", status: "medium" },
  { name: "Ananda Bazaar", rate: 520, change: "+3%", status: "low" }
];

const getStatusColor = (status) => {
  switch(status) {
    case 'high': return 'text-green-400 bg-green-500/20';
    case 'medium': return 'text-orange-400 bg-orange-500/20';
    case 'low': return 'text-blue-400 bg-blue-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

// Reuse the DataWidget component with slight modifications
const DataWidget = ({ title, icon: Icon, children }) => (
  <motion.div
    className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05] 
    shadow-[inset_0px_0px_40px_rgba(255,255,255,0.02)] 
    bg-gradient-to-b from-white/[0.05] to-transparent"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 rounded-lg bg-blue-500/20">
        <Icon className="text-lg text-blue-400" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </motion.div>
);

const formatIndianNumber = (num) => {
  const value = Math.floor(num);
  if (value >= 10000000) {
    return `${(value/10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${(value/100000).toFixed(2)} L`;
  } else if (value >= 1000) {
    return `${(value/1000).toFixed(2)} K`;
  }
  return value.toString();
};

const TotalCounter = () => {
  const [count, setCount] = useState(8500000);
  const incrementInterval = useRef(null);

  useEffect(() => {
    incrementInterval.current = setInterval(() => {
      // Smaller random increment between 100 to 500
      const randomIncrement = Math.floor(Math.random() * 400) + 100;
      setCount(prev => prev + randomIncrement);
    }, 5000); // Longer interval of 5 seconds

    return () => clearInterval(incrementInterval.current);
  }, []);

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
      transition-all duration-300 hover:bg-white/[0.04]">
      <h3 className="text-sm font-medium text-white mb-4">Total Footfall</h3>
      <div className="flex flex-col items-center justify-center h-40">
        <div className="text-4xl font-bold text-white mb-2">
          <CountUp
            end={8500000}
            duration={2}
            formattingFn={(value) => formatIndianNumber(value)}
            preserveValue={true}
          />
        </div>
        <p className="text-sm text-gray-400">At Current Gate</p>
        <div className="flex items-center gap-2 mt-4">
          <FaArrowUp className="text-green-400" />
          <span className="text-sm text-green-400">+12.5K</span>
          <span className="text-xs text-gray-400">last hour</span>
        </div>
      </div>
    </div>
  );
};

const FlowMeter = () => {
  const [flowRate, setFlowRate] = useState(1200);
  const flowInterval = useRef(null);
  const maxFlow = 1500; // Maximum flow capacity

  useEffect(() => {
    flowInterval.current = setInterval(() => {
      setFlowRate(prev => {
        // Smoother variation with smaller changes
        const variation = Math.random() * 20 - 10; // Random between -10 and +10
        const newRate = prev + variation;
        return Math.min(Math.max(newRate, 1100), 1400); // Keep it around 80% utilization
      });
    }, 2000); // Slower updates for smoother animation

    return () => clearInterval(flowInterval.current);
  }, []);

  const options = {
    chart: {
      height: 200,
      type: 'radialBar',
      toolbar: {
        show: false
      },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
        },
        track: {
          background: '#1a1a1a',
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: false,
          }
        },
        dataLabels: {
          name: {
            fontSize: '16px',
            color: '#9ca3af',
            offsetY: 120,
            show: true
          },
          value: {
            offsetY: 76,
            fontSize: '22px',
            color: '#fff',
            formatter: function (val) {
              // Show actual flow rate instead of percentage
              return Math.round(flowRate) + "/min";
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: [(flowRate/maxFlow) > 0.9 ? '#ef4444' : (flowRate/maxFlow) > 0.8 ? '#f97316' : '#22c55e'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      dashArray: 4
    },
    colors: [(flowRate/maxFlow) > 0.9 ? '#dc2626' : (flowRate/maxFlow) > 0.8 ? '#ea580c' : '#16a34a'],
    series: [Math.round((flowRate/maxFlow) * 100)], // Convert to percentage
    labels: ['Capacity'],
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
      transition-all duration-300 hover:bg-white/[0.04]">
      <h3 className="text-sm font-medium text-white mb-2">Flow Capacity</h3>
      <div className="flex items-center justify-center">
        <ReactApexChart
          options={options}
          series={[Math.round((flowRate/maxFlow) * 100)]}
          type="radialBar"
          height={200}
        />
      </div>
      <div className="text-center mt-2">
        <span className="text-xs text-gray-400">Max Capacity: {maxFlow}/min</span>
      </div>
    </div>
  );
};

const TempleUtilizationDial = () => {
  const value = 82; // Current utilization percentage
  
  const options = {
    chart: {
      height: 200,
      type: 'radialBar',
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
        },
        track: {
          background: '#1a1a1a',
          strokeWidth: '97%',
        },
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
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#f97316'],
        stops: [0, 100]
      },
    },
    stroke: {
      dashArray: 4
    },
    series: [value],
    labels: ['Utilization'],
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
      transition-all duration-300 hover:bg-white/[0.04]">
      <h3 className="text-sm font-medium text-white mb-2">Temple Utilization</h3>
      <ReactApexChart
        options={options}
        series={options.series}
        type="radialBar"
        height={200}
      />
    </div>
  );
};

const RiskLevelMeter = () => {
  const value = 75; // Risk level percentage
  
  const riskLegends = [
    { level: 'High', range: '80-100%', color: '#ef4444' },
    { level: 'Medium', range: '60-79%', color: '#f97316' },
    { level: 'Low', range: '0-59%', color: '#22c55e' }
  ];

  const options = {
    chart: {
      height: 200,
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '40%',
        borderRadius: 4
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Risk Level'],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { show: false } },
    grid: { show: false },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: '#f97316', opacity: 1 },
          { offset: 100, color: '#fb923c', opacity: 1 }
        ]
      }
    },
    series: [{
      name: 'Risk Level',
      data: [value]
    }]
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
      transition-all duration-300 hover:bg-white/[0.04]">
      <h3 className="text-sm font-medium text-white mb-2">Risk Level</h3>
      <div className="flex flex-col">
        <ReactApexChart
          options={options}
          series={options.series}
          type="bar"
          height={140}  // Reduced height to make room for legends
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {riskLegends.map((risk, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: risk.color }} />
                <span className="text-xs font-medium text-white">{risk.level}</span>
              </div>
              <span className="text-[10px] text-gray-400">{risk.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TopEntryPoints = () => {
  return (
    <DataWidget title="Top Entry Points" icon={FaChartLine}>
      <div className="space-y-3">
        {topPoints.map((point, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white/80">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <div>
                <p className="text-sm text-white">{point.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {point.rate.toLocaleString()}/hr
                  </span>
                  <span className={`text-xs ${point.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {point.change}
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(point.status)}`}>
              {point.status}
            </span>
          </div>
        ))}
      </div>
    </DataWidget>
  );
};

// Add this helper function to generate random data for the last 24 hours
const generateHourlyData = () => {
  const data = [];
  const baseValue = 8000000;
  for (let i = 24; i >= 0; i--) {
    // Random variation between -50000 and +50000
    const variation = Math.floor(Math.random() * 100000) - 50000;
    data.push({
      x: new Date().getTime() - (i * 3600000), // Subtract hours in milliseconds
      y: baseValue + variation
    });
  }
  return data;
};

const PeopleCount = () => {
  const [analysisState, setAnalysisState] = useState('idle');
  const [showResults, setShowResults] = useState(false);
  const [selectedGate, setSelectedGate] = useState({
    id: 1,
    src: '/images/entry1.png',
    label: 'Jagannath Temple Entry'
  });

  useEffect(() => {
    const runAnalysis = async () => {
      setAnalysisState('analyzing');
      setShowResults(false);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAnalysisState('complete');
      setShowResults(true);
    };

    runAnalysis();
  }, [selectedGate]);

  return (
    <div className="w-full h-full mt-16 flex flex-col gap-8">
      {/* First Row - Analysis Cards */}
      <div className="grid grid-cols-5 gap-4">
        {/* Total Footfall Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
          shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
          transition-all duration-300 hover:bg-white/[0.04]">
          <h3 className="text-sm font-medium text-white mb-3">Total Footfall</h3>
          <div className="flex flex-col h-40">
            {/* Stats Section */}
            <div className="flex-1">
              <div className="text-5xl font-bold text-white">
                <CountUp
                  end={8500000}
                  duration={2.5}
                  formattingFn={(value) => formatIndianNumber(value)}
                  preserveValue={true}
                />
                <span className="text-3xl">+</span>
              </div>
              <p className="text-sm text-gray-400">Across All Locations</p>
            </div>

            {/* Chart Section - Fixed to bottom */}
            <div className="h-16 -mx-4 -mb-4"> {/* Negative margins to stretch to edges */}
              <ReactApexChart
                options={{
                  chart: {
                    type: 'area',
                    toolbar: { show: false },
                    sparkline: { enabled: true },
                    animations: {
                      enabled: true,
                      easing: 'linear',
                      speed: 500
                    }
                  },
                  stroke: {
                    curve: 'smooth',
                    width: 2
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.3,
                      opacityTo: 0.1,
                      stops: [0, 100]
                    }
                  },
                  colors: ['#3b82f6'],
                  tooltip: { enabled: false },
                  xaxis: {
                    type: 'datetime',
                    labels: { show: false },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                  },
                  yaxis: { show: false },
                  grid: { show: false },
                  padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                  }
                }}
                series={[{
                  name: 'Footfall',
                  data: generateHourlyData()
                }]}
                type="area"
                height="100%"
                width="100%"
              />
            </div>
          </div>
        </div>

        {/* Combined Entry/Exit Rate Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
          shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
          transition-all duration-300 hover:bg-white/[0.04]">
          <h3 className="text-sm font-medium text-white mb-4">Flow Rate</h3>
          <div className="flex flex-col items-center justify-center h-40 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-1">
                <CountUp
                  end={3250}
                  duration={2}
                  separator=","
                  suffix="/hr"
                  preserveValue={true}
                />
              </div>
              <div className="flex items-center gap-1">
                <FaArrowUp className="text-green-400 text-xs" />
                <span className="text-xs text-green-400">Entry Rate</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-1">
                <CountUp
                  end={2840}
                  duration={2}
                  separator=","
                  suffix="/hr"
                  preserveValue={true}
                />
              </div>
              <div className="flex items-center gap-1">
                <FaArrowDown className="text-red-400 text-xs" />
                <span className="text-xs text-red-400">Exit Rate</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">Current Hourly Rate</div>
          </div>
        </div>

        {/* Utilization */}
        <TempleUtilizationDial />

        {/* Risk Level */}
        <RiskLevelMeter />

        {/* Top Entry Points - Added to top row */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
          shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
          transition-all duration-300 hover:bg-white/[0.04]">
          <h3 className="text-sm font-medium text-white mb-4">Top Entry Points</h3>
          <div className="h-[130px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
            <div className="space-y-2">
              {topPoints.map((point, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/60">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-xs text-white">{point.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400">
                          {point.rate.toLocaleString()}/hr
                        </span>
                        <span className={`text-[10px] ${point.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {point.change}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${getStatusColor(point.status)}`}>
                    {point.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0a0a0a] px-4 text-sm text-white/40">Entrance Monitoring</span>
        </div>
      </div>

      {/* Second Row - Camera Feed and Analysis */}
      <div className="flex gap-6 relative z-10">
        {/* Left Side - Gate Feeds */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Gate Selection */}
          <div className="grid grid-cols-3 gap-4">
            {sampleGates.map((gate) => (
              <div
                key={gate.id}
                onClick={() => setSelectedGate(gate)}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all
                  ${selectedGate.id === gate.id 
                    ? 'ring-2 ring-blue-500 scale-[1.02]' 
                    : 'hover:scale-[1.02] hover:ring-2 hover:ring-white/20'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <img 
                  src={gate.src}
                  alt={gate.label}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 z-20">
                  <p className="text-xs text-white/90 font-medium truncate">{gate.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Gate Display */}
          <div className="relative rounded-xl overflow-hidden aspect-video">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img 
              src={selectedGate.src}
              alt="Source Feed"
              className="w-full h-full object-cover"
            />
            
            {/* CCTV overlays */}
            <div className="absolute top-4 left-4 z-30 font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
              <span>GATE_0{selectedGate.id} • {selectedGate.label}</span>
            </div>

            {/* Recording indicator - top right */}
            <div className="absolute top-4 right-4 z-30">
              <div className="flex items-center gap-2 bg-black/30 px-2 py-1 rounded">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-xs text-white/90">REC</span>
              </div>
            </div>

            {/* Timestamp - bottom left */}
            <div className="absolute bottom-4 left-4 z-30">
              <div className="font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
                {new Date().toLocaleString()}
              </div>
            </div>
            
            {/* Analysis Overlay */}
            <AnimatePresence>
              {analysisState === 'analyzing' && (
                <motion.div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center text-gray-500">
                    <FaCrosshairs className="text-4xl mb-4 mx-auto" />
                    <p className="text-lg">Analysis in Progress...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="w-1/2 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div className="flex flex-col gap-6">
                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-4">
                  <TotalCounter />
                  <FlowMeter />
                </div>

                {/* Alert Section */}
                <DataWidget title="Active Alerts" icon={FaExclamationTriangle}>
                  <div className="space-y-2">
                    {gateData.flow_metrics.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        {alert}
                      </div>
                    ))}
                  </div>
                </DataWidget>

                {/* Top Entry Points */}
                <TopEntryPoints />
              </motion.div>
            ) : (
              <motion.div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <ShimmerCard type="chart" />
                  <ShimmerCard type="chart" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ShimmerCard type="data" />
                  <ShimmerCard type="data" />
                </div>
                <ShimmerCard type="data" /> {/* Add shimmer for top entry points */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PeopleCount; 