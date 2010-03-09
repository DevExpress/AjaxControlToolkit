<%@ Page Language="C#" %>

<%@ Register Assembly="System.Web.Ajax" Namespace="System.Web.UI" TagPrefix="asp" %>
<%@ Register Namespace="SDRServerControls" Assembly="SDRServerControls" TagPrefix="sdr" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
This sample shows a server control (see ServerControls project in this solution), 
which wraps the ImageView client control (derived from DataView), shown in an 
earlier sample. 
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Server ImageView</title>
    <link href="../Styles/images.css" rel="stylesheet" type="text/css" />
</head>
<body xmlns:sys="javascript:Sys">
    <form id="form1" runat="server">
        <asp:AjaxScriptManager ID="AjaxScriptManager1" runat="server" EnablePartialRendering="false">
            <Scripts>
                <asp:ScriptReference Name="MicrosoftAjaxTemplates.js" />
            </Scripts>
        </asp:AjaxScriptManager>
        
        <script type="text/javascript">
            var gallery = [
                { Name: "Morro Rock", Uri: "../images/p58.jpg" },
                { Name: "Seagull reflections", Uri: "../images/p52.jpg" },
                { Name: "Pier", Uri: "../images/p59.jpg" },
                { Name: "Giraffe Zoom", Uri: "../images/p183.jpg" },
                { Name: "Oryx", Uri: "../images/p172.jpg" }
            ],
            editMode,
            imagesList;
            
            Sys.converters.boolToString = function(value, binding) {
                return value ? binding.trueValue : binding.falseValue
            }

            Sys.onReady(function() {
                Sys.addHandler("#switchMode", "click", function() {
                    Sys.Observer.setValue(window, "editMode", !editMode);
                    Sys.get("$imagesListView").set_editMode(editMode);
                });
            });
        </script>

        <input id="switchMode" type="button" sys:value="{binding editMode, source={{window}}, convert=boolToString, trueValue=Browse, falseValue=Edit}"/>  

        <div class="imageslist" >
            <sdr:ImageView runat="server" ID="imagesListView" Data="gallery"></sdr:ImageView>
        </div>
    
    </form>
</body>
</html>
