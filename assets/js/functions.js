let order=true
function toggleOrder(){
    order=!order
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


function displayTable(data){
    $('#columnRow').empty()
    $('#tableBody').empty()
    console.log("Order in displayTable:", order)
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
        $('#columnRow').append($th)
    });

    data.slice(1).forEach(row=>{
        let $tr= $('<tr>')
        row.forEach(col=>{
            $tr.append(`<td>${col}</td>`)
        })
        $('#tableBody').append($tr)
    })
    $('#header').empty()
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
                $('#displaySelectedFilesDiv').append(`<p>Selected File to Display: ${fileName}</p>`)
                $('#selectedFilesDiv').remove();
                $('#fileSubmitDiv').remove();

                displayTable(data)
            }
        })
        event.preventDefault();
}

