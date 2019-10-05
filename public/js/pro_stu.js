//省-查询数据
function ReferData() {
    $.post('/pro_refstu', {
    }, function (data) {
        if (data.flag === 'yes') {
            for (var i = 0; i < data.msg.length; i++) {
                $('<tr><td>' + data.msg[i].ID_card + '</td> <td>' + data.msg[i].studentSchool +
                    '</td><td>' + data.msg[i].studentPwd + '</td><td>' + data.msg[i].realName +
                    '</td> <td>' + data.msg[i].live + '</td><td>' + data.msg[i].state +
                    '</td> <td> <input type="button" class="Check-btn" id="btn-danger" value="重审" cards="' + data.msg[i].ID_card + '" /><input type="button" value="通过" class="pass-btn" id="btn-info" cards="' + data.msg[i].ID_card + '" /></td></tr>'
                ).appendTo('#listTable');
            }
            //完成审核操作
            CheckFail();
            CheckSuccess()
            $("#showMsg").text("");
        } else {
            alert('查询失败');
        }
    })
}

//省-审核失败数据
function CheckFail() {
    $('.Check-btn').click(function () {
        var stuCard = $(this).attr('cards');
        console.log(stuCard);
        if (confirm('确定要重新审核吗？')) {
            $.post('/proupStu', {
                idcard: stuCard
            }, function (data) {
                if (data.flag === 'no') {
                    alert(data.msg);
                } else {
                    alert(data.msg);
                    $('#listTable tr').remove();
                    ReferData();
                }
            })
        }
    })
}

//省-审核通过数据
function CheckSuccess() {
    $('.pass-btn').click(function () {
        var stuCard = $(this).attr('cards');
        console.log(stuCard);
        $.post('/proPassStu', {
            idcard: stuCard
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