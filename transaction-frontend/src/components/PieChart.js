import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import BASE_URL from '../config';

const PieChart = ({ month }) => {
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        fetchPieData();
    }, [month]);

    const fetchPieData = async () => {
        const response = await axios.get(`${BASE_URL}/pie-chart`, {
            params: { month },
        });

        setPieData(response.data);
    };

    const chartData = {
        labels: pieData.map(item => item._id),
        datasets: [
            {
                label: 'Number of Items',
                data: pieData.map(item => item.count),
                backgroundColor: pieData.map((_, idx) => `hsl(${idx * 60}, 70%, 50%)`),
            },
        ],
    };

    return (
        <div>
            <h3>Pie Chart for {month}</h3>
            <Pie data={chartData} />
        </div>
    );
};

export default PieChart;
