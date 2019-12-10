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

    /* Click handlers for Login, Sign Up, and Log Out buttons */
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
    try {
        await loginAndGetStatus(username, password)
    } catch(error) {
        $('#warning').remove()
        let html = 
            `<section class="section profile" id="warning">
                <div class="notification is-danger profile">
                    <p><span class="has-text-weight-bold">Woah there!  </span>Wrong username or password.</p>
                </div>
            </section>`;
        $root.prepend(html);
        return
    }
    await renderLoggedInContent()
}

export const renderLoginForm = function () {
    $root.empty();
    let html =
        `<section class="section profile" id="content">
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

    let res = await verifyEmail(email);
    
    if(!res.success){
        $("#emailerror").empty();
        $("#emailerror").append(`<div style="color:red">${res.msg}</div>`);
    }else{
        $("#emailerror").empty();
        try {
            // Create user 
            await createUser(username, password, firstname, lastname, cstrack, year, email)
        } catch(error) {
            $('#warning').remove()
            let html = 
                `<section class="section profile" id="warning">
                    <div class="notification is-danger profile">
                        <p><span class="has-text-weight-bold">Woah there!  </span>Fields missing or username already taken.</p>
                    </div>
                </section>`;
            $root.prepend(html);
            return
        }
        // Add username to public route
        await addUsernameToPublicRoute(username)
        // Customize site to user
        await renderLoggedInContent()
    }

}

export const renderSignUpForm = function () {
    $root.empty();
    let html =
        `<section class="section profile" id="content">
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
                        <label class="label">Email:</label>
                        <div class="control">
                            <input class="input"  type="text" id="signupForm_email">
                            <div id="emailerror"></div>
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
    $root.empty();
    
    let jwt = localStorage.getItem("jwt");
    let resp = await getClasses(jwt);
    let allCourses = resp.data.result;
    let body = await getUserClasses(jwt);
    let userCourses = body.data.result;
    let response = await getUserFields(jwt);
    let userData = response.data;
    let userTrack = userData.result.cstrack;
    $root.append(`<div class="container has-text-centered progress-header"> 
        <h1 class="title is-1"> Your Progress: `+userTrack+` </h1>
        <p class="is-italic"> Green courses have been taken, yellow courses can be taken, and red courses have prereqs remaining. </p>
    </div>`)

    if (userTrack === "BA") {
        handleBA(userCourses, allCourses);
    } else if (userTrack === "BS") {
        handleBS(userCourses, allCourses);
    } else {
        handleMinor(userCourses, allCourses);
    }

    removeProgressListeners(allCourses);
    addProgressListeners(allCourses);

};

