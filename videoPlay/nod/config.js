var mysql=require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port:'3308',
    user: 'root',
    password: '',
    database:"code",
  });
  module.exports=connection;