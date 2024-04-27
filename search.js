// JavaScript: Integration of search functionality

// Function to handle search
function handleSearch() {
    // Get the search term
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    // Find the projects in the data that match the search term
    const matchingProjects = data.filter(project => {
        return Object.values(project).some(value => {
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm);
            }
            return false;
        });
    });

    // If projects found, highlight them on the map
    if (matchingProjects.length > 0) {
        // Clear existing markers
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Create an array to hold LatLng objects for each matching project
        const latLngs = [];

        // Add markers for the matching projects and populate the latLngs array
        matchingProjects.forEach(project => {
            const marker = L.marker([project.lat, project.lng], { icon: customIcon }).addTo(map);
            marker.bindPopup(createPopupContent(project), { maxWidth: 300 });
            latLngs.push([project.lat, project.lng]);
        });

        // Create a LatLngBounds object from the latLngs array
        const bounds = L.latLngBounds(latLngs);

        // Fit the map to the bounds with a padding of 10 and set the zoom level to 10
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 17 });
    } else {
        alert("No projects found");
    }
}

// Function to handle search button click
function searchButtonClick() {
    handleSearch();
}

// Function to handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
}

// Event listener for search button click
document.getElementById('searchButton').addEventListener('click', searchButtonClick);

// Event listener for Enter key press in the search input field
document.getElementById('searchInput').addEventListener('keypress', handleKeyPress);


// Function to re-create popup content
function createPopupContent(project) {
    return `
        <h2>${project.projectName}<br></h2>
        <b>Country:</b> ${project.country}<br>
        <b>Location:</b> ${project.location}<br>
        <b>Start Date:</b> ${project.startDate}<br>
        <b>Completion Date:</b> ${project.completionDate}<br>
        <b>Partner(s):</b> ${project.partner}<br>
        <b>Client:</b> ${project.client}<br>
        <b>Description:</b> ${project.description}<br>
        <b>Project Value ($):</b> ${project.projectValue}<br>
        <b>Project Scale (ha):</b> ${project.projectScale}<br>
        <b>Status:</b> ${project.status}<br>
        <b>Sector:</b> ${project.sector1}, ${project.sector2}<br>
        <p></p>
        <p style="font-size: 10px;"><i>Note: Project pinned location is indicative only</i></p>
        <div class="image-container">
            <a href="${project.photo1}" target="_blank">
                <img src="${project.photo1}" class="popup-image" id="popup-image">
            </a>
        </div>
        <div class="button-container">
            <div class="nav-buttons">
                <button class="prev-button" onclick="prevImage('${project.photo1}', '${project.photo2}')" title="Show previous image">navigate_before</button>
                <button class="next-button" onclick="nextImage('${project.photo1}', '${project.photo2}')" title="Show next image">navigate_next</button>
            </div>
            <div>
                <a href="${project.attachment}" target="_blank">
                <button class="download-button">
                    <span class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px;">description</span> <span style="vertical-align: middle;">Download Project Sheet</span>
                </button>
            </a>
            </div>
            <span class="material-icons-outlined close-button" onclick="closePopup()">
                highlight_off
            </span>
        </div>
    `;
}

// Function to show next image
function nextImage(photo1, photo2) {
    const image = document.getElementById('popup-image');
    if (image.src === photo1) {
        image.src = photo2;
        image.parentElement.href = photo2;
    } else {
        image.src = photo1;
        image.parentElement.href = photo1;
    }
    image.classList.add('fade-in');
    setTimeout(() => {
        image.classList.remove('fade-in');
    }, 1500); // Adjust timing to match animation duration
}

// Function to show previous image
function prevImage(photo1, photo2) {
    const image = document.getElementById('popup-image');
    if (image.src === photo1) {
        image.src = photo2;
        image.parentElement.href = photo2;
    } else {
        image.src = photo1;
        image.parentElement.href = photo1;
    }
    image.classList.add('fade-in');
    setTimeout(() => {
        image.classList.remove('fade-in');
    }, 1500); // Adjust timing to match animation duration
}

// Function to close the popup
function closePopup() {
    map.closePopup();
}
