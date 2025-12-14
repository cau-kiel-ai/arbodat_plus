
async function migrateSites(researchProjectList) {

    // Get .mdb files from the file upload
    const dataFile = document.getElementById('dataFile');
    if (dataFile.files.length === 0) {
        alert("Please select a 'ArchBotDaten.mdb' file.");
        return;
    }
    const strukDataFile = document.getElementById('strukDataFile');
    if (strukDataFile.files.length === 0) {
    alert("Please select a 'ArchBotStrukDat.mdb' file.");
    return;
    }
    
    // Create FormData object
    const formData = new FormData();

    // Add .mdb files
    formData.append("files", dataFile.files[0]);
    formData.append("files", strukDataFile.files[0]);

    // Add research project list
    formData.append("researchProjectList", new Blob([JSON.stringify(researchProjectList)], { type: "application/json" }));

    // Reset researchProject list and box in html container --------------
    researchProjects = window.researchProjects;
    researchProjects.length = 0;
    const container = document.getElementById("researchProjectContainer");
    container.innerHTML = "";
    // -------------------------------------------------------------------

    // Add siteList (only selected sites)
    const selectedSites = Array.from(document.querySelectorAll(".siteCheckbox"))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            // Strike, uncheck and disable checked line
            const row = checkbox.closest("tr");
            row.style.color = "gray";
            checkbox.disabled = true;
            checkbox.checked = false;
            // Add a green tick
            const greenCheck = document.createElement("span");
            greenCheck.innerHTML = "✅";
            greenCheck.style.marginLeft = "20px";
            row.lastElementChild.appendChild(greenCheck);

            return checkbox.value
        });

    formData.append("siteList", new Blob([JSON.stringify(selectedSites)], { type: "application/json" }));

    // Send data to backend via POST
    try {
        const response = await axios.post("http://localhost:8080/migration", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        // Extract lists from the response        
        const existingSiteList = response.data.existingSiteList;
        const existingFeatureList = response.data.existingFeatureList;
        const existingSampleList = response.data.existingSampleList;
        const existingAbsoluteDatingList = response.data.existingAbsoluteDatingList;
        
        createExistingSiteList(existingSiteList);
        createExistingFeatureList(existingFeatureList);
        createExistingSampleList(existingSampleList);
        createExistingAbsoluteDatingList(existingAbsoluteDatingList);

        const literatureList = response.data.literatureList;
        const nonMatchingDanteAttributeList = response.data.nonMatchingDanteAttributeList;
        const coordinateList = response.data.coordinateList;
        const userList = response.data.userList;
        const fractionAnalyzedList = response.data.fractionAnalyzedList;
        const labAndNumberList = response.data.labAndNumberList;
        const resultList = response.data.resultList;
        
        populateNonMatchingDanteAttributes(nonMatchingDanteAttributeList);
        populateLiterature(literatureList);
        populateCoordinates(coordinateList);
        populateUsers(userList);
        populateFractionsAnalyzed(fractionAnalyzedList);
        populateLabsAndNumbers(labAndNumberList);
        populateResults(resultList);

        // show accordion sections 4-10, when something is included in the corresponding lists
        // Literature
        if (literatureList.length > 0) {
            var accordionElement4 = document.getElementById("panelsStayOpen-collapseFour");
            if (!accordionElement4.classList.contains("show")) {
                accordionElement4.classList.add("show");
            }  
        }        
        // NonMatchingDanteAttributes
        if (nonMatchingDanteAttributeList.length > 0) {
            var accordionElement5 = document.getElementById("panelsStayOpen-collapseFive");
            if (!accordionElement5.classList.contains("show")) {
                accordionElement5.classList.add("show");
            }
        }
        // Coordinates
        if (coordinateList.length > 0) {
            var accordionElement6 = document.getElementById("panelsStayOpen-collapseSix");
            if (!accordionElement6.classList.contains("show")) {
                accordionElement6.classList.add("show");
            }
        }
        // Users
        if (userList.length > 0) {
            var accordionElement7 = document.getElementById("panelsStayOpen-collapseSeven");
            if (!accordionElement7.classList.contains("show")) {
                accordionElement7.classList.add("show");
            }
        }
        // FractionsAnalyzed
        if (fractionAnalyzedList.length > 0) {
            var accordionElement8 = document.getElementById("panelsStayOpen-collapseEight");
            if (!accordionElement8.classList.contains("show")) {
                accordionElement8.classList.add("show");
            }
        }
        // LabsAndNumbers
        if (labAndNumberList.length > 0) {
            var accordionElement9 = document.getElementById("panelsStayOpen-collapseNine");
            if (!accordionElement9.classList.contains("show")) {
                accordionElement9.classList.add("show");
            }
        }
        // Results
        if (resultList.length > 0) {
            var accordionElement10 = document.getElementById("panelsStayOpen-collapseTen");
            if (!accordionElement10.classList.contains("show")) {
                accordionElement10.classList.add("show");
            }
        }

    } catch (error) {
        console.error("Error during site migration: ", error);
    }
}

// Create Tables for already existing items under 'Site Selection' -------
function createExistingSiteList(existingSiteList) {

    if (existingSiteList.length > 0) {

        let table = document.getElementById("existingSiteListTable");

        if (!table) {

            // Get site selection form
            const siteSelectionForm = document.getElementById("siteSelectionForm");

            // Add text
            const headerText = document.createElement("p");
            headerText.innerHTML = "Not migrated, allready existing sites and additional added research projects";
            siteSelectionForm.appendChild(headerText);

            // Create new table
            const newTable = document.createElement("table");
            newTable.className = "table table-striped";
            newTable.id = "existingSiteListTable";

            // Create new table head
            const thead = document.createElement("thead");
            thead.innerHTML = `
            <tr>
                <th scope="col">site</th>
                <th scope="col">site id</th>
                <th scope="col">research projects</th>
                <th scope="col">added research projects</th>
            </tr>
            `;
            newTable.appendChild(thead);

            // Create new table body
            const tbody = document.createElement("tbody");
            // Create lines
            existingSiteList.forEach(item => {
                const row = document.createElement("tr");

                // Add columns
                row.innerHTML = `
                    <td>${item.label}</td>
                    <td>${item.id}</td>
                    <td>${item.researchProjectNames.join(", ")}</td>
                    <td>${item.addedResearchProjectNames.join(", ")}</td>
                `;

                tbody.appendChild(row);

                // Replace ✅ with ❌ in siteList
                Array.from(document.querySelectorAll(".siteCheckbox"))
                .filter(checkbox => item.label == checkbox.value)
                .map(checkbox => {
                    const row = checkbox.closest("tr");
                    const existingSymbol = row.lastElementChild.querySelector("span");
                    existingSymbol.innerHTML = "❌ (already existing)";
                });
            });        

            newTable.appendChild(tbody);
            siteSelectionForm.appendChild(newTable);
        } 
        // If table allready exists only add lines
        else {
            const tbody = table.querySelector("tbody");

            existingSiteList.forEach(item => {
                const row = document.createElement("tr");

                // Füge die Spalten hinzu
                row.innerHTML = `
                    <td>${item.label}</td>
                    <td>${item.id}</td>
                    <td>${item.researchProjectNames.join(", ")}</td>
                    <td>${item.addedResearchProjectNames.join(", ")}</td>
                `;

                tbody.appendChild(row);

                // Ersetze ✅ mit ❌ in siteList
                Array.from(document.querySelectorAll(".siteCheckbox"))
                    .filter(checkbox => item.label == checkbox.value)
                    .map(checkbox => {
                        const row = checkbox.closest("tr");
                        const existingSymbol = row.lastElementChild.querySelector("span");
                        if (existingSymbol) {
                            existingSymbol.innerHTML = "❌ (already existing)";
                        }
                    });
            });            
        }
    }    
}

function createExistingFeatureList(existingFeatureList) {

    if (existingFeatureList.length > 0) {

        let table = document.getElementById("existingFeatureListTable");

        if (!table) {

            // Get site selection form
            const siteSelectionForm = document.getElementById("siteSelectionForm");

            // Add text
            const headerText = document.createElement("p");
            headerText.innerHTML = "<br>Not migrated, allready existing features related to selected sites";
            siteSelectionForm.appendChild(headerText);

            // Create new table
            const newTable = document.createElement("table");
            newTable.className = "table table-striped";
            newTable.id = "existingFeatureListTable";

            // Create new table head
            const thead = document.createElement("thead");
            thead.innerHTML = `
            <tr>
                <th scope="col">feature</th>
                <th scope="col">feature id</th>
                <th scope="col">site</th>
            </tr>
            `;
            newTable.appendChild(thead);

            // Create new table body
            const tbody = document.createElement("tbody");
            // Create lines
            existingFeatureList.forEach(item => {
                const row = document.createElement("tr");

                // Add columns
                row.innerHTML = `
                    <td>${item.label}</td>
                    <td>${item.id}</td>
                    <td>${item.siteLabel}</td>
                `;

                tbody.appendChild(row);
            });        

            newTable.appendChild(tbody);
            siteSelectionForm.appendChild(newTable);
        } 
        // If table allready exists only add lines
        else {
            const tbody = table.querySelector("tbody");

            existingFeatureList.forEach(item => {
                const row = document.createElement("tr");

                // Füge die Spalten hinzu
                row.innerHTML = `
                    <td>${item.label}</td>
                    <td>${item.id}</td>
                    <td>${item.siteLabel}</td>
                `;

                tbody.appendChild(row);
            });            
        }
    }    
}

