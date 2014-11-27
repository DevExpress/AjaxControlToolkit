using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Configuration;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public static class Provider {
        static Lazy<HtmlSanitizerProviderBase> _sanitizer;

        static Provider() {
            _sanitizer = new Lazy<HtmlSanitizerProviderBase>(() => {
                var sanitizerConfig = (HtmlSanitizerProviderSection)WebConfigurationManager.GetSection("system.web/sanitizer");

                if(sanitizerConfig == null)
                    return null;

                var providers = new HtmlSanitizerProviderCollection();

                // use the ProvidersHelper class to call Initialize on each configured provider
                ProvidersHelper.InstantiateProviders(sanitizerConfig.Providers, providers, typeof(HtmlSanitizerProviderBase));

                // set a reference to the default provider
                return providers[sanitizerConfig.DefaultProvider];
            });
        }

        public static HtmlSanitizerProviderBase Sanitizer {
            get { return _sanitizer.Value; }
        }
    }

}