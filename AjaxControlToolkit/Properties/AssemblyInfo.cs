using AjaxControlToolkit;
using System.Reflection;
using System.Resources;
using System.Runtime.InteropServices;
using System.Security;
using System.Web.UI;

[assembly: AssemblyTitle("Ajax Control Toolkit")]

[assembly: AllowPartiallyTrustedCallers]
[assembly: ComVisible(false)]
[assembly: SecurityRules(SecurityRuleSet.Level1)]

[assembly: WebResource(Constants.AccordionName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.AccordionName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.AlwaysVisibleControlName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.AlwaysVisibleControlName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.AnimationName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.AnimationName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.AnimationScriptsName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.AnimationScriptsName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.AutoCompleteName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.AutoCompleteName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.StyleResourcePrefix + Constants.BackgroundStylesName + Constants.CssPostfix, "text/css", PerformSubstitution = true)]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.BackgroundStylesName + Constants.MinCssPostfix, "text/css", PerformSubstitution = true)]

[assembly: WebResource(Constants.BaseScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.BaseScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CommonScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CommonScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CompatDragDropScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CompatDragDropScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CompatTimerScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CompatTimerScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CalendarName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CalendarName + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.CalendarName + Constants.CssPostfix, "text/css", PerformSubstitution = true)]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.CalendarName + Constants.MinCssPostfix, "text/css", PerformSubstitution = true)]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.CalendarArrowLeftImage, "image/gif")]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.CalendarArrowRightImage, "image/gif")]

[assembly: WebResource(Constants.CascadingDropDownName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CascadingDropDownName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CollapsiblePanelName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CollapsiblePanelName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DateTimeScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DateTimeScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DynamicPopulateName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DynamicPopulateName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DraggableListItemName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DraggableListItemName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DragPanelName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DragPanelName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DropShadowName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DropShadowName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DropWatcherName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DropWatcherName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.FilteredTextBoxName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.FilteredTextBoxName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.HoverMenuName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.HoverMenuName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.HoverName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.HoverName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.MaskedEditName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.MaskedEditName + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.MaskedEditValidatorName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.MaskedEditValidatorName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.MutuallyExclusiveCheckBoxName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.MutuallyExclusiveCheckBoxName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.NoBotName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.NoBotName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.NumericUpDownName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.NumericUpDownName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.PagingBulletedListName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.PagingBulletedListName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.PasswordStrengthName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.PasswordStrengthName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.PopupName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.PopupName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.RatingName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.RatingName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.ResizableControlName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.ResizableControlName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.RoundedCornersName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.RoundedCornersName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.SliderName + Constants.DebugJsPostfix, "text/javascript", PerformSubstitution = true)]
[assembly: WebResource(Constants.SliderName + Constants.JsPostfix, "text/javascript", PerformSubstitution = true)]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.SliderName + Constants.CssPostfix, "text/css", PerformSubstitution = true)]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.SliderName + Constants.MinCssPostfix, "text/css", PerformSubstitution = true)]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.SliderHorizontalHandleImage, "image/gif")]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.SliderVerticalHandleImage, "image/gif")]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.SliderHorizontalRailImage, "image/gif")]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.SliderVerticalRailImage, "image/gif")]

[assembly: WebResource(Constants.SlideShowName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.SlideShowName + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.SlideShowName + Constants.CssPostfix, "text/css")]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.SlideShowName + Constants.MinCssPostfix, "text/css")]

[assembly: WebResource(Constants.TextBoxWatermarkName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.TextBoxWatermarkName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.ThreadingScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.ThreadingScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.ToggleButtonName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.ToggleButtonName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.UpdatePanelAnimationName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.UpdatePanelAnimationName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.ValidatorCalloutName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.ValidatorCalloutName + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.ValidatorCalloutName + Constants.CssPostfix, "text/css", PerformSubstitution = true)]
[assembly: WebResource(Constants.StyleResourcePrefix + Constants.ValidatorCalloutName + Constants.MinCssPostfix, "text/css", PerformSubstitution = true)]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.ValidatorCalloutAlertLargeImage, "image/gif")]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.ValidatorCalloutAlertSmallImage, "image/gif")]
[assembly: WebResource(Constants.ImageResourcePrefix + Constants.ValidatorCalloutCloseImage, "image/gif")]

[assembly: WebResource(Constants.LocalizationScriptName + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".ar" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".ar" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".cs" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".cs" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".de" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".de" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".es" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".es" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".fr" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".fr" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".he" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".he" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".hi" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".hi" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".it" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".it" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".ja" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".ja" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".ko" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".ko" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".nl" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".nl" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".pl" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".pl" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".pt" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".pt" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".ru" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".ru" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".tr-TR" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".tr-TR" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".zh-CHS" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".zh-CHS" + Constants.DebugJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.LocalizationScriptName + ".zh-CHT" + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.LocalizationScriptName + ".zh-CHT" + Constants.DebugJsPostfix, "text/javascript")]