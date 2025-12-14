
document.addEventListener("DOMContentLoaded", async function () {
    // Get and update dante attributes
    await updateBackendDanteAttributes();
});

document.getElementById("tableSelector").addEventListener("change", (e) => {
    renderTable(e.target.value);
});

function renderTable(tableId) {

    const container = document.getElementById("table");

    // Reset
    container.innerHTML = "";
    document.getElementById("deleteRows-button").classList.add("hidden");

    switch (tableId) {
        case "researchProject-table":
            buildResearchProjectTable();
            break;

        case "institution-table":
            buildInstitutionTable();
            break;
        
        case "user-table":
            buildUserTable();
            break;

        case "site-table":
            buildSiteTable();
            break;

        case "feature-table":
            buildFeatureTable();
            break;
        
        case "sample-table":
            buildSampleTable();
            break;

        case "dating-table":
            buildDatingTable();
            break;

        case "result-table":
            buildResultTable();
            break;
        
        case "literature-table":
            buildLiteratureTable();
            break;

        case "author-table":
            buildAuthorTable();
            break;
    
        default:
            break;
    }
}