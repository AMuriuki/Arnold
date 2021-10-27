$(document).ready(function () {
    var currentPathname = window.location.pathname
    if (currentPathname.toLowerCase().indexOf("/property/details/") >= 0) {
        var request_viewing = getUrlVars()["request-viewing"];
        if (request_viewing === "true") {
            $('.modalTrigger').click();
        }
    }

    $('#gform_submit_button_close').click(function () {
        if ($('#modal-one').hasClass("modal--active")) {
            var e = document.getElementById("modal-one");
            e.classList.remove("modal--active");
        }
    })

    $('#gform_submit_icon_close').click(function () {
        if ($('#modal-one').hasClass("modal--active")) {
            var e = document.getElementById("modal-one");
            e.classList.remove("modal--active");
        }
    })

    $('.select2').select2();
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

