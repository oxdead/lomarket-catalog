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


function toggleElementActive(elm){
    if(!elm) { return false; }
    if(elm.classList.contains("active")) {
        elm.classList.remove("active");
        return false;
    } 
    
    elm.classList.add("active");
    return true;
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


function advanceMainNav(){
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



// Highlight any found errors
function highlightPwnedElements(){
    let pwnedElements = document.querySelectorAll('.text-danger');
    pwnedElements.forEach((pwnedElement) => {
        var element = pwnedElement.parentElement.parentElement;
        if (element.classList.contains('form-group')) {
            element.classList.add('has-error');
        }
    });

}


// Currency
function switchCurrency(){
    let currencyEntries = document.querySelectorAll('#form-currency .currency-select');
    if(!currencyEntries) { return null; }
    currencyEntries.forEach(currencyEntry => {
        currencyEntry.addEventListener('click', function(e) {
            e.preventDefault();
            const currencyInput = document.querySelector('#form-currency input[name=\'code\']');
            if(!currencyInput) { return null; }
            currencyInput.setAttribute('value', e.currentTarget.getAttribute('name'));
            document.querySelector('#form-currency').submit();
        });
    });
}

function switchListView(){
    const listview = document.querySelector('#list-view');
    if(!listview) { return null; }
    listview.addEventListener('click', function(e) {
        const clearfixes = document.querySelectorAll('#content .product-grid > .clearfix');
        for(let clearfix of clearfixes) { clearfix.remove(); }

        const prodGrids = document.querySelectorAll('#content .row > .product-grid');
        prodGrids.forEach(function(item){
            item.setAttribute('class', 'product-layout product-list col-xs-12');
        });

        const gridview = document.querySelector('#grid-view');
        if(!gridview) { return null; }
        gridview.classList.remove('active');
        e.currentTarget.classList.add('active');
        localStorage.setItem('display', 'list');
    });
}

function switchGridView(){
    const gridview = document.querySelector('#grid-view');
    if(!gridview) { return null; }
    gridview.addEventListener('click', function(e) {
        
        const columns = document.querySelectorAll('#column-right, #column-left');
        if(!columns) { return null; }
        const prodLists = document.querySelectorAll('#content .product-list');
        for(let prodList of prodLists) { 
            if (columns.length == 2) {
                prodList.setAttribute('class', 'product-layout product-grid col-lg-6 col-md-6 col-sm-12 col-xs-12');
            } else if (columns.length == 1) {
                prodList.setAttribute('class', 'product-layout product-grid col-lg-4 col-md-4 col-sm-6 col-xs-12');
            } else {
                prodList.setAttribute('class', 'product-layout product-grid col-lg-3 col-md-3 col-sm-6 col-xs-12');
            }
        }

        const listview = document.querySelector('#list-view');
        if(!listview) { return null; }
        listview.classList.remove('active');
        e.currentTarget.classList.add('active');
        localStorage.setItem('display', 'grid');
    });
}

// ///////////////////////////////////////////////////////////////
// //NOT DONE!!!!!!!!!!!!!!!
// // Checkout
// $(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function(e) {
//     if (e.keyCode == 13) {
//         $('#collapse-checkout-option #button-login').trigger('click');
//     }
// });
// ////////////////////////////////////////////////////////////////



// ///////////////////////////////////////////////////////////////
// //NOT DONE!!!!!!!!!!!!!!!
// // tooltips on hover
// $('[data-toggle=\'tooltip\']').tooltip({container: 'body'});

// // Makes tooltips work on ajax generated content
// $(document).ajaxStop(function() {
// 	$('[data-toggle=\'tooltip\']').tooltip({container: 'body'});
// });
// ////////////////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////
// //NOT DONE!!!!!!!!!!!!!!!
// // Autocomplete */
// (function($) {
// 	$.fn.autocomplete = function(option) {
// 		return this.each(function() {
// 			this.timer = null;
// 			this.items = new Array();

// 			$.extend(this, option);

// 			$(this).attr('autocomplete', 'off');

// 			// Focus
// 			$(this).on('focus', function() {
// 				this.request();
// 			});

// 			// Blur
// 			$(this).on('blur', function() {
// 				setTimeout(function(object) {
// 					object.hide();
// 				}, 200, this);
// 			});

// 			// Keydown
// 			$(this).on('keydown', function(event) {
// 				switch(event.keyCode) {
// 					case 27: // escape
// 						this.hide();
// 						break;
// 					default:
// 						this.request();
// 						break;
// 				}
// 			});

// 			// Click
// 			this.click = function(event) {
// 				event.preventDefault();

// 				value = $(event.target).parent().attr('data-value');

// 				if (value && this.items[value]) {
// 					this.select(this.items[value]);
// 				}
// 			}

// 			// Show
// 			this.show = function() {
// 				var pos = $(this).position();

// 				$(this).siblings('ul.dropdown-menu').css({
// 					top: pos.top + $(this).outerHeight(),
// 					left: pos.left
// 				});

// 				$(this).siblings('ul.dropdown-menu').show();
// 			}

// 			// Hide
// 			this.hide = function() {
// 				$(this).siblings('ul.dropdown-menu').hide();
// 			}

// 			// Request
// 			this.request = function() {
// 				clearTimeout(this.timer);

// 				this.timer = setTimeout(function(object) {
// 					object.source($(object).val(), $.proxy(object.response, object));
// 				}, 200, this);
// 			}

// 			// Response
// 			this.response = function(json) {
// 				html = '';

// 				if (json.length) {
// 					for (i = 0; i < json.length; i++) {
// 						this.items[json[i]['value']] = json[i];
// 					}

// 					for (i = 0; i < json.length; i++) {
// 						if (!json[i]['category']) {
// 							html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
// 						}
// 					}

// 					// Get all the ones with a categories
// 					var category = new Array();

// 					for (i = 0; i < json.length; i++) {
// 						if (json[i]['category']) {
// 							if (!category[json[i]['category']]) {
// 								category[json[i]['category']] = new Array();
// 								category[json[i]['category']]['name'] = json[i]['category'];
// 								category[json[i]['category']]['item'] = new Array();
// 							}

// 							category[json[i]['category']]['item'].push(json[i]);
// 						}
// 					}

// 					for (i in category) {
// 						html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

// 						for (j = 0; j < category[i]['item'].length; j++) {
// 							html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
// 						}
// 					}
// 				}

// 				if (html) {
// 					this.show();
// 				} else {
// 					this.hide();
// 				}

// 				$(this).siblings('ul.dropdown-menu').html(html);
// 			}

// 			$(this).after('<ul class="dropdown-menu"></ul>');
// 			$(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

// 		});
// 	}
// })(window.jQuery);
// ///////////////////////////////////////////////////////////////////////







var tooltip = {
    autoclose: function(tt = null){
        if(!tt) { tt = document.querySelector(this.selector); }
        if(!tt) { return null; }
        tt.style.display = 'inline-block';
        tt.style.zIndex = '25';
        clearTimeout(this.hTime);
        this.hTime = setTimeout(function(elmname) {
            let tt = document.querySelector(elmname);
            if(!tt) { return null; }
            tt.style.display = "none";
            tt.style.zIndex = "-1";
        }, 6000, this.selector);
    },
    removeall: function() {
        let alertTips = document.querySelectorAll(this.selector);
        alertTips.forEach(alertTip => alertTip.remove());
    },
    insert: function(textOnSuccess = '') {
        let contentElm = document.querySelector(this.pos_before);
        if(!contentElm) { return null; }
        contentElm.parentElement.insertAdjacentHTML('beforebegin', 
            '<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' 
            + (textOnSuccess ? textOnSuccess : '') 
            + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>'
        );
    },
    regclose: function(tt = null){
        if(!tt) { tt = document.querySelector(this.selector); }
        if(!tt) { return null; }
        let tipBtn = findSiblingElement(tt.firstElementChild, "BUTTON");
        if(!tipBtn) { return null; }
        tipBtn.addEventListener("click", (e) => {
            this.removeall();
        });
    },
    selector: '.alert-dismissible',
    pos_before: '#content',
    hTime: null
}



var cart = {
	'add': function(product_id, quantity) {
        postJson('index.php?route=checkout/cart/addsep', {
            product_id: product_id,
            quantity: (typeof(quantity) != 'undefined' ? quantity : 1),
        })
        .then(json => {
            tooltip.removeall();

            if (json['redirect']) { location = json['redirect']; }

            if (json['success']) {
                
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    let cartCountElm = document.querySelector('#cart-count');
                    if(cartCountElm) { cartCountElm.textContent = json['cartCount']; }
                }, 100);
                
                tooltip.insert(json['success']);
                let tt = document.querySelector('.alert');
                tooltip.autoclose(tt);
                tooltip.regclose(tt);
            }
        })
        .catch(err => { alert(err.message); });
	},
	'update': function(key, quantity) {
        postJson('index.php?route=checkout/cart/editsep', {
            key: key,
            quantity: (typeof(quantity) != 'undefined' ? quantity : 1),
        })
        .then(json => {
            // // Need to set timeout otherwise it wont update the total
            setTimeout(function () {
                let cartCountElm = document.querySelector('#cart-count');
                if(cartCountElm) { cartCountElm.textContent = json['cartCount']; } // ??? cartCount desn't exist in checkout/cart/edit
            }, 100);

            if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                location = 'index.php?route=checkout/cart';
            }
        })
        .catch(err => { alert(err.message); });
	},
	'remove': function(key) {
        postJson('index.php?route=checkout/cart/removesep', {
            key: key
        })
        .then(json => {
            // // Need to set timeout otherwise it wont update the total
            setTimeout(function () {
                let cartCountElm = document.querySelector('#cart-count');
                if(cartCountElm) { cartCountElm.textContent = json['cartCount']; }
            }, 100);

            if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                location = 'index.php?route=checkout/cart';
            }
        })
        .catch(err => { alert(err.message); });
	}
}


