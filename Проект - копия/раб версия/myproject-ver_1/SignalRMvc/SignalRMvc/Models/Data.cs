using System;
using Newtonsoft.Json;

namespace SignalRDraw.Models
{
    public class Dataline
    {
        [JsonProperty("startX")]
        public int StartX { get; set; }
        [JsonProperty("startY")]
        public int StartY { get; set; }
        [JsonProperty("endX")]
        public int EndX { get; set; }
        [JsonProperty("endY")]
        public int EndY { get; set; }
        [JsonProperty("color")]
        public string Color { get; set; }
        [JsonProperty("mode")]
        public string Mode { get; set; }
        [JsonProperty("drawuser")]
        public string DrawUser { get; set; }


    }
   

}