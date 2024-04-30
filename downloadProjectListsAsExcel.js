// Function to download Excel table
function downloadExcel() {
    var filtersApplied = $('input[name="country"]:checked').length > 0 ||
        $('input[name="category"]:checked').length > 0 ||
        $('input[name="client-type"]:checked').length > 0 ||
        ($("#year-slider").slider("values")[0] !== 2018 || $("#year-slider").slider("values")[1] !== 2024) ||
        ($("#projectValue-slider").slider("values")[0] !== 0 || $("#projectValue-slider").slider("values")[1] !== 500000) ||
        ($("#projectScale-slider").slider("values")[0] !== 0 || $("#projectScale-slider").slider("values")[1] !== 100000);

    if (filtersApplied) {
        // If filters applied, download Excel table for filtered data
        var filteredData = data.filter(function (project) {
            var startYear = new Date(project.startDate).getFullYear();
            var completionYear = new Date(project.completionDate).getFullYear();
            return (
                ($('input[name="country"]:checked').length === 0 || $('input[name="country"]:checked').toArray().some(c => c.value === project.country)) &&
                (
                    $('input[name="category"]:checked').length === 0 ||
                    $('input[name="category"]:checked').toArray().some(cat => cat.value === project.sector1 || cat.value === project.sector2)
                ) &&
                ($('input[name="client-type"]:checked').length === 0 || $('input[name="client-type"]:checked').toArray().some(t => t.value === project.clientType)) &&
                ((startYear >= $("#year-slider").slider("values")[0] && startYear <= $("#year-slider").slider("values")[1]) ||
                    (completionYear >= $("#year-slider").slider("values")[0] && completionYear <= $("#year-slider").slider("values")[1])) &&
                (project.projectValue >= $("#projectValue-slider").slider("values")[0] && project.projectValue <= $("#projectValue-slider").slider("values")[1]) &&
                (project.projectScale >= $("#projectScale-slider").slider("values")[0] && project.projectScale <= $("#projectScale-slider").slider("values")[1])
            );
        });

        createExcelTable(filteredData, 'projects_filtered.xls');
    } else {
        // If no filters applied, download Excel table for all data
        createExcelTable(data, 'projects_all.xls');
    }
}

// Function to create Excel table and download
function createExcelTable(data, fileName) {
    // Define the header row
    const header = [
        "Project Name",
        "Country",
        "Location",
        "Start Date",
        "Completion Date",
        "Partner(s)",
        "Client",
        "Description",
        "Project Value ($)",
        "Project Scale (ha)",
        "Status",
        "Sector",
        "Photo1",
        "Photo2",
        "Attachment"
    ];

    // Extract data for each row
    const rows = data.map(project => [
        project.projectName,
        project.country,
        project.location,
        project.startDate,
        project.completionDate,
        project.partner,
        project.client,
        project.description,
        project.projectValue,
        project.projectScale,
        project.status,
        `${project.sector1}, ${project.sector2}`,
        project.photo1,
        project.photo2,
        project.attachment
    ]);

    // Combine header and rows
    const excelData = [header, ...rows];

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Add the worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Projects");

    // Generate the Excel file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Save the file
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), fileName);
}
