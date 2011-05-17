<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    Title="Animation Reference" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
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
    
        <a name="Animation" /><div class="subheading">Animation</div>
        <p>
            <span class="codeReference">Animation</span> is an abstract base class used as a starting point for all the other animations.
            provides the basic mechanics for the animation (playing, pausing, stopping, timing, etc.)
            and leaves the actual animation to be done in the abstract methods <span class="codeReference">getAnimatedValue</span>
            and <span class="codeReference">setValue</span>.            
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Animation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.Animation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode">Sys.Component</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.Animation(target, duration, fps);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.Animation.play(target, duration, fps);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Properties:</td>
                <td class="animationReferenceItems">
                    <table class="animationReferenceItemTable">
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Number duration;</div>
                                Length of time to play the animation (in seconds).  The default value is 1.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Number fps;</div>
                                Number of frames per second shown when animating.  The default values is 25.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean isActive; // Read Only</div>
                                <span class="codeReference">true</span> if animation is active, <span class="codeReference">false</span> if not.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean isInitialized; // Read Only</div>
                                Inherited from <span class="codeReference">Sys.Component</span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean isPlaying; // Read Only</div>
                                <span class="codeReference">true</span> if animation is playing, <span class="codeReference">false</span> if not.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean isUpdating; // Read Only</div>
                                Inherited from <span class="codeReference">Sys.Component</span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Number percentComplete; // Read Only</div>
                                Percentage of the animation already played.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Object target;</div>
                                Target element that the animation should operate on.  (<b>Note:</b> Do not set this property in
                                a generic xml animation description.  It will be set automatically using either the <span class="codeReference">TargetControlID</span>
                                or the <span class="codeReference">AnimationTarget</span> properties.)
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
                                Dispose the animation
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">getAnimatedValue();</div>
                                Determine the state of the animation after the given percentage of its duration has elapsed
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">getDescriptor();</div>
                                Inherited from <span class="codeReference">Sys.Component</span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">interpolate(start, end, percentage);</div>
                                Given two <span class="codeReference">Number</span>s <span class="codeReference">start</span> and
                                <span class="codeReference">end</span>, the <span class="codeReference">interpolate</span> function
                                will produce another <span class="codeReference">Number</span> the specified
                                <span class="codeReference">percentage</span> between the two values.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onEnd();</div>
                                Perform any cleanup after playing the animation.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStart();</div>
                                Perform any initialization before playing the animation.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStep(percentage);</div>
                                Progress the animation through each frame
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">pause();</div>
                                Pause the animation
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">play();</div>
                                Play the animation
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">setOwner(owner);</div>
                                Inherited from <span class="codeReference">Sys.Component</span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">setValue(value);</div>
                                Set the current state of the animation
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">stop();</div>
                                Stop playing the animation
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <p></p>



    <a name="ParentAnimation" /><div class="subheading">Parent Animation</div>
    <p>
            The <span class="codeReference">ParentAnimation</span> serves as a base class for all animations that contain children (such as
            <span class="codeReference"><a href="#ParallelAnimation">ParallelAnimation</a></span>,
            <span class="codeReference"><a href="#SequenceAnimation">SequenceAnimation</a></span>, etc.).  It does not
            actually play the animations, so any classes that inherit from it must do so.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Parent</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ParentAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.ParentAnimation(target, duration, fps, animations);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ParentAnimation.play(target, duration, fps, animations);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Properties:</td>
                <td class="animationReferenceItems">
                    <table class="animationReferenceItemTable">
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Array animations; // Read Only</div>
                                Array of child animations to be played.  To manipulate this array, use the functions 
                                <span class="codeReference">add</span>, <span class="codeReference">clear</span>, 
                                <span class="codeReference">remove</span>, and <span class="codeReference">removeAt</span>.
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
                                Add an animation as a child of this animation.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">clear();</div>
                                Clear the list of child animations.
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
                                <div class="animationReferenceItemCode">initialize();</div>
                                Initialize any of the child animations that have not been initialized yet.
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
                                <div class="animationReferenceItemCode">remove(animation);</div>
                                Remove the <span class="codeReference">animation</span> from the array of child animations.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">removeAt(index);</div>
                                Remove the animation at a given <span class="codeReference">index</span> from the array of child animations.
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



    <a name="ParallelAnimation" /><div class="subheading">Parallel Animation</div>
    <p>
            The <span class="codeReference">ParallelAnimation</span> plays several animations simultaneously.  It inherits from
            <span class="codeReference"><a href="#ParentAnimation">ParentAnimation</a></span>, but makes itself the owner of all its child animations as this allows
            it to use a single timer and synchronization mechanisms of the parent animation (in other words, the <span class="codeReference">duration</span>
            properties of any child animations are ignored in favor of the parent's <span class="codeReference">duration</span>).  It is very useful in
            creating sophisticated effects through combinations of simpler animations.<br />
            <b>Note:</b> The <span class="codeReference">ParallelAnimation</span> cannot have any child animations that derive
            from <span class="codeReference"><a href="#SequenceAnimation">SequenceAnimation</a></span>.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Parallel</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ParallelAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.ParallelAnimation(target, duration, fps, animations);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ParallelAnimation.play(target, duration, fps, animations);</td>
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
                                Add an animation as a child of this animation and make ourselves its owner.
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
                                Empty implementation of an abstract function from <span class="codeReference">Sys.UI.Animation</span>.
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
                                Invoke the <span class="codeReference">onEnd</span> function of the child animations.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStart();</div>
                                Invoke the <span class="codeReference">onStart</span> function of the child animations.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStep(percentage);</div>
                                Invoke the <span class="codeReference">onStep</span> function of the child animations.
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



    <a name="SequenceAnimation" /><div class="subheading">Sequence Animation</div>
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



    <a name="SelectionAnimation" /><div class="subheading">Selection Animation</div>
    <p>
            The <span class="codeReference">SelectionAnimation</span> will run a single animation chosen from of its child animations.
            This is a base class with no functional implementation, so consider using <span class="codeReference"><a href="#ConditionAnimation">ConditionAnimation</a></span> or
            <span class="codeReference"><a href="#CaseAnimation">CaseAnimation</a></span>.<br />
            <b>Note:</b> The <span class="codeReference">SelectionAnimation</span> cannot have any child animations that derive
            from <span class="codeReference"><a href="#SequenceAnimation">SequenceAnimation</a></span>.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Selection</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.SelectionAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#ParentAnimation">Sys.Extended.UI.Animation.ParentAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.SelectionAnimation(target, duration, fps, animations);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.SelectionAnimation.play(target, duration, fps, animations);</td>
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
                                Empty implementation of an abstract function from <span class="codeReference">Sys.UI.Animation</span>.
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
                                Perform any cleanup after playing the selected animation.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStart();</div>
                                Prepare the selected animation to be played.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStep(percentage);</div>
                                Play the next step of the selected animation.
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



    <a name="ConditionAnimation" /><div class="subheading">Condition Animation</div>
    <p>
        The <span class="codeReference">ConditionAnimation</span> is used as a control structure to play a specific child animation depending
        on the result of executing the <span class="codeReference">conditionScript</span>.  If the <span class="codeReference">conditionScript</span>
        evaluated to true, the first child animation is played.  If it evaluates to false, the second child animation is played (although nothing
        is played if the second animation is not present).<br />
        <b>Note:</b> The <span class="codeReference">ConditionAnimation</span> cannot have any child animations that derive from <span class="codeReference"><a href="#SequenceAnimation">SequenceAnimation</a></span>.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Condition</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ConditionAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#SelectionAnimation">Sys.Extended.UI.Animation.SelectionAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.ConditionAnimation(target, duration, fps, animations, conditionScript);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ConditionAnimation.play(target, duration, fps, animations, conditionScript);</td>
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
                                <div class="animationReferenceItemCode">String conditionScript;</div>
                                JavaScript code to be executed and whose value will determine which of the child animations to play.
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



    <a name="CaseAnimation" /><div class="subheading">Case Animation</div>
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



    <a name="FadeAnimation" /><div class="subheading">Fade Animation</div>
    <p>
            The <span class="codeReference">FadeAnimation</span> is used to fade an element in or out of view, depending on the provided
            <span class="codeReference">Sys.Extended.UI.Animation.FadeEffect</span>.  The minimum and maximum opacity values can be specified to precisely control the fade.
            Also, due to known issues with Internet Explorer, the <span class="codeReference">forceLayoutInIE</span>
            property is used to enforce certain conditions (specifically that it has a set size and background color).  You may also consider using
            <span class="codeReference"><a href="#FadeInAnimation">FadeInAnimation</a></span> and <span class="codeReference"><a href="#FadeOutAnimation">FadeOutAnimation</a></span> if you know the specific direction you are fading.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Fade</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.FadeAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.FadeAnimation(target, duration, fps, effect, minimumOpacity, maximumOpacity, forceLayoutInIE);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.FadeAnimation.play(target, duration, fps, effect, minimumOpacity, maximumOpacity, forceLayoutInIE);</td>
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
                                <div class="animationReferenceItemCode">Sys.Extended.UI.Animation.FadeEffect effect;</div>
                                Determines whether we fade in or out.  Possible values are <span class="codeReference">FadeIn</span> and 
                                <span class="codeReference">FadeOut</span>.  The default falue is <span class="codeReference">FadeIn</span>.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean forceLayoutInIE;</div>
                                Flag indicating whether or not we should force a layout to be created for Internet Explorer by giving it a width
                                and setting its background color (the latter is required in case the user has ClearType enabled).  The default values is true.
                                This property is obviously ignored when working in other browsers.
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
                                <div class="animationReferenceItemCode">Number maximumOpacity;</div>
                                Maximum opacity to use when fading in or out.  Its value can range from between 0 to 1.  The default value is 1.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Number minimumOpacity;</div>
                                Minimum opacity to use when fading in or out.  Its value can range from between 0 to 1.  The default value is 0.
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
                                <div class="animationReferenceItemCode">getAnimatedValue(percentage);</div>
                                Get the opacity for the specified <span class="codeReference">percentage</span>.
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
                                Set the opacity of the target element to the given value.
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



    <a name="FadeInAnimation" /><div class="subheading">FadeIn Animation</div>
    <p>
            The <span class="codeReference">FadeInAnimation</span> performs a fade in from the current opacity to the
            <span class="codeReference">maximumOpacity</span>.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">FadeIn</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.FadeInAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.FadeInAnimation(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.FadeInAnimation.play(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);</td>
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
                                <div class="animationReferenceItemCode">Sys.Extended.UI.Animation.FadeEffect effect;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean forceLayoutInIE;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                <div class="animationReferenceItemCode">Number maximumOpacity;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Number minimumOpacity;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                <div class="animationReferenceItemCode">getAnimatedValue(percentage);</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">getDescriptor();</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStart();</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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



    <a name="FadeOutAnimation" /><div class="subheading">FadeOut Animation</div>
    <p>
            The <span class="codeReference">FadeOutAnimation</span> performs a fade out from the current opacity to the
            <span class="codeReference">minimumOpacity</span>.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">FadeOut</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.FadeOutAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.FadeOutAnimation(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.FadeOutAnimation.play(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);</td>
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
                                <div class="animationReferenceItemCode">Sys.Extended.UI.Animation.FadeEffect effect;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean forceLayoutInIE;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                <div class="animationReferenceItemCode">Number maximumOpacity;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Number minimumOpacity;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                <div class="animationReferenceItemCode">getAnimatedValue(percentage);</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">getDescriptor();</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStart();</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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



    <a name="PulseAnimation" /><div class="subheading">Pulse Animation</div>
    <p>
        The <span class="codeReference">PulseAnimation</span> fades an element in and our repeatedly to create a pulsating effect.  The
        <span class="codeReference">iterations</span> determine how many pulses there will be.  The <span class="codeReference">duration</span> property
        defines the length of each fade in or fade out, not the length of the animation as a whole.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Pulse</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.PulseAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#SequenceAnimation">Sys.Extended.UI.Animation.SequenceAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.PulseAnimation(target, duration, fps, iterations, minimumOpacity, maximumOpacity, forceLayoutInIE);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.PulseAnimation.play(target, duration, fps, iterations, minimumOpacity, maximumOpacity, forceLayoutInIE);</td>
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
                                Length of time to play each of the fade in and fade out animations (in seconds). The default value is 1.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean forceLayoutInIE;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                <div class="animationReferenceItemCode">Number iterations;</div>
                                Inherited from <span class="codeReference"><a href="#SequenceAnimation">Sys.Extended.UI.Animation.SequenceAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Number maximumOpacity;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Number minimumOpacity;</div>
                                Inherited from <span class="codeReference"><a href="#FadeAnimation">Sys.Extended.UI.Animation.FadeAnimation</a></span>
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
                                Inherited from <span class="codeReference"><a href="#SequenceAnimation">Sys.Extended.UI.Animation.SequenceAnimation</a></span>
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
                                Inherited from <span class="codeReference"><a href="#SequenceAnimation">Sys.Extended.UI.Animation.SequenceAnimation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">onStart();</div>
                                Inherited from <span class="codeReference"><a href="#SequenceAnimation">Sys.Extended.UI.Animation.SequenceAnimation</a></span>
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



    <a name="PropertyAnimation" /><div class="subheading">Property Animation</div>
    <p>
            The <span class="codeReference">PropertyAnimation</span> is a useful base animation that will assign the value from
            <span class="codeReference">getAnimatedValue</span> to a specified property.  You can provide the name of a <span class="codeReference">property</span>
            alongside an optional <span class="codeReference">propertyKey</span> (which indicates the value <span class="codeReference">property[propertyKey]</span>,
            like <span class="codeReference">style['backgroundColor']</span>).
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Property</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.PropertyAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.PropertyAnimation(target, duration, fps, property, propertyKey);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.PropertyAnimation.play(target, duration, fps, property, propertyKey);</td>
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
                                <div class="animationReferenceItemCode">String property;</div>
                                Property of the <span class="codeReference">target</span> element to set when animating.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">String propertyKey;</div>
                                Optional key of the <span class="codeReference">property</span> to be set (which indicates the value
                                <span class="codeReference">property[propertyKey]</span>, like <span class="codeReference">style['backgroundColor']</span>).
                                Note that for the <span class="codeReference">style</span> property, the key must be in a JavaScript friendly format
                                (i.e. <span class="codeReference">backgroundColor</span> instead of <span class="codeReference">background-color</span>).
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



    <a name="DiscreteAnimation" /><div class="subheading">Discrete Animation</div>
    <p>
            The <span class="codeReference">DiscreteAnimation</span> inherits from <span class="codeReference"><a href="#PropertyAnimation">PropertyAnimation</a></span> and sets the value
            of the <span class="codeReference">property</span> to the elements in a provided array of values.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Discrete</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.DiscreteAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#PropertyAnimation">Sys.Extended.UI.Animation.PropertyAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.DiscreteAnimation(target, duration, fps, property, propertyKey, values);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.DiscreteAnimation.play(target, duration, fps, property, propertyKey, values);</td>
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
                                <div class="animationReferenceItemCode">Object target;</div>
                                Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Array values;</div>
                                Array of possible values of the <span class="codeReference">property</span> that will be iterated
                                over as the animation is played.
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



    <a name="InterpolatedAnimation" /><div class="subheading">Interpolated Animation</div>
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



    <a name="ColorAnimation" /><div class="subheading">Color Animation</div>
    <p>
            The <span class="codeReference">ColorAnimation</span> transitions the value of a <span class="codeReference">property</span> between two
            colors (although it does ignore the alpha channel).  The colors must be 7-character hex strings (like #246ACF).
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Color</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ColorAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#InterpolatedAnimation">Sys.Extended.UI.Animation.InterpolatedAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.ColorAnimation(target, duration, fps, property, propertyKey, startValue, endValue);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ColorAnimation.play(target, duration, fps, property, propertyKey, startValue, endValue);</td>
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
                                <div class="animationReferenceItemCode">String endValue;</div>
                                Ending color of the transition formatted as a 7-character hex string (like #246ACF).
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
                                <div class="animationReferenceItemCode">String startValue;</div>
                                Starting color of the transition formatted as a 7-character hex string (like #246ACF).
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



    <a name="LengthAnimation" /><div class="subheading">Length Animation</div>
    <p>
        The <span class="codeReference">LengthAnimation</span> is identical to <span class="codeReference"><a href="#InterpolatedAnimation">InterpolatedAnimation</a></span> except it adds a <span class="codeReference">unit</span> to the value before assigning it to the <span class="codeReference">property</span>.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Length</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.LengthAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#InterpolatedAnimation">Sys.Extended.UI.Animation.InterpolatedAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.LengthAnimation(target, duration, fps, property, propertyKey, startValue, endValue, unit);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.LengthAnimation.play(target, duration, fps, property, propertyKey, startValue, endValue, unit);</td>
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
                                <div class="animationReferenceItemCode">Number endValue;</div>
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
                                <div class="animationReferenceItemCode">Number startValue;</div>
                                Start of the range of values
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
                                Unit to append to the value before setting the <span class="codeReference">property</span>.  The default value is 'px'.
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



    <a name="MoveAnimation" /><div class="subheading">Move Animation</div>
    <p>
            The <span class="codeReference">MoveAnimation</span> is used to move the <span class="codeReference">target</span> element. 
            If the <span class="codeReference">relative</span> flag is set to true, then it treats the <span class="codeReference">horizontal</span>
            and <span class="codeReference">vertical</span> properties as offsets to move the element.  If the <span class="codeReference">relative</span>
            flag is false, then it will treat the <span class="codeReference">horizontal</span> and <span class="codeReference">vertical</span> properties
            as coordinates on the page where the <span class="codeReference">target</span> element should be moved.  It is important to note that the
            <span class="codeReference">target</span> must be <span class="codeReference">position</span>ed (i.e. <span class="codeReference">absolute</span>ly)
            so that settings its <span class="codeReference">top</span>/<span class="codeReference">left</span> properties will change its location.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Move</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.MoveAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#ParallelAnimation">Sys.Extended.UI.Animation.ParallelAnimation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.MoveAnimation(target, duration, fps, horizontal, vertical, relative, unit);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.MoveAnimation.play(target, duration, fps, horizontal, vertical, relative, unit);</td>
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
                                <div class="animationReferenceItemCode">Number horizontal;</div>
                                If <span class="codeReference">relative</span> is true, this is the offset to move horizontally.  Otherwise
                                this is the x coordinate on the page where the <span class="codeReference">target</span> should be moved.
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
                                <div class="animationReferenceItemCode">Boolean relative;</div>
                                True if we are moving relative to the current position, false if we are moving absolutely.
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
                                <div class="animationReferenceItemCode">Number vertical;</div>
                                If <span class="codeReference">relative</span> is true, this is the offset to move horizontally.  Otherwise
                                this is the x coordinate on the page where the <span class="codeReference">target</span> should be moved.
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
                                Get the current position of the <span class="codeReference">target</span> and get ready
                                to move to the new location.
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



    <a name="ResizeAnimation" /><div class="subheading">Resize Animation</div>
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



    <a name="ScaleAnimation" /><div class="subheading">Scale Animation</div>
    <p>
        The <span class="codeReference">ScaleAnimation</span> scales the size of the <span class="codeReference">target</span> element by the given
        <span class="codeReference">scaleFactor</span> (i.e. a <span class="codeReference">scaleFactor</span> of .5 will shrink it in half and a
        <span class="codeReference">scaleFactor of 2.0</span> will double it).  If <span class="codeReference">scaleFont</span> is true, the size of
        the font will also scale with the element.  If <span class="codeReference">center</span> is true, then the element's center will not move as it
        is scaled.  It is important to note that the <span class="codeReference">target</span> must be <span class="codeReference">position</span>ed
        (i.e. <span class="codeReference">absolute</span>ly) so that settings its <span class="codeReference">top</span>/<span class="codeReference">left</span>
        properties will change its location in order for <span class="codeReference">center</span> to have an effect.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">Scale</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ScaleAnimation</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.ScaleAnimation(target, duration, fps, scaleFactor, unit, center, scaleFont, fontUnit);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ScaleAnimation.play(target, duration, fps, scaleFactor, unit, center, scaleFont, fontUnit);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Properties:</td>
                <td class="animationReferenceItems">
                    <table class="animationReferenceItemTable">
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean center;</div>
                                Whether the <span class="codeReference">target</span> should stay centered while scaling
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
                                <div class="animationReferenceItemCode">String fontUnit;</div>
                                Unit of the font, which is only used if <span class="codeReference">scaleFont</span> is true.  The default value is 'pt'.
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
                                <div class="animationReferenceItemCode">Number scaleFactor;</div>
                                The amount to scale the <span class="codeReference">target</span> (a <span class="codeReference">scaleFactor</span> of .5 will
                                shrink it in half and a <span class="codeReference">scaleFactor of 2.0</span> will double it).  The default value is 1,
                                which does no scaling.
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean scaleFont;</div>
                                Whether the font should be scaled along with the size.
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



    <a name="Action" /><div class="subheading">Action</div>
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



    <a name="EnableAction" /><div class="subheading">Enable Action</div>
    <p>
            The <span class="codeReference">EnableAction</span> changes whether or not the <span class="codeReference">target</span> is disabled.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">EnableAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.EnableAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Action">Sys.Extended.UI.Animation.Action</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.EnableAction(target, duration, fps, enabled);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.EnableAction.play(target, duration, fps, enabled);</td>
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
                                <div class="animationReferenceItemCode">Boolean enabled;</div>
                                Whether or not the <span class="codeReference">target</span> is disabled.  The default value is true.
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
                                Inherited from <span class="codeReference"><a href="#Action">Sys.Extended.UI.Animation.Action</a></span>
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



    <a name="HideAction" /><div class="subheading">Hide Action</div>
    <p>
            The <span class="codeReference">HideAction</span> simply hides the <span class="codeReference">target</span> from view (by setting its <span class="codeReference">style</span>'s <span class="codeReference">display</span> attribute to <span class="codeReference">'none'</span>).
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">HideAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.HideAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Action">Sys.Extended.UI.Animation.Action</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.HideAction(target, duration, fps, visible);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.HideAction.play(target, duration, fps, visible);</td>
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
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">Boolean visible;</div>
                                <span class="codeReference">true</span> to show the target, <span class="codeReference">false</span>
                                to hide it.  The default value is <span class="codeReference">false</span>.
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
                                Inherited from <span class="codeReference"><a href="#Action">Sys.Extended.UI.Animation.Action</a></span>
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



    <a name="StyleAction" /><div class="subheading">Style Action</div>
    <p>
            The <span class="codeReference">StyleAction</span> is used to set a particular <span class="codeReference">attribute</span> of the <span class="codeReference">target</span>'s style.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">StyleAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.StyleAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Action">Sys.Extended.UI.Animation.Action</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.StyleAction(target, duration, fps, attribute, value);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.StyleAction.play(target, duration, fps, attribute, value);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Properties:</td>
                <td class="animationReferenceItems">
                    <table class="animationReferenceItemTable">
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">String attribute;</div>
                                Style attribute to set (this must be in a JavaScript friendly format, i.e. <span class="codeReference">backgroundColor</span> instead of <span class="codeReference">background-color</span>).
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
                                <div class="animationReferenceItemCode">Object target;</div>
                                Inherited from <span class="codeReference"><a href="#Animation">Sys.Extended.UI.Animation.Animation</a></span>
                            </td>
                        </tr>
                        <tr class="animationReferenceItemRow">
                            <td class="animationReferenceItem">
                                <div class="animationReferenceItemCode">String value;</div>
                                Value to set the <span class="codeReference">attriute</span>
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
                                Inherited from <span class="codeReference"><a href="#Action">Sys.Extended.UI.Animation.Action</a></span>
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



    <a name="OpacityAction" /><div class="subheading">Opacity Action</div>
    <p>
            <span class="codeReference">OpacityAction</span> will set the <span class="codeReference">opacity</span> of the <span class="codeReference">target</span>.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">OpacityAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.OpacityAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Action">Sys.Extended.UI.Animation.Action</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.OpacityAction(target, duration, fps, opacity);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.OpacityAction.play(target, duration, fps, opacity);</td>
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
                                <div class="animationReferenceItemCode">Number opacity;</div>
                                Opacity to set the <span class="codeReference">target</span>
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
                                Inherited from <span class="codeReference"><a href="#Action">Sys.Extended.UI.Animation.Action</a></span>
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



    <a name="ScriptAction" /><div class="subheading">Script Action</div>
    <p>
            The <span class="codeReference">ScriptAction</span> is used to execute arbitrary JavaScript.
        </p>
        <table class="animationReferenceTable">
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Tag:</td>
                <td class="animationReferenceCode">ScriptAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Class:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ScriptAction</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Base:</td>
                <td class="animationReferenceCode"><a href="#Action">Sys.Extended.UI.Animation.Action</a></td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Constructor:</td>
                <td class="animationReferenceCode">new Sys.Extended.UI.Animation.ScriptAction(target, duration, fps, script);</td>
            </tr>
            <tr class="animationReferenceRow">
                <td class="animationReferenceField">Play:</td>
                <td class="animationReferenceCode">Sys.Extended.UI.Animation.ScriptAction.play(target, duration, fps, script);</td>
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
                                <div class="animationReferenceItemCode">String script;</div>
                                JavaScript to execute
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
                                Inherited from <span class="codeReference"><a href="#Action">Sys.Extended.UI.Animation.Action</a></span>
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
    
    </div>
</asp:Content>