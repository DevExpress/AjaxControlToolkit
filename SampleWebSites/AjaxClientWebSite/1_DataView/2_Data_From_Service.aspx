<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
This sample shows how to use a generated AJAX proxy for a WCF 
AJAX-enabled service to retrieve data, and then display the 
returned data using a Microsoft Ajax DataView control.

The AJAX proxy is created by adding a ServiceReference under the 
Script Manager, in an aspx page.
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Data from Service ASPX</title>
    <link href="../Styles/images.css" rel="stylesheet" type="text/css"/>
</head>

<body xmlns:dataview="javascript:Sys.UI.DataView" xmlns:sys="javascript:Sys">
    <form id="form1" runat="server">
        <act:ToolkitScriptManager ID="AjaxScriptManager1" runat="server" EnablePartialRendering="false"
            CombineScripts="false" ScriptMode="Debug">
            <Scripts>
                <asp:ScriptReference Path="~/Scripts/jQuery/jquery-1.4.1.js"/>
                <asp:ScriptReference Name="MicrosoftAjaxTemplates.js" />
            </Scripts>
            <Services>
                <asp:ServiceReference Path="~/Services/ImagesWcfService.svc" />
            </Services>
        </act:ToolkitScriptManager>

        <script type="text/javascript">
            var imagesList;
            Sys.onReady(function() {
                // Create DataView
                imagesList = Sys.query(".imageslist").dataView().get(0);

                // Call Web service proxy from script
                Uc.ImagesWcfService.GetImages("Name", querySucceeded);
            });

            function querySucceeded(results) {
                // Set returned data on DataView
                imagesList.set_data(results);
            }
        </script>

        <!--Client Template used by attached DataView-->
        <div class="imageslist sys-template" >
            <span class="namedlistitem">
                <img sys:src="{{ Uri }}"/>
                <div>{{ Name }}</div>
            </span>
        </div>
    </form>
</body>
</html>
