const express = require("express");
const mysql = require("mysql");
const router = express.Router();
var vertoken=require('./token/token')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sherri',
    password: '123456',
    database: 'my_db',
})
connection.connect();
//验证码接口
router.get('/identifyCode',function (request,response){
    let num1 = Math.floor(Math.random() * 10);//0-9的随机数
    let num2 = Math.floor(Math.random() * 10);

    let msg={
        firstnum:num1,
        secondnum:num2,
    }
    response.send({
        code:0,
        data:msg,
        message:'两位数验证码'
    })
})
//登录接口
router.get('/login', function (req, res) {
    const query = req.query;
    console.log(query)
    const username = query.username;
    const password = query.password;
    const userType = query.userType;//1表示管理端、0表示用户端
    // console.log(username,password)
    let sql;
    if (userType == 1) {
        sql = 'select * from adminuser where admin=? '
    } else {
        sql = 'select * from user where userName=? '
    }
    connection.query(sql, [username], function (err, result) {
        if (err) {
            console.log("访问数据库失败！")
            return
        } else {
            console.log(result)
            let reMsg;
            if (result.length) {
                var token = jwt.sign(user, 'app.get(superSecret)', {
                    'expiresInMinutes': 1440 // 设置过期时间
                });
                vertoken.setToken(result[0].user_name,result[0].user_id).then(token=>{
                    return  res.json({
                        code: 200,
                        message: '登录成功',
                        token:token
                        //前端获取token后存储在localStroage中,
                        //**调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
                    })
                })
                if (result[0].adminPassword === password || result[0].userPassword === password) {
                    reMsg = {
                        code: 0,
                        msg: "登录成功",
                        data: {
                            // userID: result[0].adminUserID,
                            // username: result[0].admin||result[0].userName,
                            // fileNum:result[0].fileNum,
                            ...result[0]
                        }
                    }
                } else {
                    reMsg = {
                        code: 1,
                        msg: "密码错误"
                    }
                }
            } else {
                reMsg = {
                    code: 2,
                    msg: '用户名不存在'
                }
            }
            res.send(reMsg)
        }
    });
});

// 请求 api/userList接口  请求用户列表数据
router.get('/userList', function (req, res) {
    let sql = 'select * from user where username like ? '
    const query = req.query;
    // console.log(req)
    const username = query.username ? ("%" + query.username + '%') : "%";
    // const cardID = query.cardID ? query.cardID : "%";
    // const orderStatus = query.orderStatus ? query.orderStatus : "%";
    // const orderStart = query.orderStart ? query.orderStart : "";
    // const orderEnd = query.orderEnd ? query.orderEnd : "";
    // const orderType = query.orderType ? query.orderType : "";
    // const orderName = query.orderName ? query.orderName : "";
    // const orderFrom = query.orderFrom ? query.orderFrom : "";
    // const orderOrgan = query.orderOrgan ? query.orderOrgan : "";
    // console.log(username)
    connection.query(sql, [username], function (err, result) {
        if (err) {
            console.log("连接数据库失败")
            return
        } else {
            let reMsg;
            if (result[0].data === 0) {
                reMsg = {
                    code: 1,
                    msg: '查询数据空',
                    data: ""
                }
            } else {
                reMsg = {
                    code: 0,
                    msg: '查询成功',
                    data: result
                }
            }
            res.send(reMsg)
        }
    })
});

//档案编号请求个人档案表数据
router.get('/userDetail', function (req, res) {
    const query = req.query;
    const fileNum = query.fileNum
    // console.log("reeere"+fileNum)
    let sql = 'select * from filedetails where fileNum=?'
    connection.query(sql, [fileNum], function (err, result) {
        if (err) {
            console.log("连接数据库失败")
            return
        } else {
            // let reMsg;
            // if (result[0].data === 0) {
            //     reMsg = {
            //         code: 1,
            //         msg: '查询数据空',
            //         data: ""
            //     }
            // } else {
            //     reMsg = {
            //         code: 0,
            //         msg: '查询成功',
            //         data: result
            //     }
            // }
            // res.send(reMsg)
            res.send(result)
        }
    });
});
//获取doctor表内容
router.get('/getDoctor', function (req, res) {
    const query = req.query;
    const teamBelong = query.teamBelong
    let sql = 'select * from doctor where teamBelong=?'
    connection.query(sql, [teamBelong], function (err, result) {
        if (err) {
            console.log("连接数据库失败")
            return
        } else {
            // let reMsg;
            // if (result[0].data === 0) {
            //     reMsg = {
            //         code: 1,
            //         msg: '查询数据空',
            //         data: ""
            //     }
            // } else {
            //     reMsg = {
            //         code: 0,
            //         msg: '查询成功',
            //         data: result
            //     }
            // }
            // res.send(reMsg)
            res.send(result)
        }
    });
});
//获取服务包名称表内容 orderbag
router.get('/orderBag', function (req, res) {
    const query = req.query;
    const orderTypeBasic = query.orderTypeBasic?'%'+query.orderTypeBasic+'%':'%'
    let sql = 'select * from orderbag where orderTypeBasic like ?'
    connection.query(sql, [orderTypeBasic], function (err, result) {
        if (err) {
            console.log("连接数据库失败")
            return
        } else {
            res.send(result)
        }
    });
});
//编辑用户
router.post('/editor', function (req, res) {
    const query = req.body;
    console.log(query)
    const userID = query.userID;
    const userName = query.userName;
    const IDcard = query.IDcard;
    const userAge = query.userAge;
    const phoneNumber = query.phoneNumber;
    let sql = 'update user set userName=? ,phoneNumber=?,IDcard=?,userAge=?where userID=?'
    connection.query(sql, [userName,phoneNumber,IDcard,userAge,userID], function (err, result) {
        if(err){
            console.log("服务器出错");
            return;
        }
        let data;
        if(result.affectedRows){
            data={
                code:0,
                msg:"修改成功"
            }
        }else{
            data={
                code:1,
                msg:"修改失败"
            }
        }
        res.send(data);
    });
});

module.exports = router;
