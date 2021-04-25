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
    var userPath=path.join('./image',request.session.user);//操作session获取用户文件夹
	if (!fs.existsSync(userPath)){//确定文件路径是否存在
        fs.mkdirSync(userPath);};//不存在就创建一个目录
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
      fs.readdir('./cutvideo',function(err,file){//读取文件夹
if(err){
        res.send('mp4文件未获取！')
}else{
        var pal=path.join('./tss',req.session.user);
        var pa1=path.join('./cutvideo',file.toString());
        if (!fs.existsSync(pal)){//确定用户文件夹路径是否存在
                fs.mkdirSync(pal);};//如果路径不存在则创建这个文件夹   
        var pam=path.join(pal,req.file.originalname.slice(0,-4)); 
        if(!fs.existsSync(pam)){
                fs.mkdirSync(pam);};  
 //遇到播放视频无声音，是因为ffmpeg在切片的时候，可以根据参数按照多种格式进行编码。而video.js接受的视频格式只有：1、Ogg = 带有Theora 视频编码和Vorbis 音频编码的 Ogg 文件；
  //   2、MPEG4 = 带有H.264 视频编码和AAC 音频编码的MPEG 4 文件；
    // 3、WebM = 带有VP8 视频编码和Vorbis 音频编码的WebM 文件。
        exec( "ffmpeg -i  "+pa1+" -codec:v libx264 -codec:a aac -map 0 -f ssegment -segment_format mpegts -segment_list "+pam+"\\"+req.file.originalname.slice(0,-4)+".m3u8 -segment_time 10 "+pam+"\\"+"out%03d.ts", function(err,a,b) {
             //hls_time设置每片的长度，默认值为2。单位为秒
             //‘hls_list_size size’ 设置播放列表保存的最多条目，设置为0会保存有所片信息，默认值为5)
             //hls_wrap wrap设置多少片之后开始覆盖，如果设置为0则不会覆盖，默认值为0.这个选项能够避免在磁盘上存储过多的片，而且能够限制写入磁盘的最多的片的数量)
             //start_number number’(设置播放列表中sequence number的值为number，默认值为0)播放列表的sequence number 对每个segment来说都必须是唯一的，而且它不能和片的文件名混淆，因为在，如果指定了“wrap”选项文件名会出现重复使用。
             
                if(err){
                       return  res.send('视频转换错误');
                }else{          
                fs.unlinkSync(pa1);
                fs.readFile(pam+"\\"+req.file.originalname.slice(0,-4)+".m3u8",function(err,data){
                        if(err) res.send("文件存储发生错误！");
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
                        
                })//改变文件中m3u8文件中的ts文件的相对定位为绝对定位。



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
       //ffmpeg生成的m3u8文件索引是本地的ts视频路劲，需要设置网络路径。

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
                if(err) console.log("MySQL删除错误！");
console.log(result);
if(result.affectedRows>0){
        function deleteFolderRecursive(url) {
                let files = [];
                /**
                 * 判断给定的路径是否存在
                 */
                if (fs.existsSync(url)) {
                  /**
                   * 返回文件和子目录的数组
                   */
                  files = fs.readdirSync(url);
                  files.forEach(function (file, index) {
              
                    const curPath = path.join(url, file);
                    /**
                     * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
                     */
                    if (fs.statSync(curPath).isDirectory()) { //  // recurse判断在url文件夹下是否还存在文件夹
                      deleteFolderRecursive(curPath);
              
                    } else {
                      fs.unlinkSync(curPath);
                    }
                  });
                  /**
                   * 清除文件夹
                   */
                  fs.rmdirSync(url);
              
                } else {
                  console.log("给定的路径不存在，请给出正确的路径");
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
//在删除文件夹时，应先删除里面的文件.
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
        console.log('压缩完成');
    });
    
    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        status=false;
        throw err;
    });
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment');//Content-Disposition指定回复的内容应该以何种形式返回，内联(inline)/附件下载(attchment).
    archive.pipe(res);//文件流以数据的形式传会前端，不在本地下载。
    // pipe archive data to the file
    archive.directory(arg4, false);
    archive.finalize();//压缩ts视频文件，便于向前端发送。
   
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
connection.end();//请将destroy()和end（）区分开。end（）是执行结果拿到后再断开，destroy（）是不论有没有执行完查询语句都马上断开连接。
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

