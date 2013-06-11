using NUnit.Framework;

namespace AjaxControlToolkit.BackwardCompatibilityTests
{
    [TestFixture]
    public class Test
    {
        [CompatibilityTest(@"..\..\LegacyAssemblies\NET35\AjaxControlToolkit.dll",
            @"..\..\..\..\..\Server\AjaxControlToolkit\bin\NET35\Debug\AjaxControlToolkit.dll")]
        public void CompatibilityTestNET35(CompatibilityTestData testData)
        {
            testData.Assert();
        }

        [CompatibilityTest(@"..\..\LegacyAssemblies\NET40\AjaxControlToolkit.dll",
            @"..\..\..\..\..\Server\AjaxControlToolkit\bin\NET40\Debug\AjaxControlToolkit.dll")]
        public void CompatibilityTestNET40(CompatibilityTestData testData)
        {
            testData.Assert();
        }

        [CompatibilityTest(@"..\..\LegacyAssemblies\NET45\AjaxControlToolkit.dll",
            @"..\..\..\..\..\Server\AjaxControlToolkit\bin\NET45\Debug\AjaxControlToolkit.dll")]
        public void CompatibilityTestNET45(CompatibilityTestData testData)
        {
            testData.Assert();
        }
    }
}
