import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#00C49F', '#FF8042'];

function App() {
  const [fraudCount, setFraudCount] = useState(0);
  const [legitCount, setLegitCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      setFraudCount(response.data.fraud);
      setLegitCount(response.data.legit);
      setChartData([
        { name: 'Legit', value: response.data.legit },
        { name: 'Fraud', value: response.data.fraud },
      ]);
    } catch (err) {
      alert('Error uploading file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Credit Card Fraud Detection
      </h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleUpload}
        className="mb-6 px-4 py-2 border rounded-md shadow-sm bg-white"
      />

      {loading && <p className="text-gray-500">Processing...</p>}

      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
            Transaction Summary
          </h2>
          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>

          <div className="mt-4 text-center">
            <p className="text-green-600 font-medium">
              Legit Transactions: {legitCount}
            </p>
            <p className="text-red-600 font-medium">
              Fraud Transactions: {fraudCount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
