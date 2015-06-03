using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace AjaxControlToolkit.Jasmine.Suites.CascadingDropDownTests {

    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TestWebService : System.Web.Services.WebService {

        [WebMethod]
        public AjaxControlToolkit.CascadingDropDownNameValue[] GetContents(string knownCategoryValues, string category) {
            return new CascadingDropDownNameValue[] {
                new CascadingDropDownNameValue {
                    isDefaultValue = false,
                    name = category + "_AAAName",
                    optionTitle = category + "_AAATitle",
                    value = category + "_AAAValue"
                },
                new CascadingDropDownNameValue {
                    isDefaultValue = false,
                    name = category + "_BBBName",
                    optionTitle = category + "_BBBTitle",
                    value = category + "_BBBValue"
                },
                new CascadingDropDownNameValue {
                    isDefaultValue = false,
                    name = category + "_CCCName",
                    optionTitle = category + "_CCCTitle",
                    value = category + "_CCCValue"
                },
                new CascadingDropDownNameValue {
                    isDefaultValue = false,
                    name = category + "_DDDName",
                    optionTitle = category + "_DDDTitle",
                    value = category + "_DDDValue"
                }
            };
        }
    }
}
