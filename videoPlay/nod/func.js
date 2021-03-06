var path=require('path');
var fs=require('fs');
var ffmpeg=require('fluent-ffmpeg');
const {exec}=require('child_process');
const url=require('url');
const  archiver=require('archiver');
var mysql=require('mysql');
const { query } = require('express');
const moment=require('moment');
const md5=require('md5');
const axios=require('axios');
const { Buffer } = require('buffer');
exports.code=function (length) {
        var chars = ['0','1','2','3','4','5','6','7','8','9'];
        var result = ""; 
        for(var i = 0; i < length ; i ++) {
            var index = Math.ceil(Math.random()*9);
            result += chars[index];
        }
        return result;
    }
exports.message=function(phone,code,callback){
        let accountId="8aaf070878d419aa0178fd71645d10db";
        let appToken="545e6b59033c458da2d5ee1d9a5bacc4";
        var appid="8aaf070878d419aa0178fd71657a10e2";
        let moments=moment().format("YYYYMMDDHHmmss");
        let arg=md5(accountId+appToken+moments);
        let urls="https://app.cloopen.com:8883"; 
        let Rest_URL=urls+'/2013-12-26/Accounts/'+accountId+'/SMS/TemplateSMS?sig='+arg;
        let auth=new Buffer.from((accountId+":"+moments))
        let body={
                to:phone,
                appId:appid,
                templateId:'1',
                "datas":[code,"1"]    
        }
        let head={
                'Accept':'application/json',
                'Content-Type':'application/json;charset=utf-8',
                'Content-Length':256,
                'Authorization':auth.toString('base64'),

        }
        axios({
                url:Rest_URL,
                method:'post',
                headers:head,
                data:body,
        }).then(
                (ress)=>{ console.log(ress.data.templateSMS);
                        callback(ress.data.templateSMS)})
        .catch((er)=>{return;});
}




