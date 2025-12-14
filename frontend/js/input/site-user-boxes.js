window.siteDirectorList = [];
window.archeologistList = [];
window.botanistList = [];

document.getElementById("addHeadButton").addEventListener("click", function () {
    addPerson({
        role: "head_of_exc",
        containerId: "HeadOfExcContainer",
        listName: "siteDirectorList"
    });
});

document.getElementById("addArcheologistButton").addEventListener("click", function () {
    addPerson({
        role: "archeologist",
        containerId: "ArcheologistContainer",
        listName: "archeologistList"
    });
});

document.getElementById("addBotanistButton").addEventListener("click", function () {
    addPerson({
        role: "botanist",
        containerId: "BotanistContainer",
        listName: "botanistList"
    });
});

function addPerson({ role, containerId, listName }) {

    const roleValue = document.getElementById(role).value; // the name of the person

    const selectElement = document.getElementById(role); 
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    const list = window[listName];
    let roleId;
    let name;
    const uuidPattern = /^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/;

    if (uuidPattern.test(roleValue)) {
        roleId = roleValue;
    } else {
        name = roleValue;
    }

    const existingPerson = list.find(elem => {
        if (roleId) {
            return elem.id === roleId;
        } else {
            return elem.label === name;
        }
    });

    if (existingPerson) {
        alert("This person has already been added!");
        return;
    }

    let personData;
    if (roleId) {
        personData = { id: roleId };
    } else {
        personData = { label: role };
    }

    const index = list.push(personData) - 1;

     // Display the added person in a box under the form
    const savedUserBox = document.createElement("div");
    savedUserBox.style.border = "1px solid #ccc";
    savedUserBox.style.padding = "10px";
    savedUserBox.style.marginTop = "10px";
    savedUserBox.style.width = "95%";
    savedUserBox.style.backgroundColor = "#f9f9f9";

    function updateBoxLayout() {
        if (window.innerWidth <= 720) {
            savedUserBox.style.marginLeft = "0";
        } else {
            savedUserBox.style.marginLeft = "36.5%";
        }
    }

    updateBoxLayout();

    window.addEventListener("resize", updateBoxLayout);

    

    savedUserBox.innerHTML = `
        <span style="display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 95%; ">${selectedOption.text}</span>
        <span style="color: red; float: right; cursor: pointer;" onclick="deletePerson(this, ${index},'${listName}')"> &#10005;</span>
    `;

    document.getElementById(containerId).appendChild(savedUserBox);
    document.getElementById(role).value = "";
}

// Deletion stays the same
function deletePerson(deleteIcon, index, listName) {
    const box = deleteIcon.parentElement;
    box.remove();
    const list = window[listName];

    if (index !== -1) {
        list.splice(index, 1);
    }
}
