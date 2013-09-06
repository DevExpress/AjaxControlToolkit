using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml.Serialization;


namespace AjaxControlToolkit {
    public class ToolkitScriptManagerConfig {
        private const string ConfigFileName = "~/AjaxControlToolkit.config";
        private const string CacheConfigName = "__CACHED__AjaxControlToolkitConfig";

        /// <summary>
        /// Dependency type map for standard AjaxControlToolkit controls.
        /// </summary>
        public static readonly Dictionary<string, string[]> ControlDependencyTypeMaps =
            new Dictionary<string, string[]>();

        private readonly IAjaxControlToolkitCacheProvider _cacheProvider;

        /// <summary>
        /// Static constructor where ControlDependencyTypeMaps is built.
        /// </summary>
        static ToolkitScriptManagerConfig() {

            // Retrieve all AjaxControlToolkit controls
            var allActControls = Assembly.GetExecutingAssembly().GetTypes()
                .Where(c => (c.UnderlyingSystemType.IsSubclassOf(typeof (WebControl)) ||
                             c.UnderlyingSystemType.IsSubclassOf(typeof (ScriptControl)) ||
                             c.UnderlyingSystemType.IsSubclassOf(typeof (ExtenderControl)))
                            && !c.IsAbstract && !c.IsGenericType && c.IsPublic).ToList();

            // Retrieve all dependencies in controls to build ControlTypeMaps
            foreach (var ctlType in allActControls) {
                var dependencies = new List<Type>();
                SeekDependencies(ctlType, ref dependencies);
                var scriptDependencies =
                    dependencies.Where(
                        m => m.GetCustomAttributes(true)
                            .Any(a => a is RequiredScriptAttribute || a is ClientScriptResourceAttribute))
                        .Select(d => d.FullName)
                        .ToList();

                var ctlName = ctlType.FullName;
                scriptDependencies.Add(ctlName);

                ControlDependencyTypeMaps.Add(ctlName, scriptDependencies.Distinct().ToArray());
            }
        }

        private static IEnumerable<Type> GetMemberTypes(MemberInfo memberInfo) {

            Type type = null;

            switch (memberInfo.MemberType) {
                case MemberTypes.Event:
                    type = ((EventInfo) memberInfo).EventHandlerType;
                    break;
                case MemberTypes.Field:
                    type = ((FieldInfo) memberInfo).FieldType;
                    break;
                case MemberTypes.Method:
                    type = ((MethodInfo) memberInfo).ReturnType;
                    break;
                case MemberTypes.Property:
                    type = ((PropertyInfo) memberInfo).PropertyType;
                    break;
                case MemberTypes.NestedType:
                    // Special case for nested type, we will iterate the nested members here
                    var members = ((Type) memberInfo).GetMembers();
                    var ntypes = new List<Type>();
                    foreach (var m in members) {
                        var mtypes = GetMemberTypes(m).Where(x => !ntypes.Contains(x));
                        ntypes.AddRange(mtypes);
                    }

                    return ntypes.ToArray();
            }
            return new[] {type};
        }

        private static void SeekDependencies(Type ctlType, ref List<Type> dependencies) {
            var deps = dependencies;

            // Retrieve all member types which are not in dependency list yet
            var members = ctlType.GetMembers(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Public)
                .SelectMany(info => GetMemberTypes(info))
                .Where(m => m != null && m.Namespace != null && m.Namespace.StartsWith("AjaxControlToolkit"))
                .Distinct()
                .Where(m => !deps.Contains(m))
                .ToList();

            // For extender control, we should check also the dependencies of target control type
            foreach (var targetCtlType in ctlType.GetCustomAttributes(true)
                .Where(a => a is TargetControlTypeAttribute)) {

                var targetType = ((TargetControlTypeAttribute) targetCtlType).TargetControlType;
                if (!members.Contains(targetType) && !dependencies.Contains(targetType))
                    members.Add(targetType);
            }

            // Store dependency list
            dependencies.AddRange(members.ToList());

            // Iterate every dependency to find nested dependencies
            foreach (var member in members) {
                SeekDependencies(member, ref dependencies);
            }
        }

        public ToolkitScriptManagerConfig(IAjaxControlToolkitCacheProvider cacheProvider) {
            this._cacheProvider = cacheProvider;
        }

