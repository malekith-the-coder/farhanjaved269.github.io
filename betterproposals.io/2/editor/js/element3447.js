function elementInit() {
    initSignatureBlock()
    initFWImageBlock()

    if(isProposalPreviewMode()) return; //Stop editor listeners in preview mode

    addNewFeatureBlockListener();
    addNewFwImageListener();
    addNewVideoListener();
    addNewPricingTableListener();
    addNewSignatureBlockListener();

    addBlockDeleteListener();
    addOrderChangeListeners();
    // MOVE THIS TO FUNCTION
    // Circular nav

    var menubutton = document.querySelectorAll(".menu-button");
    var i;
    for (i = 0; i < menubutton.length; i++) {
        menubutton[i].onclick = function(e) {
            e.preventDefault();
            this.classList.toggle('open');
            var parent = this.closest('.circular-menu-block');
            var items = parent.querySelectorAll('.circle a');

            for(var i = 0, l = items.length; i < l; i++) {
                items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";

                items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            }

            parent.classList.toggle('opened');
            parent.querySelector('.circle').classList.toggle('open');
        }
    }

	toggleAddMenuBlocks()
	
	if (document.querySelector(".addpage-button")) {
    var addpagebutton = document.querySelector(".addpage-button");
    var addpagecontainer = document.querySelector(".addpage-container");
    addpagebutton.onclick = function(e) {
        e.preventDefault();
        this.classList.toggle('open');
        addpagecontainer.classList.toggle('open');
    }
	}


}
elementInit();

function initSignatureBlock() {
    const activeSignatureBlock = document.getElementById('signature-switch')

    let signatureType, signatureDrawSwitcher, signatureNameSwitcher;

    if (!activeSignatureBlock) return;

    signatureType = Util.getParentsAttribute(activeSignatureBlock, 'data-signature-type')
    signatureDrawSwitcher = activeSignatureBlock.getElementsByClassName('signature-draw-switcher')[0]
    signatureNameSwitcher = activeSignatureBlock.getElementsByClassName('signature-name-switcher')[0]

    const switcherInput = document.getElementById('signed-method');

    if (signatureType === '1') {
        Util.showElements(signatureNameSwitcher)

        Util.hideElements(signatureDrawSwitcher)
		
		UIkit.tab(activeSignatureBlock).show(0);

        if (switcherInput != undefined) {
            switcherInput.value = "typed"
        }
    }
	
	if (signatureType === '2') {
        Util.showElements(signatureDrawSwitcher)

        Util.hideElements(signatureNameSwitcher)
		
		UIkit.tab(activeSignatureBlock).show(1);

        if (switcherInput != undefined) {
            switcherInput.value = "drawn"
            //setTimeout(function(){ renderSignatureBox(); }, 1000);
			renderSignatureBox()
        }
    }

	
	if (signatureType === '0') {
        Util.showElements(signatureNameSwitcher, signatureDrawSwitcher)
		 UIkit.tab(activeSignatureBlock).show(0);

        if (switcherInput != undefined) {
            switcherInput.value = "typed";
        }
    }

    showPaymentButton()
}

function toggleAddMenuBlocks() {
    var addmenubutton = document.querySelectorAll(".addmenu-button");
    var i;
    for (i = 0; i < addmenubutton.length; i++) {
        addmenubutton[i].removeEventListener('click', toggleAddMenuBlock)
        addmenubutton[i].addEventListener('click', toggleAddMenuBlock, false)
    }
}

function showPaymentButton() {
    let paymentElements = document.getElementsByClassName('make-payment')

    for (let element of paymentElements) {
        if (element.href.includes('payment')) Util.showElement(element);
    }
}

function initFWImageBlock() {
    let FWBlockImages = document.getElementsByClassName('fw-image')
    for (let blockImage of FWBlockImages) {
        blockImage.onload = function() {
            cropFWImage(blockImage)
        }
    }
}

function reCropImages() {
    let FWBlockImages = document.getElementsByClassName('fw-image')
    for (let blockImage of FWBlockImages) {
        cropFWImage(blockImage)
    }
}

