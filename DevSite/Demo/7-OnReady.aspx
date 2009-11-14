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
    
    Sys.require(Sys.components.dataView, function() {
        log('dataview loaded.');
    });
    Sys.require(Sys.components.autoComplete, function() {
        log('autocomplete loaded.');
    });

    Sys.onReady(function() {
        log("OnReady.");
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
