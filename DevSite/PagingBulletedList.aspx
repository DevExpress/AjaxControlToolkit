<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .selected 
        {
        	background-color: Yellow
        }
        .unselected 
        {
        	background-color: Gray
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.require(Sys.components.pagedList, function() {
            Sys.create.pagedList("#list", {
                SelectIndexCssClass: "selected",
                UnselectIndexCssClass: "unselected",
                Separator: " | "
            });
        });
    </script>
</head>
<body>
    
    <ul id="list">
        <li>Alfa</li>
	    <li>Alpha</li>
	    <li>Bissotwo</li>
	    <li>Bravo</li>
	    <li>Charlie</li>
	    <li>Delta</li>
	    <li>Echo</li>
	    <li>Eight</li>
	    <li>Five</li>
	    <li>Four</li>
	    <li>Foxtrot</li>
	    <li>Golf</li>
	    <li>Hotel</li>
	    <li>India</li>
	    <li>Juliet</li>
	    <li>Juliett</li>
	    <li>Kartefour</li>
	    <li>Kilo</li>
	    <li>Lima</li>
	    <li>Mike</li>
	    <li>Nadazero</li>
	    <li>Nine</li>
	    <li>November</li>
	    <li>Novenine</li>
	    <li>Oktoeight</li>
	    <li>One</li>
	    <li>Oscar</li>
	    <li>Pantafive</li>
	    <li>Papa</li>
	    <li>Quebec</li>
	    <li>Romeo</li>
	    <li>Setteseven</li>
	    <li>Seven</li>
	    <li>Sierra</li>
	    <li>Six</li>
	    <li>Soxisix</li>
	    <li>Tango</li>
	    <li>Terrathree</li>
	    <li>Three</li>
	    <li>Two</li>
	    <li>Unaone</li>
	    <li>Uniform</li>
	    <li>Victor</li>
	    <li>Whiskey</li>
	    <li>Xray</li>
	    <li>X-ray</li>
	    <li>Yankee</li>
	    <li>Zero</li>
	    <li>Zulu</li>
    </ul>
    

    
</body>
</html>
