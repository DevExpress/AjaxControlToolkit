<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="AjaxFileUploadTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.AjaxFileUploadTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">
    AjaxFileUpload
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">

    <asp:Panel ID="Panel2" runat="server">
        <div style="padding: 5px; cursor: pointer; vertical-align: middle;">
            <div style="float: left;">Expand</div>
        </div>
    </asp:Panel>
    <asp:Panel ID="Panel1" runat="server" Height="0">
        <p>
            <act:tabcontainer runat="server">
                <act:TabPanel runat="server">
                    <ContentTemplate>
                        <act:AjaxFileUpload 
                            ID="AjaxFileUpload1"
                            runat="server" />
                    </ContentTemplate>
                </act:TabPanel>
            </act:tabcontainer>
        </p>
    </asp:Panel>

    <act:collapsiblepanelextender runat="Server"
        targetcontrolid="Panel1"
        expandcontrolid="Panel2"
        collapsecontrolid="Panel2"
        collapsed="True"
        expandedtext="(Hide Details...)"
        collapsedtext="(Show Details...)"
        suppresspostback="true"/>
        
    <script>
        describe("AjaxFileUpload", function() {
            beforeEach(function() {
                this.ajaxFileUploadExtender =  $find("<%= AjaxFileUpload1.ClientID %>");
            });

            it("hides upload button inside tabs", function() {
                expect(this.ajaxFileUploadExtender._elements.uploadOrCancelButton.style.visibility).toBe("hidden");
            });
        });
    </script>
</asp:Content>
