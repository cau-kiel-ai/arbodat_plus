let institutionTable;

async function buildInstitutionTable() {    

    // Create Table -------------------------------------------------------------
    institutionTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"*label", field:"label", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"ror id", field:"rorId", editor:"input", headerFilter:true, headerSortTristate:true},
        ],
        initialSort: [
            {column: "label", dir: "asc"}
        ]
    });

    // GET institutions and populate table --------------------------------------
    axios.get("http://localhost:8080/institutions")
    .then(response => {
        institutionTable.setData(response.data);
    })
    .catch(error => console.error("Error loading institutions:", error));    

    // PUT: update institutions -------------------------------------------------
    institutionTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows ------------------------------
        const selectedRows = institutionTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const institution = row.getData();
            const institutionId = institution.id;
            const payload = {
                ...institution,
            };
    
            axios.put(`http://localhost:8080/institutions/${institutionId}`, JSON.stringify(payload), {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
            .then(async response => {
                console.log(response.data);
                
                // Update table
                if(row !== cell.getRow()) { // skip the edited line
                    row.update({ [editedField]: newValue });
                }
            })
            .catch(error => console.error("Error updating institution:", error));
        });
    });

    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    institutionTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = institutionTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const institutionId = row.getData().id;

            axios.delete(`http://localhost:8080/institutions/${institutionId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting institution:', error);
            });            
        });
    });
}

 // Export table ---------------------------------------------------------

document.getElementById("download-csv").addEventListener("click", function(){
    institutionTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    institutionTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    institutionTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    institutionTable.download("html", "data.html", {style:true});
});
