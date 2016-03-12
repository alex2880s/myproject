using System;
using System.Collections.Generic;
using System.Web;
using System.Data.Entity;
using SignalRMvc.Models;


namespace SignalRMvc.Models
{
    public class MessageDetailContext : DbContext
    {
        public MessageDetailContext() : base("MessageDetailContext")
        { }
        public DbSet<MessageDetails> MessageDetails { get; set; }


    }

    interface IRepository<T> : IDisposable
        where T : class
    {
        IEnumerable<T> GetMessageList(); // получение всех объектов
        T GetMessage(int id); // получение одного объекта по id
        void Create(T item); // создание объекта
        void Delete(int id); // удаление объекта по id
        void Save();  // сохранение изменений
    }

    public class SqlMessageRepository : IRepository<MessageDetails>
    {
        private MessageDetailContext db;

        public SqlMessageRepository()
        {
            this.db = new MessageDetailContext();
        }

        public IEnumerable<MessageDetails> GetMessageList()
        {
            return db.MessageDetails; 
        }
  

        public MessageDetails GetMessage(int id)
        {
            return db.MessageDetails.Find(id);
            
        }

        public void Create(MessageDetails message)
        {
            db.MessageDetails.Add(message);
        }


        public void Delete(int id)
        {
            MessageDetails message = db.MessageDetails.Find(id);
            if (message != null)
                db.MessageDetails.Remove(message);
        }

        public void Save()
        {
            db.SaveChanges();
        }

        private bool disposed = false;

        public virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    db.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}