using System;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;
using System.Web.Configuration;

namespace AjaxControlToolkit.Sanitizer {
    class Sanitizer {
        private static bool _initialized;
        private static SanitizerProviderCollection _providers;
        private static SanitizerProvider _provider;
        private static void Initialize() {

            // don't initialize providers more than once
            if (_initialized) {
                return;
            }

            // get the configuration section for the feature
            var sanitizerConfig = (ProviderSanitizerSection)WebConfigurationManager.GetSection("system.web/sanitizer");

            if (sanitizerConfig != null) {
                _providers = new SanitizerProviderCollection();

                // use the ProvidersHelper class to call Initialize on each 
                // configured provider
                ProvidersHelper.InstantiateProviders(sanitizerConfig.Providers, _providers, typeof(SanitizerProvider));
                
                // set a reference to the default provider
                _provider = _providers[sanitizerConfig.DefaultProvider];
            }

            // set this feature as initialized
            _initialized = true;

        }

        public static SanitizerProvider GetProvider() {
            Sanitizer.Initialize();
            return _provider;
        }

        //public static string GetSafeHtmlFragment(string htmlFragment) {
        //    Sanitizer.Initialize();
        //    if (_provider != null) {
        //        htmlFragment = _provider.GetSafeHtmlFragment(htmlFragment);
        //    }
        //    return htmlFragment;
        //}
    }
}