function cropFWImage(blockImage){
        let cropRectangle = Util.getParentsAttribute(blockImage, 'data-crop-rectangle')
        if (!cropRectangle) return;

        cropRectangle = cropRectangle.split(',')
        cropRectangle = cropRectangle.map((x) => parseInt(x));

        if (cropRectangle[3] < blockImage.height) {
            let canvas = blockImage.parentElement.getElementsByClassName('fw-cropped-image-canvas')[0];
            let contex = canvas.getContext("2d");

            let imageWidth = blockImage.width;
            let newHeight = imageWidth * cropRectangle[3] / cropRectangle[2]
            canvas.width = imageWidth
            canvas.height = newHeight

            contex.drawImage(blockImage, 0, cropRectangle[1], cropRectangle[2], cropRectangle[3],
                0, 0, imageWidth, newHeight);

            Util.showElement(canvas)
            Util.hideElement(blockImage)
        }
}

function addNewFeatureBlockListener() {
    let newFeatureBlockTriggers = document.getElementsByClassName("add-new-feature-block");

    for (let i = 0; i < newFeatureBlockTriggers.length; i++) {
        let parentContainer = newFeatureBlockTriggers[i].parentElement.parentElement; // TODO: Use a better selector
        let page = parentContainer.dataset.insertPage;
        let position = parentContainer.dataset.insertPosition;
        newFeatureBlockTriggers[i].addEventListener('click', (e) => {
            e.preventDefault()
			newFeatureBlockTriggers[i].classList.remove('icon-contentblock');
			newFeatureBlockTriggers[i].classList.add('show-spinner');
			newFeatureBlockTriggers[i].innerHTML='<span uk-spinner="ratio:0.6"></span><span class="addblock-text">Content block</span>';
            addNewFeatureBlock(page, position)
        })
    }
}

function addNewFwImageListener() {
    let newFwImageTriggers = document.getElementsByClassName("add-new-fw-image");

    for (let i = 0; i < newFwImageTriggers.length; i++) {
        let parentContainer = newFwImageTriggers[i].parentElement.parentElement; // TODO: Use a better selector
        let page = parentContainer.dataset.insertPage;
        let position = parentContainer.dataset.insertPosition;
        newFwImageTriggers[i].addEventListener('click', (e) => {
            e.preventDefault()
			newFwImageTriggers[i].classList.remove('icon-fullimage');
			newFwImageTriggers[i].classList.add('show-spinner');
			newFwImageTriggers[i].innerHTML='<span uk-spinner="ratio:0.6"></span><span class="addblock-text">Full width image</span>';
			
            addNewFwImage(page, position)
        })
    }
}

function addNewVideoListener() {
    let newVideoTriggers = document.getElementsByClassName("add-new-video");

    for (let i = 0; i < newVideoTriggers.length; i++) {
        let parentContainer = newVideoTriggers[i].parentElement.parentElement; // TODO: Use a better selector
        let page = parentContainer.dataset.insertPage;
        let position = parentContainer.dataset.insertPosition;
        newVideoTriggers[i].addEventListener('click', (e) => {
            e.preventDefault()
 			newVideoTriggers[i].classList.remove('icon-video');
			newVideoTriggers[i].classList.add('show-spinner');
			newVideoTriggers[i].innerHTML='<span uk-spinner="ratio:0.6"></span><span class="addblock-text">Video</span>';
           addNewVideo(page, position)
        })
    }
}

function addNewPricingTableListener() {
    let newPricingTableTriggers = document.getElementsByClassName("add-new-pricing-table");

    for (let i = 0; i < newPricingTableTriggers.length; i++) {
        let parentContainer = newPricingTableTriggers[i].parentElement.parentElement; // TODO: Use a better selector
        let page = parentContainer.dataset.insertPage;
        let position = parentContainer.dataset.insertPosition;
        newPricingTableTriggers[i].addEventListener('click', (e) => {
            e.preventDefault()
            if (newPricingTableTriggers[i].classList.contains('disabled')){
                return
            }

 			newPricingTableTriggers[i].classList.remove('icon-pricingtable');
			newPricingTableTriggers[i].classList.add('show-spinner');
			newPricingTableTriggers[i].innerHTML='<span uk-spinner="ratio:0.6"></span><span class="addblock-text">Pricing block</span>';

            addNewPricingTable(page, position)
        })
    }
}

