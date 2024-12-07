'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Download, Link, PaintBucket } from 'lucide-react'
import { ColorPicker } from '@/components/color-picker'
import { Slider } from '@/components/ui/slider'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function PackagePage() {
  const params = useParams()
  const [packageData, setPackageData] = useState<any>(null)
  const [downloadData, setDownloadData] = useState<any>(null)
  const [viewType, setViewType] = useState<'month' | 'week'>('month')
  const [loading, setLoading] = useState(true)
  const [chartColor, setChartColor] = useState('#FFD700')
  const [dateRange, setDateRange] = useState([0, 100])
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  const toggleColorPicker = () => {
    setIsColorPickerOpen(!isColorPickerOpen)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packageRes, downloadsRes] = await Promise.all([
          fetch(`/api/npm-package?package=${params.name}`),
          fetch(`/api/npm-downloads?package=${params.name}&period=${viewType}`)
        ])
        
        const packageJson = await packageRes.json()
        const downloadsJson = await downloadsRes.json()
        
        setPackageData(packageJson)
        setDownloadData(downloadsJson)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.name, viewType])

  const reduceDataPoints = (data: any[], labels: string[], maxPoints: number) => {
    if (data.length <= maxPoints) return { data, labels };
    
    const factor = Math.ceil(data.length / maxPoints);
    return {
      data: data.filter((_, index) => index % factor === 0),
      labels: labels.filter((_, index) => index % factor === 0)
    };
  };

  const filteredChartData = useMemo(() => {
    if (!downloadData) return null;

    const dates = Object.keys(downloadData);
    const startIndex = Math.floor(dates.length * (dateRange[0] / 100));
    const endIndex = Math.ceil(dates.length * (dateRange[1] / 100));

    const filteredDates = dates.slice(startIndex, endIndex);
    const filteredDownloads = filteredDates.map(date => downloadData[date]);

    // Reduce the number of data points
    const { data: reducedDownloads, labels: reducedDates } = reduceDataPoints(filteredDownloads, filteredDates, 20);

    return {
      labels: reducedDates,
      datasets: [
        {
          label: params.name as string,
          data: reducedDownloads,
          fill: true,
          borderColor: chartColor,
          backgroundColor: `${chartColor}20`,
          tension: 0,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: chartColor,
          pointBorderColor: 'white',
          pointBorderWidth: 2,
        }
      ]
    };
  }, [downloadData, dateRange, chartColor, params.name]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      tooltip: {
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#333',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y.toLocaleString()} downloads`
          }
        }
      },
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false, // Remove vertical grid lines
        },
        ticks: {
          color: '#666',
          maxTicksLimit: 6,
          padding: 10,
        }
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawTicks: false,
        },
        ticks: {
          color: '#666',
          padding: 10,
          count: 6, // This will create 5 spaces between ticks, resulting in 5 lines
          callback: (value: any) => {
            return `${(value / 1000000).toFixed(1)}M`
          }
        }
      }
    }
  }

  const handleSliderChange = (newRange: number[]) => {
    setDateRange(newRange)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {packageData && filteredChartData && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-1">
                {packageData.name} <span className="text-muted-foreground">v{packageData.version}</span>
              </h1>

              <div className="flex justify-between">
                <p className="text-muted-foreground mb-2">{packageData.description}</p>
                <button
                  onClick={toggleColorPicker}
                  className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Open color picker"
                >
                  <PaintBucket className="w-6 h-6 text-current" />
                </button>
                {isColorPickerOpen && (
                  <ColorPicker onChange={setChartColor} />
                )}
              </div>
            
              <a 
                href={packageData.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFD700] hover:underline inline-flex items-center"
              >
                {packageData.homepage}
              </a>
            </div>

            <div className="mb-4 font-mono">
              {filteredChartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0).toLocaleString()} total npm downloads
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewType('month')}
                  className={`px-3 py-1 rounded-md ${
                    viewType === 'month' ? 'bg-secondary' : 'text-muted-foreground'
                  }`}
                >
                  month
                </button>
                <button
                  onClick={() => setViewType('week')}
                  className={`px-3 py-1 rounded-md ${
                    viewType === 'week' ? 'bg-secondary' : 'text-muted-foreground'
                  }`}
                >
                  week
                </button>
              </div>
              <div className="flex gap-2 ml-auto">
                <button className="p-2 rounded-md bg-secondary">
                  <Download size={16} />
                </button>
                <button className="p-2 rounded-md bg-secondary">
                  <Link size={16} />
                </button>
              </div>
            </div>

            <div 
              className="relative aspect-[2/1] w-full rounded-lg p-4 bg-card overflow-hidden"
              style={{ 
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: chartColor
              }}
            >
              <Line data={filteredChartData} options={chartOptions} />
            </div>

            <div className="mt-8 px-4">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={dateRange}
                onValueChange={handleSliderChange}
                className="w-full"
                color={chartColor}
              />
              <div className="mt-2 text-sm text-muted-foreground flex justify-between">
                <span>Start: {filteredChartData.labels[0]}</span>
                <span>End: {filteredChartData.labels[filteredChartData.labels.length - 1]}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

