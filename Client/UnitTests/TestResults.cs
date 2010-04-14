using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;

namespace UnitTests {
    public class TestResults {
        public int total;
        public int succeeded;
        public int failed;
        public bool timedOut;

        public void WriteToFile(string browserName) {
            var context = HttpContext.Current;
            var server = context.Server;
            var filePath = server.MapPath(HttpContext.Current.Request.CurrentExecutionFilePath);
            var fileName = Path.GetFileNameWithoutExtension(filePath);
            if (!String.IsNullOrEmpty(browserName)) {
                filePath = HttpContext.Current.Server.MapPath("~/logs/" + fileName + "-" + browserName);
            }
            else {
                filePath = HttpContext.Current.Server.MapPath("~/logs/" + fileName);
            }

            if (failed > 0) {
                File.WriteAllText(filePath + ".err", failed.ToString(CultureInfo.InvariantCulture));
            }
            File.WriteAllText(filePath + ".log", String.Format(CultureInfo.InvariantCulture, "{1} passed, {2} failed, out of {0} tests.", total, succeeded, failed));
        }
    }
}