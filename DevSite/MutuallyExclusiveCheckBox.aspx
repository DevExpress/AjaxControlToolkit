<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.mutuallyExclusiveCheckBox, function() {
            Sys.query("#cb1").mutuallyExclusiveCheckBox("[A]");
            Sys.query("#cb2").mutuallyExclusiveCheckBox("[B]");
            Sys.query("#cb3").mutuallyExclusiveCheckBox("[C]");
            Sys.query("#cb4").mutuallyExclusiveCheckBox("[D]");
            
            Sys.query("#cb1a").mutuallyExclusiveCheckBox("[A]");
            Sys.query("#cb2a").mutuallyExclusiveCheckBox("[B]");
            Sys.query("#cb3a").mutuallyExclusiveCheckBox("[C]");
            Sys.query("#cb4a").mutuallyExclusiveCheckBox("[D]");
        });
    </script>
</head>
<body>

    <div style="float:left">
    <input type="checkbox" id="cb1" /><br />
    <input type="checkbox" id="cb2" /><br />
    <input type="checkbox" id="cb3" /><br />
    <input type="checkbox" id="cb4" /><br />
    </div>

    <div style="float:left">
    <input type="checkbox" id="cb1a" /><br />
    <input type="checkbox" id="cb2a" /><br />
    <input type="checkbox" id="cb3a" /><br />
    <input type="checkbox" id="cb4a" /><br />
    </div>
    
    
</body>
</html>
