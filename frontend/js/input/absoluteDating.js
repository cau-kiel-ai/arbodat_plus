
// Populate sample dropdown  ------------------------------------------------------------
const absDating_sample_dropdown = document.getElementById("absDating_sample_dropdown");

absDating_sample_dropdown.addEventListener('focus', () => {

    // Reset dropdown
    while (absDating_sample_dropdown.options.length > 1) {
        absDating_sample_dropdown.remove(1);
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

            absDating_sample_dropdown.appendChild(option)
        });
    })
    .catch(error => {
        console.error('Error during sample GET request: ', error);
    });
});

// Reference literature -----------------------------------------------------------------
const literature_id = document.getElementById("absDating_literature_id");
const literature_Input = document.getElementById("absDating_literature_Input");
const literature_clearIcon = document.getElementById("absDating_literature_clearIcon");
const literature_Dropdown = document.getElementById("absDating_literature_Dropdown");

let cachedItems = [];

let activeIndex = -1;
let suppressDropdown = false;

literature_Input.addEventListener("focus", () => {

    if (suppressDropdown) {
        suppressDropdown = false;
        return;
    }

    adjustDropdownWidth();

    // Send a GET request to literature
    fetch('http://localhost:8080/literature', {
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
        activeIndex = -1; // Reset the active index
        populateDropdown(cachedItems);
    })
    .catch(error => {
        console.error('Error during literature fetch:', error);
    });
});

function adjustDropdownWidth() {
    const inputWidth = literature_Input.offsetWidth;
    literature_Dropdown.style.width = `${inputWidth}px`;
}

// Autofill
literature_Input.addEventListener("input", () => {

    // Update Dropdown ----------------------------------------------
    const query = literature_Input.value.toLowerCase();
    const filteredItem = cachedItems.filter(item =>
        item.title.toLowerCase().includes(query) // Customise here
    );
    activeIndex = -1; // Reset the active index
    populateDropdown(filteredItem);
    // --------------------------------------------------------------
    
    // Check whether the entered 'item name' already exists in the dropdown
    const matchedItem = cachedItems.find(item => 
        item.title.toLowerCase() === query // Customise here
    );

    if (matchedItem) {
        selectItem(matchedItem);
    }
    else { // Reset Form 
        id.value = "";
    }
});

function populateDropdown(itemList) {  
    literature_Dropdown.innerHTML = ""; // Reset dropdown
    
    itemList.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = item.title; // Customise here
        listItem.addEventListener("click", () => {
            selectItem(item);
        });
        literature_Dropdown.appendChild(listItem);
    });

    // Hide dropdown if no item match
    literature_Dropdown.classList.toggle("hidden", itemList.length === 0);
}

function selectItem(item) {
    literature_id.value = item.id;
    literature_Input.value = item.title;
}

// Reset Form
literature_clearIcon.addEventListener("click", () => {
    literature_id.value = "";
    literature_Input.value = "";              
    literature_Input.focus();
});

// Close Dropdown when selecting an item (via mouse click)
literature_Dropdown.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        suppressDropdown = true;
        literature_Dropdown.classList.add("hidden"); // Close dropdown
        literature_Dropdown.focus();                 // Keep focus on input field
    }
});

// Dropdown button navigation --------------------------
literature_Input.addEventListener("keydown", (e) => {

    // Select all <li> elements (list entries) within the dropdown
    const items = literature_Dropdown.querySelectorAll("li");

    // ArrowDown -> Navigate downwards
    if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length; // Navigate downwards
        updateActiveItem(items);

    // ArrowUp -> Navigate upwards
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length; // Navigate upwards
        updateActiveItem(items);

    // Enter -> Select current element + Close dropdown
    } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        items[activeIndex].click();                  // Select current element
        literature_Dropdown.classList.add("hidden"); // Close dropdown

    // Escape -> Close dropdown
    } else if (e.key === "Escape") {
        literature_Dropdown.classList.add("hidden"); // Close dropdown
    }
});

function updateActiveItem(items) {
    items.forEach((item, index) => {
        item.classList.toggle("active", index === activeIndex);
    });
}

