const colorPalette = [
    "#1A5653", // Forest Green
    "#107869", // Teal Green
    "#5CD85A", // Lime Green
    "#08313A", // Forest Green
    "#76B947", // Kelly Green
    "#B1D8B7", // Seafoam Green
    "#2F5233", // Spearmint
    "#94C973"  // Spearmint
];

// Function to convert hex to RGB
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

const treemapData = data.reduce((acc, item, index) => {
    const existingCountry = acc.find(element => element.country === item.country);
    if (existingCountry) {
        existingCountry.projectValue += item.projectValue;
    } else {
        acc.push({
            country: item.country,
            projectValue: item.projectValue,
            color: colorPalette[index % colorPalette.length] // Cycle through the color palette
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
                hoverOffset: 5, // Adjust the hover offset
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
        plugins: {
            title: {
                display: true,
                text: ''
            },
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    title(items) {
                        const dataItem = items[0].raw;
                        const obj = dataItem._data;
                        return obj.country;
                    },
                    label(context) {
                        return '$' + context.raw.v;
                    }
                }
            }
        }
    }
};

// Initialize the treemap chart
const ctx = document.getElementById('treemapChart').getContext('2d');
new Chart(ctx, config);
