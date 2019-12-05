import {
    loginAndSetJWT,
    loginAndGetStatus,
    createUser,
    status,
    getUserFields,
    editFirstname,
    editLastname,
    editCSTrack,
    editGradYear
} from "./backend.js";


export const $root = $('#root');

export const setUp = async function () {
    /* renders nav bar based on logged in or logged out */
    if (localStorage.getItem("jwt") != null) {
        console.log("setUp: ", localStorage.getItem("jwt"))
        await renderLoggedInContent();
    } else {
        renderNonLoggedInContent();
    }
    /* clicking on logo takes you to homepage */
    $(document).on("click", "#logo", handleHomeNavClick);

    /* Click handlers for Login, Sign Up, amnd Log Out buttons */
    $(document).on("click", "#loginButton", handleLoginButtonClick);
    $(document).on("click", "#signupButton", handleSignUpButtonClick);
    $(document).on("click", "#logoutButton", logout);

    $(document).on("click", "#submitLogin", handleLoginSubmit);
    $(document).on("click", "#submitSignup", handleSignUpSubmit);


    /* Click handlers for the 5 tabs in the navigation bar */
    $(document).on("click", "#homeNav", handleHomeNavClick);
    $(document).on("click", "#profileNav", handleProfileNavClick);
    $(document).on("click", "#progressNav", handleProgressNavClick);
    $(document).on("click", "#addNav", handleAddNavClick);
    $(document).on("click", "#findNav", handleFindNavClick);

    /* Click handlers for profile tab (profile card and edit form) */
    $(document).on("click", "#editProfile", handleEditProfileClick);
    $(document).on("click", "#cancelProfile", handleCancelEditProfileClick);
    $(document).on("click", "#submitProfile", handleSubmitEditProfileClick);

};

/*----------------------------------------- LOGGED IN  VS LOGGED OUT NAV BAR CHANGES -------------------------------------------*/
export const renderLoggedInContent = async function () {
    renderHomePage();
    $(".tab").css("visibility", "visible");
    $("#buttons").empty();

    let result = await getUserFields(localStorage.getItem("jwt"))
    let user = result.data.result
    let html =
        `<div class="button" id="greeting"><h5 class="subtitle has-text-grey">Hi, ${user.firstname}!</h5></div>
        <a class="button is-primary" id ="logoutButton">
            <strong>Log out</strong>
        </a>`;
    $("#buttons").append(html);
    // status(localStorage.getItem("jwt")).then((result) => {
    //     user = result.data.user;
    //     let html =
    //         `<div class="button" id="greeting"><h5 class="subtitle has-text-grey">Hi, ${user.data.firstname}!</h5></div>
    //         <a class="button is-primary" id ="logoutButton">
    //             <strong>Log out</strong>
    //         </a>`;
    //     $("#buttons").append(html);
    // })
}

export const renderNonLoggedInContent = function () {
    renderHomePage();
    $(".tab").css("visibility", "hidden");
    $("#buttons").empty();
    let html =
        `<a class="button is-primary" id ="signupButton">
            <strong>Sign up</strong>
        </a>
        <a class="button is-light" id ="loginButton">
            Log in
        </a>`;
    $("#buttons").append(html);

}


/*----------------------------------------- LOGIN TAB -------------------------------------------*/

export const handleLoginButtonClick = function () {
    renderLoginForm();
};

export const handleLoginSubmit = async function () {
    let username = $("#loginForm_username").val()
    let password = $("#loginForm_password").val()
    await loginAndGetStatus(username, password)
    await renderLoggedInContent()
}

export const renderLoginForm = function () {
    $root.empty();
    let html =
        `<section class="section profile">
            <div class="card">
                <header class="card-header">
                <p class="card-header-title">
                    Log In
                </p>
                </header>
                <div class="card-content">
                    <form id="prfoileEditForm">
                        <div class="field">
                            <label class="label">Username:</label>
                            <div class="control">
                                <input class="input"  type="text" id="loginForm_username">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Password:</label>
                            <div class="control">
                                <input class="input"  type="password" id="loginForm_password">
                            </div>
                        </div>
                    </form>
                </div>
                <footer class="card-footer">
                <a href="#" class="card-footer-item" id="submitLogin">Log In</a>
                </footer>
            </div>
        </section>`;
    $root.append(html);
};

/*----------------------------------------- SIGN UP TAB -------------------------------------------*/

export const handleSignUpButtonClick = function () {
    renderSignUpForm();
};

