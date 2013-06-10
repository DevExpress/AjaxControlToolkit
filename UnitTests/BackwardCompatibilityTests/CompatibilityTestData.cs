using System.Reflection;

namespace AjaxControlToolkit.BackwardCompatibilityTests
{
    public class CompatibilityTestData
    {
        internal string ClassName { get; set; }
        internal MemberInfo[] ClassMembersFound { get; set; }
        internal MemberInfo MemberToTest { get; set; }
    }
}
