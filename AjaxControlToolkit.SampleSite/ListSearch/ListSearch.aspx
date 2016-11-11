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
            <div runat="server" data-control-type="ListSearchExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>ListSearchExtender Properties</Header>
        <Content>
            <div runat="server" data-control-type="ListSearchExtender" data-content-type="members" />
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

