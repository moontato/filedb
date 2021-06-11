const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLoginLogout = document.getElementById('btnLoginLogout');

// Event listeners
// Add login event
btnLoginLogout.addEventListener("click",()=>{
    if(btnLoginLogout.getAttribute("name") == "Log in"){
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        
        login(email, pass, auth);

    }
    else if(btnLoginLogout.getAttribute("name") == "Log out"){
        firebase.auth().signOut();
    }
})

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
        btnLoginLogout.innerHTML = "Log out"
        btnLoginLogout.setAttribute("name", "Log out")
        btnLoginLogout.setAttribute("class","btn btn-warning")

    }
    else{
        console.log("not logged in")
        btnLoginLogout.innerHTML = "Log in"
        btnLoginLogout.setAttribute("name", "Log in")
        btnLoginLogout.setAttribute("class", "btn btn-primary")
    }
})

async function login(email, pass, auth) {
    const promise = await auth.signInWithEmailAndPassword(email, pass);
    window.location.replace("index.html");
    promise.catch(e => console.log(e.message));
}