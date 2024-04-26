let totalScore = 0
function createBoard() {
    const gridContainer = document.querySelector(".grid");
    for (let i = 0; i < 16; i++){
        let tile = document.createElement('div');
        tile.setAttribute('id', `id_${i}`);
        tile.textContent = "";
        gridContainer.appendChild(tile);
    }
}
createBoard();
function generate(){
    let numArray = [2,2,2,2,2,2,2,2,2,4];
    let num = numArray[Math.floor(Math.random()*numArray.length)]
    let allBlocks = document.querySelectorAll('.grid>div');
    let filteredBlocks = [...allBlocks].filter((a) => a.textContent == 0);
    if (filteredBlocks == 0){
        return;
    }
    let finalBlock = filteredBlocks[Math.floor(Math.random()*filteredBlocks.length)]
    finalBlock.textContent = num;
}
generate()
function shiftArrayLeft(values){
    let finalArray = values .filter((a) => a != 0)
    let index = finalArray.length;
    while (index < 4){
        finalArray.push(0);
        index++;
    }
    return finalArray
}
function shiftArrayRight(values){
    let finalArray = values .filter((a) => a != 0)
    let index = finalArray.length;
    while (index < 4){
        finalArray.unshift(0);
        index++;
    }
    return finalArray
}
function shiftRow(rowNumber, direction){
    let rowValues = [];
    for (let i = 4*(rowNumber-1); i < 4*rowNumber; i++){
        rowValues.push(document.querySelector(`#id_${i}`).textContent)
    }
    if (direction == "L"){
        rowValues = shiftArrayLeft(rowValues)
        rowValues = combineArrayLeft(rowValues)
        rowValues = shiftArrayLeft(rowValues)
    }
    else if (direction == "R"){
        rowValues = shiftArrayRight(rowValues)
        rowValues = combineArrayRight(rowValues)
        rowValues = shiftArrayRight(rowValues)
    }
    for (let i = 4*(rowNumber-1); i < 4*rowNumber; i++){
        document.querySelector(`#id_${i}`).textContent = rowValues[i%4];
    }
}
function shiftLeft(){
    shiftRow(1, "L");
    shiftRow(2, "L");
    shiftRow(3, "L");
    shiftRow(4, "L");

}
function shiftRight(){
    shiftRow(1, "R");
    shiftRow(2, "R");
    shiftRow(3, "R");
    shiftRow(4, "R");

}

function shiftColumn(columnNumber, direction){
    let columnValues = [];
    for (let i = (columnNumber-1); i < 16; i+=4){
        columnValues.push(document.querySelector(`#id_${i}`).textContent)
    }
    if (direction == "U"){
        columnValues = shiftArrayLeft(columnValues)
        columnValues = combineArrayLeft(columnValues)
        columnValues = shiftArrayLeft(columnValues)
    }
    else if (direction == "D"){
        columnValues = shiftArrayRight(columnValues)
        columnValues = combineArrayRight(columnValues)
        columnValues = shiftArrayRight(columnValues)
    }
    let counter =0;
    for (let i =(columnNumber-1); i < 16; i+=4){
        document.querySelector(`#id_${i}`).textContent = columnValues[counter];
        counter++;
    }
}

function shiftUp(){
    shiftColumn(1, "U");
    shiftColumn(2, "U");
    shiftColumn(3, "U");
    shiftColumn(4, "U");

}
function shiftDown(){
    shiftColumn(1, "D");
    shiftColumn(2, "D");
    shiftColumn(3, "D");
    shiftColumn(4, "D");
}

function combineArrayLeft(values){

    let i = 1;

    while (i<4){
        if (values[i-1]==values[i]){
            values[i-1]*=2
            totalScore += (values[i]*2)
            document.querySelector("#score").textContent = totalScore
            values[i]=0
        }
        i++
    }
    return values
}
function combineArrayRight(values){

    let i = 3;

    while (i>0){
        if (values[i]==values[i-1]){
            values[i]*=2
            totalScore += (values[i]*2)
            document.querySelector("#score").textContent = totalScore
            values[i-1]=0
        }
        i--
    }
    return values
}
function keyUpHandler(e){
    switch(e.keyCode){
        case 37:
            shiftLeft();
            break;
        case 38:
            shiftUp();
            break;
        case 39:
            shiftRight();
            break;
        case 40:
            shiftDown();
            break;
    }
    generate();

    
    if (checkForWin()){
        document.body.removeEventListener('keyup', keyUpHandler);
        document.querySelector('#result').textContent = "YOU WIN!"
    }
    else if (isGameOver()){
        document.body.removeEventListener('keyup', keyUpHandler);
        document.querySelector('#result').innerText = "Game Over"
    }
}
document.body.addEventListener("keyup",keyUpHandler)


function isGameOver(){
    let allBlocks = document.querySelectorAll(".grid >div")
    let filteredBlocks = [...allBlocks].filter((a)=>a.textContent==0)
    if (filteredBlocks.length !=0){
        return false
    }
    for (let rowNumber of [1,2,3,4]){
        let rowValues = []
        for (let i=4*(rowNumber-1);i<4*rowNumber;i++){
            rowValues.push(Number(document.querySelector(`#id_${i}`).textContent))
            if (rowValues.length>1 && rowValues[i-4]==rowValues[i%4-1]){
                return false
            }
        }
    }

    for (let colNumber of [1, 2, 3, 4]){
        let colValues = []
        let count = 0
        for (let i = (colNumber - 1); i < 16; i+=4){
            colValues.push(Number(document.querySelector(`#id_${i}`).textContent))
            if (colValues.length > 1 && (colValues[count] == colValues[count - 1])){
                return false
            }
        count++
        }
    }
    return true
            
}
function checkForWin(){
    let allBlocks = document.querySelectorAll('.grid > div') 
    let winningBlocks = Array.from(allBlocks).filter((a) => a.textContent == 2048)
    return winningBlocks.length != 0
}
document.querySelector('#restart-button').addEventListener('click', () => {
    document.querySelector('.grid').innerHTML = ''
    totalScore = 0
    document.querySelector("#score").textContent = totalScore
    document.querySelector('#result').innerText = "Join the numbers and get to the 2048 tile!"
    createBoard()
    generate()
    generate()
    document.body.addEventListener('keyup', keyUpHandler);
})
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    touchEndX = event.touches[0].clientX;
    touchEndY = event.touches[0].clientY;

    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            shiftRight();
        } else {
            shiftLeft();
        }
    } else {
        if (deltaY > 0) {
            shiftDown();
        } else {
            shiftUp();
        }
    }

    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;

    generate();

    if (checkForWin()) {
        document.body.removeEventListener('touchstart', handleTouchStart);
        document.body.removeEventListener('touchmove', handleTouchMove);
        document.querySelector('#result').textContent = "YOU WIN!";
    } else if (isGameOver()) {
        document.body.removeEventListener('touchstart', handleTouchStart);
        document.body.removeEventListener('touchmove', handleTouchMove);
        document.querySelector('#result').textContent = "Game Over";
    }
}
