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
        Sys.require(Sys.components.filteredTextBox, function() {
            Sys.create.filteredTextBox("#tb", {
                ValidChars: "()",
                FilterType: Sys.Extended.UI.FilterTypes.Numbers | Sys.Extended.UI.FilterTypes.UppercaseLetters | Sys.Extended.UI.FilterTypes.Custom
            });
        });
    </script>
</head>
<body>
    
    This input should allow numbers, uppercase characters, "(" and ")" only.<br />
    <input type="text" id="tb" style="width:200px"/>
    
    
</body>
</html>
