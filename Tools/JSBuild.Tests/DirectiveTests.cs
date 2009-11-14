using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace JSBuild.Tests
{
    /// <summary>
    /// Summary description for DirectiveUtilityTests
    /// </summary>
    [TestClass]
    public class DirectiveTests
    {

        [TestMethod]
        public void SimpleDirective()
        {
            // Match simple #IF
            var result = new Directive(1, "//#IF DEBUG");
            Assert.AreEqual("IF", result.Command);
        }


        [TestMethod]
        public void LowercaseDirective()
        {
            // Match simple #IF
            var result = new Directive(1, "//#if DEBUG");
            Assert.AreEqual("IF", result.Command);
        }

        [TestMethod]
        public void WhitespaceDirective()
        {
            // Match simple #IF
            var result = new Directive(1, "    //#IF DEBUG");
            Assert.AreEqual("IF", result.Command);
        }

        [TestMethod]
        public void DirectiveWithSingleParameter()
        {
            // Match simple #IF
            var result = new Directive(1, "    //#IF DEBUG");
            Assert.AreEqual(1, result.Parameters.Count);
            Assert.AreEqual("DEBUG", result.Parameters[0]);
        }


        [TestMethod]
        public void DirectiveWithSingleQuotedParameter()
        {
            // Match simple #IF
            var result = new Directive(1, "    //#INCLUDE 'SomeFile.js'");
            Assert.AreEqual(1, result.Parameters.Count);
            Assert.AreEqual("SomeFile.js", result.Parameters[0]);
        }


        [TestMethod]
        public void DirectiveWithTwoParameters()
        {
            // Match simple #IF
            var result = new Directive(1, "    //#INCLUDE 'SomeFile.js' RECURSE");
            Assert.AreEqual("SomeFile.js", result.Parameters[0]);
            Assert.AreEqual("RECURSE", result.Parameters[1]);
        }


    }
}
