document.addEventListener("DOMContentLoaded",()=>{

    createList();
    
})

// Click file name in list to automatically put into input
function fileNameDiv(fileName){
    document.getElementById("fileName").value = fileName;
}


// Following code for "downloading from list" functionality
async function downloadURL(folderName){

    let storage = firebase.storage();
    let storageRef = storage.ref();

    storageRef.child(folderName).listAll().then(function(result){
        result.items.forEach(async function(saveRef){
            let link = await saveRef.toString();

            let path = splitLink(link).toString().replace(',','/');
            openWindows(path);
        });
    })
}

function splitLink(link) {

    let splitted = link.split('/');
    splitted = splitted.splice(3, splitted.length);

    return Array.from(splitted);
}

async function openWindows(path) {
    let downloadURL = await firebase.storage().ref(path).getDownloadURL();
    window.open(downloadURL);
}


function createList(){
    availableFiles = []; 
    let chatElem = document.getElementById('titles');
    chatElem.innerHTML = "";

    // Create a reference under which you want to list
    let listRef = firebase.storage().ref();
    
    let counter = 0;
    
    // Find all the prefixes and items.
    listRef.listAll().then(function(res) {
    res.prefixes.forEach(function(folderRef){
        availableFiles.push(Object.values(Object.values(Object.values(res["prefixes"][counter])[0])[1])[1]);

        // TRTH => Table Row, Table Header
        let TH = document.createElement('TH');
        TH.setAttribute("style","display:flex;flex-direction:row;justify-content:flex-start;");
        let TRTH = chatElem.appendChild(document.createElement('TR')).appendChild(TH);

        // Creating a delete button
        let deleteButton = document.createElement('button');

        // Creating a delete button container
        let deleteButtonContainer = TRTH.appendChild(document.createElement("div"));
        deleteButtonContainer.setAttribute("style","text-align:center; margin-right:0.5em; display:flex; justify-content:flex-end; width:auto");

        // Appending delete button to container
        deleteButtonContainer.appendChild(deleteButton);

        // Delete button attributes and styling
        deleteButton.setAttribute("id",`deleteButton${counter}`);
        deleteButton.setAttribute("name",`${availableFiles[counter]}`);
        deleteButton.setAttribute("onclick",`showDeleteModal("deleteButton${counter}")`);
        deleteButton.setAttribute("class","btn btn-danger");
        deleteButton.setAttribute("style","margin-right:1%; text-align:center; border-radius:15px; width:100%; line-height:80%");
        
        // Creating an "i" tag for delete icon
        let deleteIcon = document.createElement("i");
        deleteIcon.setAttribute("class","far fa-trash-alt");
        deleteButton.appendChild(deleteIcon);

        // Creating a download button
        let DLButton = document.createElement('button');

        // Creating a download button container
        let dlButtonContainer = TRTH.appendChild(document.createElement("div"));
        dlButtonContainer.setAttribute("style","text-align:center; margin-right:1em;");
        
        // Appending download button to container
        dlButtonContainer.appendChild(DLButton);

        // Download button attributes and styling
        DLButton.setAttribute("id","downloadButton");
        DLButton.setAttribute("onclick",`downloadURL("${availableFiles[counter]}")`);
        DLButton.setAttribute("class","btn btn-light border border-dark");
        DLButton.setAttribute("style","display:block; text-align:center; border-radius:15px; line-height:100%");

        // Creating an "i" tag for download icon
        let downloadIcon = document.createElement("i");
        downloadIcon.setAttribute("class", "fas fa-download");
        DLButton.appendChild(downloadIcon);

        // Create a div element and put file names inside of div. Styling to stop word wrap.
        let fileNameContainer = TRTH.appendChild(document.createElement("div"));
        fileNameContainer.setAttribute("style","white-space:nowrap; padding-top:4px");
        fileNameContainer.setAttribute("onclick",`fileNameDiv("${availableFiles[counter]}")`);
        fileNameContainer.appendChild(document.createTextNode(availableFiles[counter]));


        chatElem.appendChild(document.createElement("hr"));
        
        counter++;
    });
    }).catch(function(error) {
        // Error
    
        chatElem.innerHTML = "<div style='text-align:center'>Error while fetching files</div>";
    });
}

function showDeleteModal(buttonID){

    let folderName = document.getElementById(buttonID).getAttribute("name");
    document.getElementById("modalDescription").innerHTML = `Deleting folder: ${folderName}`;
    $('#deleteModal').modal('show');

    document.getElementById("deleteContinue").addEventListener("click",()=>{
        deleteFile(folderName);
    })
}

function deleteFile(folderName){
    
    let storage = firebase.storage();
    let storageRef = storage.ref();

    storageRef.child(folderName).listAll().then(function(result){
        result.items.forEach(async function(saveRef){
            let link = await saveRef.toString();
            let fileToDelete = link.split("/");
            fileToDelete = fileToDelete[fileToDelete.length - 1];


            // Create a reference to the file to delete
            var toDelete = storageRef.child(`${folderName}/${fileToDelete}`);

            // Delete the file
            toDelete.delete().then(function() {
            // File deleted successfully
                console.log("File deletion successful");
                createList();
                $('#deleteModal').modal('hide');
            }).catch(function(error) {
            // Uh-oh, an error occurred!
                console.log("File deletion failed");
                document.getElementById("modalDescription").innerHTML = '<div style="color:red">Not logged in</div>';
            });
        });
    })
}