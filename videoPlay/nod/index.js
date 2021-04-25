var express=require('express');
var body=require('body-parser');//针对post数据的中间件。可用req.body得到参数
var url=require('url');
var mysql=require('mysql');
var session=require("express-session");
var cookieParser=require("cookie-parser");
var path=require('path');
var fs=require('fs');
var multer=require('multer');//上传文件用到的中间件，给multer指定dest-文件存放位置，生成一个upload中间件
var func=require('./func');
var ffmpeg=require('fluent-ffmpeg');
const zlib=require('zlib');
const { request } = require('http');
const md5 = require('md5');
// express中是把session信息存储在内存中
// 配置session
var app=express();
app.use(session({
  secret:"123456", //设置签名秘钥 内容可以任意填写
  // cookie:{ maxAge:80*1000 }, //设置cookie的过期时间，例：80s后    session和相应的cookie失效过期
  resave:false, //强制保存，如果session没有被修改也要重新保存
  saveUninitialized:false //如果原先没有session那么久设置，否则不设置
}))
//处理application/x-www-form-urlencoded格式的请求
app.use(body.urlencoded({extended: false}));
app.use(body.json());//处理application/json格式的请求。
app.use(cookieParser());
app.use('/tss',express.static('./tss'));
app.use('/image',express.static('./image'));

app.post('/login',function(req,res){

  var a=req.body.username;
  var b=req.body.password;
  var connection = mysql.createConnection({
    host: '127.0.0.1',
    port:'3308',
    user: 'root',
    password: '',
    database:"code",
  });
   connection.connect();  
   connection.query("SELECT * FROM user where name=? and password =?", [a,b],function (err, results) {
     if (err){
return res.send();
     }else{
       if(results.length===0){
        return res.send();
       }else{
        req.session.ids=results[0].id;
        req.session.user=results[0].name;
        res.send('登陆成功！');
       }
      }
   });
   connection.end();
})


app.post('/admin_login',function(req,res){
  var a=req.body.username;
  var b=req.body.password;
  var connection = mysql.createConnection({
    host: '127.0.0.1',
    port:'3308',
    user: 'root',
    password: '',
    database:"code",
  });
   connection.connect();  
   connection.query("SELECT * FROM admin where name=? and password =?", [a,b],function (err, results) {
     if (err){
return res.send();
     }else{
       if(results.length===0){
        return res.send();
       }else{
        req.session.ids=results[0].id;
        req.session.user=results[0].name;
        res.send('登陆成功！');
       }
      }
   });
   connection.end();
})





app.get('/home',function(req,res){
  if(!req.session.ids && !req.session.user){
    res.send();
  }else{
res.send('yes');
  }

})

app.get('/admin_home',function(req,res){
  if(!req.session.ids && !req.session.user){
    res.send();
  }else{
res.send('yes');
  }

})
 app.post('/register',function(req,res){
if(req.body.values){
  console.log(req.body.values);
  console.log(req.session.message);
  console.log(req.session.username);
  console.log(req.session.password);
  if(req.body.values==req.session.message){

  var connection = mysql.createConnection({
    host: '127.0.0.1',
    port:'3308',
   user: 'root',
    password: '',
    database:"code",
 });
  connection.connect();
  connection.query("select * from user where name=?",[req.session.username],function(err,results){
 if(err){
   res.statusCode=205;res.send(err)}else{
  if(results.length==0){
    connection.query("insert into user (name,password,tel) values (?,?,?)",[req.session.username,req.session.password,req.session.phone],function(err,data){
      if(err){
        res.statusCode=205;
        res.send(err);
     }else{
        res.statusCode=201;
        res.send('ok');
        req.session.destroy();
      }
     })
  }else{
    res.statusCode=205;
    res.send('mysql had err!'); 
    }
  }
 })}else{
   res.statusCode=206;
   console.log('验证码不正确！');
   res.send('验证码不正确！');
 }
}else{
  let codes=func.code(6);

  func.message(req.body.phone,codes,(data)=>{ 
    if(data.smsMessageSid){ 
   res.statusCode=200;
      res.send('ok');
   }
   else{
  
     res.statusCode=205;
     res.send('');
   }
 });
 req.session.message=codes;
 req.session.username=req.body.username;
      req.session.password=req.body.password;
      req.session.phone=req.body.phone;
}


})



 app.get('/html',function(req,res){ 
 fs.readFile('./html/readme.html',function(err,data){
   res.setHeader("content-type", "text/html; charset=utf-8");
  res.send(data.toString());
 })
 })

app.get('/header',function(req,res){
   if(req.session.user && req.session.ids){
       res.send(JSON.stringify(req.session));
   }
   else{
     res.send('null');
   }
});
app.get('/out',function(req,res){
  req.session.destroy();
res.send('ok');
});

