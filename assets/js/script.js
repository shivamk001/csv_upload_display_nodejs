$(document).ready(
    function(){
        $('#fileSubmitForm').submit(
            function(event){
                console.log('Form Submitted')
                // $.ajax({
                //     type: 'POST',
                //     url: 'http://localhost:8888/files',

                // })
                // event.preventDefault();
            }
        )


        $('#selectedFilesForm').submit(
            function(event){
                console.log('Form Submitted')
                console.log($('#selectedFilesForm').serialize().split('='))
                let fileName=$('#selectedFilesForm').serialize().split('=')[1]
                fileName=fileName.replace('%5C', '\\').replace('%3A', ':')
                console.log(fileName)
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8888/selectedFiles',
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

                        data[0].forEach(column => {
                            console.log(column)
                                $('#columnRow').append(`<th>${column}</th>`)
                        });

                        data.slice(1).forEach(row=>{
                            let $tr= $('<tr>')
                            console.log("Row:", row)
                            row.forEach(col=>{
                                console.log("Col:", col)
                                $tr.append(`<td>${col}</td>`)
                            })
                            $('#tableBody').append($tr)
                        })

                        $('#header').append(      
                        `<div>
                            <button id="displayAnother">
                                <a href="/">Display another file</a>
                            </button>
                        </div>`)
                    }
                })
                event.preventDefault();
            }
        )
    }
)
