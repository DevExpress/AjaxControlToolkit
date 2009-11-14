


using System;
using System.Web;
using System.Collections;
using System.Collections.Specialized;
using System.Text.RegularExpressions;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Xml;


/// <summary>
/// Helper web service for CascadingDropDown sample
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService()]
public class CarsService : System.Web.Services.WebService
{
    // Member variables
    private readonly XmlDocument _document;
    private readonly XmlDocument _documentDefaults;
    private readonly string[] _hierarchy;
    private readonly Regex _inputValidationRegex;

    /// <summary>
    /// Constructor to initialize members
    /// </summary>
    public CarsService()
    {
        // Read XML data from disk
        _document = new XmlDocument();
        _document.Load(Server.MapPath("~/App_Data/CarsService.xml"));
        _documentDefaults = new XmlDocument();
        _documentDefaults.Load(Server.MapPath("~/App_Data/CarsServiceWithDefault.xml"));

        // Represent the hierarchy of data - "make" controls "model" (which implicitly controls "color")
        _hierarchy = new string[] { "make", "model" };

        // Regex for input validation
        _inputValidationRegex = new Regex("^[0-9a-zA-Z \\(\\)]*$");
    }

    /// <summary>
    /// Helper web service method
    /// </summary>
    /// <param name="knownCategoryValues">private storage format string</param>
    /// <param name="category">category of DropDownList to populate</param>
    /// <returns>list of content items</returns>
    [WebMethod]
    public AjaxControlToolkit.CascadingDropDownNameValue[] GetDropDownContents(string knownCategoryValues, string category)
    {
        // Get a dictionary of known category/value pairs
        StringDictionary knownCategoryValuesDictionary = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);

        // Perform a simple query against the data document
        return AjaxControlToolkit.CascadingDropDown.QuerySimpleCascadingDropDownDocument(_document, _hierarchy, knownCategoryValuesDictionary, category, _inputValidationRegex);
    }

    /// <summary>
    /// Helper web service method
    /// </summary>
    /// <param name="knownCategoryValues">private storage format string</param>
    /// <param name="category">category of DropDownList to populate</param>
    /// <returns>list of content items with defaults</returns>
    [WebMethod]
    public AjaxControlToolkit.CascadingDropDownNameValue[] GetDropDownContentsWithDefaults(string knownCategoryValues, string category)
    {
        // Get a dictionary of known category/value pairs
        StringDictionary knownCategoryValuesDictionary = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);

        // Perform a simple query against the data document
        return AjaxControlToolkit.CascadingDropDown.QuerySimpleCascadingDropDownDocument(_documentDefaults, _hierarchy, knownCategoryValuesDictionary, category, _inputValidationRegex);
    }
}