export const handleSignUpSubmit = async function () {
    // Get form values
    let username = $("#signupForm_username").val()
    let password = $("#signupForm_password").val()
    let year = $("#signupForm_year").val()
    let firstname = $("#signupForm_firstname").val()
    let lastname = $("#signupForm_lastname").val()

    // CS TRACK
    let ba = $("#BA:checked").val()
    let bs = $("#BS:checked").val()
    let minor = $("#Minor:checked").val()
    let cstrack;
    if (ba) {
        cstrack = "BA"
    } else if (bs) {
        cstrack = "BS"
    } else {
        cstrack = "Minor"
    }


    // Create user 
    await createUser(username, password, firstname, lastname, cstrack, year)
    // Customize site to user
    await renderLoggedInContent()
}

export const renderSignUpForm = function () {
    $root.empty();
    let html =
        `<section class="section profile">
            <div class="card">
                <header class="card-header">
                <p class="card-header-title">
                    Sign Up
                </p>
                </header>
                <div class="card-content">
                <form id="prfoileEditForm">
                    <div class="field">
                        <label class="label">Username:</label>
                        <div class="control">
                            <input class="input"  type="text" id="signupForm_username">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password:</label>
                        <div class="control">
                            <input class="input"  type="password" id="signupForm_password">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">First Name:</label>
                        <div class="control">
                            <input class="input"  type="text" id="signupForm_firstname">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Last Name:</label>
                        <div class="control">
                            <input class="input"  type="text" id="signupForm_lastname">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">CS Track:</label>
                        <div class="control" >
                            <label class="radio">
                                <input type="radio" name="track" checked id="BA">
                                COMP BA
                            </label>
                            <label class="radio">
                                <input type="radio" name="track" id="BS">
                                COMP BS
                            </label>
                            <label class="radio">
                                <input type="radio" name="track" id="Minor">
                                COMP Minor
                            </label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Graduation Year:</label>
                        <div class="control">
                            <input class="input"  type="text" id="signupForm_year">
                        </div>
                    </div>
                    
                </form>
                </div>
                <footer class="card-footer">
                <a href="#" class="card-footer-item" id="submitSignup">Create Profile</a>
                </footer>
            </div>
        </section>`;
    $root.append(html);
};

/*----------------------------------------- FIND CLASSES TAB -------------------------------------------*/

/* Handles when user clicks on Find Classes tab in nav bar */
export const handleFindNavClick = function () {

};

/*----------------------------------------- PROGRESS TAB -------------------------------------------*/

/* Handles when user clicks on Progress tab in nav bar */
export const handleProgressNavClick = function () {

};

/*----------------------------------------- ADD COMPLETED COURSES TAB -------------------------------------------*/

/* Handles when user clicks on Add CompetedCourses tab in nav bar */
export const handleAddNavClick = function () {

};

/*----------------------------------------- PROFILE TAB -------------------------------------------*/

/* Handles when user clicks on Profile tab in nav bar */
export const handleProfileNavClick = function () {
    renderProfile();
};

/* Renders user's profile card */
export const renderProfile = async function () {
    let result = await getUserFields(localStorage.getItem("jwt"))
    let stat = await status(localStorage.getItem("jwt"))
    console.log("stat", stat)
    let user = result.data.result;
    $root.empty();
    let html =
        `<section class="section profile">
                <div class="card">
                    <header class="card-header">
                    <p class="card-header-title">
                        My Profile
                    </p>
                    
                    </header>
                    <div class="card-content">
                    <div class="content">
                            <b>Username:  </b>   ${stat.data.user.name}
                            <br><br>
                            <b>Name:  </b>   ${user.firstname} ${user.lastname}
                            <br><br>
                            <b>CS Track:  </b>   ${user.cstrack}
                            <br><br>
                            <b>Graduation Year:  </b>   ${user.gradyear}
                            <br>
                    </div>
                    </div>
                    <footer class="card-footer">
                    <a href="#" class="card-footer-item" id="editProfile">Edit</a>
                    </footer>
                </div>
            </section>`;
    $root.append(html);



};

export const handleSubmitEditProfileClick = async function () {
    let firstName = document.getElementById("userFirstName").value;
    let lastName = document.getElementById("userLastName").value;
    
    let ba = $("#BA:checked").val()
    let bs = $("#BS:checked").val()
    let minor = $("#Minor:checked").val()
    let cstrack;
    if (ba) {
        cstrack = "BA"
    } else if (bs) {
        cstrack = "BS"
    } else {
        cstrack = "Minor"
    }
    let gradyear = document.getElementById("userGradYear").value;
    
    let jwt = localStorage.getItem("jwt")
    await editFirstname(jwt, firstName)
    await editLastname(jwt, lastName)
    await editCSTrack(jwt, cstrack)
    await editGradYear(jwt, gradyear)
    
    renderProfile()
};

