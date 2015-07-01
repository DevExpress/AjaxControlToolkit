using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    public class ControlDependencyMap {
        static Lazy<Dictionary<string, ControlDependencyMap>> _dependencyMaps =
            new Lazy<Dictionary<string, ControlDependencyMap>>(CreateDependencyMaps, true);

        public static Dictionary<string, ControlDependencyMap> Maps {
            get { return _dependencyMaps.Value; }
        }

        List<Type> _dependecies;

        public Type Type { get; private set; }

        public IEnumerable<Type> Dependecies {
            get { return _dependecies; }
        }

        public ControlDependencyMap(Type type, Type[] types) {
            Type = type;
            _dependecies = new List<Type>(types);
        }

        static Dictionary<string, ControlDependencyMap> CreateDependencyMaps() {
            var result = new Dictionary<string, ControlDependencyMap>();

            var allActControls = typeof(ControlDependencyMap).Assembly.GetTypes()
                .Where(c => (c.UnderlyingSystemType.IsSubclassOf(typeof(WebControl)) ||
                             c.UnderlyingSystemType.IsSubclassOf(typeof(ScriptControl)) ||
                             c.UnderlyingSystemType.IsSubclassOf(typeof(ExtenderControl)))
                            && !c.IsAbstract && !c.IsGenericType && c.IsPublic).ToList();

            // Retrieve all dependencies in controls to build ControlTypeMaps
            foreach(var type in allActControls)
                result[type.FullName] = BuildDependencyMap(type);

            foreach(var type in ToolkitConfig.CustomControls)
                result[type.FullName] = BuildDependencyMap(type);

            return result;
        }

        public static ControlDependencyMap BuildDependencyMap(Type type) {
            var dependencies = new List<Type>();
            SeekDependencies(type, ref dependencies);
            var scriptDependencies = dependencies
                .Where(m => m.GetCustomAttributes(true).Any(a => a is RequiredScriptAttribute || a is ClientScriptResourceAttribute))
                .ToList();

            scriptDependencies.Add(type);

            return new ControlDependencyMap(type, scriptDependencies.Distinct().ToArray());
        }

        static void SeekDependencies(Type ctlType, ref List<Type> dependencies) {
            var deps = dependencies;

            // Retrieve all member types which are not in dependency list yet
            var members = ctlType.GetMembers(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Public | BindingFlags.Static)
                .SelectMany(info => GetMemberTypes(info))
                .Where(m => m != null && m.Namespace != null && m.Namespace.StartsWith("AjaxControlToolkit"))
                .Distinct()
                .Where(m => !deps.Contains(m))
                .ToList();

            // For extender control, we should check also the dependencies of target control type
            foreach(var targetCtlType in ctlType.GetCustomAttributes(true)
                .Where(a => a is TargetControlTypeAttribute)) {

                var targetType = ((TargetControlTypeAttribute)targetCtlType).TargetControlType;
                if(!members.Contains(targetType) && !dependencies.Contains(targetType))
                    members.Add(targetType);
            }

            // Store dependency list
            dependencies.AddRange(members.ToList());

            // Iterate every dependency to find nested dependencies
            foreach(var member in members) {
                SeekDependencies(member, ref dependencies);
            }
        }

        static IEnumerable<Type> GetMemberTypes(MemberInfo memberInfo) {
            Type type = null;

            switch(memberInfo.MemberType) {
                case MemberTypes.Event:
                    type = ((EventInfo)memberInfo).EventHandlerType;
                    break;
                case MemberTypes.Field:
                    type = ((FieldInfo)memberInfo).FieldType;
                    break;
                case MemberTypes.Method:
                    type = ((MethodInfo)memberInfo).ReturnType;
                    break;
                case MemberTypes.Property:
                    type = ((PropertyInfo)memberInfo).PropertyType;
                    break;
                case MemberTypes.NestedType:
                    // Special case for nested type, we will iterate the nested members here
                    var members = ((Type)memberInfo).GetMembers();
                    var ntypes = new List<Type>();
                    foreach(var m in members) {
                        var mtypes = GetMemberTypes(m).Where(x => !ntypes.Contains(x));
                        ntypes.AddRange(mtypes);
                    }

                    return ntypes.ToArray();
            }
            return new[] { type };
        }
    }

}
