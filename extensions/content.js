function getTranslation(key){
    const translations = {
        en: {
            review: "review",
            youtubeReviews: "Youtube Reviews"
        },
        tr: {
            review: "incelemesi",
            youtubeReviews: "Youtube İncelemeleri"
        }
    }
    const userLanguage = navigator.language;

    const pluginLanguage =  Object.keys(translations).includes(userLanguage)? userLanguage : "en"

    return translations[pluginLanguage][key]
}

function getElement(productTitle){
    var youtubeUrl = "https://www.youtube.com/results?search_query=" + productTitle + "+" + getTranslation("review");

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

    var text = document.createTextNode(getTranslation("youtubeReviews"));

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

function run(){
    var productTitle = "";

    if (window.location.host.includes("amazon")){
        productTitle = getTitleById("productTitle");
        if (productTitle == undefined){
            return;
        }
        insertBeforeById(productTitle, "desktop_unifiedPrice") || insertBeforeById(productTitle, "price") || insertBeforeById(productTitle, "priceblock_ourprice_row");
    }

    if(window.location.host.includes("thomann")){
        productTitle = getTitleByIdAndTag("rs-prod-headline", "h1");
        if (productTitle == undefined){
            return;
        }
        insertBeforeByClass(productTitle, "rs-prod-media-gallery");
    }

    if(window.location.host.includes("musicstore")){
        productTitle = getTitleByQuerySelector("[property='og:title']")
        if (productTitle == undefined){
            return;
        }
        appendByClassName(productTitle, "shortdescription")
    }

    if (window.location.host.includes("ebay")){
        productTitle = getTitleById("itemTitle");
        if (productTitle == undefined){
            return;
        }
        insertBeforeById(productTitle, "vi-lkhdr-itmTitl");
    }

    if (window.location.host.includes("etsy")){
        productTitle = getTitleByIdAndTag("listing-page-title-component", "h1");
        if (productTitle == undefined){
            return;
        }
        insertBeforeByClass(productTitle + '+etsy', "listing-page-title-component");
    }

    if(window.location.host.includes("royalqueenseeds")){
        productTitle = getTitleByClass("product-title")
        if (productTitle == undefined){
            return;
        }
        appendByClassName(productTitle, "short-description-block")
    }

    if(window.location.host.includes("alibaba")){
        setTimeout(function(){
            productTitle = getTitleByClass("ma-title");
            if (productTitle == undefined){
                return;
            }
            insertBeforeByClass(productTitle, "assurance-item item-ta");
        }, 5000);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    run();
});
