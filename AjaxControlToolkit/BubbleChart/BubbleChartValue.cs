#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    public class BubbleChartValue {
        string _category = String.Empty;
        decimal _x;
        decimal _y;
        decimal _data;
        string _bubbleColor = String.Empty;

        public string Category {
            get { return _category; }
            set { _category = value; }
        }

        public decimal X {
            get { return _x; }
            set { _x = value; }
        }

        public decimal Y {
            get { return _y; }
            set { _y = value; }
        }

        public decimal Data {
            get { return _data; }
            set { _data = value; }
        }

        public string BubbleColor {
            get { return _bubbleColor; }
            set { _bubbleColor = value; }
        }
    }

}

#pragma warning restore 1591