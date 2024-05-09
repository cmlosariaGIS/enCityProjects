function createProjectsPerYearChart() {
// Extracting year from startDate
 const projectYears = data.map(project => new Date(project.startDate).getFullYear());

 // Counting projects per year
 const projectsPerYear = projectYears.reduce((acc, year) => {
     acc[year] = (acc[year] || 0) + 1;
     return acc;
 }, {});

 // Sorting projects per year by year
 const sortedProjectsPerYear = Object.entries(projectsPerYear).sort((a, b) => a[0] - b[0]);

 const years = sortedProjectsPerYear.map(item => item[0]);
 const counts = sortedProjectsPerYear.map(item => item[1]);

 // Create Line Chart
 const ctx = document.getElementById('projectsPerYearTrendLineChart').getContext('2d');
 const projectsPerYearChart = new Chart(ctx, {
     type: 'line',
     data: {
         labels: years,
         datasets: [{
             label: 'Projects per Year',
             data: counts,
             backgroundColor: 'rgba(54, 162, 235, 0.2)',
             borderColor: 'rgb(0, 151, 174)',
             borderWidth: 2
         }]
     },
     options: {
         plugins: {
             title: {
                 display: true,
                 text: ''
             },
             legend: {
                 display: false
             }
         }
     }
 });
}

// Initialize the chart when the page is loaded
window.addEventListener('load', createProjectsPerYearChart);