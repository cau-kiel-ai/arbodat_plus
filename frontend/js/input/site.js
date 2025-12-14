
// Populate coordinate system dropdown ----------------------------------------
// Handle coordinate input -> leaflet map + reverse geocoding
document.addEventListener('DOMContentLoaded', async function () {
    
    // --------------------- customise here ---------------------
    const Accordion = document.getElementById('panelsStayOpen-collapseThree');
    const coordinate_system_dropdown = document.getElementById("site_coordinate_system");
    const longitude_input = document.getElementById('site_longitude');
    const latitude_input  = document.getElementById('site_latitude');
    // const altitude_input  = document.getElementById('site_altitude');
    
    let inputTimer;
    const lat_wgs84 = document.getElementById('site_latitude_wgs84');
    const lon_wgs84 = document.getElementById('site_longitude_wgs84');
    
    const map_id = 'site_map';
    // ----------------------------------------------------------
    
    await fetchDanteAttribute("coordinateSystem");
    populateDanteDropdown ("coordinateSystem", coordinate_system_dropdown);
    
    // Init map when accordion is opened
    Accordion.addEventListener('shown.bs.collapse', () => {
        initMap(map_id);
        map = mapStore.maps[map_id];

        map.on('click', function (e) {
            const { lat, lng } = e.latlng;
            updateMap(map_id, lat, lng);
            
            // Set wgs84 longitude and latitude input fields
            lon_wgs84.value = lng.toFixed(7);
            lat_wgs84.value = lat.toFixed(7);

            // Trigger handleWGS84Input function
            lon_wgs84.dispatchEvent(new Event("input"));
            lat_wgs84.dispatchEvent(new Event("input"));
        });
    });

    coordinate_system_dropdown.addEventListener("input", () => {
        handleCoordinateInput();
    });
    longitude_input.addEventListener("input", () => {
        handleCoordinateInput();
    });
    latitude_input.addEventListener("input", () => {
        handleCoordinateInput();
    });

    async function handleCoordinateInput() {
        if (inputTimer) {
            clearTimeout(inputTimer);
        }
        inputTimer = setTimeout(async () => {
    
            // Parse input
            const longitude = parseFloat(longitude_input.value);
            const latitude = parseFloat(latitude_input.value);
            const coordinateSystem = coordinate_system_dropdown.options[coordinate_system_dropdown.selectedIndex];
            let sourceEPSG = coordinateSystem?.getAttribute('data-crsNotation');
          
            if (longitude && latitude && sourceEPSG != null) {
                try {
                    // transform coordinates to WGS84
                    const { transformedLatitude, transformedLongitude } =
                    await transformCoordinatesToWGS84(longitude, latitude, sourceEPSG);
    
                    if (!isNaN(transformedLatitude) && !isNaN(transformedLongitude) && transformedLatitude != null) { // Update wgs84 fields
                        lat_wgs84.value = transformedLatitude;
                        lon_wgs84.value = transformedLongitude;

                        // Trigger handleWGS84Input function
                        lon_wgs84.dispatchEvent(new Event("input"));
                        lat_wgs84.dispatchEvent(new Event("input"));
                    }
                } catch { // Clear wgs84 fields
                    console.log("failed to transform coordinates to WGS84");
                }
            }  
        }, 1000);  // ms
    }

    lon_wgs84.addEventListener("input", () => {
        handleWGS84Input();
    });
    lat_wgs84.addEventListener("input", () => {
        handleWGS84Input();
    });

    async function handleWGS84Input() {
        if (inputTimer) {
            clearTimeout(inputTimer);
        }
        inputTimer = setTimeout(async () => {

            if (lon_wgs84.value && lat_wgs84.value) {
                updateMap(map_id, lat_wgs84.value, lon_wgs84.value)
    
                if ('site_map' === map_id) {
                    const address = await reverseGeocoding(lat_wgs84.value, lon_wgs84.value);
                    if (address) { // Set site address fields
                        document.getElementById('country').value = address.country || '';
                        document.getElementById('county').value = address.state || '';
                        document.getElementById('district').value = address.county || '';
                        document.getElementById('parish').value = address.village || address.suburb || '';
                        document.getElementById('street_or_place').value = address.road || address.neighbourhood || '';
                        document.getElementById('town').value = address.town || address.city || address.village || '';
                    } else { // Clear site address fields
                        document.getElementById('country').value         = '';
                        document.getElementById('county').value          = '';
                        document.getElementById('district').value        = '';
                        document.getElementById('parish').value          = '';
                        document.getElementById('street_or_place').value = '';
                        document.getElementById('town').value            = '';
                    }
                }
            } else { // Reset map
                updateMap(map_id, default_latitude, default_longitude)
    
                if ('site_map' === map_id) { // Clear site address fields
                    document.getElementById('country').value         = '';
                    document.getElementById('county').value          = '';
                    document.getElementById('district').value        = '';
                    document.getElementById('parish').value          = '';
                    document.getElementById('street_or_place').value = '';
                    document.getElementById('town').value            = '';
                }
            }
    
        }, 1000);  // ms
    }
});


