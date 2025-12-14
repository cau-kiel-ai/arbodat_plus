
const sampleDropdown = document.getElementById("result_sample_dropdown");
const absDatingSelectpicker = document.getElementById("which_datings");
const fractionDropdown = document.getElementById("which_fraction");
const taxCodeDropdown = document.getElementById("taxCode");

// Populate sample dropdown  ------------------------------------------------------
sampleDropdown.addEventListener('focus', () => {

    // Reset dropdown
    while (sampleDropdown.options.length > 1) {
        sampleDropdown.remove(1);
    }

    axios.get('http://localhost:8080/samples')
    .then(response => {
        response.data.forEach(item => {
            // Create option
            const option = document.createElement('option');
            option.value = item.id;

            const projectNames = item.feature.site.researchProjectList
                .map(rp => rp.projectName)
                .join(', ');
            option.textContent = item.label + " (feature: " + item.feature.label + ", site: " + item.feature.site.label + ", research projects: " + projectNames + ")";

            if (item.feature.site.taxonomy) {
                option.setAttribute('data-taxonomyUri', item.feature.site.taxonomy.id);
                option.setAttribute('data-taxonomyLabel', item.feature.site.taxonomy.label);
            }

            sampleDropdown.appendChild(option)
        });
    })
    .catch(error => {
        console.error('Error during sample GET request: ', error);
    });

});

document.addEventListener("DOMContentLoaded", () => {
    
    sampleDropdown.addEventListener("change", async (event) => {
        const selectedSampleId = event.target.value;

    // Populate absolute dating selectpicker  -------------------------------------
        // Reset selectpicker
        absDatingSelectpicker.innerHTML = '';

        // Get absolute dating
        axios.get('http://localhost:8080/absolute_datings')
        .then(response => {
            // Filter AbsDatings that match the selected sample
            const filteredItems = response.data.filter(item =>
            item.sample.id == selectedSampleId
            );

            filteredItems.forEach(item => {
                // Create option
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.subSample;

                absDatingSelectpicker.appendChild(option)
            });                
        })
        .catch(error => {
            console.error('Error during absolute dating GET request: ', error);
        });

    // Populate fraction dropdown -------------------------------------------------
        // Reset dropdown
        fractionDropdown.length = 1;
        fractionDropdown.dispatchEvent(new Event("change"));

        // Get absolute dating
        axios.get('http://localhost:8080/fractions_analyzed')
        .then(response => {
            // Filter fractions that match the selected sample
            const filteredItems = response.data.filter(item =>
                item.sample.id == selectedSampleId
            );

            filteredItems.forEach(item => {
                // Create option
                const option = document.createElement('option');
                option.value = item.id;

                //option.textContent = item.orgOrMin + " " + item.sieveSize;
                let formattedText = formatFraction(item);

                // Always replace the part that contains `fractionAnalyzed` with an empty s
                formattedText = formattedText.replace(`${item.fractionAnalyzed ? ' ' + item.fractionAnalyzed : ''}`, '').trim();
                option.textContent = formattedText;
                //option.textContent = formatFraction(item);

                option.setAttribute('data-fractionAnalyzed', item.fractionAnalyzed);
                option.setAttribute('data-orgOrMin', item.orgOrMin);
                option.setAttribute('data-sieveSize', item.sieveSize);
                option.setAttribute('data-standardMultiplier', item.standardMultiplier);

                fractionDropdown.appendChild(option)
            });                
        })
        .catch(error => {
            console.error('Error during fraction analyzed GET request: ', error);
        });

    // Populate tax code dropdown -------------------------------------------------
        // Get taxonomy of corresponding site
        const taxonomyUri = sampleDropdown.options[sampleDropdown.selectedIndex].getAttribute('data-taxonomyUri');
        
        // Set taxonomy info
        const taxonomyLabel = sampleDropdown.options[sampleDropdown.selectedIndex].getAttribute('data-taxonomyLabel');
        if (taxonomyLabel) {
            document.getElementById("taxonomy_info").textContent = `-> ${taxonomyLabel} <-`;
        } else {
            document.getElementById("taxonomy_info").textContent = '';
        }

        await fetchDanteTaxCodes(taxonomyUri);
        populateTaxCodeDropdown(taxonomyUri, taxCodeDropdown);
    });
});

// Populate fraction fields -------------------------------------------------------
const fractionAnalyzedField = document.getElementById("result_fractionAnalyzed");
const orgRadio = document.getElementById("result_org");
const minRadio = document.getElementById("result_min");
const sieveSizeField = document.getElementById("result_sieveSize");
const multiplierInput = document.getElementById("result_multiplier");

fractionDropdown.addEventListener("change", () => {
    const selectedOption = fractionDropdown.options[fractionDropdown.selectedIndex];

    // fraction analyzed
    fractionAnalyzedField.value = selectedOption.getAttribute('data-fractionAnalyzed');

    // org or min
    const orgOrMin = selectedOption.getAttribute('data-orgOrMin');
    if (orgOrMin == "org") {
        orgRadio.checked = true;
    } else if (orgOrMin == "min") {
        minRadio.checked = true;
    } else {
        orgRadio.checked = false;
        minRadio.checked = false;
    }

    // sieve size
    sieveSizeField.value = selectedOption.getAttribute('data-sieveSize');

    // multiplier
    multiplierInput.value = selectedOption.getAttribute('data-standardMultiplier');   
});


