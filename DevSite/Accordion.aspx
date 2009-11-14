<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .selectedheader {
            background-color: Green
        }
        .header {
            background-color: Yellow
        }
        .content {
            background-color: Gray;
            border: solid 1px red
        }
    </style>
    <script type="text/javascript" src="scripts/start.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.accordion, function() {
            Sys.create.accordion("#accordion", {
                HeaderCssClass: "header",
                HeaderSelectedCssClass: "selectedheader",
                ContentCssClass: "content"
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div id="accordion">
        <div>header1</div>
        <div>content1</div>
        <div>header2</div>
        <div>content2</div>
        <div>header3</div>
        <div>content3</div>
        <div>header4</div>
        <div>content4</div>
    </div>
    
    </div>
    </form>
</body>
</html>
