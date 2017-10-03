//инициализация полей для ввода данных персоны
var id = document.getElementById("IDn");
var fname = document.getElementById("Fname");
var lname = document.getElementById("Lname");
var age = document.getElementById("Age");
//инициализация полей таблицы
var myHeader = document.getElementById("myHeader");
var myCaption = document.getElementById("myCaption").innerHTML = "ТАБЛИЦА ПЕРСОН";
var myTable = document.getElementById("myTable");
var tableModel = null;

//инициализация xmlHttpRequest
var xmlHttpRequest = xmlHttpRequest();

//создание xmlHttpRequest кроссбраузерным методом
function xmlHttpRequest() {
    var request;
    try {
        request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            request = false;
        }
    }
    if (!request && typeof XMLHttpRequest!='undefined') {
        request = new XMLHttpRequest();
    }
    return request;
}

//очистка полей для ввода данных персоны
function clearInputs() {
    id.value = "";
    fname.value = "";
    lname.value = "";
    age.value = "";
}

//проверка заполнения полей ввода данных
function checkInputs() {
    if (id.value == '') {
        alert('Поле id должно быть заполненно!');
        return false;
    }
    else if (fname.value.trim() == '') {
        alert('Поле fname должно быть заполненно!');
        return false;
    }
    else if (lname.value.trim() == '') {
        alert('Поле lname должно быть заполненно!');
        return false;
    }
    else if (age.value == '') {
        alert('Поле age должно быть заполненно!');
        return false;
    }
    else {
        return true;
    }
}

//создание запроса для сервера
function createRequest() {
    var nocache = 0;
    nocache = Math.random();
    var req = 'id=' + encodeURI(id.value) + '&fname=' + encodeURI(fname.value) + '&lname=' + encodeURI(lname.value) + '&age=' + encodeURI(age.value) + '&nocache=' + nocache;
    return req;
}

//функция асинхронного post запроса на сервер по клику на кнопку create
document.getElementById("create").onclick = function create() {
    if (checkInputs() != true)
        return;
    xmlHttpRequest.open("POST", "/person/server.php", true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlHttpRequest.onreadystatechange = createReply;
    xmlHttpRequest.send(createRequest() + "&func=create");
}
function createReply() {
    if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
        var response = xmlHttpRequest.responseText;
         if (response == 'success') {
            alert('Процесс создания персоны прошёл успешно!');
            clearInputs();
            read();
        }
        else {
            alert('Операция прошла безуспешно!');
        }
    }
}

//функция асинхронного post запроса на сервер по клику на кнопку update
document.getElementById("update").onclick = function update() {
    if (checkInputs() != true)
        return;
    xmlHttpRequest.open("POST", "/person/server.php", true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlHttpRequest.onreadystatechange = updateReply;
    xmlHttpRequest.send(createRequest() + "&func=update");
}
function updateReply() {
    if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
        var response = xmlHttpRequest.responseText;
        if (response == 'id_not_exist') {
            alert('Персоны с данным id не существует, проверьте указанный id!');
        }
        else if (response == 'success') {
            alert('Процесс изменения персоны прошёл успешно!');
            clearInputs();
            read();
        }
        else {
            alert('Операция прошла безуспешно!');
        }
    }
}

//функция асинхронного post запроса на сервер по клику на кнопку delete
document.getElementById("delete").onclick = function remove() {
    if (checkInputs() != true)
        return;
    xmlHttpRequest.open("POST", "/person/server.php", true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlHttpRequest.onreadystatechange = removeReply;
    xmlHttpRequest.send(createRequest() + "&func=delete");
}
function removeReply() {
    if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
        var response = xmlHttpRequest.responseText;
        if (response == 'id_not_exist') {
            alert('Персоны с данным id не существует, проверьте указанный id!');
        }
        else if (response == 'success') {
            alert('Процесс удаления персоны прошёл успешно!');
            clearInputs();
            read();
        }
        else {
            alert('Операция прошла безуспешно!');
        }
    }
}

//функция асинхронного get запроса на сервер
function read() {
    xmlHttpRequest.open('GET', "/person/server.php?func=read", true);
    xmlHttpRequest.onreadystatechange = readReply;
    xmlHttpRequest.send();
}

function readReply() {
    if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
        var response = xmlHttpRequest.responseText;
        clearTable();
        if (response == '0') {
            alert('База пуста! Необходимо создать хотя-бы одну персону для отображения!');
        }
        else {
            alert('А здесь идёт логика перерисовки таблицы данных!');
            if (response == "") {
                alert("Некорректный массив данных!");
            }
            else {
                if (tableModel == null) {
                    tableModel = new TableModel(response);
                }
                else {
                    tableModel.setData(response);
                }
                updateTable(tableModel);
            }
        }
    }
}

//очистка таблицы перед заполнением
function clearTable() {
    //очистка заголовков
    while (myHeader.rows.length != 0) {
        myHeader.deleteRow(-1);
    }
    //очистка данных
    while (myTable.rows.length != 0) {
        myTable.deleteRow(-1);
    }
}

//класс формирования данных таблицы
var TableModel = function (data) {
    this.data = JSON.parse(data);

    this.columnCount = function() {
        if (this.data.length == 0) {
            alert("Некорректный массив данных!");
            return 0;
        }
        else {
            return Object.keys(this.data[0]).length;
        }
    }

    this.rowCount = function () {
        if (this.data.length == 0) {
            alert("Некорректный массив данных!");
            return 0;
        }
        else {
            return this.data.length;
        }
    }

    this.getValueAt = function(row, column) {
        if (this.data.length == 0) {
            alert("Некорректный массив данных!");
            return null;
        }
        else {
            var p = this.data[row];
            var propertyName = Object.keys(p)[column];
            return p[propertyName];
        }
    }

    this.columnName = function() {
        if (this.data.length == 0) {
            alert("Некорректный массив данных!");
            return 0;
        }
        else {
            return Object.keys(this.data[0]);
        }
    }

    this.setData = function(data) {
        this.data = JSON.parse(data);
    }
}

//перерисовка таблицы
function updateTable(tableModel) {

    var headerRow = myHeader.insertRow();
    for (var i = 0; i < tableModel.columnCount(); i++) {
        var cell = headerRow.insertCell(i);
        cell.innerHTML = "<b>" + tableModel.columnName()[i]+ "</b>";
    }
    for (var i = 0; i < tableModel.rowCount(); i++) {
        var row = myTable.insertRow(i);
        for (var j = 0; j < tableModel.columnCount(); j++) {
            var cell = row.insertCell(j);
            cell.innerHTML = tableModel.getValueAt(i, j);
        }
    }
}

window.onload = function(){
    read();
}