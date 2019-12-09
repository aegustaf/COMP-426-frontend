import {
    loginAndSetJWT,
    loginAndGetStatus,
    createUser,
    verifyEmail,
    status,
    getUserFields,
    getUserClasses,
    getClasses,
    addClass,
    editFirstname,
    editLastname,
    editCSTrack,
    editGradYear,
    addUsernameToPublicRoute,
    getUsersFromPublic
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
    /* hamburger nav menu functionality */
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

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
    // $(".tab").css("visibility", "visible");
    $(".navbar-start").empty();
    let html =
        `<a class="navbar-item tab" id="homeNav">
            Home
        </a>

        <a class="navbar-item tab" id="profileNav">
            Profile
        </a>

        <a class="navbar-item tab" id="progressNav">
            Progress
        </a>

        <a class="navbar-item tab" id="addNav">
            Add Completed Courses
        </a>

        <a class="navbar-item tab" id="findNav">
            Find Courses
        </a>`;

    $(".navbar-start").append(html);

    $("#buttons").empty();
    let result = await getUserFields(localStorage.getItem("jwt"))
    let user = result.data.result
    let output = await getUsersFromPublic()
    $("#userCount").empty()
    $("#userCount").append(`Registered users: ${output.data.result.length}`)
    html =
        `<div class="button" id="greeting"><h5 class="subtitle has-text-grey">Hi, ${user.firstname}!</h5></div>
        <a class="button is-primary" id ="logoutButton">
            <strong>Log out</strong>
        </a>`;
    $("#buttons").append(html);
}

