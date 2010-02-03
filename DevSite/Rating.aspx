<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .rating_star
        {
            font-size: 0pt;
            width: 13px;
            height: 12px;
            margin: 0px;
            padding: 0px;
            cursor: pointer;
            display: block;
            background-repeat: no-repeat;
        }
        .rating_filled 
        {
            background-image: url(Images/FilledStar.png);
        }
        .rating_empty 
        {
            background-image: url(Images/EmptyStar.png);
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        function onRated(sender, args) {
            $get('log').innerHTML += "Rated: " + sender.get_Rating() + "<br/>";
        }
        
        Sys.require(Sys.components.rating, function() {
            Sys.query("#rate1").rating({
                ClientStateFieldID: "state",
                Rating: 2,
                id: "rate1",
                Rated: onRated
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <input type="text" id="state" />
    <div id="rate1" style="float: left;">
        <a href="#" id="rate1_A" style="text-decoration:none">
            <span id="rate1_Star_1" class="rating_star" style="float:left;">&nbsp;</span>
            <span id="rate1_Star_2" class="rating_star" style="float:left;">&nbsp;</span>
            <span id="rate1_Star_3" class="rating_star" style="float:left;">&nbsp;</span>
            <span id="rate1_Star_4" class="rating_star" style="float:left;">&nbsp;</span>
            <span id="rate1_Star_5" class="rating_star" style="float:left;">&nbsp;</span>
        </a>
	</div>
	
	<input type="button" onclick="Sys.get('$rate1').set_Rating(5)" value="Thumbs up" />
	
	<div id="log"></div>
    
    
    
    </div>
    </form>
</body>
</html>
