// debounce needs to be declared before the init occurs
let debounceUpdateLineItemQuantityAjax = Util.debounce(updateLineItemQuantityAjax, 20)
let debounceSetLineItemOptionalStatus = Util.debounce(setLineItemOptionalStatus, 500)
let debounceSetLineItemSelectedStatusAjax = Util.debounce(setLineItemSelectedStatusAjax, 500)
let debounceMaybeUpdateLineItemCost = Util.debounce(maybeUpdateLineItemCost, 1000)
let debounceMaybeUpdateLineItemUnitCost = Util.debounce(maybeUpdateLineItemUnitCost, 1000)

function initLineItem() {

    addNewLineItemNewProductListener()
    addNewLineItemExistingProductListener()
    addNewLineItemDividerListener()
    addNewLineItemDiscountListener()

    addDeleteLineItemListener()

    addLineItemDisplayOrderDropListener()
    
    addContentEditableLabelListener()
    addContentEditableDescriptionListener()
    addContentEditableCostListener()
    addContentEditableQuantityListener()
    addContentEditableUnitCostListener()
    addContentEditableTableDiscountAmountListener()

    addSetLineItemSelectedStatus()

    addContentEditableOneOffLabelListener()

    addSelect2ProductSelect()

    addAddBlockShowListener()

}
initLineItem();



let lineItem = {
    productData: {
        products: '',
        position: '',
        table: '',
        quote: '',
    },
    newProductData: {
        recurringType: '',
        productName: '',
        position: '',
        table: '',
        quote: '',
    },
    dividerData: {
        position: '',
        table: '',
        quote: ''
    },
    discountData: {
        position: '',
        table: '',
        quote: ''
    }
}


function addLineItemNewProduct(event) {
    event.preventDefault()
    const form = new FormData(event.target)
    lineItem.newProductData.recurringType = form.get('recurring-type');
    lineItem.newProductData.productName = form.get('product-name');
    lineItem.newProductData.position = form.get('insert-position');
    lineItem.newProductData.table = form.get('insert-table');
    lineItem.newProductData.quote = form.get('insert-quote');
    addLineItemNewProductAjax()
}

function addNewLineItemNewProductListener() {
    const addButtons = document.getElementsByClassName('lineitem-create-new-product');
    for (let addButton of addButtons) {
        addButton.addEventListener('submit', addLineItemNewProduct);
    }
}

function addLineItemExistingProduct(event) {
    event.preventDefault()
    const $form = $(event.target)
    const $select2 = $form.find('.select2-container')
    const form = new FormData(event.target)
	const submitButton = this.querySelector("[type='submit']")
    lineItem.productData.products = form.get('products');
    lineItem.productData.position = form.get('insert-position');
    lineItem.productData.table = form.get('insert-table');
    lineItem.productData.quote = form.get('insert-quote');

    const valid = validateLineItemExistingProductID()

    if (valid) {
        $select2[0].classList.remove('invalid');
		submitButton.disabled = true
        submitButton.innerHTML = '<span uk-spinner="ratio:0.5" style="margin-right: 10px" class="align-icons"></span>Add this item'
        addLineItemExistingProductAjax()
    } else {
        $select2[0].classList.add('invalid');
        console.log('invalid')
    }
}

function validateLineItemExistingProductID() {
    return lineItem.productData.products > 0;
}

function addNewLineItemExistingProductListener() {
    const addButtons = document.getElementsByClassName('lineitem-create-existing-product');
    for (let addButton of addButtons) {
        addButton.addEventListener('submit', addLineItemExistingProduct)
    }
}

function addLineItemDivider(event) {
    event.preventDefault()
    const element = event.target
    lineItem.dividerData.position = element.dataset.lineItemDividerPosition
    lineItem.dividerData.table = element.dataset.lineItemDividerTable
    lineItem.dividerData.quote = element.dataset.lineItemDividerQuote
    addLineItemDividerAjax()
}


function addNewLineItemDividerListener() {
    const addButtons = document.getElementsByClassName('lineitem-add-lineitemdivider');
    for (let addButton of addButtons) {
        addButton.addEventListener('click', addLineItemDivider)
    }
}

function addLineItemDiscount(event) {
    event.preventDefault()
    const element = event.target
    lineItem.discountData.position = element.dataset.lineItemDiscountPosition
    lineItem.discountData.table = element.dataset.lineItemDiscountTable
    lineItem.discountData.quote = element.dataset.lineItemDiscountQuote
    addLineItemDiscountAjax()
}

