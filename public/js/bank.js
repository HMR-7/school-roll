//专业库添加权限开关
function into() {
    var oCheck = document.getElementById("check");
    if (oCheck.checked == true) {
        var oDiv = document.getElementById("Addform");
        oDiv.style.display = "block";
    } else {
        var oDiv = document.getElementById("Addform");
        oDiv.style.display = "none";
    }
}

//发送请求
$(function () {
    ReferData();
    InsertData();
    CheckData();
})
//查询操作
function ReferData() {
    //第一个参数：表示请求的地址
    //第二个参数：发给服务器的数据（给第一个参数传递的数据，如果不传递可以只写一个空的大括号
    //第三个参数：表示服务器处理后，将结果返回，这是自动调用该函同时该函数中的参数data中返回的數據
    $.post('/bank', {}, function (data) {
        if (data.flag === 'yes') {
            //将数据填充到tbody标签，该标签中显示的tr
            for (var i = 0; i < data.msg.length; i++) {
                $('<tr> <td>' + data.msg[i].id + '</td> <td>' + data.msg[i].bank_name +
                    '</td></tr>').appendTo('#listTable');
            }
        } else {
            alert('查询失败');
        }
    })
}
//专业查重
function CheckData() {
    $('#name').blur(function () {
        var major = $('#name').val();
        if (major === '') {
            $('#showMsg').text('专业名称不能为空!')
        } else {
            $.post('/checkName', {
                majorName: major
            }, function (data) {
                $('#showMsg').text('');
                $('#showMsg').text(data.msg);
            })
        }
    })
}

//插入数据
function InsertData() {
    $('#btn-success').click(function (event) {
        //解决重定向
        event.preventDefault();
        var bankName = $('#name').val();
        document.getElementById("myform").reset();
        $.post('/selBank', {
            name: bankName
        },
            function (data) {
                if (data.flag === 'no') {
                    alert("插入失败");
                } else {
                    $('#showMsg').text('');
                    $('#listTable tr').remove();
                    ReferData();
                }
            })
    })
}