# COMP 426 frontend
 Frontend Repository for the prerequisite viewer 426 project

# Using the backend

Clone from `https://github.com/jay1723/prerequisite-viewer-backend.git`

Start the backend by navigating to the root directory of the backend project and running `npm run dev-live-reload`

## Creating a user

Once the server is up and running you can start to use the backend wrapper methods that I wrote. 

Call the `createUser(username, password, firstname, lastname, cstrack, gradyear)` method to create a user in the backend and instantiate all the appropriate user objects for that user. 

NOTE: This user must have a unique username otherwise the backend will reject them. This is a feature of the provided backend and not something that I added. 

```javascript
let data = await createUser("testMethod", "testMethod", "test", "method", "BS", 2019);
```

NOTE: This method saves the created user's jwt token to the local "cookie" storage but if a long enough period of time goes by the token becomes invalid and you need to login again to be authenticated. 

## Logging In
The key reason we need to log in is to refresh or get our `jwt` token. 

There are a few methods I have written to make logging in easy.

For maximal control you can use the barebones `login` method. This will return a response object that has the `jwt` inside it but it does not set the `jwt` in the local "cookie" storage.

```javascript
login(username, password)
```

For slightly less control but easier usage use `loginAndSetJWT` method that logs in and sets the resulting user's jwt in the local storage. Note that I haven't implemented any safety checks for this method so I assume that the user exists and do not fail gracefully if they don't. 

```javascript
let data = await loginAndSetJWT("tm11", "pass").then(() => {
        addClass(localStorage.getItem("jwt"), "COMP110")
    })
```

If you want status information about the user you can use the `loginAndGetStatus(username, password)`. It is invoked in teh same way as the previous 2 methods. 

## Where is the JWT?

I use a Storage object which I call `localStorage` (you can see this defined at the top of my backend.js file). The localStorage is essentially just a secure object that we can query with `getItem` and `setItem` and the `jwt` is stored under the key `jwt`.

```javascript
localStorage.setItem("jwt", "token")
let jwt = localStorage.getItem("jwt")
```

## Status

The status method is pretty straightforward. It will return information stored in the account datastore. 

```javascript
status(bearer) // bearer is the jwt token that is stored in the localstorage
```

## User methods

`addClass(bearer, classname)`
Add a class to the specified user's private subtree

`getClasses(bearer)` Get all the classes stored in the private datastore

`getUserClasses(bearer)` Get the classes for a specific user from their private subtree


