// Toggle slide menu stats
function toggleSlideMenuStats() {
    const slideMenuStats = document.getElementById('slideMenuStats');
    slideMenuStats.classList.toggle('active');
}

// Global variables to store original chart data
let originalLabelsSector;
let originalValuesSector;
let originalColorsSector;

// Reduce the vertical gaps between legend items
const adjustLegendItemsMargin = function () {
    const legendItems = document.querySelectorAll('.chart-legend-sector-item');
    legendItems.forEach(item => {
        item.style.marginBottom = '0px'; // Adjust margin between legend boxes
    });
};

// Function to create the legend below the sector chart
function createLegendSector(sortedLabelsSector, sortedValuesSector, colorsSector) {
    const pieChartLegendSectorContainer = document.querySelector('.chart-legend-sector');
    pieChartLegendSectorContainer.innerHTML = ''; // Clear existing legend items

    // Sort labels and values based on values (counts)
    const sortedData = sortedLabelsSector.map((label, index) => ({ label, value: sortedValuesSector[index] })).sort((a, b) => b.value - a.value);
    const sortedLabels = sortedData.map(item => item.label);
    const sortedValues = sortedData.map(item => item.value);

    // Display top 5 sectors
    sortedLabels.slice(0, 5).forEach((label, index) => {
        const legendItemSector = document.createElement('div');
        legendItemSector.classList.add('chart-legend-sector-item');

        const colorBoxSector = document.createElement('div');
        colorBoxSector.classList.add('sectorlegend-color');
        colorBoxSector.style.backgroundColor = colorsSector[index];

        const labelTextSector = document.createElement('span');
        labelTextSector.textContent = `${label} (${sortedValues[index]})`;

        legendItemSector.appendChild(colorBoxSector);
        legendItemSector.appendChild(labelTextSector);

        pieChartLegendSectorContainer.appendChild(legendItemSector);
    });

    // Reduce the vertical gaps between legend items
    adjustLegendItemsMargin();

    // Add expand button if there are more than 5 projects
    if (sortedLabels.length > 5) {
        const expandButton = document.createElement('button');
        expandButton.textContent = 'Show more';
        expandButton.classList.add('show-more-button');
        expandButton.onclick = function () {
            pieChartLegendSectorContainer.innerHTML = ''; // Clear existing legend items

            // Add legend items for all categories
            sortedLabelsSector.forEach((label, index) => {
                const legendItem = document.createElement('div');
                legendItem.classList.add('chart-legend-sector-item');

                const colorBox = document.createElement('div');
                colorBox.classList.add('sectorlegend-color');
                colorBox.style.backgroundColor = colorsSector[index];

                const labelText = document.createElement('span');
                labelText.textContent = `${label} (${sortedValuesSector[index]})`;

                legendItem.appendChild(colorBox);
                legendItem.appendChild(labelText);
                pieChartLegendSectorContainer.appendChild(legendItem);
            });

            adjustLegendItemsMargin(); // Adjust margin between legend boxes

            // Add "See Less" button
            const seeLessButton = document.createElement('button');
            seeLessButton.textContent = 'See Less';
            seeLessButton.classList.add('see-less-button');
            seeLessButton.onclick = function () {
                // Clear the legend container
                pieChartLegendSectorContainer.innerHTML = '';

                // Re-add legend items for top 5 categories
                sortedLabels.slice(0, 5).forEach((label, index) => {
                    const legendItem = document.createElement('div');
                    legendItem.classList.add('chart-legend-sector-item');

                    const colorBox = document.createElement('div');
                    colorBox.classList.add('sectorlegend-color');
                    colorBox.style.backgroundColor = colorsSector[index];

                    const labelText = document.createElement('span');
                    labelText.textContent = `${label} (${sortedValues[index]})`;

                    legendItem.appendChild(colorBox);
                    legendItem.appendChild(labelText);
                    pieChartLegendSectorContainer.appendChild(legendItem);
                });

                adjustLegendItemsMargin(); // Adjust margin between legend boxes

                // Re-add the "Show more" button
                pieChartLegendSectorContainer.appendChild(expandButton);
                seeLessButton.remove();
            };
            pieChartLegendSectorContainer.appendChild(seeLessButton);

            // Remove the "Show more" button
            expandButton.remove();
        };
        pieChartLegendSectorContainer.appendChild(expandButton);

        // Center the "Show more" button horizontally
        pieChartLegendSectorContainer.style.textAlign = 'center';
    }
}

