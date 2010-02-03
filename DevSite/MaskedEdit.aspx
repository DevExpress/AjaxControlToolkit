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
        Sys.debug = true;
        Sys.require(Sys.components.maskedEdit, function() {
            Sys.components.maskedEdit.defaults = {
                OnFocusCssClass: "focus",
                OnInvalidCssClass: "invalid",
                OnFocusCssNegative: "negative",
                OnBlurCssNegative: "negative"
            }
            Sys.query("#money").maskedEdit({
                Mask: "9,999,999.99",
                AcceptNegative: Sys.Extended.UI.MaskedEditShowSymbol.Left,
                MaskType: Sys.Extended.UI.MaskedEditType.Number
            });
            Sys.query("#date").maskedEdit({
                Mask: "99/99/9999",
                MaskType: Sys.Extended.UI.MaskedEditType.Date
            });
        });
    </script>
</head>
<body>

    Money:<br />    
    <input type="text" id="money" />
    <br />
    Date:<br />
    <input type="text" id="date" />
    
    
</body>
</html>
