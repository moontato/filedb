document.addEventListener('DOMContentLoaded',()=>{

    document.getElementById('downloadButton').addEventListener('click', ()=>{
        let title = document.getElementById('gameTitle').value;
        downloadURL(title);
    })

})

async function downloadURL(folderName){

    let storage = firebase.storage();
    let storageRef = storage.ref();

    storageRef.child(folderName).listAll().then(function(result){
        result.items.forEach(async function(saveRef){
            let link = await saveRef.toString()

            let path = splitLink(link).toString().replace(',','/')
            openWindows(path)
        });
    })
}

function splitLink(link) {

    let splitted = link.split('/')
    splitted = splitted.splice(3, splitted.length)

    return Array.from(splitted);
}

async function openWindows(path) {
    let downloadURL = await firebase.storage().ref(path).getDownloadURL()
    window.open(downloadURL)
}

