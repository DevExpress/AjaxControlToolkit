using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using NUnit.Framework;

namespace AjaxControlToolkit.BackwardCompatibilityTests
{
    public static class CompatibilityTestCase
    {
        private static Assembly _oldAssembly;
        private static Assembly _newAssembly;

        private static int _nameSpaceLevelIgnorance = 0;
        private const BindingFlags Flags = BindingFlags.Public
            | BindingFlags.Instance
            | BindingFlags.DeclaredOnly;

        public static void SetAssembly(string oldAssemblyFile, string newAssemblyFile, int nameSpaceLevelIgnorance = 0)
        {
            _nameSpaceLevelIgnorance = nameSpaceLevelIgnorance;
            _oldAssembly = Assembly.LoadFile(Path.GetFullPath(oldAssemblyFile));
            _newAssembly = Assembly.LoadFile(Path.GetFullPath(newAssemblyFile));
        }

        public static IEnumerable<TestCaseData> GetTestData()
        {
            var results = new List<TestCaseData>();

            var oldClasses = _oldAssembly.GetTypes().Where(m => m.IsPublic && !string.IsNullOrEmpty(m.Namespace)).ToList();
            var newClasses = _newAssembly.GetTypes().Where(m => m.IsPublic && !string.IsNullOrEmpty(m.Namespace)).ToList();

            foreach (var oldClass in oldClasses)
            {
                // Find new class that match with old class
                var newClass = GetMemberInType(newClasses, oldClass);
                if (newClass == null)
                    throw new Exception("Could not found type " + oldClass.FullName + " in new assembly.");

                var newClassMembers = newClass.GetCommonMembers();
                var oldClassMembers = oldClass.GetCommonMembers();

                foreach (var mi in oldClassMembers)
                {
                    var testCaseData = new TestCaseData(new CompatibilityTestData
                                                            {
                                                                ClassName = newClass.FullName,
                                                                ClassMembersFound = newClassMembers,
                                                                MemberToTest = mi
                                                            });

                    var className = GetActualTypeName(newClass);
                    var typeName = mi.MemberType == MemberTypes.Constructor
                                       ? ""
                                       : GetMemberUnderlyingTypeName(mi) + " ";
                    var testCaseName = "";

                    testCaseData.SetCategory(className);

                    if (mi.MemberType == MemberTypes.Constructor || mi.MemberType == MemberTypes.Method)
                    {
                        var oldClassCi = (mi as MethodBase);
                        var oldParams = oldClassCi.GetParameters();
                        var prms = string.Join(",", oldParams.Select(p => p.ParameterType.Name).ToArray());
                        testCaseName = string.Format("{0}({1})",
                                                     mi.MemberType == MemberTypes.Constructor
                                                         ? className
                                                         : mi.Name, prms);
                    }
                    else
                        testCaseName = mi.Name;

                    testCaseData.SetName(className + " --> " + " [" + mi.MemberType + "] --> " + typeName + testCaseName);

                    results.Add(testCaseData);
                }
            }

            return results;
        }

        private static MemberInfo[] GetCommonMembers(this Type type)
        {
            var members = type.GetMembers(Flags);
            return members.Where(m => !IsGetterSetter(members, m) && !IsEventMethods(members, m))
                .OrderBy(m=>m.ReflectedType.Name)
                .ToArray();
        }

        static bool IsEventMethods(IEnumerable<MemberInfo> parts, MemberInfo memberInfo)
        {
            bool adder = false;

            if (!(memberInfo.MemberType == MemberTypes.Method &&
                ((adder = memberInfo.Name.StartsWith("add_")) || (memberInfo.Name.StartsWith("remove_")))))
                return false;

            var index = adder ? 4 : 7;

            var name = memberInfo.Name;
            var events = parts.Where(m => m.MemberType == MemberTypes.Event
                                              && m.Name == name.Substring(index));

            return events.Any();
        }

        static bool IsGetterSetter(IEnumerable<MemberInfo> parts, MemberInfo memberInfo)
        {
            var name = memberInfo.Name;

            if (!(memberInfo.MemberType == MemberTypes.Method &&
                (name.StartsWith("set_") || name.StartsWith("get_"))))
                return false;

            var properties = parts.Where(m => m.MemberType == MemberTypes.Property
                                              && m.Name == name.Substring(4));

            return properties.Any();
        }

        private static Type GetMemberInType(IEnumerable<Type> sourceClasses, Type classToFind)
        {
            if (classToFind == null || classToFind.Namespace == null)
                throw new Exception("Member or namespace can't be null.");

            return sourceClasses.FirstOrDefault(t => t.FullName.EndsWith(GetActualTypeName(classToFind)));
        }

        private static string GetActualTypeName(Type type)
        {
            if (type == null || type.Namespace == null)
                throw new Exception("Member or namespace can't be null.");

            if (_nameSpaceLevelIgnorance == 0)
                return type.FullName;

            var nameSpace = type.Namespace;
            var ignorance = _nameSpaceLevelIgnorance;

            //http://stackoverflow.com/a/9908392
            var index = nameSpace
                .TakeWhile(c => ((ignorance -= (c == '.' ? 1 : 0))) > 0).Count() + 1;

            return nameSpace.Substring(index) + "." + type.Name;
        }

        /// <summary>
        /// Gets the member's underlying type.
        /// http://www.java2s.com/Code/CSharp/Reflection/Getsthemembersunderlyingtype.htm
        /// </summary>
        /// <param name="member">The member.</param>
        /// <returns>The underlying type of the member.</returns>
        internal static string GetMemberUnderlyingTypeName(MemberInfo member)
        {
            Type type = null;
            switch (member.MemberType)
            {
                case MemberTypes.Field:
                    type = ((FieldInfo)member).FieldType;
                    break;
                case MemberTypes.Property:
                    type = ((PropertyInfo)member).PropertyType;
                    break;
                case MemberTypes.Event:
                    type = ((EventInfo)member).EventHandlerType;
                    break;
                case MemberTypes.Method:
                    type = ((MethodInfo)member).ReturnType;
                    break;
                case MemberTypes.Constructor:
                    return "Constructor";
                default:
                    return "--Unspecified--";
            }

            if (!type.IsGenericType)
                return type.Name;

            var args = string.Join(", ", type.GenericTypeArguments.Select(t=>t.Name));
            return string.Format("{0}<{1}>", type.Name.Substring(0, type.Name.Length - 2), args);
        }
        
    }
}
