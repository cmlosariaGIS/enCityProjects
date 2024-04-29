// Function to download attachments as zip file
function downloadAttachmentsAsZip(filteredData, fileName) {
    if (!filteredData || filteredData.length === 0) {
        console.log("No filters applied, all data attachments will be downloaded.");
        return;
    }

    // Create a new instance of JSZip
    var zip = new JSZip();

    // Create promises for each attachment download
    var promises = [];

    // Loop through each project
    filteredData.forEach(project => {
        // Get the attachment URL for each project
        var attachmentUrl = project.attachment;

        // Convert GitHub blob URL to raw URL
        attachmentUrl = attachmentUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob", "");

        // Create a promise for each attachment download
        var promise = new Promise((resolve, reject) => {
            // Create a new XMLHttpRequest
            var xhr = new XMLHttpRequest();
            xhr.open('GET', attachmentUrl, true);
            xhr.responseType = 'blob';

            // When the request is completed
            xhr.onload = function () {
                if (this.status == 200) {
                    // Add the downloaded attachment to the zip file
                    zip.file(project.projectName + '.pdf', this.response);
                    resolve();
                } else {
                    reject();
                }
            };

            // Send the request
            xhr.send();
        });

        // Add the promise to the promises array
        promises.push(promise);
    });

    // When all promises are resolved
    Promise.all(promises).then(() => {
        // Generate the zip file
        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // Create a temporary anchor element
                var anchor = document.createElement('a');
                var url = URL.createObjectURL(content);
                anchor.href = url;
                anchor.download = fileName + ".zip";

                // Append the anchor to the body
                document.body.appendChild(anchor);

                // Trigger a click event on the anchor
                anchor.click();

                // Remove the anchor from the body
                document.body.removeChild(anchor);

                // Clean up
                setTimeout(() => { URL.revokeObjectURL(url); }, 100);
            });
    });
}


// Event listener for download button
$('.downloadProjSheetsAsZip-button').on('click', function () {
    var filtersApplied = $('input[name="country"]:checked').length > 0 ||
        $('input[name="category"]:checked').length > 0 ||
        $('input[name="client-type"]:checked').length > 0 ||
        ($("#year-slider").slider("values")[0] !== 2018 || $("#year-slider").slider("values")[1] !== 2024) ||
        ($("#projectValue-slider").slider("values")[0] !== 0 || $("#projectValue-slider").slider("values")[1] !== 500000) ||
        ($("#projectScale-slider").slider("values")[0] !== 0 || $("#projectScale-slider").slider("values")[1] !== 100000);

    if (filtersApplied) {
        // If filters applied, download attachments for filtered data
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

        downloadAttachmentsAsZip(filteredData, "projectSheetsFiltered");
    } else {
        // If no filters applied, download attachments for all data
        downloadAttachmentsAsZip(data, "projectSheetsAll");
    }
});

