#pragma warning disable 1591
namespace AjaxControlToolkit {

    // The AnimationScripts class is used to load all of the animation support for the AJAX
    // Control Toolkit.  To use any of the animations you find in Animations.js, simply include
    // the attribute [RequiredScript(typeof(AnimationScripts))] on your extender.
    [ClientScriptResource(null, Constants.AnimationScriptsName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(TimerScript))]
    public static class AnimationScripts {
    }

}

#pragma warning restore 1591