app.post('/shipinS',function(req,res){
  if(!req.session.ids){
    return res.send();
   }else{
     func.listOptionS(req,res);
   }
})
app.post('/shipin',function(req,res){
if(!req.session.ids){
 return res.send();
}else{
  func.listOption(req,res);
}
})
//视频上传及切片及获取封面模块
var cut = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './cutvideo/')
  },
  filename: function (req, file, cb) {
    cb(null, req.session.user+Date.now()+'\.mp4')
  }
})
var upload = multer({ storage: cut })
app.post('/hkj',upload.single('sd'),function(req,res){
  var path1=path.join("./cutvideo",req.file.filename);
  func.fetchVideoThumbnail(path1,req);
  func.cut(req,res);
})

app.post('/table',function(req,res){
if(!req.session.user){
 return res.send();
}else{
 func.table(req,res);
}
})

app.post('/password',function(req,res){
  var connection = mysql.createConnection({
    host: '127.0.0.1',
    port:'3308',
    user: 'root',
    password: '',
    database:"code",
    multipleStatements:true,
}); 
connection.connect(); 
connection.query("update user set password=? where name=?",[req.body.password,req.session.user],function(err,result){
  if(err){
    console.log(err);
    res.send('')
  }else{
    console.log(result.affectedRows);
    if(result.affectedRows>0){
      var connection = mysql.createConnection({
        host: '127.0.0.1',
        port:'3308',
        user: 'root',
        password: '',
        database:"code",
        multipleStatements:true,
    }); 
      connection.query("update admin set password=? where name=?",[req.body.password,req.session.user],function(err,results){
        if(err){
          console.log(err);
        }else{
        console.log(results);
        req.session.destroy();
        res.send('yes');
        }
      })
    
  }else{
    res.send(' ');
  }
}
})
connection.end();
})
app.post('/power',function(req,res){
  func.power(req,res);
})


app.get('/mypicture',function(req,res){
var urls=req.url;
var parseObj=url.parse(urls,true);/*对于get方法，因为get方法的url中包括了提交的参数，获取参数可以使用url插件，并使用url.parse解析req的url。
url.parse()第二个参数为true，，query属性会生成一个对象，如果为false,则返回url对象上的query属性会是一个未解析，未解码的字符串，默认为false
对于post方法，因为提交的参数未在请求的url中，所以不能使用url.parse。可以监听request的data事件以及end方法，并用空字符串加上回调的参数。
*/
fs.readFile('./image/'+parseObj.query.src,function(err,file){
  if(err){res.send('no')}else{
    res.send(file);
  }
})
})

app.get('/tss',function(req,res){  
 
  func.videoPlay(req,res);
})
app.get('/downLoad',function(req,res){
  func.downLoad(req,res);//调用函数对ts文件进行压缩。

})

app.get('/delete',function(req,res){
  func.delete(req,res);
})


app.post('/adminAllUser',function(req,res){
func.adminAllUser(req,res);

})

app.post('/userDelete',function(req,res){
  func.userDelete(req,res);
})

app.post('/userList',function(req,res){
  console.log(req.body.flag.slice(1));
  console.log(req.body.page);
  func.userList(req,res);
})

var avatar = multer.diskStorage({

  destination: function (req, file, cb) {
    let av1=path.join('./touxiang',req.session.user);
    if(!fs.existsSync(av1)){
      fs.mkdirSync(av1);
    };
    function deleteFolderRecursive(url) {
      let files = [];
      /**
       * 判断给定的路径是否存在
       */
 
        /**
         * 返回文件和子目录的数组
         */
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {
          const curPath = path.join(url, file);
            fs.unlinkSync(curPath);
             
        });
    
    };
    deleteFolderRecursive(av1);
    cb(null, './touxiang/'+req.session.user)
  },
  filename: function (req, file, cb) {
    cb(null, req.session.user+Date.now()+'\.jpg')
  }
})
var uploads = multer({ storage: avatar })
app.post('/avatarLoad',uploads.single('avatar'),function(req,res){
  // func.avatarLoad(req,res);
  res.statusCode=200;
  res.send('ok');
})

app.get('/avatarDisplay',function(req,res){

  let filess=[];
  let pa='./touxiang/'+req.session.user;
  try{
   filess=fs.readdirSync(pa);}catch(e){return;}
  filess.forEach(function(file,index){
   fs.readFile(pa+'/'+file,function(err,data){
    res.send(data);
   });

  })
});
app.post('/publish',function(req,res){
func.publish(req,res);

})

app.post('/userLike',function(req,res){
func.userLike(req,res);
  
})

app.post('/remarkState',function(req,res){
func.remarkState(req,res);

})

app.post('/remarkList',function(req,res){
  func.remarkList(req,res);
})

app.listen(5000,function(){
    console.log('running');})   