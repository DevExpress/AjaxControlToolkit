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
            <p>
                The MultiHandleSlider extender provides a feature-rich extension to a regular asp:Textbox control. It allows
                you to choose a single value, or multiple values in a range, through a graphical slider interface. It supports
                one handle, dual handles, or any number of handles bound to the values of asp:TextBox or asp:Label controls.
            
                It also provides options for read-only access, custom graphic styling, hover and drag handle styles, as well
                as mouse and keyboard support for accessibility.
                <br />
                <br />
                Much of the MultiHandleSlider's design is based on the original
                <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="~/Slider/Slider.aspx" Text="Slider" />,
                so you may want to review
                the advice and design suggestions offered by the demonstration page of that extender. For example,
                the MultiHandleSlider retains the same ToolTip functionality as the original Slider.
                <br />
                <br />
                By declaring the extended TextBox as a trigger for an UpdatePanel, the MultiHandleSlider can raise the update 
                event whenever the handle is released. By setting the RaiseChangeOnlyOnMouseUp property to false, the update
                is raised as soon as the MultiHandleSlider's value changes.
                <br />
                <br />
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>MultiHandleSlider Properties</Header>
        <Content>
            <p>
                The first example above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
            <pre>&lt;ajaxToolkit:MultiHandleSlider ID="multiHandleSliderExtenderOne"
    runat="server"
    TargetControlID="sliderOne"
    BehaviorID="multiHandleSliderOne"
    <em>BoundControlID</em>="lblSliderOne"
    <em>Minimum</em>="-100"
    <em>Maximum</em>="100"
    <em>Steps</em>="5"
    <em>Length</em>="100"
    <em>ToolTipText</em>="{0}"/&gt;                                                        
</pre>
            <ul>
                <li><strong>Minimum</strong> - Minimum value allowed.</li>
                <li><strong>Maximum</strong> - Maximum value allowed.</li>
                <li><strong>Length</strong> - The length of the graphical slider, in pixels.</li>
                <li><strong>Decimals</strong> - Number of decimal digits for the value.</li>
                <li><strong>Steps</strong> - Number of discrete values inside the slider's range.</li>
                <li><strong>Orientation</strong> - Determines if the slider's orientation is horizontal or vertical.</li>
                <li><strong>CssClass</strong> - The master style to apply to slider graphical elements.</li>
                <li><strong>EnableHandleAnimation</strong> - If true, clicking on the rail to move a handle will animate the handle's movements. </li>
                <li><strong>EnableRailClick</strong> - Whether clicking on the rail will move the closest handle to the click location.</li>
                <li><strong>EnableInnerRangeDrag</strong> - For sliders with multiple handles; determines whether clicking an dragging the rail between two handles moves both handles simultaneously.</li>
                <li><strong>EnableKeyboard</strong> - Whether slider values can be changed using the keyboard.</li>
                <li><strong>EnableMouseWheel</strong> - Whether slider values can be changed using the mouse wheel.</li>
                <li><strong>ShowInnerRail</strong> - For sliders with multiple handles; determines whether to display an inner range style between handles.</li>
                <li><strong>ShowHandleHoverStyle</strong> - Whether to display an alternate CSS style when the user is hovering over a handle.</li>
                <li><strong>ShowHandleDragStyle</strong> - Whether to display an alternate CSS style when the user is dragging a handle.</li>
                <li><strong>InnerRailStyle</strong> - For sliders with multiple handles and custom styles; determines how to render the InnerRailCss, as it is described, or using the sliding doors image approach.</li>
                <li><strong>ReadOnly</strong> - Whether the user can change the rail's values.</li>
                <li><strong>Increment</strong> - For sliders using keyboard or mouse wheel support; determines the number of points to increment or decrement the slider values.</li>
                <li><strong>HandleAnimationDuration</strong> - Duration of the handle animation, in seconds.</li>
                <li><strong>BoundControlID</strong> - For backwards compatibility, allows using classic Slider properties for a single handle.</li>
                <li><strong>HandleCssClass</strong> - For backwards compatibility, specifies the style of the single handle.</li>
                <li><strong>RaiseChangeOnlyOnMouseUp</strong> - If true, fires the change event on the
                extended TextBox only when the left mouse button is released.</li>
                <li><strong>TooltipText</strong> - Text to display in a tooltip when the handle is hovered. The
            {0} placeholder in the text is replaced with the current value of the slider.</li>
                <li><strong>Events</strong>
                    <ul>
                        <li><strong>OnClientLoad</strong> - The event raised when the slider is initialized.</li>
                        <li><strong>OnClientDragStart</strong> - The event raised when the user starts dragging a handle.</li>
                        <li><strong>OnClientDrag</strong> - The event raised when the user drags the handle.</li>
                        <li><strong>OnClientDragEnd</strong> - The event raised when the user stops dragging the handle.</li>
                        <li><strong>OnClientValueChanged</strong> - The event raised when a handle value changes.</li>
                    </ul>
                </li>
                <li><strong>MultiHandleSliderTargets</strong> - An inner property describing each handle on the slider.
                <ul>
                    <li><strong>ControlID</strong> - The TextBox or Label whose value is bound to this handle.</li>
                    <li><strong>HandleCssClass</strong> - For sliders with custom styling; the CSS class used to style the handle.</li>
                    <li><strong>HandleHoverCssClass</strong> - For sliders with custom styling and hover effects; the CSS class used when the user is hovering over the handle.</li>
                    <li><strong>HandleDragCssClass</strong> - For sliders with custom styling and drag effects; the CSS class used when the user is dragging the handle.</li>
                    <li><strong>DecimalPlaces</strong> - The number of decimal places to format the bound control's value.</li>
                    <li><strong>Offset</strong> - For sliders with custom styling and inner rails; sets the pixel offset where the inner rail begins, for handles that use transparency.</li>
                </ul>
                </li>
            </ul>
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

