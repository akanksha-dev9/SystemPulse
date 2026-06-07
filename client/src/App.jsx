import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App(){
  const [data, setData] = useState(null);
  const [cpuHistory, setCpuHistory] = useState([]);

  useEffect(() => {
  const interval = setInterval(() => {
    axios.get("http://localhost:5000/system")
      .then(res => {
        setData(res.data);

        // CPU history update
        setCpuHistory(prev => {
          const newData = [...prev, res.data.cpu];

          if (newData.length > 10) newData.shift();

          return newData;
        });
      })
      .catch(err => console.log(err));
    }, 2000);

     return () => clearInterval(interval);
  }, []);

  const chartData = {
  labels: cpuHistory.map((_, i) => i + 1),
  datasets: [
    {
      label: "CPU Usage",
      data: cpuHistory,
      borderWidth: 2
    }
  ]
  };

  const options = {
  responsive: true,
  animation: false
  };

  const health = data
  ? 100 - (data.cpu + data.ram) / 2
  : 0;

  if (!data) return <h1>Loading...</h1>;

  return (
    <div>
      <h1>System Monitor</h1>
      <h2>CPU: {data?.cpu?.toFixed(2)}%</h2>
      <h2>RAM: {data?.ram?.toFixed(2)}%</h2>
      <h2>{data.suggestion}</h2>
      <h3>CPU Usage Graph</h3>
      <Line data={chartData} options={options} />

      <h3>Top Processes:</h3>
      <ul>
        {data.processes.map((p, i) => (
          <li key={i}>{p.name}</li>
        ))}
      </ul>
      <h2>Health Score: {health.toFixed(0)}/100</h2>
    </div>
  );
}

export default App;