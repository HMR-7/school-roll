const express = require('express');
const app = express();
//添加一个body-parser包
const bodyParser = require('body-parser');
const mysql = require('mysql');
//创建数据库连接
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'class'
});
//使用模板引擎
app.set('view engine', 'ejs');
app.set('views', 'ejsViews');
//解析post发送过来的数据 -固定写法
app.use(bodyParser.urlencoded({ extended: false }));
//添加session包
const session = require('express-session');
//设置css,js文件的访问路径-静态文件托管
app.use('/public', express.static('public'));
//使用session
app.use(
    session({
        secret: 'hmr',
        resave: false,
        saveUninitialized: false
    })
)

//👉省-登录页面
app.get('/login_pro', function (req, res) {
    res.render('pro_index.ejs');
})

//👉省-登录成功后的首页页面
app.get('/prostu', function (req, res) {
    // 如果下面的条件成立，表示没有值
    if (typeof req.session.proName === 'undefined') {
        //⭐如果没有值，跳转到登录页面，让用户登录。
        res.redirect('/login_pro');
    } else {
        res.render('pro_stu.ejs', { proInfoName: req.session.proName });
    }
})

//👉省-专业库显示对应用户
app.get('/bank_pro', function (req, res) {
    // 如果下面的条件成立，表示没有值
    if (typeof req.session.proName === 'undefined') {
        //⭐如果没有值，跳转到登录页面，让用户登录。
        res.redirect('/login_pro');
    } else {
        res.render('pro_bank.ejs', { proInfoName: req.session.proName });
    }
})

//👉省-专业库
app.get('/bank_pro', function (req, res) {
    res.render('pro_bank.ejs');
})

//校登录页面
app.get('/login', function (req, res) {
    res.render('index.ejs');
})

//校-登录成功后的首页页面
app.get('/stu', function (req, res) {
    // 如果下面的条件成立，表示没有值
    if (typeof req.session.usName === 'undefined') {
        //⭐如果没有值，跳转到登录页面，让用户登录。
        res.redirect('/login');
    } else {
        res.render('stu.ejs', { usInfoName: req.session.usName });
    }
})

app.get('/bank', function (req, res) {
    // 如果下面的条件成立，表示没有值
    if (typeof req.session.usName === 'undefined') {
        //⭐如果没有值，跳转到登录页面，让用户登录。
        res.redirect('/login');
    } else {
        res.render('bank.ejs', { usInfoName: req.session.usName });
    }
})

//首页内容查询
app.post('/refstu', function (req, res) {
    var school = req.body.schoolName;
    const sql = 'select * from students where  studentSchool = "' + school + '"';
    conn.query(sql, function (err, result) {
        if (err) {
            res.send({ msg: err.message, flag: 'no' });
        } else {
            res.send({ msg: result, flag: 'yes' });
        }
    })
})

//首页学生身份证查重
app.post('/checkcard', function (req, res) {
    var idcard = req.body.idcardName;
    const sql = 'select count(*) as sum from students where ID_card = ?';
    conn.query(sql, idcard, function (err, result) {
        if (err) {
            res.send({ msg: '查询失败' });
        } else {
            if (result[0].sum > 0) {
                res.send({ msg: '已录入' });
            } else {
                res.send({ msg: '未录入' })
            }
        }
    })
})

//首页学生插入
app.post('/addStudent', function (req, res) {
    var idExp = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    var studentCard = req.body.card;
    var userName = req.body.name;
    var userPwd = req.body.password;
    var realName = req.body.real;
    var liveNow = req.body.live;
    const sqlstr = 'select count(*) as sum from students where ID_card = ?';
    conn.query(sqlstr, studentCard, function (err, result) {
        if (err) return res.send({ msg: '查询错误', flag: 'no' });
        if (result[0].sum > 0 || idExp.test(studentCard) === false) return res.send({ msg: '身份证格式错误或已被录入', flag: 'no' });
        const sql = 'insert into students(ID_card,studentSchool,studentPwd,realName,live) values(?,?,?,?,?)';
        conn.query(sql, [studentCard, userName, userPwd, realName, liveNow], function (err, result) {
            if (err) {
                res.send({ msg: "录入信息失败!!", flag: 'no' });
            } else {
                res.send({ msg: "录入信息成功", flag: 'yes' });
            }
        })
    })
})

//首页-删除学生信息
app.post('/delStudent', function (req, res) {
    var stuCard = req.body.idcard;
    const sql = 'delete from students where ID_card = ?'
    conn.query(sql, stuCard, function (err, result) {
        if (err) {
            res.send({ msg: '删除失败', flag: 'no' });
        } else {
            res.send({ msg: '删除成功', flag: 'yes' });
        }
    })
})

//首页-更新学生数据
app.post('/upStu', function (req, res) {
    var idExp = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    var studentCard = req.body.card;
    var userName = req.body.name;
    var userPwd = req.body.password;
    var reName = req.body.real;
    var liveNow = req.body.live;
    const sql = 'update students set studentSchool = "' + userName + '", studentPwd = "' + userPwd + '",realName = "' + reName + '",live="' + liveNow + '",state ="未审核" where id_card= ?'
    conn.query(sql, studentCard, function (err, result) {
        if (err || idExp.test(studentCard) === false) {
            console.log(result);
            res.send({ msg: '修改失败', flag: 'no' });
        } else {
            res.send({ msg: '修改成功', flag: 'yes' });
        }
    })
})

//专业库页面
app.get('/bank', function (req, res) {
    if (typeof req.session.usName === 'undefined') {
        //⭐如果没有值，跳转到登录页面，让用户登录。
        res.redirect('/login');
    } else {
        res.render('bank.ejs');
    }

})

