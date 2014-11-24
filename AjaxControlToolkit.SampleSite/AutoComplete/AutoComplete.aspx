<%@ Page Title="AutoComplete Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="AutoComplete.aspx.cs" Inherits="AutoComplete_AutoComplete" %>

<asp:Content ContentPlaceHolderID="DemoHeading" Runat="Server">
    AutoComplete Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" Runat="Server">
    Type some characters in this textbox.  The web service returns random words
            that start with the text you have typed.
            <br /><br />
            <asp:TextBox runat="server" ID="myTextBox" Width="300" autocomplete="off" />
            <ajaxToolkit:AutoCompleteExtender
                runat="server" 
                BehaviorID="AutoCompleteEx"
                ID="autoComplete1" 
                TargetControlID="myTextBox"
                ServicePath="AutoComplete.asmx" 
                ServiceMethod="GetCompletionList"
                MinimumPrefixLength="2" 
                CompletionInterval="1000"
                EnableCaching="true"
                CompletionSetCount="20"
                CompletionListCssClass="autocomplete_completionListElement" 
                CompletionListItemCssClass="autocomplete_listItem" 
                CompletionListHighlightedItemCssClass="autocomplete_highlightedListItem"
                DelimiterCharacters=";, :"
                ShowOnlyCurrentWordInCompletionListItem="true" >
                <Animations>
                    <OnShow>
                        <Sequence>
                            <%-- Make the completion list transparent and then show it --%>
                            <OpacityAction Opacity="0" />
                            <HideAction Visible="true" />
                            
                            <%--Cache the original size of the completion list the first time
                                the animation is played and then set it to zero --%>
                            <ScriptAction Script="
                                // Cache the size and setup the initial size
                                var behavior = $find('AutoCompleteEx');
                                if (!behavior._height) {
                                    var target = behavior.get_completionList();
                                    behavior._height = target.offsetHeight - 2;
                                    target.style.height = '0px';
                                }" />
                            
                            <%-- Expand from 0px to the appropriate size while fading in --%>
                            <Parallel Duration=".4">
                                <FadeIn />
                                <Length PropertyKey="height" StartValue="0" EndValueScript="$find('AutoCompleteEx')._height" />
                            </Parallel>
                        </Sequence>
                    </OnShow>
                    <OnHide>
                        <%-- Collapse down to 0px and fade out --%>
                        <Parallel Duration=".4">
                            <FadeOut />
                            <Length PropertyKey="height" StartValueScript="$find('AutoCompleteEx')._height" EndValue="0" />
                        </Parallel>
                    </OnHide>
                </Animations>
            </ajaxToolkit:AutoCompleteExtender>

            <script type="text/javascript">
                // Work around browser behavior of "auto-submitting" simple forms
                var frm = document.getElementById("aspnetForm");
                if (frm) {
                    frm.onsubmit = function() { return false; };
                }
            </script>
            <%-- Prevent enter in textbox from causing the collapsible panel from operating --%>
            <input type="submit" style="display:none;" />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" Runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>AutoComplete Description</Header>
        <Content>
            <p>
                AutoComplete is an ASP.NET AJAX extender that can be attached to any TextBox control, and will
                associate that control with a popup panel to display words that begin with the prefix typed into
                the textbox.  
            </p>
            <br />
            <p>
                The dropdown with candidate words supplied by a web service is positioned on the bottom left of
                the text box.
            </p>
            <br />
            <p>
                In the sample above, the textbox is associated with an AutoCompleteExtender that pulls words that
                start with the contents of the textbox using a web service.
            </p>
            <br />
            <p>
                When you have typed more content than the specified minimum word length, a popup will show words
                or phrases starting with that value.  Caching is turned on, so typing the same prefix multiple
                times results in only one call to the web service.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>AutoComplete Properties</Header>
        <Content>
            <p>
                The textbox is linked with an AutoCompleteExtender which is initialized with this code.
                The <em>italic</em> properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:AutoCompleteExtender 
    runat="server" 
    ID="autoComplete1" 
    TargetControlID="myTextBox"
    ServiceMethod="GetCompletionList"
    <em>ServicePath</em>="AutoComplete.asmx"
    <em>MinimumPrefixLength</em>="2" 
    <em>CompletionInterval</em>="1000"
    <em>EnableCaching</em>="true"
    <em>CompletionSetCount</em>="20" 
    <em>CompletionListCssClass</em>="autocomplete_completionListElement" 
    <em>CompletionListItemCssClass</em>="autocomplete_listItem" 
    <em>CompletionListHighlightedItemCssClass</em>="autocomplete_highlightedListItem"
    <em>DelimiterCharacters</em>=";, :"
    <em>ShowOnlyCurrentWordInCompletionListItem</em>="true"&gt;
        <em>&lt;Animations&gt;
            &lt;OnShow&gt; ... &lt;/OnShow&gt;
            &lt;OnHide&gt; ... &lt;/OnHide&gt;
        &lt;/Animations&gt;</em>
