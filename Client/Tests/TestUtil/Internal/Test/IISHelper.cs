namespace Microsoft.Internal.Test {
    using System;
    using System.Diagnostics;
    using System.DirectoryServices;
    using System.IO;
    using System.Net;
    using System.Threading;
    using System.Web;
    using System.Runtime.InteropServices;
    using Microsoft.Web.Administration;

    public static class IISHelper {
        private const int webSiteNum = 1;
        private const string SUITES_APP_POOL_NAME = "DefaultAppPool";

        public static void CreateVDir(string virtualDirectoryName, string path, string serverName) {
            DirectoryEntry iisSchema;
            DirectoryEntry iisAdmin;
            DirectoryEntry vDir;
            bool iisUnderNT;
            bool appPoolsSupported = false;
            string regiis = Path.Combine(HttpRuntime.AspInstallDirectory, "aspnet_regiis.exe"); // Exe path

            // Determine version of IIS
            iisSchema = new DirectoryEntry("IIS://" + serverName + "/Schema/AppIsolated");
            if (iisSchema.Properties["Syntax"].Value.ToString().ToUpper() == "BOOLEAN")
                iisUnderNT = true;
            else
                iisUnderNT = false;
            iisSchema.Dispose();


            // Create V4AppPool
            appPoolsSupported = CreateV4AppPool(serverName);

            // Get the admin object
            iisAdmin = new DirectoryEntry("IIS://" + serverName + "/W3SVC/" + webSiteNum + "/Root");

            // If we're not creating a root directory
            // If the virtual directory already exists then delete it

            foreach (DirectoryEntry v in iisAdmin.Children) {
                if (v.Name == virtualDirectoryName) {
                    // Delete the specified virtual directory if it already exists
                    iisAdmin.Invoke("Delete", new string[] { v.SchemaClassName, virtualDirectoryName });
                    iisAdmin.CommitChanges();
                }
            }

            // Create the virtual directory
            vDir = iisAdmin.Children.Add(virtualDirectoryName, "IIsWebVirtualDir");

            // Setup the vDir
            vDir.Properties["AccessRead"][0] = true;
            vDir.Properties["AccessExecute"][0] = false;
            vDir.Properties["AccessWrite"][0] = false;
            vDir.Properties["AccessScript"][0] = true;
            vDir.Properties["AuthNTLM"][0] = false;
            vDir.Properties["EnableDefaultDoc"][0] = true;
            vDir.Properties["EnableDirBrowsing"][0] = true;
            vDir.Properties["DefaultDoc"][0] = true;
            vDir.Properties["Path"][0] = path;

            // NT doesn't support this property
            if (!iisUnderNT) {
                vDir.Properties["AspEnableParentPaths"][0] = true;
            }

            if (appPoolsSupported) {
                vDir.Properties["AppPoolId"].Value = SUITES_APP_POOL_NAME;
            }

            // Set the changes
            vDir.CommitChanges();

            // Make it a web application
            if (iisUnderNT) {
                vDir.Invoke("AppCreate", false);
            }
            else {
                vDir.Invoke("AppCreate", 1);
            }

            Process  p = Process.Start(regiis, " -sn W3SVC/" + webSiteNum + "/Root/" + virtualDirectoryName + " -norestart");
            p.WaitForExit();

            // Call RecycleAppPool() on IIS7, WaitFOrVDir() elsewhere
            if (!RecycleAppPool()) {
                WaitForVDir(virtualDirectoryName, serverName);
            }
        }

        public static bool RecycleAppPool() {
            // Call AppPoolRecycle On Windows Server 2008 since the application may be unavailable after creation
            if (Environment.OSVersion.Version.Major >= 6) {
                RecycleAppPool(SUITES_APP_POOL_NAME);
                return true;
            }
            else {
                return false;
            }
        }

        public static void RecycleAppPool(string appPoolName) {
            if (appPoolName == null) {
                throw new ArgumentNullException("appPoolName");
            }

            // On Windows Server 2008, the application may be unavailable for several seconds after
            // it is created, so we recyle the application pool until it is ready (for a maximum 30 seconds).
            if (Environment.OSVersion.Version.Major < 6) {
                throw new InvalidOperationException("RecycleAppPool should only be invoked on Vista or WS08");
            }

            using (ServerManager m = new ServerManager()) {
                int elapsedMilliSecond = 0;
                ApplicationPool pool = m.ApplicationPools[appPoolName];
                
                if (pool == null) {
                    throw new ArgumentException(
                        String.Format("Could not find application pool '{0}'.", appPoolName), "appPoolName");
                }
                
                try {
                    pool.Stop();
                }
                catch (COMException) {
                    //Pool Status was Stopped or Stopping
                }
                finally {
                    while (pool.State != ObjectState.Stopped && elapsedMilliSecond <= 30000) {
                        Thread.Sleep(10);
                        elapsedMilliSecond += 10;
                    }
                    if (pool.State != ObjectState.Stopped) {
                        throw new InvalidOperationException("AppPool can't be stopped during recycle!");
                    }
                }

                pool.Start();
                elapsedMilliSecond = 0;
                while (pool.State != ObjectState.Started && elapsedMilliSecond <= 30000) {
                    Thread.Sleep(10);
                    elapsedMilliSecond += 10;
                } 
                if (pool.State != ObjectState.Started) {
                    throw new InvalidOperationException("AppPool can't be started during recycle!");
                }
            }
        }

        public static void WaitForVDir(string virtualDirectoryName, string serverName) {
            // The application may be unavailable for several seconds after it is created,
            // so we poll the application until it is ready (for a maximum 10 seconds).
            // This can be called when needed for IIS6 or lower version.
            for (int iter = 0; iter < 100; iter++) {
                try {
                    // Poll by making requests for the directory listing at the application root.
                    // HttpWebRequest.GetResponse() will throw if the server returns an error.
                    string appRoot = "http://" + serverName + "/" + virtualDirectoryName + "/";
                    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(appRoot);

                    // Must dispose HttpWebResponse to avoid leaking resources.
                    using (HttpWebResponse response = (HttpWebResponse)request.GetResponse()) {
                    }
                }
                catch {
                    Thread.Sleep(100);
                }
            }
        }

        public static void DeleteVDir(string virtualDirectoryName, string serverName) {
            // Get the admin object
            DirectoryEntry iisAdmin = new DirectoryEntry("IIS://" + serverName + "/W3SVC/" + webSiteNum + "/Root");

            foreach (DirectoryEntry v in iisAdmin.Children) {
                if (v.Name == virtualDirectoryName) {
                    // Delete the specified virtual directory if it already exists
                    iisAdmin.Invoke("Delete", new string[] { v.SchemaClassName, virtualDirectoryName });
                    iisAdmin.CommitChanges();
                }
            }
        }

        static bool CreateV4AppPool(string serverName)
        {
            try {
                using (DirectoryEntry appPool = new DirectoryEntry("IIS://" + serverName + "/W3SVC/AppPools/" + SUITES_APP_POOL_NAME)) {
                    if (appPool != null) // already exists
                        return true;
                }

                using (DirectoryEntry iisAppPools = new DirectoryEntry("IIS://" + serverName + "/W3SVC/AppPools")) {
                    if (iisAppPools == null)
                        return false; // app pools not suported
                    using (DirectoryEntry newpool = iisAppPools.Children.Add(SUITES_APP_POOL_NAME, "IIsApplicationPool")) {
                        newpool.CommitChanges();
                    }
                }
                return true;
            } catch {}
            return false;
        }


    }
}