function addNewSignatureBlockListener() {
    let newSignatureBlockTriggers = document.getElementsByClassName("add-new-signature-block");

    for (let i = 0; i < newSignatureBlockTriggers.length; i++) {
        let parentContainer = newSignatureBlockTriggers[i].parentElement.parentElement; // TODO: Use a better selector
        let page = parentContainer.dataset.insertPage;
        let position = parentContainer.dataset.insertPosition;
        newSignatureBlockTriggers[i].addEventListener('click', (e) => {
            e.preventDefault()
            if (newSignatureBlockTriggers[i].classList.contains('disabled')){
                return
            }

 			newSignatureBlockTriggers[i].classList.remove('icon-signatureblock');
			newSignatureBlockTriggers[i].classList.add('show-spinner');
			newSignatureBlockTriggers[i].innerHTML='<span uk-spinner="ratio:0.6"></span><span class="addblock-text">Digital signature</span>';

            addNewSignatureBlock(page, position)
        })
    }
}


function addNewCircleNavListener(element) {

    const circleNav = element;
    const menuButton = element.querySelector('.addmenu-button');

    menuButton.onclick = function(e) {
        e.preventDefault();
        // Close any other open circle navs
        closeAllCircleNavs();

        this.classList.toggle('open');
        var parent = this.closest('.add-menu-block');
        var items = parent.querySelectorAll('.addblock a');

        for(var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";

            items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
        }

        parent.classList.toggle('opened');
        parent.querySelector('.addblock').classList.toggle('open');
    }

    let page = circleNav.dataset.insertPage;
    let position = circleNav.dataset.insertPosition;

    //Button Listeners
    const featureBlock = element.querySelector('.add-new-feature-block');
    const fwImage = element.querySelector('.add-new-fw-image');
    const video = element.querySelector('.add-new-video');
    const pricingTable = element.querySelector('.add-new-pricing-table');
    const signatureBlock = element.querySelector('.add-new-signature-block');

    featureBlock.addEventListener('click', (e) => {
        e.preventDefault()
        addNewFeatureBlock(page, position)
        updateElementDisplayOrder()
    })
    fwImage.addEventListener('click', (e) => {
        e.preventDefault()
        addNewFwImage(page, position)
        updateElementDisplayOrder()
    })
    video.addEventListener('click', (e) => {
        e.preventDefault()
        addNewVideo(page, position)
        updateElementDisplayOrder()
    })
    pricingTable.addEventListener('click', (e) => {
        e.preventDefault()
        addNewPricingTable(page, position)
        updateElementDisplayOrder()
    })
    signatureBlock.addEventListener('click', (e) => {
        e.preventDefault()
        addNewSignatureBlock(page, position)
        updateElementDisplayOrder()
    })

}

function toggleAddMenuBlock(e) {
    e.preventDefault();
    this.classList.toggle('open');
    var parent = this.closest('.add-menu-block');
    var block = this.parentElement.parentElement;

    parent.classList.toggle('opened');
    parent.querySelector('.addblock').classList.toggle('open');
    block.classList.toggle('open');
}

function getElementsDisplayOrder() {
    const elements = document.getElementsByClassName('content-block');
    const elementsArray = [];
    let currentPage = 0;
    let insertPosition = 1;

    for (i = 0; i < elements.length; i++) {
        let pageID = elements[i].dataset.pageId;
        let elementID = elements[i].dataset.elementId;
        if (currentPage === 0) {
            currentPage = pageID;
        }
        if( pageID !== currentPage ) {
            currentPage = pageID; // reset the page
            insertPosition = 1; // reset the insert increment
        }
        elementsArray.push({
            "ElementID" : elementID,
            "PageID" : pageID,
            "DisplayOrder" : insertPosition
        });
        insertPosition++;
    }
    return elementsArray;
}