// Returns string describing if they can take the class, or prereqs
// Returns empty string if there are no pre-reqs remaining
export const canTakeClass = function (course, userCoursesInput) {
    let response = "";
    let userCourses = userCoursesInput.slice();
    // Each ele represents a grouping of required reqs
    for (let i = 0; i < course.prerequisites.length; i++) {
        let reqs = course.prerequisites[i].split(",")
        let hasReq = false;
        for (let j = 0; j < reqs.length; j++) {
            if (userCourses.includes(reqs[j])) {
                // 523 fix: removes req after use
                userCourses = userCourses.filter((ele) => ele !== reqs[j]);
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
    let html = '<div id="progContainer" class="container">';
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
                if ((currElectives - 1) % 3 === 0 && currElectives !== 1) {
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
        currElectives++;
        if ((currElectives - 1) % 3 === 0 && currElectives !== 1) {
            electives += '</div> <div class="container columns is-vcentered">'
        }

        electives += generateElectiveClass(currElectives);
    }
    electives += '</div>';
    return electives;
}

// Takes in id num
export const generateElectiveClass = function (num) {
    console.log( "moreInfoElective"+num);
    return `<div id="progElective`+num+`" class="card have-reqs-course column" data-status="canTake">
        <div class="card-content card-content-class">
            <div class="title is-5 courseTitle is-marginless">
                COMP ???: COMP Elective
            </div>
        </div>
        <footer class="card-footer card-footer-class">
            <a id="moreInfoElective`+ num +`" class="card-footer-item">More Info</a>
        </footer>
    </div>
    `;
}

export const handleBA = function (userCourses, allCourses) {
    let html = handleCoreRequirements(userCourses, allCourses);
    // Fourth level: 6 total COMP electives
    html += handleElectives(6, userCourses, allCourses, true);
    // 5th level: stor 155/psyc210/stor435, COMP283
    let levelFive = '<div class="container columns is-vcentered">';
    //COMP 283
    if (userCourses.includes("COMP283")) {
        let course = getCourseObject("COMP283", allCourses);
        levelFive += generateCompletedClass(course, userCourses);
    } else if (userCourses.includes("MATH381")) {
        let course = getCourseObject("MATH381", allCourses);
        levelFive += generateCompletedClass(course, userCourses);
    } else {
        let course = getCourseObject("COMP283", allCourses);
        levelFive += generateUncompletedClass(course, userCourses);
        levelFive += 'OR';
        course = getCourseObject("MATH381", allCourses);
        levelFive += generateUncompletedClass(course, userCourses);

    }
    //STOR 155, PSYC210, STOR435
    if (userCourses.includes("STOR155")) {
        let course = getCourseObject("STOR155", allCourses);
        levelFive += generateCompletedClass(course, userCourses);
    } else if (userCourses.includes("PSYC210")) {
        let course = getCourseObject("PSYC210", allCourses);
        levelFive += generateCompletedClass(course, userCourses);
    } else if (userCourses.includes("STOR435")) {
        let course = getCourseObject("STOR435", allCourses);
        levelFive += generateCompletedClass(course, userCourses);
    } else {
        levelFive += '</div> <div class="container columns is-vcentered">';
        let course = getCourseObject("STOR155", allCourses);
        levelFive += generateUncompletedClass(course, userCourses);
        levelFive += 'OR';
        course = getCourseObject("PSYC210", allCourses);
        levelFive += generateUncompletedClass(course, userCourses);
        levelFive += 'OR';
        course = getCourseObject("STOR435", allCourses);
        levelFive += generateUncompletedClass(course, userCourses);
    }

    html += levelFive + '</div>';

    html += '</div>';
    $root.append(html);
};

export const handleBS = function (userCourses, allCourses) {
    let html = handleCoreRequirements(userCourses, allCourses);
    //COMP 455, 550
    let levelFour = '<div class="container columns is-vcentered">';
    if (userCourses.includes("COMP455")) {
        let course = getCourseObject("COMP455", allCourses);
        levelFour += generateCompletedClass(course);
    } else {
        let course = getCourseObject("COMP455", allCourses);
        levelFour += generateUncompletedClass(course, userCourses);
    }

    if (userCourses.includes("COMP550")) {
        let course = getCourseObject("COMP550", allCourses);
        levelFour += generateCompletedClass(course);
    } else {
        let course = getCourseObject("COMP550", allCourses);
        levelFour += generateUncompletedClass(course, userCourses);
    }

    html+= levelFour + '</div>';

    // 5th level: stor435, COMP283
    let levelFive = '<div class="container columns is-vcentered">';
    //COMP 283
    if (userCourses.includes("COMP283")) {
        let course = getCourseObject("COMP283", allCourses);
        levelFive += generateCompletedClass(course, userCourses);
    } else if (userCourses.includes("MATH381")) {
        let course = getCourseObject("MATH381", allCourses);
        levelFive += generateCompletedClass(course, userCourses);
    } else {
        let course = getCourseObject("COMP283", allCourses);
        levelFive += generateUncompletedClass(course, userCourses);
        levelFive += 'OR';
        course = getCourseObject("MATH381", allCourses);
        levelFive += generateUncompletedClass(course, userCourses);
    }
    //STOR435
    if (userCourses.includes("STOR435")) {
        let course = getCourseObject("STOR435", allCourses);
        levelFive += generateCompletedClass(course);
    } else {
        let course = getCourseObject("STOR435", allCourses);
        levelFive += generateUncompletedClass(course, userCourses);
    }

    html += levelFive + '</div>';

    html += handleElectives(5, userCourses, allCourses, false);
    //math 232,233,547
    let levelEight = '<div class="container columns is-vcentered">';
    //232
    if (userCourses.includes("MATH232")) {
        let course = getCourseObject("MATH232", allCourses);
        levelEight += generateCompletedClass(course);
    } else {
        let course = getCourseObject("MATH232", allCourses);
        levelEight += generateUncompletedClass(course, userCourses);
    }

    //233
    if (userCourses.includes("MATH233")) {
        let course = getCourseObject("MATH233", allCourses);
        levelEight += generateCompletedClass(course);
    } else {
        let course = getCourseObject("MATH233", allCourses);
        levelEight += generateUncompletedClass(course, userCourses);
    }

    //547
    if (userCourses.includes("MATH547")) {
        let course = getCourseObject("MATH547", allCourses);
        levelEight += generateCompletedClass(course);
    } else {
        let course = getCourseObject("MATH547", allCourses);
        levelEight += generateUncompletedClass(course, userCourses);
    }

    html += levelEight + '</div>';

    //phys 116/118, 
    let levelNine = '<div class="container columns is-vcentered">';
    if (userCourses.includes("PHYS116")) {
        let course = getCourseObject("PHYS116", allCourses);
        levelNine += generateCompletedClass(course);
    } else if (userCourses.includes("PHYS118")) {
        let course = getCourseObject("PHYS118", allCourses);
        levelNine += generateCompletedClass(course);
    } else {
        let course = getCourseObject("PHYS116", allCourses);
        levelNine += generateUncompletedClass(course, userCourses);
        levelNine += 'OR';
        course = getCourseObject("PHYS118", allCourses);
        levelNine += generateUncompletedClass(course, userCourses);
    }
    html += levelNine + '</div>';
    
    //second science
    html += handleSecondScience(userCourses, allCourses);


    html += '</div>';
    $root.append(html);
}

export const handleSecondScience = function (userCourses, allCourses) {
    let courseOptions = ["ASTR101", "BIOL101", "BIOL202", "BIOL205", "CHEM101", "CHEM102", "GEOL101", "PHYS115", "PHYS117", "PHYS119", "PHYS351", "PHYS352"];
    let hasScience = false;
    let scienceCourse = null;
    for (let i = 0; i < courseOptions.length && !hasScience; i++) {
        for (let j = 0; j < userCourses.length && !hasScience; j++) {
            if (userCourses[j] === courseOptions[i]) {
                hasScience = true;
                scienceCourse = userCourses[i];
            }
        }
    }

    if (hasScience) {
        let course = getCourseObject(scienceCourse, allCourses);
        return '<div class="container columns is-vcentered">' + generateCompletedClass(course) + '</div>';
    }

    let html = '<div class="container columns is-vcentered">';
    for (let i = 0; i < courseOptions.length; i++) {
        if ((i) % 3 === 0 && i !== 0) {
            html += '</div><div class="container columns is-vcentered">'
        }
        let course = getCourseObject(courseOptions[i], allCourses);
        if (i !== 0) {
            html += "OR"
        }
        html += generateUncompletedClass(course, userCourses);
    }
    html += "</div>";
    return html;

}


export const handleMinor = function (userCourses, allCourses) {
    let html = handleCoreRequirements(userCourses, allCourses);

    html += handleElectives(2, userCourses, allCourses, false);

    html += '</div>';
    $root.append(html);

};


export const generateCompletedClass = function (course) {
    console.log(course)
    // Include: Button to uncomplete, class name/number, desc
    let card = `<div id="prog`+course.department+course.number+`" class="card complete-course column" data-status="complete">
        <div class="card-content card-content-class">
            <div class="title is-5 courseTitle is-marginless">
                ` + course.department + course.number + ": " + course.name + `
            </div>
        </div>
        <footer class="card-footer card-footer-class">
            <a id="moreInfo`+ course.department + course.number +`" class="card-footer-item">More Info</a>
        </footer>
    </div>
    `;

    return card;
};

export const removeProgressListeners = function (obj) {
    let courses = Object.values(obj);
    for (let i = 0; i < courses.length; i++) {
        let course = courses[i];
        $("body").off("click", "#moreInfo"+course.department+course.number,{
            course: course,
        }, showCourseInfo)
        $("body").off("click", "#lessInfo"+course.department+course.number,{
            course: course,
        }, showCourseTitle)
        $("body").off("click", "#takeClass"+course.department+course.number,{
            course: course,
        }, addClassFromProg)
        
    }   
    for (let i = 1 ; i < 7; i++) {
        $("body").off("click", "#moreInfoElective"+i,{
            number: i,
        }, showElectiveInfo)
        $("body").off("click", "#lessInfoElective"+i,{
            number: i,
        }, showElectiveTitle)
    }
}

export const addProgressListeners = function (obj) {
    let courses = Object.values(obj);
    for (let i = 0; i < courses.length; i++) {
        let course = courses[i];
        $("body").on("click", "#moreInfo"+course.department+course.number,{
            course: course,
        }, showCourseInfo)
        $("body").on("click", "#lessInfo"+course.department+course.number,{
            course: course,
        }, showCourseTitle)
        $("body").on("click", "#takeClass"+course.department+course.number,{
            course: course,
        }, addClassFromProg)
    }

    for (let i = 1; i < 7; i++) {
        console.log( "#moreInfoElective"+i);
        $("body").on("click", "#moreInfoElective"+i,{
            number: i,
        }, showElectiveInfo)
        $("body").on("click", "#lessInfoElective"+i,{
            number: i,
        }, showElectiveTitle)
    }
}

export const addClassFromProg = async function (event) {
    let jwt = localStorage.getItem("jwt");
    let course = event.data.course;
    await addClass(jwt, course.department+course.number);
    handleProgressNavClick();
    // let id = "#prog"+course.department+course.number;
    // $(id).replaceWith(generateCompletedClass(course));
    
}

export const showElectiveInfo = function (event) {
    let id = "#progElective" + event.data.number;
    $(id).replaceWith(`<div id="progElective`+event.data.number+`" class="card have-reqs-course column">
        <div class="card-content card-content-class course-desc">
            <p>
                A COMP course numbered >= 426, not including COMP 495, 496, 691H, and 692H
            </p>
        </div>
        <footer class="card-footer card-footer-class">
            <a id="lessInfoElective`+ event.data.number +`" class="card-footer-item">Less Info</a>
        </footer>
    </div>
    `); 

}

export const showElectiveTitle = function (event) {
    let id = "#progElective" + event.data.number;
    $(id).replaceWith(`<div id="progElective`+event.data.number+`" class="card have-reqs-course column">
        <div class="card-content card-content-class">
            <div class="title is-5 courseTitle is-marginless">
                COMP ???: COMP Elective
            </div>
        </div>
        <footer class="card-footer card-footer-class">
            <a id="moreInfoElective`+ event.data.number +`" class="card-footer-item">More Info</a>
        </footer>
    </div>
    `); 
}

export const showCourseInfo = function (event) {
    let course = event.data.course;
    let id = "#prog"+course.department+course.number;
    let status = $(id).attr("data-status");
    let styleClass;
    let prereqs;
    if (status === "complete") {
        styleClass = "complete-course";
    } else if (status === "canTake") {
        styleClass = "have-reqs-course";
    } else {
        styleClass = "need-reqs-course";
        prereqs = $(id).attr("data-prereqs")
    }

    $(id).replaceWith(`<div id="prog`+course.department+course.number+`" class="card `+ styleClass +` column" data-status="`+status+`" `+((status === "needReqs")?` data-prereqs="`+prereqs+`"`:"")+`>
        <div class="card-content card-content-class course-desc">

            <p>
                ` + course.description + `
            </p>
            `+ ((status === "needReqs") ? `<p class="is-italic">
                ` + prereqs + `.
             </p>` : "")+`
        </div>
        <footer class="card-footer card-footer-class">
            <a id="lessInfo`+ course.department + course.number +`" class="card-footer-item">Less Info</a>
            `+ ((status === "canTake")? `<a id="takeClass`+ course.department + course.number +`" class="card-footer-item">Add Class</a>`: "") + `
        </footer>
    </div>
    `);   
}

export const showCourseTitle = function (event) {
    let course = event.data.course;
    let id = "#prog"+course.department+course.number;
    let status = $(id).attr("data-status");
    let styleClass;
    let prereqs;
    if (status === "complete") {
        styleClass = "complete-course";
    } else if (status === "canTake") {
        styleClass = "have-reqs-course";
    } else {
        styleClass = "need-reqs-course";
        prereqs = $(id).attr("data-prereqs")
    }

    $(id).replaceWith(`<div id="prog`+course.department+course.number+`" class="card `+ styleClass +` column" data-status="`+status+`" `+((status === "needReqs")?` data-prereqs="`+prereqs+`"`:"")+`>
        <div class="card-content card-content-class">
            <div class="title is-5 courseTitle is-marginless">
                ` + course.department + course.number + ": " + course.name + `
            </div>
        </div>
        <footer class="card-footer card-footer-class">
            <a id="moreInfo`+ course.department + course.number +`" class="card-footer-item">More Info</a>
            `+ ((status === "canTake")? `<a id="takeClass`+ course.department + course.number +`" class="card-footer-item">Add Class</a>`: "") + `
        </footer>
    </div>
    `); 
}

export const generateUncompletedClass = function (course, userCourses) {
    // Include: class name, prereqs (if they can take it or not), desc
    let prereqs = canTakeClass(course, userCourses);
    //All prereqs complete
    if (prereqs.length === 0) {
        return `<div id="prog`+course.department+course.number+`" class="card have-reqs-course column" data-status="canTake">
        <div class="card-content card-content-class">
            <div class="title is-5 courseTitle is-marginless">
                ` + course.department + course.number + ": " + course.name + `
            </div>
        </div>
        <footer class="card-footer card-footer-class">
            <a id="moreInfo`+ course.department + course.number +`" class="card-footer-item">More Info</a>
            <a id="takeClass`+ course.department + course.number +`" class="card-footer-item">Add Class</a>
        </footer>
    </div>
    `;
    } else {
        return `<div id="prog`+course.department+course.number+`" class="card need-reqs-course column" data-status="needReqs" data-prereqs="`+prereqs+`">
        <div class="card-content card-content-class">
            <div class="title is-5 courseTitle is-marginless">
                ` + course.department + course.number + ": " + course.name + `
            </div>
        </div>
        <footer class="card-footer card-footer-class">
            <a id="moreInfo`+ course.department + course.number +`" class="card-footer-item">More Info</a>
        </footer>
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
                    <p>Our site can help you plan out your Computer Science degree, whether it's a minor, B.A., or B.S. Use our tool to build your custom route through CS Classes at UNC, and make sure you're fulfilling all your requirements. Our site makes tracking your path easy so you can be successful in your college career.
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
                            <h5 class="subtitle has-text-grey">A Degree for a Bright Future</h5>
                            <p>Computer Science is one of the fastest growing majors here at UNC. A wide variety of courses taught by world class faculty will give you the knowledge you need for a prosperous career in compsci.</p>
                            <p>Still not sure if CS is right for you? Make an account and check out the requirements and offered classes. You may find that a minor in computer science is worth your time.</p>
                        </div>
                        <div class="column">
                            <h1 class="title">Plan Early</h1>
                            <h5 class="subtitle has-text-grey">Early planning will lead to success</h5>
                            <p>Make sure to start planning early, as CS has a strong progression to its classes. By covering the basic requirements sooner, there will be more opportunity to take electives that are relevant and interesting to you personally.</p>
                            <p>Still not sure if CS is right for you? Building out a plan through our fre site will show you what you need, and you may find more overlap with your own major than you expect. Try it now! </p>

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
