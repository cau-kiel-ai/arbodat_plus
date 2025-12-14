let datingTable;

async function buildDatingTable() {

    // GET samples --------------------------------------------------------------
    let samples = [];
    try {
        const response = await axios.get("http://localhost:8080/samples");
        samples = response.data;
    } catch (error) {
        console.error("Error loading samples:", error)
    }

    // GET literature -----------------------------------------------------------
    let literature = [];
    try {
        const response = await axios.get("http://localhost:8080/literature");
        literature = response.data;
    } catch (error) {
        console.error("Error loading literature:", error)
    }

    // GET materials ------------------------------------------------------------
    await fetchDanteAttribute("material");

    // Create Table -------------------------------------------------------------
    datingTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"*subsample", field:"subSample", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
            {title: "*sample", field:"sample.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: samples.map(item => ({
                            value: item.id,
                            label: item.label
                        }))
                    ,
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
            {title: "literature list (multiple selection)", field:"literatureList", headerSortTristate:true,
                mutator: function(value) {
                    // Map objects only to id
                    return Array.isArray(value) ? value.map(item => item.id? item.id : item) : [];
                },
                editor:"list", editorParams:{
                    values: [
                        ...literature.map(item => ({
                            value: item.id,
                            label: formatLiterature(item)
                        }))
                    ],
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: literature.map(item => ({
                            value: item.id,
                            label: formatLiterature(item)
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
                    const literatureIds = cell.getValue();
                    if (Array.isArray(literatureIds)) {
                        return literatureIds
                                .map(id => {
                                    const lit = literature.find(item => item.id === id)
                                    return formatLiterature(lit)})
                                .join(", ");
                    }
                }
            },
            {title:"material", field:"material.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedMaterials.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedMaterials.map(item => ({
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
                    const material = cachedMaterials.find(item => item.uri === value) || null;
                    return material?.prefLabel.en || "";
                },
            },
            {title:"remarks", field:"remarks", editor:"input", headerFilter:true, headerSort:false},
            {title:"dating method", field:"datingMethod.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedDatingMethods.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedDatingMethods.map(item => ({
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
                    const datingMethod = cachedDatingMethods.find(item => item.uri === value) || null;
                    return datingMethod?.prefLabel.en || "";
                },
            },
            {title:"dendrochronological dating", field:"dendrochronologicalDating", headerSortTristate:true,
                headerFilter:true,
                headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue) return true;
                    if (!rowValue) return false;

                    const header = headerValue.toString().toLowerCase();
                    const label = formatDendroDating(rowValue).toLowerCase();

                    return label.includes(header);
                },
                formatter: function(cell){
                    const value = cell.getValue();
                    return value ? formatDendroDating(value) : '';
                },
            },
            {title:"C14 dating", field:"c14Dating", headerSortTristate:true,
                headerFilter:true,
                headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue) return true;
                    if (!rowValue) return false;

                    const header = headerValue.toString().toLowerCase();
                    const label = formatC14Dating(rowValue).toLowerCase();

                    return label.includes(header);
                },
                formatter: function(cell){
                    const value = cell.getValue();
                    return value ? formatC14Dating(value) : '';
                },
            },
            {title:"other dating", field:"otherDating", headerSortTristate:true,
                headerFilter:true,
                headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue) return true;
                    if (!rowValue) return false;

                    const header = headerValue.toString().toLowerCase();
                    const label = formatOtherDating(rowValue).toLowerCase();

                    return label.includes(header);
                },
                formatter: function(cell){
                    const value = cell.getValue();
                    return value ? formatOtherDating(value) : '';
                },
            },
        ],
        initialSort: [
            {column: "subSample", dir: "asc"}
        ]
    });

    // GET absolute datings and populate table ----------------------------------
    axios.get("http://localhost:8080/absolute_datings")
    .then(response => {
        datingTable.setData(response.data);
    })
    .catch(error => console.error("Error loading absolute datings:", error));

    // PUT: update absolute datings ---------------------------------------------
    datingTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows
        const selectedRows = datingTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const absolute_dating = row.getData();
            const absoluteDatingId = absolute_dating.id;

            // Map ids back to objects
            const literatureAsObjects = (absolute_dating.literatureList || []).map(item => typeof item === "string"
                ? { id: item,
                    doi: literature.find(lit => lit.id === item).doi,
                    publicationYear: literature.find(lit => lit.id === item).publicationYear,
                    title: literature.find(lit => lit.id === item).title,
                    shortCitation: literature.find(lit => lit.id === item).shortCitation,
                    longCitation: literature.find(lit => lit.id === item).longCitation,
                    litAbstract: literature.find(lit => lit.id === item).litAbstract,
                  }
                : item);
            const datingMethodAsObjects = {
                id: absolute_dating.datingMethod.id,
                label: cachedDatingMethods.find(item => item.uri === absolute_dating.datingMethod.id)?.prefLabel.en || null,
            };

            const payload = {
                ...absolute_dating,
                literatureList: literatureAsObjects,
                datingMethod: datingMethodAsObjects,
            };
    
            axios.put(`http://localhost:8080/absolute_datings/${absoluteDatingId}`, JSON.stringify(payload), {
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
            .catch(error => console.error("Error updating absolute datings:", error));
        });
    });

    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    datingTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = datingTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const absoluteDatingId = row.getData().id;

            axios.delete(`http://localhost:8080/absolute_datings/${absoluteDatingId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting absolute datings:', error);
            });            
        });
    });
}

// Export table ---------------------------------------------------------

document.getElementById("download-csv").addEventListener("click", function(){
    datingTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    datingTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    datingTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    datingTable.download("html", "data.html", {style:true});
});