        /// <summary>
        /// Get all types of controls referenced by control bundle names. 
        /// If control bundle names is empty then default control bundle defined in AjaxControlToolkit.config will be use to retrieved control types.
        /// If AjaxControlToolkit.config file is not found then all standard control types of AjaxControlToolkit will be retrieved and if control bundle names is defined exception will thrown.
        /// </summary>
        /// <param name="context">Current HttpContext.</param>
        /// <param name="bundles">Control bundle names. Will be ignored if AjaxControlToolkit.config file is not found.</param>
        /// <returns></returns>
        public virtual List<Type> GetControlTypesInBundles(HttpContextBase context, string[] bundles) {

            var registeredControls = new List<Type>();
            var registeredBundles = new List<string>();
            var fileName = context.Server.MapPath(ConfigFileName);

            if (!File.Exists(fileName)) {

                // No configuration config (AjaxControlToolkit.config) is specified

                // Bundle names specified, but AjaxControlToolkit.config is not provided then exception should be thrown
                if (bundles != null && bundles.Length > 0)
                    throw new Exception("Can not resolve requested control bundle since " + ConfigFileName +
                                        " file is not defined.");

                // Parse all controls type name in ControlDependencyTypeMaps
                var allControlTypesName = new List<string>();
                foreach (var map in ControlDependencyTypeMaps) {
                    allControlTypesName.AddRange(map.Value);
                }

                // Load all AjaxControlToolkit controls if there is no bundle specified neither the config file
                registeredControls.AddRange(allControlTypesName.Select(c => Type.GetType(c))
                    .ToList());
            }
            else {

                // Bundle configuration (AjaxControlToolkit.config) specified
                // Try read config content from cache
                var configContent = _cacheProvider.Get<string>(CacheConfigName);
                if (string.IsNullOrEmpty(configContent)) {
                    using (StreamReader sr = File.OpenText(fileName)) {
                        // Retrieve config content from file and caching it
                        configContent = sr.ReadToEnd();
                        _cacheProvider.Set(CacheConfigName, configContent, fileName);
                    }
                }

                // Deserialize bundle configuration
                var bundleConfig = (Config.Settings)(new XmlSerializer(typeof(Config.Settings)))
                    .Deserialize(new StringReader(configContent));

                // Iterate all control bundle sections. Normaly, there will be only 1 section.
                foreach (var bundle in bundleConfig.ControlBundleSections) {

                    // Iterate all control bundles in a section.
                    foreach (var controlBundle in bundle.ControlBundles) {
                        
                        // Only add control types if ... 
                        if (
                            // ... this is default control bundle and requested bundle not specified.
                            (string.IsNullOrEmpty(controlBundle.Name) && (bundles == null || bundles.Length == 0)) ||

                            // .. or this is not default bundle and its specified in requested bundle
                            (bundles != null && bundles.Contains(controlBundle.Name))) {

                            // Iterate all controls registered in control bundle. Determining control types is works here.
                            foreach (var control in controlBundle.Controls) {
                                if (string.IsNullOrEmpty(control.Assembly) || control.Assembly == "AjaxControlToolkit") {

                                    // Processing AjaxControlToolkit controls
                                    var controlName = "AjaxControlToolkit." + control.Name;

                                    // Verify that control is a standard AjaxControlToolkit control
                                    if (!ControlDependencyTypeMaps.ContainsKey(controlName))
                                        throw new Exception(
                                            string.Format(
                                                "Could not find control '{0}'. Please make sure you entered the correct control name in AjaxControlToolkit.config file.",
                                                control.Name));

                                    registeredControls.AddRange(ControlDependencyTypeMaps[controlName]
                                        .Select(c => Type.GetType(c)));
                                }
                                else {

                                    // Processing custom controls
                                    registeredControls.Add(
                                        ToolkitScriptManagerHelper.GetAssembly(control.Assembly)
                                            .GetType(control.Assembly + "." + control.Name));
                                }
                            }

                            // Mark that bundle is registered for future verification
                            registeredBundles.Add(controlBundle.Name);
                        }
                    }
                }

                // Verify, is there any control in bundle that not registered yet
                if (bundles != null) {
                    foreach (var bundle in bundles) {
                        if (!registeredBundles.Contains(bundle))
                            throw new Exception(string.Format("Could not resolve bundle {0}.", bundle));
                    }
                }
            }

            // Return unique types
            return registeredControls.Distinct().ToList();
        }


    }
}