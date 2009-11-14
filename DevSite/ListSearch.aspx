<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        #prompt 
        {
        	background-color: Yellow;
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.listSearch, function() {
            Sys.create.listSearch("#dd", {
            });
            Sys.create.listSearch("#list", {
                promptText: "my prompt",
                promptCssClass: "prompt",
                promptPosition: Sys.Extended.UI.ListSearchPromptPosition.Bottom,
                queryPattern: Sys.Extended.UI.ListSearchQueryPattern.Contains
            });
        });
    </script>
</head>
<body>
    
    <select id="dd">
        <option value="Alfa">Alfa</option>
	    <option value="Alpha">Alpha</option>
	    <option value="Bissotwo">Bissotwo</option>
	    <option value="Bravo">Bravo</option>
	    <option value="Charlie">Charlie</option>
	    <option value="Delta">Delta</option>
	    <option value="Echo">Echo</option>
	    <option value="Eight">Eight</option>
	    <option value="Five">Five</option>
	    <option value="Four">Four</option>
	    <option value="Foxtrot">Foxtrot</option>
	    <option value="Golf">Golf</option>
	    <option value="Hotel">Hotel</option>
	    <option value="India">India</option>
	    <option value="Juliet">Juliet</option>
	    <option value="Juliett">Juliett</option>
	    <option value="Kartefour">Kartefour</option>
	    <option value="Kilo">Kilo</option>
	    <option value="Lima">Lima</option>
	    <option value="Mike">Mike</option>
	    <option value="Nadazero">Nadazero</option>
	    <option value="Nine">Nine</option>
	    <option value="November">November</option>
	    <option value="Novenine">Novenine</option>
	    <option value="Oktoeight">Oktoeight</option>
	    <option value="One">One</option>
	    <option value="Oscar">Oscar</option>
	    <option value="Pantafive">Pantafive</option>
	    <option value="Papa">Papa</option>
	    <option value="Quebec">Quebec</option>
	    <option value="Romeo">Romeo</option>
	    <option value="Setteseven">Setteseven</option>
	    <option value="Seven">Seven</option>
	    <option value="Sierra">Sierra</option>
	    <option value="Six">Six</option>
	    <option value="Soxisix">Soxisix</option>
	    <option value="Tango">Tango</option>
	    <option value="Terrathree">Terrathree</option>
	    <option value="Three">Three</option>
	    <option value="Two">Two</option>
	    <option value="Unaone">Unaone</option>
	    <option value="Uniform">Uniform</option>
	    <option value="Victor">Victor</option>
	    <option value="Whiskey">Whiskey</option>
	    <option value="Xray">Xray</option>
	    <option value="X-ray">X-ray</option>
	    <option value="Yankee">Yankee</option>
	    <option value="Zero">Zero</option>
	    <option value="Zulu">Zulu</option>
    </select>
    
    <br />
    <br />
    <br />
    <br />

    <select id="list" multiple="multiple">
        <option value="Alfa">Alfa</option>
	    <option value="Alpha">Alpha</option>
	    <option value="Bissotwo">Bissotwo</option>
	    <option value="Bravo">Bravo</option>
	    <option value="Charlie">Charlie</option>
	    <option value="Delta">Delta</option>
	    <option value="Echo">Echo</option>
	    <option value="Eight">Eight</option>
	    <option value="Five">Five</option>
	    <option value="Four">Four</option>
	    <option value="Foxtrot">Foxtrot</option>
	    <option value="Golf">Golf</option>
	    <option value="Hotel">Hotel</option>
	    <option value="India">India</option>
	    <option value="Juliet">Juliet</option>
	    <option value="Juliett">Juliett</option>
	    <option value="Kartefour">Kartefour</option>
	    <option value="Kilo">Kilo</option>
	    <option value="Lima">Lima</option>
	    <option value="Mike">Mike</option>
	    <option value="Nadazero">Nadazero</option>
	    <option value="Nine">Nine</option>
	    <option value="November">November</option>
	    <option value="Novenine">Novenine</option>
	    <option value="Oktoeight">Oktoeight</option>
	    <option value="One">One</option>
	    <option value="Oscar">Oscar</option>
	    <option value="Pantafive">Pantafive</option>
	    <option value="Papa">Papa</option>
	    <option value="Quebec">Quebec</option>
	    <option value="Romeo">Romeo</option>
	    <option value="Setteseven">Setteseven</option>
	    <option value="Seven">Seven</option>
	    <option value="Sierra">Sierra</option>
	    <option value="Six">Six</option>
	    <option value="Soxisix">Soxisix</option>
	    <option value="Tango">Tango</option>
	    <option value="Terrathree">Terrathree</option>
	    <option value="Three">Three</option>
	    <option value="Two">Two</option>
	    <option value="Unaone">Unaone</option>
	    <option value="Uniform">Uniform</option>
	    <option value="Victor">Victor</option>
	    <option value="Whiskey">Whiskey</option>
	    <option value="Xray">Xray</option>
	    <option value="X-ray">X-ray</option>
	    <option value="Yankee">Yankee</option>
	    <option value="Zero">Zero</option>
	    <option value="Zulu">Zulu</option>
    </select>
    
</body>
</html>
