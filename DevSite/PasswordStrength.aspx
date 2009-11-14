<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .focus 
        {
        	background-color: #DDDDFF;
        	border: solid 1px blue;
        }
        .invalid 
        {
        	background-color: #FF0000;
        	border: solid 1px #FF0000;
        }
        .negative
        {
        	background-color: #FF5555;
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.require(Sys.components.passwordStrength, function() {
            Sys.create.passwordStrength("#pw1", {
            });
        });
    </script>
</head>
<body>
    <input type="password" id="pw1" />
    
    
</body>
</html>
