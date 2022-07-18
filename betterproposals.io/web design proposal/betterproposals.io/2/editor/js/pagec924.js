function pageInit() {
    addPageSidebarSubmitSaveListener();
    addDisplayOrderDropListener();
    addAddNewPageListener();
    addDeletePageListener();
    addSaveAndExitListener();
    hideElementsInLibraryEditor();
	addSaveAndNextListener();
}

pageInit();

function addPageSidebarSubmitSaveListener() {
    const pageSidebar = document.getElementById("sidebar-page");
    if(!pageSidebar) return;

    const pageSidebarSaveButton = pageSidebar.querySelector("#sidebar-page-save");

    pageSidebarSaveButton.addEventListener("click", () => {
        if (!isPageNameValid()) return;
        
        updatePage()
    });
}

function addDisplayOrderDropListener() {
    const navpages = document.getElementById("nav-pages");
    let originalPages = getPagesDisplayOrder();
    let newPages = [];
    let elements = [];

    navpages.addEventListener("start", () => {
        originalPages = getPagesDisplayOrder();
    })

    navpages.addEventListener("moved", () => {
        newPages = getPagesDisplayOrder();
        if ( newPages == []){
            return
        }
        // if the order is the same
        if (newPages == originalPages) {
            return
        }
        // get the related elements from the main editor section
        const mainEditorSection = getDocumentMainElement()
        for (let newPage of newPages) {
            const elementPageWrapper = document.getElementById('page-' + newPage);
            elements.push(elementPageWrapper)
        }

        for (let element of elements) {
            mainEditorSection.append(element)
        }
        elements = [];

        updatePageDisplayOrder()
    });
}

function addAddNewPageListener() {
    const newPageTrigger = document.getElementById("add-new-page");
	const addpagebutton = document.querySelector(".addpage-button");
    const addpagecontainer = document.querySelector(".addpage-container");
	
    if(!newPageTrigger) return;

    newPageTrigger.addEventListener("click", (e) => {
        e.preventDefault();
			addpagebutton.classList.toggle('open');
			addpagecontainer.classList.toggle('open');
  			newPageTrigger.classList.remove('icon-blankpage');
			newPageTrigger.classList.add('show-spinner');
			newPageTrigger.innerHTML='<span uk-spinner="ratio:0.6"></span><span class="addpage-text">Blank page</span>';
       addNewPage()
    });
}

function addDeletePageListener() {
    if (document.getElementById("DeletePageID")) {
	let deletePageTrigger = document.getElementById("DeletePageID");

    deletePageTrigger.addEventListener('click', () => {
        let pageID = deletePageTrigger.dataset.id;

        swal({
            title: "Are you sure you want to remove this page?",
            text: getDeleteWarningSwalText(),
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            //dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deletePage(pageID);
                }
            });
    })
	}
}

function addSaveAndExitListener(){
    const saveAndExitTrigger = document.getElementById("save-doc-and-exit");
    if(!saveAndExitTrigger) return;

    saveAndExitTrigger.addEventListener("click", () => {
        saveAndExit();
    });
}
function addSaveAndNextListener(){
    const saveAndNextTrigger = document.getElementById("save-doc-and-next");
    if(!saveAndNextTrigger) return;

    saveAndNextTrigger.addEventListener("click", () => {
        saveAndNext();
    });
}

function addPageSidebarOpenListener (element) {
    let triggerButton = $(element).find('.sidebar-page-trigger');

    $("#sidebar-page").slideReveal({
        trigger: triggerButton,
        position: "right",
        push: false,
        overlay: false,
        width: 400,
        speed: 300,
        show: function(slider, trigger){
            //$overlay.addClass('slider-open');
            slider.addClass('slider-open');
            //slider[0].querySelector("#PageHidden").checked= Number(trigger[0].dataset.pageHidden);
			slider[0].querySelector("#PageHidden").value=trigger[0].dataset.pageHidden;
            slider[0].querySelector("#PageName").value=trigger[0].dataset.value;
            slider[0].querySelector("#PageID").value=trigger[0].dataset.id;
            slider[0].querySelector("#DeletePageID").dataset.id=trigger[0].dataset.id;
        },
        hide: function(slider, trigger){
            //$overlay.removeClass('slider-open');
            slider.removeClass('slider-open');
        }
    });

}


// Helpful functions

/**
 * Gets the children of the `#nav-pages` element.
 *
 * @return {*[]}
 */
function getPagesDisplayOrder() {
    const navpages = document.getElementById('nav-pages').children;
    const navpage_order = [];

    for (i = 0; i < navpages.length; i++) {
        navpage_order.push(navpages[i].id);
    }
    return navpage_order;

}

function hideElementsInLibraryEditor() {
    if (isLibraryEditor()) {
        document.getElementById('SavePageID').style.display = "none";
        document.getElementById('DeletePageID').style.display = "none";
        document.getElementById('publish-this-section').style.display = "none";
    }
}

function getPageSidebar() {
    return document.getElementById("sidebar-page");
}

function isPageNameValid() {
    const pageSidebar = getPageSidebar();
    let pageName = pageSidebar.querySelector("#PageName").value;

    if (pageName.length == 0) {
        let validationElement = pageSidebar.getElementsByClassName('validation-error')[0];
        
        Util.flashValidationError(validationElement, 'Please check page name again')

        return false;
    }

    return true;
}

