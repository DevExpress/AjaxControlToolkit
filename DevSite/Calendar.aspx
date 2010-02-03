<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <link rel="Stylesheet" href="scripts/extended/calendar/calendar.css" />
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.calendar, function() {
            Sys.query("#bdate").calendar({});
        });
    </script>
</head>
<body>
    
    <div style="width:1px;height:500px"></div>
    <input type="text" id="bdate" />
    
    
</body>
</html>
