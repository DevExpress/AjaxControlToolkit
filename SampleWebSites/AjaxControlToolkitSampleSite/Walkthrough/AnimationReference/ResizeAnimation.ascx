<%@ Control Language="C#" AutoEventWireup="true" ClassName="ResizeAnimation" %>

<div class="subheading">Resize Animation</div>
<p>
    The <span class="codeReference">ResizeAnimation</span> changes the size of the <span class="codeReference">target</span> from its current values to
        the specified <span class="codeReference">width</span> and <span class="codeReference">height</span>.
</p>
<table class="animationReferenceTable">
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Tag:</td>
        <td class="animationReferenceCode">Resize</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Class:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.ResizeAnimation</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Base:</td>
        <td class="animationReferenceCode"><a href="#ParallelAnimation">Sys.Extended.UI.Animation.ParallelAnimation</a></td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Constructor:</td>
        <td class="animationReferenceCode">new Sys.Extended.UI.Animation.ResizeAnimation(target, duration, fps, width, height, unit);</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Play:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.ResizeAnimation.play(target, duration, fps, width, height, unit);</td>
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
                        <div class="animationReferenceItemCode">Number height;</div>
                        New height of the <span class="codeReference">target</span>
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
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">String unit;</div>
                        Length unit for the size of the <span class="codeReference">target</span>.  The default value is 'px'.
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Number width;</div>
                        New height of the <span class="codeReference">target</span>
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
                        Inherited from <span class="codeReference"><a href="#ParallelAnimation">Sys.Extended.UI.Animation.ParallelAnimation</a></span>
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
                        Inherited from <span class="codeReference"><a href="#ParallelAnimation">Sys.Extended.UI.Animation.ParallelAnimation</a></span>
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
                        Inherited from <span class="codeReference"><a href="#ParallelAnimation">Sys.Extended.UI.Animation.ParallelAnimation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">onStart();</div>
                        Get the current size of the <span class="codeReference">target</span> and get ready to change the size.
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">onStep(percentage);</div>
                        Inherited from <span class="codeReference"><a href="#ParallelAnimation">Sys.Extended.UI.Animation.ParallelAnimation</a></span>
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