exports.fetchVideoThumbnail=function (videopath,request){
	var filename = path.join(videopath);
    var userPath=path.join('./image',request.session.user);//??????session?????????????????????
	if (!fs.existsSync(userPath)){//??????????????????????????????
        fs.mkdirSync(userPath);};//??????????????????????????????
	//filename = filename.replaceAll("\\\\","\\\\");
//	var userPath = finallyPath.replaceAll("\\\\","\\\\");
var names=userPath+"\/"+(request.file.originalname.slice(0,-4))+"\.jpg";
		exec("ffmpeg -ss 00:00:10 -i "+filename+" -y -f image2 -t 0.001 "+names, function() {
			 console.log('success');      
        });
}
exports.readFileEntry=function(request, ress) {  
        var userPath=path.join('./image',request.session.user);
 fs.readdir(userPath,function(err,files){
         if(err){return ress.send('err');}else{
                files.forEach(function(filename){
                        var filedir = path.join(userPath, filename);
                                    var content = fs.readFileSync(filedir, 'utf-8');                                        
 })
}
})
}
exports.cut=function(req,res){
      fs.readdir('./cutvideo',function(err,file){//???????????????
if(err){
        res.send('mp4??????????????????')
}else{
        var pal=path.join('./tss',req.session.user);
        var pa1=path.join('./cutvideo',file.toString());
        if (!fs.existsSync(pal)){//???????????????????????????????????????
                fs.mkdirSync(pal);};//?????????????????????????????????????????????   
        var pam=path.join(pal,req.file.originalname.slice(0,-4)); 
        if(!fs.existsSync(pam)){
                fs.mkdirSync(pam);};  
 //???????????????????????????????????????ffmpeg???????????????????????????????????????????????????????????????????????????video.js??????????????????????????????1???Ogg = ??????Theora ???????????????Vorbis ??????????????? Ogg ?????????
  //   2???MPEG4 = ??????H.264 ???????????????AAC ???????????????MPEG 4 ?????????
    // 3???WebM = ??????VP8 ???????????????Vorbis ???????????????WebM ?????????
        exec( "ffmpeg -i  "+pa1+" -codec:v libx264 -codec:a aac -map 0 -f ssegment -segment_format mpegts -segment_list "+pam+"\\"+req.file.originalname.slice(0,-4)+".m3u8 -segment_time 10 "+pam+"\\"+"out%03d.ts", function(err,a,b) {
             //hls_time????????????????????????????????????2???????????????
             //???hls_list_size size??? ???????????????????????????????????????????????????0???????????????????????????????????????5)
             //hls_wrap wrap???????????????????????????????????????????????????0??????????????????????????????0.???????????????????????????????????????????????????????????????????????????????????????????????????????????????)
             //start_number number???(?????????????????????sequence number?????????number???????????????0)???????????????sequence number ?????????segment??????????????????????????????????????????????????????????????????????????????????????????????????????wrap??????????????????????????????????????????
             
                if(err){
                       return  res.send('??????????????????');
                }else{          
                fs.unlinkSync(pa1);
                fs.readFile(pam+"\\"+req.file.originalname.slice(0,-4)+".m3u8",function(err,data){
                        if(err) res.send("???????????????????????????");
                        let dat=data.toString();
                        let da=dat.split('\n');
                        let da2=[];
                        da.forEach(element => {
                            if(element.indexOf('.ts')!==-1){

                                let elements=pam+"\\"+element;
                                da2.push(elements);
                            }else{
                                da2.push(element);
                            }
                        });
                        var s=da2.join('\n');
                        da2=[];
                        fs.writeFile(pam+"\\"+req.file.originalname.slice(0,-4)+".m3u8",s,{encoding:'utf-8'},function(err){
                                if(err)console.log("err");
                                console.log("success");
                        })
                        
                })//???????????????m3u8????????????ts???????????????????????????????????????



                        var connection = mysql.createConnection({
                                host: '127.0.0.1',
                                port:'3308',
                                user: 'root',
                                password: '',
                                database:"code",
                      }); 
                        connection.connect(); 
                        var abc=pam+'\\'+req.file.originalname.slice(0,-4)+'.m3u8'; 
                        var d=req.file.originalname.slice(0,-4)+".m3u8";
                        var time=new Date();
                        var time1=time.getFullYear()+"-"+time.getMonth()+"-"+time.getDay();
                      connection.query("insert into uservideo (id,userName,video,time,pages) values(?,?,?,?,?)", [req.session.ids,req.session.user,abc,time1,d],function (error, results, fields){
                              if(error){
                                 console.log(error);
                              }{
                                res.send('yes');
                              }
                      })
                      connection.end(); 
                      
   
                }
});
}
      })  
}


exports.power=function(req,res){
     
        var connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
      }); 
        connection.connect(); 
        connection.query("select * from admin where name=?",[req.session.user],function(err,resultss){
                if(err){res.statusCode=205,res.send(' ')}else{
                if(resultss.length<1){res.statusCode=205;res.send('')}else{ 
                        res.statusCode=200;res.send('power')}}
        })
        connection.end();

}


exports.table=function(req,res){
        var connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
      }); 
        connection.connect(); 
var arr=[];
      connection.query("select * from uservideo where id=(?)",[req.session.ids],function(err,results){
if(results){
       
    results.map(function(result,index){
        let arrs=result.video.split('\\');
            arr.push({
                    'id':result.id,
                "key":result.allid,
                "name":result.video, 
                "time":result.time,
                "user":result.userName,
                "type":(result.video.slice(-5)).split(','),
                "pages": result.pages,      
        });

    })
}
res.send(arr);
arr=[]; 
connection.end();
      })
}

exports.listOptionS=function(req,res){
        var connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
      }); 
        connection.connect(); 
        var pageNumber=req.body.pageName;   
       

        connection.query("select * from uservideo where id=? limit ?,?",[req.body.userId,parseInt(pageNumber*5),parseInt((pageNumber+1)*5)],function(err,results){//parseInt(pageNumber*5),parseInt((pageNumber+1)*5)
                if(err){
                        console.log(err);
                }else{
                        let arr1=[];
                      arr1=  results.map((file,index)=>{
                                return {    "id":file.allid,
                                            "name":file.pages,
                                            "time":file.time,
                                            "img":"/image/"+req.session.user+"/"+file.pages.slice(0,-5)+".jpg",
                                            "video":file.video,
                                };
                        }) 
                        res.send(arr1);
                        arr1=[];                    
                }
               
                connection.end();
        })

}

