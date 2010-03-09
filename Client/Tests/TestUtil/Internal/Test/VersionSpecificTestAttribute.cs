namespace Microsoft.Internal.Test {
    using System;

    // designates that a test has a different baseline file for each version of System.Web.Extensions
    // e.g. MyTest3.5.bsl and MyTest4.0.bsl
    [AttributeUsage(AttributeTargets.Method, AllowMultiple=false)]
    public class VersionSpecificTestAttribute : Attribute {
    }
}

