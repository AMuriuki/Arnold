var currentPathname = window.location.pathname
$(document).ready(function () {
    if (currentPathname.toLowerCase().indexOf("/property/details/") >= 0) {
        var request_viewing = getUrlVars()["request-viewing"];
        if (request_viewing === "true") {
            $('.modalTrigger').click();
        }
    }

    if (currentPathname.toLowerCase().indexOf("/property/properties/") >= 0) {
        sessionStorage.clear();
        loadQuery("/property/get_properties");
        updateQuerySet();
        $('#category').change(function () {
            sessionStorage.clear();
            changeCategory($(this).val())
        })
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


function changeCategory(category) {
    sessionStorage.setItem("category", category);
    if (category) {
        updateURLParameter(window.location.href, 'category', category)
    }
    else {
        removeParam("category");
    }
    renderList()
}

var queryset;
var count;

async function loadQuery(url) {
    const request = new Request(
        url,
        { headers: { "X-CSRFToken": getCookie("csrftoken") } }
    );
    const config = {
        method: 'POST',
        mode: 'same-origin'
    };
    try {
        const fetchResponse = await fetch(request, config);
        results = await fetchResponse.json();
        count = results['count']
        queryset = results['queryset']
        return queryset;
    } catch (e) {
        return e;
    }
}

async function updateQuerySet() {
    if (!count) {
        setTimeout(updateQuerySet, 250);
    }
    else {
        chunkSize = 1000;
        for (var i = 1000; i < count; i += chunkSize) {
            var lastIndex = i + chunkSize
            const rawResponse = await fetch(getUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({ begin: i, end: lastIndex })
            })
            const content = await rawResponse.json();
            for (var record = 0; record < content['queryset'].length; record++) {
                queryset.push(content['queryset'][record])
            }
        }
        return queryset;
    }
}

async function renderList() {
    if (!queryset) {
        setTimeout(renderList, 250); // check every 0.25 secs for queryset
    }
    else {
        if (currentPathname.toLowerCase().indexOf("/property/properties/") >= 0) {
            unfilteredList = queryset
            filtered_list = filterList(unfilteredList);
            displayList(filtered_list);
        }
    }
}


function filterList(list) {
    category = sessionStorage.getItem("category");
    if (category) {
        list = list.filter(function (item) {
            return item.category__id === parseInt(category)
        })
    }
    return list
}

function displayList(filtered_list) {
    if (currentPathname.toLowerCase().indexOf("/property/properties/") >= 0) {
        var property_row = document.getElementById('dv_propertyrow');
        $('#dv_propertyrow').empty();
        $('.pagination').hide();
        property_list = filtered_list
        console.log(Object.keys(property_list).length)
        if (Object.keys(property_list).length === 0) {
            $("<div class='single-property--sold'><p>There are currently no properties with this tag</p></div>").appendTo('#dv_propertyrow');
        }
        else {
            if (property_list.length > 1) {
                records_per_page = 1
                current_page = 1
                changePage(current_page, property_list)
            }
            else {
                singlePage(property_list)
            }
        }
    }
}

// Pagination Functions
var current_page;
var records_per_page;

function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    };
};

function nextPage() {
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function changePage(page, list) {
    console.log("!!!");
    $('.pagination').show();
    
    url = window.location.href
    var param
    if (url.includes('?')) {
        param = true
    } else {
        param = false
    }

    numpages = numPages(list, records_per_page)

    if (page != 1) {
        var prevBtn = "<li><a class='prev page-numbers' href=''>Previous</a></li>"
    }

    if (page != numpages) {
        var nextBtn = "<li><a class='next page-numbers' href=''>Next</a></li>"
    }

    var ul = "<ul class='ul-pagination page-numbers'> " + prevBtn;

    // pages
    for (i = page; i <= numpages; i++) {
        if (param) {
            var href = window.location.pathname + window.location.search + "&page=" + i
        }
        else {
            var href = window.location.pathname + window.location.search + "?page=" + i
        }

        if (numpages > 4) {
            numpages = 4
            if (page == i) {
                ul += "<li class='active' id=li" + i + "><span class='sr-only'>" + i + "</span></li>"
            }
            else {
                ul += "<li id=li" + i + "><a id='anchr_" + i + "' href='" + href + "'>" + i + "</a></li>"
            }
        }
        else {
            if (page == i) {
                ul += "<li class='active' id=li" + i + "><span class='sr-only'>" + i + "</span></li>"
            }
            else {
                ul += "<li id=li" + i + "><a id='anchr_" + i + "' href='" + href + "'>" + i + "</a></li>"
            }
        }
    }
    ul += nextBtn + "</ul>";

    $('.ul-pagination').append(ul)
}

function numPages(invoice_list, records_per_page) {
    return Math.ceil(invoice_list.length / records_per_page);
}

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

function updateURLParameter(url, param, paramVal) {
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheAnchor)
            additionalURL = TheParams;

        tempArray = additionalURL.split("&");

        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    else {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];

        if (TheParams)
            baseURL = TheParams;
    }

    if (TheAnchor)
        paramVal += "#" + TheAnchor;

    var rows_txt = temp + "" + param + "=" + paramVal;
    updated_url = baseURL + "?" + newAdditionalURL + rows_txt;
    if (typeof (history.pushState) != "undefined") {
        var obj = { Title: "Facts BV EA", Url: updated_url };
        history.pushState(obj, obj.Title, obj.Url);
    }
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

// remove parameter
function removeParam(key) {
    sourceURL = window.location.href

    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    window.history.pushState('', document.title, rtn);

    return rtn;
}