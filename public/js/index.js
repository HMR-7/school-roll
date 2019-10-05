$(function () {
    $('.register-btn').click(function () {
        $(this).parents('#login').hide().siblings('#register').show();
    })

    $('.direct-btn').click(function () {
        $(this).parents('#register').hide().siblings('#login').show();
    })
})

//注册学校名查重功能
function SchoolChecking() {
    $("#reg-user").focus(function () {
        $("#showMsg").text("");
    });
    $("#reg-user").blur(function () {
        var schoolName = $('#reg-user').val();
        var nameExp = /^([\u4E00-\u9FA5-Za-z])*$/;
        if (schoolName === '' || nameExp.test(schoolName) === false) {
            $('#showMsg').text('必须由汉字组成！');
        } else {
            $.post('/regUser', {
                name: schoolName
            },
                function (data) {
                    $('#showMsg').text('');
                    $('#showMsg').text(data.msg);
                })
        }
    })
}

//学校注册成功，插入数据库功能
function AddNewSchool() {
    $('#reg-btn').click(function () {
        var userName = $('#reg-user').val();
        var userPwd = $('#reg-pwd').val();
        var userExp = /^([\u4E00-\u9FA5-Za-z])*$/;
        var pwdExp = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
        if (userName === '' || userExp.test(userName) === false) {
            document.getElementById('myform2').reset();
        }
        if (userPwd === '' || pwdExp.test(userPwd) === false) {
            alert('用户名或者密码格式错误');
        } else {
            $.post('/regSuccess', {
                name: userName,
                pwd: userPwd
            }, function (data) {
                if (data.flag === 'no') {
                    alert(data.msg);
                    document.getElementById('myform2').reset();
                } else {
                    window.location.href = '/login'
                }
            })
        }
    })
}

// 完成登录，进入到首页
function LoginSuccess() {
    $('#log-btn').click(function (event) {
        event.preventDefault();
        var schoolName = $('#log-user').val();
        var userPwd = $('#log-pwd').val();
        $.post('/login', {
            name: schoolName,
            pwd: userPwd
        }, function (data) {
            if (data.flag === 'no') {
                alert(data.msg);
                document.getElementById('myform1').reset();
            } else {
                window.location.href = '/stu'
            }
        })
    })
}