&lt;/ajaxToolkit:AutoCompleteExtender&gt;
    
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The TextBox control where the user types content to be automatically completed</li>
                <li><strong>ServiceMethod</strong> - The web service method to be called.  The signature of this method must match the following:
            <pre>
[System.Web.Services.WebMethod]
[System.Web.Script.Services.ScriptMethod]
public string[] GetCompletionList(string prefixText, int count) { ... }</pre>
                Note that you can replace "GetCompletionList" with a name of your choice, but the return type
                and parameter name and type must exactly match, including case.</li>
                <li><strong>ServicePath</strong> - The path to the web service that the extender will pull the word\sentence completions from. If this is not provided, the service method should be a page method.</li>
                <li><strong>ContextKey</strong> - User/page specific context provided to an optional overload of the web method described by ServiceMethod/ServicePath. If the context key is used, it should have the same signature with an additional parameter named contextKey of type string:
                <pre>
[System.Web.Services.WebMethod]
[System.Web.Script.Services.ScriptMethod]
public string[] GetCompletionList(
    string prefixText, int count, string contextKey) { ... }</pre>
                Note that you can replace "GetCompletionList" with a name of your choice, but the return type
                and parameter name and type must exactly match, including case.</li>
                <li><strong>UseContextKey</strong> - Whether or not the ContextKey property should be used. This will be automatically enabled if the ContextKey property is ever set (on either the client or the server).  If the context key is used, it should have the same signature with an additional parameter named contextKey of type string (as described above).</li>
                <li><strong>MinimumPrefixLength</strong> - Minimum number of characters that must be entered before getting suggestions from the web service.</li>
                <li><strong>CompletionInterval</strong> - Time in milliseconds when the timer will kick in to get suggestions using the web service.</li>
                <li><strong>EnableCaching</strong> - Whether client side caching is enabled.</li>
                <li><strong>CompletionSetCount</strong> - Number of suggestions to be retrieved from the web service.</li>
                <li><strong>CompletionListCssClass</strong> - Css Class that will be used to style the completion list flyout.</li>
                <li><strong>CompletionListItemCssClass</strong> - Css Class that will be used to style an item in the AutoComplete list flyout.</li>
                <li><strong>CompletionListHighlightedItemCssClass</strong> - Css Class that will be used to style a highlighted item in the AutoComplete list flyout.</li>                                                
                <li><strong>DelimiterCharacters</strong> - Specifies one or more character(s) used to separate words. The text in the AutoComplete textbox is tokenized using these characters and the webservice completes the last token.</li>
                <li><strong>FirstRowSelected</strong> - Determines if the first option in the AutoComplete list will be selected by default.</li>
                <li><strong>ShowOnlyCurrentWordInCompletionListItem</strong> - If true and DelimiterCharacters are specified, then the
                AutoComplete list items display suggestions for the current word to be completed and do not display the rest of the tokens.</li>
                <li><strong>Animations</strong> - Generic animations for the AutoComplete extender. See the <a href="https://ajaxcontroltoolkit.codeplex.com/wikipage?title=Animation%20Control%20Reference">Animation Reference</a> for more details.
                <ul>
                    <li><strong>OnShow</strong> - The OnShow animation will be played each time the AutoComplete completion list is displayed. The completion list will be positioned correctly but hidden. The animation can use <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span> to display the completion list along with any other visual effects.</li>
                    <li><strong>OnHide</strong> - The OnHide animation will be played each time the AutoComplete completion list is hidden.</li>
                </ul>
            </li>
        </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>