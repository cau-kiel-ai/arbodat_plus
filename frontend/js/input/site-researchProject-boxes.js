// for site.js : select 1 or more research projects from the backend and save their ids into a list.

window.rpList = [];
document.getElementById("add_rp_button").addEventListener("click", function() {       
    
    // Get values from the form
    const rp_dropdown = document.getElementById("projectName_in_site");
    const rpValue = rp_dropdown.options[rp_dropdown.selectedIndex].text; // name of the selected research project
    const rp_in_site_Id = rp_dropdown.value; // id of the selected research project

    // Check if research project is provided (required)
    if (!rpValue) {
        alert("research project is required!");
        return;
    }

    if (rp_in_site_Id != "") {
    const existingProjectinSite = rpList.find(rp_id => rp_id.id === rp_in_site_Id);

        if (existingProjectinSite) {
            // Clear the form and variables
            document.getElementById("rp_id_site").value = "";
            document.getElementById("projectName_in_site").value = "";
            alert("This project has already been added or does not exist!");
            return;
        }
        else {
            // Create JSON object to store the data
            let rp_in_site_Data = {}; 
            let rp_id_list_elem;

            rp_in_site_Data = { id: rp_in_site_Id, projectName: rpValue };
            rp_id_list_elem = { id: rp_in_site_Id};
    
            // Save object into the rp array, for backend: List of RP-ids; 
            const index_rp = rpList.push(rp_in_site_Data) - 1;
                                                                    
            // Clear the form and variables
            document.getElementById("rp_id_site").value = "";
            document.getElementById("projectName_in_site").value = "";

            // Display the saved research project(s) in a box under the form
            const saved_rp_Box = document.createElement("div");
            saved_rp_Box.style.border = "1px solid #ccc";
            saved_rp_Box.style.padding = "10px";
            saved_rp_Box.style.marginTop = "8px";
            saved_rp_Box.style.width = "95%";
            saved_rp_Box.style.marginBottom = "10px";
            saved_rp_Box.style.backgroundColor = "#f9f9f9";

            function updateBoxLayout() {
                if (window.innerWidth <= 720) {
                    saved_rp_Box.style.marginLeft = "0";
                } else {
                    saved_rp_Box.style.marginLeft = "32%";
                }
            }

            updateBoxLayout();

            window.addEventListener("resize", updateBoxLayout);

            // And add their label and delete button
            saved_rp_Box.innerHTML = `
            <span style="display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 95%; ">${rpValue}</span>
            <span style="color: red; float: right; cursor: pointer;" onclick="delete_rp(this, ${index_rp})"> &#10005; </span>
            `;
            // Append the saved rp box to the container
            document.getElementById("rp_in_site_Container").appendChild(saved_rp_Box);
        }
    }
    else {
        alert("This project does not exist.");
        return;
    }
}); 

// Function to delete
function delete_rp(deleteIcon, index_rp) {
    // Find the parent div (the rp box) and remove it
    const rpBox = deleteIcon.parentElement;
    rpBox.remove();

    // Remove rp from the rpList with index                                
    if (index_rp !== -1) {
    rpList.splice(index_rp, 1);
    }  
};