function addNewLineItemDiscountListener() {
    const addButtons = document.getElementsByClassName('lineitem-add-lineitemdiscount');
    for (let addButton of addButtons) {
        addButton.addEventListener('click', addLineItemDiscount)
    }
}

function deleteLineItem(event) {
    event.preventDefault()
    const element = event.target
    let LineItemId = element.dataset.id;
    swal({
        title: "Are you sure you want to remove this line item?",
        text: getDeleteWarningSwalText(),
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        // dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            deleteLineItemAjax(LineItemId);
        }
    });
}

function addDeleteLineItemListener(){
    const deleteButtons = document.getElementsByClassName('delete-lineitem-trigger');
    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', deleteLineItem)
    }
}


function addLineItemDisplayOrderDropListener() {
    const draggableLineItems = document.getElementsByClassName('pt')

    for (let draggableLineItem of draggableLineItems) {
        draggableLineItem.addEventListener("moved", updateLineItemDisplayOrder);
    }
}

function updateLineItemOriginalValue(event){
    event.preventDefault()
    const element = event.target
    element.originalValue = element.innerHTML
}

function maybeUpdateLineItemLabel(event){
    event.preventDefault()
    const element = event.target
    if (element.originalValue !==  element.innerHTML) {
        updateLineItemLabelAjax(element.dataset.id, element.innerHTML)
    }
}

function addContentEditableLabelListener() {
    const editableFields = document.getElementsByClassName('lineitem-contenteditable-label');

    for (let editableField of editableFields) {
        editableField.addEventListener('focus', updateLineItemOriginalValue)
    }

    for (let editableField of editableFields) {
        editableField.addEventListener('blur', maybeUpdateLineItemLabel)
    }
}


function maybeUpdateLineItemDescription(event){
    event.preventDefault()
    const element = event.target
    if (element.originalValue !==  element.innerHTML) {
        updateLineItemDescriptionAjax(element.dataset.id, element.innerHTML)
    }
}

function addContentEditableDescriptionListener() {
    const editableFields = document.getElementsByClassName('lineitem-contenteditable-description');

    for (let editableField of editableFields) {
        editableField.addEventListener('focus', updateLineItemOriginalValue)
    }

    for (let editableField of editableFields) {
        editableField.addEventListener('blur', maybeUpdateLineItemDescription)
    }
}

function maybeUpdateLineItemCost(event){
    event.preventDefault()
    const element = this
    const lineItem = element.parentNode.parentNode.parentNode //TODO: Better selector
    const lineItemCostElement = lineItem.querySelector('.lineitem-cost')
    let lineItemCost = lineItemCostElement ? lineItemCostElement.innerHTML : ''

    const currencyLocale = lineItem.dataset.currencyLocale
    if ( currencyLocale == 'de_DE'){
        lineItemCost = Number(lineItemCost.replace(/[^0-9,-]+/g,"").replace(',', '.'))
    } else {
        lineItemCost = Number(lineItemCost.replace(/[^0-9.-]+/g,""))
    }
	
    if (element.originalValue !==  element.innerHTML) {
        updateLineItemCostAjax(element.dataset.id, lineItemCost)
    }
}

/**
 * This is needed for Firefox compatibility.
 * Double-click on content-editable fields interpreted differently on Firefox.
 * @param event
 */
function selectAllText(event) {
    let div = event.target;
    window.setTimeout(function() {
        let sel, range;
        if (window.getSelection && document.createRange) {
            range = document.createRange();
            range.selectNodeContents(div);
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(div);
            range.select();
        }
    }, 1);
}

function addContentEditableCostListener() {
    const editableFields = document.getElementsByClassName('lineitem-contenteditable-cost');

    for (let editableField of editableFields) {
        editableField.addEventListener('focus', updateLineItemOriginalValue)
    }

    for (let editableField of editableFields) {
        // Any lower debounce rate could create inconsistencies.
        editableField.addEventListener('keyup', debounceMaybeUpdateLineItemCost)
    }
	
	for (let editableField of editableFields) {
        editableField.addEventListener('dblclick', selectAllText)
    }
}

