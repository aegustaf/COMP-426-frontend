export const $root = $('#root');

export const setUp = function() {
    /* Click handlers for Login and Sign Up buttons */
    $(document).on("click", "#logo", handleHomeNavClick);
    $(document).on("click", "#loginButton", handleLoginButtonClick);
    $(document).on("click", "#signupButton", handleSignUpButtonClick);

    // $(document).on("click", "#submitLogin", handleLoginSubmit);
    // $(document).on("click", "#submitSignup", handleSignUpSubmit);
 
    
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

/*----------------------------------------- LOGIN TAB -------------------------------------------*/

export const handleLoginButtonClick = function() {
    renderLoginForm();
};

export const renderLoginForm = function() {
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
                                <input class="input"  type="text">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Password:</label>
                            <div class="control">
                                <input class="input"  type="text">
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

export const handleSignUpButtonClick = function() {
    renderSignUpForm();
};

export const renderSignUpForm = function() {
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
                            <input class="input"  type="text">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password:</label>
                        <div class="control">
                            <input class="input"  type="text">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">First Name:</label>
                        <div class="control">
                            <input class="input"  type="text">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Last Name:</label>
                        <div class="control">
                            <input class="input"  type="text">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">CS Track:</label>
                        <div class="control">
                            <label class="radio">
                                <input type="radio" name="track" checked >
                                COMP BA
                            </label>
                            <label class="radio">
                                <input type="radio" name="track">
                                COMP BS
                            </label>
                            <label class="radio">
                                <input type="radio" name="track" >
                                COMP Minor
                            </label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Graduation Year:</label>
                        <div class="control">
                            <input class="input"  type="text">
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
export const handleFindNavClick = function() {

};

/*----------------------------------------- PROGRESS TAB -------------------------------------------*/

/* Handles when user clicks on Progress tab in nav bar */
export const handleProgressNavClick = function() {
  
};

/*----------------------------------------- ADD COMPLETED COURSES TAB -------------------------------------------*/

/* Handles when user clicks on Add CompetedCourses tab in nav bar */
export const handleAddNavClick = function() {

};

/*----------------------------------------- PROFILE TAB -------------------------------------------*/

/* Handles when user clicks on Profile tab in nav bar */
export const handleProfileNavClick = function() {
    renderProfile();
};

/* Renders user's profile card */
export const renderProfile = function() {
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
                        <b>Username:  </b>  aegustaf
                        <br><br>
                        <b>Name:  </b>  Amanda Gustafson
                        <br><br>
                        <b>CS Track: </b>  COMP BA
                        <br><br>
                        <b>Graduation Year: </b>  2020
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

export const handleSubmitEditProfileClick = function() {

};

/* Handles when user clicks cancel on profile edit form */
export const handleCancelEditProfileClick = function() {
    renderProfile();
};

/* Handles when user clciks on edit button for their profile */
export const handleEditProfileClick = function() {
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
                            <input class="input"  type="text" value="Amanda">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Last Name:</label>
                        <div class="control">
                            <input class="input" type="text" value="Gustafson">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">CS Track:</label>
                        <div class="control">
                            <label class="radio">
                                <input type="radio" name="track" checked>
                                COMP BA
                            </label>
                            <label class="radio">
                                <input type="radio" name="track">
                                COMP BS
                            </label>
                            <label class="radio">
                                <input type="radio" name="track" >
                                COMP Minor
                            </label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Graduation Year:</label>
                        <div class="control">
                            <input class="input"  type="text" value="2020">
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
};


/*----------------------------------------- HOME TAB -------------------------------------------*/

/* Handles when user clicks on Home tab in nav bar */
export const handleHomeNavClick = function() {
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
};


$(function() {
    setUp();
});