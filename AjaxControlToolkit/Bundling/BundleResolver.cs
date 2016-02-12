#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml.Serialization;

namespace AjaxControlToolkit.Bundling {

    public class BundleResolver {
        public const string ConfigFileVirtualPath = "AjaxControlToolkit.config";
        const string ConfigCacheKey = "e3e5a62a67434f0aa62901759726f470";

        // TODO justify necessity: caching text file content is not that useful
        readonly ICache _cache;

        // TODO check thread safety
        static readonly Dictionary<string, Assembly> LoadedAssemblies = new Dictionary<string, Assembly>();

        public BundleResolver(ICache cache) {
            this._cache = cache;
        }

        /// Get all types of controls referenced by control bundle names. 
        /// If control bundle names is empty then default control bundle defined in AjaxControlToolkit.config will be use to retrieved control types.
        /// If AjaxControlToolkit.config file is not found then all standard control types of AjaxControlToolkit will be retrieved and if control bundle names is defined exception will thrown.
        public virtual List<Type> GetControlTypesInBundles(string[] bundles, string fileName) {
            // TODO reduce complexity

            var registeredControls = new List<Type>();
            var registeredBundles = new List<string>();
            //var fileName = Path.Combine(HttpRuntime.AppDomainAppPath, ConfigFileVirtualPath);

            if(!File.Exists(fileName)) {

                // No configuration config (AjaxControlToolkit.config) is specified

                // Bundle names specified, but AjaxControlToolkit.config is not provided then exception should be thrown
                if(bundles != null && bundles.Length > 0)
                    throw new Exception("Can not resolve requested control bundle since " + ConfigFileVirtualPath +
                                        " file is not defined.");
                                                
                // Load all AjaxControlToolkit controls if there is no bundle specified neither the config file
                registeredControls.AddRange(ControlDependencyMap.Maps.SelectMany(m => m.Value.Dependecies));
            } else {

                var actConfig = ParseConfiguration(ReadConfiguration(fileName));

                if(actConfig.ControlBundleSections != null && actConfig.ControlBundleSections.Length > 0) {
                    // Iterate all control bundle sections. Normaly, there will be only 1 section.
                    foreach(var bundle in actConfig.ControlBundleSections) {

                        if(bundle != null && bundle.ControlBundles != null && bundle.ControlBundles.Length > 0) {
                            // Iterate all control bundles in a section.
                            foreach(var controlBundle in bundle.ControlBundles) {

                                // Only add control types if ... 
                                if(

                                    // ... bundle contains control(s) and ...
                                    (controlBundle.Controls != null && controlBundle.Controls.Length > 0) && (

                                    // ... this is default control bundle and requested bundle not specified.
                                    (string.IsNullOrEmpty(controlBundle.Name) &&
                                     (bundles == null || bundles.Length == 0)) ||

                                    // .. or this is not default bundle and its specified in requested bundle
                                    (bundles != null && bundles.Contains(controlBundle.Name))
                                    )) {

                                    // Iterate all controls registered in control bundle. Determining control types is works here.
                                    foreach(var control in controlBundle.Controls) {
                                        if(string.IsNullOrEmpty(control.Assembly) ||
                                            control.Assembly == "AjaxControlToolkit") {

                                            // Processing AjaxControlToolkit controls
                                            var controlName = "AjaxControlToolkit." + control.Name;

                                            // Verify that control is a standard AjaxControlToolkit control
                                            if(!ControlDependencyMap.Maps.ContainsKey(controlName))
                                                throw new Exception(
                                                    string.Format(
                                                        "Could not find control '{0}'. Please make sure you entered the correct control name in AjaxControlToolkit.config file.",
                                                        control.Name));

                                            registeredControls.AddRange(ControlDependencyMap.Maps[controlName].Dependecies);
                                        } else {

                                            // Processing custom controls
                                            registeredControls.Add(
                                                GetAssembly(control.Assembly)
                                                    .GetType(control.Assembly + "." + control.Name));
                                        }
                                    }

                                    // Mark that bundle is registered for future verification
                                    registeredBundles.Add(controlBundle.Name);
                                }
                            }
                        }
                    }
                }

                // Verify, is there any control in bundle that not registered yet
                if(bundles != null) {
                    foreach(var bundle in bundles) {
                        if(!registeredBundles.Contains(bundle))
                            throw new Exception(string.Format("Could not resolve bundle {0}.", bundle));
                    }
                }
            }

            // Return unique types
            return registeredControls.Distinct().ToList();
        }

        string ReadConfiguration(string fileName) {
            var text = _cache.Get<string>(ConfigCacheKey);
            if(!String.IsNullOrEmpty(text))
                return text;

            text = File.ReadAllText(fileName);
            _cache.Set(ConfigCacheKey, text, fileName);
            return text;
        }

        Settings ParseConfiguration(string text) {
            using(var reader = new StringReader(text)) {
                return new XmlSerializer(typeof(Settings)).Deserialize(reader) as Settings;
            }
        }

        static Assembly GetAssembly(string name) {
            if(!LoadedAssemblies.ContainsKey(name))
                LoadedAssemblies.Add(name, Assembly.Load(name));
            return LoadedAssemblies[name];
        }

        public IEnumerable<string> GetControlBundles() {
            var fileName = Path.Combine(HttpRuntime.AppDomainAppPath, BundleResolver.ConfigFileVirtualPath);
            if(!File.Exists(fileName))
                yield break;

            var settings = ParseConfiguration(ReadConfiguration(fileName));

            foreach(var section in settings.ControlBundleSections)
                foreach(var bundle in section.ControlBundles)
                    yield return bundle.Name;
        }
    }

}
#pragma warning restore 1591