export const renderNonLoggedInContent = async function () {
    renderHomePage();
    let output = await getUsersFromPublic()
    $("#userCount").empty()
    $("#userCount").append(`Registered users: ${output.data.result.length}`)
    // $(".tab").css("visibility", "hidden");
    $(".navbar-start").empty();
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
    let email = $("#signupForm_email").val()

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


    if (!await verifyEmail(email)) {
        alert("You did not enter a valid email");
    } else {
        // Create user 
        await createUser(username, password, firstname, lastname, cstrack, year)
        // Add username to public route
        await addUsernameToPublicRoute(username)
        // Customize site to user
        await renderLoggedInContent()
    }

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
                        <label class="label">Email (optional):</label>
                        <div class="control">
                            <input class="input"  type="text" id="signupForm_email">
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
export const handleFindNavClick = async function () {
    $root.empty();
    let token = localStorage.getItem("jwt");
    let classes; //list of classes
    let userClasses; //list of classes user has added to their profile
    await getClasses(token).then(res => {
        classes = new Map(Object.entries(res.data.result))
    })
    let classNames = Array.from(classes.keys()) //array of class names
    await getUserClasses(token).then(elem => {
        userClasses = (elem.data.result)
    })

    //adds searchbar
    let html = `<div class="field has-addons" style="justify-content: center; margin-top: 2%">
    <div class="control">
      <input class="input" type="text" placeholder="Find a class" id="search-input">
    </div>
    <div class="control">
      <a class="button is-info">
        Search
      </a>
    </div>
  </div><div class ="columns is-mobile is-multiline"></div>`
    $root.append(html)

    //adds each course 
    classes.forEach(elem => {
        if (userClasses.includes(elem.name)) {
            renderAddedClass(elem)
        } else {
            renderNewClass(elem);
            console.log(elem);
            $(`#classAdd${elem.number}`).on("click", {
                param1: `${token}`,
                param2: `${elem.department}` +`${elem.number}`
            }, classAddition)
        }
    })
};

export const renderAddedClass = function (elem) {
    let classCard = `<div class="card ${elem.number}" style="width: 30%; margin: 1%">
        <header class="card-header">
        <p class="card-header-title" style="justify-content: center">
    ${elem.department} ${elem.number}
    </p>
    <button class="delete" id= "delete${elem.number}" style="margin-top: 7px; margin-right: 6px; visibility: visible"></button>
        </header>
        <div class="card-content">
    <div class="content">
    <p class="subtitle">${elem.name}</p>
    Instructor: ${elem.instructor} 
    </div>
    </div>
    </div>`;
    $(".columns").append(classCard)

}

export const renderNewClass = function (elem) {
    let classCard = `<div class="card ${elem.number}" style="width: 30%; margin: 1%">
    <header class="card-header">
    <p class="card-header-title" style="justify-content: center">
        ${elem.department} ${elem.number}
    </p>
    <a id ="classAdd${elem.number}" style = "visibility: visible" class="add ${elem.number}"><span class="icon">
    <i class="fas fa-plus-circle fa-lg" style="margin-top: 8px; margin-right: 7px;"></i>
    </span></a>
    </header>
    <div class="card-content">
    <div class="content">
    <p class="subtitle">${elem.name}</p>
    Instructor: ${elem.instructor} 
     </div>
    </div>
    </div>`
    $(".columns").append(classCard);
}

export const classAddition = async function (event) {
    let token = event.data.param1;
    console.log(event.data);
    let name = event.data.param2;
    console.log(name)
    let classObj;
    await addClass(token, name)
    let courses = await getClasses(token)
    courses = courses.data.result;
    classObj = await getCourseObject(name, courses);
    $(`a.${classObj.number}`).replaceWith(`<button class="delete" id= "delete${classObj.number}" style="margin-top: 7px; margin-right: 6px; visibility: visible"></button>`);
}

export const getClassObj = async function (token, name) {
    let classes;
    let course;
    await getClasses(token).then(res => {
        classes = new Map(Object.entries(res.data.result))
    })
    classes.forEach(elem => {
        if (elem.name === name) {
            course = elem;
        }
    })
    return course;
}

/*----------------------------------------- PROGRESS TAB -------------------------------------------*/

/* Handles when user clicks on Progress tab in nav bar */
export const handleProgressNavClick = async function () {
    console.log("handle progress nav click")
    $root.empty();
    $root.append(`<div class="container has-text-centered"> 
        <h1 class="title is-1 is-marginless"> Your Progress</h1>
        <br/ >
    </div>`)
    let jwt = localStorage.getItem("jwt");
    let resp = await getClasses(jwt);
    let allCourses = resp.data.result;
    let body = await getUserClasses(jwt);
    let userCourses = body.data.result;
    let response = await getUserFields(jwt);
    let userData = response.data;
    let userTrack = userData.result.cstrack;
    if (userTrack === "BA") {
        handleBA(userCourses, allCourses);
    } else if (userTrack === "BS") {
        handleBS(userCourses, allCourses);
    } else {
        handleMinor(userCourses, allCourses);
    }

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
    Object.keys(courses).forEach(function (key) {
        let course = courses[key];
        let dept = name.substring(0, 4);
        let num = parseInt(name.substring(4), 10);
        if (course.department === dept && course.number === num) {
            rightCourse = course;
        }
    });
    return rightCourse;
}

//TODO handle invalid comp courses 
export const isCompElective = function (name, isBa) {
    let dept = name.substring(0, 4);
    let num = parseInt(name.substring(4), 10);
    if (isBa) {
        let altElectives = ["BIOL525","INLS318","INLS609","INLS613","LING540","MATH566","MATH661","PHYS231","PHYS331"]
        return altElectives.includes(dept+num) || (dept === "COMP" && num >= 426);
    }

    return dept === "COMP" && num >= 426;
}

// Gens html for rreqs consistent across majors/minors
export const handleCoreRequirements = function (userCourses, allCourses) {
    let html = '<div class="container">';
    let levelOne = '<div class="container columns is-vcentered">'
    if (userCourses.includes("COMP110")) {
        let course = getCourseObject("COMP110", allCourses);
        levelOne = levelOne + generateCompletedClass(course);
    } else if (userCourses.includes("COMP116")) {
        let course = getCourseObject("COMP116", allCourses);
        levelOne = levelOne + generateCompletedClass(course);
    } else {
        let course = getCourseObject("COMP110", allCourses);
        levelOne = levelOne + generateUncompletedClass(course, userCourses);
        levelOne = levelOne + `OR`
        course = getCourseObject("COMP116", allCourses);
        levelOne = levelOne + generateUncompletedClass(course, userCourses);
    }
    if (userCourses.includes("MATH231")) {
        let course = getCourseObject("MATH231", allCourses);
        levelOne = levelOne + generateCompletedClass(course);
    } else {
        let course = getCourseObject("MATH231", allCourses);
        levelOne = levelOne + generateUncompletedClass(course, userCourses);
    }
    levelOne = levelOne + '</div>';
    html = html + levelOne;

    // Second level
    let levelTwo = '<div class="container columns is-vcentered">';
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
    let levelThree = '<div class="container columns is-vcentered">';
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

    return html;
};


export const handleElectives = function (numElectives, userCourses, allCourses, isBa) {
    let electives = '<div class="container columns is-vcentered">';
    let currElectives = 0;
    let numOutsideDept = 0;
    for (let i = 0; i < userCourses.length; i++) {
        if (isCompElective(userCourses[i], isBa)) {
            let dept = name.substring(0, 4);
            // BA only allows 2 outside-major courses
            if (!isBa || dept === "COMP" || numOutsideDept < 2){
                currElectives++;
                if ((currElectives - 1) % 3 === 0) {
                    electives += '</div> <div class="container columns is-vcentered">'
                }
                let course = getCourseObject(userCourses[i], allCourses);
                electives += generateCompletedClass(course);
                if (dept !== "COMP") {
                    numOutsideDept++;
                }
            }

        }
    }

    while (currElectives < numElectives) {
        let fakeCourse = {
            department: "COMP",
            number: "???",
            name: "COMP Elective",
            description: "A COMP course numbered >= 426, not including COMP 495, 496, 691H, and 692H",
            prerequisites: [],
        }
        currElectives++;
        if ((currElectives - 1) % 3 === 0) {
            electives += '</div> <div class="container columns is-vcentered">'
        }

        electives += generateUncompletedClass(fakeCourse, userCourses);
    }
    electives += '</div>';
    return electives;
}

export const handleBA = function (userCourses, allCourses) {
    let html = handleCoreRequirements(userCourses, allCourses);
    // Fourth level: 6 total COMP electives
    html += handleElectives(6, userCourses, allCourses, true);
    // 5th level: stor 155/psyc210/stor435
    html += '</div>';
    $root.append(html);
};

export const handleBS = function (userCourses) {
    let html = handleCoreRequirements(userCourses, allCourses);

    // TODO: finish
    html += '</div>';
    $root.append(html);
}

export const handleMinor = function (userCourses) {
    let html = handleCoreRequirements(userCourses, allCourses);

    html += handleElectives(2, userCourses,allCourses, false);

    html += '</div>';
    $root.append(html);

};


export const generateCompletedClass = function (course) {
    console.log(course)
    // Include: Button to uncomplete, class name/number, desc
    let card = `<div class="card complete-course column">
        <div class="card-content">
            <div class="title is-4 courseTitle is-marginless">
                ` + course.department + course.number + ": " + course.name + `
            </div>
            <p>
                ` + course.description + `
            </p>
        </div>
    </div>
    `;

    return card;
};

export const generateUncompletedClass = function (course, userCourses) {
    // Include: class name, prereqs (if they can take it or not), desc
    let prereqs = canTakeClass(course, userCourses);
    //All prereqs complete
    if (prereqs.length === 0) {
        return `<div class="card have-reqs-course column">
        <div class="card-content">
            <div class="title is-4 courseTitle is-marginless">
                ` + course.department + course.number + ": " + course.name + `
            </div>
            <p>
                ` + course.description + `
            </p>
        </div>
    </div>
    `;
    } else {
        return `<div class="card need-reqs-course column">
        <div class="card-content">
            <div class="title is-4 courseTitle is-marginless">
                ` + course.department + course.number + ": " + course.name + `
            </div>

            <p>
                ` + course.description + `
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