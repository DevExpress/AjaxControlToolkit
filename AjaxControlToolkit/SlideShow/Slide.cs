using System;

namespace AjaxControlToolkit {

    public class Slide {
        private string imagePath;
        private string name;
        private string description;
        private string url;

        public Slide()
            : this(null, null, null) { }

        public Slide(string imagePath, string name, string description) {
            this.imagePath = imagePath;
            this.name = name;
            this.description = description;
        }

        public Slide(string imagePath, string name, string description, string url) {
            this.imagePath = imagePath;
            this.name = name;
            this.description = description;
            this.url = url;
        }

        public string ImagePath {
            get { return this.imagePath; }
            set { this.imagePath = value; }
        }

        public string Name {
            get { return this.name; }
            set { this.name = value; }
        }

        public string Description {
            get { return this.description; }
            set { this.description = value; }
        }

        public string Url {
            get { return this.url; }
            set { this.url = value; }
        }
    }

}