using NUnit.Framework;

namespace AjaxControlToolkit.BackwardCompatibilityTests
{
    public class CompatibilityTestAttribute : TestCaseSourceAttribute
    {
        public CompatibilityTestAttribute(string oldAssemblyName, string newAssemblyName) :
            base(typeof(CompatibilityTestCase), "GetTestData")
        {
            CompatibilityTestCase.SetAssembly(oldAssemblyName, newAssemblyName);
        }
    }
}
