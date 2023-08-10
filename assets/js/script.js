import {selectedFilesFormOnSubmit} from './functions.js'
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
            selectedFilesFormOnSubmit
        )

    }
)
