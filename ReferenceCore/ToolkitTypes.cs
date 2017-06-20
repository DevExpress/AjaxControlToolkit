using System.Linq;
using System.Collections.Generic;

namespace AjaxControlToolkit.Reference {
    public class ToolkitTypes {
        private static string[] typeBaseNames = new string[] {
                "Accordion",
                "AjaxFileUpload",
                "AlwaysVisibleControlExtender",
                "AnimationExtender",
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

        public static IEnumerable<string> GetAnimationTypeNames() {
            return new string[] {
                "Animation",
                "ParentAnimation",
                "ParallelAnimation",
                "SequenceAnimation",
                "SelectionAnimation",
                "ConditionAnimation",
                "CaseAnimation",
                "FadeAnimation",
                "FadeInAnimation",
                "FadeOutAnimation",
                "PulseAnimation",
                "PropertyAnimation",
                "DiscreteAnimation",
                "InterpolatedAnimation",
                "ColorAnimation",
                "LengthAnimation",
                "MoveAnimation",
                "ResizeAnimation",
                "ScaleAnimation",
                "Action",
                "EnableAction",
                "HideAction",
                "StyleAction",
                "OpacityAction",
                "ScriptAction"
            };
        }
    }
}