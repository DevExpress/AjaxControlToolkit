#pragma warning disable 1591
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace AjaxControlToolkit {

    public static class ToolkitConfig {
        static Lazy<AjaxControlToolkitConfigSection> _configSection = new Lazy<AjaxControlToolkitConfigSection>(GetSection, true);
        static AjaxControlToolkitConfigSection GetSection() {
            var configSection = (AjaxControlToolkitConfigSection)WebConfigurationManager.GetSection("ajaxControlToolkit");

            if(configSection == null)
                return new AjaxControlToolkitConfigSection();

            return configSection;
        }

        static AjaxControlToolkitConfigSection ConfigSection {
            get { return _configSection.Value; }
        }

        public static bool UseStaticResources {
            get { return ConfigSection.UseStaticResources; }
        }

        public static bool RenderStyleLinks {
            get { return ConfigSection.RenderStyleLinks; }
        }

        public static string HtmlSanitizer {
            get { return ConfigSection.HtmlSanitizer; }
        }

        public static string TempFolder {
            get { return ConfigSection.TempFolder; }
        }

        public static IEnumerable<Type> CustomControls {
            get {
                foreach(var control in ConfigSection.CustomControls)
                    yield return Type.GetType(((CustomControlElement)control).Type);
            }
        }
    }

}
#pragma warning restore 1591