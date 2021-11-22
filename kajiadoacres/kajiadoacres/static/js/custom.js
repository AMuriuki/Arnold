// global variables
var currentPathname = window.location.pathname
var main_image;
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
        $('#for_sale_or_rent').change(function () {
            sessionStorage.clear();
            changePropertyType($(this).val())
        })
        $('#minimum_price').change(function () {
            sessionStorage.clear();
            changeMinPrice($(this).val())
        })
        $('#maximum_price').change(function () {
            sessionStorage.clear();
            changeMaxPrice($(this).val())
        })
        $('#orderby').change(function () {
            sessionStorage.clear();
            orderBy($(this).val())
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

    $('.propertyImagesWrap__image').click(function (e) {
        $('#view_photos').click();
    });

    $('.select2').select2();
});


function changeCategory(category) {
    sessionStorage.setItem("category", category);
    var pageParam = getUrlParameter('page')
    var typeParam = getUrlParameter('type')
    var minpriceParam = getUrlParameter('min_price')
    var maxpriceParam = getUrlParameter('max_price')
    if (category) {
        updateURLParameter(window.location.href, 'category', category)
    }
    else {
        removeParam("category");
    }
    if (pageParam) {
        removeParam("page");
    }
    if (typeParam) {
        removeParam("type");
    }
    if (minpriceParam) {
        removeParam("min_price");
    }
    if (maxpriceParam) {
        removeParam("max_price");
    }

    renderList()
}

function changePropertyType(type) {
    sessionStorage.setItem("type", type);
    var pageParam = getUrlParameter('page')
    var minpriceParam = getUrlParameter('min_price')
    var maxpriceParam = getUrlParameter('max_price')
    var categoryParam = getUrlParameter('category')
    if (type) {
        updateURLParameter(window.location.href, 'type', type)
    }
    else {
        removeParam("type");
    }
    if (pageParam) {
        removeParam("page");
    }
    if (minpriceParam) {
        sessionStorage.setItem("min_price", minpriceParam);
    }
    if (maxpriceParam) {
        sessionStorage.setItem("max_price", maxpriceParam);
    }
    if (categoryParam) {
        sessionStorage.setItem("category", categoryParam);
    }
    renderList()
}

function changeMinPrice(min_price) {
    sessionStorage.setItem("min_price", min_price);
    var pageParam = getUrlParameter('page')
    var typeParam = getUrlParameter('type')
    var maxpriceParam = getUrlParameter('max_price')
    var categoryParam = getUrlParameter('category')
    if (min_price) {
        updateURLParameter(window.location.href, 'min_price', min_price)
    }
    else {
        removeParam("min_price");
    }
    if (pageParam) {
        removeParam("page");
    }
    if (typeParam) {
        sessionStorage.setItem("type", typeParam);
    }
    if (maxpriceParam) {
        sessionStorage.setItem("max_price", maxpriceParam);
    }
    if (categoryParam) {
        sessionStorage.setItem("category", categoryParam);
    }
    renderList()
}

function changeMaxPrice(max_price) {
    sessionStorage.setItem("max_price", max_price);
    var pageParam = getUrlParameter('page')
    var typeParam = getUrlParameter('type')
    var minpriceParam = getUrlParameter('min_price')
    var categoryParam = getUrlParameter('category')
    if (max_price) {
        updateURLParameter(window.location.href, 'max_price', max_price)
    }
    else {
        removeParam("max_price");
    }
    if (pageParam) {
        removeParam("page");
    }
    if (typeParam) {
        sessionStorage.setItem("type", typeParam);
    }
    if (minpriceParam) {
        sessionStorage.setItem("min_price", minpriceParam);
    }
    if (categoryParam) {
        sessionStorage.setItem("category", categoryParam);
    }
    renderList()
}

