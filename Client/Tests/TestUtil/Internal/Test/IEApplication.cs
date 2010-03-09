namespace Microsoft.Internal.Test {
    using Microsoft.Win32;
    using System;
    using System.Threading;
    using System.Reflection;
    using System.Runtime.InteropServices;

    public class IEApplication {
        private const int RetryTime = 10;
        private const int DefaultTimeout = 60000;

        Type ieType;
        object ieObject;

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool SetForegroundWindow(int hwnd);

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(int hWnd, int nCmdShow);

        public IEApplication() {
            ieType = Type.GetTypeFromProgID("InternetExplorer.Application");
            ieObject = Activator.CreateInstance(ieType);
        }

        public IEElement this[string id] {
            get {
                return GetElement(id);
            }
        }

        public bool Visible {
            set {
                ieType.InvokeMember("Visible", BindingFlags.IgnoreCase | BindingFlags.SetProperty, null, ieObject, new object[] { value });
            }
        }

        public object Document {
            get {
                return ieType.InvokeMember("Document", BindingFlags.IgnoreCase | BindingFlags.GetProperty, null, ieObject, null);
            }
        }

        public object Elements {
            get {
                object doc = Document;
                return ieType.InvokeMember("All", BindingFlags.IgnoreCase | BindingFlags.GetProperty, null, doc, null);
            }
        }

        public int HostReadyState {
            get {
                object retVal = ieType.InvokeMember("ReadyState", BindingFlags.IgnoreCase | BindingFlags.GetProperty, null, ieObject, null);
                return (int)retVal;
            }
        }

        public string ReadyState {
            get {
                object doc = Document;
                object retVal = ieType.InvokeMember("ReadyState", BindingFlags.IgnoreCase | BindingFlags.GetProperty, null, doc, null);
                return (retVal == null ? String.Empty : retVal.ToString());
            }
        }

        public string Title {
            get {
                object doc = Document;
                object retVal = ieType.InvokeMember("Title", BindingFlags.IgnoreCase | BindingFlags.GetProperty, null, doc, null);
                return (retVal == null ? String.Empty : retVal.ToString());
            }
        }

        public IEElement Body {
            get {
                object doc = Document;
                object retVal = ieType.InvokeMember("Body", BindingFlags.IgnoreCase | BindingFlags.GetProperty, null, doc, null);
                if (retVal == null) {
                    return null;
                }
                else {
                    return new IEElement(retVal, ieType);
                }
            }
        }

        public bool BringToFront() {
            // get hwnd for IE window
            int hwnd = (int) ieType.InvokeMember("hwnd",
                BindingFlags.IgnoreCase | BindingFlags.GetProperty,
                null,
                ieObject,
                null);
            // make sure the window is not minimized and is on top of other windows
            return ShowWindow(hwnd, /*Restore*/ 9) &&
                SetForegroundWindow(hwnd);
        }

        public IEElement GetElement(string elementName) {
            return GetElement(elementName, 0);
        }

        // If there are multiple elements with the same name, returns the element corresponding
        // to the index.
        public IEElement GetElement(string elementName, int index) {
            object elements = Elements;
            object retVal = ieType.InvokeMember("item", BindingFlags.InvokeMethod,
                                null, elements, new object[] { elementName, index });
            if (retVal == null) {
                return null;
            }
            else {
                return new IEElement(retVal, ieType);
            }
        }

        public void GoBack() {
            ieType.InvokeMember("GoBack", BindingFlags.InvokeMethod, null, ieObject, new object[] { });
        }

        public void GoForward() {
            ieType.InvokeMember("GoForward", BindingFlags.InvokeMethod, null, ieObject, new object[] { });
        }

        public void Navigate(string url) {
            Navigate(url, false);
        }
        
        public void Navigate(string url, bool ignoreErrors) {
            ieType.InvokeMember("Navigate", BindingFlags.InvokeMethod, null, ieObject, new object[] { url });
            WaitForDocument(ignoreErrors);
        }

        public void Quit() {
            // NDPWhidbey 18287: When IE quits sometimes it raises an out of
            // memory exception.  We workaround it by ignore this exception
            // as it is safe to do so since it is shutting down anyway.
            try {
                ieType.InvokeMember("Quit", BindingFlags.InvokeMethod, null, ieObject, null);
            }
            catch (System.Reflection.TargetInvocationException e) {
                System.OutOfMemoryException noMemoryException = null;
                if (e.InnerException != null) {
                    noMemoryException = e.InnerException as System.OutOfMemoryException;
                }

                // We rethrow other exceptions to catch other errors.
                if (noMemoryException == null) {
                    throw;
                }
            }
        }

        public void Refresh() {
            ieType.InvokeMember("Refresh", BindingFlags.InvokeMethod, null, ieObject, new object[] { });
        }

        public IEElement WaitForElement(string id) {
            return WaitForElement(id, DefaultTimeout);
        }

        public IEElement WaitForElement(string id, int timeout) {
            int retries = (timeout + (RetryTime - 1)) / RetryTime;

            for (int i = 0; i < retries; i++) {
                try {
                    IEElement elem = GetElement(id);
                    if (elem != null) {
                        return elem;
                    }
                }
                catch {
                    // Ignore exceptions since they might be thrown if the element doesn't exist
                }

                System.Threading.Thread.Sleep(RetryTime);
            }

            throw new Exception("Timed out waiting for the element '" + id + "'.");
        }

        public void WaitForDocument() {
            WaitForDocument(false);
        }

        public void WaitForDocument(bool ignoreError) {
            while (true) {
                try {
                    // This will throw exceptions if queried too early.
                    if (HostReadyState == 4) {
                        while (true) {
                            try {
                                // This will thow exceptions if queried to early. We can ignore them
                                if (ReadyState == "complete") {
                                    break;
                                }
                            }
                            catch (Exception) {
                            }
                            Thread.Sleep(RetryTime);
                        }
                        break;
                    }
                }
                catch (Exception) {
                }
                Thread.Sleep(RetryTime);
            }

            if (!ignoreError) {
                string bodyHTML = Body.GetProperty("innerHTML");
                if (bodyHTML.IndexOf("Server Error") >= 0) {
                    throw new Exception("Page had an error: " + bodyHTML);
                }
            }
        }

        public bool WaitForValue(IEElement element, string propertyName, string expectedValue) {
            return WaitForValue(element, DefaultTimeout, propertyName, expectedValue);
        }

        public bool WaitForValue(IEElement element, int timeout, string propertyName, string expectedValue) {
            if (element == null) {
                return false;
            }

            int retries = (timeout + (RetryTime - 1)) / RetryTime;

            for (int i = 0; i < retries; i++) {
                if (element.GetProperty(propertyName) == expectedValue) {
                    return true;
                }

                System.Threading.Thread.Sleep(RetryTime);
            }

            throw new Exception("Timed out waiting for the property '" + propertyName + "' with an expected value of '" + expectedValue + "'.");
        }

        public bool WaitForValueById(string elementId, string propertyName, string expectedValue) {
            return WaitForValueById(elementId, DefaultTimeout, propertyName, expectedValue);
        }

        public bool WaitForValueById(string elementId, int timeout, string propertyName, string expectedValue) {
            int retries = (timeout + (RetryTime - 1)) / RetryTime;

            for (int i = 0; i < retries; i++) {
                IEElement element = this[elementId];
                if ((element != null) && (element.GetProperty(propertyName) == expectedValue)) {
                    return true;
                }

                System.Threading.Thread.Sleep(RetryTime);
            }

            throw new Exception("Timed out waiting for the property '" + propertyName + "' with an expected value of '" + expectedValue + "'.");
        }
    }
}
