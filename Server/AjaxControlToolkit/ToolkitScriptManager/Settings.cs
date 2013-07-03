using System.Xml.Serialization;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Setting node for AjaxControlToolkit config file
    /// </summary>
    [XmlRoot("Settings")]
    public class Settings
    {
        /// <summary>
        /// Style sheet theme
        /// </summary>
        [XmlAttribute]
        public string Theme { get; set; }

        /// <summary>
        /// If set to True then if there is not AjaxControlToolkit control specified on Controls
        /// then do not load all AjaxControlToolkit controls.
        /// </summary>
        [XmlAttribute]
        public bool NoneIfEmpty { get; set; }

        /// <summary>
        /// Registered controls
        /// </summary>
        [XmlElement("Control", IsNullable = false)]
        public SettingsControl[] Controls { get; set; }
    }

    /// <summary>
    /// Control node for AjaxControlToolkit config file
    /// </summary>
    public class SettingsControl
    {
        [XmlAttribute]
        public string Name { get; set; }

        [XmlAttribute]
        public string Assembly { get; set; }
    }
}
