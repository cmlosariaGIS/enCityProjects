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
    const colorsCountry = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'];

    const totalProjectsCount = data.length;
    document.getElementById('totalProjectsCount').textContent = totalProjectsCount;

    const chartCountry = new Chart(ctxCountry, {
        type: 'doughnut',
        data: {
            labels: labelsCountry.map((label, index) => `${label} (${valuesCountry[index]})`), // Add count value to each label
            datasets: [{
                data: valuesCountry,
                backgroundColor: colorsCountry
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
    console.log(labelsCountry);
    console.log(valuesCountry);

    // Create the legend below the chart
    const pieChartLegendCountryContainer = document.querySelector('.chart-legend-country');
    pieChartLegendCountryContainer.innerHTML = ''; // Clear existing legend items
    chartCountry.data.labels.forEach((label, index) => {
        const legendItemCountry = document.createElement('div');
        legendItemCountry.classList.add('chart-legend-country-item');

        const colorBoxCountry = document.createElement('div');
        colorBoxCountry.classList.add('legend-color');
        colorBoxCountry.style.backgroundColor = colorsCountry[index];

        const labelTextCountry = document.createElement('span');
        labelTextCountry.textContent = label;

        legendItemCountry.appendChild(colorBoxCountry);
        legendItemCountry.appendChild(labelTextCountry);
        pieChartLegendCountryContainer.appendChild(legendItemCountry);
    });
}

window.onload = function () {
    createCharts();
    createCountryChart();
};
