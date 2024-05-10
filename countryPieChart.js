function toggleSlideMenuStats() {
    const slideMenuStats = document.getElementById('slideMenuStats');
    slideMenuStats.classList.toggle('active');
}

function createCountryChart() {
    const ctxCountry = document.getElementById('countryChart').getContext('2d');
    const countryCounts = {};

    data.forEach(project => {
        if (countryCounts[project.country]) {
            countryCounts[project.country]++;
        } else {
            countryCounts[project.country] = 1;
        }
    });

    const labelsCountry = Object.keys(countryCounts);
    const valuesCountry = Object.values(countryCounts);

    // Sort labels and values based on values (counts)
    const sortedData = labelsCountry.map((label, index) => ({ label, value: valuesCountry[index] })).sort((a, b) => b.value - a.value);
    const sortedLabelsCountry = sortedData.map(item => item.label);
    const sortedValuesCountry = sortedData.map(item => item.value);

    const colorsCountry = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'];

    const totalProjectsCount = data.length;
    document.getElementById('totalProjectsCount').textContent = totalProjectsCount;

    const chartCountry = new Chart(ctxCountry, {
        type: 'doughnut',
        data: {
            labels: sortedLabelsCountry.map((label, index) => `${label} (${sortedValuesCountry[index]})`), // Add count value to each label
            datasets: [{
                data: sortedValuesCountry,
                backgroundColor: colorsCountry.slice(0, sortedLabelsCountry.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (context.parsed !== null) {
                                const label = context.label.split(' ')[0]; // Remove the count from the label
                                const percentage = ((context.parsed / totalProjectsCount) * 100).toFixed(2) + '%'; // Calculate the correct percentage
                                return `${label} (${percentage})`; // Add percentage to the legend label
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });

    // Debugging: Check if chart data is correct
    console.log(sortedLabelsCountry);
    console.log(sortedValuesCountry);

    // Create the legend below the chart
    const pieChartLegendCountryContainer = document.querySelector('.chart-legend-country');
    pieChartLegendCountryContainer.innerHTML = ''; // Clear existing legend items
    sortedLabelsCountry.forEach((label, index) => {
        const legendItemCountry = document.createElement('div');
        legendItemCountry.classList.add('chart-legend-country-item');

        const colorBoxCountry = document.createElement('div');
        colorBoxCountry.classList.add('legend-color');
        colorBoxCountry.style.backgroundColor = colorsCountry[index];

        const labelTextCountry = document.createElement('span');
        labelTextCountry.textContent = `${label} (${sortedValuesCountry[index]})`;

        legendItemCountry.appendChild(colorBoxCountry);
        legendItemCountry.appendChild(labelTextCountry);
        pieChartLegendCountryContainer.appendChild(legendItemCountry);

        // Reduce the vertical gaps between legend items
        if (index < sortedLabelsCountry.length - 1) {
            legendItemCountry.style.marginBottom = '0px'; // Adjust margin between legend boxes as needed
        }
    });
}

window.onload = function () {
    createCharts();
    createCountryChart();
};
