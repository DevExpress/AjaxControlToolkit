<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
This sample shows how to use a generated AJAX proxy for a WCF 
AJAX-enabled service directly as dataProvider for an Ajax DataView control.
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>DataView.dataProvider and Service Proxy</title>
    <link href="../Styles/images.css" rel="stylesheet" type="text/css"/>
</head>

<body xmlns:dataview="javascript:Sys.UI.DataView" xmlns:sys="javascript:Sys">
    <form id="form1" runat="server">
        <act:ToolkitScriptManager ID="AjaxScriptManager1" runat="server" EnablePartialRendering="false"  
            CombineScripts="false" ScriptMode="Debug">
            <Scripts>
                <asp:ScriptReference Name="MicrosoftAjaxTemplates.js" />
            </Scripts>
            <Services>
                <asp:ServiceReference Path="~/Services/ImagesWcfService.svc" />
            </Services>
        </act:ToolkitScriptManager>

        <!--DataView calls service directly. No code-->
        <div id="imagesListView" class="imageslist sys-template"
            sys:attach="dataview"
            dataview:autofetch="true"
            dataview:dataprovider="{{ Uc.ImagesWcfService }}"
            dataview:fetchoperation="GetImages"
            dataview:fetchparameters="{{ {orderby: 'Name'} }}"
        >
            <span class="namedlistitem">
                <img sys:src="{{ Uri }}"/>
                <div>{{ Name }}</div>
            </span>
        </div>
    </form>
</body>
</html>
