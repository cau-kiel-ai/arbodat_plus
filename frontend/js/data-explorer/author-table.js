let authorTable;

async function buildAuthorTable() {    

    // Create Table -------------------------------------------------------------
    authorTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"first name", field:"firstName", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"middle name", field:"middleName", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"*last name", field:"lastName", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
        ],
        initialSort: [
            {column: "lastName", dir: "asc"}
        ]
    });

    // GET authors and populate table --------------------------------------
    axios.get("http://localhost:8080/authors")
    .then(response => {
        authorTable.setData(response.data);
    })
    .catch(error => console.error("Error loading authors:", error));    

    // PUT: update authors -------------------------------------------------
    authorTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows
        const selectedRows = authorTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const author = row.getData();
            const authorId = author.id;
            const payload = {
                ...author,
            };
    
            axios.put(`http://localhost:8080/authors/${authorId}`, JSON.stringify(payload), {
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
            .catch(error => console.error("Error updating author:", error));
        });
    });

    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    authorTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = authorTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const authorId = row.getData().id;

            axios.delete(`http://localhost:8080/authors/${authorId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting author:', error);
            });            
        });
    });
}

// Export table ---------------------------------------------------------

document.getElementById("download-csv").addEventListener("click", function(){
    authorTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    authorTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    authorTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    authorTable.download("html", "data.html", {style:true});
});