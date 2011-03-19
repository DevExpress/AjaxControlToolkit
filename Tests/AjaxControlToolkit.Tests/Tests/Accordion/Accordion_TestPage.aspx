<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Accordion_TestPage.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.Accordion.Accordion_TestPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>

        <act:ToolkitScriptManager ID="ScriptManager1" runat="server" />                    
        
        <div>            
            <asp:button id="Button1" runat="server" text="Button" onclick="Button1_Click" />
            <asp:label id="Label1" runat="server"></asp:label>
            <br />
            Bound To XML:
            <asp:xmldatasource id="xml1" runat="server" datafile="~/Tests/Accordion/Data/CarsService.xml"
                xpath="/CarsService/make" />
            <act:Accordion ID="xmlBound" runat="server" DataSourceID="xml1" FadeTransitions="true"
                HeaderCssClass="accordionHeader" ContentCssClass="accordionContent">
                <HeaderTemplate>
                    Header:
                    <%# Eval("name") %>
                </HeaderTemplate>
                <ContentTemplate>
                    Pane:
                    <%# Eval("name") %>
                </ContentTemplate>
            </act:Accordion>
            <br />
            <br />
            Bound to dictionary:
            <act:Accordion ID="dictionaryBound" runat="server" HeaderCssClass="accordionHeader"
                ContentCssClass="accordionContent">
                <HeaderTemplate>
                    Header:
                    <%# Eval("Key") %>
                </HeaderTemplate>
                <ContentTemplate>
                    Data:
                    <%# Eval("Value") %>
                </ContentTemplate>
            </act:Accordion>
            <br />
            <br />
            <act:Accordion ID="MyAccordion" runat="server" SelectedIndex="0" HeaderCssClass="accordionHeader"
                ContentCssClass="accordionContent" FadeTransitions="true" FramesPerSecond="40"
                TransitionDuration="100" AutoSize="Fill" Height="425px" HeaderSelectedCssClass="accordionHeaderSelected"
                OnItemCreated="MyAccordion_ItemCreated" OnItemCommand="MyAccordion_ItemCommand">
                <Panes>
                    <act:AccordionPane ID="AccordionPane1" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                            <asp:textbox runat="server" id="TextBox1" />
                            <asp:button id="Button2" runat="server" text="Button" onclick="Button2_Click" />
                            <asp:button id="Button3" runat="server" text="Button" commandname="Command1" commandargument="arg1" />
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane2" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane3" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane4" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane5" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane6" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane7" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane8" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane9" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                    <act:AccordionPane ID="AccordionPane10" runat="server">
                        <Header>
                            This is a test header</Header>
                        <Content>
                            This is sample content.<br />
                            It spans a couple of lines.
                        </Content>
                    </act:AccordionPane>
                </Panes>
            </act:Accordion>
            <br />
            <br />

    
    </div>
    </form>
</body>
</html>
