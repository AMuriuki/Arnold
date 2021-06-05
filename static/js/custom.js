$(document).ready(function () {
    console.log(window.location.pathname);
    console.log(window.location.href);
    console.log(window.location.origin);
    var currentPathname = window.location.pathname
    if (currentPathname === "/property.html") {
        var request_viewing = getUrlVars()["request-viewing"];
        if (request_viewing === "true") {
            $('.modalTrigger').click();
        }
    }
});

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}