<%@ Page Language="C#" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <frameset cols="40%,60%">
        <frame name="AjaxDriver" src="DriverPage.aspx?<%= this.Request.QueryString %>">
        <frame name="testFrame" src="<%= Page.ClientScript.GetWebResourceUrl(typeof(Microsoft.Web.Testing.Light.Engine.TestDriverPage), "Microsoft.Web.Testing.Light.Engine.Resources.StartUpPage.htm") %>">
    </frameset>
</html>