function removeAddBlankPageSpinner() {
    const newPageTrigger = document.getElementById("add-new-page");
    
    newPageTrigger.classList.remove('show-spinner')
    newPageTrigger.classList.add('icon-blankpage');
    newPageTrigger.innerHTML='<span class="addpage-text">Blank page</span>';
}

//Shows if document has no page or all pages are deleted
function showAddYourFirstPage(showAddYourFirstPageHTML) {
    if (showAddYourFirstPageHTML.length > 0) {
        document.getElementById('main').innerHTML = showAddYourFirstPageHTML
    }
}

// AJAX/DB functions

function updatePage() {
    const pageSidebar = document.getElementById("sidebar-page");
	const pageSidebarButton = pageSidebar.querySelector("#sidebar-page-save");
    const pageID = pageSidebar.querySelector("#PageID").value;
    const pageHiddenCheckbox = pageSidebar.querySelector("#PageHidden");

    let pageName = pageSidebar.querySelector("#PageName").value;
    //let pageHidden = (pageHiddenCheckbox.checked) ? 1 : 0;
	let pageHidden = pageSidebar.querySelector("#PageHidden").value;
	
	pageSidebarButton.innerHTML = '<span uk-spinner="ratio:0.5" class="align-icons"></span>Saving...';
	

    fetch('', {
        method: 'POST',
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': Util.getCSFRToken()
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            action: 'updatePage',
            pageID: pageID,
            pageName: pageName,
            pageHidden: pageHidden,
        })
    }).then(res => res.json()).then(res => {
        const navPageItem = document.getElementById(pageID);
        let navPageItemName = navPageItem.querySelector(".nav-menuitem-name a");
        let navPageItemSettings = navPageItem.querySelector(".sidebar-page-trigger");

        navPageItemName.innerHTML = res.pageName + '<span class="icon-pagehidden align-icons-right" uk-tooltip="title: Not publicly visible"></span>';
        navPageItemSettings.dataset.pageName = res.pageName; // Update the data properties in case the sidebar is opened again.
        navPageItemSettings.dataset.value = res.pageName;
        navPageItemSettings.dataset.pageHidden = res.pageHidden;

        (res.pageHidden==1) ? navPageItem.classList.add("page-hidden") : navPageItem.classList.remove("page-hidden"); // Add a class to trigger some hidden styling

        closeSideBar()
    });
}

function updatePageDisplayOrder() {

    fetch('', {
        method: 'POST',
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': Util.getCSFRToken()
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            action: 'updatePageDisplayOrder',
            pages: getPagesDisplayOrder(),
        })
    }).then(res => res.json()).then(res => {
    });
}

function deletePage(pageID) {
	const pageSidebar = document.getElementById("sidebar-page");
	
    fetch('', {
        method: 'POST',
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': Util.getCSFRToken()
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            action: 'deletePage',
            pageID: pageID
        })
    }).then(res => res.json()).then(res => {
        const pageNav = document.getElementById(pageID);
        pageNav.remove(); // remove the menu item from the dom

        let pagesToRemove = document.querySelectorAll(`.content-block[data-page-id='${pageID}']`)
        let circleNavsToRemove = document.querySelectorAll(`.add-menu-block[data-insert-page='${pageID}']`)
        for (let i = 0; i < pagesToRemove.length; i++) {
            pagesToRemove[i].remove(); // remove the pages from the dom
        }
        for (let i = 0; i < circleNavsToRemove.length; i++) {
            //circleNavsToRemove[i].remove(); // remove the circle nav from the dom *** this couses event listener error
            Util.hideElement(circleNavsToRemove[i])
        }
		$(pageSidebar).slideReveal("hide");

        let datasetContent = JSON.stringify(res.latestRecycleBinPages)
		updateLatestRecycleBinPageResults(datasetContent)
        
        const totalDeletedPages = res.totalDeletedPages
        updateTotalDeletedPages(totalDeletedPages)

        const deletedPageElementTypes = res.deletedPageElementTypes

        if (deletedPageElementTypes.length > 0) {
            for (let deletedElementType of deletedPageElementTypes) {
                updateAddBlockButtonsAfterElementDelete(deletedElementType)
            }
        }

        const firstPageElement = document.getElementsByClassName('nav-menuitem')[0];
        if (firstPageElement != undefined) {
            firstPageElement.click();
        }

        showAddYourFirstPage(res.showAddYourFirstPage)
    });
}

function addNewPage() {
    fetch('', {
        method: 'POST',
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': Util.getCSFRToken()
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            action: 'addNewPage',
        })
    }).then(res => res.json()).then(res => {
        updatePageResults(res.pageItemHtml)
        updateBlockResults(res)
        removeAddBlankPageSpinner()
    });
}

function saveAndExit() {

    fetch('', {
        method: 'POST',
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': Util.getCSFRToken()
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            action: 'saveAndExit',
        })
    }).then(res => res.json()).then(res => {
        if (res.status === 'success' && res.type==='template') {
            window.location.href = '/2/templates/';
        } else if (res.status==='success' && res.type==='proposal') {
			window.location.href = '/2/proposals/view?id='+res.quoteID;
		} else if (res.status==='success' && res.type==='library') {
            if (res.betaTester == true) {
                window.location.href = '/2/templates/?tabs=content-library';
            } else {
                window.location.href = '/2/templates/content-library';
            }
        }
    });
}

function saveAndNext() {

    fetch('', {
        method: 'POST',
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': Util.getCSFRToken()
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            action: 'saveAndNext',
        })
    }).then(res => res.json()).then(res => {
        if (res.status === 'success') {
            window.location.href = res.location;
		}
    });
}
