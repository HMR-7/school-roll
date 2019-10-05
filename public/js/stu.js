//学生管理权限开关
function into() {
    var oCheck = document.getElementById("check");
    if (oCheck.checked == true) {
        var oDiv = document.getElementById("New");
        oDiv.style.display = "block";
    } else {
        var oDiv = document.getElementById("New");
        oDiv.style.display = "none";
        $("#showMsg").text("");
        document.getElementById("myform").reset();
    }
}

function reset() {
    $('.btn-primary').click(function () {
        document.getElementById("myform").reset();
    })
}

//查询数据
function ReferData() {
    var school = $('#name').val();
    $.post('/refstu', {
        schoolName: school
    }, function (data) {
        if (data.flag === 'yes') {
            for (var i = 0; i < data.msg.length; i++) {
                $('<tr><td>' + data.msg[i].ID_card + '</td> <td>' + data.msg[i].studentSchool +
                    '</td><td>' + data.msg[i].studentPwd + '</td><td>' + data.msg[i].realName +
                    '</td> <td>' + data.msg[i].live + '</td><td>' + data.msg[i].state +
                    '</td> <td> <input type="button" class="del-btn"  id="btn-danger" value="删除"  cards="' + data.msg[i].ID_card + '" /><input type="button" value="修改" class="up-btn" id="btn-info"  megs="' + data.msg[i].ID_card + ',' + data.msg[i].studentSchool + ',' + data.msg[i].studentPwd + ',' + data.msg[i].realName + ',' + data.msg[i].live + ' "    /></td></tr>'
                ).appendTo('#listTable');

            }
            //完成删除
            DeleteData();
            Updata();
            $("#showMsg").text("");
        } else {
            alert('查询失败');
        }
    })
}

//学生身份证查重
function CheckCard() {
    $("#card").focus(function () {
        $("#showMsg").text("");
    });

    $('#card').blur(function () {
        var idcard = $('#card').val();
        var idExp = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (idcard === '' || idExp.test(idcard) === false) {
            $('#showMsg').text('格式错误');
        } else {
            $.post('/checkcard', {
                idcardName: idcard
            }, function (data) {
                $('#showMsg').text('');
                $('#showMsg').text(data.msg);
            })
        }
    })
}

//插入学生数据
function InsertData() {
    $('#add-btn').click(function (event) {
        event.preventDefault();
        var studentCard = $('#card').val();
        var userName = $('#name').val();
        var userPwd = $('#pwd').val();
        var realName = $('#real').val();
        var liveNow = $('#live').val();
        document.getElementById('myform').reset();
        $.post('/addStudent', {
            card: studentCard,
            name: userName,
            password: userPwd,
            real: realName,
            live: liveNow
        }, function (data) {
            if (data.flag === 'no') {
                alert(data.msg);
                document.getElementById('myform').reset();
            } else {
                alert(data.msg);
                $('#listTable tr').remove();
                ReferData();
            }
        })
    })
}

//删除学生数据
function DeleteData() {
    $('.del-btn').click(function () {
        var stuCard = $(this).attr('cards');
        console.log(stuCard);
        if (confirm('确定要删除吗？')) {
            $.post('/delStudent', {
                idcard: stuCard
            }, function (data) {
                if (data.flag === 'yes') {
                    $('#listTable tr').remove();
                    ReferData();
                } else {
                    alert(data.msg);
                }
            })
        }
    })
}

//获得要修改的数据
function Updata() {
    $('.up-btn').click(function () {
        var oCheck = document.getElementById("check");
        if (oCheck.checked === true) {
            var stuMegs = $(this).attr('megs');
            var arr = stuMegs.split(',');
            $('#card').val(arr[0]);
            $('#name').val(arr[1]);
            $('#pwd').val(arr[2]);
            $('#real').val(arr[3]);
            $('#live').val(arr[4]);
        }

    })
}

//更新数据
function UpSuccess() {
    $('#relup-btn').click(function () {
        var studentCard = $('#card').val();
        var userName = $('#name').val();
        var userPwd = $('#pwd').val();
        var realName = $('#real').val();
        var liveNow = $('#live').val();
        $.post('/upStu', {
            card: studentCard,
            name: userName,
            password: userPwd,
            real: realName,
            live: liveNow
        }, function (data) {

            if (data.flag === 'no') {
                alert(data.msg);
            } else {
                alert(data.msg);
                $('#listTable tr').remove();
                ReferData();
            }
        })
    })
}