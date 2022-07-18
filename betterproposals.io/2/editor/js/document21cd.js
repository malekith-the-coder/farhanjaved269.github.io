function documentInit() {
    checkIsForcedScrollInMobile()
    checkPageView()
    addPageClickEventListeners()
    setHashPageActive()
    addPagesUpdateListener();
    addElementsUpdateListener();
	addShowMobileNavListener();
	addProposalEditorRequestApprovalButtonListener();
	addColorCheckBoxListener();
}

documentInit()

// Listeners
function addShowMobileNavListener() {
    const mobileNavbar = document.getElementById("mobile-navbar");
	if(!mobileNavbar) return;
	
	const showNavTrigger = mobileNavbar.querySelector(".navbar-menu");
    const mobileNavSidebar = document.getElementById("nav");


    showNavTrigger.addEventListener("click", () => {
       //alert('hello');
		mobileNavSidebar.classList.toggle('isvisible');
    });
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setHashPageActive() {
    let pageId = location.hash.substr(1)

    if (pageId.includes('page-')) {
        pageId = pageId.replace('page-', '')
    } else {
        pageId = getFirstPageId();
    }

    setPageStyleActive(pageId)
}

function pageClickListener(event) {
    const clickedElement = event.target
    const menuItem = this;


    if (isDocumentMultiPageView() && !(clickedElement.classList.contains('icon-settings') || clickedElement.classList.contains('icon-menu'))) {
        setPageStyleActive(menuItem.id)
        showOnlyPageElements(menuItem.id)
        location.hash = 'page-' + menuItem.id
        window.scroll(0, 0)
    }
    
    const mobileNavSidebar = document.getElementById("nav");
    mobileNavSidebar.classList.toggle('isvisible');
}

function addPageClickEventListeners() {
    const pageNavs = document.getElementById('nav-pages').getElementsByClassName('nav-menuitem')

    for (let pageNav of pageNavs) {
        pageNav.removeEventListener("click", pageClickListener)
        pageNav.addEventListener("click", pageClickListener, false)
    }
}

function addPagesUpdateListener() {
    const navpages = document.getElementById("nav-pages");

    navpages.addEventListener("updated", () => {
        updatePageDisplayOrder()
    });
}

function addElementsUpdateListener() {
    const main = document.getElementById('main');

    main.addEventListener("updated", () => {
        //updateElementDisplayOrder() // Might not be needed anymore
    });
}


function changePage(pageId) {
    let navPageElements = getNavPageElements()

    for (let element of navPageElements) {
        if (element.id == pageId) {
            element.click();
            
            break
        }
    }
}

function showOnlyPageElements(pageId) {
    hideAllPageElements()
    let pageElements = getDocumentMainElement().querySelectorAll(`div.content-block[data-page-id="${pageId}"]`)
    let pageElementInserters = getDocumentMainElement().querySelectorAll(`div.addblock-container[data-page-id="${pageId}"]`)
    let trims = getDocumentMainElement().querySelectorAll(`div.trim-container[data-page-id="${pageId}"]`)

    let arrayOfPageItems = [...pageElements, ...pageElementInserters, ...trims];

    if (arrayOfPageItems.length > 0) {
        for (let element of arrayOfPageItems) {
            element.classList.remove('hidden')
        }
    }
}

function setPageStyleActive(pageId) {
    let navPageElements = getNavPageElements()

    for (let element of navPageElements) {
        if (element.classList.contains('uk-active')) {
            element.classList.remove('uk-active')
        }
        
        if (element.id == pageId) {
            element.classList.add('uk-active')
        }
    }
}

function hideAllPageElements() {
    let pageElements = getDocumentMainElement().querySelectorAll('div.content-block')
    let pageElementInserters = getDocumentMainElement().querySelectorAll('div.addblock-container')
    let trims = getDocumentMainElement().querySelectorAll('div.trim-container')

    let arrayOfPageItems = [...pageElements, ...pageElementInserters, ...trims];

    if (arrayOfPageItems.length > 0) {
        for (let element of arrayOfPageItems) {
            if (!element.classList.contains('hidden')) {
                element.classList.add('hidden')
            }
        }
    }
}

function getDocumentViewType() {
    return getDocumentElement().dataset.viewType
}

function isDocumentMultiPageView() {
    const singlePageViewType = '1'
    const multiPageViewType = '0'

    return multiPageViewType === getDocumentViewType()
}

function getDocumentMainElement() {
    return document.getElementById('main')
}

function getDocumentElement() {
    return document.getElementById("document")
}

function getFirstPageId() {
    let navPageElements = getNavPageElements();
    if(!navPageElements[0]) return 0;

    return navPageElements[0].id;
}

function getActivePageId() {
    let navPageElements = getNavPageElements()
    let activePage = getFirstPageId()

    for (let element of navPageElements) {
        if (element.classList.contains('uk-active')) {

            activePage = element.id
            break
        }
    }

    return activePage
}

function getDocumentPages() {
    return document.getElementById('main').children;
}

function getPageInViewport() {
    const pages = getDocumentPages()
    let activePage = '';
    for (let element of pages) {
        if (Util.elementInViewport(element)) {
            activePage = element.id
            break
        }
    }
    return activePage;
}

function getActivePageElement() {
    let navPageElements = getNavPageElements()

    if (navPageElements[0] != undefined) {
        for (let element of navPageElements) {
            if (element.classList.contains('uk-active')) {
                //alert(element.id)
                return element;
            }
        }
    }
}

function getNavPageElements() {
    return document.getElementById('nav-pages').getElementsByClassName('nav-menuitem')
}

function setNavPagesScrollAttribute(attributeValue) {
    const navPages = document.getElementById('nav-pages')

    if (attributeValue == 1) {
        navPages.setAttribute('uk-scrollspy-nav', 'closest: div; scroll: true; cls:uk-active');
    } else {
        navPages.setAttribute('uk-scrollspy-nav', 'closest: div; scroll: false; cls:');
    }
}

function checkPageView() {
    if (isDocumentMultiPageView()) {
        let activePageId = getActivePageId()

        showOnlyPageElements(activePageId)
        
        return;
    }
    
    showAllPageElements();
}

function showAllPageElements() {
    let pageElements = document.getElementsByClassName('content-block')
    let addBlocks = document.getElementsByClassName('addblock-container');

    for (let element of pageElements) {
        element.classList.remove('hidden')
    }

    for (let addBlock of addBlocks) {
        addBlock.classList.remove('hidden')
    }
}

function checkIsForcedScrollInMobile() {
    const documentElement = getDocumentElement();
    const hasToScrollOnMobile = documentElement.dataset.forceScrollMobile;
    const documentViewType = documentElement.dataset.viewType;

    if (hasToScrollOnMobile === '1' && documentViewType === '0' && Util.isMobileDevice()) {
        documentElement.setAttribute('data-view-type', '1')
    }
}

function isProposalPreviewMode() {
    return window.location.href.indexOf("debug") > -1
}

function isLibraryEditor() {
    return window.location.href.indexOf("library-editor") > -1
}

function isProposalEditor() {
    return window.location.href.indexOf("proposal-editor") > -1
}

function getBodyDocumentType() {
    return document.body.dataset.documentType
}

function isViewer() {
    const documentBodyType = getBodyDocumentType();

    if (documentBodyType === 'template-viewer' || documentBodyType === 'proposal-viewer') {
        return true
    }

    return false
}

function getDeleteWarningSwalText() {
    if (isLibraryEditor()) {
        return "Can't restore deleted content library items later"
    }

    return "You can always restore it later"
}

function addProposalEditorRequestApprovalButtonListener() {
    if (!isProposalEditor()) return;

    let button = document.getElementById('request-approval');
    if (!button) return;

    button.addEventListener('click', function () {
        swal({
            title: "Send " + getApproverFullName() + " for Approval?",
            icon: "info",
            buttons: true
        }).then((result) => {
            if (!result) return;

            submitForApproval()
        })
    });
}

function getApproverFullName() {
    let button = document.getElementById('request-approval');
    let fullName = button.dataset.approver;

    if (fullName && fullName.length > 1) {
        return 'to ' + fullName
    }

    return '';
}

function updateQuoteBlockHtml(response){
    if(isLibraryEditor()) {
        //Update quote tables, when there is no quote element
        updateBlockResults(response)
        return;
    }

    let newQuoteID = '';
    try {
        newQuoteID = JSON.parse(response).quoteID;
    } catch (err) {
        newQuoteID = response.quoteID;
    }

    let originalQuote;
    if (newQuoteID) {
        originalQuote = document.getElementById(`block-${newQuoteID}`);
    }

    let newQuoteHtml = '';
    try {
        newQuoteHtml = JSON.parse(response).element;
    } catch (err) {
        newQuoteHtml = response.element;
    }
    if (newQuoteHtml){

        morphdom(originalQuote, newQuoteHtml, {
            onBeforeElUpdated: function(fromEl, toEl) {

                // Skip if same
                if (fromEl.isEqualNode(toEl)) {
                    return false
                }

                return true
            },

        });
        if (!isViewer()) {
            addJQueryLineItemSidebarSetup()
            addJQueryLineItemDiscountSidebarSetup()
            addJQueryQuoteBlockSidebarSetup()
            addJQueryQuoteTableSidebarSetup()
            addJQueryRecycleBinSidebarSetup()
			toggleAddMenuBlocks()
        }
        initLineItem()
        if (!isViewer()) {
            initLineItemSidebar()
        }
        initQuoteTable()
        if (!isViewer()) {
            initQuoteTableSidebar()
        }
    }
    addJQueryContentLibrarySaveSidebarSetup('element')
    addJQueryContentLibrarySidebarSetup()
}


function post(data) {

    let formData = Object
        .keys(data)
        .map(k => k + '=' + data[k])
        .join('&');

    return fetch('', {
        method: 'POST',
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData
    })
        .then(res => res.text())
        .then(text => {
            try {
                return JSON.parse(text)
            } catch (err) {
                return {}
            }
        });
}

function addColorCheckBoxListener() {
    let colorUpdateAll = document.getElementById('colour-update-all');
    let colorUpdateFilters = document.getElementById('colour-update-filters');
    if (!colorUpdateAll) return;

    colorUpdateAll.addEventListener('click', function () {
        if (colorUpdateAll.checked) {
            colorUpdateFilters.disabled = false;
        } else {
            colorUpdateFilters.checked = false;
            colorUpdateFilters.disabled = true;
        }
    });
} 

function submitForApproval() {
    post({action: 'submitForApproval'}).then(res => {
        if (res.length) {
            location.replace(res)
        }
    })
}

function downloadPDF() {
    post({PerformAction: 'downloadPDF'}).then(res => {
        console.log('pdf download request')
    })

}

function forward() {
    post({PerformAction: 'forward'}).then(res => {
        console.log('document forward request')
    });
}