function maybeUpdateLineItemQuantityAjax(event){
    event.preventDefault()
    const element = this
    const lineItem = element.parentNode.parentNode.parentNode //TODO: Better selector
    const currencyLocale = lineItem.dataset.currencyLocale
    const lineItemCostElement = lineItem.querySelector('.lineitem-cost')
    const lineItemSubTotalElement = lineItem.querySelector('.lineitem-subtotal')
    const lineItemUnitCostElement = lineItem.querySelector('.lineitem-unitcost')
    const lineItemDiscountElement = lineItem.querySelector('.lineitem-discount')

    let lineItemUnitCost = lineItemUnitCostElement ? lineItemUnitCostElement.innerHTML : ''
    let lineItemDiscount = lineItemDiscountElement ? lineItemDiscountElement.innerHTML : ''

    let quantity = parseFloat(element.innerHTML)
    let decimalPlaces = Util.decimalPlaces(quantity)
    if (decimalPlaces > 2) {
        decimalPlaces = 2
    }
    quantity = quantity.toFixed(decimalPlaces)
    if (quantity < 0) {
        quantity = 0
    }
	element.innerHTML = quantity
    // Format the unit cost so it can be multiplied
    if ( currencyLocale == 'de_DE'){
        lineItemUnitCost = Number(lineItemUnitCost.replace(/[^0-9,-]+/g,"").replace(',', '.'))
        lineItemDiscount = Number(lineItemDiscount.replace(/[^0-9,-]+/g,"").replace(',', '.'))
    } else {
        lineItemUnitCost = Number(lineItemUnitCost.replace(/[^0-9.-]+/g,""))
        lineItemDiscount = Number(lineItemDiscount.replace(/[^0-9.-]+/g,""))
    }

    const totalCost = lineItemUnitCost * quantity
    const totalDiscount = lineItemDiscount
    let formattedTotalCost = ''
    let formattedDiscountedTotalCost =''

    // Format it back to it's correct currency format
    if ( currencyLocale == 'de_DE'){
        formattedTotalCost = new Intl.NumberFormat('de-DE', ).format(totalCost)
        formattedDiscountedTotalCost = new Intl.NumberFormat('de-DE', ).format(totalCost - totalDiscount)
    } else {
        formattedTotalCost = new Intl.NumberFormat('en-GB', ).format(totalCost)
        formattedDiscountedTotalCost = new Intl.NumberFormat('en-GB', ).format(totalCost - totalDiscount)
    }

    // Update the elements with the formatted value
    if (lineItemCostElement) {
        lineItemCostElement.innerHTML = formattedTotalCost
    }
    if (lineItemDiscountElement && lineItemSubTotalElement) {
        lineItemCostElement.innerHTML = formattedDiscountedTotalCost
        lineItemSubTotalElement.innerHTML = formattedTotalCost
    }
    if (element.originalValue !==  element.innerHTML) {
        debounceUpdateLineItemQuantityAjax(element.dataset.id, quantity)
    }
}

function addContentEditableQuantityListener() {
    const editableFields = document.getElementsByClassName('lineitem-contenteditable-quantity');

    for (let editableField of editableFields) {
		
		let lineItemElement = editableField.parentNode.parentNode.parentNode
        if (lineItemElement.dataset.isSignedByContact == 1) {
            editableField.contentEditable = false;
            continue
        }

        editableField.addEventListener('focus', updateLineItemOriginalValue)

        editableField.addEventListener('blur', maybeUpdateLineItemQuantityAjax)

        // Debounce for one second
        editableField.addEventListener('change', maybeUpdateLineItemQuantityAjax)
		
		addQuantityStepListener()
    }
}

function maybeUpdateLineItemUnitCost(event){
    event.preventDefault()
    const element = this
    const lineItem = element.parentNode.parentNode //TODO: Better selector
    const lineItemUnitCostElement = lineItem.querySelector('.lineitem-unitcost')
    let lineItemUnitCost = lineItemUnitCostElement ? lineItemUnitCostElement.innerHTML : ''
    const currencyLocale = lineItem.dataset.currencyLocale
    if ( currencyLocale == 'de_DE'){
        lineItemUnitCost = Number(lineItemUnitCost.replace(/[^0-9,-]+/g,"").replace(',', '.'))
    } else {
        lineItemUnitCost = Number(lineItemUnitCost.replace(/[^0-9.-]+/g,""))
    }
	
    if (element.originalValue !==  element.innerHTML) {
        updateLineItemUnitCostAjax(element.dataset.id, lineItemUnitCost)
    }
}

