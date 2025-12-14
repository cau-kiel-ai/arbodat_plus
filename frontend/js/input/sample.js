
const sample_label_input = document.getElementById("sample_label");
const sample_feature_dropdown = document.getElementById("feature_dropdown");
// Sample location
const stratum_input = document.getElementById("stratum");
const layer_input = document.getElementById("layer");
const sector_input = document.getElementById("sector");
const planum_input = document.getElementById("planum");
const depth_from_input = document.getElementById("depth_from");
const depth_to_input = document.getElementById("depth_to");
// Coordinates
const coordinate_system_dropdown = document.getElementById("sample_coordinate_system");
const longitude_input = document.getElementById("sample_longitude");
const latitude_input = document.getElementById("sample_latitude");
const altitude_input = document.getElementById("sample_altitude");
const longitude_wgs84_input = document.getElementById("sample_longitude_wgs84");
const latitude_wgs84_input = document.getElementById("sample_latitude_wgs84");
// Measurement details
const botDetBy_selectpicker = document.getElementById("bot_det_by");
const year_of_bot_det_input = document.getElementById("bot_det_yr");
const sample_type_dropdown = document.getElementById("sample_type");
const sample_storage_checkbox = document.getElementById("storage");
const micro_remain_checkbox = document.getElementById("microRemain");
// Inventory
const seeds_and_fruits_dropdown = document.getElementById("seedsAndFruits");
const wood_subfossile_dropdown = document.getElementById("woodSubfossile");
const charcoal_investigated_dropdown = document.getElementById("charcoalInvestigated");
const charcoal_total_weight_input = document.getElementById("charcoal_total_weight");
const charcoal_undetermined_weight_input = document.getElementById("charcoal_undetermined_weight");
const volume_input = document.getElementById("sampleVolume");
const volume_determination_dry_radio = document.getElementById("dry");
const volume_determination_wet_radio = document.getElementById("wet");
// Sample dating
const chronozone_dropdown = document.getElementById("chronozone");
const archaeological_dating_input = document.getElementById("archaeologicalDating");
const cultural_group_input = document.getElementById("culturalGroup");
const remarks_textarea = document.getElementById("sample_remarks");


// Populate feature dropdown  -------------------------------------------------
sample_feature_dropdown.addEventListener('focus', () => {

    // Reset dropdown
    while (sample_feature_dropdown.options.length > 1) {
        sample_feature_dropdown.remove(1);
    }

    axios.get('http://localhost:8080/features')
    .then(response => {
        response.data.forEach(item => {
            // Create option
            const option = document.createElement('option');
            option.value = item.id;

            const projectNames = item.site.researchProjectList
                .map(rp => rp.projectName)
                .join(', ');
            option.textContent = item.label + " (site: " + item.site.label + ", research projects: " + projectNames + ")";

            sample_feature_dropdown.appendChild(option)
        });
    })
    .catch(error => {
        console.error('Error during feature GET request: ', error);
    });
});


// Handle coordinate input -> leaflet map -------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    
    // --------------------- customise here ---------------------
    const Accordion = document.getElementById('panelsStayOpen-collapseFive');
    const coordinate_system_dropdown = document.getElementById("sample_coordinate_system");
    const longitude_input = document.getElementById('sample_longitude');
    const latitude_input  = document.getElementById('sample_latitude');
    
    let inputTimer;
    const lat_wgs84 = document.getElementById('sample_latitude_wgs84');
    const lon_wgs84 = document.getElementById('sample_longitude_wgs84');
    
    const map_id = 'sample_map';
    // ----------------------------------------------------------

    await fetchDanteAttribute("coordinateSystem");
    populateDanteDropdown ("coordinateSystem", coordinate_system_dropdown);
    
    // // Init map when accordion is opened
    // Accordion.addEventListener('shown.bs.collapse', () => {
    //     initMap(map_id);
    //     map = mapStore.maps[map_id];

    //     map.on('click', function (e) {
    //         const { lat, lng } = e.latlng;
    //         updateMap(map_id, lat, lng);
            
    //         // Set wgs84 longitude and latitude input fields
    //         lon_wgs84.value = lng.toFixed(7);
    //         lat_wgs84.value = lat.toFixed(7);

    //         // Trigger handleWGS84Input function
    //         lon_wgs84.dispatchEvent(new Event("input"));
    //         lat_wgs84.dispatchEvent(new Event("input"));
    //     });
    // });

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

                        // // Trigger handleWGS84Input function
                        // lon_wgs84.dispatchEvent(new Event("input"));
                        // lat_wgs84.dispatchEvent(new Event("input"));
                    }
                } catch { // Clear wgs84 fields
                    console.log("failed to transform coordinates to WGS84");
                }
            }  
        }, 1000);  // ms
    }

    // lon_wgs84.addEventListener("input", () => {
    //     handleWGS84Input();
    // });
    // lat_wgs84.addEventListener("input", () => {
    //     handleWGS84Input();
    // });

    // async function handleWGS84Input() {
    //     if (inputTimer) {
    //         clearTimeout(inputTimer);
    //     }
    //     inputTimer = setTimeout(async () => {

    //         if (lon_wgs84.value && lat_wgs84.value) {
    //             updateMap(map_id, lat_wgs84.value, lon_wgs84.value)
    //         } else { // Reset map
    //             updateMap(map_id, default_latitude, default_longitude)
    //         }
    
    //     }, 1000);  // ms
    // }
});


