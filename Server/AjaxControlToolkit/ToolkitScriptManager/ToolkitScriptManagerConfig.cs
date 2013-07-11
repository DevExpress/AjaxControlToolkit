using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Xml.Serialization;

namespace AjaxControlToolkit
{
    internal class ToolkitScriptManagerConfig
    {
        private const string ConfigFileName = "~/AjaxControlToolkit.config";
        private static readonly Dictionary<string, string[]> ControlTypeMaps;

        static ToolkitScriptManagerConfig()
        {
            ControlTypeMaps
                = new Dictionary<string, string[]>
                      {
                          {"AccordionExtender", new[] {"AccordionExtender"}},
                          {"AjaxFileUpload", new[] {"AjaxFileUpload"}},
                          {"AlwaysVisibleControlExtender", new[] {"AlwaysVisibleControlExtender"}},
                          {"AnimationExtender", new[] {"AnimationExtender"}},
                          {"AreaChart", new[] {"AreaChart"}},
                          {"AsyncFileUpload", new[] {"AsyncFileUpload"}},
                          {"AutoCompleteExtender", new[] {"AutoCompleteExtender"}},
                          {"BalloonPopupExtender", new[] {"BalloonPopupExtender"}},
                          {"BarChart", new[] {"BarChart"}},
                          {"BubbleChart", new[] {"BubbleChart"}},
                          {"CalendarExtender", new[] {"CalendarExtender"}},
                          {"CascadingDropDown", new[] {"CascadingDropDown"}},
                          {"CollapsiblePanelExtender", new[] {"CollapsiblePanelExtender"}},
                          {"ColorPickerExtender", new[] {"ColorPickerExtender"}},
                          {"ComboBox", new[] {"ComboBox"}},
                          {"ConfirmButtonExtender", new[] {"ConfirmButtonExtender"}},
                          {"DragPanelExtender", new[] {"DragPanelExtender"}},
                          {"DropDownExtender", new[] {"DropDownExtender"}},
                          {"DropShadowExtender", new[] {"DropShadowExtender"}},
                          {"DynamicPopulateExtender", new[] {"DynamicPopulateExtender"}},
                          {"FilteredTextBoxExtender", new[] {"FilteredTextBoxExtender"}},
                          {"Gravatar", new[] {"Gravatar"}},
                          {"HoverMenuExtender", new[] {"HoverMenuExtender"}},
                          {"HTMLEditor", new[] {"HTMLEditor.HTMLEditor"}},
                          {"HtmlEditorExtender", new[] {"HtmlEditorExtender"}},
                          {"LineChart", new[] {"LineChart"}},
                          {"ListSearchExtender", new[] {"ListSearchExtender"}},
                          {"MaskedEditExtender", new[] {"MaskedEditExtender"}},
                          {"ModalPopupExtender", new[] {"ModalPopupExtender"}},
                          {"MultiHandleSliderExtender", new[] {"MultiHandleSliderExtender"}},
                          {"MutuallyExclusiveCheckBoxExtender", new[] {"MutuallyExclusiveCheckBoxExtender"}},
                          {"NoBotExtender", new[] {"NoBotExtender"}},
                          {"NumericUpDownExtender", new[] {"NumericUpDownExtender"}},
                          {"PagingBulletedListExtender", new[] {"PagingBulletedListExtender"}},
                          {"PasswordStrength", new[] {"PasswordStrength"}},
                          {"PieChart", new[] {"PieChart"}},
                          {"PopupControlExtender", new[] {"PopupControlExtender"}},
                          {"RatingExtender", new[] {"RatingExtender"}},
                          {
                              "ReorderList", new[]
                                                 {
                                                     "DraggableListItemExtender",
                                                     "DropWatcherExtender"
                                                 }
                          },
                          {"ResizableControlExtender", new[] {"ResizableControlExtender"}},
                          {"RoundedCornersExtender", new[] {"RoundedCornersExtender"}},
                          {"Seadragon", new[] {"Seadragon"}},
                          {"SliderExtender", new[] {"SliderExtender"}},
                          {"SlideShowExtender", new[] {"SlideShowExtender"}},
                          {
                              "TabContainer", new[]
                                                  {
                                                      "TabContainer",
                                                      "TabPanel"
                                                  }
                          },
                          {"TextBoxWatermarkExtender", new[] {"TextBoxWatermarkExtender"}},
                          {"ToggleButtonExtender", new[] {"ToggleButtonExtender"}},
                          {"Twitter", new[] {"Twitter"}},
                          {"UpdatePanelAnimationExtender", new[] {"UpdatePanelAnimationExtender"}},
                          {"ValidatorCalloutExtender", new[] {"ValidatorCalloutExtender"}}
                      };
        }

