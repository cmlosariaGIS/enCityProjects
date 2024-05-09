function toggleSlideMenuStats() {
    const slideMenuStats = document.getElementById('slideMenuStats');
    slideMenuStats.classList.toggle('active');
}

function createCharts() {
    // Debugging: Check if data is available
    console.log(data);

    const ctx = document.getElementById('sectorChart').getContext('2d');
    const sectorCounts = {};
    const uniqueSectors = new Set();

    data.forEach(project => {
        if (sectorCounts[project.sector1]) {
            sectorCounts[project.sector1]++;
        } else {
            sectorCounts[project.sector1] = 1;
            uniqueSectors.add(project.sector1);
        }
    });

    const labels = Array.from(uniqueSectors);
    const values = labels.map(label => sectorCounts[label]);

    // Sort labels and values based on values (counts)
    const sortedData = labels.map((label, index) => ({ label, value: values[index] })).sort((a, b) => b.value - a.value);
    const sortedLabels = sortedData.map(item => item.label);
    const sortedValues = sortedData.map(item => item.value);

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF', '#FF8C00', '#7FFF00', '#8A2BE2', '#32CD32', '#FFD700', '#00FFFF', '#D2691E', '#00FF7F', '#FF1493', '#FF6347', '#FF4500', '#9370DB', '#3CB371', '#FA8072', '#00FF00', '#4682B4', '#DC143C'];

    const totalProjectsCount = data.length;
    document.getElementById('totalProjectsCount').textContent = totalProjectsCount;

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sortedLabels.map((label, index) => `${label} (${sortedValues[index]})`), // Add count value to each label
            datasets: [{
                data: sortedValues,
                backgroundColor: colors.slice(0, sortedLabels.length)
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
    console.log(sortedLabels);
    console.log(sortedValues);

    // Create the legend below the chart
    const pieChartLegendContainer = document.querySelector('.chart-legend-sector');
    pieChartLegendContainer.innerHTML = ''; // Clear existing legend items
    sortedLabels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.classList.add('chart-legend-sector-item');

        const colorBox = document.createElement('div');
        colorBox.classList.add('legend-color');
        colorBox.style.backgroundColor = colors[index];

        const labelText = document.createElement('span');
        labelText.textContent = `${label} (${sortedValues[index]})`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        pieChartLegendContainer.appendChild(legendItem);
    });
}

window.onload = function () {
    createCharts();
};
