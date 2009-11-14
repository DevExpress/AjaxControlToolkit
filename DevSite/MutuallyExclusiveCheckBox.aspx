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
            Sys.create.mutuallyExclusiveCheckBox("#cb1", "[A]");
            Sys.create.mutuallyExclusiveCheckBox("#cb2", "[B]");
            Sys.create.mutuallyExclusiveCheckBox("#cb3", "[C]");
            Sys.create.mutuallyExclusiveCheckBox("#cb4", "[D]");
            
            Sys.create.mutuallyExclusiveCheckBox("#cb1a", "[A]");
            Sys.create.mutuallyExclusiveCheckBox("#cb2a", "[B]");
            Sys.create.mutuallyExclusiveCheckBox("#cb3a", "[C]");
            Sys.create.mutuallyExclusiveCheckBox("#cb4a", "[D]");
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
