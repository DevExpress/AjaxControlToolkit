using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    public class TwitterStatus {

        public DateTime CreatedAt { get; set; }

        public string Text { get; set; }


        public TwitterUser User { get; set; }


    }
}
