// Toggle slide menu stats
function toggleSlideMenuStats() {
    const slideMenuStats = document.getElementById('slideMenuStats');
    slideMenuStats.classList.toggle('active');
}

// Global variables to store original chart data
let originalLabelsCountry;
let originalValuesCountry;
let originalColorsCountry;

// Function to create country chart
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

    originalLabelsCountry = Object.keys(countryCounts);
    originalValuesCountry = Object.values(countryCounts);

    // Sort labels and values based on values (counts)
    const sortedData = originalLabelsCountry.map((label, index) => ({ label, value: originalValuesCountry[index] })).sort((a, b) => b.value - a.value);
    originalLabelsCountry = sortedData.map(item => item.label);
    originalValuesCountry = sortedData.map(item => item.value);

    originalColorsCountry = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'];

    const chartCountry = new Chart(ctxCountry, {
        type: 'doughnut',
        data: {
            labels: originalLabelsCountry.map((label, index) => `${label} (${originalValuesCountry[index]})`),
            datasets: [{
                data: originalValuesCountry,
                backgroundColor: originalColorsCountry.slice(0, originalLabelsCountry.length)
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
                                const label = context.label.split(' ')[0];
                                const percentage = ((context.parsed / data.length) * 100).toFixed(2) + '%';
                                return `${label} (${percentage})`;
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });

    // Store the chart instance in a global variable
    window.countryChart = chartCountry;

    // Create the legend below the chart
    createLegend(originalLabelsCountry, originalValuesCountry, originalColorsCountry);
}

// Function to update the country chart with filtered data
function updateCountryChart(filteredData) {
    const ctxCountry = document.getElementById('countryChart').getContext('2d');
    const countryCounts = {};

    filteredData.forEach(project => {
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

    // Update the chart data with filtered data
    window.countryChart.data.labels = sortedLabelsCountry.map((label, index) => `${label} (${sortedValuesCountry[index]})`);
    window.countryChart.data.datasets[0].data = sortedValuesCountry;
    window.countryChart.data.datasets[0].backgroundColor = colorsCountry.slice(0, sortedLabelsCountry.length);
    window.countryChart.update();

    // Create the legend below the chart
    createLegend(sortedLabelsCountry, sortedValuesCountry, colorsCountry);
}

/// Function to create the legend below the chart
function createLegend(sortedLabelsCountry, sortedValuesCountry, colorsCountry) {
    const pieChartLegendCountryContainer = document.querySelector('.chart-legend-country');
    pieChartLegendCountryContainer.innerHTML = ''; // Clear existing legend items

    sortedLabelsCountry.forEach((label, index) => {
        const legendItemCountry = document.createElement('div');
        legendItemCountry.classList.add('chart-legend-country-item');

        const colorBoxCountry = document.createElement('div');
        colorBoxCountry.classList.add('countrylegend-color');
        colorBoxCountry.style.backgroundColor = colorsCountry[index];

        const labelTextCountry = document.createElement('span');
        labelTextCountry.textContent = `${label} (${sortedValuesCountry[index]})`;

        legendItemCountry.appendChild(colorBoxCountry);
        legendItemCountry.appendChild(labelTextCountry);

        pieChartLegendCountryContainer.appendChild(legendItemCountry);
    });

    // Justify the legends to the left
    pieChartLegendCountryContainer.classList.add('legend-justify-left');
}

// Event listener for window load
window.addEventListener('load', function () {
    createCountryChart(); // Load the chart initially

    // Apply filters
    //document.getElementById('applyFiltersBtn').addEventListener('click', function () {
    //  const filteredData = filterData(); // Assuming filterData() function returns filtered data
    //updateCountryChart(filteredData);
    //});
});