function createExistingSampleList(existingSampleList) {

    if (existingSampleList.length > 0) {

        let table = document.getElementById("existingSampleListTable");

        if (!table) {

            // Get site selection form
            const siteSelectionForm = document.getElementById("siteSelectionForm");

            // Add text
            const headerText = document.createElement("p");
            headerText.innerHTML = "<br>Not migrated, allready existing samples related to selected sites";
            siteSelectionForm.appendChild(headerText);

            // Create new table
            const newTable = document.createElement("table");
            newTable.className = "table table-striped";
            newTable.id = "existingSampleListTable";

            // Create new table head
            const thead = document.createElement("thead");
            thead.innerHTML = `
            <tr>
                <th scope="col">sample</th>
                <th scope="col">sample id</th>
                <th scope="col">site</th>
                <th scope="col">feature</th>
            </tr>
            `;
            newTable.appendChild(thead);

            // Create new table body
            const tbody = document.createElement("tbody");
            // Create lines
            existingSampleList.forEach(item => {
                const row = document.createElement("tr");

                // Add columns
                row.innerHTML = `
                    <td>${item.label}</td>
                    <td>${item.id}</td>
                    <td>${item.siteLabel}</td>
                    <td>${item.featureLabel}</td>
                `;

                tbody.appendChild(row);
            });        

            newTable.appendChild(tbody);
            siteSelectionForm.appendChild(newTable);
        } 
        // If table allready exists only add lines
        else {
            const tbody = table.querySelector("tbody");

            existingSampleList.forEach(item => {
                const row = document.createElement("tr");

                // Füge die Spalten hinzu
                row.innerHTML = `
                    <td>${item.label}</td>
                    <td>${item.id}</td>
                    <td>${item.siteLabel}</td>
                    <td>${item.featureLabel}</td>
                `;

                tbody.appendChild(row);
            });            
        }
    }    
}

function createExistingAbsoluteDatingList(existingAbsoluteDatingList) {

    if (existingAbsoluteDatingList.length > 0) {

        let table = document.getElementById("existingAbsoluteDatingListTable");

        if (!table) {

            // Get site selection form
            const siteSelectionForm = document.getElementById("siteSelectionForm");

            // Add text
            const headerText = document.createElement("p");
            headerText.innerHTML = "<br>Not migrated, allready existing datings related to selected sites";
            siteSelectionForm.appendChild(headerText);

            // Create new table
            const newTable = document.createElement("table");
            newTable.className = "table table-striped";
            newTable.id = "existingAbsoluteDatingListTable";

            // Create new table head
            const thead = document.createElement("thead");
            thead.innerHTML = `
            <tr>
                <th scope="col">sub sample</th>
                <th scope="col">absolute dating id</th>
                <th scope="col">site</th>
                <th scope="col">feature</th>
                <th scope="col">sample</th>
            </tr>
            `;
            newTable.appendChild(thead);

            // Create new table body
            const tbody = document.createElement("tbody");
            // Create lines
            existingAbsoluteDatingList.forEach(item => {
                const row = document.createElement("tr");

                // Add columns
                row.innerHTML = `
                    <td>${item.subSample}</td>
                    <td>${item.id}</td>
                    <td>${item.siteLabel}</td>
                    <td>${item.featureLabel}</td>
                    <td>${item.sampleLabel}</td>
                `;

                tbody.appendChild(row);
            });        

            newTable.appendChild(tbody);
            siteSelectionForm.appendChild(newTable);
        } 
        // If table allready exists only add lines
        else {
            const tbody = table.querySelector("tbody");

            existingAbsoluteDatingList.forEach(item => {
                const row = document.createElement("tr");

                // Füge die Spalten hinzu
                row.innerHTML = `
                    <td>${item.subSample}</td>
                    <td>${item.id}</td>
                    <td>${item.siteLabel}</td>
                    <td>${item.featureLabel}</td>
                    <td>${item.sampleLabel}</td>
                `;

                tbody.appendChild(row);
            });            
        }
    }    
}

// Literature ------------------------------------------------------------
function populateLiterature(literatureList) {
    const tableBody = document.getElementById("literatureTableBody");

    // Create lines
    literatureList.forEach(item => {
        const row = document.createElement("tr");

        // Add columns
        row.innerHTML = `
            <td>${item.siteLabel}</td>
            <td>${item.author}</td>
            <td>${item.publicationYear}</td>
            <td>
                <button type="button"
                        onclick="openLiteraturWindow(this.parentNode.parentNode, '${item.siteLabel}', '${item.author}', '${item.publicationYear}')">
                        Create
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// let selectedRow = null; // Global variable for the current row

function openLiteraturWindow (row, siteLabel, authors, publicationYear) {

    selectedRow = row;

    // Reset literatureForm
    document.getElementById("literatureForm").reset();    

    // Populate DOI and title list ---------------------------------------
    const doilist = document.getElementById('doiList');
    const titlelist = document.getElementById('titleList');

    // Reset doi and title datalist
    doilist.innerHTML = '';
    titlelist.innerHTML = '';

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
        // Populate doi and title dropdowns
        data.forEach(literature => {
            if (literature.doi != null) {
                const doiOption = document.createElement('option');
            doiOption.textContent = `${literature.doi}`;
            doilist.appendChild(doiOption);
            }
            
            if (literature.title != null) {
                const titleOption = document.createElement('option');
            titleOption.textContent = `${literature.title}`;
            titlelist.appendChild(titleOption);
            }
            
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Populate sites ----------------------------------------------------
    const siteSelectpicker = document.getElementById('siteSelectpicker');

    // Reset
    siteSelectpicker.innerHTML = '';

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
        // Populate the dropdown with sites
        data.forEach(site => {
            const option = document.createElement('option');
            option.value = site.id;
            const projectNames = site.researchProjectList.map(researchProject => researchProject.projectName).join(', ');
            option.text = `${site.label} (${projectNames})`;
            siteSelectpicker.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });    

    // Populate datings --------------------------------------------------
    const datingSelectpicker = document.getElementById('datingSelectpicker');

    // Reset
    datingSelectpicker.innerHTML = '';

    fetch('http://localhost:8080/absolute_datings', {
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
        // Populate the dropdown with absolute datings
        data.forEach(dating => {
            const option = document.createElement('option');
            option.value = dating.id;
            const projectNames = dating.sample.feature.site.researchProjectList.map(researchProject => researchProject.projectName).join(', ');
            option.text = `${dating.subSample} (${dating.sample.label}; ${dating.sample.feature.label}; ${dating.sample.feature.site.label}; ${projectNames})`;
            datingSelectpicker.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Populate authors lastname list ------------------------------------

    // Reset authorList and container
    authorList.length = 0;
    document.getElementById("authorContainer").innerHTML = '';

    const lastnameList = document.getElementById('lastnameList');

    // Reset
    lastnameList.innerHTML = '';

    fetch('http://localhost:8080/authors', {
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
        // Populate the dropdown with authors
        data.forEach(author => {
            const option = document.createElement('option');
            option.value = author.id;

            let authorName;
            if (author.firstName) {
                if (author.middleName) {
                  authorName = `${author.lastName}, ${author.firstName} ${author.middleName}`;
                } else {
                  authorName = `${author.lastName}, ${author.firstName}`;
                }                                    
            } else {
            authorName = `${author.lastName}`;
            }
            option.textContent = authorName;
            option.setAttribute("data-label", authorName);
            
            lastnameList.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Set values from migration -----------------------------------------
    document.getElementById("publicationYear").placeholder = `${publicationYear}`;
    document.getElementById("siteLabelFromMigration").textContent = `${siteLabel}`;
    document.getElementById("authorsFromMigration").textContent = `${authors}`;
    
    // Show Popup --------------------------------------------------------
    const literaturModal = document.getElementById("literaturModal");    
    literaturModal.style.display = "block";
    
    const closeButton = literaturModal.querySelector(".close");
    closeButton.onclick = function() {
        literaturModal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === literaturModal) {
            literaturModal.style.display = "none";
        }
    }
}

function createLiterature(authorList) {

    // Get Literature details
    const doi = document.getElementById("doi").value.trim() || null; // trim: removes spaces at the beginning and end of a string
    const publicationYear = document.getElementById("publicationYear").value || null;
    const title = document.getElementById("title").value.trim() || null;
    const shortCitation = document.getElementById("shortCitation").value.trim() || null;
    const longCitation = document.getElementById("longCitation").value.trim() || null;
    const litAbstract = document.getElementById("litAbstract").value.trim() || null;

    // Get reference sites
    const siteSelectpicker = document.getElementById("siteSelectpicker");
    let siteIdList = Array.from(siteSelectpicker.selectedOptions).map(option => option.value);
    siteIdList = siteIdList.length > 0 ? siteIdList : null;
    const siteList = siteIdList ? siteIdList.map(siteId => ({ id: siteId })) : null;

    // Get reference absolute datings
    const datingSelectpicker = document.getElementById("datingSelectpicker");
    let absoluteDatingIdList = Array.from(datingSelectpicker.selectedOptions).map(option => option.value);
    absoluteDatingIdList = absoluteDatingIdList.length > 0 ? absoluteDatingIdList : null;
    const absoluteDatingList = absoluteDatingIdList ? absoluteDatingIdList.map(absoluteDatingId => ({ id: absoluteDatingId })) : null;

    let literature = {
        ...(doi !== null && { doi }),
        ...(publicationYear !== null && { publicationYear }),
        ...(title !== null && { title }),
        ...(shortCitation !== null && { shortCitation }),
        ...(longCitation !== null && { longCitation }),
        ...(litAbstract !== null && { litAbstract }),
        ...(siteList !== null && { siteList }),
        ...(absoluteDatingList !== null && { absoluteDatingList })
    };

    if (Object.keys(literature).length === 0 && authorList.length === 0) {
        alert("set at least one attribute to create new literature");
    } else {

        // Create FormData object
        const formData = new FormData();
        
        // Add literature
        formData.append("literature", new Blob([JSON.stringify(literature)], { type: "application/json" }));

        // Add authorList (Ids of existing 'authors' OR new author objects without id)
        formData.append("authorList", new Blob([JSON.stringify(authorList)], { type: "application/json" }));

        // Create literature via POST
        fetch(`http://localhost:8080/literature`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);            

            // ToDo: JSON schick anzeigen (bspw. nur authors, pubYear, title)
            //       -> comment in "let selectedRow = null; // Global variable for the current row" over this function            
            // List created literature under selectedRow
            // if (selectedRow) {

            //     // Add authorList to literatur
            //     if (authorList.length > 0) {
            //         literature["authorList"] = authorList;
            //     }
                
            //     const formattedLiteratureJSON = JSON.stringify(literature, null, 2);

            //     const newRow = document.createElement("tr");

            //     const cell = document.createElement("td");
            //     cell.colSpan = 4;

            //     const strongText = document.createElement("strong");
            //     strongText.textContent = "New Literature:";

            //     const pre = document.createElement("pre");
            //     pre.style.background = "#f4f4f4";
            //     pre.style.padding = "10px";
            //     pre.style.borderRadius = "5px";
            //     pre.style.overflowX = "auto";

            //     const code = document.createElement("code");
            //     code.style.fontSize = "12px";
            //     code.style.fontFamily = "monospace";
            //     code.style.whiteSpace = "pre-wrap";
            //     code.innerText = formattedLiteratureJSON;

            //     pre.appendChild(code);
            //     cell.appendChild(strongText);
            //     cell.appendChild(pre);
            //     newRow.appendChild(cell);

            //     selectedRow.parentNode.insertBefore(newRow, selectedRow.nextSibling);

            //     selectedRow = null; // Reset
            // }            

            // Reset literatureForm
            document.getElementById("literatureForm").reset();

            // Reset authorList and container
            authorList.length = 0;
            document.getElementById("authorContainer").innerHTML = '';

            // Close modal
            document.getElementById("literaturModal").style.display = "none";
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to create literature");
        });
    }    
}


