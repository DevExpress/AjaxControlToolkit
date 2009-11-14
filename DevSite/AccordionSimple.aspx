<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    .accordionHeader
    {
        border: 1px solid #2F4F4F;
        color: white;
        background-color: #2E4d7B;
	    font-family: Arial, Sans-Serif;
	    font-size: 12px;
	    font-weight: bold;
        padding: 5px;
        margin-top: 5px;
        cursor: pointer;
    }

    .accordionHeader a
    {
	    color: #FFFFFF;
	    background: none;
	    text-decoration: none;
    }

    .accordionHeader a:hover
    {
	    background: none;
	    text-decoration: underline;
    }

    .accordionHeaderSelected
    {
        border: 1px solid #2F4F4F;
        color: white;
        background-color: #5078B3;
	    font-family: Arial, Sans-Serif;
	    font-size: 12px;
	    font-weight: bold;
        padding: 5px;
        margin-top: 5px;
        cursor: pointer;
    }

    .accordionHeaderSelected a
    {
	    color: #FFFFFF;
	    background: none;
	    text-decoration: none;
    }

    .accordionHeaderSelected a:hover
    {
	    background: none;
	    text-decoration: underline;
    }
    .accordionContent
    {
        background-color: #D3DEEF;
        border: 1px dashed #2F4F4F;
        border-top: none;
        padding: 5px;
        padding-top: 10px;
    }        
    </style>

    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.debug.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.accordion, function() {
            Sys.create.accordion("#accordion", {
                HeaderCssClass: "accordionHeader",
                HeaderSelectedCssClass: "accordionHeaderSelected"
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div id="accordion">
        <div><a href="" class="accordionLink">1. Accordion</a></div>
        <div class="accordionContent">
            The Accordion is a web control that allows you to provide multiple panes and display them one at a time.
            It is like having several CollapsiblePanels
            where only one can be expanded at a time.  The Accordion is implemented as a web control that contains
            AccordionPane web controls. Each AccordionPane control has a template for its Header and its Content.
            We keep track of the selected pane so it stays visible across postbacks.
        </div>
        <div><a href="" class="accordionLink">2. AutoSize</a></div>
        <div class="accordionContent">
            <p>It also supports three AutoSize modes so it can fit in a variety of layouts.</p>
            <ul>
                <li><b>None</b> - The Accordion grows/shrinks without restriction.  This can cause other elements
                    on your page to move up and down with it.</li>
                <li><b>Limit</b> - The Accordion never grows larger than the value specified by its Height
                    property.  This will cause the content to scroll if it is too large to be displayed.</li>
                <li><b>Fill</b> - The Accordion always stays the exact same size as its Height property.  This
                    will cause the content to be expanded or shrunk if it isn't the right size.</li>
            </ul>
        </div>
        <div><a href="" class="accordionLink">3. Control or Extender</a></div>
        <div class="accordionContent">
            The Accordion is written using an extender like most of the other extenders in the AJAX Control Toolkit.
            The extender expects its input in a very specific hierarchy of container elements (like divs), so
            the Accordion and AccordionPane web controls are used to generate the expected input for the extender.
            The extender can also be used on its own if you provide it appropriate input.
        </div>
        <div><a href="" class="accordionLink">4. What is ASP.NET AJAX?</a></div>
        <div class="accordionContent">
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
            filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        </div>
    </div>
    
    </div>
    </form>
</body>
</html>
