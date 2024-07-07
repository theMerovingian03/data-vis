import React, { useState } from 'react';
import TransactionsTable from './TransactionsTable';
import Statistics from './Statistics';
import BarChart from './BarChart';
import PieChart from './PieChart';

const Dashboard = () => {
    const [month, setMonth] = useState('March');

    return (
        <div>
            <h1>Transactions Dashboard</h1>
            <label htmlFor="month-select">Select Month: </label>
            <select
                id="month-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
            >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>

            <TransactionsTable month={month} />
            <Statistics month={month} />
            <BarChart month={month} />
            <PieChart month={month} />
        </div>
    );
};

export default Dashboard;
