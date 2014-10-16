using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit {

    public class Localization {
        static readonly object _locker = new object();
        static ICollection<string> _knownLocales;

        static Localization() {
            PopulateKnownLocales();
        }

        public virtual ICollection<string> KnownLocales {
            get { return _knownLocales; }
        }

        static Assembly Assembly {
            get { return typeof(Localization).Assembly; }
        }

        static void PopulateKnownLocales() {
            lock(_locker) {
                if(_knownLocales != null)
                    return;

                _knownLocales = new HashSet<string>();

                foreach(var resource in Assembly.GetManifestResourceNames()) {
                    var pattern = "^" + Regex.Escape(Constants.LocalizationScriptName) + @"\.(?<key>[\w-]+)\.debug\.js";
                    var match = Regex.Match(resource, pattern);
                    if(match.Success)
                        _knownLocales.Add(match.Groups["key"].Value);
                }
            }
        }

        public IEnumerable<ScriptReference> GetLocalizationScriptReferences() {
            yield return CreateScriptReference("");

            var localeKey = new Localization().GetLocaleKey();
            if(!String.IsNullOrEmpty(localeKey))
                yield return CreateScriptReference(localeKey);
        }

        public IEnumerable<string> GetAllLocalizationScripts() {
            yield return FormatScriptName("");

            foreach(var locale in KnownLocales)
                yield return FormatScriptName(locale);
        }

        public string GetLocaleKey() {
            return IsLocalizationEnabled() ? DetermineLocale() : "";
        }

        public virtual bool IsLocalizationEnabled() {
            var page = HttpContext.Current.Handler as Page;
            if(page == null)
                return true;

            var scriptManager = ScriptManager.GetCurrent(page);
            if(scriptManager == null)
                return true;
            // for backward compatibility: to give ability to disable localization via ScriptManager
            return scriptManager.EnableScriptLocalization;
        }

        static ScriptReference CreateScriptReference(string localeKey) {
            return new ScriptReference(FormatScriptName(localeKey) + Constants.JsPostfix, Assembly.FullName);
        }

        static string FormatScriptName(string localeKey) {
            if(String.IsNullOrEmpty(localeKey))
                return Constants.LocalizationScriptName;

            return Constants.LocalizationScriptName + "." + localeKey;
        }

        string DetermineLocale() {
            var culture = CultureInfo.CurrentUICulture.Name;

            return GetLocale(culture) ?? GetLocale(GetLanguage(culture)) ?? String.Empty;
        }

        private string GetLocale(string culture) {
            return KnownLocales.Contains(culture) ? culture : null;
        }

        private string GetLanguage(string cultureName) {
            return cultureName.Split('-')[0];
        }
    }

}
