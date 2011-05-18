<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26698.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <act:ToolkitScriptManager ID="tsm1" runat="server" />
    <act:Accordion ID="Accordion1" runat="server">
    <Panes>
    <act:AccordionPane ID="AccordionPane1" runat="server" >
        <Header>1</Header>
        <Content>
            <act:AsyncFileUpload id="AsyncFileUpload1" runat="server" UploaderStyle="Modern" Width="544px" />
        </Content>
    </act:AccordionPane>
    <act:AccordionPane ID="AccordionPane2" runat="server">
        <Header>2</Header>
        <Content>
            <act:AsyncFileUpload id="AsyncFileUpload2" runat="server" Width="544px"></act:AsyncFileUpload>
        </Content>
    </act:AccordionPane>
    <act:AccordionPane ID="AccordionPane3" runat="server">
        <Header>Upload File</Header>
        <Content> 
            <act:AsyncFileUpload id="AsyncFileUpload4" runat="server" UploaderStyle="Modern" Width="544px" />
        </Content>
    </act:AccordionPane>
    </Panes>
    </act:Accordion>
    </div>
    </form>
</body>
</html>
