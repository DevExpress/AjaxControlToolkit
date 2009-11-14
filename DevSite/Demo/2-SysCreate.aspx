<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .sys-template 
        {
        	display: none
        }
    </style>
    <script type="text/javascript" src="../scripts/start.debug.js"></script>
    <script type="text/javascript" src="../scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript" src="util.js"></script>
    <script type="text/javascript">
    
    Sys.require(Sys.components.dataView, function() {
        var dv = Sys.create.dataView("#dv", {
            data: [1,2,3]
        });
        log(Object.getTypeName(dv));
    });
    
    // oops
    //Sys.create.adoNetDataContext();
    
    Sys.require(Sys.components.confirmButton, function() {
        Sys.create.confirmButton("#confirm", "Are you SURE?");
    });

    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div id="dv" class="sys-template">
        {{ $dataItem }}
    </div>
    
    <input type="button" id="confirm" value="Go on vacation" />

    <div id="results">
    </div>
    
    </div>
    </form>
</body>
</html>
