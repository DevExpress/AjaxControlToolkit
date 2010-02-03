<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <link rel="Stylesheet" href="scripts/extended/dropdown/dropdown.css" />
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.dropDown, function() {
            Sys.query("#target").dropDown({
                dropDownControl: Sys.get("#dropdown")
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <span id="target">
        Hover over this
    </span>
    
    <ul id="dropdown" style="display:none">
        <li>item1</li>
        <li>item2</li>
        <li>item3</li>
    </ul>
    
    
    </div>
    </form>
</body>
</html>
