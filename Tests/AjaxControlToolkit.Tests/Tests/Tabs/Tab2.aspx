<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Tab2.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.Tabs.Tab2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
<form id="form1" runat="server">
<table cellpadding="5px">
    <tr valign="top">
        <td>
            Default:
            <act:TabContainer ID="TabContainer1" runat="server" ActiveTabIndex="1" Height="150px"
                Width="495px" ScrollBars="Auto" UseVerticalStripPlacement="true">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel1">
                    <HeaderTemplate>
                        First</HeaderTemplate>
                    <ContentTemplate>
                        First tab contents Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod,
                        dolor non consequat eleifend, mauris odio viverra orci, ut accumsan nibh leo eu
                        odio. Sed et ipsum urna. Donec lacinia auctor metus, et iaculis sapien ornare id.
                        Nunc varius pellentesque felis, ut blandit ligula suscipit in. Nullam lectus tellus,
                        dictum ac bibendum ut, imperdiet et risus. Class aptent taciti sociosqu ad litora
                        torquent per conubia nostra, per inceptos himenaeos. Nulla facilisi. Donec sem urna,
                        accumsan nec porttitor ac, aliquet et nulla. Morbi ac tellus eu neque iaculis euismod
                        in vel purus. Pellentesque lorem tortor, dictum non laoreet vitae, suscipit a metus.
                        Vivamus vitae neque non ipsum pretium suscipit vel sit amet purus. Mauris in eros
                        orci. Aliquam vitae justo et est eleifend sollicitudin sed eu dui. Vivamus vestibulum
                        viverra ante. Donec eu nisi orci, id consectetur lectus. Aliquam volutpat, massa
                        rhoncus porttitor laoreet, purus enim porttitor tellus, at interdum tortor nulla
                        at velit.<br />
                    </ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel2" runat="server" HeaderText="TabPanel2">
                    <HeaderTemplate>
                        Second</HeaderTemplate>
                    <ContentTemplate>
                        S</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel3" runat="server" HeaderText="TabPanel3">
                    <ContentTemplate>
                        3</ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </td>
        <td>
            Default:
            <act:TabContainer ID="TabContainer5" runat="server" ActiveTabIndex="0" Height="150px"
                Width="300px" ScrollBars="Auto" UseVerticalStripPlacement="false">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel4">
                    <HeaderTemplate>
                        First</HeaderTemplate>
                    <ContentTemplate>
                        <p>
                            First tab contents</p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod, dolor non consequat
                        eleifend, mauris odio viverra orci, ut accumsan nibh leo eu odio. Sed et ipsum urna.
                        Donec lacinia auctor metus, et iaculis sapien ornare id. Nunc varius pellentesque
                        felis, ut blandit ligula suscipit in. Nullam lectus tellus, dictum ac bibendum ut,
                        imperdiet et risus. Class aptent taciti sociosqu ad litora torquent per conubia
                        nostra, per inceptos himenaeos. Nulla facilisi. Donec sem urna, accumsan nec porttitor
                        ac, aliquet et nulla. Morbi ac tellus eu neque iaculis euismod in vel purus. Pellentesque
                        lorem tortor, dictum non laoreet vitae, suscipit a metus. Vivamus vitae neque non
                        ipsum pretium suscipit vel sit amet purus. Mauris in eros orci. Aliquam vitae justo
                        et est eleifend sollicitudin sed eu dui. Vivamus vestibulum viverra ante. Donec
                        eu nisi orci, id consectetur lectus. Aliquam volutpat, massa rhoncus porttitor laoreet,
                        purus enim porttitor tellus, at interdum tortor nulla at velit.<br />
                    </ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel5" runat="server" HeaderText="TabPanel2">
                    <HeaderTemplate>
                        Second</HeaderTemplate>
                    <ContentTemplate>
                        S</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel6" runat="server" HeaderText="TabPanel3">
                    <ContentTemplate>
                        3</ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </td>
    </tr>
    <tr valign="top">
        <td>
            TopRight:
            <act:TabContainer ID="TabContainer2" runat="server" ActiveTabIndex="0" Height="120px"
                Width="495px" ScrollBars="Auto" TabStripPlacement="TopRight" UseVerticalStripPlacement="true">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel11">
                    <HeaderTemplate>
                        ABCD</HeaderTemplate>
                    <ContentTemplate>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod, dolor non consequat
                        eleifend, mauris odio viverra orci, ut accumsan nibh leo eu odio. Sed et ipsum urna.
                        Donec lacinia auctor metus, et iaculis sapien ornare id. Nunc varius pellentesque
                        felis, ut blandit ligula suscipit in. Nullam lectus tellus, dictum ac bibendum ut,
                        imperdiet et risus. Class aptent taciti sociosqu ad litora torquent per conubia
                        nostra, per inceptos himenaeos. Nulla facilisi. Donec sem urna, accumsan nec porttitor
                        ac, aliquet et nulla.</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel12" runat="server" HeaderText="TabPanel12">
                    <ContentTemplate>
                        Morbi ac tellus eu neque iaculis euismod in vel purus. Pellentesque lorem tortor,
                        dictum non laoreet vitae, suscipit a metus. Vivamus vitae neque non ipsum pretium
                        suscipit vel sit amet purus. Mauris in eros orci. Aliquam vitae justo et est eleifend
                        sollicitudin sed eu dui. Vivamus vestibulum viverra ante. Donec eu nisi orci, id
                        consectetur lectus. Aliquam volutpat, massa rhoncus porttitor laoreet, purus enim
                        porttitor tellus, at interdum tortor nulla at velit. Curabitur convallis ante vel
                        augue commodo laoreet. Etiam et sagittis lectus. Vestibulum tincidunt turpis nec
                        mi adipiscing sagittis. Phasellus eu euismod lacus. Morbi eget dui pharetra dolor
                        imperdiet scelerisque tincidunt quis lacus. Praesent commodo justo id nisl consectetur
                        malesuada. Phasellus vulputate est at velit eleifend dignissim. Sed vehicula convallis
                        viverra. Nam massa mi, malesuada ac tincidunt molestie, molestie in mauris. Nam
                        vel nibh enim, non ultricies magna. Cras nec est odio, sed lacinia augue. Etiam
                        iaculis, tortor et cursus consequat, risus enim sollicitudin augue, id laoreet tellus
                        nunc sit amet enim. Nulla lobortis massa elit, nec eleifend lorem. Aenean non urna
                        risus, ac imperdiet orci. Maecenas adipiscing tortor sit amet orci blandit porta
                        fringilla lorem scelerisque. Praesent eget enim vitae velit consequat facilisis
                        a id elit.</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel13" runat="server" HeaderText="TabPanel13">
                    <ContentTemplate>
                        Sed condimentum, nulla quis ullamcorper vulputate, magna massa hendrerit neque,
                        a tristique libero nunc ut massa. Duis commodo nunc quis ipsum pellentesque vel
                        iaculis</ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </td>
        <td>
            TopRight:
            <act:TabContainer ID="TabContainer6" runat="server" ActiveTabIndex="0" Height="120px"
                Width="495px" ScrollBars="Auto" TabStripPlacement="TopRight" UseVerticalStripPlacement="false">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel7">
                    <HeaderTemplate>
                        ABCD</HeaderTemplate>
                    <ContentTemplate>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod, dolor non consequat
                        eleifend, mauris odio viverra orci, ut accumsan nibh leo eu odio. Sed et ipsum urna.
                        Donec lacinia auctor metus, et iaculis sapien ornare id. Nunc varius pellentesque
                        felis, ut blandit ligula suscipit in. Nullam lectus tellus, dictum ac bibendum ut,
                        imperdiet et risus. Class aptent taciti sociosqu ad litora torquent per conubia
                        nostra, per inceptos himenaeos. Nulla facilisi. Donec sem urna, accumsan nec porttitor
                        ac, aliquet et nulla.</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel8" runat="server" HeaderText="TabPanel12">
                    <ContentTemplate>
                        Morbi ac tellus eu neque iaculis euismod in vel purus. Pellentesque lorem tortor,
                        dictum non laoreet vitae, suscipit a metus. Vivamus vitae neque non ipsum pretium
                        suscipit vel sit amet purus. Mauris in eros orci. Aliquam vitae justo et est eleifend
                        sollicitudin sed eu dui. Vivamus vestibulum viverra ante. Donec eu nisi orci, id
                        consectetur lectus. Aliquam volutpat, massa rhoncus porttitor laoreet, purus enim
                        porttitor tellus, at interdum tortor nulla at velit. Curabitur convallis ante vel
                        augue commodo laoreet. Etiam et sagittis lectus. Vestibulum tincidunt turpis nec
                        mi adipiscing sagittis. Phasellus eu euismod lacus. Morbi eget dui pharetra dolor
                        imperdiet scelerisque tincidunt quis lacus. Praesent commodo justo id nisl consectetur
                        malesuada. Phasellus vulputate est at velit eleifend dignissim. Sed vehicula convallis
                        viverra. Nam massa mi, malesuada ac tincidunt molestie, molestie in mauris. Nam
                        vel nibh enim, non ultricies magna. Cras nec est odio, sed lacinia augue. Etiam
                        iaculis, tortor et cursus consequat, risus enim sollicitudin augue, id laoreet tellus
                        nunc sit amet enim. Nulla lobortis massa elit, nec eleifend lorem. Aenean non urna
                        risus, ac imperdiet orci. Maecenas adipiscing tortor sit amet orci blandit porta
                        fringilla lorem scelerisque. Praesent eget enim vitae velit consequat facilisis
                        a id elit.</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel9" runat="server" HeaderText="TabPanel13">
                    <ContentTemplate>
                        Sed condimentum, nulla quis ullamcorper vulputate, magna massa hendrerit neque,
                        a tristique libero nunc ut massa. Duis commodo nunc quis ipsum pellentesque vel
                        iaculis</ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </td>
    </tr>
    <tr valign="top">
        <td>
            Bottom:
            <act:TabContainer ID="TabContainer3" runat="server" ActiveTabIndex="0" Height="82px"
                Width="495px" ScrollBars="Auto" TabStripPlacement="Bottom" UseVerticalStripPlacement="true">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel21">
                    <HeaderTemplate>
                        ABCD</HeaderTemplate>
                    <ContentTemplate>
                        1</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel22" runat="server" HeaderText="TabPanel22">
                    <ContentTemplate>
                        2</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel23" runat="server" HeaderText="TabPanel23">
                    <ContentTemplate>
                        3</ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </td>
        <td>
            Bottom:
            <act:TabContainer ID="TabContainer7" runat="server" ActiveTabIndex="0" Height="82px"
                Width="495px" ScrollBars="Auto" TabStripPlacement="Bottom" UseVerticalStripPlacement="false">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel10">
                    <HeaderTemplate>
                        ABCD</HeaderTemplate>
                    <ContentTemplate>
                        1</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel14" runat="server" HeaderText="TabPanel22">
                    <ContentTemplate>
                        2</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel15" runat="server" HeaderText="TabPanel23">
                    <ContentTemplate>
                        3</ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </td>
    </tr>
    <tr valign="top">
        <br />
        <td>
            Bottom Right:
            <act:TabContainer ID="TabContainer4" runat="server" ActiveTabIndex="0" Height="82px"
                Width="495px" ScrollBars="Auto" TabStripPlacement="BottomRight" UseVerticalStripPlacement="true">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel31">
                    <HeaderTemplate>
                        ABCD</HeaderTemplate>
                    <ContentTemplate>
                        1</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel32" runat="server" HeaderText="TabPanel32">
                    <ContentTemplate>
                        2</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel33" runat="server" HeaderText="TabPanel33">
                    <ContentTemplate>
                        3</ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </td>
        <td>
            Bottom Right:
            <act:TabContainer ID="TabContainer8" runat="server" ActiveTabIndex="0" Height="82px"
                Width="495px" ScrollBars="Auto" TabStripPlacement="BottomRight" UseVerticalStripPlacement="false">
                <act:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel16">
                    <HeaderTemplate>
                        ABCD</HeaderTemplate>
                    <ContentTemplate>
                        1</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel17" runat="server" HeaderText="TabPanel32">
                    <ContentTemplate>
                        2</ContentTemplate>
                </act:TabPanel>
                <act:TabPanel ID="TabPanel18" runat="server" HeaderText="TabPanel33">
                    <ContentTemplate>
                        3</ContentTemplate>
                </act:TabPanel>
            </act:TabContainer>
        </td>
    </tr>
</table>
<act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
</act:ToolkitScriptManager>
</form>
</body>
</html>
