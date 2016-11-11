<%@ Page Title="Slider Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="Slider.aspx.cs" Inherits="Slider_Slider" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    Slider Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <table style="margin: auto">
        <tr>
            <td>Horizontal Slider ranging from -100 to +100 with 5 discrete values (5 steps),
                bound to a Label control. Changing the value will cause the Slider to trigger
                an update of the UpdatePanel that displays the current date and time.
            </td>
            <td style="width: 205px">
                <table>
                    <tr>
                        <td style="width: 140px;">
                            <asp:TextBox ID="Slider1" runat="server" AutoPostBack="true" Style="right: 0px" Text="0" />
                        </td>
                        <td style="width: 15px"></td>
                        <td style="width: auto">
                            <asp:Label ID="Slider1_BoundControl" runat="server" Style="text-align: right" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div style="padding-top: 10px; text-align: center">
                                <asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="conditional">
                                    <ContentTemplate>
                                        <asp:Label ID="lblUpdateDate" runat="server" Style="font-size: 80%;" Text="&nbsp;" />
                                    </ContentTemplate>
                                    <Triggers>
                                        <asp:AsyncPostBackTrigger ControlID="Slider1" EventName="TextChanged" />
                                    </Triggers>
                                </asp:UpdatePanel>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>Vertical Slider ranging from 0 to 100, bound to a TextBox. Clicking on the rail will cause 
                the handle to slide with a nice animation effect.
            </td>
            <td style="height: 166px;">
                <table style="display: inline;">
                    <tr>
                        <td>
                            <asp:TextBox ID="Slider2" runat="server" /></td>
                        <td>
                            <asp:TextBox ID="Slider2_BoundControl" runat="server" Width="30" /></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>Slider instance that is accessible. Its borders allow the slider's rail
                to be distinguished in high contrast mode. The TooltipText property on the slider's handle
                indicates the current value of the slider and what is actionable for the user when focus is set on
                that image. The value of the slider can be changed using the bound textbox so that it is completely 
                usable without a mouse. Keyboard support for the Slider's handle is not in yet but will be available in
                the later Toolkit releases.
            </td>
            <td style="width: 205px">
                <table>
                    <tr>
                        <td style="width: 140px; border: solid 1px #808080">
                            <asp:TextBox ID="Slider3" runat="server" Style="right: 0px" Text="0" />
                        </td>
                        <td style="width: 15px"></td>
                        <td style="width: auto">
                            <asp:TextBox ID="Slider3_BoundControl" runat="server" Width="30" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>Slider instance using a decimal range from 0.1 to 1.0.
            </td>
            <td style="width: 205px">
                <table>
                    <tr>
                        <td style="width: 140px;">
                            <asp:TextBox ID="Slider4" runat="server" Style="right: 0px" />
                        </td>
                        <td style="width: 15px"></td>
                        <td style="width: auto">
                            <asp:Label ID="Slider4_BoundControl" runat="server" Style="text-align: right" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <ajaxToolkit:SliderExtender ID="SliderExtender1" runat="server"
        BehaviorID="Slider1"
        TargetControlID="Slider1"
        Minimum="-100"
        Maximum="100"
        BoundControlID="Slider1_BoundControl"
        Steps="5" />

    <ajaxToolkit:SliderExtender ID="SliderExtender2" runat="server"
        BehaviorID="Slider2"
        TargetControlID="Slider2"
        BoundControlID="Slider2_BoundControl"
        Orientation="Vertical"
        EnableHandleAnimation="true" />

    <ajaxToolkit:SliderExtender ID="SliderExtender3" runat="server"
        BehaviorID="Slider3"
        TargetControlID="Slider3"
        BoundControlID="Slider3_BoundControl"
        Orientation="Horizontal"
        EnableHandleAnimation="true"
        TooltipText="Slider: value {0}. Please slide to change value." />

    <ajaxToolkit:SliderExtender ID="SliderExtender4" runat="server"
        BehaviorID="Slider4"
        TargetControlID="Slider4"
        BoundControlID="Slider4_BoundControl"
        Orientation="Horizontal"
        EnableHandleAnimation="true"
        TooltipText="{0}"
        Decimals="2"
        Minimum="0.1"
        Maximum="1" />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>Slider Description</Header>
        <Content>
            <div runat="server" data-control-type="SliderExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Slider Properties</Header>
        <Content>
            <div runat="server" data-control-type="SliderExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Slider Tips</Header>
        <Content>
            <ul>
                <li>
                    <strong>TextBox visibility.</strong>
                    The asp:TextBox that the Slider is upgrading will be visible during the page loading,
                    so it is usable if JavaScript is not enabled on the browser. Depending on your
                    requirements, you can prevent the asp:TextBox from being visible
                    by setting its display mode to "none".
                </li>
                <li>
                    <strong>Inline - Block.</strong>
                    While the TextBox is rendered as an inline element, the Slider will be 
                    rendered as a block element. Consider using floats or a table when designing that 
                    portion of layout. The CSS inline-block display mode is not supported by Internet 
                    Explorer 6.
                </li>
                <li>
                    <strong>CSS.</strong>
                    When using custom CSS classes for the Slider's rail and handle, it's recommended to 
                    specify positioning. The rail should have position:relative while the handle 
                    should have position:absolute.<br />
                    If a CSS class for the slider's rail is provided, the developer can choose to provide 
                    a CSS class for the handle or the URL to an image to display as the handle.<br />
                    Borders should be added to a wrapping &lt;div&gt;.
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
