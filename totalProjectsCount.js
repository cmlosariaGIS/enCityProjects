const totalProjectsCount = data.length;
document.getElementById('totalProjectsCount').textContent = totalProjectsCount;


/*Update Project Count based on Applied Filters or Reset button*/
// Function to update total projects count
function updateTotalProjectsCount(count) {
    document.getElementById('totalProjectsCount').textContent = count;
}
