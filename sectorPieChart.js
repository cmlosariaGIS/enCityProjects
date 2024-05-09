function toggleSlideMenuStats() {
    const slideMenuStats = document.getElementById('slideMenuStats');
    slideMenuStats.classList.toggle('active');
}

function createCharts() {
    // Debugging: Check if data is available
    console.log(data);

    const ctx = document.getElementById('sectorChart').getContext('2d');
    const sectorCounts = {};

    data.forEach(project => {
        if (sectorCounts[project.sector1]) {
            sectorCounts[project.sector1]++;
        } else {
            sectorCounts[project.sector1] = 1;
        }
    });

    const labels = Object.keys(sectorCounts);
    const values = Object.values(sectorCounts);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'];

    const totalProjectsCount = data.length;
    document.getElementById('totalProjectsCount').textContent = totalProjectsCount;

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map((label, index) => `${label} (${values[index]})`), // Add count value to each label
            datasets: [{
                data: values,
                backgroundColor: colors
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
    console.log(labels);
    console.log(values);

    // Create the legend below the chart
    const pieChartLegendContainer = document.querySelector('.chart-legend-sector');
    pieChartLegendContainer.innerHTML = ''; // Clear existing legend items
    chart.data.labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.classList.add('chart-legend-sector-item');

        const colorBox = document.createElement('div');
        colorBox.classList.add('legend-color');
        colorBox.style.backgroundColor = colors[index];

        const labelText = document.createElement('span');
        labelText.textContent = label;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        pieChartLegendContainer.appendChild(legendItem);
    });
}

window.onload = function () {
    createCharts();
};
