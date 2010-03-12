<%@ Page Language="C#" %>
<script runat="Server" type="text/C#">
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static AjaxControlToolkit.Slide[] GetImages()
    {
        return new AjaxControlToolkit.Slide[] { 
        new AjaxControlToolkit.Slide("images/Blue hills.jpg", "Blue Hills", "Go Blue"),
        new AjaxControlToolkit.Slide("images/Sunset.jpg", "Sunset", "Setting sun"),
        new AjaxControlToolkit.Slide("images/Winter.jpg", "Winter", "Wintery..."),
        new AjaxControlToolkit.Slide("images/Water lilies.jpg", "Water lillies", "Lillies in the water"),
        new AjaxControlToolkit.Slide("images/VerticalPicture.jpg", "Sedona", "Portrait style picture")};
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
    <form id="form1" runat="server">
    <asp:ToolkitScriptManager runat="server" EnablePartialRendering="false" EnablePageMethods="true" />
    <script type="text/javascript">
        Sys.require(Sys.components.slideShow, function() {
            Sys.query("#ss").slideShow({
                slideShowServiceMethod: "GetImages",
                autoPlay: true,
                previousButtonID: "prev",
                nextButtonID: "next",
                playButtonID: "play",
                playButtonText: "Play",
                stopButtonText: "Stop",
                imageDescriptionLabelID: "desc",
                imageTitleLabelID: "title",
                loop: true,
                playInterval: 1000
            });
        });
    </script>
    <div>
    
    <span id="title"></span>
    <img src="" id="ss" />
    <span id="desc"></span>
    <div>
        <input type="button" id="prev" value="<<" />
        &nbsp;&nbsp;&nbsp;
        <input type="button" id="play" value="play" />
        &nbsp;&nbsp;&nbsp;
        <input type="button" id="next" value=">>" />
    </div>
    
    
    </div>
    </form>
</body>
</html>