function addContentEditableUnitCostListener() {
    const editableFields = document.getElementsByClassName('lineitem-contenteditable-unitcost');

    for (let editableField of editableFields) {
        editableField.addEventListener('focus', updateLineItemOriginalValue)
    }

    for (let editableField of editableFields) {
        // Any lower debounce rate could create inconsistencies.
        editableField.addEventListener('keyup', debounceMaybeUpdateLineItemUnitCost)
    }
}

function maybeUpdateLineItemTableDiscountAmount(event){
    event.preventDefault()
    const element = event.target
    if (element.originalValue !==  element.innerHTML) {
        updateLineItemTableDiscountAmountAjax(element.dataset.id, element.innerHTML)
    }
}

function addContentEditableTableDiscountAmountListener() {
    const editableFields = document.getElementsByClassName('lineitem-contenteditable-tablediscountamount');

    for (let editableField of editableFields) {
        editableField.addEventListener('focus', updateLineItemOriginalValue)
    }

    for (let editableField of editableFields) {
        editableField.addEventListener('blur', maybeUpdateLineItemTableDiscountAmount)
    }
}

function setLineItemOptionalStatus(event){
    const element = event.target
    let id = element.dataset.id
    let selected = element.checked ? 1 : 0;
    setLineItemOptionalStatusAjax(id, selected)
}

function setLineItemSelectedStatus(event){
    const element = this
    let id = element.dataset.id
    let tableId = element.dataset.tableId
    const selectableBlock = element.parentElement.parentElement;
	const selectTextWrapper = selectableBlock.querySelector('.selected-text')
    const activeClass = "active"
	const buttonSelectedText = element.dataset.selectedText
    const buttonUnselectedText = element.dataset.unselectedText
	
    if (element.classList.contains(activeClass)) {
        element.classList.toggle(activeClass);
        selectableBlock.classList.toggle(activeClass);
        selectTextWrapper.innerHTML = buttonUnselectedText
        debounceSetLineItemSelectedStatusAjax(tableId, id, 0)
    } else {
        element.classList.toggle(activeClass);
        selectableBlock.classList.toggle(activeClass);
        selectTextWrapper.innerHTML = buttonSelectedText
        debounceSetLineItemSelectedStatusAjax(tableId, id, 1)
    }
}

function addSetLineItemSelectedStatus() {
    const optionalCheckboxes = document.getElementsByClassName('pt-optional');
    const selectableButtons = document.getElementsByClassName('pt-choice-button');

    for (let optionalCheckbox of optionalCheckboxes) {
		if (optionalCheckbox.classList.contains('is-signed-click-disabled')) {
            optionalCheckbox.setAttribute('disabled', 'disabled')
            continue;
        }

        optionalCheckbox.addEventListener('click', debounceSetLineItemOptionalStatus)
    }

    for (let selectableButton of selectableButtons) {
		if(selectableButton.classList.contains('is-signed-click-disabled')){
            continue;
        }
		
        selectableButton.addEventListener('click', setLineItemSelectedStatus)

    }
}

function maybeUpdateTemplateOneOffLabel(event){
    event.preventDefault()
    const element = event.target
    if (element.originalValue !==  element.innerHTML) {
        updateOneOffLabelAjax(element.innerHTML, element.dataset.id)
    }
}

function addContentEditableOneOffLabelListener() {
    const editableFields = document.getElementsByClassName('lineitem-contenteditable-one-off-label');

    for (let editableField of editableFields) {
        editableField.addEventListener('focus', updateLineItemOriginalValue)
    }

    for (let editableField of editableFields) {
        editableField.addEventListener('blur', maybeUpdateTemplateOneOffLabel)
    }
}

function addSelect2ProductSelect() {
    $(document).ready(function() {
		if ($('.lineitem-create-existing-product select').length) {
        $('.lineitem-create-existing-product select').select2({
            placeholder: 'Click and search',
            allowClear: true,
            width: '35%'
        });
		}
    });
}

function showLineItemAddBlock(event) {
    const element = this
    const triggerHeight = 20;
    const activeClass = 'show-addblock'
    let rect = element.getBoundingClientRect();
    let y = rect.bottom - event.clientY;  //y position from bottom within the element.
    if (y < triggerHeight) { // in the trigger zone
        if (!element.classList.contains(activeClass)) {
            element.classList.add(activeClass)
        }
    }
    if (y > triggerHeight) { // out of trigger area
        if (element.classList.contains(activeClass)) {
            element.classList.remove(activeClass)
        }
    }
}

