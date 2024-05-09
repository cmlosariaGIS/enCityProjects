// Function to generate random colors
function generateRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

const treemapData = data.reduce((acc, item, index) => {
    const existingCountry = acc.find(element => element.country === item.country);
    if (existingCountry) {
        existingCountry.projectValue += item.projectValue;
    } else {
        acc.push({
            country: item.country,
            projectValue: item.projectValue,
            color: generateRandomColor() // Generate a random color for each country
        });
    }
    return acc;
}, []);

const config = {
    type: 'treemap',
    data: {
        datasets: [
            {
                label: 'Projects',
                tree: treemapData,
                key: 'projectValue',
                borderWidth: 0,
                borderRadius: 6,
                spacing: 1,
                backgroundColor(ctx) {
                    if (ctx.type !== 'data') {
                        return 'transparent';
                    }
                    return ctx.raw._data.color;
                },
                labels: {
                    align: 'left',
                    display: true,
                    formatter(ctx) {
                        if (ctx.type !== 'data') {
                            return;
                        }
                        return [ctx.raw._data.country, '$' + ctx.raw.v];
                    },
                    color: ['white', 'whiteSmoke'],
                    font: [{ size: 14, weight: 'bold' }, { size: 12 }],
                    position: 'top'
                }
            }
        ],
    },
    options: {
        events: [],
        plugins: {
            title: {
                display: true,
                text: 'Sum of Projects Value'
            },
            legend: {
                display: false
            },
            tooltip: {
                enabled: true
            }
        }
    }
};

// Initialize the treemap chart
const ctx = document.getElementById('treemapChart').getContext('2d');
new Chart(ctx, config);