//查询专业库
app.post('/bank', function (req, res) {
    const sql = 'select * from banks';
    conn.query(sql, function (err, result) {
        if (err) {
            //err.message:固定写法，表示存储的是错误信息
            res.send({ msg: err.message, flag: 'no' });
        } else {
            res.send({ msg: result, flag: 'yes' });
        }
    })
})

//专业库插入-查重
app.post('/checkName', function (req, res) {
    var major = req.body.majorName;
    const sql = 'select count(*) as sum from banks where bank_name = ?';
    conn.query(sql, major, function (err, result) {
        if (err) {
            res.send({ msg: '查询失败' });
        } else {
            if (result[0].sum > 0) {
                res.send({ msg: '该专业已被录入' });
            } else {
                res.send({ msg: '该专业未被录入' })
            }
        }
    })
})

//专业库插入数据
app.post('/selBank', function (req, res) {
    var bankName = req.body.name;
    const sqlstr = 'select count(*) as sum from banks where bank_name = ?';
    conn.query(sqlstr, bankName, function (err, result) {
        if (err) return res.send({ msg: '查询错误', flag: 'no' });
        if (result[0].sum > 0) return res.send({ msg: '该专业已被录入', flag: 'no' });
        const sql = 'insert into banks(bank_name) values(?)';
        conn.query(sql, bankName, function (err, result) {
            if (err) {
                res.send({ msg: "插入数据错误!!", flag: 'no' });
            } else {
                res.send({ msg: "插入成功", flag: 'yes' });
            }
        })
    })
})

//注册查重功能
app.post('/regUser', function (req, res) {
    var schoolName = req.body.name;
    const sql = 'select count(*) as sum from users where username = ?'
    conn.query(sql, schoolName, function (err, result) {
        if (err) {
            res.send({ msg: '查询失败' });
        } else {
            if (result[0].sum > 0) {
                res.send({ msg: '已注册' });
            } else {
                res.send({ msg: '未注册' })
            }
        }
    })
})

//学校注册功能
app.post('/regSuccess', function (req, res) {
    var nameExp = /^([\u4E00-\u9FA5-Za-z])*$/;
    var schoolName = req.body.name;
    var userPwd = req.body.pwd;
    const sqlstr = 'select count(*) as sum from users where username = ?';
    conn.query(sqlstr, schoolName, function (err, result) {
        if (err) return res.send({ msg: '查询错误', flag: 'no' });
        if (result[0].sum > 0 || nameExp.test(schoolName) === false) return res.send({ msg: '学习名称必须由汉字组成', flag: 'no' });
        const sql = 'insert into users(username,userpwd) values(?,?)';
        conn.query(sql, [schoolName, userPwd], function (err, result) {
            if (err) {
                res.send({ msg: "注册失败!!", flag: 'no' });
            } else {
                res.send({ msg: "注册成功", flag: 'yes' });
            }
        })
    })
})

//完成用户登录
app.post('/login', function (req, res) {
    var userName = req.body.name;
    var userPwd = req.body.pwd;
    const sql = 'select * from users where username = ? and userpwd = ?'
    conn.query(sql, [userName, userPwd], function (err, result) {
        if (err) {
            res.send({ msg: '数据查询错误', flag: 'no' });
        } else {
            if (result.length !== 1) {
                res.send({ msg: '用户名或密码错误！！！', flag: 'no' });
            } else {
                //session对象：可以将用户登录成功后的信息存储到这个对象中
                //该对象中的数据会存储在服务器的内存中。这样我们可以在任何的方法中获取该对象的数据。
                req.session.usName = result[0].username;
                res.send({ msg: '登录成功!!!', flag: 'yes' });
            }
        }
    })
})

//-------------------------------------------------------------------------------
//省登录系统
app.post('/prologin', function (req, res) {
    var userName = req.body.name;
    var userPwd = req.body.pwd;
    const sql = 'select * from pro_users where pro_username = ? and pro_userpwd = ?'
    conn.query(sql, [userName, userPwd], function (err, result) {
        if (err) {
            res.send({ msg: '数据查询错误', flag: 'no' });
        } else {
            if (result.length !== 1) {
                res.send({ msg: '用户名或密码错误！！！', flag: 'no' });
            } else {
                //session对象：可以将用户登录成功后的信息存储到这个对象中
                //该对象中的数据会存储在服务器的内存中。这样我们可以在任何的方法中获取该对象的数据。
                req.session.proName = result[0].pro_username;
                res.send({ msg: '登录成功!!!', flag: 'yes' });
            }
        }
    })
})

//👉省-首页内容查询
app.post('/pro_refstu', function (req, res) {
    const sql = 'select * from students where state = "未审核"';
    conn.query(sql, function (err, result) {
        if (err) {
            res.send({ msg: err.message, flag: 'no' });
        } else {
            res.send({ msg: result, flag: 'yes' });
        }
    })
})

//👉省-审核失败学生数据
app.post('/proupStu', function (req, res) {
    var stuCard = req.body.idcard;
    const sql = 'update students set state = "审核未通过" where ID_card = ?'
    conn.query(sql, stuCard, function (err, result) {
        if (err) {
            console.log(result);
            res.send({ msg: '操作失败', flag: 'no' });
        } else {
            res.send({ msg: '审核未通过', flag: 'yes' });
        }
    })
})

//👉省-审核成功学生数据
app.post('/proPassStu', function (req, res) {
    var stuCard = req.body.idcard;
    const sql = 'update students set state = "审核通过" where ID_card = ?'
    conn.query(sql, stuCard, function (err, result) {
        if (err) {
            console.log(result);
            res.send({ msg: '操作失败', flag: 'no' });
        } else {
            res.send({ msg: '审核通过', flag: 'yes' });
        }
    })
})

//服务器监听
app.listen(3000, '127.0.0.1', function () {
    console.log('server running');
})