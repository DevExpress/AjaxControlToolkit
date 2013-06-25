using System.Xml.Serialization;

namespace AjaxControlToolkit
{
    [XmlRoot("Settings")]
    public class Settings
    {
        [XmlAttribute]
        public string Theme { get; set; }

        [XmlElement("Control")]
        public string[] Controls { get; set; }
    }
}
