var express = require("express");
var mysql = require('mysql'); 
var bodyParser = require("body-parser");
var hbs = require('hbs');

var app = express();
var jsonParser = bodyParser.json();

var pool  = mysql.createPool({
	connectionLimit : 15,
	database: 'exmobtc',
	host: 'localhost',
	user: '',
	password: ''
});

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get("/user", function(request, response){
	    response.render("user.html", {
    });
	console.log('1');
});
app.post("/user", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body.events);
	if(request.body.events == 'update'){
		sendUpdate(request.body.userName, request.body.surName, request.body.userAge, request.body.id);
	}else if(request.body.events == 'del'){
		delRows(request.body.userName, request.body.surName, request.body.userAge, request.body.id);
	}else if(request.body.events == 'insert'){
		sendInsert(request.body.userName, request.body.surName, request.body.userAge, request.body.id);
	}
console.log('2');
    response.json(`${request.body.userName} - ${request.body.surName} - ${request.body.userAge}`);
});

app.get("/result", function(request, response){
     query('SELECT * FROM `test`', function(err, row) {
	if(err){
		return console.log('not user');
	}
	console.log('table test');
	var mass =[];
	var col = row.length;
	for (var i = 0; i<col; i++){
		console.log(row[i]);
		var arr = JSON.stringify(row[i]);
		mass.push(arr);
		console.log(arr);
	}
	    response.render("result.html", {
        table: mass
    });
	
	});
	
console.log('3');
});

function sendInsert(name, surname, age, id, callback){
		console.log(name);
	query('INSERT INTO `test` SET `name` = '+pool.escape(name)+', `surname` = '+pool.escape(surname)+', `age` = '+pool.escape(age)+', `id` = '+pool.escape(id), function(err, row) {
if(err){
	return console.log('insert to one error');
	}
console.log('insert ok');
});

}
function sendUpdate(name, surname, age, id, callback){
		console.log(name);
	query('UPDATE `test` SET `name` = '+pool.escape(name)+', `surname` = '+pool.escape(surname)+', `age` = '+pool.escape(age)+' WHERE `id` = '+pool.escape(id), function(err, row) {
if(err){
	return console.log('update to one error');
	}
console.log('update ok');
});

}
function delRows(name, surname, age, id, callback){
		console.log(id);
	query('DELETE FROM `test` WHERE `id` = '+pool.escape(id), function(err, row) {
if(err){
	return console.log('del to one error');
	}
console.log('del ok');
});

}
app.listen(3000);

function query(sql, callback) {
	if (typeof callback === 'undefined') {
		callback = function() {};
	}
	pool.getConnection(function(err, connection) {
		if(err) return callback(err);
		connection.query(sql, function(err, rows) {
			if(err) return callback(err);
			connection.release();
			return callback(null, rows);
		});
	});
}