<%@ Page Language="C#" %>
<script runat="Server" type="text/C#">
</script>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <link rel="Stylesheet" href="scripts/extended/tabs/tabs.css" />
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.require(Sys.components.tabContainer, function() {
            var container = Sys.query("#tabcontainer").tabContainer(0);
            Sys.query("#tab1_body").tabPanel(container, "#tab1");
            Sys.query("#tab2_body").tabPanel(container, "#tab2");
            Sys.query("#tab3_body").tabPanel(container, "#tab3");
        });
    </script>
</head>
<body>
    <div>
    <form id="form1" action="./">
    
    <div id="tabcontainer" class="ajax__tab_xp" style="width: 402px;">
        <div id="tabcontainer_header">
            <div id="tab1">Signature and Bio</div>
            <div id="tab2">Email</div>
            <div id="tab3">Controls</div>
        </div>
        <div id="tabcontainer_body" style="height: 138px;">
            <div id="tab1_body">
                <table>
                    <tr>
                        <td>
                            Signature:
                        </td>
                        <td>
                            <input name="signatureText" type="text" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Bio:
                        </td>
                        <td>
                            <input name="bioText" type="text" />
                        </td>
                    </tr>
                </table>
                <input type="submit" name="Button3" value="Save" />
                <br />
                <br />
                Hit Save to cause a postback from an update panel inside the tab panel.<br />
            </div>
            <div id="tab3_body" style="display: none;">
                Email:
                <input name="emailText" type="text" />
                <br />
                <br />
                <input type="submit" name="Button1" value="Save" />
                <br />
                <br />
                Hit Save to cause a full postback.
            </div>
            <div id="tab2_body" style="display:none;">
                <div>
                    Controls authored by Toolkit User (read-only - demo purposes):</div>
                <ul>
                    <li>Calendar</li>
                    <li>MaskedEdit</li>
                    <li>Accordion</li>
                    <li>Calendar</li>
                    <li>Calendar</li>
                </ul>
                <br />
            </div>
        </div>
        
    </div>
   
    
    </form>
    
    
    </div>
</body>
</html>
