// Function to toggle slide menu
function toggleSlideMenu() {
    const slideMenu = document.getElementById("slideMenu");
    slideMenu.classList.toggle("active");
}

// Function to get selected categories
function getSelectedCategories() {
    var selectedCategories = [];
    $('input[name="category"]:checked').each(function () {
        selectedCategories.push($(this).val());
    });
    return selectedCategories;
}

// Function to clear category selection
function clearCategorySelection() {
    $('input[name="category"]').prop('checked', false);
}

// Function to clear country selection
function clearCountrySelection() {
    $('input[name="country"]').prop('checked', false);
}

// Function to get selected client types
function getSelectedClientTypes() {
    var selectedClientTypes = [];
    $('input[name="client-type"]:checked').each(function () {
        selectedClientTypes.push($(this).val());
    });
    return selectedClientTypes;
}

// Function to clear client type selection
function clearClientSelection() {
    $('input[name="client-type"]').prop('checked', false);
}

// Function to initialize the year slider
$("#year-slider").slider({
    range: true,
    min: 2018,
    max: 2024,
    values: [2018, 2024],
    slide: function (event, ui) {
        $("#year-range").text(ui.values[0] + " - " + ui.values[1]);
    },
    create: function () {
        // Add tick indicators
        for (let i = 2018; i <= 2024; i++) {
            $("<div>").addClass("tick").css("left", (i - 2018) * (100 / 6) + "%").appendTo($("#year-slider"));
        }
    }
});

// Update current year label
$("#current-year").text("Years selected: 2018 - 2024");

$("#year-slider").on("slide", function (event, ui) {
    if (ui.values[0] === ui.values[1]) {
        $("#current-year").text("Year selected: " + ui.values[0]);
    } else {
        $("#current-year").text("Years selected: " + ui.values[0] + " - " + ui.values[1]);
    }
    $(".year-label").each(function () {
        $(this).css("left", (ui.values[0] - 2018) * (100 / 6) + "%");
    });
});


$(function () {
    $("#projectValue-slider").slider({
        range: true,
        min: 0,
        max: 500000,
        step: 50000,
        values: [0, 500000],
        slide: function (event, ui) {
            $("#current-projectValue").html("$" + ui.values[0].toLocaleString() + " - $" + ui.values[1].toLocaleString());
        }
    });

    // Initial display of values
    $("#current-projectValue").html("$0 - $500,000");
});

$(function () {
    $("#projectScale-slider").slider({
        range: true,
        min: 0,
        max: 100000,
        step: 100,
        values: [0, 100000],
        slide: function (event, ui) {
            $("#current-projectScale").html(ui.values[0].toLocaleString() + "ha - " + ui.values[1].toLocaleString() + "ha");
        }
    });

    // Initial display of values
    $("#current-projectScale").html("0ha - 100,000ha");
});


/*** RESET FILTERS BUTTON **/

// Function to reset the year slider
function resetYearSlider() {
    $("#year-slider").slider("values", [2018, 2024]);
    $("#current-year").text("Years selected: 2018 - 2024");
}

// Function to reset the project value slider
function resetProjectValueSlider() {
    $("#projectValue-slider").slider("values", [0, 500000]);
    $("#current-projectValue").text("$0 - $500,000");
}

// Function to reset the project scale slider
function resetProjectScaleSlider() {
    $("#projectScale-slider").slider("values", [0, 100000]);
    $("#current-projectScale").html("0ha - 100,000ha");
}


// Function to display initial points on the map
function displayInitialPoints() {
    data.forEach(function (project) {
        const popupContent = `
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
        const marker = L.marker([project.lat, project.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(popupContent, { maxWidth: 300 });
    });
}


// Call this function when resetting filters
function resetFilters() {
    clearCategorySelection();
    clearCountrySelection();
    clearClientSelection();
    resetYearSlider();
    resetProjectValueSlider();
    resetProjectScaleSlider();
    // Remove existing markers
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    // Hide no results message
    hideNoResultsMessage();
    // Display initial points
    displayInitialPoints();
}

// Event listener for Reset Filters button
$('.reset-filters-button').on('click', function () {
    resetFilters();
});


/*** APPLY FILTERS BUTTON **/

// Function to display no results message
function displayNoResultsMessage() {
    const messageContainer = document.getElementById("noResultsMessage");
    messageContainer.style.display = "block";
}

// Function to hide no results message
function hideNoResultsMessage() {
    const messageContainer = document.getElementById("noResultsMessage");
    messageContainer.style.display = "none";
}


// Event listener for Apply Filters button
$('.apply-filters-button').on('click', function () {
    // Get selected countries
    var selectedCountries = [];
    $('input[name="country"]:checked').each(function () {
        selectedCountries.push($(this).val());
    });

    // Get selected categories
    var selectedCategories = getSelectedCategories();

    // Get selected client types
    var selectedClientTypes = getSelectedClientTypes();

    // Get selected year range
    var selectedYearRange = $("#year-slider").slider("option", "values");

    // Get selected project value range
    var selectedProjectValueRange = $("#projectValue-slider").slider("option", "values");

    // Get selected project scale range
    var selectedProjectScaleRange = $("#projectScale-slider").slider("option", "values");

    // Filter data based on selected countries, categories, client types, year range, project value range, and project scale range
    var filteredData = data.filter(function (project) {
        var startYear = new Date(project.startDate).getFullYear();
        var completionYear = new Date(project.completionDate).getFullYear();
        return (
            (selectedCountries.length === 0 || selectedCountries.includes(project.country)) &&
            (
                selectedCategories.length === 0 ||
                selectedCategories.includes(project.sector1) ||
                selectedCategories.includes(project.sector2)
            ) &&
            (selectedClientTypes.length === 0 || selectedClientTypes.includes(project.clientType)) &&
            ((startYear >= selectedYearRange[0] && startYear <= selectedYearRange[1]) ||
                (completionYear >= selectedYearRange[0] && completionYear <= selectedYearRange[1])) &&
            (project.projectValue >= selectedProjectValueRange[0] && project.projectValue <= selectedProjectValueRange[1]) &&
            (project.projectScale >= selectedProjectScaleRange[0] && project.projectScale <= selectedProjectScaleRange[1])
        );
    });

    // Check if filtered data is empty
    if (filteredData.length === 0) {
        displayNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }

    // Remove existing markers
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add markers for filtered data
    filteredData.forEach(function (project) {
        const popupContent = `
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
        const marker = L.marker([project.lat, project.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(popupContent, { maxWidth: 300 });
    });


    var selectedCategories = getSelectedCategories();
    var selectedClientTypes = getSelectedClientTypes();
    var selectedYearRange = $("#year-slider").slider("option", "values");
    var selectedProjectValue = $("#projectValue-slider").slider("option", "values");
    var selectedProjectScale = $("#projectScale-slider").slider("option", "values");

    console.log("Selected Countries:", selectedCountries);
    console.log("Selected Categories:", selectedCategories);
    console.log("Selected Client Types:", selectedClientTypes);
    console.log("Selected Year Range:", selectedYearRange);
    console.log("Selected Project Value Range:", selectedProjectValue[0] + " - " + selectedProjectValue[1]);
    console.log("Selected Project Scale Range:", selectedProjectScale[0] + "ha - " + selectedProjectScale[1] + "ha");
});



