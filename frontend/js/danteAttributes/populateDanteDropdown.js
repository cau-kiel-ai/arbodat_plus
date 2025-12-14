
function populateDanteDropdown (attribute, dropdown) {

    // Get cachedData
    let cachedData = [];
    switch (attribute) {

        // researchProject --------------------------
        case ("license"):
            cachedData = cachedLicenses;
            break;

        // site -------------------------------------  
        case "taxonomy":
            cachedData = cachedTaxonomies;
            break;  

        case ("siteType"):
            cachedData = cachedSiteTypes;
            break;

        case "naturalUnit":
            cachedData = cachedNaturalUnits;
            break;

        // coordinate -------------------------------
        case "coordinateSystem":
            cachedData = cachedCoordinateSystems;
            break;

        // feature --------------------------------------
        case ("featureType"):
            cachedData = cachedFeatureTypes;
            break;

        case ("preservationCondition"):
            cachedData = cachedPreservationConditions;
            break;

        // sample ---------------------------------------
        case ("sampleType"):
            cachedData = cachedSampleTypes;
            break;

        case ("chronozone"):
            cachedData = cachedChronozones;
            break;

        // sampleInvestigated
        case ("seedsAndFruits"):
        case ("charcoalInvestigated"):
        case ("woodSubfossile"):
            cachedData = cachedSampleInvestigated;
            break;

        // absoluteDating -------------------------------
        case ("material"):
            cachedData = cachedMaterials;
            break;

        case ("datingMethod"):
            cachedData = cachedDatingMethods;
            break;

        // C14Dating ------------------------------------
        case "c14Laboratory":
            cachedData = cachedC14Laboratories;
            break;

        // result ---------------------------------------
        case ("stateOfPreservation"):            
            cachedData = cachedStateOfPreservation;
            break;

        case ("restType"):
            cachedData = cachedRestTypes;
            break;

        case ("classificationConfer"):
            cachedData = cachedClassificationConfers;
            break;          
        // ----------------------------------------------
                    
        default:
            console.error("Unknown attribute");
            return;
    }

    for (const item of cachedData) {

        if (attribute == "naturalUnit") {
            // Check if such an entry already exists
            const exists = Array.from(dropdown.options).some(opt => opt.value === item.uri);

            if (!exists) {
                let insertAfterIndex = -1;
                if (item.ancestors) {
                    item.ancestors.reverse().forEach((ancestor, index) => {
                        // Check if such an entry already exists and if so determine index
                        const optionsArray = Array.from(dropdown.options);
                        const optionIndex = optionsArray.findIndex(opt => opt.value === ancestor.uri)
    
                        if (optionIndex === -1) {
                            // Create 'option' and set URI as value
                            const option = document.createElement('option');
                            option.value = ancestor.uri;
    
                            const spaces = "\u00A0".repeat((index) * 3);
                            const label = ancestor.prefLabel?.de ?? ancestor.prefLabel?.en ?? "";
                            option.textContent = spaces + label;
                            option.setAttribute("data-label", label);
    
                            if (insertAfterIndex === -1) {
                                dropdown.appendChild(option);
                            } else {
                                dropdown.insertBefore(option, dropdown.options[insertAfterIndex + 1] || null);
                                insertAfterIndex++;
                            }                        
                        } else {
                            insertAfterIndex = optionIndex;
                        }
                    });
                }
                
                // ArboDat+_naturalUnit
                if (item.uri === "ArboDat+_naturalUnit_unknown" || item.uri === "ArboDat+_naturalUnit_notChosen") {

                    // Create "ArboDat+_naturalUnit" option
                    let option = document.createElement('option');
                    option.textContent = "ArboDat+_naturalUnit";
                    option.disabled = true;
                    option.style.fontWeight = "bold";
                    option.style.color = "gray";
                    dropdown.appendChild(option);

                    // Create "ArboDat+_naturalUnit_unknown" option
                    option = document.createElement('option');
                    option.value = "ArboDat+_naturalUnit_unknown";
                    option.textContent = "\u00A0\u00A0" + "unknown";
                    dropdown.appendChild(option);
                    
                    // Create "ArboDat+_naturalUnit_notChosen" option
                    option = document.createElement('option');
                    option.value = "ArboDat+_naturalUnit_notChosen";
                    option.textContent = "\u00A0\u00A0" + "not chosen";
                    dropdown.appendChild(option);

                } else {
                    // Create 'option' and set URI as value
                    const option = document.createElement('option');
                    option.value = item.uri;

                    const spaces = "\u00A0".repeat((item.ancestors.length) * 3);
                    const label = item.prefLabel.zxx;
                    option.textContent = spaces + label;
                    option.setAttribute("data-label", label);

                    if (insertAfterIndex === -1) {
                        dropdown.appendChild(option);
                    } else {
                        dropdown.insertBefore(option, dropdown.options[insertAfterIndex + 1] || null);
                    }
                }                
            }
            continue;         
        }

        // Create 'option' and set URI as value
        const option = document.createElement('option');                       
        option.value = item.uri;

        // Set label attribute and textContent ----------------------------------------------
        if (attribute == "coordinateSystem") {
            const label = [item.prefLabel.en, item.notation].filter(Boolean).join(" - ");
            option.textContent = label;
            option.setAttribute("data-crsNotation", item.notation);
        }
        else if (attribute == "c14Laboratory") {
            const label = [item.notation, item.prefLabel?.zxx].filter(Boolean).join(", ");
            option.textContent = label;
            option.setAttribute("data-label", label);

            dropdown.appendChild(option);
            continue; // Jumps to next iteration without executing the rest of the code
                      // (disable guide terms and 'populateNarrower')
        }
        else if (attribute == "taxonomy") {
            option.textContent = item.prefLabel.en;
            option.setAttribute("data-label", item.prefLabel.en);

            dropdown.appendChild(option);
            continue; // Jumps to next iteration without executing the rest of the code
        }
        else {
            option.textContent = item.prefLabel.en;
            option.setAttribute("data-label", item.prefLabel.en);
        } // --------------------------------------------------------------------------------

        // If guideTerm -> disable and grey out
        if (item.type.includes("http://vocab.getty.edu/ontology#GuideTerm")) {                
            option.disabled = true;
            option.style.fontWeight = "bold";
            option.style.color = "gray";
        }

        dropdown.appendChild(option);

        populateNarrower(dropdown, item.narrower, attribute, item.prefLabel.en);
    }
}

