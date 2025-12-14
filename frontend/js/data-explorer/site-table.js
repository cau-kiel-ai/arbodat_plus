let siteTable;

async function buildSiteTable() {

    // GET research projects ----------------------------------------------------
    let researchProjects = [];
    try {
        const response = await axios.get("http://localhost:8080/research_projects");
        researchProjects = response.data;
    } catch (error) {
        console.error("Error loading research projects:", error)
    }
    
    // GET literature -----------------------------------------------------------
    let literature = [];
    try {
        const response = await axios.get("http://localhost:8080/literature");
        literature = response.data;
    } catch (error) {
        console.error("Error loading literature:", error)
    }

    // GET site types -----------------------------------------------------------
    let siteTypes = [];
    try {
        const response = await axios.get("http://localhost:8080/dante_attributes/site_type");
        siteTypes = response.data;
    } catch (error) {
        console.error("Error loading site types:", error)
    }

    // GET natural units --------------------------------------------------------
    let naturalUnits = [];
    try {
        const response = await axios.get("http://localhost:8080/dante_attributes/natural_unit");
        naturalUnits = response.data;
    } catch (error) {
        console.error("Error loading natural units:", error)
    }

    // GET institutions ---------------------------------------------------------
    let institutions = [];
    try {
        const response = await axios.get("http://localhost:8080/institutions");
        institutions = response.data;
    } catch (error) {
        console.error("Error loading institutions:", error)
    }

    // GET users ----------------------------------------------------------------
    let users = [];
    try {
        const response = await axios.get("http://localhost:8080/users");
        users = response.data;
    } catch (error) {
        console.error("Error loading users:", error)
    }

    // GET coordinate systems ---------------------------------------------------
    await fetchDanteAttribute("coordinateSystem");

    // Create Table -------------------------------------------------------------
    siteTable = new Tabulator("#table", {
        // height:200, // set height of table (in CSS or here), this enables the Virtual DOM and
        // improves render speed dramatically (can be any valid css height value)
        // layout:"fitColumns",
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
                rowRange:"active" //only toggle the values of the active filtered rows
            }, hozAlign:"center", headerSort:false},
            {title:"id", field:"id", headerFilter:true, headerSort:false},
            {title:"*label", field:"label", validator: ["required"], editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"label abbreviation", field:"labelAbbreviation", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"activity number", field:"activityNumber", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"site number", field:"siteNumber", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"research project list (multiple selection)", field: "researchProjectList", headerSortTristate:true,
                mutator: function(value) {
                    // Map objects only to ids
                    return Array.isArray(value) ? value.map(item => item.id? item.id : item) : [];
                },
                editor:"list", editorParams:{
                    values: researchProjects.map(item => ({                    
                        value: item.id,
                        label: item.projectName
                    })),
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: researchProjects.map(item => ({
                        value: item.id,
                        label: item.projectName
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
                    const rpIds = cell.getValue();                
                    if (Array.isArray(rpIds)) {
                        return rpIds
                                .map(id => {
                                    const rp = researchProjects.find(rp => rp.id === id)
                                    return rp?.projectName;})
                                .join(", ");
                    }
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
            {title:"taxonomy", field:"taxonomy.id", headerSort:false,
                editor:"list", editorParams:{
                    values: [ 
                        { value: null, label: "none" },
                        ...cachedTaxonomies.map(taxonomy => ({
                            value: taxonomy.uri,
                            label: taxonomy.prefLabel.en
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: cachedTaxonomies.map(taxonomy => ({
                        value: taxonomy.uri,
                        label: taxonomy.prefLabel.en
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
                    const taxonomy = cachedTaxonomies.find(taxonomy => taxonomy.uri === value) || null;
                    return taxonomy?.prefLabel.en || "";
                },
            },
            {title: "site types (multiple selection)", field: "siteTypeList", headerSortTristate:true,
                mutator: function(value) {
                    // Map site type objects only to site type id
                    return Array.isArray(value) ? value.map(siteType => siteType.id? siteType.id : siteType) : [];
                },
                editor:"list", editorParams:{
                    values: [
                        ...siteTypes.map(siteType => ({
                            value: siteType.id,
                            label: siteType.label
                        }))
                    ],
                    autocomplete:false,
                    multiselect:true,
                    emptyValue:[]
                },
                headerFilter:"list", headerFilterParams: {
                    values: [
                        ...siteTypes.map(siteType => ({
                            value: siteType.id,
                            label: siteType.label
                        }))
                    ],
                    multiselect: true
                },
                headerFilterFunc: function(headerValue, rowValue){
                    return headerValue.every(val => rowValue.includes(val));
                },
                sorter:"array", sorterParams:{
                    valueMap:"label"
                },
                formatter: function(cell) {
                    const siteTypeIds = cell.getValue();                
                    if (Array.isArray(siteTypeIds)) {
                        return siteTypeIds
                                .map(id => {
                                    const siteType = siteTypes.find(siteType => siteType.id === id)
                                    return siteType?.label;})
                                .join(", ");
                    }
                }
            },
            {title:"site type uncertain", field:"siteTypeUncertain", hozAlign:"center", headerSortTristate:true,
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
            {title:"natural unit", field:"naturalUnit.id", headerSortTristate:true,
                editor:"list", editorParams:{
                    values: [
                        { value: null, label: "none" },
                        ...naturalUnits.map(naturalUnit => ({
                            value: naturalUnit.id,
                            label: naturalUnit.label + (naturalUnit.naturalMainGroup ? ` (${naturalUnit.naturalMainGroup})` : "")
                        }))
                    ],
                    emptyValue:null             
                },
                headerFilter:true, headerFilterParams: {
                    values: naturalUnits.map(naturalUnit => ({
                        value: naturalUnit.id,
                        label: naturalUnit.label + (naturalUnit.naturalMainGroup ? ` (${naturalUnit.naturalMainGroup})` : "")
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
                    const naturalUnit = naturalUnits.find(naturalUnit => naturalUnit.id === value) || null;
                    return naturalUnit?.label || "";
                },
            },
            {title:"site condition undisturbed", field:"undisturbed", hozAlign:"center", headerSortTristate:true,
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
            {title: "institution list (multiple selection)", field:"institutionList", headerSortTristate:true,
                mutator: function(value) {
                    // Map objects only to id
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
            {title: "site directors (multiple selection)", field:"siteDirectors", headerSortTristate:true,
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
            {title: "archaeologists (multiple selection)", field:"archaeologists", headerSortTristate:true,
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
            {title: "botanists (multiple selection)", field:"botanists", headerSortTristate:true,
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
            {title:"remarks", field:"remarksSite", editor:"input", headerFilter:true, headerSort:false},
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
            // Address ------------------------------------------------------------------------------------------------
            {title:"country", field:"address.country", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"county", field:"address.county", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"district", field:"address.district", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"parish", field:"address.parish", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"street or place", field:"address.street_or_place", editor:"input", headerFilter:true, headerSortTristate:true},
            {title:"town", field:"address.town", editor:"input", headerFilter:true, headerSortTristate:true},
        ],
        initialSort: [
            {column: "label", dir: "asc"}
        ]
    });


    // GET sites and populate table ---------------------------------
    axios.get("http://localhost:8080/sites")
    .then(response => {
        siteTable.setData(response.data);
    })
    .catch(error => console.error("Error loading sites:", error));
    

    // PUT: update site ---------------------------------------------
    siteTable.on("cellEdited", async function(cell){

        const editedField = cell.getField();
        const newValue = cell.getValue();

        // Update all selected rows ------------------------------
        const selectedRows = siteTable.getSelectedRows();
        const editedRow = cell.getRow();
        if (!selectedRows.includes(editedRow)) {
            selectedRows.push(editedRow);
        }
        selectedRows.forEach(row => {
            
            // Create payload
            const site = row.getData();
            const siteId = site.id;
            // Map ids back to objects
            const researchProjectsAsObjects = (site.researchProjectList || []).map(item => typeof item === "string"
                ? { id: item }
                : item);
            const literatureAsObjects = (site.literatureList || []).map(item => typeof item === "string"
                ? { id: item,
                    doi: literature.find(lit => lit.id === item).doi,
                    publicationYear: literature.find(lit => lit.id === item).publicationYear,
                    title: literature.find(lit => lit.id === item).title,
                    shortCitation: literature.find(lit => lit.id === item).shortCitation,
                    longCitation: literature.find(lit => lit.id === item).longCitation,
                    litAbstract: literature.find(lit => lit.id === item).litAbstract,
                  }
                : item);
            const siteTypeListAsObjects = (site.siteTypeList || []).map(siteType => typeof siteType === "string"
                ? { id: siteType }
                : siteType);
            const naturalUnitAsObject = typeof site.naturalUnit  === "string"
            ? { id: site.naturalUnit }
            : site.naturalUnit;
            const institutionsAsObjects = (site.institutionList || []).map(item => typeof item === "string"
                ? { id: item,
                    label: institutions.find(inst => inst.id === item).label,
                    rorId: institutions.find(inst => inst.id === item).rorId
                  }
                : item);
            const siteDirectorsAsObjects = (site.siteDirectors || []).map(item => typeof item === "string"
                ? { id: item }
                : item);
            const archaeologistsAsObjects = (site.archaeologists || []).map(item => typeof item === "string"
                ? { id: item }
                : item);
            const botanistsAsObjects = (site.botanists || []).map(item => typeof item === "string"
                ? { id: item }
                : item);
            const crs = cachedCoordinateSystems.find(crs => crs.uri === site.coordinate.coordinateSystem.id);
            const coordinateSystemAsObject = crs
            ? {
                id: crs.uri,
                label: [crs.prefLabel?.en, crs.notation].filter(Boolean).join(" - ")
              }
            : null;

            const payload = {
                ...site,
                researchProjectList: researchProjectsAsObjects,
                literatureList: literatureAsObjects,
                siteTypeList: siteTypeListAsObjects,
                naturalUnit: naturalUnitAsObject,
                institutionList: institutionsAsObjects,
                siteDirectors: siteDirectorsAsObjects,
                archaeologists: archaeologistsAsObjects,
                botanists: botanistsAsObjects,
                coordinate: {
                    coordinateSystem: coordinateSystemAsObject,
                    longitude: site.coordinate.longitude,
                    longitudeWgs84: site.coordinate.longitudeWgs84,
                    latitude: site.coordinate.latitude,
                    latitudeWgs84: site.coordinate.latitudeWgs84,
                    altitude: site.coordinate.altitude,
                },
                address: {
                    country: site.address.country,
                    county: site.address.county,
                    district: site.address.district,
                    parish: site.address.parish,
                    street_or_place: site.address.street_or_place,
                    town: site.address.town,
                },
            };
    
            axios.put(`http://localhost:8080/sites/${siteId}`, JSON.stringify(payload), {
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
            .catch(error => console.error(`Error updating site {siteId}:`, error));
        });
    });


    // Delete rows --------------------------------------------------------------
    const deleteButton = document.getElementById("deleteRows-button");
    
    // Only show deleteButton if at least one row is selected
    siteTable.on("rowSelectionChanged", function(rows){
        deleteButton.classList.toggle("hidden", rows.length === 0);
    });

    deleteButton.addEventListener("click", function() {
        
        const selectedRows = siteTable.getSelectedRows();
        selectedRows.forEach(row => {
            // Get id
            const siteId = row.getData().id;

            axios.delete(`http://localhost:8080/sites/${siteId}`)
            .then(response => {
                console.log(response.data);
                row.delete();
            })
            .catch(error => {
                console.error(`Error deleting site ${siteId}:`, error);
            });            
        });
    });
}


 // Export table ---------------------------------------------------------

 document.getElementById("download-csv").addEventListener("click", function(){
    siteTable.download("csv", "data.csv");
});

document.getElementById("download-json").addEventListener("click", function(){
    siteTable.download("json", "data.json");
});

document.getElementById("download-xlsx").addEventListener("click", function(){
    siteTable.download("xlsx", "data.xlsx", {sheetName:"ArboDat+ exported data"});
});

document.getElementById("download-html").addEventListener("click", function(){
    siteTable.download("html", "data.html", {style:true});
});