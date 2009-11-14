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
        Sys.require(Sys.components.toggleButton, function() {
            Sys.create.toggleButton.defaults = {
                CheckedImageUrl: "images/ToggleButton_checked.gif",
                UncheckedImageUrl: "images/ToggleButton_unchecked.gif",
                ImageWidth: 20,
                ImageHeight: 20
            };
            Sys.create.toggleButton("#toggle1");
            Sys.create.toggleButton("#toggle2");
        });
    </script>
</head>
<body>

    <input type="checkbox" id="toggle1" /><label for="toggle1">Enable option 1?</label>
    <input type="checkbox" id="toggle2" /><label for="toggle2">Enable option 2?</label>
    
    
</body>
</html>