/* Handles when user clicks cancel on profile edit form */
export const handleCancelEditProfileClick = function () {
    renderProfile();
};

/* Handles when user clciks on edit button for their profile */
export const handleEditProfileClick = async function () {
    let result = await getUserFields(localStorage.getItem("jwt"))
    console.log("edit click", result)
    let user = result.data.result;
    console.log("user", user)
    $root.empty();
    let html =
        `<section class="section profile">
                <div class="card">
                    <header class="card-header">
                    <p class="card-header-title">
                        Editting My Profile
                    </p>
                    </header>
                    <div class="card-content">
                    <form id="prfoileEditForm">
                        <div class="field">
                            <label class="label">First Name:</label>
                            <div class="control">
                                <input class="input" id="userFirstName" type="text" value="${user.firstname}">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Last Name:</label>
                            <div class="control">
                                <input class="input" id="userLastName" type="text" value="${user.lastname}">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">CS Track:</label>
                            <div class="control">
                                <label class="radio">
                                    <input type="radio" name="track" id="BA">
                                    COMP BA
                                </label>
                                <label class="radio">
                                    <input type="radio" name="track" id="BS">
                                    COMP BS
                                </label>
                                <label class="radio">
                                    <input type="radio" name="track" id="Minor">
                                    COMP Minor
                                </label>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Graduation Year:</label>
                            <div class="control">
                                <input class="input" id="userGradYear" type="text" value="${user.gradyear}">
                            </div>
                        </div>
                        
                    </form>
                    </div>
                    <footer class="card-footer">
                    <a href="#" class="card-footer-item" id="cancelProfile">Cancel</a>
                    <a href="#" class="card-footer-item" id="submitProfile">Submit</a>
                    </footer>
                </div>
            </section>`;
    $root.append(html);
    if (user.cstrack == "BA") {
        document.getElementById("BA").checked = true;
    } else if (user.cstrack == "BS") {
        document.getElementById("BS").checked = true;
    } else if (user.cstrack == "Minor") {
        document.getElementById("Minor").checked = true;
    }
};


/*----------------------------------------- HOME TAB -------------------------------------------*/

export const renderHomePage = function () {
    $root.empty();
    let html =
        `<section class="section">
            <div class="container">
                <div class="content">
                    <h1 class="title">Use Progress in CS</h1>
                    <h5 class="subtitle has-text-grey">Map out your 4-year CS plan</h5>
                    <p>When it comes to developing websites, design can be a very fun aspect. But in reality we often don't want
                        to spend hours writing CSS.
                        Aspects of good design (consistent theming, mobile friendly, and good typography) are tedious to manage
                        for every site. Not to mention
                        that most people don't get them right in the first place. So we use these frameworks to do a lot of the
                        leg work for us.
                    </p>
                </div>
            </div>
        </section>
        <hr/>
        <section class="section has-background-white">
            <div class="container">
                <div class="content">
                    <div class="columns">
                        <div class="column">
                            <h1 class="title">Why CS</h1>
                            <h5 class="subtitle has-text-grey">Words words words are important</h5>
                            <p>When it comes to design and specifically typography (which is a massive part of web design), you
                                want
                                your content to be readable. This means that when someone looks at it, they intuitively know
                                which text to read first, second, and third.
                                If all of the text on the page was the same size, it would be difficult to know which
                                information is the most important.</p>
                            <p>Size is one key way in which typographers create hierarchy and guide their readers.
                                Headings are usually large, sub-headings are smaller, and body type is smaller still.
                                Size is not the only way to define hierarchy – it can also be achieved with colour, spacing and
                                weight.</p>
                        </div>
                        <div class="column">
                            <h1 class="title">Plan Early</h1>
                            <h5 class="subtitle has-text-grey">Words words words are important</h5>
                            <p>The term 'measure' describes the width of a text block. If you're seeking to achieve the optimum
                                reading experience,
                                it's clearly an important consideration. If your lines are too long, your reader can easily get
                                lost,
                                while a too-short measure breaks up the reading experience unnecessarily.</p>
                            <p>
                                There are a number of theories to help you define the ideal measure for your typography.
                                One rule of thumb is that your lines should be 2-3 alphabets in length (so 52-78 characters,
                                including spaces). Bulma's container class
                                does this for us.</p>

                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    $root.append(html);
}

/* Handles when user clicks on Home tab in nav bar */
export const handleHomeNavClick = function () {
    renderHomePage();
};


$(function () {
    setUp();
});


/*----------------------------------------- MISCELLANEOUS -------------------------------------------*/

export const logout = function () {
    if (localStorage.getItem("jwt") != null) {
        localStorage.removeItem("jwt")
        renderNonLoggedInContent();
    }

}