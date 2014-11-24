<%@ Page Title="ListSearch Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="ListSearch.aspx.cs" Inherits="ListSearch_ListSearch" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    ListSearch Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <p>
        Click on this ListBox and start typing to search for an entry:
    </p>
    <br />
    <p>
        <asp:ListBox ID="ListBox1" runat="server" Width="100px" />
        <ajaxToolkit:ListSearchExtender ID="ListSearchExtender1" runat="server"
            TargetControlID="ListBox1" PromptCssClass="ListSearchExtenderPrompt"
            IsSorted="true">
        </ajaxToolkit:ListSearchExtender>
    </p>
    <p>
        It works for a DropDownList too. In this case, instead of searching for a string that
            starts with the word we get words that contain the typed word. It resets the search 
            query after 2 seconds if no match is found.
    </p>
    <br />
    <p>
        <asp:DropDownList ID="DropDownList1" runat="server" Width="100px" />
        <ajaxToolkit:ListSearchExtender ID="ListSearchExtender2" runat="server"
            TargetControlID="DropDownList1" PromptCssClass="ListSearchExtenderPrompt"
            QueryPattern="Contains" QueryTimeout="2000">
        </ajaxToolkit:ListSearchExtender>
    </p>
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ListSearchExtender Description</Header>
        <Content>
            <p>
                The ListSearchExtender lets you search for items in a ListBox or DropDownList
                by typing. The extender performs an incremental search within the ListBox
                based on what has been typed so far. The prompt message that gets displayed
                when you click the list can be customized along with its CSS class and position.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>ListSearchExtender Properties</Header>
        <Content>
            <p>
                The controls above are initialized with code like this. The <em>italic</em>
                properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:ListSearchExtender id="LSE" runat="server"
    TargetControlID="ListBox1"
<em>    PromptText="Type to search"</em>
<em>    PromptCssClass="ListSearchExtenderPrompt"</em>
<em>    PromptPosition="Top"</em>
<em>    AutoResetTimeout="0"</em>
<em>    IsSorted="true"</em>/&gt;
            </pre>
            <ul>
                <li><strong>PromptText</strong> - Message to display when the ListBox or DropDownList is given focus. Default is 'Type to search'. The PromptText is replaced by the search text typed by the user.</li>
                <li><strong>PromptCssClass</strong> - The name of the CSS class to apply to the prompt message.</li>
                <li><strong>PromptPosition</strong> - Indicates whether the message should appear at the Top or Bottom of the ListBox. The default is Top. </li>
                <li><strong>QueryPattern</strong> - Indicates how the typed characters should be used in the search query. The default pattern queries for results that start with the typed word. </li>
                <li><strong>IsSorted</strong> - Indicates if items added to the List are expected to be sorted. The default is false. If set to true it allows the code to perform a faster search instead of having to determine the same before performing the search.</li>
                <li><strong>QueryTimeout</strong> - Indicates whether the search query should be reset after the timeout if no match is found. The default is 0, meaning no auto reset behavior. </li>
                <li><strong>Animations</strong> - Generic animations for the ListSearch extender.  See the <a href="https://ajaxcontroltoolkit.codeplex.com/wikipage?title=Animation%20Control%20Reference">Animation Reference</a> for more details.
                    <ul>
                        <li><strong>OnShow</strong> - The OnShow animation will be played each time the extender's
                            prompt is displayed.  The prompt will be positioned correctly but hidden.
                            The animation can use <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span>
                            to display the prompt along with any other visual effects.</li>
                        <li><strong>OnHide</strong> - The OnHide animation will be played each time the extender's
                            prompt is hidden.</li>
                    </ul>
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ListSearchExtender Known Issues</Header>
        <Content>
            <p>
                In Safari the ListSearchExtender only works with ListBoxes, not DropDownLists.
            </p>
            <br />
            <p>
                In Opera the backspace key moves back a page in the browser history by default when
                it is pressed on a ListBox or DropDownList. To change this behavior you can
                go to Tools|Preferences|Shortcuts, edit the Keyboard setup, search for “back” and
                change the mapping for “Platform Windows-Unix-MCE, Backspace” to “Backspace” instead
                of “Backspace | Back”
            </p>
        </Content>
    </samples:InfoBlock>
</asp:Content>

