

using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Class to represent the slide object.
    /// </summary>
    [Serializable]
    public class Slide
    {
        private string imagePath;
        private string name;
        private string description;
        private string url;

        /// <summary>
        /// Default constructor
        /// </summary>
        public Slide() : this(null, null, null)
        { }


        /// <summary>
        /// Slide constructor with params
        /// </summary>
        /// <param name="imagePath"></param>
        /// <param name="name"></param>
        /// <param name="description"></param>
        public Slide(string imagePath, string name, string description)
        {
            this.imagePath = imagePath;
            this.name = name;
            this.description = description;            
        }
        
        /// <summary>
        /// Slide constructor with params
        /// </summary>
        /// <param name="imagePath"></param>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <param name="url"></param>
        public Slide(string imagePath, string name, string description, string url)
        {
            this.imagePath = imagePath;
            this.name = name;
            this.description = description;
            this.url = url;
        }

        /// <summary>
        /// image source path/url
        /// </summary>
        public string ImagePath
        {
            get { return this.imagePath; }
            set { this.imagePath = value; }
        }

        /// <summary>
        /// image name
        /// </summary>
        public string Name
        {
            get { return this.name; }
            set { this.name = value; }
        }

        /// <summary>
        /// image description
        /// </summary>
        public string Description
        {
            get { return this.description; }
            set { this.description = value; }
        }

        /// <summary>
        /// image Url
        /// </summary>
        public string Url
        {
            get { return this.url; }
            set { this.url = value; }
        }
    }
}
