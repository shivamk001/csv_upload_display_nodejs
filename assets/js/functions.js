import {attachEventListenersPagination, setDocumentLengthPagination, setRowsPerPagePagination, resetselectNumOfButtons, setTotalButtonsPagination, changeButtonsPerDisplay, addnumsButtonsDivPagination, changePageNumber} from './pagination.js'

let order=true
let columnHeader=[]
let allData=[]
let datum=[]
let rowPerPage=5
let fileName=''

function toggleOrder(){
    order=!order
}

function setRowPerPage(rPP){
    rowPerPage=rPP
    setRowsPerPagePagination(rPP)
    setTotalButtonsPagination()
    resetselectNumOfButtons()
    changeButtonsPerDisplay(5)
    addnumsButtonsDivPagination()
    changePageNumber(1)
}

function setAllData(data){
    allData=[...data]
}

function setDatum(data){
    datum=data
}

function setColumnHeader(header){
    columnHeader=[...header]
}

function setFileName(fN){
    fileName=fN
}

function sortData(data, index){
    console.log("Order in sortData:", order)
    //console.log("Data in SortData:", data)

    data.sort(
         (a, b)=>{
            if(a[index]<b[index]){
                if(order){
                    return -1;
                }
                else{
                    return 1;
                }
                
            }
            else if(a[index]>b[index]){
                if(order){
                    return 1;
                }
                else{
                    return -1;
                }
            }
            return 0;
         }
    )
    toggleOrder()
    //console.log('Data:', data, order)

    //displaySearchBoxTablePagination([...data])
    createTable([...data])
}

function createSelect(){
    let $select=$(`
    <select name="column" id="columnSelect" required>
        <option value="">Choose a Column</option>
    </select>`
    )

    columnHeader.forEach((column, indx) => {
        let $op=$(`<option value="${indx}">${column}</option>`)
        $select.append($op)
    });
    $('#searchByColumnValueForm').append($select)
    $('#searchByColumnValueForm').append('<input type="text" name="columnValue" id="columnValue" placeholder="Enter column value" required></input>')
    $('#searchByColumnValueForm').append('<input type="submit">')
}

function createTable(data){
    $('#columnRow').empty()
    $('#tableBody').empty()
    columnHeader.forEach((column, indx) => {
        let $th;
        if(order){
            $th=$(`<th value=${column}>${column} &nbsp <i class="fa-solid fa-angle-down"></i></th>`)
        }
        else{
            $th=$(`<th value=${column}>${column} &nbsp <i class="fa-solid fa-angle-up"></i></th>`)
        }
        $th.on('click', {value: column, index: indx}, function(e){
            //console.log(e.data)
            //sort by the column
            sortData(data, e.data.index)
        })

        

        $('#columnRow').append($th)
    });

    data.forEach(row=>{
        let $tr= $('<tr>')
        row.forEach(col=>{
            $tr.append(`<td>${col}</td>`)
        })
        $('#tableBody').append($tr)
    })
}

function createHeader(){
    $('#header').append(
        `
        <div style="display: flex; flex-direction: row; align-items: center;">
            <h4>CSV File Viewer</h4>
        </div>
        <div>
            <button id="displayAnother">
                <a href="/">Display another file</a>
            </button>
        </div>`)
}

function pageButtonClick(pageNumber){
    console.log('PAGENUMBER:', pageNumber)
    let upper=pageNumber*rowPerPage
    let lower=upper-rowPerPage
    console.log("UPPER LOWER:",upper, lower)
    createTable(datum.slice(lower, upper))
}

function createSelectedFilesDiv(){
    $('#displaySelectedFileDiv').empty()
    $('#displaySelectedFileDiv').append(`<small>Selected FileName: ${fileName}</small>`)
}

function createTotalRowsDiv(){
    $('#displayTotalRowsDiv').empty()
    $('#displayTotalRowsDiv').append(`<small> Total Rows: ${datum.length}</small>`)
}

function changeRowsPerColumn(event){
    let val=event.target.value
    setRowPerPage(val)
    console.log('Rowspercolumn:', val)
    //displaySearchBoxTablePagination(finalData.slice(0, val))
    createTable(datum.slice(0, val))
}

