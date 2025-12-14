window.institutionList = [];
window.institutionListSite = [];

document.getElementById("addInstitutionButton").addEventListener("click", function () {
    addInstitution({
        institutionInputId: "user_institution",
        containerId: "institutionContainer",
        listName: "institutionList"
    });
});

document.getElementById("addInstitutionButtonSite").addEventListener("click", function () {
    addInstitution({
        institutionInputId: "site_institution",
        containerId: "institutionContainerSite",
        listName: "institutionListSite"
    });
});

function addInstitution({ institutionInputId, containerId, listName } ) {    
    const selectElement = document.getElementById(institutionInputId);
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    const institutionId = selectElement.value;

    const list = window[listName];
    const existingInstitution = list.find(inst => inst.id === institutionId);

    if (existingInstitution) {
        alert("This institution has already been added!");
        return;
    }

    const institutionData = { id: institutionId };

    const index = list.push(institutionData) - 1;

    const savedInstitutionBox = document.createElement("div");
    savedInstitutionBox.style.border = "1px solid #ccc";
    savedInstitutionBox.style.padding = "10px";
    savedInstitutionBox.style.marginTop = "10px";
    savedInstitutionBox.style.width = "95%";
    savedInstitutionBox.style.backgroundColor = "#f9f9f9";

    function updateBoxLayout() {
        if (window.innerWidth <= 720) {
            savedInstitutionBox.style.marginLeft = "0";
        } else {
            savedInstitutionBox.style.marginLeft = "36.5%";
        }
    }

    updateBoxLayout();

    window.addEventListener("resize", updateBoxLayout);
    
    savedInstitutionBox.innerHTML = `
        <span style="display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 95%; ">${selectedOption.text}</span>
        <span style="color: red; float: right; cursor: pointer;" onclick="deleteInstitution(this, ${index}, '${listName}')"> &#10005;</span>
    `;

    document.getElementById(containerId).appendChild(savedInstitutionBox);

    // Clear the form
    document.getElementById(institutionInputId).value = "";
}

function deleteInstitution(deleteIcon, index, listName) {
    const institutionBox = deleteIcon.parentElement;
    institutionBox.remove();
    const list = window[listName];
    
    if (index !== -1) {
        list.splice(index, 1);
    }
}