exports.listOption=function(req,res){
        var connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
      }); 
        connection.connect(); 
        var pageNumber=req.body.pageName;   
       

        connection.query("select * from uservideo where id=? limit ?,?",[req.session.ids,parseInt(pageNumber*5),parseInt((pageNumber+1)*5)],function(err,results){//parseInt(pageNumber*5),parseInt((pageNumber+1)*5)
                if(err){
                        console.log(err);
                }else{
                        let arr1=[];
                      arr1=  results.map((file,index)=>{
                                return {    "id":file.allid,
                                            "name":file.pages,
                                            "time":file.time,
                                            "img":"/image/"+req.session.user+"/"+file.pages.slice(0,-5)+".jpg",
                                            "video":file.video,
                                };
                        }) 
                        res.send(arr1);
                        arr1=[];                    
                }
               
                connection.end();
        })

}
exports.videoPlay=function(req,res){
        
res.writeHead(200, {
        'Content-Type': 'video/mpeg4' });
        fs.createReadStream(req.url).pipe(res);
       //ffmpeg?????????m3u8????????????????????????ts??????????????????????????????????????????

}

exports.delete=function(req,res){
        var deleteUrl=url.parse(req.url,true);
        var connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
      }); 
        connection.connect(); 
        connection.query("delete from uservideo where pages=? and id=?",[deleteUrl.query.pages,req.session.ids],function(err,result){
                if(err) console.log("MySQL???????????????");
console.log(result);
if(result.affectedRows>0){
        function deleteFolderRecursive(url) {
                let files = [];
                /**
                 * ?????????????????????????????????
                 */
                if (fs.existsSync(url)) {
                  /**
                   * ?????????????????????????????????
                   */
                  files = fs.readdirSync(url);
                  files.forEach(function (file, index) {
              
                    const curPath = path.join(url, file);
                    /**
                     * fs.statSync????????????????????????????????????????????????????????????????????????
                     */
                    if (fs.statSync(curPath).isDirectory()) { //  // recurse?????????url????????????????????????????????????
                      deleteFolderRecursive(curPath);
              
                    } else {
                      fs.unlinkSync(curPath);
                    }
                  });
                  /**
                   * ???????????????
                   */
                  fs.rmdirSync(url);
              
                } else {
                  console.log("???????????????????????????????????????????????????");
                }
              };
              var arg3="./tss"+"\\"+req.session.user+"\\"+(deleteUrl.query.pages).slice(0,-5)+"\\";
              deleteFolderRecursive(arg3);
              fs.unlinkSync("./image"+"/"+req.session.user+"/"+(deleteUrl.query.pages).slice(0,-5)+".jpg");
res.send("delete success");
}else{
res.send(' ');
}
        });
//???????????????????????????????????????????????????.
connection.end();
}

exports.downLoad=function(req,res){
        let dLoad=url.parse(req.url,true);
  var arg4="./tss"+"\\"+req.session.user+"\\"+(dLoad.query.pages).slice(0,-5)+"\\";
  var out="./tss"+"\\"+req.session.user+"\\"+(dLoad.query.pages).slice(0,-5)+".zip";

this.status=true;

    // create a file to stream archive data to.
    var outputs = fs.createWriteStream(out);
    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    
    // listen for all archive data to be written
    outputs.on('close', function() {
        console.log(archive.pointer()/1024/1024 + 'M');
        console.log('????????????');
    });
    
    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        status=false;
        throw err;
    });
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment');//Content-Disposition?????????????????????????????????????????????????????????(inline)/????????????(attchment).
    archive.pipe(res);//???????????????????????????????????????????????????????????????
    // pipe archive data to the file
    archive.directory(arg4, false);
    archive.finalize();//??????ts???????????????????????????????????????
   
}

