const institutionDropdown = document.getElementById("institution_Dropdown");
const clearIconInstituiton = document.getElementById("clearIconInstitution");
const institutionForm = document.getElementById('institutionForm');
const institutionId = document.getElementById("institutionId");

const custom_inst_button = document.getElementById("custom_inst_button");

let inst_found = false;

// Attributes
const institutionLabel = document.getElementById("institutionLabel");
const ror_Id = document.getElementById("rorId");

document.addEventListener("DOMContentLoaded", () => {

    let activeIndex = -1;
    let suppressDropdown = false;

    let cachedItems = [];

    institutionLabel.addEventListener("focus", () => {

        if (suppressDropdown) {
            suppressDropdown = false;
            return;
        }

        adjustDropdownWidth();

        fetch('http://localhost:8080/institutions', { // Customise here
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
            console.error('Error:', error);
        });

        institutionDropdown.classList.remove("hidden");
    });

    function adjustDropdownWidth() {
        const inputWidth = institutionLabel.offsetWidth;
        institutionDropdown.style.width = `${inputWidth}px`;
    }

    // Autofill
    institutionLabel.addEventListener("input", () => {

        // Update Dropdown ----------------------------------------------
        const query = institutionLabel.value.toLowerCase();
        const filteredItem = cachedItems.filter(item =>
            item.label.toLowerCase().includes(query) // Customise here
        );
        activeIndex = -1; // Reset the active index
        populateDropdown(filteredItem);
        // --------------------------------------------------------------
        
        // Check whether the entered 'item name' already exists in the dropdown
        const matchedItem = cachedItems.find(item => 
            item.label.toLowerCase() === query // Customise here
        );

        if (matchedItem) {
            selectItem(matchedItem);
        }
        else { // Reset Form 
            institutionId.value = "";
            inst_found=false;  
            // Customise here -------------------------
            ror_Id.value = "";
            custom_inst_button.innerHTML = "create";
            // ----------------------------------------
        }
    });

    function populateDropdown(itemList) {  
        institutionDropdown.innerHTML = ""; // Reset dropdown
        
        itemList.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = formatInstitution(item); // Customise here
            listItem.addEventListener("click", () => {
                selectItem(item);
            });
            institutionDropdown.appendChild(listItem);
        });

        // Hide dropdown if no item name match
        institutionDropdown.classList.toggle("hidden", itemList.length === 0);
    }

    function selectItem(item) {
        inst_found = true;
        institutionId.value = item.id
        // Customise here -------------------------------------------
        institutionLabel.value = item.label;
        ror_Id.value = item.rorId; 
        custom_inst_button.innerHTML = "update";
        // ----------------------------------------------------------        
    }

    // Reset Form
    clearIconInstituiton.addEventListener("click", () => {
        inst_found = false;
        institutionId.value = "";  
        // Customise here -------------------------
        institutionLabel.value = "";
        ror_Id.value = "";    
        // ----------------------------------------
        custom_inst_button.innerHTML = "create";
        institutionLabel.focus();
    });

    // Close Dropdown when selecting an item (via mouse click)
    institutionDropdown.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
            suppressDropdown = true;
            institutionDropdown.classList.add("hidden"); // Close dropdown
            institutionLabel.focus();             // Keep focus on input field
        }
    });          

    // Dropdown button navigation --------------------------
    institutionLabel.addEventListener("keydown", (e) => {

        // Select all <li> elements (list entries) within the dropdown
        const items = institutionDropdown.querySelectorAll("li");

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
            items[activeIndex].click();       // Select current element
            institutionDropdown.classList.add("hidden"); // Close dropdown

        // Escape -> Close dropdown
        } else if (e.key === "Escape") {
            institutionDropdown.classList.add("hidden"); // Close dropdown
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
        if (!institutionDropdown.contains(e.target) && e.target !== institutionLabel && !clearIconInstituiton.contains(e.target)) {
            institutionDropdown.classList.add("hidden");
        }
    });

    // Detect mousedown on dropdown and clearIcon to prevent immediate blur handling
    let isClickingDropdown = false;
    institutionDropdown.addEventListener("mousedown", () => {
    isClickingDropdown = true;
    });
    let isClickingClearIcon = false;
    clearIconInstituiton.addEventListener("mousedown", () => {
    isClickingClearIcon = true;
    });

    // Close dropdown when focus is lost (e.g., using Tab key)
    institutionLabel.addEventListener("blur", () => {
        setTimeout(() => {
            if (!isClickingDropdown && !isClickingClearIcon) {
                institutionDropdown.classList.add("hidden");
            }
            // Reset after handling
            isClickingDropdown = false;
            isClickingClearIcon = false;
        }, 0);
    });          
});      

function create_update_institution() {
    if (institutionForm.checkValidity()) {

        if (inst_found == true) {

            var payload = {
                id: institutionId.value,
                label: institutionLabel.value.trim(),
                rorId: ror_Id.value.trim(),
            };

            axios.put(`http://localhost:8080/institutions/${institutionId.value}`, JSON.stringify(payload), {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
            .then(async response => {
                console.log(response.data);     
                alert("institution updated");
            })
            .catch((error) => {
                console.error('Error during PUT request to update institution:', error);
                alert("action failed");
            });

        } else {

            var payload = {
                label: institutionLabel.value.trim(),
                rorId: ror_Id.value.trim(),
            };

            axios.post('http://localhost:8080/institutions', payload, {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
            .then(async response => {
                console.log(response.data);
                alert("institution created");
            })
            .catch((error) => {
                console.error('Error during POST request to create institution:', error);
                alert("action failed");
            });               
        }

        // Reset form and button
        institutionForm.reset();        
        custom_inst_button.innerHTML = "create";

    } else {
        institutionForm.reportValidity();
    }    
}
