using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using Microsoft.AspNet.SignalR;
using SignalRMvc.Models;

namespace SignalRMvc.Hubs
{
    public class ChatHub : Hub
    {
        static List<User> Users = new List<User>();
        MessageDetailContext ctx = new MessageDetailContext();

        // Отправка сообщений
        public void Send(string name, string message)
        {
            AddMessageinCache(name, message);
            Clients.All.addMessage(name, message);
           


        }

        // Подключение нового пользователя
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;


            if (Users.All(x => x.ConnectionId != id))
            {
                Users.Add(new User { ConnectionId = id, Name = userName });

                // Посылаем сообщение текущему пользователю
                Clients.Caller.onConnected(id, userName, Users, ctx.MessageDetails);

                // Посылаем сообщение всем пользователям, кроме текущего
                Clients.AllExcept(id).onNewUserConnected(id, userName);
            }
            SendMessage("Вошел новый пользователь " + userName+ " в " + DateTime.Now.Hour+" : "+DateTime.Now.Minute);
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
                SendMessage("Вышел пользователь " + item.Name +" " + DateTime.Now.Hour + " : " + DateTime.Now.Minute);
            }

            return base.OnDisconnected(stopCalled);
        }

        private void AddMessageinCache(string userName, string message)
        {
            
            ctx.MessageDetails.Add(new MessageDetail {UserName = userName, Message = message});
        
            ctx.SaveChanges();
            
        }

        private void SendMessage(string userName)
        {
            // Получаем контекст хаба
            var context =
                Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            // отправляем сообщение
            context.Clients.All.displayMessage(userName);
        }


    }
}
