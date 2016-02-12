#pragma warning disable 1591
using System;

namespace AjaxControlToolkit {

    public class TwitterStatus {

        public DateTime CreatedAt { get; set; }

        public string Text { get; set; }

        public TwitterUser User { get; set; }
    }

}

#pragma warning restore 1591