const site_form = document.getElementById('site');
const rp_dropdown = document.getElementById("projectDropdownSite");
const clearIconSite = document.getElementById("clearIconSite");
const clearIconSiteLit = document.getElementById("clearIconSiteLit");

const rp_id_site = document.getElementById("rp_id_site");
const lit_id_site = document.getElementById("lit_id_site");
const rp_site = document.getElementById("projectName_in_site");
const lit_site = document.getElementById("literature_in_site");

const site_institution = document.getElementById("site_institution");
const site_institutionLabelList = document.getElementById('select-inst');

const user_site_Dropdown = document.querySelectorAll('.user_site_Dropdown');


// Populate Dante dropdowns --------------------------------------------
const taxonomyDropdown = document.getElementById("taxonomy");
const siteTypeDropdown = document.getElementById("select-site-type");
const naturalUnitDropdown = document.getElementById("select-natural-unit");

document.addEventListener("DOMContentLoaded", async () => {
    await fetchDanteAttribute("taxonomy");
    populateDanteDropdown("taxonomy", taxonomyDropdown);

    await fetchDanteAttribute("siteType");
    populateDanteDropdown("siteType", siteTypeDropdown);

    await fetchDanteAttribute("naturalUnit");
    populateDanteDropdown("naturalUnit", naturalUnitDropdown);
}); // -----------------------------------------------------------------


// ---------------- rp dropdown -------------------
function populateResearchProjectDropdown(itemList) {  
    rp_site.innerHTML = ""; // Reset dropdown

    const option = document.createElement("option");
    option.value = "";
    option.hidden = true;
    option.selected = true;
    rp_site.appendChild(option);

    itemList.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.projectName;
        rp_site.appendChild(option);
    });
}

rp_site.addEventListener("focus", () => {
    fetchAndPopulateDropdown({
        url: 'research_projects',
        populateFunction: populateResearchProjectDropdown,
        dropdownElement: rp_site});
});


// ---------------- literature dropdown ----------------
function populateLitDropdown(itemList) {  
    lit_site.innerHTML = ""; // Reset dropdown

    const option = document.createElement("option");
    option.value = "";
    option.hidden = true;
    option.selected = true;
    lit_site.appendChild(option); 
    
    itemList.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = formatLiterature(item);
        lit_site.appendChild(option);
    });
}

lit_site.addEventListener("focus", () => {
    fetchAndPopulateDropdown({
        url: 'literature',
        populateFunction: populateLitDropdown,
        dropdownElement: lit_site,            
    });
});


// ----------- institution dropdown ---------------------
function populateInstDropdown(itemList, input) {  
    input.innerHTML = ""; // Reset dropdown

    const option = document.createElement("option");
    option.value = "";
    option.hidden = true;
    option.selected = true;
    input.appendChild(option);

    itemList.forEach(item => {
        const option = document.createElement("option");
        option.textContent = formatInstitution(item);
        option.value = item.id;
        input.appendChild(option);
    });
}

