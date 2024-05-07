let chartCreated = false;

window.onload = function () {
    createCharts();
    chartCreated = true;
};

function toggleSlideMenuStats() {
    const slideMenuStats = document.getElementById('slideMenuStats');
    slideMenuStats.classList.toggle('active');
}

function createCharts() {
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



    // Create the legend below the chart
    const legendContainer = document.querySelector('.chart-legend');
    chart.data.labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.classList.add('chart-legend-item');

        const colorBox = document.createElement('div');
        colorBox.classList.add('legend-color');
        colorBox.style.backgroundColor = colors[index];

        const labelText = document.createElement('span');
        labelText.textContent = label;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legendContainer.appendChild(legendItem);
    });

    // Prepare data for treemap
    const countryCounts = {};
    data.forEach(project => {
        if (countryCounts[project.country]) {
            countryCounts[project.country]++;
        } else {
            countryCounts[project.country] = 1;
        }
    });

    const treemapColors = {
        'Vietnam': '#0A4158',     // for Vietnam
        'Singapore': '#4B8378',   // for Singapore
        'Indonesia': '#FF9636'    // for Indonesia
    };

    const totalProjects = data.length;

    const treemapData = [{
        type: 'treemap',
        labels: Object.keys(countryCounts),
        parents: Array(Object.keys(countryCounts).length).fill(''),
        values: Object.values(countryCounts),
        marker: {
            colors: Object.keys(countryCounts).map(country => treemapColors[country] || '#CCCCCC') // Assign colors based on country
        },
        textinfo: 'label+value+percent entry',
        hovertemplate: '%{label}<br>%{value} Projects<extra></extra>', // Add "Projects" in hover
        texttemplate: Object.keys(countryCounts).map(country => {
            const count = countryCounts[country];
            const percentage = (count / totalProjects) * 100;
            return `${country}<br>${count} Projects<br>${percentage.toFixed(2)}%`;
        }),
    }];


// Create Treemap using Plotly.js
Plotly.newPlot('treemapChart', treemapData, {
    margin: { t: 0 },
    width: 400, // Adjusted width for treemap
    height: 220, // Adjusted height for treemap
    layout: { padding: { t: 0 } }, // Minimize top padding
    displayModeBar: false // Hide the mode bar
});


}
