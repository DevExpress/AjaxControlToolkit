using System;
using System.Collections.Generic;
using System.Configuration.Provider;
using System.Linq;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public class HtmlSanitizerProviderCollection : ProviderCollection {

        public override void Add(ProviderBase provider) {
            string providerTypeName;

            // make sure the provider supplied is not null
            if(provider == null)
                throw new ArgumentNullException("provider");

            if(provider as HtmlSanitizerProvider == null) {
                providerTypeName = typeof(HtmlSanitizerProvider).ToString();
                throw new ArgumentException("Provider must implement SanitizerProvider type", providerTypeName);
            }
            base.Add(provider);
        }


        new public HtmlSanitizerProvider this[string name] {
            get { return (HtmlSanitizerProvider)base[name]; }
        }
    }
}