

using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.UI;
using System.Text;

public partial class Automated_TestHarness : Page
{
    

    /// <summary>
    /// Populate the array of Test Suite Urls
    /// </summary>
    protected void Page_Load(object sender, EventArgs e)
    {
        //int size = System.Runtime.InteropServices.Marshal.SizeOf(typeof(Guid));


        // Create the list of test suites and add the basics first
        List<string> testSuites = new List<string>();
        testSuites.Add("'TestHarnessTests.aspx'");
        testSuites.Add("'ExtenderBase.aspx'");

        // Dynamically add the rest of the *.aspx files in this directory as tests
        foreach (string path in Directory.GetFiles(Server.MapPath("~"), "*.aspx"))
        {
            string file = Path.GetFileName(path);
            if (string.Compare(file, "Default.aspx", StringComparison.OrdinalIgnoreCase) != 0 &&
                string.Compare(file, "TestHarnessTests.aspx", StringComparison.OrdinalIgnoreCase) != 0 &&
                string.Compare(file, "ExtenderBase.aspx", StringComparison.OrdinalIgnoreCase) != 0)
            {
                testSuites.Add(string.Format("'{0}'", file));
            }
        }

        // Pass the test suite URLs back to the client
        litTestSuiteUrls.Text = string.Join(" , ", testSuites.ToArray());

        // Look for a querystring flag to automatically run all the tests at once
        bool runAll = false;
        bool.TryParse(Request.QueryString["RunAll"], out runAll);
        litRunAllFlag.Text = runAll.ToString().ToLower();

        // Look for a querystring flag to run the tests in "debug mode"
        bool debug = false;
        bool.TryParse(Request.QueryString["Debug"], out debug);
        litDebugFlag.Text = debug.ToString().ToLower();
    }
}