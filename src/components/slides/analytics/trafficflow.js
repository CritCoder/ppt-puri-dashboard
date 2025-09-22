import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  FaCar, FaSpinner, FaCrosshairs, 
  FaRoad, FaArrowUp, FaArrowDown,
  FaChartLine, FaHistory, FaClock, FaExclamationTriangle,
  FaTruck, FaBus, FaMotorcycle, FaTachometerAlt
} from 'react-icons/fa';
import ShimmerCard from './ShimmerCard';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';

const videoSources = [
  '/carvideos/anpr1.mp4',
  '/carvideos/anpr2.mov',
  '/carvideos/anpr3.mov',
  '/carvideos/anpr5.mov',
  '/carvideos/anpr6.mov',
  '/carvideos/anpr7.mov'
];

const monitoringPoints = [
  { id: 1, src: videoSources[0], label: 'Grand Road' },
  { id: 2, src: videoSources[1], label: 'Marine Drive' },
  { id: 3, src: videoSources[2], label: 'Swargadwar Market' },
];

// Update data structure for traffic flow
const trafficData = {
  flow_metrics: {
    points: [
      {
        name: "Grand Road",
        current_count: 250,
        total_entries: 2500,
        total_exits: 2200,
        flow_rate: "high",
        status: "congested",
        vehicle_types: {
          cars: 35,
          bikes: 45,
          buses: 8,
          trucks: 12
        }
      },
      {
        name: "Marine Drive",
        current_count: 180,
        total_entries: 1800,
        total_exits: 1650,
        flow_rate: "medium",
        status: "normal",
        vehicle_types: {
          cars: 30,
          bikes: 50,
          buses: 10,
          trucks: 10
        }
      },
      {
        name: "Swargadwar Market",
        current_count: 150,
        total_entries: 1500,
        total_exits: 1380,
        flow_rate: "low",
        status: "normal",
        vehicle_types: {
          cars: 25,
          bikes: 55,
          buses: 12,
          trucks: 8
        }
      }
    ],
    total_metrics: {
      current_vehicles: 100000, // 1 Lakh total registered vehicles
      max_capacity: 150000,
      peak_time: "09:30",
      average_duration: "15 mins"
    },
    alerts: [
      "Heavy congestion at Grand Road - 250+ vehicles",
      "School time traffic at Marine Drive - 180+ vehicles",
      "Slow moving traffic near Jagannath Temple - 150+ vehicles"
    ]
  }
};

// Update top points for traffic monitoring
const topPoints = [
  { name: "Grand Road", rate: 1250, change: "+12%", status: "congested" },
  { name: "Marine Drive", rate: 850, change: "+8%", status: "normal" },
  { name: "Swargadwar Market", rate: 650, change: "+5%", status: "normal" },
  { name: "Bada Danda Square", rate: 750, change: "-2%", status: "low" },
  { name: "VIP Road", rate: 550, change: "+3%", status: "low" }
];

