using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;

namespace AjaxControlToolkit {

    public class AjaxControlToolkitConfigSection : ConfigurationSection {

        [ConfigurationProperty("useStaticResources", DefaultValue = false)]
        public bool UseStaticResources {
            get { return (bool)base["useStaticResources"]; }
            set { base["useStaticResources"] = value; }
        }

        [ConfigurationProperty("renderStyleLinks", DefaultValue = true)]
        public bool RenderStyleLinks {
            get { return (bool)base["renderStyleLinks"]; }
            set { base["renderStyleLinks"] = value; }
        }

        [ConfigurationProperty("htmlSanitizer")]
        public string HtmlSanitizer {
            get { return (string)base["htmlSanitizer"]; }
            set { base["htmlSanitizer"] = value; }
        }

        [ConfigurationProperty("tempFolder", IsRequired = false)]
        public string TempFolder {
            get { return (string)base["tempFolder"]; }
            set { base["tempFolder"] = value; }
        }

        [ConfigurationProperty("additionalUploadFileExtensions", IsRequired = false)]
        public string AdditionalUploadFileExtensions {
            get { return (string)base["additionalUploadFileExtensions"]; }
            set { base["additionalUploadFileExtensions"] = value; }
        }

        [ConfigurationProperty("useBufferlessInputStream", DefaultValue = true, IsRequired = false)]
        public bool UseBufferlessInputStream {
            get { return (bool)base["useBufferlessInputStream"]; }
            set { base["useBufferlessInputStream"] = value; }
        }

        [ConfigurationProperty("customControls", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(CustomControlsCollection))]
        public CustomControlsCollection CustomControls {
            get { return (CustomControlsCollection)base["customControls"]; }
        }
    }
}
