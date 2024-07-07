function getMonthDateRange(month) {
    const startDate = new Date(`${month} 1, 2000`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    console.log(`Month: ${month}, Start Date: ${startDate}, End Date: ${endDate}`);
    return { startDate, endDate };
}

module.exports = { getMonthDateRange };
