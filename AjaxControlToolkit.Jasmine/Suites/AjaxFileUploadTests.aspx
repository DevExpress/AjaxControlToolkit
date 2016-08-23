<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="AjaxFileUploadTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.AjaxFileUploadTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    AjaxFileUpload
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:Button Text="Expand" runat="server" ID="ExpandCollapseButton" />

    <asp:Panel ID="ExpandablePanel" runat="server" Height="0">
        <act:TabContainer runat="server">

            <act:TabPanel runat="server">
                <ContentTemplate>

                    <act:AjaxFileUpload runat="server" ID="TestAjaxFileUpload" />

                </ContentTemplate>
            </act:TabPanel>

        </act:TabContainer>
    </asp:Panel>

    <act:CollapsiblePanelExtender runat="Server"
        TargetControlID="ExpandablePanel"
        ExpandControlID="ExpandCollapseButton"
        CollapseControlID="ExpandCollapseButton"
        Collapsed="False"
        ExpandedText="(Hide Details...)"
        CollapsedText="(Show Details...)"
        SuppressPostBack="true" />

    <act:AjaxFileUpload runat="server" ID="TestAjaxFileUpload2" />

    <script>
        describe("AjaxFileUpload", function() {

            var AJAX_FILE_UPLOAD_CLIENT_ID = "<%= TestAjaxFileUpload.ClientID %>";
            var AJAX_FILE_UPLOAD2_CLIENT_ID = "<%= TestAjaxFileUpload2.ClientID %>";

            beforeEach(function() {
                this.ajaxFileUploadExtender = $find(AJAX_FILE_UPLOAD_CLIENT_ID);
                this.ajaxFileUploadExtender2 = $find(AJAX_FILE_UPLOAD2_CLIENT_ID);
            });

            it("hides upload button inside tabs", function() {
                var $uploadOrCancelButton = $(this.ajaxFileUploadExtender._elements.uploadOrCancelButton);

                expect($uploadOrCancelButton.css("visibility")).toBe("hidden");
            });

            it("clears input file", function() {
                var inputFile = $(this.ajaxFileUploadExtender2._elements.inputFile);
                var e = {target: 
                    {
                        files: []
                    }
                };
                if(this.ajaxFileUploadExtender2._useHtml5Support)
                {
                    spyOn(this.ajaxFileUploadExtender2._processor, "addFilesToQueue");
                    spyOn(this.ajaxFileUploadExtender2._processor, "createInputFileElement");
                    this.ajaxFileUploadExtender2._processor.onFileSelectedHandler(e);

                    expect(this.ajaxFileUploadExtender2._processor.createInputFileElement).toHaveBeenCalled();
                }
                else
                    expect(1).toBe(1);
            });

        });
    </script>
</asp:Content>