// Update status colors for traffic conditions
const getStatusColor = (status) => {
  switch(status) {
    case 'congested': return 'text-red-400 bg-red-500/20';
    case 'heavy': return 'text-orange-400 bg-orange-500/20';
    case 'normal': return 'text-green-400 bg-green-500/20';
    case 'low': return 'text-blue-400 bg-blue-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

// Add vehicle type icons component
const VehicleTypeIcon = ({ type }) => {
  switch(type.toLowerCase()) {
    case 'cars': return <FaCar />;
    case 'bikes': return <FaMotorcycle />;
    case 'buses': return <FaBus />;
    case 'trucks': return <FaTruck />;
    default: return <FaCar />;
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

// Update the TotalCounter for vehicles
const TotalCounter = () => {
  const [count, setCount] = useState(100000); // 1 Lakh vehicles
  const incrementInterval = useRef(null);

  useEffect(() => {
    incrementInterval.current = setInterval(() => {
      const randomIncrement = Math.floor(Math.random() * 1000) - 500; // -500 to +500
      setCount(prev => Math.max(0, prev + randomIncrement));
    }, 3000);

    return () => clearInterval(incrementInterval.current);
  }, []);

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
      transition-all duration-300 hover:bg-white/[0.04]">
      <h3 className="text-sm font-medium text-white mb-4">Total Vehicles</h3>
      <div className="flex flex-col items-center justify-center h-40">
        <div className="text-4xl font-bold text-white mb-2">
          <CountUp
            end={count}
            duration={2}
            separator=","
            preserveValue={true}
          />
        </div>
        <p className="text-sm text-gray-400">Current Traffic Volume</p>
        <div className="flex items-center gap-2 mt-4">
          <FaArrowUp className="text-green-400" />
          <span className="text-sm text-green-400">+25</span>
          <span className="text-xs text-gray-400">last 15 min</span>
        </div>
      </div>
    </div>
  );
};

// Update FlowMeter for vehicle traffic
const FlowMeter = () => {
  const [flowRate, setFlowRate] = useState(250);
  const flowInterval = useRef(null);
  const maxFlow = 2500; // Maximum flow capacity

  useEffect(() => {
    flowInterval.current = setInterval(() => {
      setFlowRate(prev => {
        const variation = Math.random() * 20 - 10; // Random between -10 and +10
        return Math.min(Math.max(prev + variation, 200), 2500);
      });
    }, 2000);

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

// Add this function back before the TrafficFlow component
const generateHourlyData = (baseValue = 250, variation = 50) => {
  const data = [];
  for (let i = 24; i >= 0; i--) {
    const randomVariation = Math.floor(Math.random() * variation * 2) - variation;
    data.push({
      x: new Date().getTime() - (i * 3600000),
      y: baseValue + randomVariation
    });
  }
  return data;
};

// Also, GhatUtilizationDial is referenced but not defined, let's add it
const GhatUtilizationDial = () => {
  // Change initial state to a more stable value
  const [utilization, setUtilization] = useState(65);
  const utilizationInterval = useRef(null);

  useEffect(() => {
    utilizationInterval.current = setInterval(() => {
      setUtilization(prev => {
        // Reduce variation range and slow down updates
        const variation = Math.random() * 2 - 1; // Random between -1 and +1
        const newValue = prev + variation;
        // Keep within a narrower range (60-70%)
        return Math.min(Math.max(newValue, 60), 70);
      });
    }, 5000); // Increase interval to 5 seconds

    return () => clearInterval(utilizationInterval.current);
  }, []);

  const options = {
    chart: {
      type: 'radialBar',
      height: 200,
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 800,  // Slower animation
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 800
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: '70%'
        },
        track: {
          background: '#1a1a1a',
          strokeWidth: '97%'
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: -10,
            color: '#9ca3af',
            fontSize: '13px'
          },
          value: {
            color: '#fff',
            fontSize: '30px',
            show: true,
            formatter: function (val) {
              return Math.round(val) + '%';
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
        colorStops: [
          {
            offset: 0,
            color: '#22c55e',  // Always green since we're keeping utilization moderate
            opacity: 1
          },
          {
            offset: 100,
            color: '#16a34a',
            opacity: 1
          }
        ]
      }
    },
    stroke: {
      dashArray: 3
    },
    series: [utilization],
    labels: ['Utilization']
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
      transition-all duration-300 hover:bg-white/[0.04]">
      <h3 className="text-sm font-medium text-white mb-4">Traffic Utilization</h3>
      <ReactApexChart
        options={options} 
        series={[Math.round(utilization)]}  // Round the value before passing to chart
        type="radialBar"
        height={201}
      />
    </div>
  );
};

// Update VehicleTypesPieChart with numbers that sum to 24,382
const VehicleTypesPieChart = () => {
  const vehicleTypes = [
    { type: '2 Wheeler', count: 17067, color: '#3b82f6' },  // 70% of 24,382
    { type: '3 Wheeler', count: 1219, color: '#22c55e' },   // 5% of 24,382
    { type: '4 Wheeler', count: 4876, color: '#f97316' },   // 20% of 24,382
    { type: 'Heavy', count: 1220, color: '#8b5cf6' }        // 5% of 24,382
  ];

  const options = {
    chart: {
      type: 'donut',
      background: 'transparent',
      toolbar: { show: false }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              color: '#9ca3af'
            },
            value: {
              show: true,
              fontSize: '16px',
              color: '#ffffff',
              formatter: function(val) {
                // Format the actual count instead of percentage
                return Math.round(val).toLocaleString();
              }
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              color: '#9ca3af',
              formatter: function(w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return total.toLocaleString();
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '12px',
      fontFamily: 'inherit',
      fontWeight: 400,
      labels: {
        colors: '#9ca3af'
      },
      markers: {
        width: 8,
        height: 8,
        radius: 12
      },
      itemMargin: {
        horizontal: 8,
        vertical: 0
      }
    },
    stroke: {
      show: false
    },
    colors: vehicleTypes.map(type => type.color),
    labels: vehicleTypes.map(type => type.type),
    series: vehicleTypes.map(type => type.count)
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
      transition-all duration-300 hover:bg-white/[0.04]">
      <h3 className="text-sm font-medium text-white mb-4">Vehicle Distribution</h3>
      <ReactApexChart
        options={options}
        series={options.series}
        type="donut"
        height={200}
      />
    </div>
  );
};

const TrafficFlow = () => {
  const [analysisState, setAnalysisState] = useState('idle');
  const [showResults, setShowResults] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState({
    id: 1,
    src: videoSources[0],
    label: 'Grand Road'
  });

  // Add the stats state
  const [locationStats] = useState({
    anpr: [
      { location: 'Bhubaneswar Highway Entry', count: 845 },
      { location: 'Konark Highway', count: 780 },
      { location: 'Coastal Highway', count: 685 },
      { location: 'Brahmagiri Road', count: 520 },
      { location: 'Beach Road Entry', count: 415 }
    ],
    laneViolations: [
      { location: 'Grand Road', count: 28 },
      { location: 'Bada Danda Square', count: 24 },
      { location: 'Marine Drive', count: 19 },
      { location: 'Jagannath Temple Area', count: 16 },
      { location: 'Puri Bus Stand', count: 12 }
    ],
    wrongWay: [
      { location: 'Swargadwar Market', count: 8 },
      { location: 'Chakratirtha Road', count: 6 },
      { location: 'CT Road Junction', count: 5 },
      { location: 'VIP Road', count: 4 },
      { location: 'Market Square', count: 3 }
    ],
    overspeeding: [
      { location: 'Bhubaneswar Highway', count: 34 },
      { location: 'Konark Highway', count: 28 },
      { location: 'Beach Road', count: 25 },
      { location: 'Brahmagiri Road', count: 22 },
      { location: 'Coastal Highway', count: 18 }
    ],
    accidents: [
      { location: 'Bhubaneswar Highway', count: 2 },
      { location: 'Beach Road Junction', count: 2 },
      { location: 'Grand Road', count: 1 },
      { location: 'Konark Highway', count: 1 },
      { location: 'Marine Drive', count: 1 }
    ]
  });

  const [vehicleTypeStats] = useState({
    total: 3245,
    types: [
      { type: 'Two Wheelers', count: 1580 },  // ~49% - Most common in Puri
      { type: 'Cars', count: 720 },           // ~22% 
      { type: 'Auto Rickshaws', count: 520 }, // ~16% - Higher percentage for tourist transport
      { type: 'Tourist Buses', count: 280 },  // ~9% - More buses due to tourism
      { type: 'Trucks', count: 145 }          // ~4% - Limited heavy vehicles
    ]
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
  }, [selectedPoint]);

  return (
    <div className="w-full h-full mt-16 flex flex-col gap-8">
      {/* First Row - Analysis Cards */}
      <div className="grid grid-cols-5 gap-4">
        {/* Total Footfall Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]
          shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
          transition-all duration-300 hover:bg-white/[0.04]">
          <h3 className="text-sm font-medium text-white mb-3">Total Traffic</h3>
          <div className="flex flex-col h-40">
            {/* Stats Section */}
            <div className="flex-1">
              <div className="text-5xl font-bold text-white">
                <CountUp
                  end={24382}
                  duration={2.5}
                  formattingFn={(value) => formatIndianNumber(value)}
                  preserveValue={true}
                />
                <span className="text-3xl">+</span>
              </div>
              <p className="text-sm text-gray-400">Active Vehicles</p>
            </div>

            {/* Chart Section */}
            <div className="h-16 -mx-4 -mb-4">
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
                  name: 'Traffic',
                  data: generateHourlyData(1200, 200)
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
          <h3 className="text-sm font-medium text-white mb-4">Traffic Flow Rate</h3>
          <div className="flex flex-col items-center justify-center h-40 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-1">
                <CountUp
                  end={2500}  // Peak hour entry rate
                  duration={2}
                  separator=","
                  suffix="/hr"
                  preserveValue={true}
                />
              </div>
              <div className="flex items-center gap-1">
                <FaArrowUp className="text-green-400 text-xs" />
                <span className="text-xs text-green-400">Incoming Traffic</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-1">
                <CountUp
                  end={2200}  // Peak hour exit rate
                  duration={2}
                  separator=","
                  suffix="/hr"
                  preserveValue={true}
                />
              </div>
              <div className="flex items-center gap-1">
                <FaArrowDown className="text-red-400 text-xs" />
                <span className="text-xs text-red-400">Outgoing Traffic</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">Current Flow Rate</div>
          </div>
        </div>

        {/* Utilization */}
        <GhatUtilizationDial />

        {/* Replace RiskLevelMeter with VehicleTypesPieChart */}
        <VehicleTypesPieChart />

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
          <span className="bg-[#0a0a0a] px-4 text-sm text-white/40">Traffic Monitoring</span>
        </div>
      </div>

      {/* Second Row - Camera Feed and Analysis */}
      <div className="flex gap-6 relative z-10">
        {/* Left Side - Gate Feeds */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Gate Selection */}
          <div className="grid grid-cols-3 gap-4">
            {monitoringPoints.map((point) => (
              <div
                key={point.id}
                onClick={() => setSelectedPoint(point)}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all
                  ${selectedPoint.id === point.id 
                    ? 'ring-2 ring-blue-500 scale-[1.02]' 
                    : 'hover:scale-[1.02] hover:ring-2 hover:ring-white/20'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <video 
                  src={point.src}
                  alt={point.label}
                  className="w-full aspect-video object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute bottom-2 left-2 right-2 z-20">
                  <p className="text-xs text-white/90 font-medium truncate">{point.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Gate Display */}
          <div className="relative rounded-xl overflow-hidden aspect-video">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <video 
              src={selectedPoint.src}
              alt="Source Feed"
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            
            {/* CCTV overlays */}
            <div className="absolute top-4 left-4 z-30 font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
              <span>CAM_{selectedPoint.id} • {selectedPoint.label}</span>
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
                    {trafficData.flow_metrics.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        {alert}
                      </div>
                    ))}
                  </div>
                </DataWidget>
              </motion.div>
            ) : (
              <motion.div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <ShimmerCard type="chart" />
                  <ShimmerCard type="chart" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Grid moved from RoadSafety */}
      <div className="grid grid-cols-6 gap-4 h-fit mt-4">
        {/* Entry Points */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Entry Points</h3>
            <p className="text-2xl font-bold text-blue-500">
              {locationStats.anpr.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="space-y-2">
            {locationStats.anpr.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.location}</span>
                  <span className="text-blue-500">{item.count}</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ 
                      width: `${(item.count / Math.max(...locationStats.anpr.map(i => i.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicles */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Vehicles</h3>
            <p className="text-2xl font-bold text-emerald-500">
              {vehicleTypeStats.total}
            </p>
          </div>
          <div className="space-y-2">
            {vehicleTypeStats.types.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.type}</span>
                  <span className="text-emerald-500">{item.count}</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ 
                      width: `${(item.count / Math.max(...vehicleTypeStats.types.map(i => i.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lane Violations */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Lane Violations</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {locationStats.laneViolations.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="space-y-2">
            {locationStats.laneViolations.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.location}</span>
                  <span className="text-yellow-500">{item.count}</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ 
                      width: `${(item.count / Math.max(...locationStats.laneViolations.map(i => i.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wrong Way */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Wrong Way</h3>
            <p className="text-2xl font-bold text-red-500">
              {locationStats.wrongWay.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="space-y-2">
            {locationStats.wrongWay.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.location}</span>
                  <span className="text-red-500">{item.count}</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full"
                    style={{ 
                      width: `${(item.count / Math.max(...locationStats.wrongWay.map(i => i.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Over Speeding */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Over Speeding</h3>
            <p className="text-2xl font-bold text-orange-500">
              {locationStats.overspeeding.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="space-y-2">
            {locationStats.overspeeding.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.location}</span>
                  <span className="text-orange-500">{item.count}</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full"
                    style={{ 
                      width: `${(item.count / Math.max(...locationStats.overspeeding.map(i => i.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accidents */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Accidents</h3>
            <p className="text-2xl font-bold text-purple-500">
              {locationStats.accidents.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="space-y-2">
            {locationStats.accidents.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.location}</span>
                  <span className="text-purple-500">{item.count}</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ 
                      width: `${(item.count / Math.max(...locationStats.accidents.map(i => i.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficFlow; 