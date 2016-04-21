using System.Linq;
using System.Collections.Generic;

namespace AjaxControlToolkit.Reference {
    public class ToolkitTypes {
        private static string[] typeBaseNames = new string[] {
                "Accordion",
                "AjaxFileUpload",
                "AlwaysVisibleControlExtender",
                "Animation",
                "AreaChart",
                "AsyncFileUpload",
                "AutoCompleteExtender",
                "BalloonPopupExtender",
                "BarChart",
                "BubbleChart",
                "CalendarExtender",
                "CascadingDropDown",
                "CollapsiblePanelExtender",
                "ColorPickerExtender",
                "ComboBox",
                "ConfirmButtonExtender",
                "DragPanelExtender",
                "DropDownExtender",
                "DropShadowExtender",
                "DynamicPopulateExtender",
                "FilteredTextBoxExtender",
                "Gravatar",
                "HoverMenuExtender",
                "HtmlEditorExtender",
                "LineChart",
                "ListSearchExtender",
                "MaskedEditExtender",
                "MaskedEditValidator",
                "ModalPopupExtender",
                "MultiHandleSliderExtender",
                "MutuallyExclusiveCheckBoxExtender",
                "NoBot",
                "NumericUpDownExtender",
                "PagingBulletedListExtender",
                "PasswordStrength",
                "PieChart",
                "PopupControlExtender",
                "Rating",
                "ReorderList",
                "ResizableControlExtender",
                "RoundedCornersExtender",
                "Seadragon",
                "SliderExtender",
                "SlideShowExtender",                
                "TextBoxWatermarkExtender",
                "ToggleButtonExtender",
                "Twitter",
                "UpdatePanelAnimationExtender",
                "ValidatorCalloutExtender"
            };

        public static IEnumerable<string> GetTypeNames() {
            return typeBaseNames.Concat(new string[] { "TabContainer", "TabPanel" });
        }

        public static IEnumerable<string> GetIssueTypeNames() {
            return typeBaseNames.Concat(new string[] { "HtmlEditor", "Tabs" });
        }
    }
}