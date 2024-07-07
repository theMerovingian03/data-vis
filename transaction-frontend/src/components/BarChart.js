import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import BASE_URL from '../config';

const BarChart = ({ month }) => {
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        fetchBarData();
    }, [month]);

    const fetchBarData = async () => {
        const response = await axios.get(`${BASE_URL}/bar-chart`, {
            params: { month },
        });

        setBarData(response.data);
    };

    const chartData = {
        labels: barData.map(item => item.range),
        datasets: [
            {
                label: 'Number of Items',
                data: barData.map(item => item.count),
                backgroundColor: 'rgba(75,192,192,0.6)',
            },
        ],
    };

    return (
        <div>
            <h3>Bar Chart for {month}</h3>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;
