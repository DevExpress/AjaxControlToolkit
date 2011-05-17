<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="UpdatePanelAnimation.aspx.cs"
    Inherits="UpdatePanelAnimation_UpdatePanelAnimation"
    Title="UpdatePanelAnimation Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">UpdatePanelAnimation Demonstration</div>
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
        
        <ajaxToolkit:UpdatePanelAnimationExtender ID="upae" BehaviorID="animation" runat="server" TargetControlID="update">
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
    </div>
    <div class="demobottom"></div>

    <asp:Panel ID="description_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse"  />
            UpdatePanelAnimation Description
        </div>
    </asp:Panel>
    <asp:Panel id="description_ContentPanel" runat="server" style="overflow:hidden;">
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
            The animations to be played are declaratively specified using XML.  You can read the
            <a href="../Walkthrough/UsingAnimations.aspx">Using Animations</a> walkthrough for more details
            about creating these generic animation declarations, as well as other ways to use the animation
            framework.  The framework provides a lot of useful animations to handle movement, resizing, fading,
            etc.  All the animations and their properties are described in the
            <a href="../Walkthrough/AnimationReference.aspx">Animation Reference</a>.
         </p>
    </asp:Panel>

    <asp:Panel ID="Properties_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            UpdatePanelAnimation Properties
        </div>
    </asp:Panel>
    <asp:Panel id="Properties_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">
        The <span class="codeReference">UpdatePanel</span> animation behavior can be applied
        with the following extender (the <em>italic</em> properties are optional, and the
        ellipses represent a generic animation description):
<pre>&lt;ajaxToolkit:UpdatePanelAnimationExtender ID="ae"
  runat="server" TargetControlID="up"&gt;
     <em>&lt;Animations&gt;
        &lt;OnUpdating&gt; ... &lt;/OnUpdating&gt;
        &lt;OnUpdated&gt; ... &lt;/OnUpdated&gt;
    &lt;/Animations&gt;</em>
&lt;/ajaxToolkit:UpdatePanelAnimationExtender&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - ID of the <span class="codeReference">UpdatePanel</span>
                whose updates are used to play the animations (this is also the default target of the animations)</li>
            <li><strong>OnUpdating</strong> - Generic animation played as when any
                <span class="codeReference">UpdatePanel</span> begins updating</li>
            <li><strong>OnUpdated</strong> - Generic animation played after the
                <span class="codeReference">UpdatePanel</span> has finished updating (but only if the
                <span class="codeReference">UpdatePanel</span> was changed)</li>
        </ul>
    </asp:Panel>

    <ajaxToolkit:CollapsiblePanelExtender ID="DescriptionCPE" runat="Server"
        TargetControlID="description_ContentPanel"
        ExpandControlID="description_HeaderPanel"
        CollapseControlID="description_HeaderPanel"
        Collapsed="False"        
        ImageControlID="description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="PropertiesCPE" runat="Server"
        TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel"
        CollapseControlID="Properties_HeaderPanel"
        Collapsed="True"        
        ImageControlID="Properties_ToggleImage" />
</asp:Content>