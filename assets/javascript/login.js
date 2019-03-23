//this JS handles the FireBase login
//And determins if the user is loged in

const auth = firebase.auth();

//JS to push user to the database when a user is created

const database = firebase.database();

$(document).ready(function () {
    $(document).on('click',"#signupBtn", function (event) {
        event.preventDefault();
        //remove errormsg if any
        $("#errormsg").remove();
        //show username and change the button
        $("#firstNameLabel").show();
        $("#firstname").show();
        $("#lastNameLabel").show();
        $("#lastname").show();
        $("#signupSpan").hide();
        $("#loginBtn").attr("value","SignUp")
    })

    $(document).on('click',"#loginBtn", function (event) {
        event.preventDefault();
        //remove errormsg if any
        $("#errormsg").remove();
        if($(this).attr("value").toLowerCase() == "login"){
            loginUser();
        }else{
            signUpUser();
        }
        
    })

    $(document).on('click',"#loginBtnHead", function (event) {
        $("body").showLoginSection();
        $("#firstNameLabel").hide();
        $("#firstname").hide();
        $("#lastNameLabel").hide();
        $("#lastname").hide();
    })

    $(document).on('click',"#closelogin", function (event) {
        event.preventDefault();
        loginHandler(false);
    })

    
    $(document).on('click',"#logoutBtnHead", function (event) {
        auth.signOut().then(function () {
            // Sign-out successful.
            loginHandler(false);
        }).catch(function (error) {
            //TODO An error happened.
        });
    })



    auth.onAuthStateChanged(function (user) {
        if (user) {
            //User is signed in. set user to this user
            //Hide log in section and show logout button
            loginHandler(true);

        } else {
            // No user is signed in. set user to anounymouse
            //Show loging section and empty div
            loginHandler(false);
        }
    });

})


function showError(errorCode, errorMessage) {
    let error = $("<p>").attr("id", "errormsg");
    error.css("color", "red");
    error.text("Error Authenticate, code: " + errorCode + ". Error Message: " + errorMessage)
    $("#loginForm").append(error);
}

function loginHandler(loggedIn) {
    if (loggedIn) {
        $("#loginForm").remove();
        $("#logoutBtnHead").show();//TODO: position the log out button
        $("#loginBtnHead").hide();
    } else {
        $("#loginForm").remove();
        $("#savedRecipies").empty();
        $("#logoutBtnHead").hide();//TODO: position the log out button
        $("#loginBtnHead").show();
    }

}

function signUpUser(){

        //ready from form and create user
        const password = $("#password").val();
        const email = $("#email").val();
        const firstname = $("#firstname").val();
        const lastname = $("#lastname").val();
        //const username = email.split('@')[0];

        if (password && email) {
            auth.createUserWithEmailAndPassword(email, password)
                .then(function () {
                    let user = auth.currentUser;
                    pushUserToDB(user);
                    user.updateProfile({
                        firsname: firstname,
                        lastname:lastname
                    }).then(function () {
                        // Update successful.
                    }, function (error) {
                        const errorMessage = error.message;
                        showError("Can't set username", errorMessage);
                    });
                })
                .catch(function (error) {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    showError(errorCode, errorMessage);
                });
        } else {
            showError(0, "Please complete all the fields")
        }

}

function loginUser(){
    //ready from form and create user
    const password = $("#password").val();
    const email = $("#email").val();

    auth.signInWithEmailAndPassword(email, password)
        .then(function (u) {
            // Login successful.
        })
        .catch(function (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            showError(errorCode, errorMessage);
        });
}



function pushUserToDB(user){
    database.ref('/users/'+user.uid).update({
        email:user.email
    })
}