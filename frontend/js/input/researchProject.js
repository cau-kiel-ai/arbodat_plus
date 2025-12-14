// Populate Dante dropdowns
const licenseDropdown = document.getElementById("rp_license");

document.addEventListener("DOMContentLoaded", async () => {
    await fetchDanteAttribute("license");
    populateDanteDropdown("license", licenseDropdown);
});

const dropdown = document.getElementById("projectDropdown");
const form = document.getElementById('rp');
const clearIcon = document.getElementById("clearIcon");
const id = document.getElementById("projectId");
const inputField = document.getElementById("projectName");
const funderInput = document.getElementById("funder");
const authorisationNumberInput = document.getElementById("authorisationNumber");
const licenseInput = document.getElementById("rp_license");
const exportFileNameInput = document.getElementById("exportFileName");
const custom_button = document.getElementById("custom_rp_button");
let rp_found = false;

document.addEventListener("DOMContentLoaded", () => {

    let activeIndex = -1;
    let suppressDropdown = false;
    let cachedItems = [];

    // Open dropdown
    inputField.addEventListener("focus", () => {

        if (suppressDropdown) {
            suppressDropdown = false;
            return;
        }

        adjustDropdownWidth();

        // Send a GET request to get all items
        fetch('http://localhost:8080/research_projects', { // Customise here
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

        dropdown.classList.remove("hidden");
      });
    
    function adjustDropdownWidth() {
        const inputWidth = inputField.offsetWidth;
        dropdown.style.width = `${inputWidth}px`;
    }

    // Autofill
    inputField.addEventListener("input", () => {

        // Update Dropdown ----------------------------------------------
        const query = inputField.value.toLowerCase();
        const filteredItem = cachedItems.filter(item =>
            item.projectName.toLowerCase().includes(query) // Customise here
        );
        activeIndex = -1; // Reset the active index
        populateDropdown(filteredItem);
        // --------------------------------------------------------------
        
        // Check whether the entered 'item name' already exists in the dropdown
        const matchedItem = cachedItems.find(item => 
            item.projectName.toLowerCase() === query // Customise here
        );

        if (matchedItem) {
            selectItem(matchedItem);
        }
        else { // Reset Form 
          id.value = "";    
          rp_found = false;        
          // Customise here -------------------------
          funderInput.value = "";
          authorisationNumberInput.value = "";
          licenseInput.value = "";
          exportFileNameInput.value = "";
          custom_rp_button.innerHTML = "create";
          // ----------------------------------------
        }
    });

    function populateDropdown(itemList) {  
        dropdown.innerHTML = ""; // Reset dropdown
        
        itemList.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = item.projectName; // Customise here
            listItem.addEventListener("click", () => {
                selectItem(item);
            });
            dropdown.appendChild(listItem);
        });

        // Hide dropdown if no item name match
        dropdown.classList.toggle("hidden", itemList.length === 0);
    }

    function selectItem(item) {
        id.value = item.id
        rp_found = true;
        // Customise here -------------------------------------------
        inputField.value = item.projectName;
        funderInput.value = item.funder;
        authorisationNumberInput.value = item.authorisationNumber;
        licenseInput.value = item.license?.id ?? '';
        exportFileNameInput.value = item.exportFileName;
        // ----------------------------------------------------------
        custom_button.innerHTML = "update";
    }

    // Reset Form
    clearIcon.addEventListener("click", () => {
        id.value = "";
        inputField.value = "";              
        // Customise here -------------------------------------------
        funderInput.value = "";
        authorisationNumberInput.value = "";
        licenseInput.value = "";
        exportFileNameInput.value = "";
        // ----------------------------------------------------------
        inputField.focus();
        custom_button.innerHTML = "create";
    });

    // Close Dropdown when selecting an item (via mouse click)
    dropdown.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
            suppressDropdown = true;
            dropdown.classList.add("hidden"); // Close dropdown
            inputField.focus();               // Keep focus on input field
        }
    });

// Dropdown button navigation --------------------------
    inputField.addEventListener("keydown", (e) => {

        // Select all <li> elements (list entries) within the dropdown
        const items = dropdown.querySelectorAll("li");

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
            dropdown.classList.add("hidden"); // Close dropdown

        // Escape -> Close dropdown
        } else if (e.key === "Escape") {
            dropdown.classList.add("hidden"); // Close dropdown
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
        if (!dropdown.contains(e.target) && e.target !== inputField && !clearIcon.contains(e.target)) {
            dropdown.classList.add("hidden");
        }
    });

    // Detect mousedown on dropdown and clearIcon to prevent immediate blur handling
    let isClickingDropdown = false;
    dropdown.addEventListener("mousedown", () => {
      isClickingDropdown = true;
    });
    let isClickingClearIcon = false;
    clearIcon.addEventListener("mousedown", () => {
      isClickingClearIcon = true;
    });
    
    // Close dropdown when focus is lost (e.g., using Tab key)
    inputField.addEventListener("blur", () => {
        setTimeout(() => {
            if (!isClickingDropdown && !isClickingClearIcon) {
                dropdown.classList.add("hidden");
            }
            // Reset after handling
            isClickingDropdown = false;
            isClickingClearIcon = false;
        }, 0);
    });          
});      

function create_update_researchProject() {
    if (form.checkValidity()) {

        // extract all form data
        const licenseDropdown = document.getElementById(`rp_license`);
        const licenseId = licenseDropdown ? licenseDropdown.value : null;
        const licenseLabel = licenseDropdown ? licenseDropdown.options[licenseDropdown.selectedIndex].getAttribute("data-label") : null;
    
        // select and transform form input into JS-Object
        var payload = {
            id: id.value.trim(),
            projectName: inputField.value.trim(),
            funder: funderInput.value.trim(),
            authorisationNumber: authorisationNumberInput.value.trim(),
            license: licenseId ? { id: licenseId, label: licenseLabel } : null,
            exportFileName: exportFileNameInput.value.trim()
        };
        
        if (rp_found == true) {
            // if project already exists: update project
            axios
            .put(`http://localhost:8080/research_projects/${id.value.trim()}`, JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                alert("research project updated");
            })
            .catch((error) => {
                console.error('Error during PUT request to update research project:', error);
                alert("action failed");
            });
        } else {
            // otherwise add project
            axios
            .post('http://localhost:8080/research_projects', JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                alert("research project created");
            })
            .catch((error) => {
                console.error('Error during POST request to create research project:', error);
                alert("action failed");
            });
        };

        // Reset form and button
        form.reset();
        custom_button.innerHTML = "create";

    } else {
        form.reportValidity();
    }
}
