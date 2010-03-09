namespace Microsoft.Internal.Test {
    using System;
    using System.Collections;
    using System.Diagnostics;
    using System.Globalization;
    using System.IO;
    using System.Reflection;
    using System.Runtime.InteropServices;
    using System.Text.RegularExpressions;

    public abstract class IETestBase {

        public const char ID_SEPARATOR = '$';
        public const char ID_RENDER_SEPARATOR = '_';
        public const string FORM_ID = "aspnetForm";
        private static string _sweVersion;

        IEApplication _ie;
        TextWriter _writer;

        [DllImport("kernel32.dll")]
        public static extern void SetConsoleOutputCP(int cp);

        [DllImport("kernel32.dll")]
        public static extern int GetConsoleOutputCP();

        public IEApplication IE {
            get {
                return _ie;
            }
        }

        protected static string SystemWebExtensionsVersion {
            get {
                if (_sweVersion == null) {
                    Assembly assembly = typeof(System.Web.UI.ScriptManager).Assembly;
                    AssemblyName name = new AssemblyName(assembly.FullName);
                    _sweVersion = name.Version.ToString(2);
                }
                return _sweVersion;
            }
        }

        protected static string FilterVariableScript(string s) {
            string expr = "<script src=.*WebResource.axd[^>]*></script>";
            s = Regex.Replace(s, expr, @"[variable script removed]",
                RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

            expr = "<INPUT [^<]*type=hidden[^<]*name=__VIEWSTATE(\\d)*>";
            s = Regex.Replace(s, expr, @"[state removed]",
                RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

            expr = "<INPUT [^<]*name=\"__VIEWSTATE(\\d)*\"[^<]*type=\"hidden\"[^<]*>";
            s = Regex.Replace(s, expr, @"[state removed]",
                RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

            expr = "<INPUT [^<]*type=hidden[^<]*name=__VIEWSTATEFIELDCOUNT>";
            s = Regex.Replace(s, expr, @"[state removed]",
                RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

            expr = "<INPUT [^<]*name=\"__VIEWSTATEFIELDCOUNT\"[^<]*type=\"hidden\"[^<]*>";
            s = Regex.Replace(s, expr, @"[state removed]",
                RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

            expr = "<INPUT [^<]*type=hidden[^<]*name=__EVENTVALIDATION(\\d)*>";
            s = Regex.Replace(s, expr, @"[eventvalidation removed]",
                RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

            expr = "<INPUT [^<]*name=\"__EVENTVALIDATION(\\d)*\"[^<]*type=\"hidden\"[^<]*>";
            s = Regex.Replace(s, expr, @"[eventvalidation removed]",
                RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

            return s;
        }

        protected static string FixupWebResourceUrl(string html) {
            html = Regex.Replace(html, @"WebResource.axd\?d=[^&]*(.*)""", @"WebResource.axd?d=[AssemblyResourceData]$1""");
            html = Regex.Replace(html, @"WebResource.axd\?(.*)t=\d*(.*)""", @"WebResource.axd?$1t=[TimeStamp]$2""");
            return html;
        }

        // assumes all same case.
        bool ArgumentMatch(string arg, string formal) {
            if (arg[0] != '/' && arg[0] != '-') {
                return false;
            }
            arg = arg.Substring(1);
            return (arg == formal || (arg.Length == 1 && arg[0] == formal[0]));
        }

        bool CompareFiles(string path1, string path2) {
            string s1 = StringFromFile(path1);
            string s2 = StringFromFile(path2);

            if (s1.Length != s2.Length)
                return false;

            for (int i = 0; i < s1.Length; i++) {
                if (s1[i] != s2[i])
                    return false;
            }

            return true;
        }

        private void CreateVirtualDirectory(string appName, string appDirectory, bool release, string trust) {

            IISHelper.CreateVDir(appName, appDirectory, "localhost");
            ConfigHelper.SetDebugMode(appName, !release);

            if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("CodeCov"))) {
                // Without code coverage, run in specified trust level.
                ConfigHelper.SetTrust(appName, trust);
            }
            else {
                // Magellan instrumented binaries require Full trust.  So always run in Full trust,
                // regardless of the specified trust level.
                ConfigHelper.SetTrust(appName, "Full");
            }
        }

        private void DeleteVirtualDirectory(string appName) {
            IISHelper.DeleteVDir(appName, "localhost");

            // aspnet_wp.exe will continue monitoring file changes to the application directory even after the
            // vdir has been deleted in IIS.  As a result, if you run the suite setup after the suite cleanup, 
            // you will trigger an assert in ASP.NET on CHK builds, since you are updating too many files in an
            // application at once (Dev10 Bug 470342).  As a workaround, we kill aspnet_wp.exe after deleting the
            // vdir.  This is not an issue with w3wp.exe, as it automatically stops monitoring file changes when
            // the vdir is deleted in IIS.
            Process[] processes = Process.GetProcessesByName("aspnet_wp");
            foreach (Process p in processes) {
                Console.WriteLine("Killing process {0} ({1}) - '{2}'", p.MainModule.ModuleName, p.Id, p.MainWindowTitle);
                p.Kill();
                p.WaitForExit();
            }
        }

        public void LogMessage() {
            _writer.WriteLine();
        }

        public void LogMessage(string s) {
            _writer.WriteLine(s);
        }

        public void LogMessageWithBreaksAfterBrs(string s) {
            LogMessage(s.Replace("<BR>", "<BR>\r\n"));
        }

        public void WaitAndLog(string resultElement) {
            IE.WaitForElement(resultElement);
            LogMessage("Results for " + resultElement + ": " + IE[resultElement].GetProperty("value"));
        }

        public void WaitAndLog(string resultElement, string reg) {
            IE.WaitForElement(resultElement);
            string result = IE[resultElement].GetProperty("value");
            Match match = Regex.Match(result, reg);
            LogMessage("Results for " + resultElement + ": " + match.Value);
        }

        public void ClickWaitAndLog(string buttonId, string resultElement) {
            LogMessage("Clicking on: " + buttonId);
            IE[buttonId].InvokeMethod("click");
            WaitAndLog(resultElement);
        }

        private static readonly string[] TrustLevels = new string[] {
            "Full", "High", "Medium", "Low", "Minimal"
        };

        protected int RunTest(string[] args) {
            return RunTest(args, null, true);
        }
        
        protected int RunTest(string[] args, bool copyTestExeToLocalWorkingDir) {
            return RunTest(args, null, copyTestExeToLocalWorkingDir);
        }

        protected int RunTest(string[] args, string[] virtualDirectories) {
            return RunTest(args, virtualDirectories, true);
        }

        protected int RunTest(string[] args, string[] virtualDirectories, bool copyTestExeToLocalWorkingDir) {
            try {
                _writer = Console.Out;

                ArrayList groups = new ArrayList();
                ArrayList tests = new ArrayList();
                bool setup = false;
                bool release = false;
                string trust = "Medium";
                bool cleanup = false;
                int result = 0;

                for (int i = 0; i < args.Length; i++) {
                    string arg = args[i];
                    string value = String.Empty;

                    int colonPos = arg.IndexOf(":");
                    if (colonPos != -1) {
                        value = arg.Substring(colonPos + 1);
                        arg = arg.Substring(0, colonPos);
                    }

                    arg = arg.ToLower();

                    if (ArgumentMatch(arg, "test")) {
                        tests.Add(value);
                    }
                    else if (ArgumentMatch(arg, "group")) {
                        groups.Add(value);
                    }
                    else if (ArgumentMatch(arg, "setup")) {
                        setup = true;
                    }
                    else if (ArgumentMatch(arg, "release")) {
                        release = true;
                    }
                    else if (ArgumentMatch(arg, "trust")) {
                        trust = value;
                        if (Array.IndexOf<string>(TrustLevels, trust) == -1) {
                            LogMessage("Invalid trust level: " + trust);
                            LogMessage("Valid values: " + String.Join(", ", TrustLevels));
                            LogMessage();
                            WriteHelp();
                            return 1;
                        }
                    }
                    else if (ArgumentMatch(arg, "cleanup")) {
                        cleanup = true;
                    }
                    else if (ArgumentMatch(arg, "?") || ArgumentMatch(arg, "help")) {
                        WriteHelp();
                        return 0;
                    }
                    else {
                        LogMessage("invalid command line argument: " + args[i]);
                        WriteHelp();
                        return 1;
                    }
                }

                // if no options are specified, setup, run all checkin tests, and cleanup
                if (!setup && !cleanup && (groups.Count == 0) && (tests.Count == 0)) {
                    setup = true;
                    groups.Add(trust + "Trust");
                    cleanup = true;
                }

                if (setup) {
                    Setup();
                    string thisDirectory = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
                    string appDirectory = Path.Combine(thisDirectory, "Pages");
                    CreateVirtualDirectory(TestApplication, appDirectory, release, trust);

                    if ((virtualDirectories != null) && (virtualDirectories.Length != 0)) {
                        foreach (string virtualDirectory in virtualDirectories) {
                            string directoryPath = Path.Combine(appDirectory, virtualDirectory);
                            CreateVirtualDirectory(
                                TestApplication + '/' + virtualDirectory, directoryPath, release, trust);
                        }
                    }
                }
                if (groups.Count > 0 || tests.Count > 0) {
                    result = TestMain(groups, tests, copyTestExeToLocalWorkingDir);
                }
                if (cleanup) {
                    DeleteVirtualDirectory(TestApplication);
                }
                return result;
            }
            catch (Exception e) {
                LogMessage(e.ToString());
                return 1;
            }

        }

        public int RunTests(ArrayList testNames, bool copyTestExeToLocalWorkingDir) {
            return RunTests(testNames, null, copyTestExeToLocalWorkingDir);
        }

        public int RunTests(ArrayList testNames, IDictionary requireNewIETests, bool copyTestExeToLocalWorkingDir) {

            int savedCodePage = GetConsoleOutputCP();
            SetConsoleOutputCP(1252);

            try {
                return RunTestsInternal(testNames, requireNewIETests, copyTestExeToLocalWorkingDir);
            }
            finally {
                // We need to restore the original CodePage, or it could
                // affect other suites (VSWhidbey 192224)
                SetConsoleOutputCP(savedCodePage);
            }
        }

        private int RunTestsInternal(ArrayList testNames, IDictionary requireNewIETests, bool copyTestExeToLocalWorkingDir) {

            bool failures = false;
            try {

                // Startup
                LogMessage("Starting Test");
                LogMessage("Launching IE");

                _ie = new IEApplication();
                _ie.Visible = true;
                Type thisType = this.GetType();


                foreach (string testName in testNames) {
                    if (requireNewIETests != null && requireNewIETests.Contains(testName)) {
                        _ie.Quit();
                        _ie = new IEApplication();
                        _ie.Visible = true;
                    }

                    LogMessage();
                    LogMessage("-------------------------------------------------------------------------------");
                    LogMessage("Running Test " + testName);
                    LogMessage("-------------------------------------------------------------------------------");

                    MethodInfo testMethod = thisType.GetMethod(testName);
                    bool versionSpecificTest = testMethod.IsDefined(typeof(VersionSpecificTestAttribute), true);

                    string testOutputBaseline;
                    string testOutputFile;
                    if (copyTestExeToLocalWorkingDir) {
                        string thisDirectory = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
                        string baselinesAndOutputDir = Path.Combine(thisDirectory, "BaselinesAndOutput");
                        if (versionSpecificTest) {
                            testOutputBaseline = Path.Combine(baselinesAndOutputDir, testName + SystemWebExtensionsVersion + ".bsl");
                            testOutputFile = Path.Combine(baselinesAndOutputDir, testName + SystemWebExtensionsVersion + ".out");
                        }
                        else {
                            testOutputBaseline = Path.Combine(baselinesAndOutputDir, testName + ".bsl");
                            testOutputFile = Path.Combine(baselinesAndOutputDir, testName + ".out");
                        }
                    }
                    else {
                        if (versionSpecificTest) {
                            testOutputBaseline = testName + SystemWebExtensionsVersion + ".bsl";
                            testOutputFile = testName + SystemWebExtensionsVersion + ".out";
                        }
                        else {
                            testOutputBaseline = testName + ".bsl";
                            testOutputFile = testName + ".out";
                        }
                    }

                    bool skip = SkipTest(testName);

                    // Make the test output go to its own file
                    _writer = new StreamWriter(testOutputFile);

                    if (skip) {
                        LogMessage("Test is skipped");
                    }
                    else {
                        try {
                            testMethod.Invoke(this, null);
                        }
                        catch (Exception ex) {
                            LogMessage(ex.ToString());

                            // If we get a NullReferenceException, it's probably that a test
                            // was looking for a specific tag (e.g. id=testOutput) and did not find it.
                            // Dump whatever is in the browser to help understand why it's not there.
                            if (ex.InnerException is NullReferenceException) {
                                LogMessage("Here is what's currently in the browser:");
                                LogMessage(IE.Body.GetProperty("innerHTML"));
                            }
                            failures = true;
                        }
                    }

                    _writer.Close();

                    // Restore the console writer
                    _writer = Console.Out;

                    if (!File.Exists(testOutputBaseline)) {
                        LogMessage("Missing baseline file '" + testOutputBaseline + "'");
                        failures = true;
                        continue;
                    }

                    if (skip || CompareFiles(testOutputBaseline, testOutputFile)) {
                        LogMessage("Test " + testName + " passed.");
                    }
                    else {
                        LogMessage("Test " + testName + " failed!");
                        LogMessage("Please make sure you don't have any third party IE extensions installed (i.e. google toolbar)");
                        LogMessage("Here is the incorrect output (" + testOutputFile + "):");
                        LogMessage();

                        LogMessage(StringFromFile(testOutputFile));
                        failures = true;
                    }

                }

                // Shutdown
                LogMessage();
                LogMessage("Closing IE");

                _ie.Quit();

                LogMessage("Test complete");
            }
            catch (Exception ex) {
                LogMessage("Exception thrown running test driver:\r\n" + ex.ToString());
                failures = true;
            }

            return (failures) ? 1 : 0;
        }

        public virtual void Setup() {
        }

        public virtual bool SkipTest(string testName) {
            return false;
        }

        /*
         * Return a String which holds the contents of a file
         */
        static String StringFromFile(string path) {
            // Create a reader on the file.
            // Generates an exception if the file can't be opened.
            StreamReader reader = new StreamReader(path);

            try {
                return reader.ReadToEnd();
            }
            finally {
                // Make sure we always close the stream
                if (reader != null)
                    reader.Close();
            }
        }

        protected abstract string TestApplication {
            get;
        }

        public int TestMain(ArrayList groups, ArrayList tests, bool copyTestExeToLocalWorkingDir) {
            Hashtable requireNewIETests = new Hashtable();

            if (tests.Count == 0 && groups.Count == 0) {
                return 0;
            }

            Type thisType = this.GetType();
            for (int i = 0; i < tests.Count; i++) {
                string testName = (string)tests[i];
                MethodInfo testMethod = thisType.GetMethod(testName, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Instance | BindingFlags.IgnoreCase);
                if (testMethod == null) {
                    throw new Exception("Test method not found: '" + testName + "'");
                }
                // Fix up name.
                tests[i] = testMethod.Name;
            }

            MethodInfo[] methods = thisType.GetMethods();
            bool isDebugMode = ConfigHelper.IsDebugMode(TestApplication);

            foreach (MethodInfo method in methods) {
                object[] attrs = method.GetCustomAttributes(typeof(IETestGroupAttribute), false);
                foreach (IETestGroupAttribute testAttr in attrs) {
                    foreach (string groupName in groups) {
                        if (string.Compare(testAttr.GroupName, groupName, true, CultureInfo.InvariantCulture) == 0) {
                            // test is in the right group
                            IETestMode mode = testAttr.Mode;
                            if(mode == IETestMode.DebugAndRelease ||
                                (isDebugMode && mode == IETestMode.DebugOnly) ||
                                (!isDebugMode && mode == IETestMode.ReleaseOnly)) {

                                tests.Add(method.Name);
                                object[] spawn = method.GetCustomAttributes(typeof(SpawnNewIEAttribute), false);
                                if(spawn.Length > 0) {
                                    requireNewIETests.Add(method.Name, "");
                                }
                            }
                        }
                    }
                }
            }

            if (tests.Count == 0) {
                LogMessage("No matching tests found");
                WriteHelp();
                return 1;
            }

            // Avoid sensitivity to reflection by sorting the list.
            tests.Sort(StringComparer.InvariantCultureIgnoreCase);

            return RunTests(tests, requireNewIETests, copyTestExeToLocalWorkingDir);
        }

        void WriteHelp() {
            LogMessage("Usage:");
            LogMessage();
            LogMessage("/g:<group name>|/t:<test name> [/setup] [/cleanup]");
            LogMessage();
            LogMessage("More help on command-line options:");
            LogMessage("/?, /h[elp]            Prints this message.");
            LogMessage("/g[group]:<name>       Name of group of tests to run.");
            LogMessage("/t[test]:<name>        Method name of specific test.");
            LogMessage("/setup                 Create the IIS virtual directory.");
            LogMessage("/trust:<level>         Use the specified trust level for the application.");
            LogMessage("/release               Use <compilation debug=\"false\"> in web.config.");
            LogMessage("/cleanup               Remove the IIS virtual directory.");
        }
    }
}

