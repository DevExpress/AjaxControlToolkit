<%@ Control Language="C#" AutoEventWireup="true" ClassName="SequenceAnimation" %>
<div class="subheading">Sequence Animation</div>
<p>
    The <span class="codeReference">SequenceAnimation</span> runs several child animations one after the other.  It can also repeat the sequence
        of animations for a specified number of <span class="codeReference">iterations</span> (which defaults to a single iteration, but will repeat
        forever if you specify zero or less iterations).  It is important to note that the <span class="codeReference">SequenceAnimation</span> ignores
        its <span class="codeReference">duration</span> and <span class="codeReference">fps</span> properties, and will let each of its child animations
        use any values they please.<br />
    <b>Note:</b> The <span class="codeReference">SequenceAnimation</span> cannot be a child animation of <span class="codeReference"><a href="#ParallelAnimation">ParallelAnimation</a></span>,
        <span class="codeReference"><a href="#SelectionAnimation">SelectionAnimation</a></span>, or any animation deriving from these two.
</p>
<table class="animationReferenceTable">
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Tag:</td>
        <td class="animationReferenceCode">Sequence</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Class:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.SequenceAnimation</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Base:</td>
        <td class="animationReferenceCode"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Constructor:</td>
        <td class="animationReferenceCode">new Sys.Extended.UI.Animation.SequenceAnimation(target, duration, fps, animations, iterations);</td>
    </tr>
    <tr class="animationReferenceRow">
        <td class="animationReferenceField">Play:</td>
        <td class="animationReferenceCode">Sys.Extended.UI.Animation.SequenceAnimation.play(target, duration, fps, animations, iterations);</td>
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
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>, but this property is ignored
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">Number fps;</div>
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>, but this property is ignored
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
                        <div class="animationReferenceItemCode">Number iterations;</div>
                        Number of iterations to repeat the sequence of child animations when playing.  If this value is
                                less than or equal to 0, the sequence of child animations will repeat forever.  The default value is 1.
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
                        Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">getAnimatedValue();</div>
                        Implementation of an abstract function from <span class="codeReference">Sys.UI.Animation</span> that throws
                                an exception (because it should never be called).
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
                        Clean up after playing an iteration of the sequence of child animations, and if necessary
                                restart the sequence until all iterations have been played.
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">onStart();</div>
                        Initialization before playing the animation.
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
                        Pause the currently playing sequence of child animations.  Calling <span class="codeReference">play</span>
                        will resume where you left off.
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">play();</div>
                        Play the sequence of child animations one after another.
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
                        Implementation of an abstract function from <span class="codeReference">Sys.UI.Animation</span> that throws
                                an exception (because it should never be called).
                    </td>
                </tr>
                <tr class="animationReferenceItemRow">
                    <td class="animationReferenceItem">
                        <div class="animationReferenceItemCode">stop();</div>
                        Stop the currently playing sequence of child animations.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<p></p>
