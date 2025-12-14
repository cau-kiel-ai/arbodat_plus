
let researchProjectTable;

async function buildResearchProjectTable() {    

    // GET sites ----------------------------------------------------------------
    let sites = [];
    try {
        const response = await axios.get("http://localhost:8080/sites");
        sites = response.data;
    } catch (error) {
        console.error("Error loading sites:", error)
    }

    // Create Table -------------------------------------------------------------
    researchProjectTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"*project name", field:"projectName", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"funder", field:"funder", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"authorisation number", field:"authorisationNumber", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"license", field:"license.id", headerSort:false,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedLicenses.map(license => ({
                            value: license.uri,
                            label: license.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedLicenses.map(license => ({
                        value: license.uri,
                        label: license.prefLabel.en
                    })),
                    multiselect:true
                },
                headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue || (Array.isArray(headerValue) && headerValue.length === 0)) {
                        return true;
                    }
                    return headerValue.includes(rowValue);
                },
                formatter: function(cell){
                    const value = cell.getValue();
                    const license = cachedLicenses.find(license => license.uri === value) || null;
                    return license?.prefLabel.en || "";
                },
            },
            {title:"export file name", field:"exportFileName", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"site list (multiple selection)", field: "siteList", headerSortTristate:true,
                mutator: function(value) {
                    // Map site objects only to site id
                    return Array.isArray(value) ? value.map(site => site.id? site.id : site) : [];
                },
                editor:"list", editorParams:{
                    values: sites.map(item => ({                        
                        value: item.id,
                        label: item.label + " ("+ item.researchProjectList.map(rp => rp.projectName) + ")"
                    })),
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: sites.map(item => ({
                        value: item.id,
                        label: item.label + " ("+ item.researchProjectList.map(rp => rp.projectName) + ")"
                    })),
                    multiselect: true
                },
                headerFilterFunc: function(headerValue, rowValue){
                    return headerValue.every(val => rowValue.includes(val));
                },
                sorter:"array", sorterParams:{
                    valueMap:"label"
                },
                formatter: function(cell) {
                    const siteIds = cell.getValue();                
                    if (Array.isArray(siteIds)) {
                        return siteIds
                                .map(id => {
                                    const site = sites.find(site => site.id === id)
                                    return site?.label;})
                                .join(", ");
                    }
                }
            }
        ],
        initialSort: [
            {column: "projectName", dir: "asc"}
        ]
    });


    // GET research projects and populate table ---------------------------------
    axios.get("http://localhost:8080/research_projects")
    .then(response => {
        researchProjectTable.setData(response.data);
    })
    .catch(error => console.error("Error loading research projects:", error));
    

    // PUT: update research project ---------------------------------------------
    researchProjectTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows ------------------------------
        const selectedRows = researchProjectTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const researchProject = row.getData();
            const researchProjectId = researchProject.id;
            // Map site ids back to site objects
            const siteListAsObjects = (researchProject.siteList || []).map(site => typeof site === "string" ? { id: site } : site);
            const payload = {
                ...researchProject,
                siteList: siteListAsObjects
            };
    
            axios.put(`http://localhost:8080/research_projects/${researchProjectId}`, JSON.stringify(payload), {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
            .then(async response => {
                console.log(response.data);
                
                // Update table ---------------------------------------
                if(row !== cell.getRow()) { // skip the edited line
                    if (editedField === "license.id") {
                        const licenseObject = cachedLicenses.find(item => item.uri === newValue);
                        if (licenseObject) {
                            row.update({ license: { id: licenseObject.uri, label: licenseObject.prefLabel.en } });
                        }
                    } else {
                        row.update({ [editedField]: newValue });
                    }
                } // --------------------------------------------------
            })
            .catch(error => console.error("Error updating research project:", error));
        });
        
        // update site list headerFilterParams ----------------
        // GET sites
        try {
            const response = await axios.get("http://localhost:8080/sites");
            sites = response.data;
        } catch (error) {
            console.error("Error loading sites:", error)
        }

        // Generate new headerFilterParams values
        const updatedSiteValues = sites.map(item => ({
            value: item.id,
            label: `${item.label} (${item.researchProjectList.map(rp => rp.projectName).join(", ")})`
        }));

        // Get column
        const siteListColumn = researchProjectTable.getColumn("siteList");

        // Set new editorParams and headerFilterParams values
        siteListColumn.updateDefinition({
            editorParams: {
                values: updatedSiteValues,
                autocomplete: false,
                multiselect: true,
                emptyValue: []
            },
            headerFilterParams: {
                values: updatedSiteValues
            }
        });
    });


    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    researchProjectTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = researchProjectTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const researchProjectId = row.getData().id;

            axios.delete(`http://localhost:8080/research_projects/${researchProjectId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting research project:', error);
            });            
        });
    });

}
 // Export table ---------------------------------------------------------

document.getElementById("download-csv").addEventListener("click", function(){
    researchProjectTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    researchProjectTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    researchProjectTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    researchProjectTable.download("html", "data.html", {style:true});
});
