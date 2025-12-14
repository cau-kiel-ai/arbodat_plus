const user_dropdown = document.getElementById("user_Dropdown");
const clearIconUser = document.getElementById("clearIconUser");
const user_form = document.getElementById('user_and_institution');
const id_user = document.getElementById("userId");
const firstName = document.getElementById("first_name");
// Attributes
const middleNames = document.getElementById("middle_names");
const lastName_inputField = document.getElementById("last_name");
const mailAddress = document.getElementById("mail");
const orcid = document.getElementById("orcid");
const institution = document.getElementById("user_institution");
const rorId = document.getElementById("rorId");
const custom_usr_button = document.getElementById("custom_usr_button");

let item_found = false;

document.addEventListener("DOMContentLoaded", () => {

let activeIndex = -1;
let suppressDropdown = false;
let suppressDropdownInst = false;
let cachedItems = [];

// Open dropdowns:

//fetch institutions from local backend and display their labels in dropdown:
institution.addEventListener("focus", () => {
    if (suppressDropdownInst) {
        suppressDropdownInst = false;
        return;
    }

    //  anpassen an inst oder überflüssig? : adjustDropdownWidth();

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
        institution.innerHTML = '';

        const option = document.createElement("option");
        // Attribute setzen
        option.value = "";
        option.hidden = true;
        option.selected = true;
        institution.appendChild(option); 

        // Populate the dropdown with institutions
        data.forEach(item => {
            const option = document.createElement('option');
    
            option.value = item.id;
    
            const institutionName = formatInstitution(item);
            option.textContent = institutionName;
            option.setAttribute("data-label", institutionName);
            
            institution.appendChild(option);
        });
    })
});

// fetch (from local) and display users
lastName_inputField.addEventListener("focus", () => {

    if (suppressDropdown) {
        suppressDropdown = false;
        return;
    }

    adjustDropdownWidth();

    fetch('http://localhost:8080/users', { // Customise here
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

    user_dropdown.classList.remove("hidden");
});

    function adjustDropdownWidth() {
        const inputWidth = lastName_inputField.offsetWidth;
        user_dropdown.style.width = `${inputWidth}px`;
    }

// Autofill
lastName_inputField.addEventListener("input", () => {

    // Update Dropdown ----------------------------------------------
    const query = lastName_inputField.value.toLowerCase();
    const filteredItem = cachedItems.filter(item =>
        item.lastName.toLowerCase().includes(query) // Customise here
    );
    activeIndex = -1; // Reset the active index
    populateDropdown(filteredItem);
    // --------------------------------------------------------------
    
    // Check whether the entered 'item name' already exists in the dropdown
    const matchedItem = cachedItems.find(item => 
        item.lastName.toLowerCase() === query // Customise here
    );

    if (matchedItem) {
        selectItem(matchedItem);
    }
    else { // Reset Form 
      id_user.value = "";
      item_found=false;  
      // Customise here -------------------------
      firstName.value = "";
      middleNames.value = "";
      mailAddress.value = "";
      orcid.value = "";

      window.institutionList.length = 0;
      document.getElementById("institutionContainer").innerHTML = '';

      custom_usr_button.innerHTML = "create";
      // ----------------------------------------
    }
});

function populateDropdown(itemList) {  
    user_dropdown.innerHTML = ""; // Reset dropdown
    
    itemList.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = item.lastName + ", " + item.firstName; // Customise here
        listItem.addEventListener("click", () => {
            selectItem(item);
        });
        user_dropdown.appendChild(listItem);
    });

    // Hide dropdown if no item name match
    user_dropdown.classList.toggle("hidden", itemList.length === 0);
}

function selectItem(item) {
    item_found = true;
    id_user.value = item.id
    // Customise here -------------------------------------------
    firstName.value = item.firstName;
    middleNames.value = item.middleNames;
    lastName_inputField.value = item.lastName;
    mailAddress.value = item.mailAddress;
    //orcid.value = item.orcid;
    custom_usr_button.innerHTML = "update";
    // ----------------------------------------------------------
    window.institutionList.length = 0;
    document.getElementById("institutionContainer").innerHTML = '';

    for (const inst_index in item.institutionList) {
        const inst = item.institutionList[inst_index]

        // Save object into the institution array
        const index = window.institutionList.push(inst) - 1;

        // Display the saved institution in a box under the form        
        const savedInstitutionBox = document.createElement("div");
        savedInstitutionBox.style.border = "1px solid #ccc";
        savedInstitutionBox.style.padding = "10px";
        savedInstitutionBox.style.marginTop = "10px";
        savedInstitutionBox.style.marginLeft = "36.5%";
        savedInstitutionBox.style.width = "95%";
        savedInstitutionBox.style.backgroundColor = "#f9f9f9";
        
        // Add institutionName(label + rorId) and delete button
        const institutionName = formatInstitution(inst);

        const listName = "institutionList";

        savedInstitutionBox.innerHTML = `
          <span style="display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 95%;">
            ${institutionName}
          </span>
          <span style="color: red; float: right; cursor: pointer;" 
                onclick="deleteInstitution(this, ${index}, '${listName}')">
                &#10005;
          </span>
        `;                                                               
        
        // Append the saved institution box to the container
        document.getElementById("institutionContainer").appendChild(savedInstitutionBox);
    }
}

