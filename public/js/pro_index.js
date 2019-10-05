function login() {
    // 完成登录，进入到首页
    $('#pro-login').click(function (event) {
        event.preventDefault();
        var schoolName = $('#log-user').val();
        var userPwd = $('#log-pwd').val();
        $.post('/prologin', {
            name: schoolName,
            pwd: userPwd
        }, function (data) {
            if (data.flag === 'no') {
                alert(data.msg);
                document.getElementById('myform1').reset();
            } else {
                window.location.href = '/prostu'
            }
        })
    })
}