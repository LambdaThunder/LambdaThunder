const currentProtocol = window.location.protocol;

// 적절한 프로토콜에 따라 웹소켓 주소 설정
const webSocketProtocol = (currentProtocol === 'https:') ? 'wss://lambdathunder.xyz/socket.io' : 'ws://lambdathunder.xyz:8000';

var webSocket = new WebSocket(webSocketProtocol);

var timerId;

webSocket.onmessage = function(event) {
    const receivedMessage = event.data;
    const rt = document.getElementById('result');
    rt.innerHTML = show_json(receivedMessage);
    clearTimeout(timerId);
    stoploading()
    enableButton()
};

function send(jsonString) {
    webSocket.send(jsonString);
}

// 오버레이 열기
function openOverlay() {
    document.getElementById('overlay').style.display = 'flex';
}

// 오버레이 닫기
function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

function startloading(){
    document.getElementById("result").innerHTML=""
    document.getElementById("show").style.display = 'flex'
    document.getElementById("return").style.overflow = "hidden"
}

function stoploading(){
    document.getElementById("show").style.display = 'none'
    document.getElementById("return").style.overflow = "auto"
}

function enableButton(){
    document.getElementById("submit").disabled = false;
    document.getElementById("submit2").disabled = false;
}

function disableButton(){
    document.getElementById("submit").disabled = true;
    document.getElementById("submit2").disabled = true;
}

function timeout() {
    var div = document.getElementById("result")
    div.innerHTML = "<h2 color=#FF0000>Time Out!</h2>"
    clearTimeout(timerId);
    webSocket.close();
    webSocket = new WebSocket(webSocketProtocol);
}

function check( mode ){
    startloading()
    clearTimeout(timerId);
    if (mode == "run") {
        logEditorValue()
    }
    else {
        var code = window.editor.getValue();
        if (mode) {
            var json_data = {
              CODE : code,
              ARGS : jsArrayToPythonString(mode)
            };
            var jsonString = JSON.stringify(json_data, null, 2);
            send(jsonString)
        }
    }
    disableButton()

    timerId = setTimeout(() => {
        enableButton();
        stoploading();
        timeout();
    }, 20000);
}

// 입력된 내용 처리
function getValues() {
    var table = document.getElementById("myTable");

    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    var args = []
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var values = [];

        for (var j = 0; j < cells.length - 1; j++) {  // 마지막 열은 삭제 버튼이므로 제외
            var inputValue = cells[j].getElementsByTagName('input')[0].value;

            if (inputValue === "") {
                return false;
            }

            values.push(inputValue);
        }
        var text = "["  + values.join(", ") + "]"
        args.push(text)
    }
    arrayText = "[" + args.join(", ") + "]";
    return arrayText;
}

function parseHTML (str) {
    str = str.replaceAll("&quot;","\"")
    str = str.replaceAll("&lt;","<")
    str = str.replaceAll("&gt;",">")
    str = str.replaceAll("&#039;","\'")
    str = str.replaceAll("&amp;","&")
    str = str.replaceAll("&nbsp;"," ")
    str = str.replaceAll("&#035;","#")

    return str
}

function jsArrayToPythonString(jsArray) {
    // 재귀적으로 배열을 문자열로 변환하는 함수
    function arrayToString(arr) {
        if (Array.isArray(arr)) {
            return "[" + arr.map(item => arrayToString(item)).join(", ") + "]";
        } else {
            return wrap(arr);
        }
    }

    return arrayToString(jsArray);
}

function setOverlay(argsnum){
    if (argsnum < 5 && argsnum > 0) {
        var table_head = document.getElementById("myTable").getElementsByTagName('thead')[0];
        var table_body = document.getElementById("myTable").getElementsByTagName('tbody')[0];
        table_head.innerHTML=""
        table_body.innerHTML=""
        var newRow = table_head.insertRow(table_head.rows.length);

        for (var i = 0 ; i < argsnum; i++) {
            var cell = newRow.insertCell(i);
            var text = document.createElement("p");
            text.innerHTML = "ARGS "+(i+1);
            cell.appendChild(text);
        }

        var answercell = newRow.insertCell(argsnum);
        var answertext = document.createElement("p");

        answertext.innerHTML = "Answer";
        answercell.appendChild(answertext);
        addRow();
    }
    else {
        setOverlay(2);
    }
}

