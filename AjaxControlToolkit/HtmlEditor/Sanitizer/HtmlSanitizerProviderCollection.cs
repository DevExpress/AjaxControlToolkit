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

            if(provider as HtmlSanitizerProviderBase == null) {
                providerTypeName = typeof(HtmlSanitizerProviderBase).ToString();
                throw new ArgumentException("Provider must implement SanitizerProvider type", providerTypeName);
            }
            base.Add(provider);
        }


        new public HtmlSanitizerProviderBase this[string name] {
            get { return (HtmlSanitizerProviderBase)base[name]; }
        }
    }
}