// Reset Form
clearIconUser.addEventListener("click", () => {
    id_user.value = "";
    item_found = false;
    // Customise here -------------------------
    firstName.value = "";
    middleNames.value = "";
    lastName_inputField.value = "";
    mailAddress.value = "";
    orcid.value = "";    

    window.institutionList.length = 0;
    document.getElementById("institutionContainer").innerHTML = '';
      
    custom_usr_button.innerHTML = "create";
    // ----------------------------------------
    lastName_inputField.focus();
});

// Close Dropdown when selecting an item (via mouse click)
user_dropdown.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        suppressDropdown = true;
        user_dropdown.classList.add("hidden"); // Close dropdown
        lastName_inputField.focus();             // Keep focus on input field
    }
});          

// Dropdown button navigation --------------------------
lastName_inputField.addEventListener("keydown", (e) => {

    // Select all <li> elements (list entries) within the dropdown
    const items = user_dropdown.querySelectorAll("li");

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
        user_dropdown.classList.add("hidden"); // Close dropdown

    // Escape -> Close dropdown
    } else if (e.key === "Escape") {
        user_dropdown.classList.add("hidden"); // Close dropdown
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
    if (!user_dropdown.contains(e.target) && e.target !== lastName_inputField && !clearIconUser.contains(e.target)) {
        user_dropdown.classList.add("hidden");
    }
});

// Detect mousedown on dropdown and clearIcon to prevent immediate blur handling
let isClickingDropdown = false;
user_dropdown.addEventListener("mousedown", () => {
  isClickingDropdown = true;
});
let isClickingClearIcon = false;
clearIconUser.addEventListener("mousedown", () => {
  isClickingClearIcon = true;
});

// Close dropdown when focus is lost (e.g., using Tab key)
lastName_inputField.addEventListener("blur", () => {
    setTimeout(() => {
        if (!isClickingDropdown && !isClickingClearIcon) {
            user_dropdown.classList.add("hidden");
        }
        // Reset after handling
        isClickingDropdown = false;
        isClickingClearIcon = false;
    }, 0);
});          
});      

function create_update_user() {
    if (user_form.checkValidity()) {

        // select and transform form input into user object ("label:..."-name must be equivalent to parameter-def in Java)
        var payload = {

            id: item_found ? id_user.value.trim() : null,
            firstName: firstName.value.trim(),
            middleNames: middleNames.value.trim(),
            lastName: lastName_inputField.value.trim(),
            mailAddress: mailAddress.value.trim(),
            orcid: orcid.value.trim(),
        };

        // Create FormData object
        const formData = new FormData();

        // Add institutionList (Ids of existing 'institutions' OR new institution objects without id)
        formData.append("institutionList", new Blob([JSON.stringify(window.institutionList)], { type: "application/json" }));

        if (item_found == true) {
            // update user
            formData.append("transferredUser", new Blob([JSON.stringify(payload)], { type: "application/json" }));
            axios
            .put(`http://localhost:8080/users/${id_user.value.trim()}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log(response.data);
                alert("user updated");
            })
            .catch((error) => {
                console.error('Error during PUT request to update user:', error);
                alert("action failed");
            });
        } else {
            // Add user
            formData.append("user", new Blob([JSON.stringify(payload)], { type: "application/json" }));
            axios
            .post('http://localhost:8080/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                console.log(response.data);
                alert("user created");
            })
            .catch((error) => {
                console.error('Error during POST request to create user:', error);
                alert("action failed");
            });
        };
        // Form reset
        user_form.reset();
        window.institutionList.length = 0;
        document.getElementById("institutionContainer").innerHTML = '';
        document.getElementById("custom_usr_button").innerHTML = "create";

    } else {
        user_form.reportValidity();
    }

    
}
