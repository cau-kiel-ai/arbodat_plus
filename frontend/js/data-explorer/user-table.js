let userTable;

async function buildUserTable() {

    // GET institutions ----------------------------------------------------------------
    let institutions = [];
    try {
        const response = await axios.get("http://localhost:8080/institutions");
        institutions = response.data;
    } catch (error) {
        console.error("Error loading institutions:", error)
    }

    // Create Table -------------------------------------------------------------
    userTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"first name", field:"firstName", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"middle name", field:"middleNames", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"*last name", field:"lastName", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"mail address", field:"mailAddress", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"ORCID", field:"orcid", editor:"input", headerFilter:true, headerSortTristate:true},
            {title: "institution list (multiple selection)", field:"institutionList", headerSortTristate:true,
                mutator: function(value) {
                    // Map site type objects only to site type id
                    return Array.isArray(value) ? value.map(item => item.id? item.id : item) : [];
                },
                editor:"list", editorParams:{
                    values: [
                        ...institutions.map(item => ({
                            value: item.id,
                            label: item.label + (item.rorId ? ` (${item.rorId})` : "")
                        }))
                    ],
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: institutions.map(item => ({
                            value: item.id,
                            label: item.label + (item.rorId ? ` (${item.rorId})` : "")
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
                    const institutionIds = cell.getValue();
                    if (Array.isArray(institutionIds)) {
                        return institutionIds
                                .map(id => {
                                    const institution = institutions.find(item => item.id === id)
                                    return institution?.label;})
                                .join(", ");
                    }
                }
            },
        ],
        initialSort: [
            {column: "lastName", dir: "asc"}
        ]
    });

    // GET users and populate table --------------------------------------
    axios.get("http://localhost:8080/users")
    .then(response => {
        userTable.setData(response.data);
    })
    .catch(error => console.error("Error loading users:", error));    

    // PUT: update users -------------------------------------------------
    userTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows ------------------------------
        const selectedRows = userTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const user = row.getData();
            const userId = user.id;

            // Map institution ids back to institution objects
            const institutionsAsObjects = (user.institutionList || []).map(item => typeof item === "string"
                ? { id: item, label: institutions.find(inst => inst.id === item).label, rorId: institutions.find(inst => inst.id === item).rorId }
                : item);

            const { institutionList, ...userWithoutInstitutions } = user;

            // Create FormData object
            const formData = new FormData();
            
            formData.append("transferredUser", new Blob([JSON.stringify(userWithoutInstitutions)], { type: "application/json" }));
            formData.append("institutionList", new Blob([JSON.stringify(institutionsAsObjects)], { type: "application/json" }));
    
            axios.put(`http://localhost:8080/users/${userId}`, formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            .then(async response => {
                console.log(response.data);
                
                // Update table
                if(row !== cell.getRow()) { // skip the edited line
                    row.update({ [editedField]: newValue });
                }
            })
            .catch(error => console.error("Error updating user:", error));
        });
    });

    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    userTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = userTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const userId = row.getData().id;

            axios.delete(`http://localhost:8080/users/${userId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });            
        });
    });
}

 // Export table ---------------------------------------------------------

 document.getElementById("download-csv").addEventListener("click", function(){
    userTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    userTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    userTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    userTable.download("html", "data.html", {style:true});
});
