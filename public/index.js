document.addEventListener('DOMContentLoaded',()=>{

    let fileUpload = document.getElementById("file-upload");
    
    fileUpload.addEventListener('change', async function (e) {
        if(document.getElementById("fileName").value == ""){
            fileUpload.value = ""
            document.getElementById("titleHelp").innerHTML = "<div style='color:red'>Please input a file name first</div>"
        }
        else{
            document.getElementById("uploader").removeAttribute("hidden");
            document.getElementById("status").innerHTML = "";
            //Get files
            for (let i = 0; i < e.target.files.length; i++) {
                let file = e.target.files[i];
                await uploadFile(file).then((res) => {
                    createList();
                });
            }
            document.getElementById("status").innerHTML = "complete!";
            document.getElementById("titleHelp").innerHTML = "Please complete the field above before selecting files."
        }
    });


    //Handle waiting to upload each file using promise
    async function uploadFile(file) {
        return new Promise(function (resolve, reject) {
            let storageRef = firebase.storage().ref(document.getElementById("fileName").value + "/" + file.name);
            let task = storageRef.put(file);

            //Update progress bar
            task.on('state_changed',
                function progress(snapshot) {
                    let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                    uploader.value = percentage;
                },
                function error(err) {
                    console.log(err);
                    reject(err);
                    document.getElementById("status").innerHTML = "error";
                    document.getElementById("status").style.color = "red";
                },
                function complete() {
                    let downloadURL = task.snapshot.downloadURL;
                    resolve(downloadURL);
                }
            );
        });
    }
})