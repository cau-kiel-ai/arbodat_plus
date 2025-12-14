let sampleTable;

async function buildSampleTable() {

    // GET features --------------------------------------------------------------
    let features = [];
    try {
        const response = await axios.get("http://localhost:8080/features");
        features = response.data;
    } catch (error) {
        console.error("Error loading features:", error)
    }

    // GET coordinate systems ---------------------------------------------------
    await fetchDanteAttribute("coordinateSystem");

    // GET users ----------------------------------------------------------------
    let users = [];
    try {
        const response = await axios.get("http://localhost:8080/users");
        users = response.data;
    } catch (error) {
        console.error("Error loading users:", error)
    }

    // GET fractions -----------------------------------------------------------
    let fractions = [];
    try {
        const response = await axios.get("http://localhost:8080/fractions_analyzed");
        fractions = response.data;
    } catch (error) {
        console.error("Error loading fractions_analyzed:", error)
    }

    // Create year list for botanical determination year ------------------------
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 0; year--) {
    years.push(year);
    }

    // Create Table -------------------------------------------------------------
    sampleTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"*label", field:"label", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
            {title: "*feature", field:"feature.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: features.map(item => ({
                            value: item.id,
                            label: item.label
                        }))
                    ,
                },
                headerFilter:"list", headerFilterParams: {
                    values: features.map(item => ({
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
                    const feature = features.find(item => item.id === value) || null;
                    return feature?.label || "";
                }
            },
            {title:"stratum", field:"stratum", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"layer", field:"layer", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"sector", field:"sector", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"planum", field:"planum", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"depth from [cm]", field:"depthFrom", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"depth to [cm]", field:"depthTo", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            // Coordinate ---------------------------------------------------------------------------------------------
            {title:"coordinate system", field:"coordinate.coordinateSystem.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedCoordinateSystems.map(crs => ({
                            value: crs.uri,
                            label: [crs.prefLabel.en, crs.notation].filter(Boolean).join(" - ")
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedCoordinateSystems.map(crs => ({
                            value: crs.uri,
                            label: [crs.prefLabel.en, crs.notation].filter(Boolean).join(" - ")
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
                    const crs = cachedCoordinateSystems.find(crs => crs.uri === value) || null;
                    return [crs?.prefLabel.en, crs?.notation].filter(Boolean).join(" - ") || "";
                },
            },
            {title:"longitude", field:"coordinate.longitude", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"latitude", field:"coordinate.latitude", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"altitude", field:"coordinate.altitude", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"longitude WGS84", field:"coordinate.longitudeWgs84", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"latitude WGS84", field:"coordinate.latitudeWgs84", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"remarks coordinate", field:"remarksCoordinate", editor:"input", headerFilter:true, headerSortTristate:true},
            // --------------------------------------------------------------------------------------------------------
            {title: "botanical determination by (multiple selection)", field:"botanicalDeterminationBy", headerSortTristate:true,
                mutator: function(value) {
                    // Map objects only to id
                    return Array.isArray(value) ? value.map(item => item.id? item.id : item) : [];
                },
                editor:"list", editorParams:{
                    values: [
                        ...users.map(item => ({
                            value: item.id,
                            label: formatName(item)
                        }))
                    ],
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: users.map(item => ({
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
                    const userIds = cell.getValue();
                    if (Array.isArray(userIds)) {
                        return userIds
                                .map(id => {
                                    const user = users.find(item => item.id === id)
                                    return formatName(user)})
                                .join("; ");
                    }
                }
            },
            {title:"botanicalDeterminationYear", field:"botanicalDeterminationYear", headerSortTristate:true,
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
            {title: "fraction analyzed list", field:"fractionAnalyzedList", headerSortTristate:true,
                mutator: function(value) {
                    // Map objects only to id
                    return Array.isArray(value) ? value.map(item => item.id? item.id : item) : [];
                },
                headerFilter:true,
                sorter:"array", sorterParams:{
                    valueMap:"label"
                },
                headerFilterFunc: function(headerValue, rowValue) {
                    if (!headerValue) return true;
                    if (!Array.isArray(rowValue)) return false;

                    const header = headerValue.toString().toLowerCase();

                    return rowValue.some(id => {
                        const frac = fractions.find(f => f.id === id);
                        const label = formatFraction(frac).toLowerCase();
                        return label.includes(header) || id.toString().includes(header);
                    });
                },
                formatter: function(cell) {
                    const fractionIds = cell.getValue();
                    if (Array.isArray(fractionIds)) {
                        return fractionIds
                                .map(id => {
                                    const frac = fractions.find(item => item.id === id)
                                    return formatFraction(frac)})
                                .join(", ");
                    }
                }
            },
            {title:"sample type", field:"sampleType.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedSampleTypes.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedSampleTypes.map(item => ({
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
                    const sampleType = cachedSampleTypes.find(item => item.uri === value) || null;
                    return sampleType?.prefLabel.en || "";
                },
            },
            {title:"storage find", field:"sampleStorage", hozAlign:"center", headerSortTristate:true,
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
            {title:"microremain sample", field:"microRemain", hozAlign:"center", headerSortTristate:true,
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
            {title:"seeds and fruits", field:"seedsAndFruits.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedSampleInvestigated.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedSampleInvestigated.map(item => ({
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
                    const seedsAndFruits = cachedSampleInvestigated.find(item => item.uri === value) || null;
                    return seedsAndFruits?.prefLabel.en || "";
                },
            },
            {title:"wood subfossile", field:"woodSubfossile.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedSampleInvestigated.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedSampleInvestigated.map(item => ({
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
                    const woodSubfossile = cachedSampleInvestigated.find(item => item.uri === value) || null;
                    return woodSubfossile?.prefLabel.en || "";
                },
            },
            {title:"charcoal investigated", field:"charcoalInvestigated.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedSampleInvestigated.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedSampleInvestigated.map(item => ({
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
                    const charcoalInvestigated = cachedSampleInvestigated.find(item => item.uri === value) || null;
                    return charcoalInvestigated?.prefLabel.en || "";
                },
            },
            {title:"charcoal total weight [g]", field:"totalWeight", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"charcoal undetermined weight [g]", field:"weightUndetermined", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"sample volume [l]", field:"sampleVolume", headerFilter:"input", headerSortTristate:true,
                editor:"number", editorParams:{
                    min:0,
                    step:0.1,
                },
            },
            {title:"volume determination", field:"volumeDetermination", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: ["dry", "wet"],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: ["dry", "wet"],
                },
            },
            {title:"chronozone", field:"chronozone.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...cachedChronozones.map(item => ({
                            value: item.uri,
                            label: item.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedChronozones.map(item => ({
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
                    const chronozone = cachedChronozones.find(item => item.uri === value) || null;
                    return chronozone?.prefLabel.en || "";
                },
            },
            {title:"archaeological dating", field:"archaeologicalDating", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"cultural group", field:"culturalGroup", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"remarks", field:"remarksSample", editor:"input", headerFilter:true, headerSort:false},
        ],
        initialSort: [
            {column: "label", dir: "asc"}
        ]
    });

    // GET samples and populate table --------------------------------------
    axios.get("http://localhost:8080/samples")
    .then(response => {
        sampleTable.setData(response.data);
    })
    .catch(error => console.error("Error loading samples:", error));

    // PUT: update samples -------------------------------------------------
    sampleTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows
        const selectedRows = sampleTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const sample = row.getData();
            const sampleId = sample.id;

            // Map ids back to objects
            const crs = cachedCoordinateSystems.find(crs => crs.uri === sample.coordinate.coordinateSystem.id);
            const coordinateSystemAsObject = crs
            ? {
                id: crs.uri,
                label: [crs.prefLabel?.en, crs.notation].filter(Boolean).join(" - ")
              }
            : null;
            const botanicalDeterminationByAsObjects = (sample.botanicalDeterminationBy || []).map(item => typeof item === "string"
                ? { id: item }
                : item);
            const fractionsAsObjects = (sample.fractionAnalyzedList || []).map(item => typeof item === "string"
            ? { id: item,
                fractionAnalyzed: fractions.find(frac => frac.id === item).fractionAnalyzed,
                orgOrMin: fractions.find(frac => frac.id === item).orgOrMin,
                sieveSize: fractions.find(frac => frac.id === item).sieveSize,
                standardMultiplier: fractions.find(frac => frac.id === item).standardMultiplier,
             }
            : item);
            // const sampleTypeAsObject = typeof sample.sampleType  === "string"
            // ? { id: sample.sampleType }
            // : sample.sampleType;
            // const seedsAndFruitsAsObject = typeof sample.seedsAndFruits  === "string"
            // ? { id: sample.seedsAndFruits }
            // : sample.seedsAndFruits;
            // const woodSubfossileAsObject = typeof sample.woodSubfossile  === "string"
            // ? { id: sample.woodSubfossile }
            // : sample.woodSubfossile;
            // const charcoalInvestigatedAsObject = typeof sample.charcoalInvestigated  === "string"
            // ? { id: sample.charcoalInvestigated }
            // : sample.charcoalInvestigated;
            // const chronozoneAsObject = typeof sample.chronozone  === "string"
            // ? { id: sample.chronozone }
            // : sample.chronozone;

            const payload = {
                ...sample,
                coordinate: {
                    coordinateSystem: coordinateSystemAsObject,
                    longitude: sample.coordinate.longitude,
                    longitudeWgs84: sample.coordinate.longitudeWgs84,
                    latitude: sample.coordinate.latitude,
                    latitudeWgs84: sample.coordinate.latitudeWgs84,
                    altitude: sample.coordinate.altitude,
                },
                botanicalDeterminationBy: botanicalDeterminationByAsObjects,
                fractionAnalyzedList: fractionsAsObjects,
                // sampleType: sampleTypeAsObject,
                // seedsAndFruits: seedsAndFruitsAsObject,
                // woodSubfossile: woodSubfossileAsObject,
                // charcoalInvestigated: charcoalInvestigatedAsObject,
                // chronozone: chronozoneAsObject,
            };

            console.log(payload);
    
            axios.put(`http://localhost:8080/samples/${sampleId}`, JSON.stringify(payload), {
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
            .catch(error => console.error("Error updating sample:", error));
        });
    });

    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    sampleTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = sampleTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const sampleId = row.getData().id;

            axios.delete(`http://localhost:8080/samples/${sampleId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error('Error deleting sample:', error);
            });            
        });
    });
}

 // Export table ---------------------------------------------------------

 document.getElementById("download-csv").addEventListener("click", function(){
    sampleTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    sampleTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    sampleTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    sampleTable.download("html", "data.html", {style:true});
});