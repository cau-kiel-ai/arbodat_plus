let literatureTable;

async function buildLiteratureTable() {

    // GET authors --------------------------------------------------------------
    let authors = [];
    try {
        const response = await axios.get("http://localhost:8080/authors");
        authors = response.data;
    } catch (error) {
        console.error("Error loading authors:", error)
    }

    // Create year list for publication year ------------------------------------
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 0; year--) {
    years.push(year);
    }

    // Create Table -------------------------------------------------------------
    literatureTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"*title", field:"title", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"publication year", field:"publicationYear", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: years,
                    emptyValue:null
                },
                headerFilter:"list", headerFilterParams: {
                    values: years,
                    multiselect: true
                },
                headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue || headerValue.length === 0) return true;
                    if (rowValue == null) return false;
                    return headerValue.includes(rowValue);
                },
                sorter:"array", sorterParams:{
                    valueMap:"label"
                },
            },
            {title: "authors (multiple selection)", field:"authorList", headerSortTristate:true,
                mutator: function(value) {
                    // Map objects only to id
                    return Array.isArray(value) ? value.map(item => item.id? item.id : item) : [];
                },
                editor:"list", editorParams:{
                    values: [
                        ...authors.map(item => ({
                            value: item.id,
                            label: formatName(item)
                        }))
                    ],
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: authors.map(item => ({
                            value: item.id,
                            label: formatName(item)
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
                    const authorIds = cell.getValue();
                    if (Array.isArray(authorIds)) {
                        return authorIds
                                .map(id => {
                                    const author = authors.find(item => item.id === id)
                                    return formatName(author)})
                                .join(", ");
                    }
                }
            },
            {title:"doi", field:"doi", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"short citation", field:"shortCitation", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"long citation", field:"longCitation", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"abstract", field:"litAbstract", editor:"input", headerFilter:true, headerSort:false},
        ],
        initialSort: [
            {column: "title", dir: "asc"}
        ]
    });

    // GET literature and populate table --------------------------------------
    axios.get("http://localhost:8080/literature")
    .then(response => {
        literatureTable.setData(response.data);
    })
    .catch(error => console.error("Error loading literature:", error));    

    // PUT: update literature -------------------------------------------------
    literatureTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows ------------------------------
        const selectedRows = literatureTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const literature = row.getData();
            const literatureId = literature.id;

            // Map author ids back to author objects
            const authorsAsObjects = (literature.authorList || []).map(item => typeof item === "string"
                ? {
                    id: item,
                    firstName: authors.find(auth => auth.id === item).firstName,
                    middleName: authors.find(auth => auth.id === item).middleName,
                    lastName: authors.find(auth => auth.id === item).lastName,
                 }
                : item);

            const { authorList, ...literatureWithoutAuthorList } = literature;

            // Create FormData object
            const formData = new FormData();
            
            formData.append("transferredLiterature", new Blob([JSON.stringify(literatureWithoutAuthorList)], { type: "application/json" }));
            formData.append("authorList", new Blob([JSON.stringify(authorsAsObjects)], { type: "application/json" }));

            axios.put(`http://localhost:8080/literature/${literatureId}`, formData, {
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
            .catch(error => console.error("Error updating literature:", error));
        });
    });

    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    literatureTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = literatureTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const literatureId = row.getData().id;

            axios.delete(`http://localhost:8080/literature/${literatureId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting literature:', error);
            });            
        });
    });
}

// Export table ---------------------------------------------------------

document.getElementById("download-csv").addEventListener("click", function(){
    literatureTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    literatureTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    literatureTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    literatureTable.download("html", "data.html", {style:true});
});