// Dropdown focus management ---------------------------    
// Close dropdown when clicked outside
document.addEventListener("click", (e) => {
    if (!literature_Dropdown.contains(e.target) && e.target !== literature_Input && !literature_clearIcon.contains(e.target)) {
        literature_Dropdown.classList.add("hidden");
    }
});

// Detect mousedown on dropdown and clearIcon to prevent immediate blur handling
let isClickingDropdown = false;
literature_Dropdown.addEventListener("mousedown", () => {
isClickingDropdown = true;
});
let isClickingClearIcon = false;
literature_clearIcon.addEventListener("mousedown", () => {
isClickingClearIcon = true;
});

// Close dropdown when focus is lost (e.g., using Tab key)
literature_Input.addEventListener("blur", () => {
    setTimeout(() => {
        if (!isClickingDropdown && !isClickingClearIcon) {
            literature_Dropdown.classList.add("hidden");
        }
        // Reset after handling
        isClickingDropdown = false;
        isClickingClearIcon = false;
    }, 0);
});


// 'Add literature' to literatur container ----------------------------------------------
window.absDating_literatureList = [];

function absDating_addLiterature() {
    
    // Get literature id of selected item
    const literatureId = literature_id.value; 

    // Check if a existing literature from the database is selcted
    if (literatureId) {

        // Check if the literature is already in literature container
        const existingLiterature = absDating_literatureList.find(item => item.id === literatureId);
        if (existingLiterature) {
            // Reset literature dropdown
            literature_id.value = "";
            literature_Input.value = "";            
            alert("This Literature has already been added.");
            return;
        }
        else {
            // Get name (title) of selected item
            const literatureTitle = literature_Input.value;

            // Create JSON object to store the data
            const literatureData = { id: literatureId };
            
            // Save object into the literature array
            const index = absDating_literatureList.push(literatureData) - 1;

            // Display the saved literature in a box under the form
            const saved_literatureBox = document.createElement("div");
            saved_literatureBox.style.border = "1px solid #ccc";
            saved_literatureBox.style.padding = "10px";
            saved_literatureBox.style.marginTop = "8px";
            saved_literatureBox.style.marginBottom = "10px";
            saved_literatureBox.style.width = "95%";
            saved_literatureBox.style.backgroundColor = "#f9f9f9";

            function updateBoxLayout() {
                if (window.innerWidth <= 720) {
                    saved_literatureBox.style.marginLeft = "0";
                } else {
                    saved_literatureBox.style.marginLeft = "32%";
                }
            }

            updateBoxLayout();

            window.addEventListener("resize", updateBoxLayout);

            // And title and delete button
            saved_literatureBox.innerHTML = `
                <span style="
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 95%;
                ">${literatureTitle}</span>
                <span style="color: red; float: right; cursor: pointer;" 
                      onclick="deleteLiterature(this, ${index})">
                      &#10005;
                </span>
            `;
            
            // Append the saved lit box to the container
            document.getElementById("absDating_literature_container").appendChild(saved_literatureBox);

            // Reset literature dropdown
            suppressDropdown = false;
            literature_id.value = "";
            literature_Input.value = "";
        }
    }
    else {
        alert("Select a existing literature from the database or create a new one.");
        return;
    }
}

function deleteLiterature(deleteIcon, index) {
    // Find the parent div (the literature box) and remove it
    const literatureBox = deleteIcon.parentElement;
    literatureBox.remove();

    // Remove literature from the absDating_literatureList with index
    if (index !== -1) {
        absDating_literatureList.splice(index, 1);
    }
};

// Manage dating accordions -------------------------------------------------------------
const materialDropdown = document.getElementById("material");
const datingMethodDropdown = document.getElementById("dating_method");

// DendroDating accordion
const dendroDating_AccordionItem = document.getElementById("dendroDating_AccordionItem");
const dendroDating_AccordionButton = dendroDating_AccordionItem.querySelector(".accordion-button");
const dendroDating_AccordionCollapseElem = document.getElementById("dendroDating_AccordionCollapseElem");

