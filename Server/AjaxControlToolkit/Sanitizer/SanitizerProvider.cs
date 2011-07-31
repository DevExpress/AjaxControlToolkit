namespace AjaxControlToolkit.Sanitizer
{
    public abstract class SanitizerProvider : System.Configuration.Provider.ProviderBase
    {
        public abstract string ApplicationName { get; set; }

        public abstract bool RequiresFullTrust { get; }

        public abstract string GetSafeHtmlFragment(string htmlFragment);

    }
}