function hideLineItemAddBlock(event) {
    const element = event.target
    const activeClass = 'show-addblock'
    if (element.classList.contains(activeClass)) {
        element.classList.remove(activeClass)
    }
}

function addAddBlockShowListener() {
    const lineitems = document.getElementsByClassName('pt-lineitem');
    for (let lineitem of lineitems) {
        lineitem.addEventListener('mousemove', showLineItemAddBlock, false)
        lineitem.addEventListener('mouseleave', hideLineItemAddBlock)
    }
}

function quantityStepUp(event) {
    event.preventDefault()
    const element = event.target
    let target = element.dataset.stepUpTarget;
    let stepElement = document.getElementById(target)
    const changeEvent = new Event("change");

    if ( stepElement instanceof HTMLInputElement ){
        stepElement.stepUp()
        stepElement.dispatchEvent(changeEvent);
        return
    }
    if (stepElement instanceof HTMLElement ){
        let number = parseFloat(stepElement.innerHTML)
        let max = 0;
        let limit = false
        if (element.dataset.stepMax){
            limit = true
            max = parseFloat(element.dataset.stepMax)
        }

        if (isNaN(number)){
            // Do nothing
        } else {
            if ( limit ) {
                if ( number < max  ) {
                    number ++
                }
            } else {
                number++
            }
            stepElement.innerHTML = number.toString();
			stepElement.dispatchEvent(changeEvent);
        }
    }
}

function quantityStepDown(event) {
    event.preventDefault()
    const element = event.target
    let target = element.dataset.stepDownTarget
    let stepElement = document.getElementById(target)
    const changeEvent = new Event("change");

    if ( stepElement instanceof HTMLInputElement ){
        stepElement.stepDown()
        stepElement.dispatchEvent(changeEvent);
        return
    }
    if (stepElement instanceof HTMLElement ){
        let number = parseFloat(stepElement.innerHTML)
        let min = 0;
        let limit = false
        if (element.dataset.stepMin){
            limit = true
            min = parseFloat(element.dataset.stepMin)
        }

        if (isNaN(number)){
            // Do nothing
        } else {
            if ( limit) {
                if ( number > min  ) {
                    number --
                }
            } else {
                number --
            }

            stepElement.innerHTML = number.toString();
			stepElement.dispatchEvent(changeEvent);
        }
    }
}

function addQuantityStepListener( className = 'js-step' ){
    const steps = document.getElementsByClassName(className);
    for (let step of steps) {
        if (step instanceof HTMLElement) {
            if (step.dataset.stepUpTarget) {
                step.addEventListener('click', quantityStepUp)
            }
            if (step.dataset.stepDownTarget) {
                step.addEventListener('click', quantityStepDown)
            }
        }
    }
}

// Helpers

function getLineItemsDisplayOrder() {
    const lineitems = document.getElementsByClassName('pt-lineitem');
    const lineitem_order = [];

    for (i = 0; i < lineitems.length; i++) {
        if (lineitems[i].dataset.id) {
            // Make sure it's unique as UI kit will count the moved element twice.
            if ( lineitem_order.indexOf(lineitems[i].dataset.id) === -1) {
                lineitem_order.push(lineitems[i].dataset.id);
            }
        }
    }
    return lineitem_order;

}

function getTableLineItemsDisplayOrder() {
    const lineitems = document.getElementsByClassName('pt-lineitem');
    const lineitem_order = [];

    for (i = 0; i < lineitems.length; i++) {
        if (lineitems[i].dataset.tableId) {
            let tableId = lineitems[i].dataset.tableId
            lineitem_order[tableId] = [];
        }
    }
    for (i = 0; i < lineitems.length; i++) {
        if (lineitems[i].dataset.id) {
            let tableId = lineitems[i].dataset.tableId
            lineitem_order[tableId].push(lineitems[i].dataset.id);
        }
    }
    return lineitem_order;

}

function addLineItemNewProductAjax(){
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'addLineItemNewProduct',
        recurringType: lineItem.newProductData.recurringType,
        productName: lineItem.newProductData.productName,
        position: lineItem.newProductData.position,
        table: lineItem.newProductData.table,
        quote: lineItem.newProductData.quote
    }))

    xhr.addEventListener('load', function () {
        // Close the open circle nav
        closeAllCircleNavs();
        updateQuoteBlockHtml(this.response)
    })
}