function refreshCircleNavInsertOrder() {
    let circleNavs = document.getElementsByClassName('add-menu-block');
    let currentPage = 0;
    let insertPosition = 1;
    for (i = 0; i < circleNavs.length; i++) {

        circleNavPage = circleNavs[i].dataset.insertPage

        if (currentPage === 0 ){
            currentPage = circleNavs[i].dataset.insertPage; // reset the page
        }
        if( circleNavPage !== currentPage ) {
            currentPage = circleNavs[i].dataset.insertPage; // reset the page
            insertPosition = 1; // reset the insert increment
        }

        circleNavs[i].dataset.insertPosition = insertPosition;
        insertPosition++;

    }
}

function swapContentBlocks( firstElement, secondElement) {

    const firstElementZIndex = firstElement.style.zIndex
    const secondElementZIndex = secondElement.style.zIndex

    firstElement.style.zIndex = secondElementZIndex
    secondElement.style.zIndex = firstElementZIndex

    Util.swapNodes(firstElement,secondElement)

}

function isNotValidForElementOrderChange(firstElement, secondElement) {
    if (!firstElement || !secondElement || !firstElement.hasAttribute('data-page-id') ||
        !secondElement.hasAttribute('data-page-id') || !secondElement.hasAttribute('data-element-id') ||
        !firstElement.hasAttribute('data-element-id')) return true; //Control two elements has needed attributes.

    let firstElementsPageID = firstElement.dataset.pageId;
    let secondElementsPageID = secondElement.dataset.pageId;

    return isDocumentMultiPageView() && secondElementsPageID != firstElementsPageID;
}

function addOrderChangeListeners() {
    let contentBlocks = [...document.getElementsByClassName('content-block')];

    for (let [index] of contentBlocks.entries()) {
        let arrowUp = contentBlocks[index].getElementsByClassName('icon-arrowup')[0]
        let arrowDown = contentBlocks[index].getElementsByClassName('icon-arrowdown')[0]

        if (arrowUp) {
            arrowUp.addEventListener('click', function () {
                let contentBlocks = [...document.getElementsByClassName('content-block')];

                // find parent block node index in the array
                let thisIndex = contentBlocks.indexOf(this.closest('.content-block'));

                let firstElement = contentBlocks[thisIndex];
                let secondElement = contentBlocks[thisIndex - 1]

                if (isNotValidForElementOrderChange(firstElement, secondElement)) return false;

                let firstElementAddblock = firstElement.nextElementSibling
                let secondElementAddblock = secondElement.nextElementSibling
                if (firstElementAddblock.classList.contains('addblock-container')) {
                    if (secondElementAddblock.classList.contains('addblock-container')) {
                        Util.swapNodes(firstElementAddblock,secondElementAddblock)
                    }
                }

                swapContentBlocks(firstElement,secondElement)

                // Wait for 1 second for multiple moves
                Util.debounce( updateElementDisplayOrder(), 1000)
            })
        }

        if (arrowDown) {
            arrowDown.addEventListener('click', function () {
                let contentBlocks = [...document.getElementsByClassName('content-block')];

                // find parent block node index in the array
                let thisIndex = contentBlocks.indexOf(this.closest('.content-block'));

                let firstElement = contentBlocks[thisIndex];
                let secondElement = contentBlocks[thisIndex + 1]

                if (isNotValidForElementOrderChange(firstElement, secondElement)) return false;

                let firstElementAddblock = firstElement.nextElementSibling
                let secondElementAddblock = secondElement.nextElementSibling
                if (firstElementAddblock.classList.contains('addblock-container')) {
                    if (secondElementAddblock.classList.contains('addblock-container')) {
                        Util.swapNodes(firstElementAddblock,secondElementAddblock)
                    }
                }

                swapContentBlocks(firstElement,secondElement)

                // Wait for 1 second for multiple moves
                Util.debounce( updateElementDisplayOrder(), 1000)
            })
        }
    }
}

