let sideBarTrigger;
const DEFAULT_NUMBER_OF_IMAGES_LOAD_MORE = 10;

function closeSideBar() {
    $(".sidebar").slideReveal('hide');
	$(".sidebar .button.green").html('<span class="icon-save align-icons"></span>Save and preview');
}

function getBlockIdByTrigger() {
    if (sideBarTrigger.hasAttribute('data-block-id')) {
        return sideBarTrigger.dataset.blockId
    }

    return Util.getParentsAttribute(sideBarTrigger, 'data-block-id')
}

function getPageIdByTrigger() {
    if (sideBarTrigger.hasAttribute('data-page-id')) {
        return sideBarTrigger.dataset.pageId
    }

    return Util.getParentsAttribute(sideBarTrigger, 'data-page-id')
}

function updateImageInputPlaceHolder(clickedButton, sidebar) {
    let searchType = '';
    let searchField = sidebar.getElementsByClassName('image-search-field')[0];
    if (!searchField) return;

    if (clickedButton.dataset.type != undefined) {
        searchType = 'in ' + Util.capitalizeFirstLetter(clickedButton.dataset.type);
    }

    searchField.placeholder = `Search for an image ${searchType}...`;
}

function showClearSearchResultsButton(sidebar) {
    const clearResultsButton = sidebar.getElementsByClassName('clear-search-results')[0];

    Util.showElement(clearResultsButton);
}

function hideClearSearchResultsButton(sidebar) {
    const clearResultsButton = sidebar.getElementsByClassName('clear-search-results')[0];

    Util.hideElement(clearResultsButton);
}

function clearSidebarSearchResults() {
    let featureBlockSidebar = document.getElementById('sidebar-content')
    let imageSearchSidebar = document.getElementById('sidebar-fullwidthimage')

    hideSideBarLoadMoreButton(featureBlockSidebar)
    hideSideBarLoadMoreButton(imageSearchSidebar)

    let sideBarGallery = featureBlockSidebar.getElementsByClassName('sidebar-browse-gallery')[0]
    Util.clearElements(sideBarGallery)
    sideBarGallery = imageSearchSidebar.getElementsByClassName('sidebar-browse-gallery')[0]
    Util.clearElements(sideBarGallery)

    hideClearSearchResultsButton(featureBlockSidebar)
    hideClearSearchResultsButton(imageSearchSidebar)
}


function updateBlockResults(response) {
    const main = document.getElementById('main');

    try {
        main.innerHTML = JSON.parse(response).elements;
    } catch (err) {
        main.innerHTML = response.elements;
    }

    checkPageView()
    elementInit()

    initLineItem()
    initTinyMCE()

    closeSideBar()

    addJQueryBlockSidebarSetup()

    addSignatureSidebarTriggerListener()
    addVideoSideBarTriggerListener()
    initLineItemVariables()
    initQuoteTable()
    toggleContentLibrarySaveButtons()

    // create the event
    let event = new CustomEvent('updated');
    // dispatch the event
    main.dispatchEvent(event);
}

function updatePageResults(response) {
    const pageMenu = document.getElementById('nav-pages');
    const node = new DOMParser();
    const newPage = node.parseFromString(response, 'text/html').body.firstChild;
    pageMenu.appendChild(newPage)

    addPageClickEventListeners()
    addPageSidebarOpenListener(newPage)
    changePage(newPage.id)

    // create the event
    let event = new CustomEvent('updated');
    // dispatch the event
    pageMenu.dispatchEvent(event);
}

function domDiffResults(response) {
    const main = document.getElementById('main');
    let newMain;
    try {
        newMain = JSON.parse(response).elements;
    } catch (err) {
        newMain = response.elements;
    }
    if (newMain){

        newMain = '<div id="main" class="container-full">' + newMain + '</div>'

        morphdom(main, newMain, {
            onBeforeElUpdated: function(fromEl, toEl) {

                // Add generated classes form content block if need (i.e hidden pages)
                if (fromEl.classList.contains('content-block')){
                    toEl.classList = fromEl.classList
                }
                if (fromEl.classList.contains('addblock-container')){
                    toEl.classList = fromEl.classList
                }

                // Skip if same
                if (fromEl.isEqualNode(toEl)) {
                    return false
                }

                return true
            }
        });
    }

}

function domDiffAddBlocks(response) {
    const main = document.getElementById('main');
    let newMain;
    try {
        newMain = JSON.parse(response).elements;
    } catch (err) {
        newMain = response.elements;
    }
    if (newMain){

        newMain = '<div id="main" class="container-full">' + newMain + '</div>'

        morphdom(main, newMain, {
            onBeforeElUpdated: function(fromEl, toEl) {

                // Add generated classes form content block if need (i.e hidden pages)
                if (fromEl.classList.contains('content-block')){
                    return false
                }
                if (fromEl.classList.contains('addblock-container')){
                    toEl.classList = fromEl.classList
                }

                // Skip if same
                if (fromEl.isEqualNode(toEl)) {
                    return false
                }

                return true
            }
        });
    }

}

function insertImageOwnerLinkUnderImage(image) {
    let imageOwnerLink = document.createElement("a")

    imageOwnerLink.classList.add('sidebar-microcopy')
    imageOwnerLink.style.display = "inline-block"
    imageOwnerLink.style.clear = "both"
    imageOwnerLink.innerText = "Photo by " + image.dataset.userName
    imageOwnerLink.href = image.dataset.userProfile
    imageOwnerLink.target = "blank"
    imageOwnerLink.rel = "nofollow"

    image.insertAdjacentHTML('afterend', imageOwnerLink.outerHTML)
}

function insertImageToSideBarGallery(image, sidebar) {
    const imageBrowseGallery = sidebar.querySelector('.sidebar-browse-gallery');
    
    let wrapper = document.createElement('div')
    wrapper.style.float = "left";
    wrapper.style.width = "48%";
    image.style.display = "block"
    wrapper.append(image)
    
    imageBrowseGallery.append(wrapper)

    insertImageOwnerLinkUnderImage(image)
}

function showSideBarLoadingGif(sideBarElement) {
    Util.showElement(sideBarElement.getElementsByClassName('sidebar-browse-loading-gif')[0])
}

function hideSideBarLoadingGif(sideBarElement) {
    Util.hideElement(sideBarElement.getElementsByClassName('sidebar-browse-loading-gif')[0])
}

function closeActiveAccordionsInSideBar(sideBar) {
    const activeAccordions = sideBar.getElementsByClassName('accordion active')

    if (!activeAccordions[0]) return;

    for (let accordion of activeAccordions) {
        accordion.click();
    }
}

function toggleSideBarLoadMoreButton(sideBarElement, responseLength, limit) {
    if (responseLength >= limit) {
        Util.showElement(sideBarElement.getElementsByClassName('sidebar-load-more-button')[0])

        return true
    }

    hideSideBarLoadMoreButton(sideBarElement)
}

function hideSideBarLoadMoreButton(sideBarElement) {
    let loadMoreButton = sideBarElement.getElementsByClassName('sidebar-load-more-button')[0]

    loadMoreButton.dataset.page = '2'

    Util.hideElement(loadMoreButton)
}

function sendUnsplashDownloadTrigger(imageId) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'unsplashImageDownloadTrigger',
        imageId: imageId
    }))
}
