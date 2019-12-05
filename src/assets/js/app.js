/// <reference path="oidc-client.js" />

///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.NONE;

var settings = {
    authority: "https://lab.azaas.com:51024/oauth",
    client_id: "azaas_ids_client_js",
    redirect_uri: window.location.protocol + "//" + window.location.host,
    post_logout_redirect_uri: window.location.protocol + "//" + window.location.host,

    // these two will be done dynamically from the buttons clicked, but are
    // needed if you want to use the silent_renew
    response_type: "id_token token",
    scope: "api read write",

    // silent renew will get a new access_token via an iframe 
    // just prior to the old access_token expiring (60 seconds prior)
    // silent_redirect_uri: window.location.protocol + "//" + window.location.host + "/silent_renew.html",
    automaticSilentRenew: true,

    // will raise events for when user has performed a logout at IdentityServer
    monitorSession : true,

    // this will allow all the OIDC protocol claims to vbe visible in the window. normally a client app 
    // wouldn't care about them or want them taking up space
    filterProtocolClaims: true,

    // this will use the user info endpoint if it's an OIDC request and there's an access_token
    loadUserInfo: true
};
var mgr = new Oidc.UserManager(settings);

///////////////////////////////
// events
///////////////////////////////
var user;
var timer;
mgr.events.addUserLoaded(function (u) {
    user = u;
    console.log("user loaded");
    localStorage.setItem('auth-token', user.access_token);
    showUser(user);
});

mgr.events.addUserUnloaded(function () {
    user = null;
    console.log("user unloaded");
    showUser();
});

mgr.events.addAccessTokenExpiring(function () {
    console.log("token expiring");
});

mgr.events.addAccessTokenExpired(function () {
    console.log("token expired");

  localStorage.removeItem('auth-token');
    showUser(user);
});

mgr.events.addSilentRenewError(function (e) {
    console.log("silent renew error", e.message);
});

mgr.events.addUserSignedOut(function () {
    console.log("user signed out");
});

// functions for UI elements
///////////////////////////////
function signIn(scope, response_type) {
    mgr.signinRedirect({ scope: scope, response_type: response_type }).then(null, function (e) {
        console.log(e);
    });
}

function signInCallback() {
    mgr.signinRedirectCallback().then(function (user) {
        var hash = window.location.hash.substr(1);
        var result = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
        console.log(result);
    }).catch(function (error) {
        console.log(error);
    });
}

function signOut() {
    mgr.signoutRedirect();
}

//function checkSessionState(user) {
//    mgr.metadataService.getCheckSessionIframe().then(function (url) {
//        if (url && user && user.session_state) {
//            console.log("setting up check session iframe for session state", user.session_state);
//            document.getElementById("rp").src = "check_session.html#" +
//                "session_state=".session_state +
//                "&check_session_iframe=" + url +
//                "&client_id=" + mgr.settings.client_id
//            ;
//        }
//        else {
//            console.log("no check session url, user, or session state: not setting up check session iframe");
//            document.getElementById("rp").src = "about:blank";
//        }
//    });
//}

//window.onmessage = function (e) {
//    if (e.origin === window.location.protocol + "//" + window.location.host && e.data === "changed") {
//        console.log("user session has changed");
//        mgr.removeUser();
//        mgr.signinSilent().then(function () {
//            // Session state changed but we managed to silently get a new identity token, everything's fine
//            console.log('renewTokenSilentAsync success');
//        }).catch(function (err) {
//            // Here we couldn't get a new identity token, we have to ask the user to log in again
//            console.log('renewTokenSilentAsync failed', err.message);
//        });
//    }
//}

///////////////////////////////
// init
///////////////////////////////

// clears any old stale requests from storage
mgr.clearStaleState().then(function () {
    console.log("Finished clearing old state");
}).catch(function (e) {
    console.error("Error clearing state:", e.message);
});

// checks to see if we already have a logged in user
mgr.getUser().then(function (user) {
  if (!localStorage.getItem('auth-token')) {
    showUser(user);
  }
}).catch(function (e) {
    console.log(e);
});

// checks to see if the page being loaded looks like a login callback
if (window.location.hash) {
    signInCallback();
}

function showUser(user) {
    if (!user) {
      signIn('api read write', 'token');
    }
}
