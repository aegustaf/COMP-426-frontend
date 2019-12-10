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
export async function create(username, password) {
    const result = await axios({
        method: 'post',
        url: server + "account/create",
        data: {
            name: username,
            pass: password
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
    const result = await axios({
        method: 'get',
        url: server + "account/status",
        headers: {
            Authorization: `Bearer ${bearer}`
        }
    })

    return result;

}
// END INTERNAL METHODS. USE STUFF BELOW THIS ========================================================


export async function loginAndSetJWT(username, password) {
    let result = await login(username, password)
    localStorage.setItem("jwt", result.data.jwt)
    return result
}
/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns data object. Stores the jwt token in the localstorage Storage object 
 */
export async function loginAndGetStatus(username, password) {
    let result = await login(username, password)
    localStorage.setItem("jwt", result.data.jwt)
    let res = await status(localStorage.getItem("jwt"))
    return res
};

export async function createUser(username, password, firstname, lastname, cstrack, gradyear, email) {
    await create(username, password)
    let res = await login(username, password)
    localStorage.setItem("jwt", res.data.jwt)
    // let resp = await createUserObject(localStorage.getItem("jwt"))
    // let ret = await populateUserFields(localStorage.getItem("jwt"), firstname, lastname, cstrack, gradyear)
    await createUserObject(localStorage.getItem("jwt"))
    await populateUserFields(localStorage.getItem("jwt"), firstname, lastname, cstrack, gradyear, email)
    return res;
}

//Calls a 3rd party API https://mailboxlayer.com/documentation
export async function verifyEmail(email){
    //const access_key = "818747c61f4898480de42012655d607e"
    try {
        const result = await axios({
            method: 'post',
            url: "https://apilayer.net/api/check?access_key=818747c61f4898480de42012655d607e&email="+email,
        })
        console.log(result.data);
        
        if(result.data.hasOwnProperty('error')){
            return {success: false, msg: result.data.error.info};
        }else{
            if(result.data.did_you_mean!=""){
                let str = "Did you mean: "+result.data.did_you_mean;
                return {success: false, msg: str};
            }else if(!result.data.format_valid){
                return {success: false, msg: "Invalid email."};
            }else if(!result.data.smtp_check){
                return {success: false, msg: "Nonexistent email."};
            }else{
                return {success: true, msg: "Email verified."};
            }
        }

    } catch (error) {
        console.log(error);
        
    }
    return {success:false, msg:"Something went wrong."};
    
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

// Populates the user route with the users personal information
export async function populateUserFields(bearer, firstname, lastname, cstrack, gradyear, email) {
    const result = await axios({
        method: 'post',
        url: server + "user/userData",
        data: {
            data: {
                firstname: firstname,
                lastname: lastname,
                cstrack: cstrack,
                gradyear: gradyear,
                email: email,
            }
        },
        headers: {
            Authorization: `Bearer ${bearer}`
        }
    })
    console.log(result);
    return result
}

// Get the specific user fields. Should return firstname, lastname, gradyear, cstrack
export async function getUserFields(bearer) {
    const result = await axios({
        method: 'get',
        url: server + "user/userData",
        headers: {
            Authorization: `Bearer ${bearer}`
        }
    })
    return result
}
export async function editFirstname(bearer, firstname) {
    const result = await axios({
        method: 'post',
        url: server + "user/userData/firstname",
        data: {
            data: firstname
        },
        headers: {
            Authorization: `Bearer ${bearer}`
        }

    })
    return result;
}

export async function editLastname(bearer, lastname) {
    const result = await axios({
        method: 'post',
        url: server + "user/userData/lastname",
        data: {
            data: lastname
        },
        headers: {
            Authorization: `Bearer ${bearer}`
        }

    })
    return result;
}

export async function editCSTrack(bearer, cstrack) {
    const result = await axios({
        method: 'post',
        url: server + "user/userData/cstrack",
        data: {
            data: cstrack
        },
        headers: {
            Authorization: `Bearer ${bearer}`
        }

    })
    return result;
}

export async function editGradYear(bearer, gradyear) {
    const result = await axios({
        method: 'post',
        url: server + "user/userData/gradyear",
        data: {
            data: gradyear
        },
        headers: {
            Authorization: `Bearer ${bearer}`
        }

    })
    return result;
}

// Brute force way of deleting a class from the user route
export async function deleteClass(bearer, classname) {
    let result = await getUserClasses(bearer)
    let classes = result.data.result
    let remaining = []
    for (let i = 0; i < classes.length; i++) {
        if (classes[i] == classname || classes[i] == null) {
            continue
        }
        remaining.push(classes[i])
    }
    const res = await axios({
        method: 'post',
        url: server + "user/classes",
        data: {
            "data": remaining
        },
        headers: {
            Authorization: `Bearer ${bearer}`
        }
    })
    return res;
}
// ================= PLAYGROUND ==========================

(async () => {
    // let v = await createUser("testDelete", "pass", "testUpdate", "oldLastname", "BS", 2019)
    // await addClass(localStorage.getItem("jwt"), "COMP110")
    // await addClass(localStorage.getItem("jwt"), "COMP401")
    // await addClass(localStorage.getItem("jwt"), "COMP410")

    // await deleteClass(localStorage.getItem("jwt"), "COMP110")

    // let v = await getUserFields(localStorage.getItem("jwt"))
    // let v = await editFirstname(localStorage.getItem('jwt'), "yup the update is the best")
    // let v = await editLastname(localStorage.getItem("jwt"), "woo lastname update works")
    // console.log(v)
    // let v = await editFirstname(localStorage.getItem("jwt"), "newFirstname")
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
    // let data = await loginAndSetJWT("tm11", "pass").then(() => {
    //     addClass(localStorage.getItem("jwt"), "COMP110")
    // })
    // let {
    //     data
    // } = await getClasses(localStorage.getItem("jwt"))
    // console.log(data)
    // createUserObject("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1ldGhvZCIsImlhdCI6MTU3NTI2NDE4OCwiZXhwIjoxNTc3ODU2MTg4fQ.CIzOmAIKBsQMh9sewtVnFEoWx02JAylEkAKvM2dIxL0")
})();