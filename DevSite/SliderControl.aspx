<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .slider 
        {
        	width: 100px;
        	height: 10px
        }
    </style>
</head>
<body>
    
    <form id="form1" runat="server">
        <asp:AjaxScriptManager runat="server" EnablePartialRendering="false"/>
        
        <asp:TextBox ID="text1" runat="server" CssClass="slider" />
        <asp:Label ID="slidervalue" runat="server" />
        <aspext:SliderExtender TargetControlID="text1" runat="server" Minimum="0" Maximum="100" BoundControlID="slidervalue"  />
    </form>
    
    
</body>
</html>
