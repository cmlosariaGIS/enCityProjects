// Function to download the attachments as a zip file
function downloadAttachments() {
    // Create a new instance of JSZip
    var zip = new JSZip();

    // Create promises for each attachment download
    var promises = [];

    // Loop through each project in the data array
    data.forEach(project => {
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
                anchor.download = "attachments.zip";

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
