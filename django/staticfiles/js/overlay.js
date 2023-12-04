// 오버레이 열기
function openOverlay() {
    document.getElementById('overlay').style.display = 'flex';
    document.querySelector('.close-btn').style.display = 'block';
}

// 오버레이 닫기
function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
    document.querySelector('.close-btn').style.display = 'none';
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

function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(window.location.search);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setInit(){
    var argsnum = getParameterByName('argsnum');
    if (argsnum < 4 && argsnum > 0) {
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
    else {
        //alert("불러오기 오류입니다.");
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

function addRow() {
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
            cell.appendChild(input);
        }
    
        var deleteCell = newRow.insertCell(collen);
        var deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.innerHTML = "삭제";
        deleteButton.onclick = function() {
            deleteRow(this);
        };
        deleteCell.appendChild(deleteButton);
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
            var text = "<li id='result_item'>";
            if (answer_case['Print'] != "")
                text += "<p>출력 결과 : \n" + answer_case['Print'] + "</p>\n";
            
            var id = (answer_case['Win']) ? "true" : "false";   
            suc += (answer_case['Win']) ? 1 : 0;   
            text += "<p id='" + id + "'>결과값 : \n" + answer_case['Return'] + "</p>\n";
            text += "<p id='" + id + "'>기댓값 : \n" + answer_case['Solution'] + "</p>\n</li>\n";
        }
        tmp += text
    }
    text = "<p id='headliner'>" + count + "문제 중 " + suc + "문제 정답!</p>\n" + tmp + "</ul>"
    console.log(receivedMessage)
    return text
}