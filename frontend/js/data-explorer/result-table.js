let resultTable;

async function buildResultTable() {

    // GET samples --------------------------------------------------------------
    let samples = [];
    try {
        const response = await axios.get("http://localhost:8080/samples");
        samples = response.data;
    } catch (error) {
        console.error("Error loading samples:", error)
    }

    // GET absolute datings -----------------------------------------------------
    let datings = [];
    try {
        const response = await axios.get("http://localhost:8080/absolute_datings");
        datings = response.data;
    } catch (error) {
        console.error("Error loading absolute datings:", error)
    }

    // Fetch taxCodes
    const ArboDat_PCODE_URI = "http://uri.gbv.de/terminology/arbodat_taxonomy/6ac2cb7f-fed7-445d-bd8c-4c8cadec2303"
    await fetchDanteTaxCodes(ArboDat_PCODE_URI);

    // Create Table -------------------------------------------------------------
    resultTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title: "*sample", field:"sample.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: samples.map(item => ({
                            value: item.id,
                            label: item.label
                        })),
                },
                headerFilter:"list", headerFilterParams: {
                    values: samples.map(item => ({
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
                    const sample = samples.find(item => item.id === value) || null;
                    return sample?.label || "";
                }
            },
            {title: "dating list (multiple selection)", field:"absoluteDatingList", headerSortTristate:true,
                mutator: function(value) {
                    // Map objects only to id
                    return Array.isArray(value) ? value.map(item => item.id? item.id : item) : [];
                },
                editor:"list", editorParams:{
                    values: datings.map(item => ({
                            value: item.id,
                            label: formatDatings(item)
                        })),
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: datings.map(item => ({
                            value: item.id,
                            label: formatDatings(item)
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
                    const datingsIds = cell.getValue();
                    if (Array.isArray(datingsIds)) {
                        return datingsIds
                                .map(id => {
                                    const dating = datings.find(item => item.id === id)
                                    return formatDatings(dating)})
                                .join(", ");
                    }
                }
            },
            {title:"entry date", field:"entryDate", editor:"date", headerSortTristate:true,
                headerFilter:"input", headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue) return true;
                    if (!rowValue) return false;

                    const dateStr = typeof rowValue === "string"
                        ? rowValue.split("T")[0]
                        : rowValue.toISOString().split("T")[0];

                    const header = headerValue.trim();

                    // 1) yyyy
                    if (/^\d{4}$/.test(header)) {
                        return dateStr.startsWith(header);
                    }

                    // 2) yyyy-mm
                    if (/^\d{4}-\d{2}$/.test(header)) {
                        return dateStr.startsWith(header);
                    }

                    // 3) yyyy-mm-dd
                    return dateStr === header;
                },
                formatter: function(cell) {
                    const value = cell.getValue();
                    if (!value) return "";

                    if (typeof value === "string") {
                        return value.split("T")[0];
                    }
                    
                    if (value instanceof Date) {
                        return value.toISOString().split("T")[0];
                    }

                    return "";
                }
            },
            {title:"*tax code", field:"taxCode.id", headerSortTristate:true,
                editor:"list", editorParams: function(cell) {
                    const rowData = cell.getRow().getData();

                    const sample = samples.find(s => s.id === rowData.sample?.id);
                    if (!sample) {
                        return{ values: [], emptyValue: null };
                    }

                    const taxonomyUri = sample.feature.site.taxonomy?.id;
                    const taxCodes = cachedTaxCodesForURI.get(taxonomyUri) || [];

                    return {
                        values: taxCodes.map(item => ({
                            value: item.uri,
                            label: [item.notation, item.prefLabel?.la].filter(Boolean).join(", "),
                        })),
                        emptyValue: null
                    };
                },
                headerFilter:"input",
                headerFilterFunc: function(headerValue, rowValue, rowData) {
                    if (!headerValue) return true;
                    if (!rowValue) return false;                    

                    const sample = samples.find(s => s.id === rowData.sample?.id);
                    if (!sample) return false;

                    const taxonomyUri = sample.feature.site.taxonomy?.id;
                    const taxCodes = cachedTaxCodesForURI.get(taxonomyUri) || [];

                    const entry = taxCodes.find(item => item.uri === rowValue);
                    if (!entry) return false;
                    const label = [entry.notation, entry.prefLabel?.la].filter(Boolean).join(", ").toLowerCase();

                    const header = headerValue.toString().toLowerCase();

                    return label.includes(header);
                },
                formatter: function(cell) {
                    const rowData = cell.getRow().getData();

                    const sample = samples.find(s => s.id === rowData.sample?.id);
                    if (!sample) {
                        return { values: [], emptyValue: null };
                    }

                    const taxonomyUri = sample.feature.site.taxonomy?.id;
                    const taxCodes = cachedTaxCodesForURI.get(taxonomyUri) || [];
                    
                    const value = cell.getValue();
                    const entry = taxCodes.find(item => item.uri === value);
                    return entry ? [entry.notation, entry.prefLabel?.la].filter(Boolean).join(", ") : "";
                },
            },
            {title:"*organic / minerals", field:"orgOrMin", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: "org", label: "ORG" },
                        { value: "min", label: "MIN" }
                    ]
                },
                headerFilter: "list",
                headerFilterParams: {
                    values: [
                        { value: "org", label: "ORG" },
                        { value: "min", label: "MIN" }
                    ]
                },
                formatter: function(cell) {
                    const value = cell.getValue();
                    if (value === "org") {
                        return "ORG";
                    } else if (value === "min") {
                        return "MIN";
                    } else {
                        return "";
                    }
                },
            },
            {title:"*sieve size", field:"sieveSize", validator: ["required"], headerFilter:"input", headerSortTristate:true, 
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"*fraction analyzed", field:"fractionAnalyzed", headerSortTristate:true,
                editor:"list", editorParams:{ values: [ "yes", "no", "partly"] },
                headerFilter: "list", headerFilterParams:
                    { values: [ "yes", "no", "partly"], multiselect:true },
                headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue || (Array.isArray(headerValue) && headerValue.length === 0)) {
                        return true;
                    }
                    return headerValue.includes(rowValue);
                },
            },
            {title:"*classification confer", field:"classificationConfer.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: cachedClassificationConfers.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))       
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedClassificationConfers.map(item => ({
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
                    const item = cachedClassificationConfers.find(item => item.uri === value) || null;
                    return item?.prefLabel.en || "";
                },
            },
            {title:"*rType", field:"restType.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: cachedRestTypes.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))       
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedRestTypes.map(item => ({
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
                    const item = cachedRestTypes.find(item => item.uri === value) || null;
                    return item?.prefLabel.en || "";
                },
            },
            {title:"*state of preservation", field:"stateOfPreservation.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: cachedStateOfPreservation.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))       
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedStateOfPreservation.map(item => ({
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
                    const item = cachedStateOfPreservation.find(item => item.uri === value) || null;
                    return item?.prefLabel.en || "";
                },
            },
            {title:"rCount", field:"restCount", headerFilter:"input", headerSortTristate:true,
                editor:"number", validator: ["integer"], editorParams:{
                    min:0,
                    step:1,
                },
            },
            {title:"rFragment", field:"restFragment", headerFilter:"input", headerSortTristate:true,
                editor:"number", validator: ["integer"], editorParams:{
                    min:0,
                    step:1,
                },
            },
            {title:"rWeight [g]", field:"restWeight", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"estimation", field:"estimation", hozAlign:"center", headerSortTristate:true,
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
            {title:"multiplier", field:"multiplier", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"remarks", field:"remarksTaxonomy", editor:"input", headerFilter:true, headerSort:false},
        ],
    });

    // GET results and populate table ----------------------------------
    axios.get("http://localhost:8080/results")
    .then(response => {
        resultTable.setData(response.data);
    })
    .catch(error => console.error("Error loading results:", error));

    // PUT: update results ---------------------------------------------
    resultTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows
        const selectedRows = resultTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const result = row.getData();
            const resultId = result.id;

            // Map ids back to objects
            const datingsAsObjects = (result.absoluteDatingList || []).map(item => typeof item === "string"
                ? { id: item }
                : item);

            const payload = {
                ...result,
                absoluteDatingList: datingsAsObjects,
            };
    
            axios.put(`http://localhost:8080/results/${resultId}`, JSON.stringify(payload), {
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
            .catch(error => console.error("Error updating results:", error));
        });
    });

    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    resultTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = resultTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const resultId = row.getData().id;

            axios.delete(`http://localhost:8080/results/${resultId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting results:', error);
            });            
        });
    });
}

// Export table ---------------------------------------------------------

document.getElementById("download-csv").addEventListener("click", function(){
    resultTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    resultTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    resultTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    resultTable.download("html", "data.html", {style:true});
});