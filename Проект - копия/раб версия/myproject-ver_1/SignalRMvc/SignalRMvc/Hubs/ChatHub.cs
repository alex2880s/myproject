﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using Microsoft.AspNet.SignalR;
using SignalRMvc.Models;

namespace SignalRMvc.Hubs
{
    public class ChatHub: Hub
    {
        string formatTime = "HH:mm";
        static List<User> Users = new List<User>();
        SqlMessageRepository messageRepository=new SqlMessageRepository();

        // Отправка сообщений
        public void Send(string name, string message)
        {
            var id = Context.ConnectionId;
            AddMessageinCache(name, message);
            Clients.All.addMessage(name, message,id);
           
        }

        // Подключение нового пользователя
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;
           

            if (Users.All(x => x.ConnectionId != id))
            {
                Users.Add(new User { ConnectionId = id, Name = userName });


                // Посылаем сообщение текущему пользователю
                Clients.Caller.onConnected(id, userName, Users, messageRepository.GetMessageList());
              
                // Посылаем сообщение всем пользователям, кроме текущего
                Clients.AllExcept(id).onNewUserConnected(id, userName);
            }
            SendMessage("Вошел новый пользователь " + userName+ " в " + DateTime.Now.ToString(formatTime));
        }



        // Отключение пользователя
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = Users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                Users.Remove(item);
                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item.Name);
            
                SendMessage("Вышел пользователь " + item.Name +" " + DateTime.Now.ToString(formatTime));
            }

            return base.OnDisconnected(stopCalled);
        }

        private void AddMessageinCache(string userName, string message)
        {
           

            
            messageRepository.Create(new MessageDetails {UserName = userName, Message = message, Time=DateTime.Now});
        
           messageRepository.Save();
            
        }

        private void SendMessage(string userName)
        {
            var id = Context.ConnectionId;
            // Получаем контекст хаба
            var context =
                Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            // отправляем сообщение
            context.Clients.AllExcept(id).displayMessage(userName);
        }


    }
}
