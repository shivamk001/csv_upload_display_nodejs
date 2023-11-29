import {
    attachEventListenersPagination,
    setDocumentLengthPagination,
    setRowsPerPagePagination,
    // resetselectNumOfButtons,
    setTotalButtonsPagination,
    changeButtonsPerDisplay,
    addnumsButtonsDivPagination,
    changePageNumber
} from './pagination.js'

let order = true//IN WHICH ORDER THE ROWS SHOULD BE DISPLAYED
let columnHeader = []//THE COLUMN HEADER
let allData = []//TO PRESERVE FULL DATA, USED TO RESET DATUM
let datum = []//FULL DATA, USED EVERYWHERE
let rowPerPage = 10//HOW MANY ROWS TO DISPLAY PER PAGE
let fileName = ''//NAME OF THE CSV FILE


function toggleOrder() {
    order = !order
}

function setRowPerPage(rPP) {
    rowPerPage = rPP
    setRowsPerPagePagination(rPP)
    setTotalButtonsPagination()
    // resetselectNumOfButtons()
    changeButtonsPerDisplay(5)
    addnumsButtonsDivPagination()
    changePageNumber(1)
}

//allData is used when reset is done
function setAllData(data) {
    allData = [...data]
}

//TO SET DATUM AFTER SELECTED FILES FORM IS SUCCESSFULLY SUBMITTED
function setDatum(data) {
    datum = data
}

//TO SET COLUMN HEADER AFTER SELECTED FILES FORM IS SUCCESSFULLY SUBMITTED
function setColumnHeader(header) {
    columnHeader = [...header]
}

//TO SET FILENAME AFTER SELECTED FILES FORM IS SUCCESSFULLY SUBMITTED
function setFileName(fN) {
    fileName = fN
}


