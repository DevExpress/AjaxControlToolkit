<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.HtmlEditorExtender._27020.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </act:ToolkitScriptManager>
    <div>
        <act:tabcontainer id="TabSet" runat="server" width="600">
        <act:TabPanel ID="Tab1" runat="server" HeaderText="tab 1" Width="580">
          <ContentTemplate>
            <asp:Panel ID="Panel1" runat="server" style="position:relative;height:400px;width:550px">
              <asp:TextBox runat="server" ID="Field1" Columns="50" TextMode="MultiLine" Rows="10" />
              <act:HtmlEditorExtender ID="HEE1" TargetControlID="Field1" runat="server">
                <Toolbar> 
                  <act:Bold />
                  <act:Italic />
                  <act:Underline />
                </Toolbar>
              </act:HtmlEditorExtender>
            </asp:Panel>
          </ContentTemplate>
        </act:TabPanel>
        <act:TabPanel ID="Tab2" runat="server" HeaderText="tab 2" Width="580">
          <ContentTemplate>
            <asp:Panel ID="Panel2" runat="server" style="position:relative;height:400px;width:550px">
               <asp:TextBox runat="server" ID="Field2" Columns="50" TextMode="MultiLine" Rows="10" />
               <act:HtmlEditorExtender ID="HEE2" TargetControlID="Field2" runat="server">
                 <Toolbar> 
                   <act:Bold />
                   <act:Italic />
                   <act:Underline />
                 </Toolbar>
               </act:HtmlEditorExtender>
             </asp:Panel>
           </ContentTemplate>
        </act:TabPanel>
     </act:tabcontainer>
    </div>
    </form>
</body>
</html>
