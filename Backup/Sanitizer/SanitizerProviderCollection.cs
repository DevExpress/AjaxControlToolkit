using System;
using System.Configuration.Provider;

namespace AjaxControlToolkit.Sanitizer
{
    public class SanitizerProviderCollection : ProviderCollection
    {
        public override void Add(ProviderBase provider)
        {
            string providerTypeName;

            // make sure the provider supplied is not null
            if (provider == null)
                throw new ArgumentNullException("provider");

            if (provider as SanitizerProvider == null)
            {
                providerTypeName = typeof(SanitizerProvider).ToString();
                throw new ArgumentException("Provider must implement SanitizerProvider type", providerTypeName);
            }
            base.Add(provider);
        }


        new public SanitizerProvider this[string name]
        {
            get
            {
                return (SanitizerProvider)base[name];
            }
        }

    }
}