// Populate botDetBy selectpicker ---------------------------------------------
document.getElementById('panelsStayOpen-collapseFive').addEventListener('shown.bs.collapse', () => {

    // Reset selectpicker
    botDetBy_selectpicker.innerHTML = '';

    // Get users
    axios.get('http://localhost:8080/users')
    .then(response => {
        response.data.forEach(user => {
            // Create option
            const option = document.createElement('option');

            let userName;
            if (user.firstName) {
                if (user.middleNames) {
                userName = `${user.lastName}, ${user.firstName} ${user.middleNames}`;
                } else {
                    userName = `${user.lastName}, ${user.firstName}`;
                }                                    
            } else {
                userName = `${user.lastName}`;
            }

            option.value = user.id;
            option.textContent = userName;

            botDetBy_selectpicker.appendChild(option)
        });                
    })
    .catch(error => {
        console.error('Error during user GET request: ', error);
    });
});

const botDetSelect = document.getElementById("bot_det_by");
let clicked = false;

botDetSelect.addEventListener("click", () => {
 clicked = true;

    if (!clicked) {
        // Get users
        axios.get('http://localhost:8080/users')
        .then(response => {
            response.data.forEach(user => {
                // Create option
                const option = document.createElement('option');

                let userName;
                if (user.firstName) {
                    if (user.middleNames) {
                    userName = `${user.lastName}, ${user.firstName} ${user.middleNames}`;
                    } else {
                        userName = `${user.lastName}, ${user.firstName}`;
                    }                                    
                } else {
                    userName = `${user.lastName}`;
                }

                option.value = user.id;
                option.textContent = userName;

                botDetBy_selectpicker.appendChild(option)
            });                
        })
        .catch(error => {
            console.error('Error during user GET request: ', error);
        });
    };
});

// Populate Dante dropdowns ---------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    await fetchDanteAttribute("sampleType");
    populateDanteDropdown ("sampleType", sample_type_dropdown);

    await fetchDanteAttribute("seedsAndFruits");
    populateDanteDropdown ("seedsAndFruits", seeds_and_fruits_dropdown);

    await fetchDanteAttribute("woodSubfossile");
    populateDanteDropdown ("woodSubfossile", wood_subfossile_dropdown);

    await fetchDanteAttribute("charcoalInvestigated");
    populateDanteDropdown ("charcoalInvestigated", charcoal_investigated_dropdown);

    await fetchDanteAttribute("chronozone");
    populateDanteDropdown ("chronozone", chronozone_dropdown);
});


