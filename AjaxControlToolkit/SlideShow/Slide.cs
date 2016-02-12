#pragma warning disable 1591
using System;

namespace AjaxControlToolkit {

    public class Slide {
        string _imagePath;
        string _name;
        string _description;
        string _url;

        public Slide()
            : this(null, null, null) { }

        public Slide(string imagePath, string name, string description) {
            _imagePath = imagePath;
            _name = name;
            _description = description;
        }

        public Slide(string imagePath, string name, string description, string url) {
            _imagePath = imagePath;
            _name = name;
            _description = description;
            _url = url;
        }

        public string ImagePath {
            get { return _imagePath; }
            set { _imagePath = value; }
        }

        public string Name {
            get { return _name; }
            set { _name = value; }
        }

        public string Description {
            get { return _description; }
            set { _description = value; }
        }

        public string Url {
            get { return _url; }
            set { _url = value; }
        }
    }

}
#pragma warning restore 1591