<%@ Page Title="MultiHandleSlider" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="MultiHandleSlider.aspx.cs" Inherits="MultiHandleSlider_MultiHandleSlider" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    MultiHandleSlider Demonstration
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <table style="margin: auto">
        <%-- Demonstration One --%>
        <tr>
            <td style="width: 250px; float: left;">
                <h3>One Handle</h3>
                <br />
                A single-handled slider is still fully supported. This example borrows from the original
                <asp:HyperLink ID="lnkSlider" runat="server" NavigateUrl="~/Slider/Slider.aspx" Text="Slider" />
                implementation, showing a horizontal slider ranging from -100 to +100 with 5 discrete steps in between,
                bound to an asp:Label control. The example is set up to trigger a postback when the asp:Label's value
                changes.
            </td>
            <td style="width: 205px;">
                <table>
                    <tr>
                        <td style="width: 140px;">
                            <asp:TextBox ID="sliderOne" runat="server" AutoPostBack="true" Text="0" />
                            <ajaxToolkit:MultiHandleSliderExtender ID="multiHandleSliderExtenderOne" runat="server"
                                BehaviorID="multiHandleSliderExtenderOne"
                                TargetControlID="sliderOne"
                                Minimum="-100"
                                Maximum="100"
                                Steps="5"
                                Length="140"
                                BoundControlID="lblSliderOne"
                                TooltipText="{0}">
                            </ajaxToolkit:MultiHandleSliderExtender>
                        </td>
                        <td style="width: 15px"></td>
                        <td style="width: auto">
                            <asp:Label ID="lblSliderOne" runat="server" Style="text-align: right" Text="0" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div style="padding-top: 25px; text-align: center">
                                <asp:UpdatePanel ID="updatePanelOne" runat="server" UpdateMode="Conditional">
                                    <ContentTemplate>
                                        <asp:Label ID="lblUpdateDate" runat="server" Style="font-size: 80%;" Text="Unchanged" />
                                    </ContentTemplate>
                                    <Triggers>
                                        <asp:AsyncPostBackTrigger ControlID="sliderOne" EventName="TextChanged" />
                                    </Triggers>
                                </asp:UpdatePanel>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <%-- Demonstration Two --%>
        <tr>
            <td style="height: 175px; width: 205px;" valign="top">
                <br />
                <h3>Two Handles - Vertical</h3>
                <br />
                This vertical slider has multiple handles and uses drag and hover effects. It also
                     supports animation. Clicking on the outer rail will move the closest handle.
            </td>
            <td style="height: 175px; width: 205px;" valign="top">
                <table>
                    <tr valign="middle">
                        <td>
                            <asp:TextBox ID="multiHandle2_1_BoundControl" runat="server" Width="30" Text="25" />
                        </td>
                        <td valign="top">
                            <asp:TextBox ID="sliderTwo" runat="server" Style="display: none;" />
                            <ajaxToolkit:MultiHandleSliderExtender ID="multiHandleSliderExtenderTwo" runat="server"
                                BehaviorID="multiHandleSliderExtenderTwo"
                                TargetControlID="sliderTwo"
                                Minimum="0"
                                Maximum="100"
                                Length="175"
                                TooltipText="{0}"
                                Orientation="Vertical"
                                EnableHandleAnimation="true"
                                EnableKeyboard="false"
                                EnableMouseWheel="false"
                                ShowHandleDragStyle="true"
                                ShowHandleHoverStyle="true">
                                <MultiHandleSliderTargets>
                                    <ajaxToolkit:MultiHandleSliderTarget ControlID="multiHandle2_1_BoundControl" />
                                    <ajaxToolkit:MultiHandleSliderTarget ControlID="multiHandle2_2_BoundControl" />
                                </MultiHandleSliderTargets>
                            </ajaxToolkit:MultiHandleSliderExtender>
                        </td>
                        <td style="padding-left: 21px">
                            <asp:TextBox ID="multiHandle2_2_BoundControl" runat="server" Width="30" Text="75" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <%-- Demonstration Three --%>
        <tr>
            <td colspan="2" style="height: 130px;" valign="middle">
                <h3>Three Handles - Horizontal</h3>
                <br />
                This slider has three handles, showing that you can declare as many handles as fit 
                your needs. It also demonstrates visibly distinguishing the inner range from the outer rail.
            </td>
        </tr>
        <tr valign="top">
            <td>
                <asp:TextBox ID="multiHandle3_1_BoundControl" runat="server" Text="25" Style="display: none;" />
                <asp:TextBox ID="multiHandle3_2_BoundControl" runat="server" Text="50" Style="display: none;" />
                <asp:TextBox ID="multiHandle3_3_BoundControl" runat="server" Text="75" Style="display: none;" />
                <asp:TextBox ID="sliderThree" runat="server" Style="display: none;" />
                <ajaxToolkit:MultiHandleSliderExtender ID="multiSliderExtenderThree" runat="server"
                    BehaviorID="multiSliderExtenderThree"
                    TargetControlID="sliderThree"
                    Minimum="0"
                    Maximum="100"
                    Length="450"
                    EnableHandleAnimation="true"
                    EnableKeyboard="false"
                    EnableMouseWheel="false"
                    ShowInnerRail="true"
                    ShowHandleDragStyle="true"
                    ShowHandleHoverStyle="true">
                    <MultiHandleSliderTargets>
                        <ajaxToolkit:MultiHandleSliderTarget ControlID="multiHandle3_1_BoundControl" />
                        <ajaxToolkit:MultiHandleSliderTarget ControlID="multiHandle3_2_BoundControl" />
                        <ajaxToolkit:MultiHandleSliderTarget ControlID="multiHandle3_3_BoundControl" />
                    </MultiHandleSliderTargets>
                </ajaxToolkit:MultiHandleSliderExtender>
            </td>
        </tr>
        <%-- Demonstration Four --%>
        <tr style="height: 180px;" valign="middle">
            <td colspan="2">
                <br />
                <h3>Two Handles - Custom</h3>
                <br />
                This dual slider demonstrates how you can use sliding doors custom styling to achieve
                a popular slider skin effect, where the inner range is visibly contrasted against the
                selectable total range. You can drag between the two slider handles to move the entire
                inner range, and use the arrow keys or mouse wheel while hovering over the slider to
                change its values.
            </td>
        </tr>
        <tr>
            <td style="padding-left: 65px;" valign="top">
                <table>
                    <tr>
                        <td>
                            <asp:TextBox ID="multiHandle4_1_BoundControl" runat="server" Text="25" Style="display: none;" />
                            <asp:TextBox ID="multiHandle4_2_BoundControl" runat="server" Text="75" Style="display: none;" />
                        </td>
                        <td style="width: 140px; height: 25px;" valign="top">
                            <asp:TextBox ID="sliderFour" runat="server" Style="display: none;" />
                            <ajaxToolkit:MultiHandleSliderExtender ID="multiSliderExtenderFour" runat="server"
                                BehaviorID="multiSliderExtenderFour"
                                TargetControlID="sliderFour"
                                Minimum="0"
                                Maximum="100"
                                Length="300"
                                EnableHandleAnimation="true"
                                ShowInnerRail="true"
                                EnableInnerRangeDrag="true"
                                InnerRailStyle="SlidingDoors"
                                CssClass="ajax__multi_slider_custom"
                                Increment="4">
                                <MultiHandleSliderTargets>
                                    <ajaxToolkit:MultiHandleSliderTarget
                                        ControlID="multiHandle4_1_BoundControl"
                                        HandleCssClass="handle_horizontal_left"
                                        Offset="6" />
                                    <ajaxToolkit:MultiHandleSliderTarget
                                        ControlID="multiHandle4_2_BoundControl"
                                        HandleCssClass="handle_horizontal_right"
                                        Offset="-6" />
                                </MultiHandleSliderTargets>
                            </ajaxToolkit:MultiHandleSliderExtender>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>MultiHandleSlider Description</Header>
        <Content>
            <div runat="server" data-control-type="MultiHandleSliderExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>MultiHandleSlider Properties</Header>
        <Content>
            <div runat="server" data-control-type="MultiHandleSliderExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>MultiHandleSlider Tips</Header>
        <Content>
            <ul>
                <li>
                    <strong>TextBox visibility.</strong>
                    The asp:TextBox that the MultiHandleSlider is upgrading will be visible during the page loading,
                    so it is usable if JavaScript is not enabled on the browser. Depending on your 
                    requirements, you can prevent the asp:TextBox from being visible by setting its display mode to "none".
                </li>
                <li>
                    <strong>Inline - Block.</strong>
                    While the TextBox is rendered as an inline element, the MultiHandleSlider will be 
                    rendered as a block element. Consider using floats or a table when designing that 
                    portion of the layout. The CSS inline-block display mode is not supported by Internet 
                    Explorer 6.
                </li>
                <li>
                    <strong>CSS.</strong>
                    When using custom CSS classes for the MultiHandleSlider's rail and handles, it's recommended to 
                    specify positioning. The rail should have position:relative while the handle 
                    should have position:absolute. Also, ensure you set the z-order for handles higher than the rail so
                    that they appear in front of the rail.<br />
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

