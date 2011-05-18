<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Ful.ascx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26864.Ful" %>
<tr>
<th style="background-color: #0033CC; width: 500px; text-align: right;">
<asp:Label ID="lblUpload" ForeColor="#0033CC" Font-Bold="true" Text="Upload Photo:<br />"
runat="server" />
<atk:AsyncFileUpload ID="fulUpload" OnUploadedComplete="ful_UploadCompleted" OnClientUploadComplete="fulImage_UploadCompleted"
UploadingBackColor="#66CCFF" ThrobberID="spanUploading" CompleteBackColor="Green"
ErrorBackColor="Red" runat="server" />
<span id="spanUploading" style="color: #000000; visibility: visible;" runat="server">
Uploading...
<br />
<asp:Image ID="imgThrobber" ImageUrl="~/i/ajax-loader.gif" AlternateText="File upload in process..."
runat="server" />
<br />
</span>
<%--<div style="display: none;">
<atk:AsyncFileUpload ID="AsyncFileUpload1" runat="server" />
</div>--%>
<%--<asp:FileUpload ID="fulUpload" runat="server" />--%>
<asp:Panel ID="pnlCaption" Visible="false" runat="server">
<span style="color: #FFD700; font-weight: bold;">Give it a caption <span style="font-size: 8pt;">
(names, activity, etc.)</span><span style="color: #FFD700; font-weight: Bold;">:</span></span>
<br />
<asp:TextBox ID="txtCaption" Font-Size="10pt" Width="400px" BorderWidth="2" BorderColor="#000000"
runat="server" />
</asp:Panel>
<br />
<br />
<asp:Button ID="btnUpload" Text="Upload" CommandName="New" runat="server" /><%--OnClick="btnUpload_Click"--%>
<asp:Button ID="btnFinished" Text="Finished" CommandName="Cancel" OnClick="btnFinished_Click"
runat="server" />
<br />
<br />
</th>
</tr>