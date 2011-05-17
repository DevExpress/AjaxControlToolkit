namespace JSBuild {
    using System;
    using System.IO;
    using System.Threading;
    using Microsoft.Build.Framework;
    using Microsoft.Build.Utilities;
    using System.Diagnostics;
    using System.Collections.Generic;

    public class QUnit : Task {
        public QUnit() {
            TimeOut = 60;
        }
        
        [Required]
        public string TestPath {
            get; set;
        }

        [Required]
        public string[] Browsers {
            get;
            set;
        }
        
        public string[] BrowserNames {
            get;
            set;
        }
        
        public string[] BrowserArguments {
            get;
            set;
        }
        
        public int[] BrowserConcurrencies {
            get;
            set;
        }

        [Required]
        public string LogDirectory {
            get;
            set;
        }
        
        public int TimeOut {
            get;
            set;
        }

        public override bool Execute() {
            string fileName = Path.GetFileNameWithoutExtension(TestPath);
            // clear existing log and err files
            foreach (string file in Directory.GetFiles(LogDirectory, "*.log")) {
                File.Delete(file);
            }
            foreach (string file in Directory.GetFiles(LogDirectory, "*.err")) {
                File.Delete(file);
            }

            if (BrowserNames != null && BrowserNames.Length > 0) {
                if (BrowserNames.Length != Browsers.Length) {
                    throw new InvalidOperationException("BrowserNames must be the same length as Browsers. Specify a browser name for all browsers.");
                }
            }
            else {
                BrowserNames = new string[Browsers.Length];
            }
            if (BrowserArguments != null && BrowserArguments.Length > 0) {
                if (BrowserArguments.Length != Browsers.Length) {
                    throw new InvalidOperationException("BrowserArguments must be the same length as Browsers. Specify arguments for all browsers.");
                }
            }
            else {
                BrowserArguments = new string[Browsers.Length];
            }
            if (BrowserConcurrencies != null && BrowserConcurrencies.Length > 0) {
                if (BrowserConcurrencies.Length != Browsers.Length) {
                    throw new InvalidOperationException("BrowserConcurrencies must be the same length as Browsers. Specify a concurrence level for all browsers.");
                }
            }
            else {
                BrowserConcurrencies = new int[Browsers.Length];
            }         
            // launch all the browsers
            int concurrency = 0;   
            bool higherConcurrency;
            bool failedToKill = false;
            List<BrowserTestInfo> tests = new List<BrowserTestInfo>();
            do {
                int i = 0;
                higherConcurrency = false;
                foreach (string browser in Browsers) {
                    int browserConcurrency = BrowserConcurrencies[i];
                    if (browserConcurrency == concurrency) {
                        tests.Add(StartBrowser(browser, fileName, BrowserNames[i], BrowserArguments[i], concurrency));
                    }
                    else if (browserConcurrency > concurrency) {
                        higherConcurrency = true;
                    }
                    i++;
                }

                // wait for each to finish
                int maxSeconds = TimeOut;
                while (maxSeconds-- > 0) {
                    bool done = true;
                    foreach (var test in tests) {
                        if (test.Concurrency == concurrency && !test.Done) {
                            done = done && test.CheckForLog();
                        }
                    }
                    if (done) break;
                    if (maxSeconds == 0) {
                        foreach(var test in tests) {
                            if (test.Concurrency == concurrency && !test.Done) {
                                test.TimeOut();
                            }
                        }
                    }
                    else {
                        Thread.Sleep(1000);
                    }
                }
                
                concurrency++;
                if (higherConcurrency && !WaitForExitAndKill(tests)) {
                    failedToKill = true;
                    // cannot kill the browsers in the current concurrency level,
                    // don't bother going to the next level.
                    // For example, if FF3.0 is running, we cannot run FF3.5.
                    break;
                }
            }
            while(higherConcurrency);
            
            // make sure all browsers shut down if we didn't already try that
            if (!failedToKill) {
                WaitForExitAndKill(tests);
            }
            
            // log errors if any
            foreach(var test in tests) {
                if (!string.IsNullOrEmpty(test.ErrContent)) {
                    Log.LogError(String.Format("Test '{2}' failed in browser '{0}'. {1}", test.BrowserName, test.ErrContent, test.TestName));
                }
            }
            return !Log.HasLoggedErrors;
        }
        
        private bool WaitForExit(List<BrowserTestInfo> tests) {
            bool waiting = true;
            int maxSeconds = 5;
            while (waiting && maxSeconds > 0) {
                waiting = false;
                foreach(var test in tests) {
                    if (test.Done && !test.BrowserProcess.HasExited) {
                        test.BrowserProcess.WaitForExit(1000);
                        waiting = true;
                        break;
                    }
                }
                maxSeconds--;
            }
            return !waiting;
        }
        
        private bool WaitForExitAndKill(List<BrowserTestInfo> tests) {
            // give old browsers time to shut down
            if (!WaitForExit(tests)) {
                // try to force kill them
                foreach(var test in tests) {
                    if (test.Done && !test.BrowserProcess.HasExited) {
                        try {
                            test.BrowserProcess.Kill();
                        }
                        catch (InvalidOperationException) {
                        }
                    }
                }
                // wait some more
                if (!WaitForExit(tests)) {
                    foreach(var test in tests) {
                        if (test.Done && !test.BrowserProcess.HasExited) {
                            test.ErrContent = (String.IsNullOrEmpty(test.ErrContent) ? "" : (test.ErrContent + " ")) + "Test was completed but the browser process could not be shut down, possibly preventing further browser instances from being launched.";
                        }
                    }
                    return false;
                }
            }
            return true;
        }

        private BrowserTestInfo StartBrowser(string browserPath, string baseFileName, string explicitBrowserName, string arguments, int concurrency) {
            string browserName = String.IsNullOrEmpty(explicitBrowserName) ? Path.GetFileNameWithoutExtension(browserPath) : explicitBrowserName;
            string logName = Path.Combine(LogDirectory, baseFileName + "-" + browserName + ".log");
            string errName = Path.Combine(LogDirectory, baseFileName + "-" + browserName + ".err");
            string url = TestPath;
            url += (url.Contains("?") ? "&" : "?") + "log=" + browserName.Replace(" ", "");
            if (!String.IsNullOrEmpty(arguments)) {
                if (arguments == "(none)") {
                    arguments = "";
                }
                else {
                    arguments = " " + arguments;
                }
            }
            else {
                arguments = "";
            }
            return new BrowserTestInfo {
                Concurrency = concurrency,
                BrowserProcess = Process.Start(browserPath, url + arguments),
                BrowserName = browserName,
                TestName = baseFileName,
                LogPath = logName,
                ErrPath = errName };
        }

        private class BrowserTestInfo {
            public Process BrowserProcess;
            public string BrowserName;
            public string LogPath;
            public string ErrPath;
            public string TestName;
            public int Concurrency;

            public bool Done;
            public string LogContent;
            public string ErrContent;

            public bool CheckForLog() {
                if (File.Exists(LogPath)) {
                    LogContent = File.ReadAllText(LogPath);
                    if (File.Exists(ErrPath)) {
                        ErrContent = File.ReadAllText(ErrPath);
                    }
                    Done = true;
                    if (!BrowserProcess.HasExited) {
                        BrowserProcess.CloseMainWindow();
                    }
                }
                return Done;
            }
            
            public void TimeOut() {
                if (Done) {
                    throw new InvalidOperationException("Completed tests should not be marked as timed out.");
                }
                Done = true;
                ErrContent = String.Format("Test '{2}' timed out in browser '{0}'. {1}", BrowserName, ErrContent, TestName);
                if (!BrowserProcess.HasExited) {
                    BrowserProcess.CloseMainWindow();
                }
            }
        }
    }
}
