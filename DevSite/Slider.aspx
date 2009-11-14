<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <link rel="Stylesheet" href="scripts/extended/slider/slider.css" />
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.require(Sys.components.slider, function() {
            Sys.create.slider("#slider1", {
                maximum: 100,
                minimum: 0
            });
        });
    </script>
</head>
<body>
    
    <form id="form1" action=".">
        <input type="text" id="slider1" />
    </form>
    
    
</body>
</html>
