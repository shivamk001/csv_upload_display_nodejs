let documentLength=NaN
let currentStart=NaN
let currentEnd=NaN
let lowestButtonValue=1
let highestButtonValue=NaN
let rowsPerPage=5
let buttonsPerDisplay=NaN
let totalButtons=NaN
let pageButtonClick=null

export function setDocumentLengthPagination(length){
    documentLength=length
}

export function setRowsPerPagePagination(rPP){
    rowsPerPage=rPP
}

export function setTotalButtonsPagination(){
    totalButtons=documentLength/rowsPerPage
    console.log('TotalButtons:', totalButtons, rowsPerPage, documentLength)
    totalButtons=totalButtons.toString()
    totalButtons=totalButtons.split('.')
    if(totalButtons.length==2){
        totalButtons=parseInt(parseInt(totalButtons[0])+1)
    }
    console.log("totalbuttons:", totalButtons)
    changeCurrentStart(1)
    changeCurrentEnd(totalButtons)
}



export function addnumsButtonsDivPagination(){
    let $numButtonsDiv=$('#numsButtonDiv')
    $numButtonsDiv.empty()
    console.log("CurrentStart:", currentStart, "buttonsPerDisplay:", buttonsPerDisplay)
    for(let i=currentStart;i<(currentStart+buttonsPerDisplay);i++){
            let $button=$(`<button class="numButton" value="${i}">${i}</button>`)
            $button.on('click', function(event){
                let pageNumber=event.target.value
                pageButtonClick(pageNumber)
                changePageNumber(pageNumber)
            })
            $numButtonsDiv.append($button)
    }
}

function setPageButtonClick(func){
    pageButtonClick=func
}

// export function resetselectNumOfButtons(){
//     $('#selectNumOfButtons').val(5)
// }

export function changePageNumber(pageNumber){
    $('#pageNumberDiv').empty()
    $('#pageNumberDiv').append(`<small>Displaying Page Number: ${pageNumber}</small>`)
}

export let attachEventListenersPagination=(pageButtonClick)=>{

    // let $select=$('#selectNumOfButtons')
    // $select.on('change', 
    //     function(event){
    //         let val=event.target.value
    //         changeButtonsPerDisplay(val)
    // })


    let $goToOne=$('#goToOne')
    $goToOne.on('click', goToOne)


    let $shiftOneLeft=$('#shiftOneLeft')
    $shiftOneLeft.on('click', shiftOneLeft)

    setPageButtonClick(pageButtonClick)
    console.log("attachEventListenersPagination:",currentStart, currentEnd);

    let $shiftOneRight=$('#shiftOneRight')
    $shiftOneRight.on('click', shiftOneRight)


    let $goToLast=$('#goToLast')
    $goToLast.on('click', goToLast)

    console.log(documentLength);
}

export let changeCurrentStart=(st)=>{
    currentStart=st
}

export let changeCurrentEnd=(en)=>{
    currentEnd=en
}

export let changeButtonsPerDisplay=(val)=>{
    if(val){
        buttonsPerDisplay=parseInt(val)
        console.log("ButtonsPerDisplay1:", buttonsPerDisplay, "totalButtons:", totalButtons)
        if(buttonsPerDisplay>totalButtons){
            buttonsPerDisplay=totalButtons
        }
        console.log("ButtonsPerDisplay2:", buttonsPerDisplay)
    }
    else{
        console.log("ButtonsPerDisplay1:", buttonsPerDisplay, "totalButtons:", totalButtons)
        if(buttonsPerDisplay>totalButtons){
            buttonsPerDisplay=totalButtons
        }
        console.log("ButtonsPerDisplay2:", buttonsPerDisplay)
    }

    changeCurrentStart(1)
    changeCurrentEnd(buttonsPerDisplay)
    console.log("changeButtonsPerDisplay:",currentStart, currentEnd);
    addnumsButtonsDivPagination()
}

export let shiftOneLeft=()=>{
    if(currentStart>1){
        currentStart--;
        currentEnd--;
        addnumsButtonsDivPagination()
    }
}

export let shiftOneRight=()=>{
    if(currentEnd<totalButtons){
        currentStart++;
        currentEnd++;
        addnumsButtonsDivPagination()
    }
}

export let goToOne=()=>{
    currentStart=1
    currentEnd=buttonsPerDisplay
    addnumsButtonsDivPagination()
}

export let goToLast=()=>{
    console.log("TotalButtons:", totalButtons, "ButtonsPerDisplay:", buttonsPerDisplay)
    currentStart=totalButtons-buttonsPerDisplay+1
    currentEnd=totalButtons;
    addnumsButtonsDivPagination()
}