function closeAllCircleNavs() {
    let circleNavs = document.getElementsByClassName('add-menu-block');
    for (i = 0; i < circleNavs.length; i++) {
		circleNavs[i].classList.remove('opened');
        circleNavs[i].querySelector('.addblock').classList.remove('open')
        circleNavs[i].querySelector('.addmenu-button').classList.remove('open');
    }
}

function addBlockDeleteListener() {
    let contentBlocks = document.getElementsByClassName('content-block');
    if(contentBlocks[0] == undefined) return;

    for (let block of contentBlocks) {
        let trashIcon = block.getElementsByClassName('icon-trash')[0]
        if(!trashIcon) continue;

        block.getElementsByClassName('icon-trash')[0].addEventListener('click', function () {
            swal({
                title: "Are you sure you want to remove this block?",
                text: getDeleteWarningSwalText(),
                icon: "warning",
                //buttons: true,
				buttons: ["Cancel", "Delete"],
                //dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {

                    // remove the next addblock container
                    let addblock = block.nextElementSibling
                    if (addblock.classList.contains('addblock-container')) {
                        addblock.parentNode.removeChild(addblock)
                    }

                    // remove the element from the dom
                    block.parentNode.removeChild(block);

                    deleteElement(block.dataset.elementId);
                }
            });
        })
    }
}

function updateRecycleBinData(res) {
    document.getElementById('latestRecycleBinItems').dataset.content = res.latestRecycleBinItems
}

function updateAddBlockButtonsAfterElementDelete(deletedElementType) {
    let addBlockButtons;

    if (deletedElementType === 'sign') {
        addBlockButtons = document.getElementsByClassName('add-new-signature-block')
    }

    if (deletedElementType === 'quote') {
        addBlockButtons = document.getElementsByClassName('add-new-pricing-table')
    }

    if (!addBlockButtons) return;

    for (let button of addBlockButtons) {
        button.classList.remove('disabled');
        button.removeAttribute("uk-tooltip");
    }
}

// AJAX
function updateElementDisplayOrder() {

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
            action: 'updateElementsDisplayOrder',
            elements: getElementsDisplayOrder(),
        })
    }).then(res => res.json()).then(res => {
        console.log('updated element order')
        //domDiffAddBlocks(res)
    });
}

function deleteElement(id) {
    fetch('', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': Util.getCSFRToken()
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            action: 'deleteElement',
            elementsID: id
        })
    }).then(res => res.json()).then(res => {
        updateBlockResults(res)
        updateRecycleBinData(res)
        updateTotalDeletedElements(res.totalDeletedElements)
        updateAddBlockButtonsAfterElementDelete(res.deletedElementType)
    });
}

function addNewFeatureBlock(page, position) {
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
            action: 'addNewFeatureBlock',
            page: page,
            position: position
        })
    }).then(res => res.json()).then(res => {
        updateBlockResults(res)
    });
}

function addNewFwImage(page, position) {
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
            action: 'addNewFwImage',
            page: page,
            position: position
        })
    }).then(res => res.json()).then(res => {
        updateBlockResults(res)
    });
}

function addNewVideo(page, position) {
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
            action: 'addNewVideo',
            page: page,
            position: position
        })
    }).then(res => res.json()).then(res => {
        updateBlockResults(res)
    });
}

function addNewPricingTable(page, position) {
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
            action: 'addNewPricingTable',
            page: page,
            position: position
        })
    }).then(res => res.json()).then(res => {
        updateBlockResults(res)
    });
}

function addNewSignatureBlock(page, position) {
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
            action: 'addNewSignatureBlock',
            page: page,
            position: position
        })
    }).then(res => res.json()).then(res => {
        updateBlockResults(res)
    });
}


window.addEventListener('load', (event) => {
    console.log( 'load\n' );
});

document.addEventListener('readystatechange', (event) => {
    console.log( `readystate: ${document.readyState}\n` );
});

document.addEventListener('DOMContentLoaded', (event) => {
    console.log( `DOMContentLoaded\n` );
});
