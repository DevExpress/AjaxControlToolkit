<%@ Page Language="C#" %>
<script runat="server">
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static AjaxControlToolkit.CascadingDropDownNameValue[] GetCarData(string knownCategoryValues, string category) {
        // Get a dictionary of known category/value pairs
        StringDictionary known = AjaxControlToolkit.CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
        AjaxControlToolkit.CascadingDropDownNameValue[] values = null;
        switch (category) {
            case "make":
                values = new AjaxControlToolkit.CascadingDropDownNameValue[] {
                    new AjaxControlToolkit.CascadingDropDownNameValue("Acura", "ac"),
                    new AjaxControlToolkit.CascadingDropDownNameValue("Audi", "au"),
                    new AjaxControlToolkit.CascadingDropDownNameValue("BMW", "bw"),
                };
                break;
            case "model":
                switch (known["make"]) {
                    case "ac":
                        values = new AjaxControlToolkit.CascadingDropDownNameValue[] {
                                    new AjaxControlToolkit.CascadingDropDownNameValue("Integra", "integra"),
                                    new AjaxControlToolkit.CascadingDropDownNameValue("RSX", "rsx"),
                                    new AjaxControlToolkit.CascadingDropDownNameValue("TL", "tl"),
                                };
                        break;
                    case "au":
                        values = new AjaxControlToolkit.CascadingDropDownNameValue[] {
                                    new AjaxControlToolkit.CascadingDropDownNameValue("A4", "a4"),
                                    new AjaxControlToolkit.CascadingDropDownNameValue("S4", "s4"),
                                    new AjaxControlToolkit.CascadingDropDownNameValue("A6", "a6"),
                                };
                        break;
                    case "bw":
                        values = new AjaxControlToolkit.CascadingDropDownNameValue[] {
                                    new AjaxControlToolkit.CascadingDropDownNameValue("3 Series", "3"),
                                    new AjaxControlToolkit.CascadingDropDownNameValue("5 Series", "5"),
                                    new AjaxControlToolkit.CascadingDropDownNameValue("7 Series", "7"),
                                };
                        break;
                    default:
                        break;
                }
                break;
            case "color":
                values = new AjaxControlToolkit.CascadingDropDownNameValue[] {
                            new AjaxControlToolkit.CascadingDropDownNameValue("Red " + known["make"] + " " + known["model"], "red"),
                            new AjaxControlToolkit.CascadingDropDownNameValue("Blue " + known["make"] + " " + known["model"], "blue"),
                            new AjaxControlToolkit.CascadingDropDownNameValue("White " + known["make"] + " " + known["model"], "white"),
                        };
                break;
        }
        return values;
    }
</script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
</head>
<body>
    <form runat="server">
        <asp:AjaxScriptManager runat="server" EnablePartialRendering="false" EnablePageMethods="true" />
        <script type="text/javascript">
            Sys.debug = true;
            Sys.require(Sys.components.cascadingDropDown, function() {
                Sys.create.cascadingDropDown.defaults = {
                    ServiceMethod: "GetCarData",
                    PromptText: "[Select]"
                };
                Sys.create.cascadingDropDown("#make", {
                    Category: "make"
                });
                Sys.create.cascadingDropDown("#model", {
                    Category: "model",
                    ParentControlID: "make"
                });
                Sys.create.cascadingDropDown("#color", {
                    Category: "color",
                    ParentControlID: "model"
                });
            });
        </script>
        
        <select id="make"></select><br />
        <select id="model"></select><br />
        <select id="color"></select>

    </form>
</body>
</html>
