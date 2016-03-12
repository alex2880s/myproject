$(function () {
    
    $('#chatBody').hide();
    $('#loginBlock').show();
    $('#canvasBlock').hide();
    // Ссылка на автоматически-сгенерированный прокси хаба
    var chat = $.connection.chatHub;
    // Объявление функции, которая хаб вызывает при получении сообщений
    chat.client.addMessage = function (name, message, id) {
        // Добавление сообщений на веб-страницу
        $('#chatroom').append('<div class="item" ><b>' + htmlEncode(name)
               + '</b> : ' + '<b>' + moment().calendar() + '</b> ' + $('<b/>').html(htmlEncode(message)).text() + '</b>');
        $('#chatroom').find('div').first().remove();
        $('#chatroom .item:even').css("background-color", "#e8e8ec");;
        $('#chatroom .item:odd').css("background-color", "white");
        $('#chatroom .item:even').css("color", "black");;
        $('#chatroom .item:odd').css("color", "black");

        $("#sendmessage").focus();

        //прокрута вниз при получении сообщения
        var div = $("#chatroom");
        div.scrollTop(div.prop('scrollHeight'));

        if (id != $('#hdId').val())
        {
            //установка мерцания на повторы
            var timerId = setInterval(function () {
                blink($('#chatroom').find('div').last());
            }, 800);

            // через 2 сек остановить повторы
            setTimeout(function () {
                clearInterval(timerId);
                blink_stop($('#chatroom').find('div').last());
            }, 3000);
            //Звук при получении сообщения
            var audio = $("#message_in")[0];
            audio.play();
        }

    };
        
 
    
    // Функция, вызываемая при подключении нового пользователя
    chat.client.onConnected = function (id, userName, allUsers, messages) {
        $('#canvasBlock').show();
        $('#loginBlock').hide();
        $('#chatBody').show();
        // установка в скрытых полях имени и id текущего пользователя
        $('#hdId').val(id);
        $('#username').val(userName);
        $('#header').html('<p><b>Вы вошли под логином: ' + '<b style="color:#c93d19">' + userName + '</b>' + '</b></p>');
       
        // Добавление всех пользователей
        for (i = 0; i < allUsers.length; i++) {

            AddUser(allUsers[i].ConnectionId, allUsers[i].Name);
        }


        for (i = messages.length - 7; i < messages.length; i++) {
          
            
            $('#chatroom').append('<div class="item"><b>' + htmlEncode(messages[i].UserName) + '</b> в ' + '<b>' + moment().calendar(htmlEncode(messages[i].Time))  + '</b> ' + $('<b/>').html(htmlEncode(messages[i].Message)).text() + '</b>');
    
            $('#chatroom .item:odd').css("background-color", "#e8e8ec");
            $('#chatroom .item:even').css("background-color", "white");
        }


    }

    // Добавляем нового пользователя
    chat.client.onNewUserConnected = function (id, name) {

        //Звук при входе
        var audio = $("#user_in")[0];
        audio.play();
        $('#chatroom').append('<p class="newUser "> <b>Пользователь ' + htmlEncode(name)
            + ' вошел в чат</b> </p>');
        $('#chatroom .newUser').css("color", "#c93d19");
        $('#chatroom').find('p').first().remove();
        AddUser(id, name);

    }
   
    // Удаляем пользователя
    chat.client.onUserDisconnected = function (id, userName) {
        //Звук при выходе
        var audio = $("#user_out")[0];
        audio.play();
        $('#' + id).remove();
        $('#chatroom').append('<p class="oldUser "> <b>Пользователь ' + htmlEncode(userName)
           + ' покинул чат в '+moment().format('LT')+'</b>'+'</p>');
        $('#chatroom .old').css("color", "#0f0f4f");
        $('#chatroom').find('p').first().remove();
    }

    // Открываем соединение
    $.connection.hub.start().done(function () {
      
        $('#sendmessage').click(function () {
            // Вызываем у хаба метод 
          
            chat.server.send($('#username').val(), tinymce.activeEditor.getContent());
            tinymce.activeEditor.setContent("")
           
           
          
        });

        // обработка логина
        $("#btnLogin").click(function () {

            var name = $("#txtUserName").val();
            if (name.length > 0) {
                chat.server.connect(name);
            }
            else {
                alert("Введите имя");
            }
        });
    });

   
});



// Кодирование тегов
function htmlEncode(value) {
    var encodedValue = $('<b />').text(value).html();
    return encodedValue;
}
//Добавление нового пользователя
function AddUser(id, name) {

    var userId = $('#hdId').val();

    if (userId != id) {

        $("#chatusers").append('<p id="' + id + '"><b>' + '<span class="glyphicon glyphicon-user">' + '</span>' + name + '</b></p>');
    }
}




//////push

$(function () {

    var notificationhub = $.connection.notificationHub;

    notificationhub.client.displayMessage = function (message) {

        $('#notification').html(message);
    };

    $.connection.hub.start();

});
///мерцание последнего элемента
function blink(selector) {
    $(selector).css("background-color", "#c93d19")
    $(selector).css("color", "white")
    $(selector).fadeOut(600)
    $(selector).fadeIn(600)
     
    }; 

function blink_stop(selector) {
   
    $(selector).fadeIn()
   
    $('#chatroom .item:even').css("background-color", "#e8e8ec");;
    $('#chatroom .item:odd').css("background-color", "white");
    $('#chatroom .item:even').css("color", "black");;
    $('#chatroom .item:odd').css("color", "black");
}

