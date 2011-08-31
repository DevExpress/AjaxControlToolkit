<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Inherits="CommonPage"
    Title="Gravatar Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" CombineScripts="false" />
    <div class="demoarea">
        <div class="demoheading">
            Gravatar Demonstration</div>
            <div>
                Displays gravatar for an email account:
                <br />
                <ajaxToolkit:Gravatar ID="Gravatar1" Email="test@superexpert.com" Size="200" Rating="R" runat="server" />
                <br />
                <hr />
                Displays default image for an email which doesn't meet rating requirments:
                <br />
                <ajaxToolkit:Gravatar ID="Gravatar2" Email="thesameqad@gmail.com" Rating="G" DefaultImageBehavior="MysteryMan" runat="server" />
                <br />                
                <hr />
                Displays different identicons (generated geometric patterns) for different emails which do not have Gravatar images:
                <br />
                <ajaxToolkit:Gravatar ID="Gravatar3" Email="Sample1@DoesNotExist.com" DefaultImageBehavior="Identicon" runat="server" />
                <ajaxToolkit:Gravatar ID="Gravatar4" Email="Sample2@DoesNotExist.com" DefaultImageBehavior="Identicon" runat="server" />
                <ajaxToolkit:Gravatar ID="Gravatar5" Email="Sample3@DoesNotExist.com" DefaultImageBehavior="Identicon" runat="server" />
                <br />                
                <hr />
                Displays different wavatars (generated faces) for different emails which do not have Gravatar images:
                <br />
                <ajaxToolkit:Gravatar ID="Gravatar6" Email="Sample1@DoesNotExist.com" DefaultImageBehavior="Wavatar" runat="server" />
                <ajaxToolkit:Gravatar ID="Gravatar7" Email="Sample2@DoesNotExist.com" DefaultImageBehavior="Wavatar" runat="server" />
                <ajaxToolkit:Gravatar ID="Gravatar8" Email="Sample3@DoesNotExist.com" DefaultImageBehavior="Wavatar" runat="server" />

            </div>                                       
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            Gravatar Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            The Gravatar control is an ASP.NET AJAX control that enables you to use gravatar images on your web forms. A gravatar
            is a "Globally Recognized Avatar" provided by Gravatar.com.
        </p>
        <br />
        <p>
            This control is extremely simple to use. The only required property which you need to set is your email. 
            In addition, you can specify the requested size of the image, required rating, default image, and default image behavior.             
        </p>
        <br />
        <p>
            You can use the DefaultImageBehavior property to control what happens when an email account does not have an associated gravatar. The
            possible options are:
        </p>
            <ul>
                <li>MysteryMan &mdash; The same image of a Mystery Man (an anonymous profile of a man) is displayed for all unrecognized emails.</li>
                <li>Identicon &mdash; A different geometric pattern is generated for each unrecognized email.</li>
                <li>MonsterId &mdash; A different image of a monster is generated for each unrecognized email.</li>               
                <li>Wavatar &mdash; A different image of a face is generated for each unrecognized email.</li>
                <li>Retro &mdash; A different 8-bit arcade-style face is generated for each unrecognized email.</li>
            </ul>

            <br />
            Alternatively, you can specify a custom default image by setting the DefaultImage property to point at an absolute URL.

        <p>
        </p>     
        <br />        
        
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            Gravatar Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The first sample above is initialized with this code. The <em>italic</em> properties
            are optional:
        </p>        
        <pre>&lt;ajaxToolkit:Gravatar runat="server"
            Email="test@superexpert.com"
            <em>Size</em>="200"
            <em>Rating</em>="R"
            <em>DefaultImageBehavior="Identicon"</em>
            <em>DefaultImage</em>="http://tinyurl.com/3bpsaac" /&gt;</pre>
            <ul>
                <li><strong>Email</strong> - email that is associated with account at gravatar.</li>
                <li><strong>Size</strong> - The requested size of the image that gravatar needs to render (both width and height).</li>
                <li><strong>Rating</strong> - Acceptable rating of the image to display. </li>
                <li><strong>DefaultImageBehavior</strong> - The image displayed when a gravater is not associated with an email account. Possible values are Identicon, MonsterId, MysteryMan, Retro, Wavatar</li>
                <li><strong>DefaultImage</strong> - Url of the image, that will be diplayed, if the gravatar image can't be displayed because of inacceptable rating or the email account
                is not associated with a gravatar. This must be an absolute URL.</li>
            </ul>
    </asp:Panel>    
    
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />    
</asp:Content>