function addLineItemExistingProductAjax(){
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'addLineItemExistingProduct',
        productID: lineItem.productData.products,
        position: lineItem.productData.position,
        table: lineItem.productData.table,
        quote: lineItem.productData.quote
    }))

    xhr.addEventListener('load', function () {
        // Close the open circle nav
        closeAllCircleNavs();
        updateQuoteBlockHtml(this.response)
    })
}

function addLineItem( position, table ) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'addLineItem',
        position: position,
        table: table
    }))

    xhr.addEventListener('load', function () {
        // Close the open circle nav
        closeAllCircleNavs();
        updateBlockResults(this.response)
    })
}

function addLineItemDividerAjax(  ) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'addLineItemDivider',
        position: lineItem.dividerData.position,
        table: lineItem.dividerData.table,
        quote: lineItem.dividerData.quote
    }))

    xhr.addEventListener('load', function () {
        // Close the open circle nav
        closeAllCircleNavs();
        updateQuoteBlockHtml(this.response)
    })
}

function addLineItemDiscountAjax() {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'addLineItemDiscount',
        position: lineItem.discountData.position,
        table: lineItem.discountData.table,
        quote: lineItem.discountData.quote
    }))

    xhr.addEventListener('load', function () {
        // Close the open circle nav
        closeAllCircleNavs();
        updateQuoteBlockHtml(this.response)
    })
}

function deleteLineItemAjax(lineItemId) {
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
            action: 'deleteLineItem',
            lineItemId: lineItemId
        })
    }).then(res => res.json()).then(res => {
        updateQuoteBlockHtml(res)
    });
}

function updateLineItemDisplayOrder() {
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
            action: 'updateLineItemDisplayOrder',
            lineItems: getLineItemsDisplayOrder(),
        })
    }).then(res => res.json()).then(res => {
    });
}

function updateLineItemLabelAjax(lineItemId, label) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'updateLineItemLabel',
        lineItemId: lineItemId,
        label: label,
    }))

    xhr.addEventListener('load', function () {
        updateQuoteBlockHtml(this.response)
    })
}

function updateLineItemDescriptionAjax(lineItemId, description ) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'updateLineItemDescription',
        lineItemId: lineItemId,
        description: description,
    }))

    xhr.addEventListener('load', function () {
        updateQuoteBlockHtml(this.response)
    })
}

function updateLineItemCostAjax(lineItemId, cost ) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'updateLineItemCost',
        lineItemId: lineItemId,
        cost: cost,
    }))

    xhr.addEventListener('load', function () {
        updateQuoteBlockHtml(this.response)
    })
}

function updateLineItemQuantityAjax(lineItemId, quantity ) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'updateLineItemQuantity',
        lineItemId: lineItemId,
        quantity: quantity,
    }))

    xhr.addEventListener('load', function () {
        updateQuoteBlockHtml(this.response)
    })
}

function updateLineItemUnitCostAjax(lineItemId, unitCost ) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'updateLineItemUnitCost',
        lineItemId: lineItemId,
        unitCost: unitCost,
    }))

    xhr.addEventListener('load', function () {
        updateQuoteBlockHtml(this.response)
    })
}

function updateLineItemTableDiscountAmountAjax(lineItemId, tableDiscountAmount ) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'updateLineItemTableDiscountAmount',
        lineItemId: lineItemId,
        tableDiscountAmount: tableDiscountAmount,
    }))

    xhr.addEventListener('load', function () {
        updateQuoteBlockHtml(this.response)
    })
}

function setLineItemSelectedStatusAjax(tableId, lineItemId, selected) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'setLineItemSelectedStatus',
        lineItemId: lineItemId,
        tableId: tableId,
        selected: selected,
    }))

    xhr.addEventListener('load', function () {
        updateQuoteBlockHtml(this.response)
    })
}

function setLineItemOptionalStatusAjax(lineItemId, selected) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'setLineItemOptionalStatus',
        lineItemId: lineItemId,
        selected: selected,
    }))

    xhr.addEventListener('load', function () {
        updateQuoteBlockHtml(this.response)
    })
}

function updateOneOffLabelAjax(oneOffLabel, labelID) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', window.location.href, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify({
        action: 'updateOneOffLabel',
        oneOffLabel: oneOffLabel,
        labelID: labelID // Quote ID for proposals and Template ID for templates
    }))

    xhr.addEventListener('load', function () {
        updateBlockResults(this.response)
    })
}
