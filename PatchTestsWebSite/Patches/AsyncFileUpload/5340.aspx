<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultTests.master"
    AutoEventWireup="true"
    CodeFile="5340.aspx.cs"
    Inherits="Patch5340"
    Title="AsyncFileUpload Sample"
    Theme="SampleSiteTheme" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">


    <div>PersistFile default "false"</div>
    <br />
    <asp:AsyncFileUpload runat="server" ID="AsyncFileUpload1"  
        Width="800px" 
        UploaderStyle="Modern" 
        UploadingBackColor="#CCFFFF" 
        ThrobberID="myThrobber"
    />&nbsp;
    
    <asp:Label runat="server" 
        ID="myThrobber" 
        style="display:none;" 
    ><img align="middle" alt="" src="uploading.gif" /></asp:Label>

    <br />
    <div>PersistFile set to true</div>
    <div>Last location remembered after page refresh</div>
    <br />
    
    <asp:AsyncFileUpload runat="server" ID="AsyncFileUpload2"  
        PersistFile="true"
        Width="800px" 
        UploaderStyle="Modern" 
        UploadingBackColor="#CCFFFF" 
        ThrobberID="myThrobber2"
    />&nbsp;
    
    <asp:Label runat="server" 
        ID="myThrobber2" 
        style="display:none;" 
    ><img align="middle" alt="" src="uploading.gif" /></asp:Label>

    <br />
    <div>PersistFile set to true. Clear called in code behind</div>
    <br />
    
    <asp:AsyncFileUpload runat="server" ID="AsyncFileUpload3"  
        PersistFile="true"
        Width="800px" 
        UploaderStyle="Modern" 
        UploadingBackColor="#CCFFFF" 
        ThrobberID="myThrobber3"
    />&nbsp;
    
    <asp:Label runat="server" 
        ID="myThrobber3" 
        style="display:none;" 
    ><img align="middle" alt="" src="uploading.gif" /></asp:Label>

</asp:Content>