        internal static List<Type> GetControlTypesInBundles(string[] bundles) {

            var registeredControls = new List<Type>();
            var registeredBundles = new List<string>();
            var fileName =
                HttpContext.Current.Server.MapPath(ConfigFileName);
            

            if (!File.Exists(fileName)) {

                // No bundle config specified

                // User specify requested bundle on page which transfered through query string / form request data, 
                // but did not register the bundle config yet then exception should be thrown
                if (bundles != null && bundles.Length > 0)
                    throw new Exception("Can not resolve requested control bundle since " + ConfigFileName +
                                        " file is not defined.");

                var allControlTypesName = new List<string>();
                foreach (var map in ControlTypeMaps) {
                    allControlTypesName.AddRange(map.Value);
                }

                // Load all AjaxControlToolkit controls if there is no bundle specified neither the config file
                registeredControls.AddRange(allControlTypesName.Select(c => Type.GetType("AjaxControlToolkit." + c))
                                                      .ToList());
            }
            else {

                // Bundle config specified

                var serializer = new XmlSerializer(typeof (Config.Settings));

                using (var fs = new FileStream(fileName, FileMode.Open, FileAccess.Read)) {
                    var settings = (Config.Settings) serializer.Deserialize(fs);

                    foreach (var bundle in settings.ControlBundles) {

                        foreach (var controlBundle in bundle.ControlBundles) {

                            // Only add control types if ...
                            if (
                                // this is default bundle and requested bundle not specified.
                                (string.IsNullOrEmpty(controlBundle.Name) && (bundles == null || bundles.Length == 0)) || 

                                // this is not default bundle and its specified in requested bundle
                                bundles != null && (bundles.Contains(controlBundle.Name) || string.IsNullOrEmpty(controlBundle.Name))) {

                                foreach (var control in controlBundle.Controls) {
                                    
                                    if (string.IsNullOrEmpty(control.Assembly) || control.Assembly == "AjaxControlToolkit") {

                                        // Processing AjaxControlToolkit controls

                                        if (!ControlTypeMaps.ContainsKey(control.Name))
                                            throw new Exception(
                                                string.Format(
                                                    "Could not find control '{0}'. Please make sure you entered the correct control name in AjaxControlToolkit.config file.",
                                                    control));

                                        registeredControls.AddRange(
                                            ControlTypeMaps[control.Name].Select(
                                                c => Type.GetType("AjaxControlToolkit." + c)));
                                    }
                                    else {

                                        // Processing custom controls

                                        registeredControls.Add(
                                            GetAssembly(control.Assembly).GetType(control.Assembly + "." + control.Name));
                                    }
                                }

                                // Mark that bundle is registered for future verification
                                registeredBundles.Add(controlBundle.Name);
                            }
                        }

                    }
                }

                // Verify, is there any control in bundle that not registered yet
                if (bundles != null) {
                    foreach (var bundle in bundles) {
                        if (!registeredBundles.Contains(bundle))
                            throw new Exception(string.Format("Could not resolve bundle {0}.", bundle));
                    }
                }
            }

            // Return unique types
            return registeredControls.Distinct().ToList();
        }

        private static readonly Dictionary<string, Assembly> LoadedAssemblies = new Dictionary<string, Assembly>();
        static Assembly GetAssembly(string name) {
            if (!LoadedAssemblies.ContainsKey(name))
                LoadedAssemblies.Add(name, Assembly.Load(name));
            return LoadedAssemblies[name];
        }        
    }
}