// Dante Attributes ------------------------------------------------------
function populateNonMatchingDanteAttributes(nonMatchingDanteAttributeList) {    
    // Site attributes
    const siteTypeTableBody = document.getElementById("siteTypeTableBody");
    const naturalUnitTableBody = document.getElementById("naturalUnitTableBody");
    // Feature attributes
    const featureTypeTableBody = document.getElementById("featureTypeTableBody");
    const preservationConditionTableBody = document.getElementById("preservationConditionTableBody");
    // Sample attributes
    const sampleTypeTableBody = document.getElementById("sampleTypeTableBody");
    const chronozoneTableBody = document.getElementById("chronozoneTableBody");
    const archaeologicalDatingTableBody = document.getElementById("archaeologicalDatingTableBody"); // ToDo: perhaps not necessary
    const culturalGroupTableBody = document.getElementById("culturalGroupTableBody");               // ToDo: perhaps not necessary
    const seedsAndFruitsTableBody = document.getElementById("seedsAndFruitsTableBody");
    const charcoalInvestigatedTableBody = document.getElementById("charcoalInvestigatedTableBody");
    const woodSubfossileTableBody = document.getElementById("woodSubfossileTableBody");
    // AbsoluteDating attributes
    const materialTableBody = document.getElementById("materialTableBody");
    const datingMethodTableBody = document.getElementById("datingMethodTableBody");

    // Create lines
    nonMatchingDanteAttributeList.forEach(async item => {
        const row = document.createElement("tr");

        let dropdown;

        const attribute = item.attribute;
        switch (attribute) {

            case ("siteType"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    multiple
                                    onchange="updateCheckedDropdownsMultiple(Array.from(this.selectedOptions).map(option => option.value),
                                                                             'siteTypeTableBody',
                                                                             'danteDropdown_')">
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttributes('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                siteTypeTableBody.appendChild(row);
                
                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case "naturalUnit":

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'naturalUnitTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                naturalUnitTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case ("featureType"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'featureTypeTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                featureTypeTableBody.appendChild(row);
                
                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case ("preservationCondition"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'preservationConditionTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                preservationConditionTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case ("sampleType"):
                
                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'sampleTypeTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                sampleTypeTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case ("chronozone"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'chronozoneTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                chronozoneTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            // case ("archaeologicalDating"):

            //     dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
            //                         onchange="updateCheckedDropdowns(this.value, 'archaeologicalDatingTableBody', 'danteDropdown_')">
            //                         <option value="">select Dante Label</option>
            //                 </select>`;

            //     // Add columns
            //     row.innerHTML = `
            //         <td><input type="checkbox"></td>
            //         <td>${item.type}</td>
            //         <td>${item.label}</td>
            //         <td>
            //             ${item.nonMatchingLabel}
            //             <br>
            //             <button type="button"
            //                     onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
            //                     Add&#8239to&#8239JSON
            //             </button>
            //         </td>
            //         <td>${dropdown}</td>
            //         <td>
            //             <button type="button"
            //                     onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
            //                     Update
            //             </button>
            //         </td>
            //     `;

            //     archaeologicalDatingTableBody.appendChild(row);

            //     // Populate Dropdown
            //     await fetchDanteAttribute(attribute);
            //     populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

            //     break;

            // case ("culturalGroup"):

            //     dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
            //                         onchange="updateCheckedDropdowns(this.value, 'culturalGroupTableBody', 'danteDropdown_')">
            //                         <option value="">select Dante Label</option>
            //                 </select>`;

            //     // Add columns
            //     row.innerHTML = `
            //         <td><input type="checkbox"></td>
            //         <td>${item.type}</td>
            //         <td>${item.label}</td>
            //         <td>
            //             ${item.nonMatchingLabel}
            //             <br>
            //             <button type="button"
            //                     onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
            //                     Add&#8239to&#8239JSON
            //             </button>
            //         </td>
            //         <td>${dropdown}</td>
            //         <td>
            //             <button type="button"
            //                     onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
            //                     Update
            //             </button>
            //         </td>
            //     `;

            //     culturalGroupTableBody.appendChild(row);

            //     // Populate Dropdown
            //     await fetchDanteAttribute(attribute);
            //     populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

            //     break;

            case ("seedsAndFruits"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'seedsAndFruitsTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                seedsAndFruitsTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case ("charcoalInvestigated"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'charcoalInvestigatedTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                charcoalInvestigatedTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case ("woodSubfossile"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'woodSubfossileTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                woodSubfossileTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case ("material"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'materialTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                materialTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;

            case ("datingMethod"):

                dropdown = `<select id="danteDropdown_${item.id}_${attribute}"
                                    onchange="updateCheckedDropdowns(this.value, 'datingMethodTableBody', 'danteDropdown_')">
                                    <option value="">select Dante Label</option>
                            </select>`;

                // Add columns
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${item.type}</td>
                    <td>${item.label}</td>
                    <td>
                        ${item.nonMatchingLabel}
                        <br>
                        <button type="button"
                                onclick="addLabelToJSON('${item.id}', '${attribute}', '${item.nonMatchingLabel}', false, event.currentTarget)">
                                Add&#8239to&#8239JSON
                        </button>
                    </td>
                    <td>${dropdown}</td>
                    <td>
                        <button type="button"
                                onclick="updateAttribute('${item.id}', '${attribute}', this.closest('tr'))">
                                Update
                        </button>
                    </td>
                `;

                datingMethodTableBody.appendChild(row);

                // Populate Dropdown
                await fetchDanteAttribute(attribute);
                populateDanteDropdown (attribute, document.getElementById(`danteDropdown_${item.id}_${attribute}`));

                break;
        }
    });

    // if tbody empty hide tables
    // else display
    tbodyList = [siteTypeTableBody, naturalUnitTableBody, featureTypeTableBody,
                 preservationConditionTableBody, sampleTypeTableBody, chronozoneTableBody,
                 seedsAndFruitsTableBody, charcoalInvestigatedTableBody, woodSubfossileTableBody,
                 archaeologicalDatingTableBody, culturalGroupTableBody,                             // ToDo: perhaps not necessary
                 materialTableBody, datingMethodTableBody];
    tbodyList.forEach(tbody => {
        hideTableIfTbodyEmpty(tbody);
    });
}

function updateAttributes(id, attribute, row) {
    // For multiple selection (only siteTypes)

    const dropdown = document.getElementById(`danteDropdown_${id}_${attribute}`);
    const attributeIds = Array.from(dropdown.selectedOptions).map(option => option.value);
    const attributeLabels = Array.from(dropdown.selectedOptions).map(option => option.getAttribute("data-label"));

    if (attributeIds.length > 0 && attributeLabels.length > 0) {
        let url = "";
        let payload = []

        if (attribute == "siteType") {            
            url = `http://localhost:8080/sites/${id}/updateSiteTypes`;
            
            payload = attributeIds.map((id, index) => ({
                id: id,
                label: attributeLabels[index]
            }));
        }

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            markRowAsCompleted(row);
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to update");
        });
    } else {
        alert(`No ${attribute} selected`);
    }
}

function updateAttribute(id, attribute, row) {
    const dropdown = document.getElementById(`danteDropdown_${id}_${attribute}`);
    const attributeId = dropdown ? dropdown.value : null;
    const attributeLabel = dropdown ? dropdown.options[dropdown.selectedIndex].getAttribute("data-label") : null;

    if (attributeId && attributeLabel) {

        const payload = {
            id: attributeId,
            label: attributeLabel
        };

        let url = "";
        switch (attribute) {

            // site
            case ("naturalUnit"):
                url = `http://localhost:8080/sites/${id}/updateNaturalUnit`;                    
                break;

            // feature
            case ("featureType"):
                url = `http://localhost:8080/features/${id}/updateFeatureType`;                
                break;
            
            case ("preservationCondition"):
                url = `http://localhost:8080/features/${id}/updatePreservationCondition`;                
                break;

            // sample
            case ("sampleType"):
                url = `http://localhost:8080/samples/${id}/updateSampleType`;
                break;

            case ("chronozone"):
                url = `http://localhost:8080/samples/${id}/updateChronozone`;
                break;

            // case ("archaeologicalDating"):
            //     url = `http://localhost:8080/samples/${id}/updateArchaeologicalDating`;
            //     break;

            // case ("culturalGroup"):
            //     url = `http://localhost:8080/samples/${id}/updateCulturalGroup`;
            //     break;

            case ("seedsAndFruits"):
                url = `http://localhost:8080/samples/${id}/updateSeedsAndFruits`;
                break;

            case ("charcoalInvestigated"):
                url = `http://localhost:8080/samples/${id}/updateCharcoalInvestigated`;
                break;

            case ("woodSubfossile"):
                url = `http://localhost:8080/samples/${id}/updateWoodSubfossile`;
                break;

            // absoluteDating
            case ("datingMethod"):
                url = `http://localhost:8080/absolute_datings/${id}/updateDatingMethod`;
                break;

            case ("material"):
                url = `http://localhost:8080/absolute_datings/${id}/updateMaterial`;
                break;
            
            default:
                console.error("Unknown attribute");
                return;
        }
    
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            markRowAsCompleted(row);
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to update");
        });


    } else {
        alert(`No ${attribute} selected`);
    }
}


// Coordinates -----------------------------------------------------------
function populateCoordinates(coordinateList) {
    const siteTableBody = document.getElementById("siteCoordinateTableBody");
    const sampleTableBody = document.getElementById("sampleCoordinateTableBody");
    
    // Create lines
    coordinateList.forEach(async item => {

        const row = document.createElement("tr");

        const type = item.type;
        if (type == "site") {

            let dropdown = `<select id="coordinateSystemDropdown_${type}_${item.id}"
                                    onchange="updateCheckedDropdowns(this.value, 'siteCoordinateTableBody', 'coordinateSystemDropdown_')">
                                    <option value="">select CoordinateSystem</option>
                            </select>`;

            // Add columns
            row.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${item.label}</td>
                <td>
                    <input type="text" 
                           id="longitudeInput_${type}_${item.id}" 
                           value="${item.longitude}"
                           style="font-size: 12px;">
                </td>
                <td>
                    <input type="text" 
                           id="latitudeInput_${type}_${item.id}" 
                           value="${item.latitude}"
                           style="font-size: 12px;">
                </td>
                <td>
                    <input type="text" 
                           id="altitudeInput_${type}_${item.id}" 
                           value="${item.altitude}"
                           style="font-size: 12px;">
                </td>
                <td>
                    ${item.coordinateSystem}
                    <br>
                        <button type="button"
                                data-item='${encodeURIComponent(JSON.stringify(item))}'
                                onclick="addLabelToJSONWithItem(this, 'coordinateSystemSite', '${item.coordinateSystem}')">
                                Add&#8239to&#8239JSON
                        </button>
                </td>
                <td>${dropdown}</td>
                <td style="width: 200px">
                    <textarea id="remarksInput_${type}_${item.id}" 
                              style="font-size: 12px; width: 100%; height: 65px;">
                    </textarea>        
                </td>
                <td>
                    <button type = "button"
                            onclick="createCoordinate('${type}', '${item.id}', this.closest('tr'))">
                            Create
                    </button>
                </td>
            `;            

            siteTableBody.appendChild(row);

            // Set value of remarks textarea
            document.getElementById(`remarksInput_${type}_${item.id}`).value = item.remarks;

            // Populate Dropdown
            await fetchDanteAttribute("coordinateSystem");
            populateDanteDropdown ("coordinateSystem", document.getElementById(`coordinateSystemDropdown_${type}_${item.id}`));

        } else if (type == "sample") {

            let dropdown = `<select id="coordinateSystemDropdown_${type}_${item.id}"
                                    onchange="updateCheckedDropdowns(this.value, 'sampleCoordinateTableBody', 'coordinateSystemDropdown_')">
                                    <option value="">select CoordinateSystem</option>
                            </select>`;

            // Add columns
            row.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${item.siteLabel}
                    <br>
                    ${item.featureLabel}
                    <br>
                    ${item.label}
                </td>                
                <td>
                    <input type="text" 
                           id="longitudeInput_${type}_${item.id}" 
                           value="${item.longitude}"
                           style="font-size: 12px;">
                </td>
                <td>
                    <input type="text" 
                           id="latitudeInput_${type}_${item.id}" 
                           value="${item.latitude}"
                           style="font-size: 12px;">
                </td>
                <td>
                    <input type="text" 
                           id="altitudeInput_${type}_${item.id}" 
                           value="${item.altitude}"
                           style="font-size: 12px;">
                </td>
                <td>${item.zcoordinate}</td>
                <td>
                    ${item.coordinateSystem}
                    <br>
                    <button type="button"
                                data-item='${encodeURIComponent(JSON.stringify(item))}'
                                onclick="addLabelToJSONWithItem(this, 'coordinateSystemSample', '${item.coordinateSystem}')">
                                Add&#8239to&#8239JSON
                    </button>
                </td>
                <td>${dropdown}</td>
                <td style="width: 200px">
                    <textarea id="remarksInput_${type}_${item.id}" 
                              style="font-size: 12px; width: 100%; height: 65px;">
                    </textarea>        
                </td>
                <td>
                    <button type = "button"
                            onclick="createCoordinate('${type}', '${item.id}', this.closest('tr'))">
                            Create
                    </button>
                </td>
            `;

            sampleTableBody.appendChild(row);

            // Set value of remarks textarea
            document.getElementById(`remarksInput_${type}_${item.id}`).value = item.remarks;

            // Populate Dropdown
            await fetchDanteAttribute("coordinateSystem");
            populateDanteDropdown ("coordinateSystem", document.getElementById(`coordinateSystemDropdown_${type}_${item.id}`));
        }
    });
}

async function createCoordinate(itemType, itemId, row) {

    // Get longitudeInput
    const longitudeInput = document.getElementById(`longitudeInput_${itemType}_${itemId}`);
    const longitude = longitudeInput ? parseFloat(longitudeInput.value) : null;

    if (longitude && longitude != 'null') {

        // Get latitudeInput
        const latitudeInput = document.getElementById(`latitudeInput_${itemType}_${itemId}`);
        const latitude = latitudeInput ? parseFloat(latitudeInput.value) : null;

        if (latitude && latitude != 'null') {

            // Get coordinateSystemDropdown
            const coordinateSystemDropdown = document.getElementById(`coordinateSystemDropdown_${itemType}_${itemId}`);
            const coordinateSystemId = coordinateSystemDropdown ? coordinateSystemDropdown.value : null;
            const coordinateSystemLabel = coordinateSystemDropdown ?
                coordinateSystemDropdown.options[coordinateSystemDropdown.selectedIndex].text
                : null;

            if (coordinateSystemId && coordinateSystemLabel) {

                // Get altitudeInput
                const altitudeInput = document.getElementById(`altitudeInput_${itemType}_${itemId}`);
                const altitude = altitudeInput ? altitudeInput.value : null;

                // Get remarksInput
                const remarksInput = document.getElementById(`remarksInput_${itemType}_${itemId}`);
                const remarksCoordinate = remarksInput ? remarksInput.value : null;

                const EPSG = coordinateSystemDropdown
                    ? coordinateSystemDropdown.options[coordinateSystemDropdown.selectedIndex].getAttribute("data-crsNotation")
                    : null;

                // Create payload
                let payload;
                if (EPSG == "4326") { // WGS 84
                    payload = {
                        longitude: longitude,
                        longitudeWgs84: longitude,
                        latitude: latitude,
                        latitudeWgs84: latitude,
                        altitude: altitude,
                        remarksCoordinate: remarksCoordinate,
                        coordinateSystem: {
                            id: coordinateSystemId,
                            label: coordinateSystemLabel
                        }
                    };
                } else {
                    // Transform coordinates to 'WGS 84'
                    const { transformedLongitude, transformedLatitude } = await transformCoordinatesToWGS84( longitude, latitude, EPSG);

                    payload = {
                        longitude: longitude,
                        latitude: latitude,
                        altitude: altitude,
                        remarksCoordinate: remarksCoordinate,
                        coordinateSystem: {
                            id: coordinateSystemId,
                            label: coordinateSystemLabel
                        },
                        ...(transformedLongitude !== null && { longitudeWgs84: transformedLongitude }),
                        ...(transformedLatitude !== null && { latitudeWgs84: transformedLatitude })
                    };
                }

                fetch(`http://localhost:8080/coordinates/${itemType}/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                    markRowAsCompleted(row);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Failed to create Coordinate");
                });
    
            } else {
                alert(`No coordinateSystem selected`);
            }

            
        } else {
            alert(`No latitude entered`);
        }    
    } else {
        alert(`No longitude entered`);
    }
}


// Employees -------------------------------------------------------------
let userDropdowns = [];

function populateUsers(userList) {
    const tableBody = document.getElementById("userTableBody");

    // Create lines
    userList.forEach(item => {

        const row = document.createElement("tr");      
        
        // Add columns
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td></td>
            <td>${item.userRole}</td>
            <td>${item.userLabel}</td>
            <td></td>
            <td>
                <button id="updateButton_${item.id}"
                        type="button"
                        onclick="updateWithUser('${item.type}', '${item.id}', '', '${item.userRole}', this.closest('tr'))">
                        Update
                </button>
            </td>
            <td>
                <button type="button"
                        onclick="openUserWindow('${item.userLabel}')">
                        Create
                </button>
            </td>
        `;

        // Set textContent of second cell depending on item type
        const secondTd = row.children[1];
        if (item.type == "site") {
            secondTd.textContent = item.label;
        }
        if (item.type == "sample") {
            secondTd.innerHTML = `${item.siteLabel}<br>${item.featureLabel}<br>${item.label}`;
        }

        const dropdown = document.createElement("select");
        dropdown.id = `userDropdown_${item.id}`;
        dropdown.multiple = true;
        dropdown.onchange = function () {   updateButtonWithUser(
                                                item.type,
                                                item.id, 
                                                Array.from(this.selectedOptions).map(option => option.value), 
                                                item.userRole,
                                                this.closest('tr')
                                            );
                                            updateCheckedDropdownsMultiple(
                                                Array.from(this.selectedOptions).map(option => option.value),
                                                'userTableBody',
                                                'userDropdown_'
                                            );
                                        };
        const dropdownCell = row.children[4];
        dropdownCell.appendChild(dropdown);

        tableBody.appendChild(row);

        userDropdowns.push(dropdown);
    });

    fetchUsers();
}

function updateButtonWithUser(type, id, userIds, userRole, row) {
    const updateButton = document.getElementById(`updateButton_${id}`);
    if (userIds && updateButton) {
        updateButton.onclick = function () {
            updateWithUser(type, id, JSON.stringify(userIds), userRole, row);
        };
    }
}

function fetchUsers() {

    // Send a GET request to get all users
    const url = 'http://localhost:8080/users';

    fetch(url, {
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
        
        // Empty user dropdowns
        userDropdowns.forEach(dropdown => {
            dropdown.options.length = 0;
        });
        
        data.forEach(user => {
            
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

            userDropdowns.forEach(dropdown => {

                // Create option
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = userName;

                dropdown.appendChild(option);
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function openUserWindow (userLabel) {

    // Reset userForm
    document.getElementById("userForm").reset();    

    // Populate userLastNameList -----------------------------------------
    const userLastNameList = document.getElementById('userLastNameList');

    userLastNameList.innerHTML = ''; // Reset userLastName datalist

    fetch('http://localhost:8080/users', {
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
        // Populate userLastName dropdown
        data.forEach(user => {
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
            option.textContent = userName;

            userLastNameList.appendChild(option); 
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Populate institution list -----------------------------------------

    // Reset institutionList and container
    institutionList.length = 0;
    document.getElementById("institutionContainer").innerHTML = '';

    const institutionLabelList = document.getElementById('institutionLabelList');

    // Reset
    institutionLabelList.innerHTML = '';

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
        // Populate the dropdown with institutions
        data.forEach(institution => {
            const option = document.createElement('option');

            option.value = institution.id;

            let institutionName;
            if (institution.rorId) {
                institutionName = `${institution.label}, ${institution.rorId}`;                                                
            } else {
            institutionName = `${institution.label}`;
            }
            option.textContent = institutionName;
            option.setAttribute("data-label", institutionName);
            
            institutionLabelList.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Set userLabel from migration -----------------------------------------
    document.getElementById("userLabelFromMigration").textContent = `${userLabel}`;
    
    // Show Popup --------------------------------------------------------
    const userModal = document.getElementById("userModal");    
    userModal.style.display = "block";
    
    const closeButton = userModal.querySelector(".close");
    closeButton.onclick = function() {
        userModal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === userModal) {
            userModal.style.display = "none";
        }
    }
}

function updateWithUser(type, id, userIds, userRole, row) {

    if (userIds) {        
        let url = null;
    
        if (type == "site") {
            url = `http://localhost:8080/sites/${id}/updateEmployees/${userRole}`;
        } 
        else if (type == "sample") {
            url = `http://localhost:8080/samples/${id}/updateBotanicalDeterminationBy`;
        }
    
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userIds
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            markRowAsCompleted(row);
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to update");
        });        
    } else {
        alert("Select at least one employee");
    }
    
}

function createUser(institutionList) {
    
    // Get user details
    const lastName     = document.getElementById("userLastName").value.trim()   || null; // trim: removes spaces at the beginning and end of a string
    const firstName    = document.getElementById("userFirstName").value.trim()  || null;
    const middleNames  = document.getElementById("userMiddleName").value.trim() || null;
    const mailAddress  = document.getElementById("mailAddress").value.trim()    || null;
    const orcid        = document.getElementById("ORCID").value.trim()          || null;

    let user = {
        ...(lastName    !== null && { lastName }),
        ...(firstName   !== null && { firstName }),
        ...(middleNames !== null && { middleNames }),
        ...(mailAddress !== null && { mailAddress }),
        ...(orcid       !== null && { orcid })
    };

    // Create FormData object
    const formData = new FormData();
    
    // Add user
    formData.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));

    // Add institutionList (Ids of existing 'institutions' OR new institution objects without id)
    formData.append("institutionList", new Blob([JSON.stringify(institutionList)], { type: "application/json" }));

    // Create user via POST
    fetch(`http://localhost:8080/users`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log(data);

        // Reset userForm
        document.getElementById("userForm").reset();

        // Reset institutionList and container
        institutionList.length = 0;
        document.getElementById("institutionContainer").innerHTML = '';

        // Update 'Select existing User(s)' selection
        fetchUsers();

        // Close popup
        const userModal = document.getElementById("userModal");    
        userModal.style.display = "none";
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Failed to create user");
    });
}


// Fractions Analyzed in SAMPLE context ----------------------------------
function populateFractionsAnalyzed(fractionAnalyzedList) {
    const tableBody = document.getElementById("fractionAnalyzedTableBody");

    // Create lines
    fractionAnalyzedList.forEach(item => {
        
        const originalFraction = item.fraction;

        const row = document.createElement("tr");

        // Add columns
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${item.siteLabel}
                <br>
                ${item.featureLabel}
                <br>
                ${item.sampleLabel}
            </td>
            <td>${item.fractionAnalyzed}</td>
            <td>${item.modifiedFraction ? item.fraction : ''}</td>
            <td>
                <select id="orgOrMin_${item.sampleId}_${item.fraction.replace(/[^\w-]/g, '_')}"
                        onchange="updateCheckedDropdowns(this.value, 'fractionAnalyzedTableBody', 'orgOrMin_')"
                        original-value="${originalFraction}">

                        <option value="">select orgOrMin</option>
                        <option value="org" ${item.orgOrMin === 'org' ? 'selected' : ''}>org</option>
                        <option value="min" ${item.orgOrMin === 'min' ? 'selected' : ''}>min</option>
                </select>
            </td>
            <td>
                <input type="text" 
                        id="sieveSize_${item.sampleId}_${item.fraction.replace(/[^\w-]/g, '_')}"
                        onchange="updateCheckedInputs(this.value, 'fractionAnalyzedTableBody', 'sieveSize_')"
                        value="${item.sieveSize ?? ''}"
                        original-value="${originalFraction}">
            </td>
            <td>
                <button 
                    id="createButton_${item.sampleId}_${item.fraction.replace(/[^\w-]/g, '_')}"
                    type="button"
                    onclick="createFractionAnalyzed('${item.siteLabel}',
                                                    '${item.sampleId}',
                                                    '${item.fractionAnalyzed}',
                                                    '${item.orgOrMin}',
                                                    '${item.sieveSize}',
                                                    '${originalFraction}',
                                                    this.closest('tr'))">
                    Create
                </button>
            </td>
        `;

        // EventListener for sieveSize and orgOrMin to set item value and update createButton
        const createButton = row.querySelector(`#createButton_${item.sampleId}_${item.fraction.replace(/[^\w-]/g, '_')}`);

        const sieveSizeInputElement = row.querySelector(`#sieveSize_${item.sampleId}_${item.fraction.replace(/[^\w-]/g, '_')}`);
        sieveSizeInputElement.addEventListener("change", (event) => {                
            const newValue = event.target.value;
            item.sieveSize = newValue;
            if (createButton) {
                createButton.setAttribute('onclick',
                    `createFractionAnalyzed('${item.siteLabel}', '${item.sampleId}', '${item.fractionAnalyzed}', '${item.orgOrMin}', '${newValue}', '${originalFraction}', this.closest('tr'))`
                );
            }
        });

        const orgOrMinInputElement = row.querySelector(`#orgOrMin_${item.sampleId}_${item.fraction.replace(/[^\w-]/g, '_')}`);
        orgOrMinInputElement.addEventListener("change", (event) => {                
            const newValue = event.target.value;
            item.orgOrMin = newValue;
            if (createButton) {
                createButton.setAttribute('onclick',
                    `createFractionAnalyzed('${item.siteLabel}', '${item.sampleId}', '${item.fractionAnalyzed}', '${newValue}', '${item.sieveSize}', '${originalFraction}', this.closest('tr'))`
                );
            }
        })

        
        tableBody.appendChild(row);
    });
}

function createFractionAnalyzed(siteLabel, sampleId, fractionAnalyzed, orgOrMin, sieveSize, originalFraction, row) {

    if (orgOrMin && sieveSize) {

        const payload = {
            fractionAnalyzed: fractionAnalyzed,
            orgOrMin: orgOrMin,
            sieveSize: sieveSize,
            sample: {
                id: sampleId 
            }
        };

        fetch(`http://localhost:8080/fractions_analyzed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            markRowAsCompleted(row);
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to create FractionAnalyzed");
        });

        // Update corresponding RESULT fields with fractionAnalyzed and sieveSize  
        const resultTableBody = document.getElementById(`resultTableBody_${siteLabel}`);

        Array.from(resultTableBody.rows).forEach(row => {            
            const sampleCell            = row.cells[2];
            const fractionAnalyzedCell  = row.cells[5];
            const orgOrMinCell          = row.cells[6];
            const sieveSizeCell         = row.cells[7];

            // Find corresponding results
            if (sampleCell.getAttribute('data-sampleId')            === sampleId &&
                orgOrMinCell.getAttribute('data-originalFraction')  === originalFraction &&
                sieveSizeCell.getAttribute('data-originalFraction') === originalFraction
            ) { // Set values
                fractionAnalyzedCell.textContent = fractionAnalyzed;
                orgOrMinCell.textContent         = orgOrMin;
                sieveSizeCell.textContent        = sieveSize;
            }
        });
    } else {
        alert(`No orgOrMin selected and/or sieveSize entered`);
    }    
}


// Labs and Numbers ------------------------------------------------------
function populateLabsAndNumbers(labAndNumberList) {
    const c14tableBody = document.getElementById("C14LabAndNumberTableBody");
    const tableBody = document.getElementById("LabAndNumberTableBody");

    // Create lines
    labAndNumberList.forEach(async item => {
        const row = document.createElement("tr");

        if (item.datingMethod == "c14Dating") {

            let dropdown = `<select id="c14LabCodeDropdown_${item.absoluteDatingId}"
                                    onchange="updateCheckedDropdowns(this.value, 'C14LabAndNumberTableBody', 'c14LabCodeDropdown_')">
                                    <option value="">select C14LabCode</option>
                            </select>`;

            // Add columns
            row.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${item.siteLabel}
                    <br>
                    ${item.featureLabel}
                    <br>
                    ${item.sampleLabel}
                    <br>
                    ${item.subSample}
                </td>
                <td>${item.labAndNumber}</td>
                <td>${dropdown}</td>
                <td>
                    <input type="text"
                           id="labelInput_${item.absoluteDatingId}"
                           onchange="updateCheckedInputs(this.value, 'C14LabAndNumberTableBody', 'labelInput_')"
                           value="">
                    <br>
                    <button type="button"
                            data-item='${encodeURIComponent(JSON.stringify(item))}'
                            onclick="addLabelToJSONWithItem(this, 'C14LabCode')">
                            Add&#8239to&#8239JSON
                    </button>
                </td>
                <td>
                    <input type="text" 
                           id="numberInput_${item.absoluteDatingId}"
                           value="">
                </td>                
                <td>
                    <button type="button"
                            onclick="updateAbsDatingWithLabAndNumber('${item.absoluteDatingId}', '${item.datingMethod}', this.closest('tr'))">
                            Update
                    </button>
                </td>
            `;

            c14tableBody.appendChild(row);

            // Populate dropdown
            await fetchDanteAttribute("c14Laboratory");
            populateDanteDropdown("c14Laboratory", document.getElementById(`c14LabCodeDropdown_${item.absoluteDatingId}`));

        } else {
            let dropdown = `<select id="labLabelDropdown_${item.absoluteDatingId}"
                                    onchange="updateCheckedDropdowns(this.value, 'LabAndNumberTableBody', 'labLabelDropdown_')">
                                    <option value="">select laboratory</option>
                            </select>`;

            // Add columns
            row.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${item.siteLabel}
                    <br>
                    ${item.featureLabel}
                    <br>
                    ${item.sampleLabel}
                    <br>
                    ${item.subSample}
                </td>
                <td>${item.datingMethod}</td>
                <td>${item.labAndNumber}</td>
                <td>${dropdown}</td>
                <td>
                    <input type="text"
                           id="labelInput_${item.absoluteDatingId}"
                           onchange="updateCheckedInputs(this.value, 'LabAndNumberTableBody', 'labelInput_')"
                           value="">
                </td>
                <td>
                    <input type="text" 
                           id="numberInput_${item.absoluteDatingId}"
                           value="">
                </td>
                <td>
                    <button type="button"
                            onclick="updateAbsDatingWithLabAndNumber('${item.absoluteDatingId}', '${item.datingMethod}', this.closest('tr'))">
                            Update
                    </button>
                </td>
            `;
    
            tableBody.appendChild(row);            

            fetchLabLabels();
        }                        
    });
}

function fetchLabLabels() {

    // Get dropdowns
    const tableBody = document.getElementById("LabAndNumberTableBody");
    const labLabelDropdowns = Array.from(tableBody.querySelectorAll("select"));

    fetch(`http://localhost:8080/laboratories`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
            return response.json();
    })
    .then(data => {

        // Empty laboratory dropdowns
        labLabelDropdowns.forEach(dropdown => {
            dropdown.options.length = 1;
        });

        // Populate dropdown with laboratories
        data.forEach(item => {

            labLabelDropdowns.forEach(dropdown => {

                // Create option
                const option = document.createElement('option');                       
                option.value = item.id;
                option.textContent = item.label;

                dropdown.appendChild(option);
            });            
        });
    })
    .catch(error => {
        console.error('Error: ', error);
    });
}

function updateAbsDatingWithLabAndNumber (absoluteDatingId, datingMethod, row) {
    // Get numberInput
    const numberInput = document.getElementById(`numberInput_${absoluteDatingId}`);
    const number = parseFloat(numberInput.value.trim());

    if (Number.isInteger(number) && number > 0) {

        if (datingMethod == "c14Dating") {            
            // Get C14LabCode and label from Dropdown
            const dropdown = document.getElementById(`c14LabCodeDropdown_${absoluteDatingId}`);
            const c14LabId = dropdown ? dropdown.value : null;
            const c14LabLabel = dropdown ? dropdown.options[dropdown.selectedIndex].getAttribute("data-label") : null;

            if (c14LabId || c14LabLabel) {
                
                const payload = {
                    id: c14LabId,
                    label: c14LabLabel
                };

                fetch(`http://localhost:8080/absolute_datings/${absoluteDatingId}/updateC14Dating/${number}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                    markRowAsCompleted(row);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Failed to update Dating");
                });
            
            } else {
                alert(`No existing C14Laboratory selected`);
            }

        } else {
            // Get laboratory from dropdown
            const dropdown = document.getElementById(`labLabelDropdown_${absoluteDatingId}`);
            const laboratoryId = dropdown ? dropdown.value : null;

            // Get labelInput
            const labelInput = document.getElementById(`labelInput_${absoluteDatingId}`);
            const inputLabLabel = labelInput ? labelInput.value : null;

            // XNOR-Gate
            if (!!laboratoryId === !!inputLabLabel) {
                alert(`Either select an existing laboratory OR enter a new label to create a new laboratory`);
            } else {
                const payload = laboratoryId ? { id: laboratoryId } : { label: inputLabLabel };

                fetch(`http://localhost:8080/absolute_datings/${absoluteDatingId}/update/${datingMethod}/${number}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                    markRowAsCompleted(row);
                    fetchLabLabels();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Failed to update Dating");
                });
            }
        }

    } else {
        alert(`No natural number entered`);
    }
}

// Results ---------------------------------------------------------------
const resultMap = new Map();

function populateResults(resultList) {

    // Get resultForm
    const resultForm = document.getElementById("resultForm");

    resultList.forEach(async entry => {
        const siteLabel = Object.keys(entry);

        const siteResultsContainer = document.createElement("div");

        // Container for siteLabel and taxonomyDropdwon -------------
        const labelDropdownContainer = document.createElement("div");
            // Style
        labelDropdownContainer.style.display = "flex";        // Flexbox for horizontal arrangement
        labelDropdownContainer.style.alignItems = "center";   // Align vertically
        labelDropdownContainer.style.gap = "20px";            // Space between texts and dropdown

        // Create 'span' for "Site label: ""
        const span_text = document.createElement("span");
        span_text.textContent = `Site: `;
            // Style
        span_text.style.fontWeight = "bold";

        // Create 'span' for siteLabel
        const span_siteLabel = document.createElement("span");
        span_siteLabel.textContent = siteLabel;
            // Style
        span_siteLabel.style.fontWeight = "bold";
        span_siteLabel.style.fontSize   = "1.3em"; // 130% of normal font size

        // Create taxonomy dropdown
        const taxonomyDropdown = document.createElement("div");
        taxonomyDropdown.innerHTML = `<select id="taxonomyDropdown_${siteLabel}"
                                              onchange="handleTaxonomyChange(this.value, '${siteLabel}')">
                                              <option value="">select Taxonomy</option>
                                      </select>
                                     `;
            // Style
        taxonomyDropdown.style.transform = "scale(0.8)";
        taxonomyDropdown.style.fontSize = "0.9em"; // 90% of normal font size

        labelDropdownContainer.appendChild(span_text);
        labelDropdownContainer.appendChild(span_siteLabel);
        labelDropdownContainer.appendChild(taxonomyDropdown);

        // Create new table -----------------------------------------

        // Scale result table font size 80%
        const style = document.createElement("style");
        style.innerHTML = `
            #resultTable td, #resultTable th {
                font-size: 0.8em;
            }
        `;
        // Insert the style tag into the head section of the document
        document.head.appendChild(style);

        // Create new table
        const resultTable = document.createElement("table");
        resultTable.className = "table table-striped";
        resultTable.id = "resultTable";

        // Create new table head
        const thead = document.createElement("thead");
        thead.innerHTML = `
        <tr>
            <th>
                <input type="checkbox" onclick="toggleAllCheckboxes(this, 'resultTableBody_${siteLabel}')">
            </th>

            <th scope="col">Feature</th>
            <th scope="col">Sample</th>

            <th scope="col">taxCode</th>
            <th scope="col">dante taxCode</th>

            <th scope="col">fraction Analyzed</th>
            <th scope="col">orgOrMin</th>
            <th scope="col">sieve size</th>

            <th scope="col">cf</th>

            <th scope="col">restType</th>
            <th scope="col">dante&#8239restType</th>

            <th scope="col">stateOfPreservation</th>
            <th scope="col">dante stateOfPreservation</th>

            <th scope="col">Create Result</th>
        </tr>
        `;
        resultTable.appendChild(thead);

        // Create new table body
        const resultTableBody = document.createElement("tbody");
        resultTableBody.id = `resultTableBody_${siteLabel}`;
        // ----------------------------------------------------------

        // Create lines for each result
        const results = entry[siteLabel];
        results.forEach(item => {

            const row = document.createElement("tr");

            // Generate an unique ID based on:
            // featureId, sampleId, nonMatchingTaxCode, fraction, cf, restType, stateOfPreservation
            const cf = item.result.classificationConfer ? item.result.classificationConfer.label : item.nonMatchingClassificationConfer;
            const restType = item.result.restType ? item.result.restType.label : item.nonMatchingRestType;
            const stateOfPreservation = item.result.stateOfPreservation ? item.result.stateOfPreservation.label : item.nonMatchingStateOfPreservation;
            item.id = `${item.result.sample.feature.id}_${item.fractionAnalyzed.sampleId}_${item.result.taxCode?.label ?? item.nonMatchingTaxCode}_${item.fractionAnalyzed.fraction.replace(/\./g, '_dot_')}_${cf}_${restType}_${stateOfPreservation}`;

            resultMap.set(item.id, item);
            
            // Add columns ----------------------------------------------------
            let columns = `
                <td><input type="checkbox"></td>

                <td>
                    ${item.result.sample.feature.label}
                </td>

                <td data-sampleId="${item.result.sample.id}">
                    ${item.result.sample.label}
                </td>
            `;

            // TaxCode
            if (item.result.taxCode != null) {
                columns += `<td>${item.result.taxCode.label}</td>`;
                columns += `<td></td>`;
            } else {              

                const taxCodeDropdown = `<select id="taxCodeDropdown_${item.id}"
                                                onchange="updateCheckedDropdowns(this.value, 'resultTableBody_${siteLabel}', 'taxCodeDropdown_')">
                                                <option value="">select tax code</option>
                                        </select>`;

                columns += `<td>${item.nonMatchingTaxCode}
                                <br>
                                <button type="button"
                                        data-item='${encodeURIComponent(JSON.stringify(item))}'
                                        onclick="addLabelToJSONWithItem(this, 'taxCode', '${item.nonMatchingTaxCode}')">
                                        Add&#8239to&#8239JSON
                                </button>
                            </td>`;

                columns += `<td>${taxCodeDropdown}</td>`;
            }

            // FractionAnalyzed
            columns += `<td></td>`;
            columns += `<td data-originalFraction="${item.fractionAnalyzed.fraction}">${item.fractionAnalyzed.orgOrMin ?? ''}</td>`;
            columns += `<td data-originalFraction="${item.fractionAnalyzed.fraction}">${item.fractionAnalyzed.sieveSize ?? ''}</td>`;

            // ClassificationConfer
            if (item.nonMatchingClassificationConfer == "") {
                columns += `<td>${item.result.classificationConfer.label}</td>`;
            //     columns += `<td></td>`;
            // } else {
            //     const cfDropdown = `<select id="cfDropdown_${item.id}"
            //                                 onchange="updateCheckedDropdowns(this.value, 'resultTableBody_${siteLabel}', 'cfDropdown_')">
            //                                 <option value="">select cf</option>
            //                         </select>`;

            //     columns += `<td>${item.nonMatchingClassificationConfer}
            //                     <br>
            //                     <button id="cfAddToJsonButton_${item.id}"
            //                             type="button"
            //                             onclick="addLabelToJSON('', 'cf', '${item.nonMatchingClassificationConfer}')"
            //                             disabled>
            //                             Add&#8239to&#8239JSON
            //                     </button>
            //                 </td>`;

            //     columns += `<td>${cfDropdown}</td>`;
            }

            // RestType
            if (item.nonMatchingRestType == "") {
                columns += `<td>${item.result.restType.label}</td>`;
                columns += `<td></td>`;
            } else {
                const restTypeDropdown = `<select id="restTypeDropdown_${item.id}"
                                                    onchange="updateCheckedDropdowns(this.value, 'resultTableBody_${siteLabel}', 'restTypeDropdown_')">
                                                    <option value="">select restType</option>
                                            </select>`;

                columns += `<td>${item.nonMatchingRestType}
                                <br>
                                <button id="restTypeAddToJsonButton_${item.id}"
                                        type="button"
                                        onclick="addLabelToJSON('', 'restType', '${item.nonMatchingRestType}')"
                                        disabled>
                                        Add&#8239to&#8239JSON
                                </button>
                            </td>`;

                columns += `<td>${restTypeDropdown}</td>`;
            }

            // StateOfPreservation            
            if (item.nonMatchingStateOfPreservation == "") {
                columns += `<td>${item.result.stateOfPreservation.label}</td>`;
                columns += `<td></td>`;
            } else {
                const stateOfPreservationDropdown = `<select id="stateOfPreservationDropdown_${item.id}"
                                                                onchange="updateCheckedDropdowns(this.value, 'resultTableBody_${siteLabel}', 'stateOfPreservationDropdown_')">
                                                                <option value="">select stateOfPreservation</option>
                                                        </select>`;

                columns += `<td>${item.nonMatchingStateOfPreservation}
                                <br>
                                <button id="stateOfPreservationAddToJsonButton_${item.id}"
                                        type="button"
                                        onclick="addLabelToJSON('', 'stateOfPreservation', '${item.nonMatchingStateOfPreservation}')"
                                        disabled>
                                        Add&#8239to&#8239JSON
                                </button>
                            </td>`;

                columns += `<td>${stateOfPreservationDropdown}</td>`;
            }

            // 'Create' result button
            columns += `<td>
                            <button
                                type="button"
                                onclick="createResult('${item.id}', this.closest('tr'))">
                                Create
                            </button>
                        </td>`

            // ----------------------------------------------------------------

            row.innerHTML = columns;

            resultTableBody.appendChild(row);            
        });

        resultTable.appendChild(resultTableBody);        

        siteResultsContainer.appendChild(labelDropdownContainer);
        siteResultsContainer.appendChild(resultTable);

        resultForm.appendChild(siteResultsContainer);        

        // Populate taxonomyDropdown
        await fetchDanteAttribute("taxonomy");
        populateDanteDropdown("taxonomy", document.getElementById(`taxonomyDropdown_${siteLabel}`));

        // Populate danteDropdowns in each line 
        results.forEach(async item => {

            // if (item.result.classificationConfer == null) {
            //     // Populate cfDropdown
            //     await fetchDanteAttribute("classificationConfer");
            //     populateDanteDropdown("classificationConfer", document.getElementById(`cfDropdown_${item.id}`));
            // }

            if (item.result.restType == null) {
                // Populate restTypeDropdown
                await fetchDanteAttribute("restType");
                populateDanteDropdown("restType", document.getElementById(`restTypeDropdown_${item.id}`));
            }            

            if (item.result.stateOfPreservation == null) {
                // Populate stateOfPreservationDropdown
                await fetchDanteAttribute("stateOfPreservation");
                populateDanteDropdown("stateOfPreservation", document.getElementById(`stateOfPreservationDropdown_${item.id}`));
            }
        });
    });
}

async function handleTaxonomyChange(uri, siteLabel) {

    await fetchDanteTaxCodes(uri);

    // Get tax codes for corresponding uri
    const taxCodes = cachedTaxCodesForURI.get(uri) || [];
    const sharedTaxCodesOptionsFragment = createTaxCodeOptionsFragment(taxCodes);

    // Get all tax codes dropdowns
    const tableBody = document.getElementById(`resultTableBody_${siteLabel}`);
    const taxCodeDropdowns = tableBody.querySelectorAll("select[id^='taxCodeDropdown_']");

    taxCodeDropdowns.forEach(dropdown => {
        dropdown.addEventListener("focus", () => {
                populateTaxCodeDropdownShared(dropdown, sharedTaxCodesOptionsFragment);
        });
    });
}

function createResult(itemId, row) {

    // Get result
    const item = resultMap.get(itemId);
    const result = item.result;

    // Get Taxonomy
    const siteLabel = result.sample.feature.site.label;
    const taxonomyDropdown = document.getElementById(`taxonomyDropdown_${siteLabel}`);
    const taxonomyLabel = taxonomyDropdown ? taxonomyDropdown.options[taxonomyDropdown.selectedIndex].text : null;

    if (taxonomyLabel != "select Taxonomy") {

        if (result.taxCode == null) {
            // Get taxCode
            const taxCodeDropdown = document.getElementById(`taxCodeDropdown_${item.id}`);
            const taxCodeId = taxCodeDropdown ? taxCodeDropdown.value : null;
            const taxCodeLabel = taxCodeDropdown ? taxCodeDropdown.options[taxCodeDropdown.selectedIndex].text : null;

            if (taxCodeId && taxCodeLabel) {
                // Set taxCode
                result.taxCode = {
                        id:       taxCodeId,
                        label:    taxCodeLabel,
                        taxonomy: taxonomyLabel
                };            
            } else {
                alert("Please select a 'dante taxCode'");
                return;
            }
        }

        // Get fraction
        const fractionAnalyzedCell  = row.cells[5];
        const orgOrMinCell          = row.cells[6];
        const sieveSizeCell         = row.cells[7];

        if (fractionAnalyzedCell.textContent != "") {
            // Set fractionAnalyzed in result
            result.fractionAnalyzed = fractionAnalyzedCell.textContent;
            result.orgOrMin         = orgOrMinCell.textContent
            result.sieveSize        = parseFloat(sieveSizeCell.textContent);

            // // Get and set ClassificationConfer
            // if (result.classificationConfer == null) {
            //     const cfDropdown = document.getElementById(`cfDropdown_${item.id}`);

            //     const cfId = cfDropdown ? cfDropdown.value : null;
            //     const cfLabel = cfDropdown ? cfDropdown.options[cfDropdown.selectedIndex].text : null;

            //     if (cfId && cfLabel) {
            //         // Set ClassificationConfer
            //         result.classificationConfer = {
            //             id: cfId,
            //             label: cfLabel
            //         };
            //     } else {
            //         alert("Please select a classificationConfer (cf)");
            //         return;
            //     }
            // }
            // Get and set RestType
            if (result.restType == null) {
                const restTypeDropdown = document.getElementById(`restTypeDropdown_${item.id}`);

                const restTypeId = restTypeDropdown ? restTypeDropdown.value : null;
                const restTypeLabel = restTypeDropdown ? restTypeDropdown.options[restTypeDropdown.selectedIndex].text : null;

                if (restTypeId && restTypeLabel) {
                    // Set RestType
                    result.restType = {
                        id: restTypeId,
                        label: restTypeLabel
                    };
                } else {
                    alert("Please select a restType");
                    return;
                }
            }
            // Get and set StateOfPreservation
            if (result.stateOfPreservation == null) {
                const stateOfPreservationDropdown = document.getElementById(`stateOfPreservationDropdown_${item.id}`);

                const stateOfPreservationId = stateOfPreservationDropdown ? stateOfPreservationDropdown.value : null;
                const stateOfPreservationLabel = stateOfPreservationDropdown ? stateOfPreservationDropdown.options[stateOfPreservationDropdown.selectedIndex].text : null;

                if (stateOfPreservationId && stateOfPreservationLabel) {
                    // Set StateOfPreservation
                    result.stateOfPreservation = {
                        id: stateOfPreservationId,
                        label: stateOfPreservationLabel
                    };
                } else {
                    alert("Please select a stateOfPreservation");
                    return;
                }
            }

            // Only add sampleId to parse JSON in backend correct
            sampleId = result.sample.id;
            delete result.sample;
            result.sample = { id: sampleId };

            // Create Result via POST
            fetch(`http://localhost:8080/results/createViaMigration/${taxonomyLabel}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {

                if (data == "result already exists") {
                    console.log(data);
                } else {
                    // data is result id
                    console.log("result is created");
                }                

                markRowAsCompleted(row);
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Failed to create result");
            }); 

        } else {
            alert("Before you can create a result, you must create the corresponding fraction analysed for the corresponding sample in the ‘Fraction Analyzed’ accordion");
        }
    } else {
        alert("Please select a 'Taxonomy' for this site");
    }
}


// General functions -----------------------------------------------------

function toggleAllCheckboxes(masterCheckbox, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    if (tableBody) {
      const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        if (!checkbox.disabled) {
          checkbox.checked = masterCheckbox.checked;
        }
      });
    }
}

function updateCheckedDropdowns(value, tableBodyId, selectIdPrefix) {
    const tableBody = document.getElementById(tableBodyId);
    if (tableBody) {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]:checked');
        // Update value in checked Dropdowns
        checkboxes.forEach(checkbox => {
            if (!checkbox.disabled) {
                const row = checkbox.closest('tr');
                const dropdown = row.querySelector(`select[id^=${selectIdPrefix}]`);
                if (dropdown) {
                    dropdown.value = value;
                }
            }
        });
    }
}

function updateCheckedDropdownsMultiple(values, tableBodyId, selectIdPrefix) {
    const tableBody = document.getElementById(tableBodyId);
    if (tableBody) {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]:checked');
        // Update values in checked Dropdowns
        checkboxes.forEach(checkbox => {
            if (!checkbox.disabled) {
                const row = checkbox.closest('tr');
                const dropdown = row.querySelector(`select[id^=${selectIdPrefix}]`);
                if (dropdown) {
                    // Clear previous selections
                    Array.from(dropdown.options).forEach(option => {
                        option.selected = values.includes(option.value);
                    });
                }
            }
        });
    }
}

function updateCheckedInputs(value, tableBodyId, inputIdPrefix) {
    const tableBody = document.getElementById(tableBodyId);
    if (tableBody) {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]:checked');
        // Update value in checked inputs
        checkboxes.forEach(checkbox => {
            if (!checkbox.disabled) {
                const row = checkbox.closest('tr');
                const input = row.querySelector(`input[id^=${inputIdPrefix}]`);
                if (input) {
                    input.value = value;
                }
            }
        });
    }
}

function markRowAsCompleted(row) {

    // Disable input fields
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);

    // Uncheck checkboxes
    const checkboxes = row.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Disable select fields (dropdowns)
    const dropdowns = row.querySelectorAll('select');
    dropdowns.forEach(dropdown => dropdown.disabled = true);

    // Disable textareas
    const textareas = row.querySelectorAll('textarea');
    textareas.forEach(textarea => textarea.disabled = true);

    // Disable buttons
    const buttons = row.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);

    // Add green tick
    const greenCheck = document.createElement('td');
    greenCheck.innerHTML = "✅";
    greenCheck.style.paddingTop = '15px';
    row.appendChild(greenCheck);
}

function addLabelToJSON(itemId, attribute, nonMatchingLabel, isItemLabel, button) {

    if (isItemLabel) {
        // Search JSON entry by 'auxiliaryId'
        let foundItem = jsonData.find(dataElement => dataElement.auxiliaryId === itemId);

        if (foundItem) {
            // Add `nonMatching_{$attribute}`: nonMatchingLabel
            let key = `nonMatching_${attribute}`;
            foundItem[key] = nonMatchingLabel;
        }
        console.log(`nonMatching_${attribute} is added to existing JSON entry`);
        
        // Disable 'Add to JSON' button after use
        button.disabled = true;
    } else {        
        const data = {
            attribute: attribute,
            nonMatchingLabel: nonMatchingLabel,
            itemId: itemId
        };

        jsonData.push(data);
        console.log(`non matching ${attribute} is added to JSON`);
        
        if (attribute == "cf" || attribute == "restType" || attribute == "stateOfPreservation") {            
            // disable Button
            button.disabled = true;
        }
        else {
            // Get row from button
            const row = button.closest("tr");
            markRowAsCompleted(row);
        }        
    }

    displayJSON();
}

function addLabelToJSONWithItem(button, attribute, nonMatchingLabel) {    
    // attributes: 'taxCode',
    //             'coordinateSystemSite', 'coordinateSystemSample',
    //             'C14LabCode'

    // Get row from button
    const row = button.closest("tr");

    // Decode item
    let jsonString = decodeURIComponent(button.getAttribute('data-item'));
    let item = JSON.parse(jsonString);
    
    if (attribute == "taxCode") {

        let result = item.result;

        // Get and set fractionAnalyzed ------------------------------
        const fractionAnalyzedCell  = row.cells[6];
        const orgOrMinCell          = row.cells[7];
        const sieveSizeCell         = row.cells[8];

        if (fractionAnalyzedCell.textContent != "null") {
            // Set fractionAnalyzed in result
            result.fractionAnalyzed = fractionAnalyzedCell.textContent;
            result.orgOrMin         = orgOrMinCell.textContent
            result.sieveSize        = parseFloat(sieveSizeCell.textContent);

            // Get and set ClassificationConfer
            let cfIsSet = true;
            if (result.classificationConfer == null) {
                const cfDropdown = document.getElementById(`cfDropdown_${item.id}`);

                const cfId = cfDropdown ? cfDropdown.value : null;
                const cfLabel = cfDropdown ? cfDropdown.options[cfDropdown.selectedIndex].text : null;

                if (cfId && cfLabel) {
                    // Set ClassificationConfer
                    result.classificationConfer = {
                        id: cfId,
                        label: cfLabel
                    };
                } else {
                    // enable 'AddToJSON' Button
                    cfIsSet = false;
                }
            }
            // Get and set RestType
            let restTypeIsSet = true;
            if (result.restType == null) {
                const restTypeDropdown = document.getElementById(`restTypeDropdown_${item.id}`);

                const restTypeId = restTypeDropdown ? restTypeDropdown.value : null;
                const restTypeLabel = restTypeDropdown ? restTypeDropdown.options[restTypeDropdown.selectedIndex].text : null;

                if (restTypeId && restTypeLabel) {
                    // Set RestType
                    result.restType = {
                        id: restTypeId,
                        label: restTypeLabel
                    };
                } else {
                    // enable 'AddToJSON' Button
                    restTypeIsSet = false;
                }
            }
            // Get and set StateOfPreservation
            let stateOfPreservationIsSet = true;
            if (result.stateOfPreservation == null) {
                const stateOfPreservationDropdown = document.getElementById(`stateOfPreservationDropdown_${item.id}`);

                const stateOfPreservationId = stateOfPreservationDropdown ? stateOfPreservationDropdown.value : null;
                const stateOfPreservationLabel = stateOfPreservationDropdown ? stateOfPreservationDropdown.options[stateOfPreservationDropdown.selectedIndex].text : null;

                if (stateOfPreservationId && stateOfPreservationLabel) {
                    // Set StateOfPreservation
                    result.stateOfPreservation = {
                        id: stateOfPreservationId,
                        label: stateOfPreservationLabel
                    };
                } else {
                    // enable 'AddToJSON' Button
                    stateOfPreservationIsSet = false;
                }
            }

            const data = {
                itemType: "result",
                auxiliaryId: item.id,
                item: result,
                nonMatching_taxCode: nonMatchingLabel
            };

            jsonData.push(data);
            displayJSON();
            console.log(`non matching ${attribute} is added to JSON`);

            markRowAsCompleted(row);

            // if the attributes are not set 
            // - enable 'Add to JSON' Buttons for 'cf', 'restType', 'stateOfPreservation'
            // - add item.id to button
            if (!cfIsSet) {
                const cfButton = document.getElementById(`cfAddToJsonButton_${item.id}`);
                cfButton.disabled = false;
                cfButton.onclick = function () {
                    addLabelToJSON(item.id, 'cf', item.nonMatchingClassificationConfer, true, cfButton);
                };
            }
            if (!restTypeIsSet) {
                const restTypeButton = document.getElementById(`restTypeAddToJsonButton_${item.id}`);
                restTypeButton.disabled = false;
                restTypeButton.onclick = function () {
                    addLabelToJSON(item.id, 'restType', item.nonMatchingRestType, true, restTypeButton);
                };
            }
            if (!stateOfPreservationIsSet) {
                const stateOfPreservationButton = document.getElementById(`stateOfPreservationAddToJsonButton_${item.id}`);
                stateOfPreservationButton.disabled = false;
                stateOfPreservationButton.onclick = function () {
                    addLabelToJSON(item.id, 'stateOfPreservation', item.nonMatchingStateOfPreservation, true, stateOfPreservationButton);
                };
            }
        } else {
            alert("Before you can add 'former taxCode' to JSON, you must create the corresponding fraction analysed for the corresponding sample in the ‘Fraction Analyzed’ accordion");
        }        
    }

    if (attribute == "coordinateSystemSite" || attribute == "coordinateSystemSample") {

        // Get latitude, longitude, altitude, remarks from input -----
        const latitude  = parseFloat(row.cells[2].querySelector("input").value);
        const longitude = parseFloat(row.cells[3].querySelector("input").value);
        const altitude  = parseFloat(row.cells[4].querySelector("input").value);

        let remarks;   
        let data;
        if (attribute == "coordinateSystemSite") {
            remarks   = row.cells[7].querySelector("textarea").value

            data = {
                itemType: "coordinateSite",
                siteId: item.id,
                item: {latitude:  latitude,
                    longitude: longitude,
                    altitude:  altitude,
                    remarks:   remarks
                },
                nonMatching_coordinateSystem: nonMatchingLabel
            };
        } else if (attribute == "coordinateSystemSample") {
            remarks   = row.cells[8].querySelector("textarea").value

            data = {
                itemType: "coordinateSample",
                sampleId: item.id,
                item: {latitude:  latitude,
                    longitude: longitude,
                    altitude:  altitude,
                    remarks:   remarks
                },
                nonMatching_coordinateSystem: nonMatchingLabel
            }
        }        

        jsonData.push(data);
        displayJSON();
        console.log(`non matching ${attribute} is added to JSON`);

        markRowAsCompleted(row);                 
    }

    if (attribute == "C14LabCode") {

        // Get number
        const numberInput  = row.cells[6].querySelector("input");
        const number = parseFloat(numberInput.value.trim());

        if (Number.isInteger(number) && number > 0) {

            // Get labelInput
            const newC14LabCode  = row.cells[5].querySelector("input").value.trim();

            if (newC14LabCode && newC14LabCode.trim() !== "") {

                data = {
                    itemType: "C14Dating",
                    absoluteDatingId: item.absoluteDatingId,
                    number: number,
                    nonMatching_C14LabCode: newC14LabCode
                }       
    
                jsonData.push(data);
                displayJSON();
                console.log(`non matching ${attribute} is added to JSON`);

                markRowAsCompleted(row); 
                
            
            } else {
                alert(`No new C14Laboratory entered`);
            }

        } else {
            alert(`No natural number entered`);
        }
    }
}

function hideTableIfTbodyEmpty(tbody) {
    if (tbody) {
        const table = tbody.closest('table');
        if (table) {
            // hide if empty
            if (tbody.rows.length === 0) {
                table.style.display = 'none';
            } else { // display
                table.style.display = 'table';
            }
        }
    }
}