function orderBy(order_by) {
    sessionStorage.setItem("order_by", order_by);
    var pageParam = getUrlParameter('page')
    var typeParam = getUrlParameter('type')
    var minpriceParam = getUrlParameter('min_price')
    var maxpriceParam = getUrlParameter('max_price')
    var categoryParam = getUrlParameter('category')
    if (typeParam) {
        sessionStorage.setItem("type", typeParam);
    }
    if (minpriceParam) {
        sessionStorage.setItem("min_price", minpriceParam);
    }
    if (categoryParam) {
        sessionStorage.setItem("category", categoryParam);
    }
    if (maxpriceParam) {
        sessionStorage.setItem("max_price", maxpriceParam);
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
    type = sessionStorage.getItem("type");
    min_price = sessionStorage.getItem("min_price");
    max_price = sessionStorage.getItem("max_price");
    order_by = sessionStorage.getItem("order_by");
    if (category) {
        list = list.filter(function (item) {
            return item[2] === parseInt(category)
        })
    }

    if (type) {
        list = list.filter(function (item) {
            return item[3] === replace_with_space(type)
        })

    }
    if (min_price) {
        list = list.filter(function (item) {

            return item[9] >= parseInt(min_price)
        })
    }
    if (max_price) {
        list = list.filter(function (item) {
            return item[9] <= parseInt(max_price)
        })
    }
    if (order_by) {
        if (order_by === "price-desc") {
            list.sort((a, b) => (a[9] > b[9]) ? 1 : ((b[9] > a[9]) ? -1 : 0))
        }
        if (order_by === "price-asc") {
            list.sort((a, b) => (b[9] > a[9]) ? 1 : ((a[9] > b[9]) ? -1 : 0))
        }
    }
    return list
}

function displayList(filtered_list) {
    if (currentPathname.toLowerCase().indexOf("/property/properties/") >= 0) {
        var property_row = document.getElementById('dv_propertyrow');
        $('#dv_propertyrow').empty();
        $('.pagination').hide();
        property_list = filtered_list

        if (Object.keys(property_list).length === 0) {
            $("<div class='single-property--sold'><p>There are currently no properties with this filter</p></div>").appendTo('#dv_propertyrow');
        }
        else {
            if (property_list.length > 30) {
                records_per_page = 30
                current_page = 1
                changePage(current_page, property_list)
            }
            else {
                singlePage(property_list, property_row)
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

function singlePage(list, properties_div) {
    if (currentPathname.toLowerCase().indexOf("/property/properties/") >= 0) {
        for (var i = 0; i < list.length; i++) {
            var article = "<article class='property-link property-link--listing'><figure><a href='/property/details/" + list[i][7] + "' class='property-link__img-contain'><img alt='" + list[i][6] + "' height='1000' src='https://kajiadoacres.s3.amazonaws.com/original_images/" + list[i][8] + "' width='750'></a><figcaption class='property-link__tag'>" + list[i][3] + "</figcaption></figure ><div class='property-link__bottom'><a href='/property/details/" + list[i][7] + "'><h6 class='property-link__title'>" + list[i][6] + "</h6></a><div class='flex'><p class='property-link__house-desc'></p></div ><div class=' flex property-link__price-block'><h6 class='property-link__price'>" + list[i][5] + "<span class='price-qualifier'></span></h6><span><p class='property-link__date'>Added " + convert_date_format(list[i][4]) + "</p></span></div><div class='summary'>" + truncate_string(list[i][1]) + "</div></div><div class='flex property-link__buttons'><a class='property-link__button property-link__viewing' href='/property/details/" + list[i][7] + "?request-viewing=true'>Request Viewing</a><a class='wppf_more property-link__button' href='/property/details/" + list[i][7] + "'>Full Details</a></div></article>";
            properties_div.innerHTML += article;
        }
    }
}

function changePage(page, list) {
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
    else {
        prevBtn = ""
    }

    if (page != numpages) {
        var nextBtn = "<li><a class='next page-numbers' href='" + window.location.pathname + window.location.search + "&page=" + "2" + "'>Next</a></li>"
    }
    else {
        nextBtn = ""
    }

    $('.ul-pagination').remove();
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
                ul += "<li id=li" + i + "><span aria-current='page' class='page-numbers current'>" + i + "</span></li>"
            }
            else {
                ul += "<li id=li" + i + "><a id='anchr_" + i + "' href='" + href + "'>" + i + "</a></li>"
            }
        }
        else {
            if (page == i) {
                ul += "<li id=li" + i + "><span aria-current='page' class='page-numbers current'>" + i + "</span></li>"
            }
            else {
                ul += "<li id=li" + i + "><a id='anchr_" + i + "' href='" + href + "'>" + i + "</a></li>"
            }
        }
    }
    ul += nextBtn + "</ul>";
    $('.pagination').append(ul)

    if (currentPathname.toLowerCase().indexOf("/property/properties/") >= 0) {
        var property_div = document.getElementById("dv_propertyrow");
        for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < list.length; i++) {
            var article = "<article class='property-link property-link--listing'><figure><a href='/property/details/" + list[i][7] + "' class='property-link__img-contain'><img alt='" + list[i][6] + "' height='1000' src='https://kajiadoacres.s3.amazonaws.com/original_images/" + list[i][8] + "' width='750'></a><figcaption class='property-link__tag'>" + list[i][3] + "</figcaption></figure ><div class='property-link__bottom'><a href='/property/details/" + list[i][7] + "'><h6 class='property-link__title'>" + list[i][6] + "</h6></a><div class='flex'><p class='property-link__house-desc'></p></div ><div class=' flex property-link__price-block'><h6 class='property-link__price'>" + list[i][5] + "<span class='price-qualifier'></span></h6><span><p class='property-link__date'>Added " + convert_date_format(list[i][4]) + "</p></span></div><div class='summary'>" + truncate_string(list[i][1]) + "</div></div><div class='flex property-link__buttons'><a class='property-link__button property-link__viewing' href='/property/details/" + list[i][7] + "?request-viewing=true'>Request Viewing</a><a class='wppf_more property-link__button' href='/property/details/" + list[i][7] + "'>Full Details</a></div></article>";
            property_div.innerHTML += article;
        }

    }
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

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    if (sPageURL === "") {
        return ''
    }
    else {
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }
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

function truncate_string(string) {
    if (string.length > 150) {

        return string.substring(0, 150) + "..."
    }
    else {
        return string
    }
}

const month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function convert_date_format(input_date) {
    var date = new Date(input_date);
    if (!isNaN(date.getTime())) {
        monthIndex = date.getMonth()
        monthName = month_names[monthIndex]
        return monthName + '. ' + ('0' + date.getDate()).slice(-2) + ', ' + date.getFullYear()
    }
}

function replace_with_space(text) {
    return text.replace("_", " ");
}