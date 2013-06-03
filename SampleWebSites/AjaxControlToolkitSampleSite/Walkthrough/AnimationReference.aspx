<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    Title="Animation Reference" %>

<%@ Register TagPrefix="ref" TagName="Animation" Src="~/Walkthrough/AnimationReference/Animation.ascx" %>
<%@ Register TagPrefix="ref" TagName="ParentAnimation" Src="~/Walkthrough/AnimationReference/ParentAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="ParallelAnimation" Src="~/Walkthrough/AnimationReference/ParallelAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="SequenceAnimation" Src="~/Walkthrough/AnimationReference/SequenceAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="SelectionAnimation" Src="~/Walkthrough/AnimationReference/SelectionAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="ConditionAnimation" Src="~/Walkthrough/AnimationReference/ConditionAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="CaseAnimation" Src="~/Walkthrough/AnimationReference/CaseAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="FadeAnimation" Src="~/Walkthrough/AnimationReference/FadeAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="FadeOutAnimation" Src="~/Walkthrough/AnimationReference/FadeOutAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="PulseAnimation" Src="~/Walkthrough/AnimationReference/PulseAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="PropertyAnimation" Src="~/Walkthrough/AnimationReference/PropertyAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="DiscreteAnimation" Src="~/Walkthrough/AnimationReference/DiscreteAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="InterpolatedAnimation" Src="~/Walkthrough/AnimationReference/InterpolatedAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="ColorAnimation" Src="~/Walkthrough/AnimationReference/ColorAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="LengthAnimation" Src="~/Walkthrough/AnimationReference/LengthAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="MoveAnimation" Src="~/Walkthrough/AnimationReference/MoveAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="ResizeAnimation" Src="~/Walkthrough/AnimationReference/ResizeAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="ScaleAnimation" Src="~/Walkthrough/AnimationReference/ScaleAnimation.ascx" %>
<%@ Register TagPrefix="ref" TagName="ScriptAction" Src="~/Walkthrough/AnimationReference/ScriptAction.ascx" %>
<%@ Register TagPrefix="ref" TagName="OpacityAction" Src="~/Walkthrough/AnimationReference/OpacityAction.ascx" %>
<%@ Register TagPrefix="ref" TagName="StyleAction" Src="~/Walkthrough/AnimationReference/StyleAction.ascx" %>
<%@ Register TagPrefix="ref" TagName="HideAction" Src="~/Walkthrough/AnimationReference/HideAction.ascx" %>
<%@ Register TagPrefix="ref" TagName="EnableAction" Src="~/Walkthrough/AnimationReference/EnableAction.ascx" %>
<%@ Register TagPrefix="ref" TagName="Action" Src="~/Walkthrough/AnimationReference/Action.ascx" %>

<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <div class="walkthrough">
        <div class="heading">Animation Reference</div>
        <a href="#Animation">Animation</a><br />
        <a href="#ParentAnimation">Parent Animation</a><br />
        <a href="#ParallelAnimation">Parallel Animation</a><br />
        <a href="#SequenceAnimation">Sequence Animation</a><br />
        <a href="#SelectionAnimation">Selection Animation</a><br />
        <a href="#ConditionAnimation">Condition Animation</a><br />
        <a href="#CaseAnimation">Case Animation</a><br />
        <a href="#FadeAnimation">Fade Animation</a><br />
        <a href="#FadeInAnimation">FadeIn Animation</a><br />
        <a href="#FadeOutAnimation">FadeOut Animation</a><br />
        <a href="#PulseAnimation">Pulse Animation</a><br />
        <a href="#PropertyAnimation">Property Animation</a><br />
        <a href="#DiscreteAnimation">Discrete Animation</a><br />
        <a href="#InterpolatedAnimation">Interpolated Animation</a><br />
        <a href="#ColorAnimation">Color Animation</a><br />
        <a href="#LengthAnimation">Length Animation</a><br />
        <a href="#MoveAnimation">Move Animation</a><br />
        <a href="#ResizeAnimation">Resize Animation</a><br />
        <a href="#ScaleAnimation">Scale Animation</a><br />
        <a href="#Action">Action</a><br />
        <a href="#EnableAction">Enable Action</a><br />
        <a href="#HideAction">Hide Action</a><br />
        <a href="#StyleAction">Style Action</a><br />
        <a href="#OpacityAction">Opacity Action</a><br />
        <a href="#ScriptAction">Script Action</a><br />


        <a name="Animation" />
        <ref:Animation runat="server" />

        <a name="ParentAnimation" />
        <ref:ParentAnimation runat="server" />

        <a name="ParallelAnimation" />
        <ref:ParallelAnimation runat="server" />

        <a name="SequenceAnimation" />
        <ref:SequenceAnimation runat="server" />

        <a name="SelectionAnimation" />
        <ref:SelectionAnimation runat="server" />

        <a name="ConditionAnimation" />
        <ref:ConditionAnimation runat="server" />

        <a name="CaseAnimation" />
        <ref:CaseAnimation runat="server" />

        <a name="FadeAnimation" />
        <ref:FadeAnimation runat="server" />

        <a name="FadeInAnimation" />
        <ref:FadeAnimation ID="FadeInAnimation" runat="server" />

        <a name="FadeOutAnimation" />
        <ref:FadeOutAnimation runat="server" />

        <a name="PulseAnimation" />
        <ref:PulseAnimation runat="server" />

        <a name="PropertyAnimation" />
        <ref:PropertyAnimation runat="server" />

        <a name="DiscreteAnimation" />
        <ref:DiscreteAnimation runat="server" />

        <a name="InterpolatedAnimation" />
        <ref:InterpolatedAnimation runat="server" />

        <a name="ColorAnimation" />
        <ref:ColorAnimation runat="server" />

        <a name="LengthAnimation" />
        <ref:LengthAnimation runat="server" />

        <a name="MoveAnimation" />
        <ref:MoveAnimation runat="server" />

        <a name="ResizeAnimation" />
        <ref:ResizeAnimation runat="server" />

        <a name="ScaleAnimation" />
        <ref:ScaleAnimation runat="server" />

        <a name="Action" />
        <ref:Action runat="server" />

        <a name="EnableAction" />
        <ref:EnableAction runat="server" />

        <a name="HideAction" />
        <ref:HideAction runat="server" />

        <a name="StyleAction" />
        <ref:StyleAction runat="server" />

        <a name="OpacityAction" />
        <ref:OpacityAction runat="server" />

        <a name="ScriptAction" />
        <ref:ScriptAction runat="server" />
    </div>
</asp:Content>
