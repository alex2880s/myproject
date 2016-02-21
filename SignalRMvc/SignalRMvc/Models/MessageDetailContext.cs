using System;
using System.Collections.Generic;
using System.Web;
using System.Data.Entity;


namespace SignalRMvc.Models
{
    public class MessageDetailContext:DbContext
    {
        public DbSet<MessageDetail> MessageDetails { get; set; }

    }
}