// Function to create the sector chart
function createSectorChart() {
    const ctxSector = document.getElementById('sectorChart').getContext('2d');
    const sectorCounts = {};

    data.forEach(project => {
        if (sectorCounts[project.sector1]) {
            sectorCounts[project.sector1]++;
        } else {
            sectorCounts[project.sector1] = 1;
        }
    });

    originalLabelsSector = Object.keys(sectorCounts);
    originalValuesSector = Object.values(sectorCounts);

    // Sort labels and values based on values (counts)
    const sortedData = originalLabelsSector.map((label, index) => ({ label, value: originalValuesSector[index] })).sort((a, b) => b.value - a.value);
    originalLabelsSector = sortedData.map(item => item.label);
    originalValuesSector = sortedData.map(item => item.value);

    originalColorsSector = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF', '#FF8C00', '#7FFF00', '#8A2BE2', '#32CD32', '#FFD700', '#00FFFF', '#D2691E', '#00FF7F', '#FF1493', '#FF6347', '#FF4500', '#9370DB', '#3CB371', '#FA8072', '#00FF00', '#4682B4', '#DC143C'];

    const chartSector = new Chart(ctxSector, {
        type: 'doughnut',
        data: {
            labels: originalLabelsSector.map((label, index) => `${label} (${originalValuesSector[index]})`),
            datasets: [{
                data: originalValuesSector,
                backgroundColor: originalColorsSector.slice(0, originalLabelsSector.length)
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
    window.sectorChart = chartSector;

    // Create the legend below the chart
    createLegendSector(originalLabelsSector, originalValuesSector, originalColorsSector);
}

// Function to update the sector chart with filtered data
function updateSectorChart(filteredData) {
    const ctxSector = document.getElementById('sectorChart').getContext('2d');
    const sectorCounts = {};

    filteredData.forEach(project => {
        if (sectorCounts[project.sector1]) {
            sectorCounts[project.sector1]++;
        } else {
            sectorCounts[project.sector1] = 1;
        }
    });

    const labelsSector = Object.keys(sectorCounts);
    const valuesSector = Object.values(sectorCounts);

    // Sort labels and values based on values (counts)
    const sortedData = labelsSector.map((label, index) => ({ label, value: valuesSector[index] })).sort((a, b) => b.value - a.value);
    const sortedLabelsSector = sortedData.map(item => item.label);
    const sortedValuesSector = sortedData.map(item => item.value);

    const colorsSector = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF', '#FF8C00', '#7FFF00', '#8A2BE2', '#32CD32', '#FFD700', '#00FFFF', '#D2691E', '#00FF7F', '#FF1493', '#FF6347', '#FF4500', '#9370DB', '#3CB371', '#FA8072', '#00FF00', '#4682B4', '#DC143C'];

    // Update the chart data with filtered data
    window.sectorChart.data.labels = sortedLabelsSector.map((label, index) => `${label} (${sortedValuesSector[index]})`);
    window.sectorChart.data.datasets[0].data = sortedValuesSector;
    window.sectorChart.data.datasets[0].backgroundColor = colorsSector.slice(0, sortedLabelsSector.length);
    window.sectorChart.update();

    // Create the legend below the chart
    createLegendSector(sortedLabelsSector, sortedValuesSector, colorsSector);
}

// Event listener for window load
window.addEventListener('load', function () {
    createSectorChart(); // Load the chart initially

    // Apply filters
    //document.getElementById('applyFiltersBtn').addEventListener('click', function () {
    //  const filteredData = filterData(); // Assuming filterData() function returns filtered data
    //updateSectorChart(filteredData);
    //});
});
