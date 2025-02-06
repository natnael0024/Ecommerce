"use client";

import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardCharts = ({ revenueData, salesData, orderStatusData }) => {
    const chartOptions = {
        responsive: true,
        plugins: {
          legend: { display: true }, 
          tooltip: { enabled: true },
        },
        scales: {
          x: { 
                grid: { 
                    display: false 
                } 
             }, 
          y: { 
                grid: { 
                    display: false 
                }, 
                ticks: {
                    display: false 
                },
                display: false
            },
            
        },
      };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg ">
      
      {/* Revenue Line Chart */}
      <div className="bg-white dark:bg-primary-200 p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
        <Line data={revenueData} options={chartOptions} />
      </div>

      {/* Sales Bar Chart */}
      <div className="bg-white dark:bg-primary-200 p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
        <Bar data={salesData} options={chartOptions} />
      </div>

      {/* Order Status Pie Chart */}
      {/* <div className="bg-white p-4  shadow rounded-lg col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Order Status</h2>
        <Pie data={orderStatusData} />
      </div> */}
    </div>
  );
};

export default DashboardCharts;
