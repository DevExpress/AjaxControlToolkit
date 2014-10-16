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

[assembly: WebResource(Constants.BaseScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.BaseScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CommonScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CommonScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CompatDragDropScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CompatDragDropScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CompatTimerScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CompatTimerScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DragPanelScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DragPanelScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DropShadowScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DropShadowScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.FilteredTextBoxScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.FilteredTextBoxScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.MutuallyExclusiveCheckBox + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.MutuallyExclusiveCheckBox + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.PagingBulletedListScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.PagingBulletedListScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.RoundedCornersScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.RoundedCornersScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.TextBoxWatermarkScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.TextBoxWatermarkScriptName + Constants.JsPostfix, "text/javascript")]

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