exports.adminAllUser=function(req,res){
        let connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
            }); 
            connection.connect(); 
            connection.query("select * from user limit ?,?",[req.body.pageNumber*10,(req.body.pageNumber+1)*10],function(err,files){
if(err){
        res.statusCode=205;
        res.send(' ');
        }else{
              let arr= files.map(function(file,index){
return {
        name:file.name,
        id:file.id,
        tel:file.tel
};
                })
                res.statusCode=200;
                res.send(arr);
                arr=[];
        }
            });
      connection.end();
}

exports.userDelete=function(req,res){
        let connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
            }); 
            connection.connect(); 
            connection.query("delete from user where id=? and name=?",[req.body.id,req.body.name],function(err,data){
                    if(err) {res.statusCode=205;res.send(' ')}else{if(data.affectedRows>0){res.statusCode=200;res.send('success')}else{res.statusCode=205;res.send(' ')}}
            })
connection.end();//??????destroy()???end??????????????????end??????????????????????????????????????????destroy?????????????????????????????????????????????????????????????????????
}

exports.userList=function(req,res){
        let connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
            }); 
            connection.connect();
            connection.query("select * from uservideo where id=? limit ?,?",[req.body.flag.slice(1),parseInt(req.body.page*5),parseInt((req.body.page+1)*5)],function(err,files){
                    if(err){res.statusCode=205;res.send(' ')}else{
                       let fil= files.map((file,index)=>{
                        return {
                                "id":index,
                                            "name":file.pages,
                                            "time":file.time,
                                            "img":"/image/"+req.session.user+"/"+file.pages.slice(0,-5)+".jpg",
                                            "video":file.video,
                        };
                        })
                        console.log(req.session.user);
                        res.statusCode=200;
                       res.send(fil);
                    }
            })
            connection.end();
}


exports.publish=function(req,res){
        let connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
            }); 
            connection.connect();
            connection.query("insert into publish values (?,?,?,?)",[req.body.id,req.body.user,req.body.name,req.body.pages],function(err,results){
                    if(err){res.statusCode=205;res.send(' ')}else{
                            if(results.affectedRows>0){
                                    res.statusCode=200;
                                    res.send('ok');
                            }else{
                                res.statusCode=205;res.send(' ');
                            }
                    }
            })
            connection.end();

}

exports.userLike=function(req,res){
        let connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
            }); 
            connection.connect();
            connection.query("select * from publish limit ?,?",[parseInt(req.body.pageNumber*10),parseInt((req.body.pageNumber+1)*10)],function(err,results){
                    if(err){res.statusCode=205;res.send(err)}else{
                            if(results==[]){res.statusCode=205;res.send('asd ') }else{
                                    let arr2=[];
                                    arr2=results.map(function(result,index){
                                            return {
                                                    "id":result.id,
                                                    "name":result.publishName,
                                                    "video":result.video,
                                                    "pages":result.videoName,
                                                    'img':"/image/"+result.publishName+"/"+result.videoName.slice(0,-5)+".jpg",
                                            }
                                    });
                                    res.statusCode=200;
                                    res.send(arr2);
                                    arr2=[];
                            }
                    }
            })
            connection.end();

}

exports.remarkState=function(req,res){
        let connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
            }); 
            connection.connect();   
            connection.query("insert into remark values (?,?,?,?,?)",[req.body.id,req.body.pages,req.body.remark,req.session.ids,req.session.user],function(err,results){
                    if(err){res.statusCode=205;res.send(' ')}else{
                            if(results.affectedRows>0){
                                    res.statusCode=200;
                                    res.send('ok');
                            }else{
                                res.statusCode=205;res.send(' ');
                            }
                    }
            })
            connection.end();
}


exports.remarkList=function(req,res){
        let connection = mysql.createConnection({
                host: '127.0.0.1',
                port:'3308',
                user: 'root',
                password: '',
                database:"code",
            }); 
            connection.connect();
            connection.query("select * from remark where userid=? and videoName=?",[req.body.id,req.body.video],function(err,results){
if(err){res.statusCode=205;res.send(' ')}else{
        if(results==[]){res.statusCode=205;res.send(' ')}else{
                results.map(function(result,index){
                        return {
                                "remarker":result.remarkUser,
                                "state":result.remarkState,
                        }
                })
      
                res.statusCode=200;
                res.send(results);
        }
}
            })
            connection.end();

}

