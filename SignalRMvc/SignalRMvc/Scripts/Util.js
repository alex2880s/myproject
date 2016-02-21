$(function () {
    
    $('#chatBody').hide();
    $('#loginBlock').show();
    $('#canvasBlock').hide();
    // Ссылка на автоматически-сгенерированный прокси хаба
    var chat = $.connection.chatHub;
    // Объявление функции, которая хаб вызывает при получении сообщений
    chat.client.addMessage = function (name, message) {
        // Добавление сообщений на веб-страницу 
        //$('#chatroom').append('<p><b>' + htmlEncode(name)
        //    + '</b>: ' + htmlEncode(message) + '</p>');
        $('#chatroom').append('<p class="item"><b>' + htmlEncode(name)
            + '</b>: ' + htmlEncode(message) + '</p>');
       
        $('#chatroom').find('p').first().remove();
        $('#chatroom .item:odd').css("background-color", "#e8e8ec");;
        $('#chatroom .item:even').css("background-color", "white");

    };


    // Функция, вызываемая при подключении нового пользователя
    chat.client.onConnected = function (id, userName, allUsers, messages) {
        $('#canvasBlock').show();
        $('#loginBlock').hide();
        $('#chatBody').show();
        // установка в скрытых полях имени и id текущего пользователя
        $('#hdId').val(id);
        $('#username').val(userName);
        $('#header').html('<p><b>Вы вошли под логином: ' + userName + '</b></p>');

        // Добавление всех пользователей
        for (i = 0; i < allUsers.length; i++) {

            AddUser(allUsers[i].ConnectionId, allUsers[i].Name);
        }
        for (i = messages.length-10; i < messages.length; i++) {
            $('#chatroom').append('<p  class="item"><b>' + htmlEncode(messages[i].UserName)
           + '</b>: ' + htmlEncode(messages[i].Message) + '</p>');
            $('#chatroom .item:odd').css("background-color", "#e8e8ec");
            $('#chatroom .item:even').css("background-color", "white");
        }


    }

    // Добавляем нового пользователя
    chat.client.onNewUserConnected = function (id, name) {


        $('#chatroom').append('<p class="newUser "> <b>Пользователь ' + htmlEncode(name)
            + ' вошел в чат</b> </p>');
        $('#chatroom .newUser').css("color", "#c93d19");
        $('#chatroom').find('p').first().remove();
        AddUser(id, name);

    }

    // Удаляем пользователя
    chat.client.onUserDisconnected = function (id, userName) {

        $('#' + id).remove();
        $('#chatroom').append('<p class="oldUser "> <b>Пользователь ' + htmlEncode(userName)
           + ' покинул чат</b> </p>');
        $('#chatroom .old').css("color", "#0f0f4f");
        $('#chatroom').find('p').first().remove();
    }

    // Открываем соединение
    $.connection.hub.start().done(function () {

        $('#sendmessage').click(function () {
            // Вызываем у хаба метод Send
            chat.server.send($('#username').val(), $('#message').val());
            $('#message').val('');
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
    var encodedValue = $('<div />').text(value).html();
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