function populateNarrower(dropdown, narrower, attribute, structuralConcept) {
    
    // Termination condition
    if (!narrower || narrower.length === 0) {
        return;
    }
    
    for (let i = 0; i < narrower.length; i++) {
        const option = document.createElement('option');                    
        option.value = narrower[i].uri;

        option.textContent = "\u00A0\u00A0" + narrower[i].prefLabel.en;
        option.setAttribute("data-label", narrower[i].prefLabel.en);
        option.setAttribute("data-structuralConcept", structuralConcept);

        // If guideTerm -> disable and grey out 
        if (narrower[i].type.includes("http://vocab.getty.edu/ontology#GuideTerm")) {                
            option.disabled = true;
            option.style.fontWeight = "bold";
            option.style.color = "gray";
        }

        dropdown.appendChild(option);

        // ToDo: Comment in if more than one hierarchy (recursion)
        //       (+ adjust paddingLeft for hierarchy level: perhaps as a parameter of the function
        //                                                  and for each level add two space "\u00A0\u00A0")
        // populateNarrower(dropdown, narrower[i].narrower);
    }
}

function populateTaxCodeDropdown(uri, dropdown) {
    
    // Reset Dropdown
    dropdown.options.length = 1;

    // Get tax codes for corresponding uri
    const taxCodes = cachedTaxCodesForURI.get(uri) || [];

    for (let i = 0; i < taxCodes.length; i++) {
        const item = taxCodes[i];
        
        // Create 'option' and set URI as value
        const option = document.createElement('option');                       
        option.value = item.uri;

        // Set label attribute and textContent
        const label = [item.notation, item.prefLabel?.la].filter(Boolean).join(", ");
        option.textContent = label;
        option.setAttribute("data-label", item.notation);

        dropdown.appendChild(option);
    }
}

function createTaxCodeOptionsFragment(taxCodes) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < taxCodes.length; i++) {
        const item = taxCodes[i];
        
        // Create 'option' and set URI as value
        const option = document.createElement('option');                       
        option.value = item.uri;

        // Set label attribute and textContent
        const label = [item.notation, item.prefLabel?.la].filter(Boolean).join(", ");
        option.textContent = label;
        option.setAttribute("data-label", item.notation);

        fragment.appendChild(option);
    }

    return fragment;
}

function populateTaxCodeDropdownShared(dropdown, sharedTaxCodeOptionsFragment) {
    // Reset Dropdown
    dropdown.options.length = 1;

    const clone = sharedTaxCodeOptionsFragment.cloneNode(true);
    dropdown.appendChild(clone);
}