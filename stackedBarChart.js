let chartData; // Declare chartData globally

// Define the color roster as a global variable
const colorRoster = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF', '#FF8C00', '#7FFF00', '#8A2BE2', '#32CD32', '#FFD700', '#00FFFF', '#D2691E', '#00FF7F', '#FF1493', '#FF6347', '#FF4500', '#9370DB', '#3CB371', '#FA8072', '#00FF00', '#4682B4', '#DC143C'];

document.addEventListener('DOMContentLoaded', function() {
    // Extract years and sectors
    const years = Array.from(new Set(data.map(item => {
        const yearMatch = item.startDate.match(/\d{4}/); // Match 4-digit year
        return yearMatch ? parseInt(yearMatch[0]) : null; // Extract the matched year or return null
    }).filter(year => year && year >= 2018 && year <= 2024))); // Filter out null values and years outside the range
    
    years.sort((a, b) => a - b); // Sort years in ascending order

    const sectors = Array.from(new Set(data.map(item => item.sector1)));

    // Prepare data for the chart
    chartData = { // Assign to global variable
        labels: years.map(year => year.toString()), // Convert years to string
        datasets: sectors.map((sector, index) => ({
            label: sector,
            backgroundColor: '', // No need to set here
            data: years.map(year => data.filter(item => {
                const yearMatch = item.startDate.match(/\d{4}/);
                return yearMatch && parseInt(yearMatch[0]) === year && item.sector1 === sector;
            }).length)
        }))
    };

    // Use the same color roster for consistency
    chartData.datasets.forEach((dataset, index) => {
        const colorIndex = index < colorRoster.length ? index : index % colorRoster.length;
        dataset.backgroundColor = colorRoster[colorIndex]; // Use color roster
    });

    // Sort datasets by total count
    chartData.datasets.sort((a, b) => {
        const sumA = a.data.reduce((acc, val) => acc + val, 0);
        const sumB = b.data.reduce((acc, val) => acc + val, 0);
        return sumB - sumA;
    });


    
    // Create stacked bar chart
    const ctxBar = document.getElementById('projectSectorPerYearBarGraph').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: chartData,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Project Sector by Year',
                    font: {
                        weight: 'bold' // Make the title bold
                    }
                },
                legend: {
                    position: 'bottom', // Legend at the bottom
                    labels: {
                        boxWidth: 20, // Set the width of legend boxes
                        usePointStyle: true // Use a circular point style
                    }
                },
                labels: {
                    render: 'value' // Show count labels at the tip of the bar stacks
                }
            },
            responsive: true,
            indexAxis: 'x', // Years on X-axis
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            weight: 'bold' // Make the X-axis label bold
                        }
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Projects',
                        font: {
                            weight: 'bold' // Make the Y-axis label bold
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 50,
                    bottom: 50
                }
            }
        }
    });
});


function expandChart() {
    const modal = document.getElementById('expandedChartModal');
    modal.style.display = 'block';

    const ctx = document.getElementById('expandedChartCanvas').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: chartData, // Use global variable
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '',
                },
                legend: {
                    display: true,
                    position: 'bottom', // Legend at the bottom
                    labels: {
                        boxWidth: 20, // Set the width of legend boxes
                        usePointStyle: true // Use a circular point style
                    }
                }
            },
            indexAxis: 'x',
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            weight: 'bold' // Make the X-axis label bold
                        }
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Projects',
                        font: {
                            weight: 'bold' // Make the Y-axis label bold
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 50,
                    bottom: 50
                }
            }
        }
    });
}


function closeExpandedChart() {
    const modal = document.getElementById('expandedChartModal');
    modal.style.display = 'none';
}
