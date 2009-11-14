using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;
using System.Text.RegularExpressions;

namespace JSBuild.Tests
{
    /// <summary>
    /// Summary description for PreprocessorTests
    /// </summary>
    [TestClass]
    public class PreprocessorTests
    {
        const string simplePreJS = @"
            // Beginning of file
            //#if debug
                // here is some debug content
            //#else
                // here is some release content
            //#endif
            // End of file
        ";


        const string nestedPreJS = @"
            // Beginning of file
            //#if debug
                // here is some debug content
                //#if release
                    // nested release content
                //#endif
            //#else
                // here is some release content
                //#if debug
                    // nested debug content
                //#endif
            //#endif
            // End of file
        ";



        const string customSymbolPreJS = @"
            // Beginning of file
            //#if FRANCE
                // here is some french content
            //#else
                // not french content
                //#if debug
                    // debug content
                //#endif
            //#endif
            // End of file
        ";



        const string includePreJS = @"
            // Beginning of file
            //#INCLUDE 'IncludeMe.js'
            // End of file
        ";


        const string includePreJSInDebug = @"
            // Beginning of file
            //#if debug
              //#INCLUDE 'IncludeMe.js'
            //#endif
            // End of file
        ";



        [TestMethod]
        public void TestDebug()
        {
            // Arrange
            var sourceReader = new StringReader(simplePreJS);
            var debugWriter = new StringWriter();
            var releaseWriter = new StringWriter();

            // Act
            var pp = new Preprocessor();
            pp.Process(sourceReader, debugWriter, releaseWriter);

            // Assert
            StringAssert.DoesNotMatch(debugWriter.ToString(), new Regex("here is some release content"));
            StringAssert.Matches(debugWriter.ToString(), new Regex("here is some debug content"));
        }

        [TestMethod]
        public void TestNestedDebug()
        {
            // Arrange
            var sourceReader = new StringReader(nestedPreJS);
            var debugWriter = new StringWriter();
            var releaseWriter = new StringWriter();

            // Act
            var pp = new Preprocessor();
            pp.Process(sourceReader, debugWriter, releaseWriter);

            // Assert
            StringAssert.Matches(debugWriter.ToString(), new Regex("nested debug content"));
        }




        [TestMethod]
        public void TestRelease()
        {
            // Arrange
            var sourceReader = new StringReader(simplePreJS);
            var debugWriter = new StringWriter();
            var releaseWriter = new StringWriter();

            // Act
            var pp = new Preprocessor();
            pp.Process(sourceReader, debugWriter, releaseWriter);

            // Assert
            StringAssert.DoesNotMatch(releaseWriter.ToString(), new Regex("here is some debug content"));
            StringAssert.Matches(releaseWriter.ToString(), new Regex("here is some release content"));
        }



        [TestMethod]
        public void TestNestedRelease()
        {
            // Arrange
            var sourceReader = new StringReader(nestedPreJS);
            var debugWriter = new StringWriter();
            var releaseWriter = new StringWriter();

            // Act
            var pp = new Preprocessor();
            pp.Process(sourceReader, debugWriter, releaseWriter);

            // Assert
            StringAssert.Matches(releaseWriter.ToString(), new Regex("nested release content"));
        }



        [TestMethod]
        public void CustomSymbolDefined()
        {
            // Arrange
            var sourceReader = new StringReader(customSymbolPreJS);
            var debugWriter = new StringWriter();
            var releaseWriter = new StringWriter();

            // Act
            var symbols = new List<string>();
            symbols.Add("FRANCE");
            var pp = new Preprocessor(symbols);
            pp.Process(sourceReader, debugWriter, releaseWriter);

            // Assert
            StringAssert.Matches(releaseWriter.ToString(), new Regex("french content"));
            StringAssert.DoesNotMatch(debugWriter.ToString(), new Regex("not french content"));
        }



        [TestMethod]
        public void SimpleInclude()
        {
            // Arrange
            var sourceReader = new StringReader(includePreJS);
            var debugWriter = new StringWriter();
            var releaseWriter = new StringWriter();

            // Act
            var pp = new Preprocessor();
            pp.Process(sourceReader, debugWriter, releaseWriter);

            // Assert
            StringAssert.Matches(debugWriter.ToString(), new Regex("contents of include file"));
            StringAssert.Matches(releaseWriter.ToString(), new Regex("contents of include file"));
        }



        [TestMethod]
        public void IncludeWithDEBUG()
        {
            // Arrange
            var sourceReader = new StringReader(includePreJS);
            var debugWriter = new StringWriter();
            var releaseWriter = new StringWriter();

            // Act
            var pp = new Preprocessor();
            pp.Process(sourceReader, debugWriter, releaseWriter);

            // Assert
            StringAssert.Matches(debugWriter.ToString(), new Regex("include debug content"));
            StringAssert.DoesNotMatch(releaseWriter.ToString(), new Regex("include debug content"));
        }



        [TestMethod]
        public void IncludeInDebug()
        {
            // Arrange
            var sourceReader = new StringReader(includePreJSInDebug);
            var debugWriter = new StringWriter();
            var releaseWriter = new StringWriter();

            // Act
            var pp = new Preprocessor();
            pp.Process(sourceReader, debugWriter, releaseWriter);

            // Assert
            StringAssert.Matches(debugWriter.ToString(), new Regex("from include file"));
            StringAssert.DoesNotMatch(releaseWriter.ToString(), new Regex("from include file"));
        }


    }
}
