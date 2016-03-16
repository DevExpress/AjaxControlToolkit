<%@ Page Language="C#"  MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ModalPopupTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ModalPopupTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    Modal
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">
	<style type="text/css">
		.cssextender{
			background-color: red;
		}
	</style>

	<asp:Panel ID="TestPanel" runat="server" Style="display: none;">
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis congue sem. Vestibulum convallis condimentum ligula, sagittis auctor dui scelerisque vel. Praesent porta elit nec placerat faucibus. Donec sed tellus ac lacus efficitur auctor. Phasellus sed bibendum eros. Etiam nisi est, bibendum eu semper ut, venenatis sed est. Donec quis dui sapien. Ut efficitur euismod vehicula. Sed consequat a nisi nec hendrerit. Praesent vulputate ex sit amet porttitor tempor. Sed ac maximus magna. Cras tristique ligula massa, nec dapibus velit tincidunt eu. Mauris gravida eget ligula sit amet ullamcorper. 
		</p>
		<asp:Button ID="OKButton" runat="server" Text="Ok" /> &nbsp;&nbsp;<asp:Button ID="CancelButton" runat="server" Text="Cancel" />
	</asp:Panel>
	<asp:Button ID="OpenButton" runat="server" Text="Open Modal" />

	<act:ModalPopupExtender ID="TargetExtender" runat="server" TargetControlID="OpenButton" PopupControlID="TestPanel" Enabled="True" OkControlID="OKButton" CancelControlID="CancelButton">
    </act:ModalPopupExtender>

	<asp:Panel ID="TestCssPanel" runat="server" Style="display: none;">
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis congue sem. Vestibulum convallis condimentum ligula, sagittis auctor dui scelerisque vel. Praesent porta elit nec placerat faucibus. Donec sed tellus ac lacus efficitur auctor. Phasellus sed bibendum eros. Etiam nisi est, bibendum eu semper ut, venenatis sed est. Donec quis dui sapien. Ut efficitur euismod vehicula. Sed consequat a nisi nec hendrerit. Praesent vulputate ex sit amet porttitor tempor. Sed ac maximus magna. Cras tristique ligula massa, nec dapibus velit tincidunt eu. Mauris gravida eget ligula sit amet ullamcorper. 
		</p>
	</asp:Panel>
	<asp:Button ID="OpenCssButton" runat="server" Text="Open Modal" />
	<act:ModalPopupExtender ID="TargetCssExtender" runat="server" TargetControlID="OpenCssButton" PopupControlID="TestCssPanel" Enabled="True" BackgroundCssClass="cssextender">
    </act:ModalPopupExtender>

    <script>
    	describe("ModalPopup", function () {
    		var POPUP_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID%>";
    		var OPEN_BUTTON_CLIENT_ID = "<%= OpenButton.ClientID%>";

    		var PANEL_CLIENT_ID = "<%= TestPanel.ClientID%>";
    		var OK_BUTTON_CLIENT_ID = "<%= OKButton.ClientID%>";
    		var CANCEL_BUTTON_CLIENT_ID = "<%= CancelButton.ClientID%>";

    		var POPUP_CSS_EXTENDER_CLIENT_ID = "<%= TargetCssExtender.ClientID%>";
    		var PANEL_CSS_CLIENT_ID = "<%= TestCssPanel.ClientID%>";

    		/// <summary>Default state of modal popup is hidden.</summary>
    		describe("InitialRendering", function() {
    			beforeEach(function () {
    				this.extender = $find(POPUP_EXTENDER_CLIENT_ID);
    			});

    			it("popup panel is hidden", function () {
    				expect($(this.extender._popupElement).css("display")).toBe("none");
    			});
    			it("popup foreground is hidden", function() {
    				expect($(this.extender._foregroundElement).css("display")).toBe("none");
    			});
    			it("popup background is hidden", function () {
    				expect($(this.extender._backgroundElement).css("display")).toBe("none");
    			});
    		});

    		/// <summary>When modal popup is displayed, the display attribute is removed.</summary>
    		describe("DisplayRendering", function(){
    			beforeAll(function () {
    				this.extender = $find(POPUP_EXTENDER_CLIENT_ID);
    				this.extender.show();
    			});

    			it("shows popup panel", function () {
    				expect($(this.extender._popupElement).is(':visible')).toBe(true);
    			});
    			it("shows popup foreground", function () {
    				expect($(this.extender._foregroundElement).is(':visible')).toBe(true);
    			});
    			it("shows popup background", function () {
    				expect($(this.extender._backgroundElement).is(':visible')).toBe(true);
    			}); 
    		});

    		/// <summary>When modal popup with custom background css class is displayed, css class is applied</summary>
    		describe("DisplayRenderingWithCustomBackgroundCss", function () {
    			beforeAll(function () {
    				this.extender = $find(POPUP_CSS_EXTENDER_CLIENT_ID);
    				this.extender.show();
    			});

    			it("shows popup background", function () {
    				expect($(this.extender._backgroundElement).is(':visible')).toBe(true);
    			});
    			it("shows popup background with custom color", function () {
    				expect($(this.extender._backgroundElement).attr('class')).toBe('cssextender');
    			});  			
    		});

    		/// <summary>When target control is clicked, popup is displayed </summary>
    		describe("DisplayOnClick", function () {
    			beforeEach(function () {
    				this.extender = $find(POPUP_EXTENDER_CLIENT_ID);
    			});

    			it("shows popup panel on target control click", function () {
    				var openBtn = $.find("#" + OPEN_BUTTON_CLIENT_ID);
    				$(openBtn).click();

    				expect($(this.extender._popupElement).is(':visible')).toBe(true);
    				expect($(this.extender._foregroundElement).is(':visible')).toBe(true);
    				expect($(this.extender._backgroundElement).is(':visible')).toBe(true);
    			});
    		});

    		/// <summary>When ok or cancel control is clicked, popup is hidden </summary>
    		describe("HideOnClick", function () {
    			beforeEach(function () {
    				this.extender = $find(POPUP_EXTENDER_CLIENT_ID);
    				this.extender.show();
    			});

    			it("hides popup panel on ok control click", function () {
    				var okBtn = $.find("#" + OK_BUTTON_CLIENT_ID);
    				console.log(okBtn);
    				$(okBtn).trigger('click');

    				expect($(this.extender._popupElement).css("display")).toBe("none");
    				expect($(this.extender._backgroundElement).css("display")).toBe("none");
    				expect($(this.extender._foregroundElement).css("display")).toBe("none");
    			});
    			it("hides popup panel on cancel control click", function () {
    				var cancelBtn = $.find("#" + CANCEL_BUTTON_CLIENT_ID);
    				$(cancelBtn).trigger('click');

    				expect($(this.extender._popupElement).css("display")).toBe("none");
					expect($(this.extender._backgroundElement).css("display")).toBe("none");
					expect($(this.extender._foregroundElement).css("display")).toBe("none");
    			});
    		});
        });
    </script>
</asp:Content>
