<%@ Page Title="UpdatePanelAnimation Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="UpdatePanelAnimation.aspx.cs" Inherits="UpdatePanelAnimation_UpdatePanelAnimation" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    UpdatePanelAnimation Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <div style="margin-bottom: 10px;">
        <div style="border: dashed 1px #222222;">
            <div id="up_container" style="background-color: #40669A;">
                <asp:UpdatePanel ID="update" runat="server">
                    <ContentTemplate>
                        <div id="background" style="text-align: center; vertical-align: middle; line-height: 44px; padding: 12px; height: 44px; color: #FFFFFF;">
                            <asp:Label ID="lblUpdate" runat="server" Style="padding: 5px; font-size: 14px; font-weight: bold;">
                                    4/28/1906 12:00:00 AM
                            </asp:Label>
                        </div>
                    </ContentTemplate>
                    <Triggers>
                        <asp:AsyncPostBackTrigger ControlID="btnUpdate" EventName="Click" />
                    </Triggers>
                </asp:UpdatePanel>
            </div>
        </div>
    </div>

    Choose the effects, then press 'Update':<br />
    <input type="checkbox" id="effect_fade" checked="checked" /><label for="effect_fade">Fade</label><br />
    <input type="checkbox" id="effect_collapse" checked="checked" /><label for="effect_collapse">Collapse</label><br />
    <input type="checkbox" id="effect_color" checked="checked" /><label for="effect_color">Color Background</label><br />
    <asp:Button ID="btnUpdate" runat="server" Text="Update" OnClick="btnUpdate_Click" />

    <ajaxToolkit:UpdatePanelAnimationExtender ID="upae" BehaviorID="animation" runat="server" TargetControlID="update" AlwaysFinishOnUpdatingAnimation="true">
        <Animations>
                <OnUpdating>
                    <Sequence>
                        <%-- Store the original height of the panel --%>
                        <ScriptAction Script="var b = $find('animation'); b._originalHeight = b._element.offsetHeight;" />
                        
                        <%-- Disable all the controls --%>
                        <Parallel duration="0">
                            <EnableAction AnimationTarget="btnUpdate" Enabled="false" />
                            <EnableAction AnimationTarget="effect_color" Enabled="false" />
                            <EnableAction AnimationTarget="effect_collapse" Enabled="false" />
                            <EnableAction AnimationTarget="effect_fade" Enabled="false" />
                        </Parallel>
                        <StyleAction Attribute="overflow" Value="hidden" />
                        
                        <%-- Do each of the selected effects --%>
                        <Parallel duration=".25" Fps="30">
                            <Condition ConditionScript="$get('effect_fade').checked">
                                <FadeOut AnimationTarget="up_container" minimumOpacity=".2" />
                            </Condition>
                            <Condition ConditionScript="$get('effect_collapse').checked">
                                <Resize Height="0" />
                            </Condition>
                            <Condition ConditionScript="$get('effect_color').checked">
                                <Color AnimationTarget="up_container" PropertyKey="backgroundColor"
                                    EndValue="#FF0000" StartValue="#40669A" />
                            </Condition>
                        </Parallel>
                    </Sequence>
                </OnUpdating>
                <OnUpdated>
                    <Sequence>
                        <%-- Do each of the selected effects --%>
                        <Parallel duration=".25" Fps="30">
                            <Condition ConditionScript="$get('effect_fade').checked">
                                <FadeIn AnimationTarget="up_container" minimumOpacity=".2" />
                            </Condition>
                            <Condition ConditionScript="$get('effect_collapse').checked">
                                <%-- Get the stored height --%>
                                <Resize HeightScript="$find('animation')._originalHeight" />
                            </Condition>
                            <Condition ConditionScript="$get('effect_color').checked">
                                <Color AnimationTarget="up_container" PropertyKey="backgroundColor"
                                    StartValue="#FF0000" EndValue="#40669A" />
                            </Condition>
                        </Parallel>
                        
                        <%-- Enable all the controls --%>
                        <Parallel duration="0">
                            <EnableAction AnimationTarget="effect_fade" Enabled="true" />
                            <EnableAction AnimationTarget="effect_collapse" Enabled="true" />
                            <EnableAction AnimationTarget="effect_color" Enabled="true" />
                            <EnableAction AnimationTarget="btnUpdate" Enabled="true" />
                        </Parallel>                            
                    </Sequence>
                </OnUpdated>
        </Animations>
    </ajaxToolkit:UpdatePanelAnimationExtender>
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>UpdatePanelAnimation Description</Header>
        <Content>
            <p>
                The <span class="codeReference">UpdatePanelAnimationExtender</span> is a simple extender that
                allows you to utilize the powerful animation framework with existing pages in an easy,
                declarative fashion.  It is used to play animations both while an
                <span class="codeReference">UpdatePanel</span> is updating and after it has finished updating.
            </p>
            <br />
            <p>
                It is important to note that because of the <span class="codeReference">UpdatePanel</span>
                architecture, the <span class="codeReference">OnUpdating</span> animation will always play when
                any partial postback starts, but the <span class="codeReference">OnUpdated</span> animation will
                only play at the end of a partial postback if its <span class="codeReference">UpdatePanel</span>
                was changed (note: setting the <span class="codeReference">UpdatePanel</span>'s
                <span class="codeReference">UpdateMode="Always"</span> will ensure the
                <span class="codeReference">OnUpdated</span> animation plays when every partial postback completes).
            </p>
            <br />
            <p>
                All the animations and their properties are described in the <a href="https://ajaxcontroltoolkit.codeplex.com/wikipage?title=Animation%20Control%20Reference">Animation Reference</a>.
             </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>UpdatePanelAnimation Properties</Header>
        <Content>
            The <span class="codeReference">UpdatePanel</span> animation behavior can be applied with the following extender (the <em>italic</em> properties are optional, and the ellipses represent a generic animation description):
            <pre>
&lt;ajaxToolkit:UpdatePanelAnimationExtender ID=&quot;ae&quot;
    runat=&quot;server&quot; TargetControlID=&quot;up&quot; 
    AlwaysFinishOnUpdatingAnimation=&quot;true&quot; &gt;
        <em>&lt;Animations&gt;
        &lt;OnUpdating&gt; ... &lt;/OnUpdating&gt;
        &lt;OnUpdated&gt; ... &lt;/OnUpdated&gt;
    &lt;/Animations&gt;</em>
&lt;/ajaxToolkit:UpdatePanelAnimationExtender&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - ID of the <span class="codeReference">UpdatePanel</span> whose updates are used to play the animations (this is also the default target of the animations)</li>
                <li><strong>OnUpdating</strong> - Generic animation played as when any <span class="codeReference">UpdatePanel</span> begins updating</li>
                <li><strong>OnUpdated</strong> - Generic animation played after the <span class="codeReference">UpdatePanel</span> has finished updating (but only if the <span class="codeReference">UpdatePanel</span> was changed)</li>
                <li><b>AlwaysFinishOnUpdatingAnimation </b>- Optional property which makes sure Onupdated event will fire only after completion of onUpdating event.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
