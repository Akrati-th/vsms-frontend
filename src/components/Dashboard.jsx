import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import apiService from '../services/api-services';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Analysis = () => {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await apiService.get('/pay/analysis/');

        if (response.data) {
          setDailyRevenue(response.data.daily_revenue);
          setWeeklyRevenue(response.data.weekly_revenue);
          setMonthlyRevenue(response.data.monthly_revenue);
        } else {
          setError('No data available');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  return (
    <div className="analysis-container">
      <h1>Analysis Dashboard</h1>

      {loading && <p>Loading revenue data...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="graphs-row">
        <div className="graph-section">
          <h2>Daily Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d0d0d0" />
              <XAxis dataKey="date" stroke="#4C585B" />
              <YAxis stroke="#4C585B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f4edd3',
                  borderRadius: '10px',
                  border: 'none',
                }}
                itemStyle={{ color: '#4C585B' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#7E99A3"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-section">
          <h2>Weekly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d0d0d0" />
              <XAxis dataKey="week" stroke="#4C585B" />
              <YAxis stroke="#4C585B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f4edd3',
                  borderRadius: '10px',
                  border: 'none',
                }}
                itemStyle={{ color: '#4C585B' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#A5BFCC" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-section">
          <h2>Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d0d0d0" />
              <XAxis dataKey="month" stroke="#4C585B" />
              <YAxis stroke="#4C585B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f4edd3',
                  borderRadius: '10px',
                  border: 'none',
                }}
                itemStyle={{ color: '#4C585B' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4C585B"
                strokeWidth={3}
                dot={{ r: 5, stroke: '#A5BFCC', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
