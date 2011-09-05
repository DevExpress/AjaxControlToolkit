<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Inherits="CommonPage"
    Title="Twitter Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" CombineScripts="false" />
    <div class="demoarea">
        <div class="demoheading">
            Twitter Demonstration</div>
            <div>
                Displays status messages (tweets) for a Twitter account:
                <br /><br />
                <ajaxToolkit:Twitter ID="Twitter1" Mode="Profile" ScreenName="ScottGu" runat="server" />
                <br />
                
 

                <hr />
                Displays status messages (tweets) for a Twitter account using a custom LayoutTemplate and StatusTemplate:
                <br />
 
 
                <ajaxToolkit:Twitter ID="Twitter3" Mode="Profile" ScreenName="ScottGu" runat="server">
                    <LayoutTemplate>
                        <b>Scott Guthrie's Tweets:</b>
                        <asp:PlaceHolder id="itemPlaceholder" runat="server" />
                    </LayoutTemplate>
                    <StatusTemplate>
                        <div style="border:solid 2px white;padding:10px">
                            <img src="<%# Eval("User.ProfileImageUrl") %>" />
                            <%# Twitter.ActivateLinks( (string)Eval("Text") ) %>
                            <br />
                            posted: <%# Twitter.Ago((DateTime)Eval("CreatedAt")) %>
                        </div>
                    </StatusTemplate>
                </ajaxToolkit:Twitter> 


                
                <hr />
                Displays Twitter search results for <i>'Ajax Control Toolkit'</i>:
                <br />
                <ajaxToolkit:Twitter ID="Twitter2" Mode="Search" Search="'Ajax Control Toolkit'" runat="server" /> 
                <br />

 


            </div>                                       
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            Twitter Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            The Twitter control is an ASP.NET AJAX control that enables you to display Twitter status messages (tweets) from Twitter.com.
            This control has two modes: Profile and Search. In Profile mode, you can display the latest tweets from a particular user by 
            supplying the user's Twitter screen name. In Search mode, you can display all tweets which match a search query.
        </p>
        <br />
        <p>
            Twitter limits the number of times that you can interact with their API in an hour. Twitter recommends that you cache
            results on the server (<a href="https://dev.twitter.com/docs/rate-limiting">https://dev.twitter.com/docs/rate-limiting</a>). By default, the Twitter control caches 
            results on the server a duration of 5 minutes. You can modify the cache duration by assigning a value (in seconds) to the 
            Twitter control's CacheDuration property.              
        </p>
        <br />
        <p>
            The Twitter control wraps a standard ASP.NET ListView control. You can customize the appearance of the Twitter control
            by modifying its LayoutTemplate, StatusTemplate, AlternatingStatusTemplate, and EmptyDataTemplate.
        </p>

        <p>
        </p>     
        <br />        
        
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            Twitter Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <pre>&lt;ajaxToolkit:Twitter 
            Mode="Profile"
            ScreenName="ScottGu" 
            runat="server" /&gt;</pre>
            <ul>
                <li><strong>Mode</strong> - either Profile or Search mode.</li>
                <li><strong>ScreenName</strong> - required in Profile mode. The Twitter user to display. </li>
                <li><strong>Search</strong> - required in Search mode. The search to perform. You can build complex queries with <a href="https://dev.twitter.com/docs/using-search">search operators</a> </li>
                <li><strong>Count</strong> - number of status messages (tweets) to display. The default value is 5.</li>                
                <li><strong>CacheDuration</strong> - amount of time to cache results from Twitter in seconds. The default value is 300 seconds.</li>
                <li><strong>IncludeRetweets</strong> - in Profile mode, indicates whether retweets are displayed.</li>
                <li><strong>IncludeReplies</strong> - in Profile mode, indicates whether replies are displayed.</li>
                <li><strong>LayoutTemplate</strong> - template which contains the HTML for the root container of the ListView content.</li>
                <li><strong>StatusTemplate</strong> - template which contains each status message (tweet).</li>
                <li><strong>AlternatingStatusTemplate</strong> - template which is applied for alternating status messages (tweets).</li>
                <li><strong>EmptyDataTemplate</strong> - template which displays content when there are no tweets.</li>
            </ul>
    </asp:Panel>    
    
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />    
</asp:Content>
