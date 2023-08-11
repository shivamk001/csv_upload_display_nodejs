import {selectedFilesFormOnSubmit, searchByColumnValueForm} from './functions.js'
$(document).ready(
    function(){

        $('#selectedFilesForm').submit(
            selectedFilesFormOnSubmit
        )

        $('#searchByColumnValueForm').submit(
            searchByColumnValueForm
        )

    }
)
