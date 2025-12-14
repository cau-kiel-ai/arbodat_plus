
// Populate Dante dropdowns --------------------------------------------
const featureTypeDropdown = document.getElementById("feature_type");
const preservationConditionDropdown = document.getElementById("preservation_condition_feature");

document.addEventListener("DOMContentLoaded", async () => {
    await fetchDanteAttribute("featureType");
    populateDanteDropdown("featureType", featureTypeDropdown);

    await fetchDanteAttribute("preservationCondition");
    populateDanteDropdown("preservationCondition", preservationConditionDropdown);
}); // -----------------------------------------------------------------


document.addEventListener("DOMContentLoaded", () => {

    // Populate site dropdown ------------------------------------
    const site_dropdown = document.getElementById("which_site");

    site_dropdown?.addEventListener("focus", () => {
        while (site_dropdown.options.length > 1) {
            site_dropdown.remove(1);
        }

        fetch('http://localhost:8080/sites', {
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
            // Populate dropdown
            data.forEach(site => {
                const option = document.createElement('option');
                option.value = site.id;
        
                let siteName;
                if (site.activityNumber) {
                    siteName = `${site.label}, ${site.activityNumber}`;                                               
                } else {
                    siteName = `${site.label}`;
                }
                option.textContent = siteName;
                option.setAttribute("data-label", siteName);
                option.style.display = 'inline-block';
                option.style.whiteSpace = 'nowrap';
                option.style.overflow = 'hidden';
                option.style.maxWidth = '95%';

                site_dropdown.appendChild(option);
            });
        })
    });

    // Excavation years ------------------------------------------
    const select = document.getElementById("excavation_years");
        const currentYear = new Date().getFullYear();
        const endYear = currentYear + 3;

    for (let year = endYear; year >= 1800; year--) {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        select.appendChild(opt);
    }

});


// Create/Update feature -------------------------------------------------------
async function create_feature() {

    const feature_form = document.getElementById('feature');
    if (feature_form.checkValidity()) {

        const featureId = document.getElementById("feature_id").value;

        // Create feature payload ---------------------
        const ref_site = document.getElementById("which_site").value;
        const feature_label = document.getElementById("feature_label").value;
        const exc_area = document.getElementById("excavation_area").value;
        const cond_satisfactory = document.getElementById("feature_condition").checked;
        const selectedYears = Array.from(excavation_years.selectedOptions).map(opt => parseInt(opt.value));
        const building_context = document.getElementById("building_context").checked;
        const remarks = document.getElementById("remarks_feature").value;        
        // preservation condition
        const PreservationConditionDropdown = document.getElementById(`preservation_condition_feature`);
        const PreservationConditionId = PreservationConditionDropdown ? PreservationConditionDropdown.value : null;
        const PreservationConditionLabel = PreservationConditionDropdown ? PreservationConditionDropdown.options[PreservationConditionDropdown.selectedIndex].getAttribute("data-label") : null;    
        // feature type
        const FeatureTypeDropdown = document.getElementById(`feature_type`);
        const FeatureTypeId = FeatureTypeDropdown ? FeatureTypeDropdown.value : null;
        const FeatureTypeLabel = FeatureTypeDropdown ? FeatureTypeDropdown.options[FeatureTypeDropdown.selectedIndex].getAttribute("data-label") : null;    

        var payload = {
            site: {id: ref_site},
            label: feature_label,
            excavationArea: exc_area,
            featureCondition: cond_satisfactory,
            preservationCondition: PreservationConditionId ? { id: PreservationConditionId, label: PreservationConditionLabel } : null,
            featureType: FeatureTypeId ? { id: FeatureTypeId, label: FeatureTypeLabel } : null,
            excavationYears: selectedYears,
            buildingContext: building_context,
            remarksFeature: remarks,
            //archaeologicalDatingList: null,
            //culturalGroupList: null
        };

        // feature id
        if (featureId) {
            payload.id = featureId;
        }

        if (featureId) { // update (PUT)
            axios.put(`http://localhost:8080/features/${featureId}`, payload)
            .then(response => {
                console.log(response.data);
                alert("feature updated");
            })
            .catch(error => {
                console.error('Error during PUT request to update feature:', error);
                alert("action failed");
            });
        } else { // create (POST)
            axios.post('http://localhost:8080/features', payload)
            .then(response => {
                console.log(response.data);
                alert("feature created");

                // Reset form
                feature_form.reset();
                document.getElementById("feature_submit_update_button").innerHTML="create"
            })
            .catch(error => {
                console.error('Error during POST request to create feature:', error);
                alert("action failed");
            });
        }
       
    } else {
        // Set focus on invalid field
        document.getElementById("which_site").focus();

        // wait until focus is set
        setTimeout(() => {
            feature_form.reportValidity();
        }, 350);
    }
};