const entryDateInput = document.getElementById("entryDate");
const stateOfPreservationDropdown = document.getElementById("state_of_preservation");
const classificationConferDropdown = document.getElementById("cf");
const remarksTaxonomyTextarea = document.getElementById("remarks_taxonomy");
const restTypeDropdown = document.getElementById("restType");
const restCountInput = document.getElementById("r_count");
const restFragmentInput = document.getElementById("r_fragment");
const restWeightInput = document.getElementById("r_weight");
const estimationCheckbox = document.getElementById("estimation");

function submitResult() {
    const resultForm = document.getElementById('resultForm');
    const resultFormTaxonomy = document.getElementById('resultFormTaxonomy');

    if (resultForm.checkValidity()) {
        const selectedFractionOption = fractionDropdown.options[fractionDropdown.selectedIndex]

        // Create result payload
        const payload = {
            // References ----------------------------------------
            sample: { id: sampleDropdown.value },
            absoluteDatingList: Array.from(absDatingSelectpicker.selectedOptions).map(option => ({ id: option.value })),
            
            // Fraction ------------------------------------------
            fractionAnalyzed: selectedFractionOption.getAttribute('data-fractionAnalyzed'),
            orgOrMin: selectedFractionOption.getAttribute('data-orgOrMin'),
            sieveSize: selectedFractionOption.getAttribute('data-sieveSize'),
            multiplier:  selectedFractionOption.getAttribute('data-standardMultiplier'), // multiplierInput.value,
            
            // General -------------------------------------------
            entryDate: entryDateInput.value,
            stateOfPreservation: {
                id: stateOfPreservationDropdown.value,
                label: stateOfPreservationDropdown.selectedOptions[0].text
            },

            // Taxonomy ------------------------------------------
            classificationConfer: {
                id: classificationConferDropdown.value,
                label: classificationConferDropdown.selectedOptions[0].text
            },
            taxCode: { 
                id: taxCodeDropdown.value,
                label: taxCodeDropdown.selectedOptions[0].text,
                taxonomy: sampleDropdown.options[sampleDropdown.selectedIndex].getAttribute('data-taxonomyLabel')
            },
            remarksTaxonomy: remarksTaxonomyTextarea.value,

            // Result --------------------------------------------
            restType: {
                id: restTypeDropdown.value,
                label: restTypeDropdown.selectedOptions[0].text,
                structuralConcept: restTypeDropdown.selectedOptions[0].getAttribute('data-structuralConcept')
            },
            restCount: restCountInput.value,
            restFragment: restFragmentInput.value,
            restWeight: restWeightInput.value,
            estimation: estimationCheckbox.checked,
            // ---------------------------------------------------
        };
        
        axios.post('http://localhost:8080/results', payload)
        .then(response => {
            if (response.data === "result is created") {
                alert("result created");
                
                // Reset all input fields within the inner form (selects, textareas, checkboxes)
                const inputs = resultFormTaxonomy.querySelectorAll('input, select, textarea');
                
                inputs.forEach(input => {
                    if (input.tagName.toLowerCase() === 'input') {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            input.checked = false; // Reset checkboxes and radio buttons
                        } else if (input.type === 'number' || input.type === 'text' || input.type === 'password') {
                            input.value = ''; // Reset text and number input fields
                        }
                    } else if (input.tagName.toLowerCase() === 'select') {
                        input.selectedIndex = 0; // Reset select dropdowns to the first option (i.e., the default)
                    } else if (input.tagName.toLowerCase() === 'textarea') {
                        input.value = ''; // Reset textareas
                    }
                });
    
    // You can also reset the select2 dropdowns if you're using the jQuery Select2 plugin
    $('#taxCode').val(null).trigger('change');  // Clear the Select2 field for taxCode
    $('#restType').val(null).trigger('change');  // Clear the Select2 field for restType
            }
            if (response.data === "result already exists") {
                alert("result already exists");
                resultFormTaxonomy.reset();
            }
            document.getElementById("state_of_preservation").focus();
        })
        .catch(error => {
            console.error('Error during POST request to create result:', error);
            alert("action failed");
        });

    } else {
        // Set focus on invalid field
        sampleDropdown.focus();

        // wait until focus is set
        setTimeout(() => {
            resultForm.reportValidity();
        }, 500);
    }
}


// Populate Dante dropdowns
document.addEventListener("DOMContentLoaded", async () => {

    await fetchDanteAttribute("stateOfPreservation");
    populateDanteDropdown("stateOfPreservation", stateOfPreservationDropdown);

    await fetchDanteAttribute("classificationConfer");
    populateDanteDropdown("classificationConfer", classificationConferDropdown);

    await fetchDanteAttribute("restType");
    populateDanteDropdown("restType", restTypeDropdown);
});
