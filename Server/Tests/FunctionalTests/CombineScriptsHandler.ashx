<%@ WebHandler Language="C#" Class="CombineScriptsHandler" %>

using System;
using System.Web;
using AjaxControlToolkit;

public class CombineScriptsHandler : IHttpHandler
{
    /// <summary>
    /// ProcessRequest implementation outputs the combined script file
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        if (!ToolkitScriptManager.OutputCombinedScriptFile(context))
        {
            throw new InvalidOperationException("Combined script file output failed unexpectedly.");
        }
    }

    /// <summary>
    /// IsReusable implementation returns true since this class is stateless
    /// </summary>
    public bool IsReusable
    {
        get { return true; }
    }
}
