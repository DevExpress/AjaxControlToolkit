<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MemoryLeak2.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._16616.MemoryLeak2" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajt" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Memory Leak</title>
    <link href="Styles.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <form id="form1" runat="server">
    
    <asp:ScriptManager ID="ScriptManager" runat="server">
    </asp:ScriptManager>
    
    <asp:UpdatePanel UpdateMode="Conditional" ID="UpdatePanel" runat="server">     
    <ContentTemplate>

        <ajt:TabContainer ID="tbc" runat="server">
        
            <ajt:TabPanel  ID="tbp0" runat="server" HeaderText="[Tab0]" >
                <ContentTemplate>                    
                        <asp:TextBox runat="server" ID="txt1" Text="Some Text"></asp:TextBox>
                        <asp:DropDownList runat="server" ID="ddl1">
                        <asp:ListItem Text="Item 1" Value="1"></asp:ListItem>
                        <asp:ListItem Text="Item 2" Value="2"></asp:ListItem>
                        <asp:ListItem Text="Item 3" Value="3"></asp:ListItem>
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="txt1" ID="rfv1"></asp:RequiredFieldValidator>                       
                        <ajt:ValidatorCalloutExtender runat="Server" ID="vce1" TargetControlID="rfv1" HighlightCssClass="validatorCalloutHighlight" /> 
                </ContentTemplate>    
            </ajt:TabPanel>      
              
            <ajt:TabPanel ID="tbp1" runat="server" HeaderText="[Tab1]" >
                <ContentTemplate>   
                        <asp:TextBox runat="server" ID="txt2" Text="Some Text"></asp:TextBox>
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="txt2" ID="rfv2"></asp:RequiredFieldValidator>                       
                        <ajt:ValidatorCalloutExtender runat="Server" ID="vce2" TargetControlID="rfv2" HighlightCssClass="validatorCalloutHighlight" /> 
                </ContentTemplate>    
            </ajt:TabPanel>
            
                         
            <ajt:TabPanel ID="tbp2" Visible="false" runat="server" HeaderText="[Tab2]" >
                <ContentTemplate>    
                <asp:TextBox runat="server" ID="txt3" Text="Some Text"></asp:TextBox>
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="txt3" ID="rfv3"></asp:RequiredFieldValidator>                       
                        <ajt:ValidatorCalloutExtender runat="Server" ID="vce3" TargetControlID="rfv3" HighlightCssClass="validatorCalloutHighlight" />                 
                </ContentTemplate>    
            </ajt:TabPanel>
            
                         
            <ajt:TabPanel ID="tbp3" Visible="false" runat="server" HeaderText="[Tab3]" >
                <ContentTemplate>    
                <asp:TextBox runat="server" ID="txt4" Text="Some Text"></asp:TextBox>
                        <asp:DropDownList runat="server" ID="ddl4">
                            <asp:ListItem Text="Item 1" Value="1"></asp:ListItem>
                            <asp:ListItem Text="Item 2" Value="2"></asp:ListItem>
                            <asp:ListItem Text="Item 3" Value="3"></asp:ListItem>
                        </asp:DropDownList>
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="txt4" ID="rfv4"></asp:RequiredFieldValidator>                       
                        <ajt:ValidatorCalloutExtender runat="Server" ID="vce4" TargetControlID="rfv4" HighlightCssClass="validatorCalloutHighlight" />                 
                </ContentTemplate>    
            </ajt:TabPanel>

        </ajt:TabContainer>    
    
        <asp:Button runat="server" ID="btn" Text="Postback" onclick="btn_Click" />
        <asp:Button runat="server" ID="btnNavigate" Text="Navigate" onclick="btnNavigate_Click"/>             
   
        <asp:Timer Enabled="true" runat="server" Interval="2000" ID="Timer" ontick="Timer_Tick"> </asp:Timer>

    </ContentTemplate>   
    </asp:UpdatePanel>
                
    <br />
               
    <div>AsyncPostBack Response Time</div>
    <div id="div">0</div>
    <div>Counter</div>
    <div id="counter">0</div>

    <br />
    
    <div>Let the page do some AsyncPostbacks and then click Navigate to jump to another page and start again (if you don't click Navigate the Page will do it for you when the counter reach 20 AsyncPostBacks). After some minutes you will note the Leak in the IE Memory usage and you will also note some kind of response time degration.</div>
    
    </form>
    
    <script type="text/javascript">
   
    var prm = Sys.WebForms.PageRequestManager.getInstance();     
    
    function CancelAsyncPostBack() 
    {
        if (prm.get_isInAsyncPostBack()) 
        {
            prm.abortPostBack();
        }
    }       

    prm.add_initializeRequest(InitializeRequest);
    prm.add_endRequest(EndRequest);        
    var postBackElement;
    var initDate; 
    var endDate;
    
    function InitializeRequest(sender, args) 
    {         
        initDate = new Date();                        
    
        if (prm.get_isInAsyncPostBack()) 
        {
            args.set_cancel(true);
        }    

        postBackElement = args.get_postBackElement();                      
        
 
    }

    function EndRequest(sender, args) 
    {   
        endDate = new Date();                
        
        div.innerHTML=endDate.getTime() - initDate.getTime();            
                    
        counter.innerHTML=parseInt(counter.innerHTML) + 1;
        
        if (!(parseInt(counter.innerHTML)<20))
        {
           document.getElementById('<%= btnNavigate.ClientID %>').click();
        }
    }

    </script>

</body>
</html>
