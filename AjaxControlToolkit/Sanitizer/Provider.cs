using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Configuration;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public static class Provider {
        static Lazy<HtmlSanitizerProvider> _sanitizer;

        static Provider() {
            _sanitizer = new Lazy<HtmlSanitizerProvider>(() => {
                var sanitizerConfig = (HtmlSanitizerProviderSection)WebConfigurationManager.GetSection("system.web/sanitizer");

                if(sanitizerConfig == null)
                    return null;

                var providers = new HtmlSanitizerProviderCollection();

                // use the ProvidersHelper class to call Initialize on each configured provider
                ProvidersHelper.InstantiateProviders(sanitizerConfig.Providers, providers, typeof(HtmlSanitizerProvider));

                // set a reference to the default provider
                return providers[sanitizerConfig.DefaultProvider];
            });
        }

        public static HtmlSanitizerProvider Sanitizer {
            get { return _sanitizer.Value; }
        }
    }

}