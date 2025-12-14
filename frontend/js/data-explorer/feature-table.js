let featureTable;

async function buildFeatureTable() {

    // GET sites ----------------------------------------------------------------
    let sites = [];
    try {
        const response = await axios.get("http://localhost:8080/sites");
        sites = response.data;
    } catch (error) {
        console.error("Error loading sites:", error)
    }

    // Create year list for excavation yerars -----------------------------------
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 0; year--) {
    years.push(year);
    }

    // Create Table -------------------------------------------------------------
    featureTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"*label", field:"label", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
            {title: "*site", field:"site.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        ...sites.map(item => ({
                            value: item.id,
                            label: item.label
                        }))
                    ],
                    emptyValue:null
                },
                headerFilter:"list", headerFilterParams: {
                    values: sites.map(item => ({
                            value: item.id,
                            label: item.label
                    })),
                    multiselect: true
                },
                headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue || (Array.isArray(headerValue) && headerValue.length === 0)) {
                        return true;
                    }
                    return headerValue.includes(rowValue);
                },
                formatter: function(cell) {
                    const value = cell.getValue();
                    const site = sites.find(item => item.id === value) || null;
                    return site?.label || "";
                }
            },
            {title:"excavation area", field:"excavationArea", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"feature condition", field:"featureCondition", hozAlign:"center", headerSortTristate:true,
                headerFilter: function(cell, onRendered, success, cancel){
                    let state = "all";
                    const box = document.createElement("input");
                    box.type = "checkbox";
                    box.indeterminate = true;

                    box.addEventListener("click", function(e){
                        if (state === "all") {
                            box.indeterminate = false;
                            box.checked = true;
                            state = "true";
                        } else if (state === "true") {
                            box.indeterminate = false;
                            box.checked = false;
                            state = "false";
                        } else {  // state === "false"
                            box.indeterminate = true;
                            box.checked = false;
                            state = "all";
                        }
                        success(state);
                    });

                    return box;
                },
                headerFilterFunc: function(headerValue, rowValue){
                    if (headerValue === "all") return true;
                    if (headerValue === "true") return rowValue === true;
                    if (headerValue === "false") return rowValue === false;
                },
                formatter: function(cell){
                    var value = cell.getValue();
                    return `<input type="checkbox" ${value ? "checked" : ""}>`;
                },
                cellClick: function(e, cell){
                    let checkbox = e.target;
                    if (checkbox.tagName === "INPUT") {
                        let newValue = checkbox.checked;
                        cell.setValue(newValue);
                    }
                }
            },
            {title:"preservation condition", field:"preservationCondition.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedPreservationConditions.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedPreservationConditions.map(item => ({
                        value: item.uri,
                        label: item.prefLabel.en
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
                    const preservationCondition = cachedPreservationConditions.find(item => item.uri === value) || null;
                    return preservationCondition?.prefLabel.en || "";
                },
            },
            {title:"feature type", field:"featureType.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedFeatureTypes.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedFeatureTypes.map(item => ({
                        value: item.uri,
                        label: item.prefLabel.en
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
                    const featureType = cachedFeatureTypes.find(item => item.uri === value) || null;
                    return featureType?.prefLabel.en || "";
                },
            },
            {title: "excavationYears", field:"excavationYears", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: years,
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: years,
                    multiselect: true
                },
                headerFilterFunc: function(headerValue, rowValue){
                    return headerValue.every(val => rowValue.includes(val));
                },
                sorter:"array", sorterParams:{
                    valueMap:"label"
                },
            },
            {title:"building context", field:"buildingContext", hozAlign:"center", headerSortTristate:true,
                headerFilter: function(cell, onRendered, success, cancel){
                    let state = "all";
                    const box = document.createElement("input");
                    box.type = "checkbox";
                    box.indeterminate = true;

                    box.addEventListener("click", function(e){
                        if (state === "all") {
                            box.indeterminate = false;
                            box.checked = true;
                            state = "true";
                        } else if (state === "true") {
                            box.indeterminate = false;
                            box.checked = false;
                            state = "false";
                        } else {  // state === "false"
                            box.indeterminate = true;
                            box.checked = false;
                            state = "all";
                        }
                        success(state);
                    });

                    return box;
                },
                headerFilterFunc: function(headerValue, rowValue){
                    if (headerValue === "all") return true;
                    if (headerValue === "true") return rowValue === true;
                    if (headerValue === "false") return rowValue === false;
                },
                formatter: function(cell){
                    var value = cell.getValue();
                    return `<input type="checkbox" ${value ? "checked" : ""}>`;
                },
                cellClick: function(e, cell){
                    let checkbox = e.target;
                    if (checkbox.tagName === "INPUT") {
                        let newValue = checkbox.checked;
                        cell.setValue(newValue);
                    }
                }
            },
            {title:"remarks", field:"remarksFeature", editor:"input", headerFilter:true, headerSort:false},
        ],
        initialSort: [
            {column: "label", dir: "asc"}
        ]
    });

    // GET features and populate table --------------------------------------
    axios.get("http://localhost:8080/features")
    .then(response => {
        featureTable.setData(response.data);
    })
    .catch(error => console.error("Error loading features:", error));    

    // PUT: update features -------------------------------------------------
    featureTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows
        const selectedRows = featureTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const feature = row.getData();
            const featureId = feature.id;

            const payload = {
                ...feature,
            };
    
            axios.put(`http://localhost:8080/features/${featureId}`, JSON.stringify(payload), {
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
            .catch(error => console.error("Error updating feature:", error));
        });
    });

    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    featureTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = featureTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const featureId = row.getData().id;

            axios.delete(`http://localhost:8080/features/${featureId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting feature:', error);
            });            
        });
    });
}

 // Export table ---------------------------------------------------------

 document.getElementById("download-csv").addEventListener("click", function(){
    featureTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    featureTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    featureTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    featureTable.download("html", "data.html", {style:true});
});