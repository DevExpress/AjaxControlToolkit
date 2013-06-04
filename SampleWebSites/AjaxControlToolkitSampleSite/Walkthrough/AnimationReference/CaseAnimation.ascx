<%@ Control Language="C#" AutoEventWireup="true" ClassName="CaseAnimation" %>

<div class="subheading">Case Animation</div>
<p>
    The <span class="codeReference">CaseAnimation</span> is used as a control structure to play a specific child animation depending
            on the result of executing the <span class="codeReference">selectScript</span>, which should evaluate to the index of the child
            animation to play (this is similar to the <span class="codeReference">switch</span> statement in C#, etc.).  If the provided index
            is outside the bounds of the child animations (or if nothing was returned) then we will not play anything.<br />
    <b>Note:</b> The <span class="codeReference">CaseAnimation</span> cannot have any child animations that derive from <span class="codeReference"><a href="#SequenceAnimation">SequenceAnimation</a></span>.
</p>
<table class="animationReferenceTable">
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Tag:</td>
        <td class="animationReferenceCode">Case</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Class:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.CaseAnimation</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Base:</td>
        <td class="animationReferenceCode"><a href="#SelectionAnimation">Sys.Extended.UI.Animation.SelectionAnimation</a></td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Constructor:</td>
        <td class="animationReferenceCode">new Sys.Extended.UI.Animation.CaseAnimation(target, duration, fps, animations, selectScript);</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Play:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.CaseAnimation.play(target, duration, fps, animations, selectScript);</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Properties:</td>
        <td class="animationReferenceItems">
            <table class="animationReferenceItemTable">
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Array animations; // Read Only</div>
                        Inherited from <span class="codeReference"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Number duration;</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Number fps;</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Boolean isActive; // Read Only</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Boolean isInitialized; // Read Only</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Boolean isPlaying; // Read Only</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Boolean isUpdating; // Read Only</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Number percentComplete; // Read Only</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">String selectScript;</div>
                        JavaScript code to be executed and whose value will determine which of the child animations to play.
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Object target;</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Methods:</td>
        <td class="animationReferenceItems">
            <table class="animationReferenceItemTable">
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">add(animation);</div>
                        Inherited from <span class="codeReference"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">clear();</div>
                        Inherited from <span class="codeReference"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">dispose();</div>
                        Inherited from <span class="codeReference"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">getAnimatedValue(percentage);</div>
                        Inherited from <span class="codeReference"><a href="#SelectionAnimation">Sys.Extended.UI.Animation.SelectionAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">getDescriptor();</div>
                        Inherited from <span class="codeReference"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">initialize();</div>
                        Inherited from <span class="codeReference"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">interpolate(start, end, percentage);</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">onEnd();</div>
                        Inherited from <span class="codeReference"><a href="#SelectionAnimation">Sys.Extended.UI.Animation.SelectionAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">onStart();</div>
                        Inherited from <span class="codeReference"><a href="#SelectionAnimation">Sys.Extended.UI.Animation.SelectionAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">onStep(percentage);</div>
                        Inherited from <span class="codeReference"><a href="#SelectionAnimation">Sys.Extended.UI.Animation.SelectionAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">pause();</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">play();</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">remove(animation);</div>
                        Inherited from <span class="codeReference"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">removeAt(index);</div>
                        Inherited from <span class="codeReference"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">setOwner(owner);</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">setValue(value);</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">stop();</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<p></p>