// C14Dating accordion
const c14Dating_AccordionItem = document.getElementById("c14Dating_AccordionItem");
const c14Dating_AccordionButton = c14Dating_AccordionItem.querySelector(".accordion-button");
const c14Dating_AccordionCollapseElem = document.getElementById("c14Dating_AccordionCollapseElem");

// OtherDating accordion
const otherDating_AccordionItem = document.getElementById("otherDating_AccordionItem");
const otherDating_AccordionButton = otherDating_AccordionItem.querySelector(".accordion-button");
const otherDating_AccordionCollapseElem = document.getElementById("otherDating_AccordionCollapseElem");

datingMethodDropdown.addEventListener("change", function () {

    const selectedValue = this.selectedOptions[0].text;

    if (selectedValue === "Dendrochronology") {
        // Populate laborytories
        const dendro_lab_list = document.getElementById('dendro_lab_list');
        axios.get('http://localhost:8080/laboratories')
        .then(response => {
            response.data.forEach(item => {
                // Create option
                const option = document.createElement('option');
                option.value = item.label;
                option.setAttribute("data-id", item.id);

                dendro_lab_list.appendChild(option)
            });                
        })
        .catch(error => {
            console.error('Error during laboratory GET request: ', error);
        });

        // Activate accordion
        dendroDating_AccordionItem.style.pointerEvents = "auto";
        dendroDating_AccordionItem.style.opacity = "1";

        // Open accordion
        dendroDating_AccordionButton.classList.remove("collapsed");
        dendroDating_AccordionButton.setAttribute("aria-expanded", "true");
        dendroDating_AccordionCollapseElem.classList.add("show");

        // Deactivate remaining accordions
        c14Dating_AccordionItem.style.pointerEvents = "none";
        c14Dating_AccordionItem.style.opacity = "0.5";

        otherDating_AccordionItem.style.pointerEvents = "none";
        otherDating_AccordionItem.style.opacity = "0.5";

        // Close remaining accordions
        c14Dating_AccordionButton.classList.add("collapsed");
        c14Dating_AccordionButton.setAttribute("aria-expanded", "false");
        c14Dating_AccordionCollapseElem.classList.remove("show");

        otherDating_AccordionButton.classList.add("collapsed");
        otherDating_AccordionButton.setAttribute("aria-expanded", "false");
        otherDating_AccordionCollapseElem.classList.remove("show");

    } else if (selectedValue === "Radiocarbon Dating") {
        // Activate accordion
        c14Dating_AccordionItem.style.pointerEvents = "auto";
        c14Dating_AccordionItem.style.opacity = "1";

        // Open accordion
        c14Dating_AccordionButton.classList.remove("collapsed");
        c14Dating_AccordionButton.setAttribute("aria-expanded", "true");
        c14Dating_AccordionCollapseElem.classList.add("show");

        // Deactivate remaining accordions
        dendroDating_AccordionItem.style.pointerEvents = "none";
        dendroDating_AccordionItem.style.opacity = "0.5";

        otherDating_AccordionItem.style.pointerEvents = "none";
        otherDating_AccordionItem.style.opacity = "0.5";

        // Close remaining accordions
        dendroDating_AccordionButton.classList.add("collapsed");
        dendroDating_AccordionButton.setAttribute("aria-expanded", "false");
        dendroDating_AccordionCollapseElem.classList.remove("show");

        otherDating_AccordionButton.classList.add("collapsed");
        otherDating_AccordionButton.setAttribute("aria-expanded", "false");
        otherDating_AccordionCollapseElem.classList.remove("show");

    } else if (selectedValue === "select dating method") {
        // Deactivate all accordions
        dendroDating_AccordionItem.style.pointerEvents = "none";
        dendroDating_AccordionItem.style.opacity = "0.5";

        c14Dating_AccordionItem.style.pointerEvents = "none";
        c14Dating_AccordionItem.style.opacity = "0.5";

        otherDating_AccordionItem.style.pointerEvents = "none";
        otherDating_AccordionItem.style.opacity = "0.5";

        // Close all accordions
        dendroDating_AccordionButton.classList.add("collapsed");
        dendroDating_AccordionButton.setAttribute("aria-expanded", "false");
        dendroDating_AccordionCollapseElem.classList.remove("show");

        c14Dating_AccordionButton.classList.add("collapsed");
        c14Dating_AccordionButton.setAttribute("aria-expanded", "false");
        c14Dating_AccordionCollapseElem.classList.remove("show");

        otherDating_AccordionButton.classList.add("collapsed");
        otherDating_AccordionButton.setAttribute("aria-expanded", "false");
        otherDating_AccordionCollapseElem.classList.remove("show");
    
    } else { // Other Dating
        // Populate laborytories
        const other_lab_list = document.getElementById('other_lab_list');
        axios.get('http://localhost:8080/laboratories')
        .then(response => {
            response.data.forEach(item => {
                // Create option
                const option = document.createElement('option');
                option.value = item.label;
                option.setAttribute("data-id", item.id);

                other_lab_list.appendChild(option)
            });                
        })
        .catch(error => {
            console.error('Error during laboratory GET request: ', error);
        });

        // Activate accordion
        otherDating_AccordionItem.style.pointerEvents = "auto";
        otherDating_AccordionItem.style.opacity = "1";

        // Open accordion
        otherDating_AccordionButton.classList.remove("collapsed");
        otherDating_AccordionButton.setAttribute("aria-expanded", "true");
        otherDating_AccordionCollapseElem.classList.add("show");

        // Deactivate remaining accordions
        dendroDating_AccordionItem.style.pointerEvents = "none";
        dendroDating_AccordionItem.style.opacity = "0.5";

        c14Dating_AccordionItem.style.pointerEvents = "none";
        c14Dating_AccordionItem.style.opacity = "0.5";

        // Close remaining accordions
        dendroDating_AccordionButton.classList.add("collapsed");
        dendroDating_AccordionButton.setAttribute("aria-expanded", "false");
        dendroDating_AccordionCollapseElem.classList.remove("show");

        c14Dating_AccordionButton.classList.add("collapsed");
        c14Dating_AccordionButton.setAttribute("aria-expanded", "false");
        c14Dating_AccordionCollapseElem.classList.remove("show");
    }
});


