import {
    loginAndSetJWT,
    loginAndGetStatus,
    createUser,
    getUserClasses,
    getClasses,
    addClass,
    status
} from "./backend.js";

export const $root = $('#root');

export const setUp = function () {
    /* renders nav bar based on logged in or logged out */
    if(localStorage.getItem("jwt") != null) {
        renderLoggedInContent();
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
    $(document).on("click", ".progressNav", handleProgressNavClick);
    $(document).on("click", "#addNav", handleAddNavClick);
    $(document).on("click", "#findNav", handleFindNavClick);

    /* Click handlers for profile tab (profile card and edit form) */
    $(document).on("click", "#editProfile", handleEditProfileClick);
    $(document).on("click", "#cancelProfile", handleCancelEditProfileClick);
    $(document).on("click", "#submitProfile", handleSubmitEditProfileClick);

};

/*----------------------------------------- LOGGED IN  VS LOGGED OUT NAV BAR CHANGES -------------------------------------------*/
export const renderLoggedInContent = function () {
    renderHomePage();
    $(".tab").css("visibility", "visible");
    $("#buttons").empty();
    let user
    status(localStorage.getItem("jwt")).then( (result) => {
        user = result.data.user;
        let html = 
            `<div class="button" id="greeting"><h5 class="subtitle has-text-grey">Hi, ${user.data.firstname}!</h5></div>
            <a class="button is-primary" id ="logoutButton">
                <strong>Log out</strong>
            </a>`;
        $("#buttons").append(html);
    })
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

export const handleLoginSubmit = function () {
    let username = $("#loginForm_username").val()
    let password = $("#loginForm_password").val()
    loginAndGetStatus(username, password).then( () => {
        // console.log("HERE I AM: " + localStorage.getItem("jwt"))
        // Customize site to user
        renderLoggedInContent();
    })
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

export const handleSignUpSubmit = function () {
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
    createUser(username, password, firstname, lastname, cstrack, year).then( () => {
        // Customize site to user
        renderLoggedInContent();
    })

    // Customize site to user
    // renderLoggedInContent();
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
    console.log("handle progress nav click")
    $root.empty();
    
    let jwt = localStorage.getItem("jwt");
    getClasses(jwt).then((resp) => {
        let allCourses = resp.data.result;
        getUserClasses(jwt).then((body) => {
            let userCourses = body.data.result;
            status(jwt).then((response) => {
                let userData = response.data;
                let userTrack = userData.user.data.cstrack;
                //TODO use userData to determine which screen to render
                console.log(userTrack);
                if (userTrack === "BA") {
                    handleBA(userCourses, allCourses);
                } else if (userTrack === "BS") {
                    handleBS();
                } else { // Minor
                    handleMinor();
                }
            });
        });
    });
    

    
    //TODO: Add course objects to page
};

// Returns string describing if they can take the class, or prereqs
// Returns empty string if there are no pre-reqs remaining
export const canTakeClass = function (course, userCourses) {
    let response = "";
    console.log(userCourses);
    // Each ele represents a grouping of required reqs
    for (let i = 0; i < course.prerequisites.length; i++) {
        //TODO confirm delimiter
        let reqs = course.prerequisites[i].split(",")
        let hasReq = false;
        for (let j = 0; j < reqs.length; j++) {
            if (userCourses.includes(reqs[j])) {
                hasReq = true;
                break;
            }
        }

        // Build string explaining reqs needed
        if (!hasReq) {
            if (response.length === 0) {
                response += "You need "
            } else {
                response += " and "
            }
            if (reqs.length === 1) {
                response += course.prerequisites[i];
            } else {
                response += "one of " + course.prerequisites[i]; 
            }
        }
    }
    return response;
    
}



// Finds course in private store based on dept and num
export const getCourseObject = function (name, courses) {
    let rightCourse;
    Object.keys(courses).forEach(function(key) {
        let course = courses[key];
        let dept = name.substring(0,4);
        let num = parseInt(name.substring(4), 10);
        if (course.department === dept && course.number === num) {
            rightCourse = course;
        }
    });
    return rightCourse;
}

export const handleBA = function (userCourses, allCourses) {
    let html = `<div class="container has-text-centered"> 
        <h1 class="title is-1 is-marginless"> Your Progress</h1>
        <br/ >
    </div>`;
    /*
    "COMP110": {
            "department": "COMP",
            "major": {"COMP": 0},
            "number" : 110,
            "prerequisites": [],
            "name": "Introduction to Computer Science",
            "description":"Introductory Computer Science class.",
            "difficulty": "beginner",
            "semester": "F19",
            "instructor": "Kris Jordan", 
            "isActive": true
        },
    */
    // First level
    let levelOne = '<div class="level">'
    if (userCourses.includes("COMP110")) {
        let course = getCourseObject("COMP110", allCourses);
        console.log(course)
        levelOne = levelOne + generateCompletedClass(course);
    } else if (userCourses.includes("COMP116")) {
        let course = getCourseObject("COMP116", allCourses);
        levelOne = levelOne + generateCompletedClass(course);
    } else {
        let course = getCourseObject("COMP110", allCourses);
        levelOne = levelOne + generateUncompletedClass(course);
        levelOne = levelOne + `OR`
        course = getCourseObject("COMP116", allCourses);
        levelOne = levelOne + generateUncompletedClass(course);
    }
    levelOne = levelOne + '</div>';
    html = html + levelOne;

    // Second level
    let levelTwo = '<div class="level">';
    if (userCourses.includes("COMP401")) {
        let course = getCourseObject("COMP401", allCourses);
        levelTwo += generateCompletedClass(course, userCourses);
    } else {
        let course = getCourseObject("COMP401", allCourses);
        levelTwo += generateUncompletedClass(course, userCourses);
    }
    levelTwo += '</div>';
    html += levelTwo

    // Third Level
    let levelThree = '<div class="level">';
    if (userCourses.includes("COMP410")) {
        let course = getCourseObject("COMP410", allCourses);
        levelThree += generateCompletedClass(course, userCourses);
    } else {
        let course = getCourseObject("COMP410", allCourses);
        levelThree += generateUncompletedClass(course, userCourses);
    }
    if (userCourses.includes("COMP411")) {
        let course = getCourseObject("COMP411", allCourses);
        levelThree += generateCompletedClass(course, userCourses);
    } else {
        let course = getCourseObject("COMP411", allCourses);
        levelThree += generateUncompletedClass(course, userCourses);
    }
    levelThree += '</div>';
    html += levelThree;


    $root.append(html);
    

};

export const handleBS = function (userCourses) {

}

export const handleMinor = function (userCourses) {
    let html = '';

    
};


export const generateCompletedClass = function (course) {
    console.log(course)
    // Include: Button to uncomplete, class name/number, desc
    let card = `<div class="card complete-course level-item">
        <div class="card-content">
            <div class="title is-4 courseTitle is-marginless">
                `+course.department + course.number + ": " + course.name  +`
            </div>
            <p>
                `+ course.description+`
            </p>
        </div>
    </div>
    `;

    return card;
};

export const generateUncompletedClass= function (course, userCourses) {
    // Include: class name, prereqs (if they can take it or not), desc
    let prereqs = canTakeClass(course, userCourses);
    //All prereqs complete
    if (prereqs.length === 0) {
        return `<div class="card have-reqs-course level-item">
        <div class="card-content">
            <div class="title is-4 courseTitle is-marginless">
                `+course.department + course.number + ": " + course.name  +`
            </div>
            <p>
                `+ course.description+`
            </p>
        </div>
    </div>
    `;
    } else {
        return `<div class="card need-reqs-course level-item">
        <div class="card-content">
            <div class="title is-4 courseTitle is-marginless">
                `+course.department + course.number + ": " + course.name  +`
            </div>

            <p>
                `+ course.description+`
            </p>
            <p class="is-italic">
            ` + prereqs + `.
            </p>
        </div>
    </div>
    `;
    }


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
export const renderProfile = function () {
    let user

    // console.log(localStorage.hasOwnProperty('jwt'));
    status(localStorage.getItem("jwt")).then( (result) => {
        user = result.data.user;
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
                            <b>Username:  </b>   ${user.name}
                            <br><br>
                            <b>Name:  </b>   ${user.data.firstname} ${user.data.lastname}
                            <br><br>
                            <b>CS Track:  </b>   ${user.data.cstrack}
                            <br><br>
                            <b>Graduation Year:  </b>   ${user.data.gradyear}
                            <br>
                    </div>
                    </div>
                    <footer class="card-footer">
                    <a href="#" class="card-footer-item" id="editProfile">Edit</a>
                    </footer>
                </div>
            </section>`;
        $root.append(html);
    })
};

export const handleSubmitEditProfileClick = function () {

};

/* Handles when user clicks cancel on profile edit form */
export const handleCancelEditProfileClick = function () {
    renderProfile();
};

/* Handles when user clciks on edit button for their profile */
export const handleEditProfileClick = function () {
    let user
    status(localStorage.getItem("jwt")).then( (result) => {
        user = result.data.user;
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
                                <input class="input"  type="text" value="${user.data.firstname}">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Last Name:</label>
                            <div class="control">
                                <input class="input" type="text" value="${user.data.lastname}">
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
                                <input class="input"  type="text" value="${user.data.gradyear}">
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
        if(user.data.cstrack == "BA") {
            document.getElementById("BA").checked = true;
        } else if(user.data.cstrack == "BS") {
            document.getElementById("BS").checked = true;
        } else if(user.data.cstrack == "Minor") {
            document.getElementById("Minor").checked = true;
        }
    })



    
};


/*----------------------------------------- HOME TAB -------------------------------------------*/

export const renderHomePage = function() {
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