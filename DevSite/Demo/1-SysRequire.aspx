<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">

    </style>
    <script type="text/javascript" src="../scripts/start.debug.js"></script>
    <script type="text/javascript" src="../scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript" src="util.js"></script>
    <script type="text/javascript">
    
    Sys.require(Sys.scripts.Templates, function() {
        log('Loaded Templates.');
    });

    Sys.require([Sys.scripts.DataContext, Sys.scripts.Globalization], function() {
        log('Loaded DataContext and Globalization.');
    });

    Sys.require(Sys.composites.MicrosoftAjax, function() {
        log('Loaded composite MicrosoftAjax.');
    });

    Sys.require(["DataContext", "Globalization"], function() {
        log('Loaded DataContext and Globalization by name.');
    });
    
    Sys.require(Sys.components.dataView, function() {
        log('Loaded whatever script the DataView component is in.');
    });
    
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    

    <div id="results">
    </div>
    
    </div>
    </form>
</body>
</html>