const c14LabDropdown = document.getElementById("c14_lab");

// Populate Dante dropdowns -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {

    await fetchDanteAttribute("material");
    populateDanteDropdown("material", materialDropdown);

    await fetchDanteAttribute("datingMethod");
    populateDanteDropdown("datingMethod", datingMethodDropdown);

    await fetchDanteAttribute("c14Laboratory");
    populateDanteDropdown("c14Laboratory", c14LabDropdown);
});


// Submit/Update absolute dating --------------------------------------------------------
const absDatingsampleDropdown = document.getElementById("absDating_sample_dropdown");
const subSampleInput = document.getElementById("subsample");
const remarksTextarea = document.getElementById("absDating_remarks");
// Dendro dating
const dendroLabInput = document.getElementById("dendro_lab");
const dendroNumberInput = document.getElementById("dendro_number");
const dendroAgeInput = document.getElementById("dendro_age");
const waneyEdgeCheckbox = document.getElementById("waney_edge");
// C14 dating
const c14NumberInput = document.getElementById("c14_number");
const c14AgeBPInput = document.getElementById("c14_age_bp");
const c14StdDevInput = document.getElementById("c14_std_dev");
const c14CalTextarea = document.getElementById("c14_calibration_bc_ad_2s");
const deltaC13Input = document.getElementById("delta_C13");
const c13DevInput = document.getElementById("c13_dev");
const pMC = document.getElementById("pMC");
const pMCDev = document.getElementById("pMC_dev");
// Other dating
const otherLabInput = document.getElementById("other_lab");
const otherNumberInput = document.getElementById("other_number");
const otherAgeInput = document.getElementById("other_age");

