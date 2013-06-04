<%@ Control Language="C#" AutoEventWireup="true" ClassName="Action" %>
<div class="subheading">Action</div>
<p>
    <span class="codeReference">Action</span> is a base class for all "non-animating" animations.  While regular animations 
            perform an operation in a sequence of small steps spread over an interval, the actions perform a single operation
            instantaneously.  By default, all actions have a duration of zero.
</p>
<table class="animationReferenceTable">
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Tag:</td>
        <td class="animationReferenceCode">Action</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Class:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.Action</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Base:</td>
        <td class="animationReferenceCode"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Constructor:</td>
        <td class="animationReferenceCode">new Sys.Extended.UI.Animation.Action(target, duration, fps);</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Play:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.Action.play(target, duration, fps);</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Properties:</td>
        <td class="animationReferenceItems">
            <table class="animationReferenceItemTable">
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
                        <div class="animationReferenceItemCode">dispose();</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">getAnimatedValue();</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">getDescriptor();</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
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
                        Perform the action.
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">onStart();</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">onStep(percentage);</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
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
