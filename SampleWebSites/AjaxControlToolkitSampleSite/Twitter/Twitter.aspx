<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="Twitter.aspx.cs" 
    Inherits="Twitter_Twitter"
    Title="Twitter Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <style>
        .lbl {
            width: 100px;
            display: inline-block;
        }
    </style>
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />
    <asp:UpdateProgress ID="UpdateProgress1" runat="server">
        <ProgressTemplate>
            <b>Processing...</b>
        </ProgressTemplate>
    </asp:UpdateProgress>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
                            <div class="demoarea">
                    <div class="demoheading">
                        Twitter Demonstration</div>
            <asp:Panel ID="MissingKeysPanel" runat="server" Visible="False">
                <b>Missing Twitter Keys</b>. Please enter your Twitter Keys here:<br /> <br />
                <asp:Label ID="Label1" CssClass="lbl" runat="server" Text="Label">Consumer key</asp:Label> <asp:TextBox ID="TwitterConsumerKey" runat="server"></asp:TextBox><br/>
                <asp:Label ID="Label2" CssClass="lbl" runat="server" Text="Label">Consumer secret</asp:Label> <asp:TextBox ID="TwitterConsumerSecret" runat="server"></asp:TextBox><br/>
                <asp:Label ID="Label3" CssClass="lbl" runat="server" Text="Label">Access token</asp:Label> <asp:TextBox ID="TwitterAccessToken" runat="server"></asp:TextBox><br/>
                <asp:Label ID="Label4" CssClass="lbl" runat="server" Text="Label">Token secret</asp:Label> <asp:TextBox ID="TwitterAccessTokenSecret" runat="server"></asp:TextBox>
                <br />
                <br />
                You can create the Twitter Keys through <a href="https://dev.twitter.com/apps/new">https://dev.twitter.com/apps/new</a>. For more information please see the <a href="#twitterAPI">Twitter API section</a> of this document.<br />
                <br />
                <asp:Button ID="SubmitTwitterKeysButton" runat="server" Text="Submit" />
                <br/>
            </asp:Panel>
            <asp:Panel ID="DemoPanel" runat="server">
                    <div>
                        Displays status messages (tweets) for a Twitter account:
                        <br /><br />
                        <ajaxToolkit:Twitter ID="Twitter1" Mode="Profile" ScreenName="ScottGu" runat="server" />
                        <br />
                        <hr />
                        Displays status messages (tweets) for a Twitter account using a custom LayoutTemplate and StatusTemplate:
                        <br />
                        <style>
                            #twitter_custom_style .ajax__twitter {
                                -moz-border-radius: 0px;
                                -webkit-border-radius: 0px;
                                background-color: rgb(228, 236, 230);
                                border: 1px solid green;
                                border-radius: 0px;
                                color: darkcyan;
                            }
                
                        </style>
                        <div id="twitter_custom_style">
                            <ajaxToolkit:Twitter ID="Twitter3" Mode="Profile" ScreenName="ScottGu" runat="server">
                                <LayoutTemplate>
                                    <h2 style="padding: 10px">Scott Guthrie's Tweets:</h2>
                                    <div style="border: solid 5px white; padding: 10px">
                                        <asp:PlaceHolder id="itemPlaceholder" runat="server" />
                                    </div>
                                </LayoutTemplate>
                                <StatusTemplate>
                                    <div style="border-bottom: dotted 1px white; padding: 10px">
                                        <img src="<%# Eval("User.ProfileImageUrl") %>" />
                                        <%# Twitter.ActivateLinks((string) Eval("Text")) %>
                                        <br />
                                        posted: <i><%# Twitter.Ago((DateTime) Eval("CreatedAt")) %></i>
                                    </div>
                                </StatusTemplate>
                            </ajaxToolkit:Twitter> 
                        </div>

                
                        <hr />
                        Displays Twitter search results for <i>ASP.NET</i>:
                        <br />
                        <ajaxToolkit:Twitter ID="Twitter2" Mode="Search" 
                                             Search="ASP.NET" runat="server" Caption="The Caption" 
                                             Title="Title goes here..." >                     
                        </ajaxToolkit:Twitter>
                        <br />

 


                    </div>                                       
                
                 

            </asp:Panel>
            <br />
             </div>
                <div class="demobottom">
                </div>
                
        </ContentTemplate>
    </asp:UpdatePanel>
    <br />
    <style>
        .src_code {
            background-color: white;
            padding: 15px;
            overflow: auto;
        }
        .src_code p {
            white-space: nowrap;
        }
    </style>

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
            <li><strong>Title</strong> - enables you to display title text in the header. In Profile mode, the default value is the full user name.</li>
            <li><strong>Caption</strong> - enables you to display caption text in the header. In Profile mode, the default value is the user screen name.</li>
        </ul>
    </asp:Panel>    
    
    
    
    <asp:Panel ID="ApiChange_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading"><a id="twitterAPI">
            <asp:ImageButton ID="ApiChange_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                             AlternateText="collapse" />
            Twitter API</a></div>
    </asp:Panel>
    <asp:Panel ID="ApiChange_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            AjaxControlToolkit Twitter Control using Twitter API v1.1. The Twitter API v1.1 requiring us to provide API keys which are <b>Consumer Key</b>, <b>Consumer Secret</b>, <b>Access token</b> and <b>Access token secret</b>. 
            You will need to create those keys through <a href="https://dev.twitter.com/apps/new">https://dev.twitter.com/apps/new</a> and supply those information into 
            your web config under <b>appSettings</b> tag. It should looks like this:</p>
        <p>
            &nbsp;</p>
        <div class="src_code">
            <p>
                <font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&lt;</font></font><font color="#a31515" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">appSettings</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&gt;</font></font></p>
            <p>
                <font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&nbsp;&nbsp; &lt;</font></font><font color="#a31515" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">add</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font><font color="#ff0000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">key</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">act:TwitterConsumerKey</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font><font color="#ff0000" face="Consolas, sans-serif">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <font size="2" style="font-size: 9pt">value</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"><b>[Your consumer key]</b></font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">/&gt;</font></font></p>
            <p>
                <font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&nbsp;&nbsp; &lt;</font></font><font color="#a31515" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">add</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font><font color="#ff0000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">key</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">act:TwitterConsumerSecret</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font>
                <font color="#ff0000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">value</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"><b>[Your consumer secret]</b></font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">/&gt;</font></font></p>
            <p>
                <font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&nbsp;&nbsp; &lt;</font></font><font color="#a31515" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">add</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font><font color="#ff0000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">key</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">act:TwitterAccessToken</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font><font color="#ff0000" face="Consolas, sans-serif">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <font size="2" style="font-size: 9pt">value</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">[</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"><b>Your</b></font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> <b>access token]</b></font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">/&gt;</font></font></p>
            <p>
                <font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&nbsp;&nbsp; &lt;</font></font><font color="#a31515" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">add</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font><font color="#ff0000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">key</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">act:TwitterAccessTokenSecret</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font>
                <font color="#ff0000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">value</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">[</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"><b>Your token secret</b></font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">]</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">/&gt;</font></font></p>
            <p>
                <font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&lt;/</font></font><font color="#a31515" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">appSettings</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&gt;</font></font></p>
        </div>
        <p>
            &nbsp;</p>
        For more information about Twitter API v1.1 you can find in <a href="https://dev.twitter.com/docs/api/1.1/overview">https://dev.twitter.com/docs/api/1.1/overview</a>.<br />     
        <br />        
        
    </asp:Panel>

    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
                                          ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
                                          Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
                                          ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
                                          Collapsed="True" ImageControlID="Properties_ToggleImage" /> 
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeApiChange" runat="Server" TargetControlID="ApiChange_ContentPanel"
                                          ExpandControlID="ApiChange_HeaderPanel" CollapseControlID="ApiChange_HeaderPanel"
                                          Collapsed="True" ImageControlID="ApiChange_ToggleImage" />    
</asp:Content>