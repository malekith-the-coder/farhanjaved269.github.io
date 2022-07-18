function initQuoteTable() {

    addQuoteTableListener()

    deleteQuoteTableListener()

    addQuoteTableDisplayOrderDropListener()

}
initQuoteTable();

function addQuoteTable(event) {
    event.preventDefault()
    const element = event.target
    let quoteID = element.dataset.blockId
    let quotePosition = element.dataset.insertPosition
    addQuoteTableAjax(quoteID, quotePosition)
}

function addQuoteTableListener() {
    let addNewQuoteTableTriggers = document.getElementsByClassName('add-new-table');
    for (let addNewQuoteTableTrigger of addNewQuoteTableTriggers) {
        addNewQuoteTableTrigger.addEventListener('click', addQuoteTable)
    }
}

function deleteQuoteTable(event) {
    event.preventDefault()
    const element = event.target
    let quoteTableID = element.dataset.tableId

    swal({
        title: "Are you sure you want to remove this pricing table?",
        text: "You can always add it again later",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        // dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            deleteQuoteTableAjax(quoteTableID);
        }
    });

}

function deleteQuoteTableListener() {
    let deleteQuoteTableTriggers = document.getElementsByClassName('delete-quote-table');
    for (let deleteQuoteTableTrigger of deleteQuoteTableTriggers) {
        deleteQuoteTableTrigger.addEventListener('click', deleteQuoteTable)
    }
}

function addQuoteTableDisplayOrderDropListener() {
    const draggableQuoteTables = document.getElementsByClassName('quote-tables')

    for (let draggableQuoteTable of draggableQuoteTables) {
        draggableQuoteTable.addEventListener("moved", updateQuoteTableDisplayOrder);
    }
}

function getQuoteTableDisplayOrder() {
    const quoteTables = document.getElementsByClassName('pt-container');
    const quoteTablesOrder = [];

    for (i = 0; i < quoteTables.length; i++) {
        if (quoteTables[i].dataset.id) {
            // Make sure it's unique as UI kit will count the moved element twice.
            if ( quoteTablesOrder.indexOf(quoteTables[i].dataset.id) === -1) {
                quoteTablesOrder.push(quoteTables[i].dataset.id);
            }
        }
    }
    return quoteTablesOrder;

}


function addQuoteTableAjax(quoteID, quotePosition) {
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
            action: 'addQuoteTable',
            quoteID: quoteID,
            quotePosition: quotePosition
        })
    }).then(res => res.json()).then(res => {
        updateQuoteBlockHtml(res);
    });
}

function deleteQuoteTableAjax(quoteTableID) {
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
            action: 'deleteQuoteTable',
            quoteTableID: quoteTableID
        })
    }).then(res => res.json()).then(res => {
        updateQuoteBlockHtml(res)
        updateLatestRecycleBinQuoteTableResults(res.latestContentLibraryQuoteTables)
        updateTotalDeletedQuoteTables(res.totalDeletedQuoteTables)
        
        resetRecycleBinSidebar()
    });
}

function updateQuoteTableDisplayOrder() {
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
            action: 'updateQuoteTableDisplayOrder',
            quoteTables: getQuoteTableDisplayOrder(),
        })
    }).then(res => res.json()).then(res => {
    });
}
