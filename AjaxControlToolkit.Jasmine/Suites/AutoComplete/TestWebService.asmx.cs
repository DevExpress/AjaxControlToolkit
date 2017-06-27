using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web.Script.Services;
using System.Web.Services;

namespace AjaxControlToolkit.Jasmine.Suites.AutoComplete {
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [ToolboxItem(false)]
    [ScriptService]
    public class TestWebService : System.Web.Services.WebService {
        [WebMethod]
        public List<string> GetSampleData(string prefixText, int count) {
            return new List<string> {
                "AB",
                "ABC",
                "ABCD",
                "ABCDE",
                "ABCDEF"
            };
        }
    }
}
