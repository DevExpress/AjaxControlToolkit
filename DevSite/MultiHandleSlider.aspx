<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <link rel="Stylesheet" href="scripts/extended/multihandleslider/multihandleslider.css" />
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.multiHandleSlider, function() {
            Sys.query("#slider1").multiHandleSlider({
                maximum: 100,
                minimum: 0,
                boundControlID: "slider1Value"
            });
            Sys.query("#slider2").multiHandleSlider({
                maximum: 100,
                minimum: 0,
                length: 500,
                orientation: Sys.Extended.UI.SliderOrientation.Vertical,
                multiHandleSliderTargets: [
                    { ControlID: "handle1" },
                    { ControlID: "handle2" }
                ]
            });
        });
    </script>
</head>
<body>
    
    <form id="form1">
        <span id="slider1Value"></span><input type="hidden" id="slider1" />
        <br />
        <br />
        <br />
        <input type="text" id="handle1" style="width:15px" value="25" /> | <input type="text" id="handle2" style="width:15px" value="50" /><br />
        <input type="hidden" id="slider2" /><br />

        
    </form>
    
    
</body>
</html>
