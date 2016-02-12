#pragma warning disable 1591
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
        static ICollection<string> _builtinLocales;
        static IDictionary<string, LocaleScriptInfo> _customLocales = new Dictionary<string, LocaleScriptInfo>();
        static IDictionary<string, Func<string, ScriptReference>> _externalLocales = new Dictionary<string, Func<string, ScriptReference>>();

        static Localization() {
            PopulateKnownLocales();
        }

        public virtual ICollection<string> BuiltinLocales {
            get { return _builtinLocales; }
        }

        public static void AddLocale(string localeKey, string scriptName, Assembly scriptAssembly) {
            lock(_locker) {
                if(_customLocales == null)
                    _customLocales = new Dictionary<string, LocaleScriptInfo>();

                _customLocales[localeKey] = new LocaleScriptInfo(localeKey, scriptName, scriptAssembly);
            }
        }

        public static void AddExternalLocale(string localeKey, Func<string, ScriptReference> scriptReferenceProvider) {
            lock(_locker) {
                if(_externalLocales == null)
                    _externalLocales = new Dictionary<string, Func<string, ScriptReference>>();

                _externalLocales[localeKey] = scriptReferenceProvider;
            }
        }

        static Assembly ToolkitAssembly {
            get { return typeof(Localization).Assembly; }
        }

        static void PopulateKnownLocales() {
            lock(_locker) {
                if(_builtinLocales != null)
                    return;

                _builtinLocales = new HashSet<string>();

                foreach(var resource in ToolkitAssembly.GetManifestResourceNames()) {
                    var pattern = "^" + Regex.Escape(Constants.LocalizationScriptName) + @"\.(?<key>[\w-]+)\.debug\.js";
                    var match = Regex.Match(resource, pattern);
                    if(match.Success)
                        _builtinLocales.Add(match.Groups["key"].Value);
                }
            }
        }

        public IEnumerable<ScriptReference> GetLocalizationScriptReferences() {
            var localeKey = GetLocaleKey();

            var localeScriptInfos = GetAllLocaleScriptInfo()
                .Where(i => i.LocaleKey == "" || i.LocaleKey == localeKey);

            IEnumerable<ScriptReference> scriptReferences = null;

            if(_externalLocales.ContainsKey(localeKey)) {
                var externalScriptReference = _externalLocales[localeKey](localeKey);

                scriptReferences = localeScriptInfos
                    .Where(i => i.LocaleKey == "")
                    .Select(i => CreateScriptReference(i.LocaleKey, i.ScriptAsssembly))
                    .Concat(new List<ScriptReference>() { externalScriptReference });
            } else
                scriptReferences = localeScriptInfos.Select(i => CreateScriptReference(i.LocaleKey, i.ScriptAsssembly));

            foreach(var reference in scriptReferences)
                yield return reference;
        }

        public IEnumerable<EmbeddedScript> GetAllLocalizationEmbeddedScripts() {
            var scriptInfos = GetAllLocaleScriptInfo().Select(i => new EmbeddedScript(i.ScriptName, i.ScriptAsssembly));

            foreach(var info in scriptInfos)
                yield return info;
        }

        IEnumerable<LocaleScriptInfo> GetAllLocaleScriptInfo() {
            yield return new LocaleScriptInfo("", Constants.LocalizationScriptName, ToolkitAssembly);

            var returnedLocales = new HashSet<string>();

            foreach(var localeKey in _customLocales.Keys) {
                returnedLocales.Add(localeKey);
                yield return new LocaleScriptInfo(localeKey, GetCustomScriptName(localeKey), _customLocales[localeKey].ScriptAsssembly);
            }

            foreach(var localeKey in BuiltinLocales) {
                if(!returnedLocales.Contains(localeKey))
                    yield return new LocaleScriptInfo(localeKey, FormatScriptName(localeKey), ToolkitAssembly);
            }
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

        ScriptReference CreateScriptReference(string localeKey, Assembly scriptAssembly) {
            if(ToolkitAssembly == scriptAssembly)
                return new ScriptReference(FormatScriptName(localeKey) + Constants.JsPostfix, ToolkitAssembly.FullName);

            return new ScriptReference(GetCustomScriptName(localeKey) + GetScriptSuffix(), scriptAssembly.FullName);
        }

        private string GetScriptSuffix() {
            if(IsDebuggingEnabled())
                return ".js";

            return ".min.js";
        }

        public virtual bool IsDebuggingEnabled() {
            return HttpContext.Current.IsDebuggingEnabled;
        }

        static string GetCustomScriptName(string localeKey) {
            return _customLocales[localeKey].ScriptName;
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
            return BuiltinLocales.Concat(_customLocales.Keys).Concat(_externalLocales.Keys).Contains(culture) ? culture : null;
        }

        private string GetLanguage(string cultureName) {
            return cultureName.Split('-')[0];
        }

        private class LocaleScriptInfo {
            public string LocaleKey { get; private set; }
            public string ScriptName { get; private set; }
            public Assembly ScriptAsssembly { get; private set; }

            public LocaleScriptInfo(string localeKey, string scriptName, Assembly scriptAssembly) {
                LocaleKey = localeKey;
                ScriptName = scriptName;
                ScriptAsssembly = scriptAssembly;
            }
        }
    }

}

#pragma warning restore 1591