

using System;
using System.Web.UI;


[assembly: System.Web.UI.WebResource("Animation.Animations.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Animation.Animations.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// The AnimationScripts class is used to load all of the animation support for the AJAX
    /// Control Toolkit.  To use any of the animations you find in Animations.js, simply include
    /// the attribute [RequiredScript(typeof(AnimationScripts))] on your extender.
    /// </summary>
    [ClientScriptResource(null, "Animation.Animations.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(TimerScript))]
    public static class AnimationScripts
    {
    }
}
