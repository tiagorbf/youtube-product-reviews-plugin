
function getElement(productTitle){
    var youtubeUrl = "https://www.youtube.com/results?search_query=" + productTitle + "+incelemesi";

    var div = document.createElement('div');
    div.style.cursor = "pointer";
    div.style.padding = "0px 0px 5px";
    div.onclick = function() {
        window.open(youtubeUrl)
    };

    var img = document.createElement('img');
    img.src = chrome.extension.getURL('youtube.png');
    img.style.width = "40px";
    img.style.display = "inline";

    var span = document.createElement('span');
    span.style.marginLeft = "5px";
    span.style.marginTop = "4px";
    span.style.position = "absolute";

    var text = document.createTextNode("Youtube İncelemeleri");

    div.appendChild(img);
    span.appendChild(text);
    div.appendChild(span);

    return div;
}

function getTitleById(id){
    return document.getElementById(id) && document.getElementById(id).textContent.trim().replace(/\s/g, "+");
}

function getTitleByClass(className){
    return document.getElementsByClassName(className) && document.getElementsByClassName(className)[0].textContent.trim().replace(/\s/g, "+");
}

function getTitleByQuerySelector(selector){
    return document.querySelectorAll(selector)[0] &&
    document.querySelectorAll("[property='og:title']")[0].content &&
    document.querySelectorAll("[property='og:title']")[0].content.split('|')[0].trim().replace(/\s/g, "+");
}

function getTitleByIdAndTag(id, tag){
    return document.getElementsByClassName(id)[0] &&
    document.getElementsByClassName(id)[0].getElementsByTagName(tag)[0] &&
    document.getElementsByClassName(id)[0].getElementsByTagName(tag)[0].textContent.trim().replace(/\s/g, "+");
}

function insertBeforeById(productTitle, id){
    return document.getElementById(id) &&
    document.getElementById(id).parentNode &&
    document.getElementById(id).parentNode.insertBefore(getElement(productTitle), document.getElementById(id));
}

function insertBeforeByClass(productTitle, className){
    return document.getElementsByClassName(className)[0] &&
    document.getElementsByClassName(className)[0].parentNode &&
    document.getElementsByClassName(className)[0].parentNode.insertBefore(getElement(productTitle), document.getElementsByClassName(className)[0]);
}

function appendByClassName(productTitle, className){
    return document.getElementsByClassName(className)[0] && document.getElementsByClassName(className)[0].appendChild(getElement(productTitle));
}

const GET_BY_ID = "getByID"
const GET_BY_ID_AND_TAG = "getByIDAndTag"
const GET_BY_QUERY_SELECTOR = "getByQuerySelector"
const GET_BY_CLASS = "getByClass"

const INSERT_BY_CLASS = "insertByClass"
const INSERT_BY_ID = "insertByID"

function insertButton(getType, getArgs, insertType, insertArg){
    let productTitle
    switch(getType){
        case GET_BY_ID: productTitle = productTitle = getTitleById(getArgs[0]); break;
        case GET_BY_ID_AND_TAG: productTitle = getTitleByIdAndTag(getArgs[0], getArgs[1]); break;
        case GET_BY_QUERY_SELECTOR: productTitle = getTitleByQuerySelector(getArgs[0]); break;
        case GET_BY_CLASS: productTitle = getTitleByClass(getArgs[0]); break;
    }

    if(productTitle == undefined) return

    switch(insertType){
        case INSERT_BY_CLASS: return insertBeforeByClass(productTitle, insertArg)
        case INSERT_BY_ID: return insertBeforeById(productTitle, insertArg)
    }

}

function run(){
    if(window.location.host.includes("trendyol")){
        insertButton(GET_BY_ID_AND_TAG, ["pr-new-br","span"], INSERT_BY_CLASS, "pr-in-ratings");
    }else if(window.location.host.includes("amazon")){
        insertButton(GET_BY_ID, ["productTitle"], INSERT_BY_ID, "desktop_unifiedPrice") ||
        insertButton(GET_BY_ID, ["productTitle"], INSERT_BY_ID, "price") ||
        insertButton(GET_BY_ID, ["productTitle"], INSERT_BY_ID, "priceblock_ourprice_row")
    }   
}

document.addEventListener("DOMContentLoaded", function(event) {
    run();
});