var voucher = {
	'add': function() { },
	'remove': function(key) {
        postJson('index.php?route=checkout/cart/removesep', {
            key: key
        })
        .then(json => {
            // // Need to set timeout otherwise it wont update the total
            setTimeout(function () {
                let cartCountElm = document.querySelector('#cart-count');
                if(cartCountElm) { cartCountElm.textContent = json['cartCount']; }
            }, 100);

            if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                location = 'index.php?route=checkout/cart';
            }
        })
        .catch(err => { alert(err.message); });
	}
}


var wishlist = {
	'add': function(product_id) {
        postJson('index.php?route=account/wishlist/addsep', {product_id: product_id})
        .then(json => {
            tooltip.removeall();
            if (json['redirect']) { location = json['redirect']; }

            if (json['success']) {
                let wishlistCountElm = document.querySelector('#wishlist-count');
                if(wishlistCountElm) { wishlistCountElm.textContent = json['wishlistCount']; }
                //$('#wishlist-total span').html(json['total']);
				//$('#wishlist-total').attr('title', json['total']);
                
                tooltip.insert(json['success']);
                let tt = document.querySelector('.alert');
                tooltip.autoclose(tt);
                tooltip.regclose(tt);
            }
        })
        .catch(err => { alert(err.message); });
	},
	'remove': function() { },
}


var compare = {
	'add': function(product_id) {

        postJson('index.php?route=product/compare/addsep', {product_id: product_id})
        .then(json => {
            tooltip.removeall();
            
            if (json['success']) {
                let compareCountElm = document.querySelector('#compare-count');
                if(compareCountElm){ compareCountElm.textContent = json['compareCount']; }
                //$('#compare-total').html(json['total']);
                
                tooltip.insert(json['success']);
                let tt = document.querySelector('.alert');
                tooltip.autoclose(tt);
                tooltip.regclose(tt);
            }
        })
        .catch(err => { alert(err.message); });
	},
	'remove': function() { },
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
    highlightPwnedElements();
    switchCurrency();
    switchListView();
    switchGridView();

	if (localStorage.getItem('display') == 'list') {
        const listview = document.querySelector('#list-view');
        if(listview){
            listview.click();
            listview.classList.add('active');
        }
	} else {
        const gridview = document.querySelector('#grid-view');
        if(gridview){
            gridview.click();
            gridview.classList.add('active');
        }
	}

});

