import { useState, useEffect } from 'react';
import { useBuildings } from '@/contexts/BuildingsContext';
import { useSpotManagement } from '@/contexts/SpotManagementContext';
import { useCarManagement } from '@/contexts/CarManagementContext';
import { LineChart, BarChart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart types
type ChartType = 'line' | 'bar';

// Date ranges
type DateRange = '24h' | '7d' | '30d' | 'custom';

export default function Reports() {
  const { selectedBuilding } = useBuildings();
  const { getSpotsByStatus } = useSpotManagement();
  const { parkingRecords } = useCarManagement();

  const [chartType, setChartType] = useState<ChartType>('line');
  const [dateRange, setDateRange] = useState<DateRange>('7d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Generate dates for the x-axis
  const generateDateLabels = () => {
    const dates = [];
    const now = new Date();
    let daysToShow = 7;
    
    if (dateRange === '24h') {
      // For 24 hours, show every 2 hours
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setHours(now.getHours() - (11 - i) * 2);
        dates.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } else if (dateRange === '7d') {
      // For 7 days
      daysToShow = 7;
    } else if (dateRange === '30d') {
      // For 30 days, show every 3 days
      daysToShow = 10;
      for (let i = 0; i < daysToShow; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - (daysToShow - 1 - i) * 3);
        dates.push(date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
      }
      return dates;
    } else if (dateRange === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      // For custom range, determine appropriate interval
      let interval = 1;
      if (daysDiff > 30) {
        interval = Math.ceil(daysDiff / 15); // Show ~15 data points
      }
      
      for (let i = 0; i <= daysDiff; i += interval) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
      }
      return dates;
    }
    
    // Default weekly view
    if (dates.length === 0) {
      for (let i = 0; i < daysToShow; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - (daysToShow - 1 - i));
        dates.push(date.toLocaleDateString([], { weekday: 'short' }));
      }
    }
    
    return dates;
  };

  // Generate sample data
  const generateOccupancyData = () => {
    const dates = generateDateLabels();
    
    // Generate random occupancy rates
    return dates.map(() => Math.floor(Math.random() * 40) + 50); // 50-90% occupancy
  };

  const generateRevenueData = () => {
    const dates = generateDateLabels();
    
    // Generate random revenue data
    return dates.map(() => Math.floor(Math.random() * 300) + 200); // $200-500
  };

  // Generate check-in count data
  const generateCheckinData = () => {
    const dates = generateDateLabels();
    
    // Generate random check-in counts
    return dates.map(() => Math.floor(Math.random() * 50) + 20); // 20-70 check-ins
  };

  // Set initial dates for custom range
  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    setStartDate(oneWeekAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  // Chart data
  const occupancyData = {
    labels: generateDateLabels(),
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: generateOccupancyData(),
        borderColor: '#FD593E',
        backgroundColor: 'rgba(253, 89, 62, 0.1)',
        fill: true,
        tension: 0.2,
        pointRadius: 3,
        pointBackgroundColor: '#FD593E',
      },
    ],
  };
  
  const revenueData = {
    labels: generateDateLabels(),
    datasets: [
      {
        label: 'Revenue ($)',
        data: generateRevenueData(),
        backgroundColor: '#FD593E',
        borderColor: '#FD593E',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };
  
  const checkinData = {
    labels: generateDateLabels(),
    datasets: [
      {
        label: 'Check-ins',
        data: generateCheckinData(),
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart options
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value, index, ticks) {
            return '$' + value;
          },
        },
      },
    },
  };

  const checkinChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!selectedBuilding) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">No Building Selected</h2>
          <p className="text-neutral-500">Please select a building to view reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-neutral-500">View reports and analytics for {selectedBuilding.name}</p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={chartType === 'line' ? 'primary' : 'outline'}
            onClick={() => setChartType('line')}
            icon={<LineChart className="h-5 w-5" />}
          >
            Line
          </Button>
          <Button
            variant={chartType === 'bar' ? 'primary' : 'outline'}
            onClick={() => setChartType('bar')}
            icon={<BarChart className="h-5 w-5" />}
          >
            Bar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label htmlFor="date-range" className="block text-sm font-medium text-neutral-700 mb-1">
                Date Range
              </label>
              <select
                id="date-range"
                className="select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-neutral-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    className="input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-neutral-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    className="input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <Button variant="secondary" className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium">Occupancy Rate Over Time</h3>
            <Button
              variant="outline"
              size="sm"
            >
              Export
            </Button>
          </div>
          <div className="card-body p-4">
            <div className="h-80">
              {chartType === 'line' ? (
                <Line data={occupancyData} options={lineChartOptions} />
              ) : (
                <Bar data={occupancyData} options={lineChartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium">Revenue Summary</h3>
            <Button
              variant="outline"
              size="sm"
            >
              Export
            </Button>
          </div>
          <div className="card-body p-4">
            <div className="h-80">
              {chartType === 'line' ? (
                <Line data={revenueData} options={barChartOptions} />
              ) : (
                <Bar data={revenueData} options={barChartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium">Check-ins by Day</h3>
            <Button
              variant="outline"
              size="sm"
            >
              Export
            </Button>
          </div>
          <div className="card-body p-4">
            <div className="h-80">
              <Bar data={checkinData} options={checkinChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Export buttons */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Export Options</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="card-body text-center p-6">
                <div className="text-neutral-700 mb-4">
                  <i className="fas fa-file-csv text-3xl"></i>
                  <LineChart className="h-12 w-12 mx-auto text-neutral-600" />
                </div>
                <h4 className="text-lg font-medium mb-2">CSV Export</h4>
                <p className="text-sm text-neutral-600 mb-4">Export raw data in CSV format for further analysis</p>
                <Button variant="outline" fullWidth>
                  Download CSV
                </Button>
              </div>
            </div>

            <div className="card bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="card-body text-center p-6">
                <div className="text-neutral-700 mb-4">
                  <BarChart className="h-12 w-12 mx-auto text-neutral-600" />
                </div>
                <h4 className="text-lg font-medium mb-2">PDF Report</h4>
                <p className="text-sm text-neutral-600 mb-4">Generate a comprehensive PDF report with charts and data</p>
                <Button variant="outline" fullWidth>
                  Generate PDF
                </Button>
              </div>
            </div>

            <div className="card bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="card-body text-center p-6">
                <div className="text-neutral-700 mb-4">
                  <i className="fas fa-file-excel text-3xl"></i>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium mb-2">Scheduled Reports</h4>
                <p className="text-sm text-neutral-600 mb-4">Set up automated reports on a schedule</p>
                <Button variant="outline" fullWidth>
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}