site_institution.addEventListener("focus", () => {
    fetch('http://localhost:8080/institutions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        cachedItems = data;
        populateInstDropdown(cachedItems,site_institution);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// helper function --------------------------------
function fetchAndPopulateDropdown({url, populateFunction, dropdownElement}) {
    let cachedItems = [];

    fetch(`http://localhost:8080/${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        cachedItems = data;
        populateFunction(cachedItems);
        dropdownElement.classList.remove("hidden");
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// ----------- user dropdowns ---------------------

function fetchUsers() {
    return fetch('http://localhost:8080/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}

function populateUsrDropdown(itemList, input) {  
    input.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.hidden = true;
    option.selected = true;
    input.appendChild(option);

    itemList.forEach(item => {
        const option = document.createElement("option");
        option.textContent = formatName(item);
        option.value = item.id;
        input.appendChild(option);
    });
}

const inputs = [
    document.getElementById("head_of_exc"),
    document.getElementById("botanist"),
    document.getElementById("archeologist")
];

// refresh when clicked/Fokussed on Dropdown-Input
inputs.forEach(input => {
    input.addEventListener("focus", () => {
        fetchUsers().then(data => populateUsrDropdown(data, input));
    });
});


// ---------------------------- Payload construction --------------------------------
async function create_site() {
    
    if ( site_form.checkValidity() && window.rpList.length > 0 ) {
    
        // free text values:
        const activity_number = document.getElementById("activity_number");
        const site_label = document.getElementById("site_label");
        const site_label_abbrev = document.getElementById("site_label_abbreviation");
        const site_number = document.getElementById("site_number");
        const remarks = document.getElementById("remarks_site");

        // booleans:
        const uncertain_site_type = document.getElementById("site_type_uncertain");
        const condition_undisturbed_site = document.getElementById("site_condition_undisturbed");

        // taxonomy:
        const taxonomyDropdown = document.getElementById(`taxonomy`);
        const taxonomyId = taxonomyDropdown ? taxonomyDropdown.value : null;
        const taxonomyLabel = taxonomyDropdown ? taxonomyDropdown.options[taxonomyDropdown.selectedIndex].getAttribute("data-label") : null;    

        // siteType:
        const siteTypeDropdown = document.getElementById("select-site-type");
        // multiselected - directly handeled in payload

        // natural unit:
        const naturalUnitDropdown = document.getElementById(`select-natural-unit`);
        const naturalUnitId = naturalUnitDropdown ? naturalUnitDropdown.value : null;
        const naturalUnitLabel = naturalUnitDropdown ? naturalUnitDropdown.options[naturalUnitDropdown.selectedIndex].getAttribute("data-label") : null;    

        // institution and rorID: free text or local Server
        // see institutionList from institution_boxes.js

        // Coordinates:
        const lat_in = document.getElementById("site_latitude").value;
        const lon_in = document.getElementById("site_longitude").value;
        const alt_in = document.getElementById("site_altitude").value;
        const lat84_in = document.getElementById("site_latitude_wgs84").value;
        const lon84_in = document.getElementById("site_longitude_wgs84").value;
        const coordinate_system_dropdown = document.getElementById("site_coordinate_system");    

        // Addressfields:
        const country = document.getElementById('country').value;
        const county = document.getElementById('county').value;
        const district = document.getElementById('district').value;
        const parish = document.getElementById('parish').value;
        const street_or_place = document.getElementById('street_or_place').value;
        const town = document.getElementById('town').value;
        
        // select and transform form input into JS-Object
        var payload = {
            researchProjectList: rpList,
            literatureList: litList,
            activityNumber: activity_number.value.trim(),
            label: site_label.value.trim(),
            labelAbbreviation: site_label_abbrev.value.trim(),
            siteNumber: site_number.value.trim(),
            taxonomy: taxonomyId ? { id: taxonomyId, label: taxonomyLabel } : null,
            siteTypeList: Array.from(siteTypeDropdown.selectedOptions).map(option => ({ id: option.value })),
            siteTypeUncertain: uncertain_site_type.checked,
            naturalUnit: naturalUnitId ? { id: naturalUnitId, label: naturalUnitLabel } : null,
            undisturbed: condition_undisturbed_site.checked,
            remarksSite: remarks.value.trim(),
            siteDirectors: siteDirectorList,
            botanists: botanistList,
            archaeologists: archeologistList,
            address: {country: country, county: county, district: district, parish: parish, 
                street_or_place: street_or_place, town: town },
            coordinate: {
                coordinateSystem: coordinate_system_dropdown.value
                                ? { id: coordinate_system_dropdown.value,
                                    label: coordinate_system_dropdown.selectedOptions[0].text }
                                : null,
                latitude: lat_in,
                longitude: lon_in,
                altitude: alt_in,
                latitudeWgs84: lat84_in,
                longitudeWgs84: lon84_in,
            }
        };

        // Create FormData object
        const formData = new FormData();

        // Add institutionList (Ids of existing 'institutions' OR new institution objects without id) and site-Payload
        formData.append("institutionList", new Blob([JSON.stringify(window.institutionListSite)], { type: "application/json" }));
        formData.append("transferredSite", new Blob([JSON.stringify(payload)], { type: "application/json" }));

        try {
            const response = await axios.post('http://localhost:8080/sites', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data === "site is created") {
                alert("site created");
                
                // Form reset
                site_form.reset();
                window.rpList.length = 0;
                document.getElementById("rp_in_site_Container").innerHTML = '';
                window.litList.length = 0;
                document.getElementById("lit_in_site_Container").innerHTML = '';
                window.institutionListSite.length = 0;
                document.getElementById("institutionContainerSite").innerHTML = '';
                window.siteDirectorList.length = 0;
                document.getElementById("HeadOfExcContainer").innerHTML = '';
                window.archeologistList.length = 0;
                document.getElementById("ArcheologistContainer").innerHTML = '';
                window.botanistList.length = 0;
                document.getElementById("BotanistContainer").innerHTML = '';
            }
            if (response.data === "site already exists") {
                alert("site already exists");
            }
            console.log(response.data);
        } catch (error) {
            console.error('Error during POST request to create site:', error);
            alert("action failed");
        }
        
        

    } else {

        if ( !(window.rpList.length > 0) ) {
            rp_site.setCustomValidity("You must add at least one research project");
        } else {
            rp_site.setCustomValidity("");
        }

        // open Accordion, if invalid Field is in it
        site_form.querySelectorAll(":invalid").forEach(el => {
        const collapseParent = el.closest(".accordion-collapse");
            if (collapseParent && collapseParent.classList.contains("collapse")) {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseParent);
                bsCollapse.show();
            }
        });

        if ( !(window.rpList.length > 0) ) {
            rp_site.focus();
        } else {
            document.getElementById("site_label").focus();
        }
        
        // wait until focus is set
        setTimeout(() => {
            site_form.reportValidity();
        }, 600);  
    }
}

