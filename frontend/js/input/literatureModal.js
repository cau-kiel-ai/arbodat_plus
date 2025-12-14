function openLiteratureWindow () {

    // Reset literatureForm
    //document.getElementById("literatureForm").reset();    

    // Populate title list ---------------------------------------
    const titlelist = document.getElementById('titleList');

    fetch('http://localhost:8080/literature', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        titlelist.innerHTML="";
        // Populate title dropdown
        data.forEach(literature => {            
            if (literature.title != null) {
                const titleOption = document.createElement('option');
                titleOption.textContent = `${literature.title}`;
                titlelist.appendChild(titleOption);
            }            
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Reset authorList and container
    authorList.length = 0;
    document.getElementById("authorContainer").innerHTML = '';

    const lastnameList = document.getElementById('lastnameList');

    // Reset
    lastnameList.innerHTML = '';

    fetch('http://localhost:8080/authors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Populate the dropdown with authors
        data.forEach(author => {
            const option = document.createElement('option');

            const authorName = formatName(author);

            // option.value = author.id;
            // option.textContent = authorName;
            option.setAttribute("data-id", author.id);
            option.value = authorName;
            option.setAttribute("data-label", authorName);
            
            lastnameList.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Show Popup --------------------------------------------------------
    const literaturModal = document.getElementById("literaturModal");    
    literaturModal.style.display = "block";
    
    const closeButton = literaturModal.querySelector(".close");
    closeButton.onclick = function() {
        literaturModal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === literaturModal) {
            literaturModal.style.display = "none";
        }
    }
}

function createLiterature(authorList) {

    // Get Literature details
    const doi = document.getElementById("doi").value.trim() || null; // trim: removes spaces at the beginning and end of a string
    const publicationYear = document.getElementById("publicationYear").value || null;
    const title = document.getElementById("title").value.trim() || null;
    const shortCitation = document.getElementById("shortCitation").value.trim() || null;
    const longCitation = document.getElementById("longCitation").value.trim() || null;
    const litAbstract = document.getElementById("litAbstract").value.trim() || null;

    let literature = {
        ...(doi !== null && { doi }),
        ...(publicationYear !== null && { publicationYear }),
        ...(title !== null && { title }),
        ...(shortCitation !== null && { shortCitation }),
        ...(longCitation !== null && { longCitation }),
        ...(litAbstract !== null && { litAbstract })
    };

    if (Object.keys(literature).length === 0 && authorList.length === 0) {
        alert("set at least one attribute to create new literature");
    } else {

        // Create FormData object
        const formData = new FormData();
        
        // Add literature
        formData.append("literature", new Blob([JSON.stringify(literature)], { type: "application/json" }));

        // Add authorList (Ids of existing 'authors' OR new author objects without id)
        formData.append("authorList", new Blob([JSON.stringify(authorList)], { type: "application/json" }));

        // Create literature via POST
        fetch(`http://localhost:8080/literature`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            alert("literature created");          
            // Add authorList to literatur
            if (authorList.length > 0) {
                literature["authorList"] = authorList;
            }

            // Close modal
            document.getElementById("literaturModal").style.display = "none";            
            

            // Reset literatureForm
            document.getElementById("literatureForm").reset();

            // Reset authorList and container
            authorList.length = 0;
            document.getElementById("authorContainer").innerHTML = '';
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to create literature");
        });
    }    
}

const authorList = [];

document.getElementById("addAuthorButton").addEventListener("click", function () {

  const selectedOption = document.querySelector(
      `#lastnameList option[value="${document.getElementById("lastName").value}"]`
    );
  const authorId = selectedOption ? selectedOption.getAttribute("data-id") : null;

  const lastNameValue = document.getElementById("lastName").value;
  if (!lastNameValue) {
    alert("Last name is required!");
    return;
  }

  let lastName;
  let firstName;
  let middleName;

  if (!authorId) {
    lastName = lastNameValue;
    firstName = document.getElementById("firstName").value || null;
    middleName = document.getElementById("middleName").value || null;
  }

  const existingAuthor = authorList.find((author) => {
    if (authorId) {
      return author.id === authorId;
    } else {
      return (
        author.lastName === lastName &&
        author.firstName === firstName &&
        author.middleName === middleName
      );
    }
  });

  if (existingAuthor) {
    alert("This author has already been added!");
    return;
  }

  let authorData;
  if (authorId) {
    authorData = { id: authorId };
  } else {
    authorData = {
      lastName: lastName,
      firstName: firstName,
      middleName: middleName,
    };
  }

  const index = authorList.push(authorData) - 1;

  const savedAuthorBox = document.createElement("div");
  savedAuthorBox.style.border = "1px solid #ccc";
  savedAuthorBox.style.padding = "10px";
  savedAuthorBox.style.marginTop = "10px";
  savedAuthorBox.style.backgroundColor = "#f9f9f9";

  let authorName;
  if (authorId) {
    const selectedOption = document.querySelector(
      `#lastnameList option[value="${document.getElementById("lastName").value}"]`
    );
    authorName = selectedOption ? selectedOption.getAttribute("data-label") : null;
  } else {
      if (!firstName && !middleName && lastName) {
      authorName = lastName;
    } else if (firstName && !middleName && lastName) {
      authorName = `${firstName} ${lastName}`;
    } else if (firstName && middleName && lastName) {
      authorName = `${firstName} ${middleName.charAt(0)}. ${lastName}`;
    } else if (firstName && !lastName) {
      authorName = firstName;
    } else {
      authorName = '';
    }
  }

  savedAuthorBox.innerHTML = `
    <span>${authorName}</span>
    <span style="color: red; float: right; cursor: pointer;" onclick="deleteAuthor(this, ${index})">&#10005;</span>
  `;

  document.getElementById("authorContainer").appendChild(savedAuthorBox);

  document.getElementById("lastName").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("middleName").value = "";
});

function deleteAuthor(deleteIcon, index) {
  const authorBox = deleteIcon.parentElement;
  authorBox.remove();

  if (index !== -1) {
    authorList.splice(index, 1);
  }
}