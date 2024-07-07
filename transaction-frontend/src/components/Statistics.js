import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
    });

    useEffect(() => {
        fetchStatistics();
    }, [month]);

    const fetchStatistics = async () => {
        const response = await axios.get(`${BASE_URL}/statistics`, {
            params: { month },
        });

        setStatistics(response.data);
    };

    return (
        <div>
            <h3>Statistics for {month}</h3>
            <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
    );
};

export default Statistics;
