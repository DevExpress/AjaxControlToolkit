#pragma warning disable 1591
using System.Xml.Serialization;

namespace AjaxControlToolkit.Bundling {

    [XmlRoot("ajaxControlToolkit")]
    public class Settings {
        [XmlElement("controlBundles", IsNullable = false)]
        public ControlBundleSection[] ControlBundleSections { get; set; }
    }

    public class ControlBundleSection {
        [XmlElement("controlBundle", IsNullable = false)]
        public ControlBundle[] ControlBundles { get; set; }
    }

    public class ControlBundle {
        [XmlAttribute("name")]
        public string Name { get; set; }

        [XmlElement("control", IsNullable = false)]
        public Control[] Controls { get; set; }
    }

    public class Control {
        [XmlAttribute("name")]
        public string Name { get; set; }

        [XmlAttribute("assembly")]
        public string Assembly { get; set; }
    }
}
#pragma warning restore 1591