function createRowsPerColumnSelect(){
    let $rowsPerColumn=$('#rowsPerColumn')
    // $rowsPerColumnSelect.empty()
    console.log($rowsPerColumn)
    let $select=$(`    
        <select value="paginationVal" id="rowsPerColumnSelect">
            <option value="5">5</option>
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

export function resetRowsPerColumnSelect(){
    $('#rowsPerColumnSelect').val(5)
}

function resetsearchByColumnValueForm(){
    document.getElementById('searchByColumnValueForm').reset()
    //$('#searchByColumnValueForm').val('')
}

function reset(){
    setDatum(allData)
    createTotalRowsDiv()
    setRowPerPage(5)
    createTable(datum.slice(0, rowPerPage))

    resetselectNumOfButtons()
    resetRowsPerColumnSelect()
    resetsearchByColumnValueForm()
    setDocumentLengthPagination(datum.length)
    setRowsPerPagePagination(rowPerPage)
    setTotalButtonsPagination()
    changeButtonsPerDisplay(5)
    addnumsButtonsDivPagination()
}

function createResetButton(){
    let $button=$('<button type="button">Reset to full data</button>')
    $button.on('click', function(){reset()})
    $('#resetButton').append($button)
}

function closePlotData(){
    $('#chartingDiv').fadeOut("slow")
}

function plotData(event){
    //console.log($('#plotForm').serializeArray())
    let formData=$('#plotForm').serializeArray()
    let column=formData[0].value
    let graph=formData[1].value
    //console.log(column, graph)
    console.log(column, graph)
    let dataa=[]
    datum.forEach(col=>{
        dataa.push(col[column])
    })
    let xarr=[]
    let yarr=[]
    dataa.forEach(col=>{
        console.log(col)
        if(xarr.findIndex(el=>el==col)==-1){
            xarr.push(col)
            yarr.push(dataa.filter((el)=>el==col).length)
            console.log(col, dataa.filter((el)=>el==col).length)
        }
    })
    console.log("XARR:", xarr, yarr)
    console.log("YARR:", xarr, yarr)
    $('#chartingDiv').empty()
    let $xbutton=$('<button>X</button>')
    $xbutton.on('click', function(){closePlotData()})

    const xArray = xarr;
    const yArray = yarr;
    
    const data = [{

    }];

    switch(graph){
        case 'bar':
            data[0].x=xArray
            data[0].y=yArray
            data[0].type=graph
        case 'pie':
            data[0].labels=xArray
            data[0].values=yArray
            data[0].type=graph

    }
        


    
    const layout = {title:"Graph"};
    Plotly.newPlot("chartingDiv", data, layout);
    $('#chartingDiv').css({'position':'fixed', 'left': '30%', 'top':'10%', 'width': '500px', 'height': '500px'})
    $('#chartingDiv').append($xbutton)
    $('#chartingDiv').fadeIn("slow")
    event.preventDefault()
}

function createPlotForm(){
    let $button=$('<button type="submit">Plot</button>')
    // $button.on('click', function(){
    //     plotData()})

    let $selectColumns=$(
    `<select id="plotFormSelectColumn" name="plotFormSelectColumn" required>
        <option value="">Choose a column</option>
    </select>`)
    columnHeader.forEach((column, index)=>{
        $selectColumns.append(`<option value="${index}">${column}</option>`)
    })

    let $form=$('#plotForm')

    let $selectGraphs=$(
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


export function searchByColumnValueForm(event){
    console.log('Search By Column Form Submitted')

    let formData=$('#searchByColumnValueForm').serializeArray()

    let columnIndx=formData[0]['value']
    let columnValue=formData[1]['value']

    let filteredData=datum.filter(data=>{
        return data[columnIndx]==columnValue
    })
    console.log(filteredData)
    //table stuff
    setDatum(filteredData)
    createTotalRowsDiv()//
    
    //pagination stuff
    setDocumentLengthPagination(datum.length)
    setRowPerPage(5)
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

export function selectedFilesFormOnSubmit(event){
        //console.log('Form Submitted')
        //console.log($('#selectedFilesForm').serialize().split('='))
        let fileName=$('#selectedFilesForm').serialize().split('=')[1]
        fileName=fileName.replace('%5C', '\\').replace('%3A', ':')
        //console.log(fileName)
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8888/files/selectedFiles',
            data: JSON.stringify({fileName: fileName}),
            contentType: 'application/json',
            dataType: 'json',
            encode: true,
            success: function(dataa){
                let {fileName, data}=dataa
                console.log(fileName, data)
                setColumnHeader([...data[0]])
                setAllData([...data.slice(1)])
                setDatum([...data.slice(1)])
                setFileName(fileName)

                $('#selectedFilesDiv').remove();
                $('#fileSubmitDiv').remove();
                $('#tableDiv').css('display', 'block')
                
                //table, header, form stuff
                createHeader()
                createSelectedFilesDiv()
                createTotalRowsDiv()
                createRowsPerColumnSelect()
                createSelect()
                createResetButton()
                createPlotForm()
                createTable(datum.slice(0, rowPerPage))
                
                //pagination stuff
                attachEventListenersPagination(pageButtonClick)
                setDocumentLengthPagination(datum.length)
                //this function takes care of a lot of things in pagination
                setRowPerPage(rowPerPage)
            }
        })
        event.preventDefault();
}

