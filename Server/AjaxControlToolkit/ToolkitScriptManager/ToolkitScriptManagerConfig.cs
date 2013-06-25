using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace AjaxControlToolkit
{
    internal class ToolkitScriptManagerConfig
    {
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

        /// <summary>
        /// Get all registered controls types defined on config file. 
        /// If config file path is null or empty then all controls should be loaded.
        /// If no control defined in config file then all controls should be loaded.
        /// </summary>
        /// <param name="configFilePath">Path of config file.</param>
        /// <returns>All registered controls types.</returns>
        internal static List<Type> GetRegisteredControls(string configFilePath)
        {
            var selectedControlTypes = new List<string>();
            var loadAllControls = true;

            if (!string.IsNullOrEmpty(configFilePath))
            {
                var fileName =
                    HttpContext.Current.Server.MapPath(string.IsNullOrEmpty(configFilePath)
                                                           ? "~/AjaxControlToolkit.config"
                                                           : configFilePath);
                if (!File.Exists(fileName))
                    throw new Exception("Could not find AjaxControlToolkit configuration file named on path " +
                                        configFilePath);

                var serializer = new XmlSerializer(typeof (Settings));
                using (var fs = new FileStream(fileName, FileMode.Open, FileAccess.Read))
                {
                    var settings = (Settings) serializer.Deserialize(fs);

                    // No control specified on config, assume all controls are demanded.
                    loadAllControls = settings.Controls.Length == 0;
                    foreach (var controlName in settings.Controls)
                    {
                        if (!ControlTypeMaps.ContainsKey(controlName))
                            throw new Exception(
                                string.Format(
                                    "Could not find control '{0}'. Please make sure you entered the correct control name in AjaxControlToolkit.config file.",
                                    controlName));

                        selectedControlTypes.AddRange(ControlTypeMaps[controlName]);
                    }
                }
            }

            if (loadAllControls)
            {
                foreach (var map in ControlTypeMaps)
                {
                    selectedControlTypes.AddRange(map.Value);
                }
            }

            return selectedControlTypes.Select(control => Type.GetType("AjaxControlToolkit." + control)).ToList();
        }
        
    }
}
