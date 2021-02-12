; function getURLVar(key) {
	var value = [];

	var query = String(document.location).split('?');

	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');

			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}

function compareTagName(elm, wantedTagName) {
    var elmTagName;
    if(!elm || !wantedTagName) { return false; }
    elmTagName = new String(elm.tagName);
    return (elmTagName && elmTagName.toUpperCase() === wantedTagName.toUpperCase());
}


function findSiblingElement(elm, siblingTag){
    if(!(elm && elm.parentNode)) { return null; }
    let sibling = elm.parentNode.firstChild;
    while (sibling) {
        if (sibling.nodeType === 1 && compareTagName(sibling, siblingTag)) {
            return sibling;
        }
        sibling = sibling.nextSibling;
    }
    return null;
}


function deactivateNestedChildElements(parent, eTag, containerTag){
    if(!parent) { return null; }
    let sibling = parent.firstElementChild;
    while (sibling) {
        const found = compareTagName(sibling, eTag);
        if(found) { sibling.classList.remove("active"); }
        if (found || compareTagName(sibling, containerTag)) {
            deactivateNestedChildElements(sibling, eTag, containerTag);
        }
        sibling = sibling.nextElementSibling;
    }
}


//todo: make default value, if = "" then search with same tag
function deactivateAllSiblingElements(elm, siblingTag){
    if(!(elm && elm.parentElement)) { return null; }
    let sibling = elm.parentElement.firstChild;
    while (sibling) {
        if (sibling.nodeType === 1 && compareTagName(sibling, siblingTag)) {
            sibling.classList.remove("active");
        }
        sibling = sibling.nextSibling;
    }
}


function advanceMainNav()
{
    var listEntries = document.querySelectorAll(".header-top .main-nav ul");
    for (let listEntry of listEntries) {
        listEntry.addEventListener("click", (e) => {
            
            const li = (compareTagName(e.target, "A") || compareTagName(e.target, "SPAN")) ? e.target.parentElement : e.target;
            if(!compareTagName(li, "LI")) { return null; }
            e.stopPropagation();
            
            const isActive = li.classList.contains("active");
            deactivateNestedChildElements(li.parentElement, "LI", "UL");
            if(!isActive && findSiblingElement(li.firstChild, "SPAN")){ li.classList.add("active"); }
        
        });
    }
}


function switchLang(){
    var langBtns = document.querySelectorAll(".header-top #form-language .lang .lang-btn");
    
    for (const langBtn of langBtns) {
        langBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            let isBtnActive = e.currentTarget.classList.contains("active");
            if(isBtnActive) { return null; }
            let langInput = document.querySelector(".header-top #form-language input[name=\'code\']");
            if(!langInput) { return null; }

            langInput.value = e.currentTarget.name;

            deactivateAllSiblingElements(e.currentTarget, "BUTTON");
            e.currentTarget.classList.add("active");

            document.querySelector(".header-top #form-language").submit();

        });
    }

}

function switchMainMenu(){
    const menuBtn = document.querySelector(".header-bottom .main-menu-btn");
    if(!menuBtn) { return null; }
    menuBtn.addEventListener("click", (e) => {
        const menuNav = document.querySelector(".navbar#menu");
        if(!menuNav) { return null; }
        if(e.currentTarget.classList.contains("active")) {
            e.currentTarget.classList.remove("active");
            menuNav.classList.remove("open");
        }
        else {
            e.currentTarget.classList.add("active");
            menuNav.classList.add("open");
        }
    });
}



function searchBar(){
    const searchBar = document.querySelector(".header-bottom #search input[name=\'search\']");
    if(!searchBar) { return null; }
    const submitBtn = findSiblingElement(searchBar, "BUTTON");
    if(!submitBtn) { return null; }

    submitBtn.addEventListener("click", (e) => {
        const baseElement = document.querySelector('base');
        if(!baseElement) { return null; }
        
		var url = baseElement.href + 'index.php?route=product/search';
        var value = document.querySelector(".header-bottom #search input[name=\'search\']").value;

		if (value) {
			url += '&search=' + encodeURIComponent(value);
		}

		location.href = url;
    });


    searchBar.addEventListener('keydown', (e) => {
		if (e.keyCode == 13) {
            const submitBtn = findSiblingElement(e.currentTarget, "BUTTON");
            if(!submitBtn) { return null; }
            submitBtn.click();
		}
    });
}

function expandCallbackBlock(){
    const callbackIn = document.querySelector(".header-bottom .callback-wrap .callback-in");
    
    if(!callbackIn) { return null; }
    callbackIn.addEventListener("click", (e) => {
        const callbackOut = document.querySelector(".header-bottom .callback-wrap .callback-out");
        if(!callbackOut) { return null; }
        e.stopPropagation();

        e.currentTarget.style.visibility = 'hidden';
        callbackOut.style.display = 'inline-block';
    });

}



// function tooltipCloseButtonEvent(){
//     const tipBtn = document.querySelector(".alert button.close");
//     if(!tipBtn) { return null; }
//     tipBtn.addEventListener("click", (e) => {
//         e.stopPropagation();
//         let alertTips = document.querySelectorAll('.alert-dismissible');
//         alertTips.forEach(alertTip => alertTip.remove());
//     });

// }










async function postJson(url = '', obj = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors', //*cors, same-origin, no-cors
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(obj) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}



var compare = {
	'addsep': function(product_id) {

        postJson('index.php?route=product/compare/addsep', {product_id: product_id})
        .then(data => {
            let alertTips = document.querySelectorAll('.alert-dismissible');
            alertTips.forEach(alertTip => alertTip.remove());
            
            if (data['success']) {
                let contentElm = document.querySelector('#content');
                if(contentElm) {
                    contentElm.parentElement.insertAdjacentHTML('beforebegin', '<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + data['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                }

                let compareCountElm = document.querySelector('#compare-count');
                if(compareCountElm){ compareCountElm.textContent = data['totalCount']; }
                //$('#compare-total').html(data['total']);

                let tooltip = document.querySelector('.alert');
                if(!tooltip) { return null; }
                tooltip.style.display = 'inline-block';
                tooltip.style.zIndex = '25';
                clearTimeout(this.timeHandle);
                this.timeHandle = setTimeout(function() {
                    let tooltip = document.querySelector('.alert');
                    if(!tooltip) { return null; }
                    tooltip.style.display = "none";
                    tooltip.style.zIndex = "-1";
                }, 4000);

                //tooltip close button event
                let tipBtn = findSiblingElement(tooltip.firstElementChild, "BUTTON");
                if(!tipBtn) { return null; }
                tipBtn.addEventListener("click", (e) => {
                    let alertTips = document.querySelectorAll('.alert-dismissible');
                    alertTips.forEach(alertTip => alertTip.remove());
                });
                
            }
        })
        .catch(err => {
            alert(err.message);
        });
	},
	'remove': function() {

	},
    timeHandle: null,
}





function documentOnClick(){
    document.addEventListener('click', (e) => {
        const callbackIn = document.querySelector(".header-bottom .callback-wrap .callback-in");
        const callbackOut = document.querySelector(".header-bottom .callback-wrap .callback-out");
        if(!callbackIn || !callbackOut) { return null; }

        if(callbackOut.style.display !== 'none'){
            callbackIn.style.visibility = 'visible';
            callbackOut.style.display = 'none';
        }
    });


};




document.addEventListener('DOMContentLoaded', () => {
    documentOnClick();
    advanceMainNav();
    switchLang();
    switchMainMenu();
    searchBar();
    expandCallbackBlock();
});

