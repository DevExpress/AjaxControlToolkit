using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public class HtmlSanitizerProviderSection : ConfigurationSection {
        readonly ConfigurationProperty defaultProvider = new ConfigurationProperty("defaultProvider", typeof(string), null);
        readonly ConfigurationProperty providers = new ConfigurationProperty("providers", typeof(ProviderSettingsCollection), null);
        ConfigurationPropertyCollection properties = new ConfigurationPropertyCollection();

        public HtmlSanitizerProviderSection() {
            properties.Add(providers);
            properties.Add(defaultProvider);
        }

        [ConfigurationProperty("defaultProvider")]
        public string DefaultProvider {
            get { return (string)base[defaultProvider]; }
            set { base[defaultProvider] = value; }
        }

        [ConfigurationProperty("providers")]
        public ProviderSettingsCollection Providers {
            get { return (ProviderSettingsCollection)base[providers]; }
        }

        protected override ConfigurationPropertyCollection Properties {
            get { return properties; }
        }
    }

}
