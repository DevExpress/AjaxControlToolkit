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

    <act:AjaxFileUpload runat="server" ID="DisabledAjaxFileUpload" Enabled="false" />

    <script>
        describe("AjaxFileUpload", function() {

            var AJAX_FILE_UPLOAD_CLIENT_ID = "<%= TestAjaxFileUpload.ClientID %>";
            var AJAX_FILE_UPLOAD2_CLIENT_ID = "<%= TestAjaxFileUpload2.ClientID %>";
            var DISABLED_AJAX_FILE_UPLOAD_CLIENT_ID = "<%= DisabledAjaxFileUpload.ClientID %>";

            beforeEach(function() {
                this.ajaxFileUploadExtender = $find(AJAX_FILE_UPLOAD_CLIENT_ID);
                this.ajaxFileUploadExtender2 = $find(AJAX_FILE_UPLOAD2_CLIENT_ID);
                this.disabledAjaxFileUploadExtender = $find(DISABLED_AJAX_FILE_UPLOAD_CLIENT_ID);
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

            it("returns root-based handler path by default", function () {
                expect(this.ajaxFileUploadExtender.get_uploadHandlerPath()).toBe("/AjaxFileUploadHandler.axd");
            });

            it("reads Enabled property from server", function () {
                expect(this.disabledAjaxFileUploadExtender.get_enabled()).toBe(false);
            });

            it("does not allow to drop files if disabled", function () {
                spyOn(this.disabledAjaxFileUploadExtender._processor, "addFilesToQueue");
                var fakeEvent = { stopPropagation: function () { }, preventDefault: function () { } };
                this.disabledAjaxFileUploadExtender._processor.onFileDroppedHandler(fakeEvent);
                expect(this.disabledAjaxFileUploadExtender._processor.addFilesToQueue).not.toHaveBeenCalled();
            });

        });
    </script>
</asp:Content>
