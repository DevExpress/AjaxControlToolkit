using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace AjaxControlToolkit {

    public class AjaxControlToolkitConfigSection : ConfigurationSection {
        static Lazy<AjaxControlToolkitConfigSection> _configSection = new Lazy<AjaxControlToolkitConfigSection>(GetSection, true);

        static AjaxControlToolkitConfigSection GetSection() {
            var ajaxControlToolkitConfig = (AjaxControlToolkitConfigSection)WebConfigurationManager.GetSection("ajaxControlToolkit");

            if(ajaxControlToolkitConfig == null)
                return new AjaxControlToolkitConfigSection();

            return ajaxControlToolkitConfig;
        }

        public static AjaxControlToolkitConfigSection Current {
            get { return _configSection.Value; }
        }

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
    }
}