// Submit/Update sample -------------------------------------------------------
function submit_update_Sample() {
    const sampleForm = document.getElementById('sampleForm');

    if (sampleForm.checkValidity()) {
        const sampleId = document.getElementById("sample_id").value;

        // Create sample payload
        const payload = {            
            // General -------------------------------------------
            feature: { id: sample_feature_dropdown.value },
            label: sample_label_input.value,
            
            // Sample location -----------------------------------
            stratum: stratum_input.value || null,
            layer: layer_input.value || null,
            sector: sector_input.value || null,
            planum: planum_input.value || null,
            depthFrom: depth_from_input.value,
            depthTo: depth_to_input.value,
            // Measurement details -------------------------------
            botanicalDeterminationBy: Array.from(botDetBy_selectpicker.selectedOptions).map(option => ({ id: option.value })),
            botanicalDeterminationYear: year_of_bot_det_input.value,
            sampleStorage: sample_storage_checkbox.checked,
            microRemain: micro_remain_checkbox.checked,
            // Inventory -----------------------------------------
            totalWeight: charcoal_total_weight_input.value,
            weightUndetermined: charcoal_undetermined_weight_input.value,
            sampleVolume: volume_input.value || null,
            volumeDetermination: volume_determination_dry_radio.checked
                                 ? "dry"
                                 : volume_determination_wet_radio.checked
                                 ? "wet"
                                 : null,
            // Sample dating
            archaeologicalDating: archaeological_dating_input.value || null,
            culturalGroup: cultural_group_input.value || null,
            remarksSample: remarks_textarea.value || null,
        };
        // Coordinates
        payload.coordinate = {
            coordinateSystem: coordinate_system_dropdown.value
                                ? { id: coordinate_system_dropdown.value,
                                    label: coordinate_system_dropdown.selectedOptions[0].text }
                                : null,
            longitude: longitude_input.value,
            latitude:  latitude_input.value,
            altitude:  altitude_input.value,
            longitudeWgs84: longitude_wgs84_input.value,
            latitudeWgs84:  latitude_wgs84_input.value,
        }

        // Fractions
        fraction_list = []
        for (let i = 1; i <= frac_counter; i++) {
            const fraction_analyzed = document.getElementById("fraction_analyzed_" + i);
            if (fraction_analyzed.value) {
                org = document.getElementById("org_" + i).checked;
                min = document.getElementById("min_" + i).checked;
                fraction = {
                    fractionAnalyzed: fraction_analyzed.value,
                    orgOrMin: org ? "org" : min ? "min" : null,
                    sieveSize: document.getElementById("sieveSize_" + i).value,
                    standardMultiplier: document.getElementById("multiplier_" + i).value
                }
                fraction_list.push(fraction);
            }
        }
        payload.fractionAnalyzedList = fraction_list;

        // Sample type
        if (sample_type_dropdown.value) {
            payload.sampleType = {
                id: sample_type_dropdown.value,
                label: sample_type_dropdown.selectedOptions[0].text
            }
        }        
        // Seeds and fruits
        if (seeds_and_fruits_dropdown.value) {
            payload.seedsAndFruits = {
                id: seeds_and_fruits_dropdown.value,
                label: seeds_and_fruits_dropdown.selectedOptions[0].text
            }
        }
        // Wood subfossile
        if (wood_subfossile_dropdown.value) {
            payload.woodSubfossile = {
                id: wood_subfossile_dropdown.value,
                label: wood_subfossile_dropdown.selectedOptions[0].text
            }
        }
        // Charcoal investigated
        if (charcoal_investigated_dropdown.value) {
            payload.charcoalInvestigated = {
                id: charcoal_investigated_dropdown.value,
                label: charcoal_investigated_dropdown.selectedOptions[0].text
            }
        }
        // Chronozone
        if (chronozone_dropdown.value) {
            payload.chronozone = {
                id: chronozone_dropdown.value,
                label: chronozone_dropdown.selectedOptions[0].text
            }
        }
        
        // Sample id
        if (sampleId) {
            payload.id = sampleId;
        }
        
        if (sampleId) { // update (PUT)
            axios.put(`http://localhost:8080/samples/${sampleId}`, payload)
            .then(response => {
                console.log(response.data);
                alert("sample updated");
            })
            .catch(error => {
                console.error('Error during PUT request to update sample:', error);
                alert("action failed");
            });
        } else { // create (POST)
            axios.post('http://localhost:8080/samples', payload)
            .then(response => {
                console.log(response.data);
                alert("sample created");

                // Reset Form
                sampleForm.reset();
            })
            .catch(error => {
                console.error('Error during POST request to create sample:', error);
                alert("action failed");
            });
        }

    } else {
        // Set focus on invalid field
        sample_feature_dropdown.focus();

        // wait until focus is set
        setTimeout(() => {
            sampleForm.reportValidity();
        }, 850);
    }
}
