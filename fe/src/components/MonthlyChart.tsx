import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataItem {
  product: string;
  total_quantity: number;
}

interface MonthlyChartProps {
  data: ChartDataItem[];
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.product),
    datasets: [
      {
        label: "Tổng số lượng sản phẩm",
        data: data.map((d) => d.total_quantity),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "red" }, // chữ legend màu đỏ
      },
      title: {
        display: true,
        text: "Tổng sản phẩm tồn kho hàng tháng",
        font: { size: 18 },
        color: "red", // chữ tiêu đề màu đỏ
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyChart;
