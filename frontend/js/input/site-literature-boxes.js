window.litList = []; // create explicit global object

document.getElementById("add_lit_button").addEventListener("click", function() {                              
    
    const selectElement = document.getElementById("literature_in_site");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    
    const litId = selectElement.value;

    if (litId === "") return;  // Prevent adding if no literature is selected.

    // Check if the literature is already in the list (by `litId`)
    const existingIndex = window.litList.findIndex(lit => lit.id === litId);
    if (existingIndex !== -1) {
        alert("This literature item has already been added.");
        return;  // Prevent adding duplicate item.
    }
    
    let litData;
    litData = {id : litId};

    // Save object into the literature array
    const index = window.litList.push(litData) - 1;
    
    // Display the saved literature in a box under the form
    const savedlitBox = document.createElement("div");
    savedlitBox.style.border = "1px solid #ccc";
    savedlitBox.style.padding = "10px";
    savedlitBox.style.marginTop = "10px";
    savedlitBox.style.width = "95%";
    savedlitBox.style.backgroundColor = "#f9f9f9";

    function updateBoxLayout() {
        if (window.innerWidth <= 720) {
            savedlitBox.style.marginLeft = "0";
        } else {
            savedlitBox.style.marginLeft = "32%";
        }
    }

    updateBoxLayout();

    window.addEventListener("resize", updateBoxLayout);

    savedlitBox.innerHTML = `
    <span style="display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 95%; ">${selectedOption.text}</span>
    <span style="color: red; float: right; cursor: pointer;" onclick="deletelit(this, ${index})"> &#10005; </span>
    `;                                                               

    // Append the saved institution box to the container
    document.getElementById("lit_in_site_Container").appendChild(savedlitBox);

    // Clear the form
    document.getElementById("literature_in_site").value = "";
});

function deletelit(deleteIcon, index) {
    const litBox = deleteIcon.parentElement;
    litBox.remove();

    // Remove institution from the institutionList with index                                
    if (index !== -1) {
        window.litList.splice(index, 1);
    }    
}