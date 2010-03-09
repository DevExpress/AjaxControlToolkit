/*
 * Tests
 * =====
 * ErrorLevel is 1 if test fails
 *
 */

using System;
using System.Collections.Generic;
using Microsoft.Internal.Test;
using System.IO;
using System.Diagnostics;
using System.Threading;
using CommandLine;
using System.Web;

namespace AtlasUnit {
    internal class AtlasUnit {

        // Order of argument fields determines order arguments are listed in the help text.
        private class AtlasUnitArguments {
            [Argument(ArgumentType.AtMostOnce, HelpText="Create virtual directory in IIS.")]
            public bool setup = false;

            [Argument(ArgumentType.AtMostOnce, HelpText = "Use release version of Atlas scripts.")]
            public bool release = false;

            [Argument(ArgumentType.AtMostOnce, HelpText = "Load AJAX scripts from this path instead of from embedded resources.", ShortName = "sp")]
            public string scriptPath = null;

            [Argument(ArgumentType.AtMostOnce, HelpText = "Open console runner in new IE window, dump results to console, and close IE.")]
            public bool dump = false;

            [Argument(ArgumentType.AtMostOnce, HelpText = "Open console runner in new IE window.", ShortName = "o")]
            public bool console = false;

            [Argument(ArgumentType.AtMostOnce, HelpText = "Console runner will not catch exceptions, which allows them to be caught by a debugger.")]
            public bool throwOnFail = false;

            [Argument(ArgumentType.MultipleUnique, HelpText = "List of categories to include.")]
            public string[] include = new string[0];

            [Argument(ArgumentType.MultipleUnique, HelpText = "List of categories to exclude.")]
            public string[] exclude = new string[0];

            [Argument(ArgumentType.AtMostOnce, HelpText = "Open GUI runner in new IE window.")]
            public bool gui = false;

            [Argument(ArgumentType.AtMostOnce, HelpText = "Delete virtual directory in IIS.")]
            public bool cleanup = false;

            [Argument(ArgumentType.AtMostOnce, HelpText = "Specifies to generate a plain, sorted log file (with no header)")]
            public bool plainLog = false;

            [DefaultArgument(ArgumentType.Required, HelpText = "Url of project file.")]
            public string projectUrl = null;
        }

        private const string hostName = "localhost";
        private const string appName = "AtlasUnit";
        private const string appUrl = "http://" + hostName + "/" + appName + "/";
        private const string pagesDir = "Pages";
        private const string consoleUrl = appUrl + "AtlasUnitConsole.aspx";
        private const string guiUrl = appUrl + "AtlasUnitGui.aspx";

        private static int Main(string[] args) {
            AtlasUnitArguments parsedArgs = new AtlasUnitArguments();
            if (!ParseArguments(args, parsedArgs)) {
                return 1;
            }

            return Execute(parsedArgs) ? 0 : 1;
        }

        private static bool ParseArguments(string[] args, AtlasUnitArguments parsedArgs) {
            if (!CommandLine.Parser.ParseArgumentsWithUsage(args, parsedArgs)) {
                return false;
            }

            if (!(parsedArgs.setup || parsedArgs.dump || parsedArgs.console || parsedArgs.gui || parsedArgs.cleanup)) {
                parsedArgs.setup = true;
                parsedArgs.dump = true;
                parsedArgs.cleanup = true;
            }

            if (parsedArgs.release && !(parsedArgs.console || parsedArgs.dump || parsedArgs.gui)) {
                WriteError("'release' argument requires 'console', 'dump', or 'gui' argument");
                return false;
            }

            if (parsedArgs.throwOnFail && !(parsedArgs.console || parsedArgs.gui)) {
                WriteError("'throwOnFail' argument requires 'console' or 'gui' argument");
                return false;
            }

            if (parsedArgs.include.Length > 0 && !(parsedArgs.console || parsedArgs.dump || parsedArgs.gui)) {
                WriteError("'include' argument requires 'console', 'dump', or 'gui' argument");
                return false;
            }

            if (parsedArgs.exclude.Length > 0 && !(parsedArgs.console || parsedArgs.dump || parsedArgs.gui)) {
                WriteError("'exclude' argument requires 'console', 'dump', or 'gui' argument");
                return false;
            }

            if (parsedArgs.plainLog && (!parsedArgs.dump)) {
                WriteError("'plainLog' argument requires 'dump' argument");
                return false;
            }

            return true;
        }

        private static void WriteError(string error) {
            Console.Error.WriteLine(error);
            Console.Write(CommandLine.Parser.ArgumentsUsage(typeof(AtlasUnitArguments)));
        }

        private static bool Execute(AtlasUnitArguments parsedArgs) {
            bool failed = false;

            if (parsedArgs.setup) {
                string currentDir = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
                IISHelper.CreateVDir(appName, Path.Combine(currentDir, pagesDir), hostName);

                if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("CodeCov"))) {
                    // Without code coverage, AtlasScriptTest can run in High trust, but not Medium trust,
                    // since the test framework itself uses HttpWebRequest.
                    ConfigHelper.SetTrust(appName, "High");
                }
                else {
                    // Magellan instrumented binaries require Full trust.
                    ConfigHelper.SetTrust(appName, "Full");
                }
            }

            string queryString = "?projectUrl=" + parsedArgs.projectUrl;

            if (!String.IsNullOrEmpty(parsedArgs.scriptPath)) {
                queryString += "&scriptPath=" + parsedArgs.scriptPath;
            }

            if (parsedArgs.release) {
                queryString += "&scriptMode=Release&exclude=DebugOnly";
            }
            else {
                queryString += "&scriptMode=Debug&exclude=ReleaseOnly";
            }
            if (parsedArgs.throwOnFail) {
                queryString += "&throwOnFail";
            }
            foreach (string include in parsedArgs.include) {
                queryString += "&include=" + HttpUtility.UrlEncode(include);
            }
            foreach (string exclude in parsedArgs.exclude) {
                queryString += "&exclude=" + HttpUtility.UrlEncode(exclude);
            }

            if (parsedArgs.dump || parsedArgs.console) {
                if (parsedArgs.plainLog) {
                    queryString += "&plainLog";
                }
                IEApplication ie = LaunchIE(consoleUrl + queryString);
                if (parsedArgs.dump) {
                    DumpResults(ie, ref failed);
                }
            }

            if (parsedArgs.gui) {
                LaunchIE(guiUrl + queryString);
            }

            if (parsedArgs.cleanup) {
                IISHelper.DeleteVDir(appName, hostName);
            }

            return !failed;
        }

        private static IEApplication LaunchIE(string url) {
            IEApplication ie = new IEApplication();
            ie.Visible = true;
            ie.Navigate(url);
            return ie;
        }

        private static void DumpResults(IEApplication ie, ref bool failed) {
            ie.WaitForDocument();

            ie.WaitForElement("results");
            string results = ie.GetElement("results").GetProperty("innerText");
            Console.WriteLine(results);

            string summary = ie.GetElement("summary").GetProperty("innerText");

            ie.Quit();

            if (!String.Equals(summary, "Passed", StringComparison.OrdinalIgnoreCase)) {
                failed = true;
            }
        }
    }
}
