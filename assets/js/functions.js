let order=true
let columnHeader=[]
let finalData=[]
let rowPerPage=5
let fileName=''

function toggleOrder(){
    order=!order
}

function setRowPerPage(rPP){
    rowPerPage=rPP
    console.log(rowPerPage)
}

function setData(data){
    finalData=[...data]
}

function setColumnHeader(header){
    columnHeader=[...header]
}

function setFileName(fN){
    fileName=fN
}

function sortData(data, index){
    console.log("Order in sortData:", order)
    console.log("Data in SortData:", data)

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
    console.log('Data:', data, order)

    displayTable([...data])
}

function reset(data){
    displayTable(data)
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
    $('#searchByColumnValueForm').append('<p>Select rows per column:</p>')
    $('#searchByColumnValueForm').append($select)
    $('#searchByColumnValueForm').append('<input type="text" name="columnValue" id="columnValue" placeholder="Enter column value" required></input>')
    $('#searchByColumnValueForm').append('<input type="submit">')
}

function createTable(data){
    columnHeader.forEach((column, indx) => {
        let $th;
        if(order){
            $th=$(`<th value=${column}>${column} &nbsp <i class="fa-solid fa-angle-down"></i></th>`)
        }
        else{
            $th=$(`<th value=${column}>${column} &nbsp <i class="fa-solid fa-angle-up"></i></th>`)
        }
        $th.on('click', {value: column, index: indx}, function(e){
            console.log(e.data)
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

function pageButtonClick(event){
    console.log('Page Button Clicked:', event.target.value)
    let pageNumber=event.target.value
    let upper=pageNumber*rowPerPage
    let lower=upper-rowPerPage
    console.log(lower, upper)
    displayTable([...finalData.slice(lower, upper)])
}

function createSelectedFilesDiv(){
    $('#displaySelectedFilesDiv').append(`<p>Selected FileName: ${fileName}</p>`)
    $('#displaySelectedFilesDiv').append(`<p>Displaying ${rowPerPage} rows</p>`)
}

function createPaginationButtons(){
    let len=finalData.length
    let $paginationButtons=$('<div id="paginationButtonsDiv"></div>')
    for(let i=0;i<len/rowPerPage;i++){
        let $paginationButton=$(`<button class="paginationButton" value="${i+1}">${i+1}</button>`)
        $paginationButton.on('click',  pageButtonClick)
        $paginationButtons.append($paginationButton)
    }
    $('#paginationDiv').append($paginationButtons)
}

function changePagination(event){
    let val=event.target.value
    console.log('Row per page changed', val)
    setRowPerPage(val)
    displayTable(finalData.slice(0, val))
}

function createPaginationSelect(){

    let $select=$(`    
    <select value="paginationVal" id="pagination">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="75">75</option>
        <option value="100">100</option>
    </select>`)
    $select.on('change', changePagination)
    $('#paginationDiv').append('<p>Select rows per column:</p>')
    $('#paginationDiv').append($select)
    
}

function createResetButton(){
    let $button=$('<button type="button">Reset</button>')
    $button.on('click', function(){reset(finalData)})
    $('#resetButton').append($button)
}

function displayTable(data){
    $('#tableDiv').css('display', 'block')
    $('#columnRow').empty()
    $('#tableBody').empty()
    $('#searchByColumnValueForm').empty()
    $('#resetButton').empty()
    $('#header').empty()
    $('#paginationDiv').empty()
    $('#displaySelectedFilesDiv').empty()

    console.log("Order in displayTable:", order)    
    console.log("Data in displayTable:", data)
    createSelect()

    createTable(data)

    createHeader()
    
    createResetButton()

    createPaginationSelect()

    createSelectedFilesDiv()

    createPaginationButtons()
}

export function searchByColumnValueForm(event){
    console.log('Search By Column Form Submitted')
    console.log($('#searchByColumnValueForm').serializeArray())

    let formData=$('#searchByColumnValueForm').serializeArray()
    console.log(formData)
    console.log(formData[0]['value'])
    console.log(formData[1]['value'])
    let columnIndx=formData[0]['value']
    let columnValue=formData[1]['value']

    let column=finalData[0]
    let filteredData=finalData.filter(data=>{
        return data[columnIndx]==columnValue
    })
    console.log(filteredData)
    displayTable([...filteredData])
    event.preventDefault();
}

export function selectedFilesFormOnSubmit(event){
        console.log('Form Submitted')
        console.log($('#selectedFilesForm').serialize().split('='))
        let fileName=$('#selectedFilesForm').serialize().split('=')[1]
        fileName=fileName.replace('%5C', '\\').replace('%3A', ':')
        console.log(fileName)
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
                setData([...data.slice(1)])
                setFileName(fileName)
                
                $('#selectedFilesDiv').remove();
                $('#fileSubmitDiv').remove();

                displayTable(finalData.slice(0, 5))
            }
        })
        event.preventDefault();
}

