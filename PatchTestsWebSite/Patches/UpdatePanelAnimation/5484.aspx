<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultTests.master"
    AutoEventWireup="true"
    CodeFile="5484.aspx.cs"
    Inherits="Patch5484"
    Title="AsyncFileUpload Sample"
    Theme="SampleSiteTheme" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">

    <link href="../../StyleSheet.css" rel="stylesheet" type="text/css" />

    <div class="demoarea">
        <div style="margin-bottom: 10px;">
            <div style="border: dashed 1px #222222;">
                <div id="up_container1" style="background-color: #40669A;">
                    <asp:UpdatePanel ID="updatePanel1" runat="server" UpdateMode="Conditional">
                        <ContentTemplate>
                            <div style="text-align: center; vertical-align: middle; line-height: 44px; padding: 12px; height: 44px; color: #FFFFFF;">
                                <asp:Label ID="lblUpdate1" runat="server" Style="padding: 5px; font-size: 14px; font-weight: bold;">
                                    4/28/1906 12:00:00 AM
                                </asp:Label>
                            </div>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="btnUpdate1" EventName="Click" />
                        </Triggers>
                    </asp:UpdatePanel>
                </div>
            </div>
        </div>
        
        Choose the effects, then press 'Update':<br />
        <input type="checkbox" id="effect1_fade" checked="checked" /><label for="effect1_fade">Fade</label><br />
        <asp:Button ID="btnUpdate1" runat="server" Text="Update" OnClick="btnUpdate1_Click" />
        
        <asp:UpdatePanelAnimationExtender ID="upae" BehaviorID="animation1" runat="server" TargetControlID="updatePanel1">
            <Animations>
                <OnUpdating>
                    <Sequence>
                        <%-- Store the original height of the panel --%>
                        <ScriptAction Script="var b = $find('animation1'); b._originalHeight = b._element.offsetHeight;" />
                        
                        <%-- Disable all the controls --%>
                        <Parallel duration="0">
                            <EnableAction AnimationTarget="btnUpdate1" Enabled="false" />
                            <EnableAction AnimationTarget="effect1_fade" Enabled="false" />
                        </Parallel>
                        <StyleAction Attribute="overflow" Value="hidden" />
                        
                        <%-- Do each of the selected effects --%>
                        <Parallel duration=".25" Fps="30">
                            <Condition ConditionScript="$get('effect1_fade').checked">
                                <FadeOut AnimationTarget="up_container1" minimumOpacity=".2" />
                            </Condition>
                        </Parallel>
                    </Sequence>
                </OnUpdating>
                <OnUpdated>
                    <Sequence>
                        <%-- Do each of the selected effects --%>
                        <Parallel duration=".25" Fps="30">
                            <Condition ConditionScript="$get('effect1_fade').checked">
                                <FadeIn AnimationTarget="up_container1" minimumOpacity=".2" />
                            </Condition>
                        </Parallel>
                        
                        <%-- Enable all the controls --%>
                        <Parallel duration="0">
                            <EnableAction AnimationTarget="effect1_fade" Enabled="true" />
                            <EnableAction AnimationTarget="btnUpdate1" Enabled="true" />
                        </Parallel>                            
                    </Sequence>
                </OnUpdated>
            </Animations>
        </asp:UpdatePanelAnimationExtender>
    
        <div style="margin-bottom: 10px;">
            <div style="border: dashed 1px #222222;">
                <div id="up_container2" style="background-color: #40669A;">
                    <asp:UpdatePanel ID="updatePanel2" runat="server" UpdateMode="Conditional">
                        <ContentTemplate>
                            <div style="text-align: center; vertical-align: middle; line-height: 44px; padding: 12px; height: 44px; color: #FFFFFF;">
                                <asp:Label ID="lblUpdate2" runat="server" Style="padding: 5px; font-size: 14px; font-weight: bold;">
                                    4/28/1906 12:00:00 AM
                                </asp:Label>
                            </div>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="btnUpdate2" EventName="Click" />
                        </Triggers>
                    </asp:UpdatePanel>
                </div>
            </div>
        </div>
        
        Choose the effects, then press 'Update':<br />
        <input type="checkbox" id="effect2_fade" checked="checked" /><label for="effect2_fade">Fade</label><br />
        <asp:Button ID="btnUpdate2" runat="server" Text="Update" OnClick="btnUpdate2_Click" />
        
        <asp:UpdatePanelAnimationExtender BehaviorID="animation2" runat="server" TargetControlID="updatePanel2">
            <Animations>
                <OnUpdating>
                    <Sequence>
                        <%-- Store the original height of the panel --%>
                        <ScriptAction Script="var b = $find('animation2'); b._originalHeight = b._element.offsetHeight;" />
                        
                        <%-- Disable all the controls --%>
                        <Parallel duration="0">
                            <EnableAction AnimationTarget="btnUpdate2" Enabled="false" />
                            <EnableAction AnimationTarget="effect2_fade" Enabled="false" />
                        </Parallel>
                        <StyleAction Attribute="overflow" Value="hidden" />
                        
                        <%-- Do each of the selected effects --%>
                        <Parallel duration=".25" Fps="30">
                            <Condition ConditionScript="$get('effect2_fade').checked">
                                <FadeOut AnimationTarget="up_container2" minimumOpacity=".2" />
                            </Condition>
                        </Parallel>
                    </Sequence>
                </OnUpdating>
                <OnUpdated>
                    <Sequence>
                        <%-- Do each of the selected effects --%>
                        <Parallel duration=".25" Fps="30">
                            <Condition ConditionScript="$get('effect2_fade').checked">
                                <FadeIn AnimationTarget="up_container2" minimumOpacity=".2" />
                            </Condition>
                        </Parallel>
                        
                        <%-- Enable all the controls --%>
                        <Parallel duration="0">
                            <EnableAction AnimationTarget="effect2_fade" Enabled="true" />
                            <EnableAction AnimationTarget="btnUpdate2" Enabled="true" />
                        </Parallel>                            
                    </Sequence>
                </OnUpdated>
            </Animations>
        </asp:UpdatePanelAnimationExtender>
    </div>
</asp:Content>