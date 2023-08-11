let order=true
let finalData=[]
function toggleOrder(){
    order=!order
}

function setData(data){
    finalData=data
}

function sortData(data, index){
    console.log("Order in sortData:", order)
    let column=data[0]
    data=data.slice(1)
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

    displayTable([column, ...data])
}

function reset(data){
    displayTable(data)
}


function displayTable(data){
    $('#columnRow').empty()
    $('#tableBody').empty()
    $('#searchByColumnValueForm').empty()
    $('#resetButton').empty()
    $('#header').empty()

    console.log("Order in displayTable:", order)

    let $select=$(`
        <select name="column" id="columnSelect" required>
            <option value="">Choose a Column</option>
        </select>`
    )
    // style="display: none; 
    data[0].forEach((column, indx) => {

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

        let $op=$(`<option value="${indx}">${column}</option>`)

        $('#columnRow').append($th)
        $select.append($op)
    });

    data.slice(1).forEach(row=>{
        let $tr= $('<tr>')
        row.forEach(col=>{
            $tr.append(`<td>${col}</td>`)
        })
        $('#tableBody').append($tr)
    })

    
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

    $('#searchByColumnValueForm').append($select)
    $('#searchByColumnValueForm').append('<input type="text" name="columnValue" id="columnValue" placeholder="Enter column value" required></input>')
    $('#searchByColumnValueForm').append('<input type="submit">')
    
    let $button=$('<button type="button">Reset</button>')
    $button.on('click', function(){reset(finalData)})
    $('#resetButton').append($button)
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
    displayTable([column, ...filteredData])
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
                setData(data)
                $('#displaySelectedFilesDiv').append(`<p>Selected FileName: ${fileName}</p>`)
                $('#selectedFilesDiv').remove();
                $('#fileSubmitDiv').remove();

                displayTable(data)
            }
        })
        event.preventDefault();
}

