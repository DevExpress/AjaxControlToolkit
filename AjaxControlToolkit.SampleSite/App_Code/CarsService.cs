using AjaxControlToolkit;
using System;
using System.Collections.Specialized;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Xml;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class CarsService : WebService {
    static XmlDocument _document;
    static Regex _inputValidationRegex;
    static object _lock = new object();

    // we make these public statics just so we can call them from externally for the
    // page method call
    public static XmlDocument Document {
        get {
            lock(_lock) {
                if(_document == null) {
                    _document = new XmlDocument();
                    _document.Load(HttpContext.Current.Server.MapPath("~/App_Data/CarsService.xml"));
                }
            }
            return _document;
        }
    }

    public static string[] Hierarchy {
        get { return new string[] { "make", "model" }; }
    }

    public static Regex InputValidationRegex {
        get {
            lock(_lock) {
                if(null == _inputValidationRegex) {
                    _inputValidationRegex = new Regex("^[0-9a-zA-Z \\(\\)]*$");
                }
            }
            return _inputValidationRegex;
        }
    }

    [WebMethod]
    public AjaxControlToolkit.CascadingDropDownNameValue[] GetDropDownContents(string knownCategoryValues, string category) {
        var knownCategoryValuesDictionary = CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
        return CascadingDropDown.QuerySimpleCascadingDropDownDocument(Document, Hierarchy, knownCategoryValuesDictionary, category, InputValidationRegex);
    }
}