function setInit(argsnumString, Example_argument){
    argsnum = parseInt(argsnumString)-1
    json_args = eval(parseHTML(Example_argument))
    if (argsnum < 5 && argsnum > 0) {
        var table_head = document.getElementById("myTable").getElementsByTagName('thead')[0];
        var newRow = table_head.insertRow(table_head.rows.length);

        for (var i = 0 ; i < argsnum; i++) {
            var cell = newRow.insertCell(i);
            var text = document.createElement("p");
            text.innerHTML = "ARGS "+(i+1);
            cell.appendChild(text);
        }

        var answercell = newRow.insertCell(argsnum);
        var answertext = document.createElement("p");

        answertext.innerHTML = "Answer";
        answercell.appendChild(answertext);
        for (item of json_args) {
            addRow(item);
        }
    }
    else {
        var argsnum = 1
        var table_head = document.getElementById("myTable").getElementsByTagName('thead')[0];
        var newRow = table_head.insertRow(table_head.rows.length);

        for (var i = 0 ; i < argsnum; i++) {
            var cell = newRow.insertCell(i);
            var text = document.createElement("p");
            text.innerHTML = "ARGS "+(i+1);
            cell.appendChild(text);
        }

        var answercell = newRow.insertCell(argsnum);
        var answertext = document.createElement("p");

        answertext.innerHTML = "Answer";
        answercell.appendChild(answertext);
        addRow();
    }
}

function wrap(str) {
    var numericRegex = /^-?\d+(\.\d+)?$/;

    if (numericRegex.test(str)) {
        return str;
    }

    return '"' + str + '"';
}

function addRow(args = []) {
    var table = document.getElementById("myTable");

    if (table.rows.length < 11)
    {
        var table_row = table.getElementsByTagName('tbody')[0];
        var newRow = table_row.insertRow(table_row.rows.length);

        var collen = table.rows[0].cells.length;

        for (var i = 0; i < collen; i++) {
            var cell = newRow.insertCell(i);
            var input = document.createElement("input");
            input.setAttribute("class", "table_cell");
            input.type = "text";
            if (args.length != 0) {
                input.value = jsArrayToPythonString(args[i])
                input.setAttribute("id", "TopBar1")
                input.setAttribute("class","table_cell marginText")
                input.readOnly = true;
            }
            cell.appendChild(input);
        }
        if (args.length == 0) {
            var deleteCell = newRow.insertCell(collen);
            var deleteButton = document.createElement("button");
            deleteButton.setAttribute('class', "delete-btn custom-btn btn-12")
            deleteButton.innerHTML = "<span>Click!</span><span>열 삭제</span>";
            deleteButton.onclick = function() {
                deleteRow(this);
            };
            deleteCell.appendChild(deleteButton);
        }
        else {
            newRow.insertCell(collen);
        }
    }
}

function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function show_json(receivedMessage) {
    var count = 0;
    var suc = 0;
    var tmp = "<ul id='result_list'>\n";
    var json_text = JSON.parse(receivedMessage);
    for (var key in json_text) {
        if (json_text.hasOwnProperty(key)) {
            count += 1
            var answer_case = json_text[key];
            var text = "<li style='padding:10px;' id='result_item'>";
            if (answer_case['Print'] != "")
                text += "<p style='padding:5px;'>출력 결과 : \n" + answer_case['Print'] + "</p>\n";
            
            var id = (answer_case['Win']) ? "true" : "false";   
            suc += (answer_case['Win']) ? 1 : 0;   
            text += "<p style='padding:5px;' id='" + id + "'>결과값 : \n" + answer_case['Return'] + "</p>\n";
            text += "<p style='padding:5px;' id='" + id + "'>기댓값 : \n" + answer_case['Solution'] + "</p>\n</li>\n";
        }
        tmp += text
    }
    text = "<p id='headliner'>" + count + "문제 중 " + suc + "문제 정답!</p>\n" + tmp + "</ul>"
    console.log(receivedMessage)
    return text
}

