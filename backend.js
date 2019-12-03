const server = "http://localhost:3000/";

// Essentially a cookie but not quite. where I store the jwt token. Don't store it in a local variable as that isn't secure.
let localStorage = window.localStorage;

// INTERNAL METHODS, DON'T USE THESE  ========================================================
/* Create a new user. This will not return the JWT token you need. Login still required */
/**
 * 
 * @param {string} username Must be unique. Server complains otherwise
 * @param {string} password 
 * @param {string} firstname 
 * @param {string} lastname 
 * @param {string} cstrack {BS or BA}
 * @param {number} gradyear 
 */
export async function create(username, password, firstname, lastname, cstrack, gradyear) {
    const result = await axios({
        method: 'post',
        url: server + "account/create",
        data: {
            name: username,
            pass: password,
            data: {
                firstname: firstname,
                lastname: lastname,
                cstrack: cstrack,
                gradyear: gradyear
            }
        }
    })
    return result.status;
}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns response object that should contain the JWT token and the name of the user
 */
export async function login(username, password) {
    const result = await axios({
        method: 'post',
        url: server + "account/login",
        data: {
            name: username,
            pass: password
        }
    })
    return result;
}

/**
 * 
 * @param {string} bearer the JWT bearer token for the user you are attempting to get the status of
 * @returns name and other user related information 
 */
export async function status(bearer) {
    try {
        const result = await axios({
            method: 'get',
            url: server + "account/status",
            headers: {
                Authorization: `Bearer ${bearer}`
            }
        })
        return result;
    } catch (e) {
        return e
    }
}
// END INTERNAL METHODS. USE STUFF BELOW THIS ========================================================

export async function loginAndSetJWT(username, password) {
    login(username, password).then(result => {
        // Save the jwt token to the localstorage
        localStorage.setItem("jwt", result.data.jwt);
        return result;
    })
}
/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns data object. Stores the jwt token in the localstorage Storage object 
 */
export async function loginAndGetStatus(username, password) {
    // login
    login(username, password).then(result => {
        // Save the jwt token to the localstorage
        localStorage.setItem("jwt", result.data.jwt);
        // get the status and return it
        status(result.data.jwt).then(res => {
            return res;
        })
    })
};

export async function createUser(username, password, firstname, lastname, cstrack, gradyear) {
    // Create the user in the backend and assign a unique jwt token
    create(username, password, firstname, lastname, cstrack, gradyear).then(ret => {
        // Login so that we set can get the jwt token
        login(username, password).then(res => {
            // Actually set the jwt token
            localStorage.setItem("jwt", res.data.jwt)
            // Create an empty user object in the users.json tree that we can append classes to
            createUserObject(localStorage.getItem("jwt")).then(resp => {
                return resp;
            })
        })
    })
}

/**
 * 
 * @param {string} bearer jwt token
 * @param {string} classname the name of the class you are adding
 */
export async function addClass(bearer, classname) {
    const result = await axios({
        method: 'post',
        url: server + "user/classes",
        headers: {
            Authorization: `Bearer ${bearer}`
        },
        data: {
            "data": classname,
            "type": "merge"
        },
    })
    return result
};

/**
 * 
 * @param {string} bearer jwt token. 
 * @returns Classes for the user associated with the jwt token. 
 */
export async function getUserClasses(bearer) {
    const result = await axios({
        method: 'get',
        url: server + "user/classes",
        headers: {
            Authorization: `Bearer ${bearer}`
        }
    })
    return result;
}

// May or may not actually add this functionality. MVP only requires us to be able to add classes. Potential Feature
// async function removeClass();

// This is where we will use the private store. I will put all of the classes in the private store under the classes label and we can query it only if we are logged in. 
export async function getClasses(bearer) {
    const result = await axios({
        method: 'get',
        url: server + "private/classes",
        headers: {
            Authorization: `Bearer ${bearer}`
        }
    })
    return result;
}

export async function createUserObject(bearer) {
    const result = await axios({
        method: 'post',
        url: server + "user/classes",
        data: {
            "data": []
        },
        headers: {
            Authorization: `Bearer ${bearer}`
        }
    })
    return result;
}


// ================= PLAYGROUND ==========================

(async () => {
    // let {
    //     data
    // } = await getUserClasses(localStorage.getItem("jwt"))
    // console.log(data)
    // let {
    //     data
    // } = await getClasses(localStorage.getItem("jwt"))
    // console.log(data)
    // let data = await createUser("testMethod", "testMethod", "test", "method", "BS", 2019);
    // let data = await createUser("tm14", "pass", "tm6", "tm6", "BS", 2018)
    let data = await loginAndSetJWT("tm11", "pass").then(() => {
        addClass(localStorage.getItem("jwt"), "COMP110")
    })
    // let {
    //     data
    // } = await getClasses(localStorage.getItem("jwt"))
    // console.log(data)
    // createUserObject("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1ldGhvZCIsImlhdCI6MTU3NTI2NDE4OCwiZXhwIjoxNTc3ODU2MTg4fQ.CIzOmAIKBsQMh9sewtVnFEoWx02JAylEkAKvM2dIxL0")
})();