//TO SORT THE DATA IN EITHER DESCENDING ORDER OR ASCENDING ORDER
function sortData(data, index) {
    console.log("Order in sortData:", order)
    //console.log("Data in SortData:", data)

    data.sort(
        (a, b) => {
            if (a[index] < b[index]) {
                if (order) {
                    return -1;
                }
                else {
                    return 1;
                }

            }
            else if (a[index] > b[index]) {
                if (order) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
            return 0;
        }
    )
    toggleOrder()
    //console.log('Data:', data, order)

    //displaySearchBoxTablePagination([...data])
    //createTable([...data])
    createTable(data.slice(0, rowPerPage))
}





//CREATE THE SEARCH BY COLUMN VALUE FORM
function createSelectColumn() {
    let $select = $(`
    <select name="column" id="columnSelect" required>
        <option value="">Choose a Column</option>
    </select>`
    )

    columnHeader.forEach((column, indx) => {
        let $op = $(`<option value="${indx}">${column}</option>`)
        $select.append($op)
    });
    $('#searchByColumnValueForm').append($select)
    $('#searchByColumnValueForm').append('<input type="text" name="columnValue" id="columnValue" placeholder="Enter column value" required></input>')
    $('#searchByColumnValueForm').append('<button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>')
}


//CREATES THE TABLE
function createTable(data) {
    $('#columnRow').empty()
    $('#tableBody').empty()
    columnHeader.forEach((column, indx) => {
        let $th;
        if (order) {
            $th = $(`<th value=${column} id=${column}><small>${column}</small> <i class="fa-solid fa-angle-down"></i></th>`)
        }
        else {
            $th = $(`<th value=${column} id=${column}><small>${column}</small> <i class="fa-solid fa-angle-up"></i></th>`)
        }
        $th.on('click', { value: column, index: indx }, function (e) {
            console.log(e.data)
            //sort by the column
            sortData(datum, e.data.index)
        })



        $('#columnRow').append($th)
    });

    data.forEach(row => {
        let $tr = $('<tr>')
        row.forEach(col => {
            $tr.append(`<td><small>${col}</small></td>`)
        })
        $('#tableBody').append($tr)
    })
}





//CREATE A DIV WHICH DISPLAYS ALL NAME OF THE FILE SELECTED TO DISPLAY AS TABLE
function createSelectedFilesDiv() {
    $('#displaySelectedFileDiv').empty()
    $('#displaySelectedFileDiv').append(`<small>Selected FileName</small><p style="font-weight: bold;">${fileName}</p>`)
}

//CREATE A DIV WHICH DISPLAYS TOTAL NUMBER OF ROWS OF THE FILE SELECTED TO DISPLAY AS TABLE
function createTotalRowsDiv() {
    $('#displayTotalRowsDiv').empty()
    $('#displayTotalRowsDiv').append(`<small> Total Rows: </small><span style="font-weight: bold;">${datum.length}</span>`)
}


//CREATE A DIV WHICH DISPLAYS 'DISPLAYING ROWS PER COLUMN SELECT INPUT'
function createRowsPerColumnSelect() {

    //EVENT HANDLER TO CHANGE ROWS PER COLUMN IN 'DISPLAYING ROWS PER COLUMN SELECT INPUT'
    function changeRowsPerColumn(event) {
        let val = event.target.value
        setRowPerPage(val)
        console.log('Rowspercolumn:', val)
        //displaySearchBoxTablePagination(finalData.slice(0, val))
        createTable(datum.slice(0, val))
    }

    let $rowsPerColumn = $('#rowsPerColumn')
    // $rowsPerColumnSelect.empty()
    console.log($rowsPerColumn)
    let $select = $(`    
        <select value="paginationVal" id="rowsPerColumnSelect">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
        </select>`)
    $select.on('change', changeRowsPerColumn)
    $rowsPerColumn.append('<small>Displaying rows per column:</small>')
    $rowsPerColumn.append($select)
}



export function resetRowsPerColumnSelect() {
    $('#rowsPerColumnSelect').val(5)
}



//CREATE RESET BUTTON WHICH RESETS THE SEARCH BY COLUMN FORM AND DISPLAY FULL DATA
function createResetButton() {

    function resetsearchByColumnValueForm() {
        document.getElementById('searchByColumnValueForm').reset()
        //$('#searchByColumnValueForm').val('')
    }

    //TO RESET THE SEARCH BY COLUMN FORM AND DISPLAY ALL ROWS OF FULL DATA
    function reset() {
        setDatum(allData)
        createTotalRowsDiv()
        setRowPerPage(10)
        createTable(datum.slice(0, rowPerPage))

        // resetselectNumOfButtons()
        resetRowsPerColumnSelect()
        resetsearchByColumnValueForm()
        setDocumentLengthPagination(datum.length)
        setRowsPerPagePagination(rowPerPage)
        setTotalButtonsPagination()
        changeButtonsPerDisplay(5)
        addnumsButtonsDivPagination()
    }

    let $button = $('<button type="button"><i class="fa-solid fa-arrows-rotate"></i></button>')
    $button.on('click', function () { reset() })
    $('#searchByColumnValueForm').append($button)
    
}


//CREATE FORM TO SELECT WHICH COLUMN TO DISPLAY AS CHOOSEN GRAPH
function createPlotForm() {

    //EVENT HANDLER WHICH DISPLAYS GRAPH ON SUBMIT OF PLOT GRAPH FORM
    function plotData(event) {

        //EVENTHANDLER WHICH CLOSES PLOT DATA
        function closePlotData() {
            $('#chartingDiv').fadeOut("slow")
        }
    
        //console.log($('#plotForm').serializeArray())
        let formData = $('#plotForm').serializeArray()
        let column = formData[0].value
        let graph = formData[1].value
        //console.log(column, graph)
        console.log(column, graph)
        let dataa = []
        datum.forEach(col => {
            dataa.push(col[column])
        })
        let xarr = []
        let yarr = []
        dataa.forEach(col => {
            console.log(col)
            if (xarr.findIndex(el => el == col) == -1) {
                xarr.push(col)
                yarr.push(dataa.filter((el) => el == col).length)
                console.log(col, dataa.filter((el) => el == col).length)
            }
        })
        console.log("XARR:", xarr, yarr)
        console.log("YARR:", xarr, yarr)
        $('#chartingDiv').empty()
        let $xbutton = $('<button>X</button>')
        $xbutton.on('click', function () { closePlotData() })
    
        const xArray = xarr;
        const yArray = yarr;
    
        const data = [{
    
        }];
    
        switch (graph) {
            case 'bar':
                data[0].x = xArray
                data[0].y = yArray
                data[0].type = graph
            case 'pie':
                data[0].labels = xArray
                data[0].values = yArray
                data[0].type = graph
    
        }
    
    
    
    
        const layout = { title: "Graph" };
        Plotly.newPlot("chartingDiv", data, layout);
        $('#chartingDiv').css({ 'position': 'fixed', 'left': '30%', 'top': '10%', 'width': '500px', 'height': '500px' })
        $('#chartingDiv').append($xbutton)
        $('#chartingDiv').fadeIn("slow")
        event.preventDefault()
    }

    let $button = $('<button type="submit"><i class="fa-solid fa-chart-simple"></i></button>')
    // $button.on('click', function(){
    //     plotData()})

    let $selectColumns = $(
        `<select id="plotFormSelectColumn" name="plotFormSelectColumn" required>
        <option value="">Choose a column</option>
    </select>`)
    columnHeader.forEach((column, index) => {
        $selectColumns.append(`<option value="${index}">${column}</option>`)
    })

    let $form = $('#plotForm')

    let $selectGraphs = $(
        `<select id="plotFormSelectGraph" name="plotFormSelectGraph" required>
            <option value="">Choose a Graph</option>
            <option value="bar">Bar Graph</option>
            <option value="pie">Pie Chart</option>
        </select>`)
    $form.append($selectColumns)
    $form.append($selectGraphs)
    $form.append($button)

    $form.on('submit', plotData)

}

//EVENT HANDLER WHEN SEARCH BY COLUMN FORM IS SUBMITTED
export function searchByColumnValueForm(event) {
    console.log('Search By Column Form Submitted')

    let formData = $('#searchByColumnValueForm').serializeArray()

    let columnIndx = formData[0]['value']
    let columnValue = formData[1]['value']

    let filteredData = datum.filter(data => {
        return data[columnIndx] == columnValue
    })
    console.log(filteredData)
    //table stuff
    setDatum(filteredData)
    createTotalRowsDiv()//

    //pagination stuff
    setDocumentLengthPagination(datum.length)
    setRowPerPage(10)
    createTable(datum.slice(0, rowPerPage))//
    resetRowsPerColumnSelect()//
    //resetselectNumOfButtons()//
    //
    //setRowsPerPagePagination(rowPerPage) //called twice, first through setRowPerPage
    //setTotalButtonsPagination()//
    //changeButtonsPerDisplay(5)
    //addnumsButtonsDivPagination()
    event.preventDefault();
}



function pageButtonClick(pageNumber) {
    console.log('PAGENUMBER:', pageNumber)
    let upper = pageNumber * rowPerPage
    let lower = upper - rowPerPage
    console.log("UPPER LOWER:", upper, lower)
    createTable(datum.slice(lower, upper))
}

//EVENT HANDLER WHEN A FILE IS SELECTED FROM UPLOADED FILES 
export function selectedFilesFormOnSubmit(event) {
    //console.log('Form Submitted')
    //console.log($('#selectedFilesForm').serialize().split('='))
    let fileName = $('#selectedFilesForm').serialize().split('=')[1]
    fileName = fileName.replace('%5C', '\\').replace('%3A', ':')
    //console.log(fileName)
    $.ajax({
        type: 'POST',
        url: '/files/selectedFiles',
        data: JSON.stringify({ fileName: fileName }),
        contentType: 'application/json',
        dataType: 'json',
        encode: true,
        error: function(err){
            
            let filename=err.responseJSON.fileName.split(':')[1]
            let errorText=err.responseJSON.error
            // console.log(filename, errorText)
            console.log(filename, errorText)
            let $errorText=$(`
                <small style="color: red;">${errorText}</small>
                <button id="displayAnother">
                    <a href="/">Display another file</a>
                </button>
            `)
            $('#selectedFilesDiv').empty();
            $('#selectedFilesDiv').append($errorText)
        },
        success: function (response) {
            let { fileName, data } = response
            console.log(fileName, data)
            setColumnHeader([...data[0]])
            setAllData([...data.slice(1)])
            setDatum([...data.slice(1)])
            setFileName(fileName)

            $('#selectedFilesDiv').remove();
            $('#fileSubmitDiv').remove();
            $('#tableDiv').css('display', 'flex')

            //table, header, form stuff
            //createHeader()
            createSelectedFilesDiv()
            createTotalRowsDiv()
            createRowsPerColumnSelect()
            createSelectColumn()
            createResetButton()
            createPlotForm()
            createTable(datum.slice(0, rowPerPage))

            //pagination stuff
            attachEventListenersPagination(pageButtonClick)
            setDocumentLengthPagination(datum.length)
            //this function takes care of a lot of things in pagination
            setRowPerPage(rowPerPage)
        },
        
    })
    event.preventDefault();
}