function submit_update_AbsoulteDating() {
    const absDatingForm = document.getElementById('absDatingForm');

    if (absDatingForm.checkValidity()) {
        const absoluteDatingId = document.getElementById("absDating_id").value;
        const datingMethodLabel = datingMethodDropdown.selectedOptions[0].text

        // Create absolute dating payload
        const payload = {            
            // References ----------------------------------------
            sample: { id: absDatingsampleDropdown.value },
            literatureList: absDating_literatureList,
            
            // Absolute dating -----------------------------------
            subSample: subSampleInput.value,
            remarks: remarksTextarea.value
        };
        // Absolte dating id
        if (absoluteDatingId) {
            payload.id = absoluteDatingId;
        }
            // material
        if (materialDropdown.value) {
            payload.material = {
                id: materialDropdown.value,
                label: materialDropdown.selectedOptions[0].text
            };
        }
            // dating method
        if (datingMethodDropdown.value) {
            payload.datingMethod = {
                id: datingMethodDropdown.value,
                label: datingMethodLabel
            };

            // Dendro dating -------------------------------------
            if (datingMethodLabel === "Dendrochronology") {

                const labLabel = dendroLabInput.value;
                // Get labId
                const dendroLab_datalist = document.getElementById('dendro_lab_list');
                const matchedOption = Array.from(dendroLab_datalist.options).find(opt => opt.value === labLabel);
                const labId = matchedOption ? matchedOption.getAttribute("data-id") : null;

                payload.dendrochronologicalDating = {
                    dendrochronologicalAge: dendroAgeInput.value,
                    waneyEdge: waneyEdgeCheckbox.checked
                };

                if (labLabel) {
                    payload.dendrochronologicalDating.laboratory = {
                        id: labId,
                        label: labLabel
                    };
                    payload.dendrochronologicalDating.number = dendroNumberInput.value
                }                

            // C14 Dating ----------------------------------------
            } else if (datingMethodLabel === "Radiocarbon Dating") {
                payload.c14Dating = {
                    c14Laboratory: {
                        id: c14LabDropdown.value,
                        label: c14LabDropdown.selectedOptions[0].getAttribute("data-label")
                    },
                    number: c14NumberInput.value,

                    c14AgeBp: c14AgeBPInput.value,
                    c14StdDev: c14StdDevInput.value,
                    c14CalibrationBcAd2s: c14CalTextarea.value,
                    deltaC13: deltaC13Input.value,
                    deltaC13Uncertainty: c13DevInput.value,
                    pmc: pMC.value,
                    pmcUncertainty: pMCDev.value
                };

            // Other Dating --------------------------------------
            } else {
                const labLabel = otherLabInput.value;
                // Get labId
                const otherLab_datalist = document.getElementById('other_lab_list');
                const matchedOption = Array.from(otherLab_datalist.options).find(opt => opt.value === labLabel);
                const labId = matchedOption ? matchedOption.getAttribute("data-id") : null;

                payload.otherDating = {
                    ageDivers: otherAgeInput.value
                };

                if (labLabel) {
                    payload.otherDating.laboratory = {
                        id: labId,
                        label: labLabel
                    };
                    payload.otherDating.number = otherNumberInput.value
                } 
            }
        }
        
        if (absoluteDatingId) { // update (PUT)
            axios.put(`http://localhost:8080/absolute_datings/${absoluteDatingId}`, payload)
            .then(response => {
                console.log(response.data);
                alert("dating updated");
            })
            .catch(error => {
                console.error('Error during PUT request to update absolute dating:', error);
                alert("action failed");
            });
        } else { // create (POST)
            axios.post('http://localhost:8080/absolute_datings', payload)
            .then(response => {
                console.log(response.data);
                alert("dating created");
                
                // Reset form
                absDatingForm.reset();
            })
            .catch(error => {
                console.error('Error during POST request to create absolute dating:', error);
                alert("action failed");
            });
        }        

    } else {
        // Set focus on invalid field
        absDatingsampleDropdown.focus();

        // wait until focus is set
        setTimeout(() => {
            absDatingForm.reportValidity();
        }, 450);
    }
}