<%@ Control Language="C#" AutoEventWireup="true" ClassName="InterpolatedAnimation" %>

<div class="subheading">Interpolated Animation</div>
<p>
    The <span class="codeReference">InterpolatedAnimation</span> assigns a range of values between <span class="codeReference">startValue</span> and
            <span class="codeReference">endValue</span> to the designated <span class="codeReference">property</span>.
</p>
<table class="animationReferenceTable">
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Tag:</td>
        <td class="animationReferenceCode">Interpolated</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Class:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.InterpolatedAnimation</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Base:</td>
        <td class="animationReferenceCode"><a href="#PropertyAnimation">Sys.Extended.UI.Animation.PropertyAnimation</a></td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Constructor:</td>
        <td class="animationReferenceCode">new Sys.Extended.UI.Animation.InterpolatedAnimation(target, duration, fps, property, propertyKey, startValue, endValue);</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Play:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.InterpolatedAnimation.play(target, duration, fps, property, propertyKey, startValue, endValue);</td>
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
                        <div class="animationReferenceItemCode">Object endValue;</div>
                        End of the range of values
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
                        <div class="animationReferenceItemCode">String property;</div>
                        Inherited from <span class="codeReference"><a href="#PropertyAnimation">Sys.Extended.UI.Animation.PropertyAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">String propertyKey;</div>
                        Inherited from <span class="codeReference"><a href="#PropertyAnimation">Sys.Extended.UI.Animation.PropertyAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Object startValue;</div>
                        Start of the range of values
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
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
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
