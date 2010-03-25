<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultTests.master"
    AutoEventWireup="true"
    CodeFile="5356.aspx.cs"
    Inherits="Patch5356"
    Title="AsyncFileUpload Sample"
    Theme="SampleSiteTheme" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">

    <asp:Label runat="server" 
        ID="myThrobber" 
        style="display:none;" 
    ><img align="middle" alt="" src="uploading.gif" /></asp:Label>

    <br />
    <div>PersistFileInSession set to "true"</div>
    <br />
    <div>Last location remembered after page refresh</div>
    <br />
    <div>However setting sessionState mode to <i>StateServer</i> causes an exception: "Unable to serialize the session state". The default setting of PersistFileInSession set to <i>false</i> avoids this exception</div>
    <br />

    <asp:AsyncFileUpload runat="server" ID="AsyncFileUpload1"  
        PersistFileInSession="true"
        Width="400px" 
        UploaderStyle="Modern" 
        UploadingBackColor="#CCFFFF" 
        ThrobberID="myThrobber1"
    />&nbsp;
    
    <asp:Label runat="server" 
        ID="myThrobber1" 
        style="display:none;" 
    ><img align="middle" alt="" src="uploading.gif" /></asp:Label>
</asp:Content>
