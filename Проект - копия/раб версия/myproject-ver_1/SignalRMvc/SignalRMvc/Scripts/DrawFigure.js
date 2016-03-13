$(document).ready(function () {
    
    var mode = 0;
    var color;

 


    $(function () {
        $("#colorcanvas").colorpicker();
        
    });
 

    $("#line").click(function () {
        mode = 1;
        
    });
    $("#square").click(function () {
        mode = 2;

    });
    $("#btnclear").click(function () {
        mode = 0;
        var canvas = document.getElementById('drawingpad');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
    });



    $(function() {
       
        var drawGame = {
            // указывает, происходит ли отрисовка
            isDrawing: false,
            // начальная точка следующей линии
            startX: 0,
            startY: 0,
        };
        // модель линий
        var dataline = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            color:0,
            mode: 0,
            drawuser: $('#username').val(),
         
        };
    

      


        // контекст элемента canvas
        var canvas = document.getElementById('drawingpad');
        var ctx = canvas.getContext('2d');

        // Ссылка на автоматически-сгенерированный прокси хаба
        var chat = $.connection.drawHub;
        // Объявление функции, которая хаб вызывает при получении сообщений
        chat.client.addLine = function (dataline) {
            
            if (dataline.mode == 1) {
                drawLine(ctx, dataline.startX, dataline.startY, dataline.endX, dataline.endY, 1, dataline.color);
               
            }
             if (dataline.mode == 2) { drawSquare(ctx, dataline.startX, dataline.startY, dataline.endX, dataline.endY, dataline.color);   }

            // подпись рисующего
             DrawUser(dataline.drawuser)
             
         }
       
        // Открываем соединение
        $.connection.hub.start().done(function () {
            
            // после открытия соединения устанавливаем обработчики мыши
            canvas.addEventListener("mousedown", mousedown, false);
            canvas.addEventListener("mousemove", mousemove, false);
            canvas.addEventListener("mouseup", mouseup, false);
        });


       function DrawUser (drawuser) {
           $("#drawuser").text("Рисует пользователь "+drawuser+"...")
           $("#" + drawuser).animate({ opacity: "0" }, 400);
           $("#" + drawuser).stop().animate({ opacity: "1" }, 500);
           $("#drawuser").animate({ opacity: "1" }, 400);
           $("#drawuser").stop().animate({ opacity: "0" }, 500);
        };






        // просто рисуем линию
        function drawLine(ctx, x1, y1, x2, y2, thickness, color) {
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        function drawSquare(ctx, x1, y1, x2, y2, color) {
            ctx.beginPath();
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            ctx.fillStyle = color;
            ctx.stroke();
        }



        // нажите мыши
        function mousedown(e) {
          
            // получаем позиции x и y относительно верхнего левого угла элемента canvas
            var mouseX = e.layerX || 0;
            var mouseY = e.layerY || 0;
            drawGame.startX = mouseX;
            drawGame.startY = mouseY;
            drawGame.isDrawing = true;
        };

        // перемещение мыши
        function mousemove(e) {
           
            // рисуем линию, если isdrawing==true
            if (drawGame.isDrawing) {

                // получаем позиции x и y относительно верхнего левого угла элемента canvas
                var mouseX = e.layerX || 0;
                var mouseY = e.layerY || 0;
                if (!(mouseX == drawGame.startX &&
                    mouseY == drawGame.startY)) {
                    if (mode == 1) {
                        color = $("#colormeaning").val();
                        drawLine(ctx, drawGame.startX,
                            drawGame.startY, mouseX, mouseY, 1, color);

                        dataline.startX = drawGame.startX;
                        dataline.startY = drawGame.startY;
                        dataline.endX = mouseX;
                        dataline.endY = mouseY;
                        dataline.color =color;
                        dataline.mode = mode;
                    
                        dataline.drawuser = $('#username').val();
                        chat.server.send(dataline);
                        drawGame.startX = mouseX;
                        drawGame.startY = mouseY;
                    }

                  

                }
            }
        };

        function mouseup(e) {
            //if (mode != 0) { alert($('#username').val() )}
            var mouseX = e.layerX || 0;
            var mouseY = e.layerY || 0;
            drawGame.isDrawing = false;
            if (mode == 2) {
                color = $("#colormeaning").val();
                drawSquare(ctx, drawGame.startX,
                    drawGame.startY, mouseX, mouseY, color);


                dataline.startX = drawGame.startX;
                dataline.startY = drawGame.startY;
                dataline.endX = mouseX;
                dataline.endY = mouseY;
                dataline.color = color;
                dataline.mode = mode;
                chat.server.send(dataline);
                drawGame.startX = mouseX;
                drawGame.startY = mouseY;

            }
        }
    });
///////////


});