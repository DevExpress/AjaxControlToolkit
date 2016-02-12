#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    public class ControlDependencyMap {
        static Lazy<Dictionary<string, ControlDependencyMap>> _dependencyMaps =
            new Lazy<Dictionary<string, ControlDependencyMap>>(CreateDependencyMaps, true);

        public static Dictionary<string, ControlDependencyMap> Maps {
            get { return _dependencyMaps.Value; }
        }

        List<Type> _dependecies;

        public Type Type { get; private set; }

        public IEnumerable<Type> Dependecies {
            get { return _dependecies; }
        }

        public ControlDependencyMap(Type type, Type[] types) {
            Type = type;
            _dependecies = new List<Type>(types);
        }

        static Dictionary<string, ControlDependencyMap> CreateDependencyMaps() {
            var result = new Dictionary<string, ControlDependencyMap>();
            var assembly = typeof(ControlDependencyMap).Assembly;

            var allActControlsNames = new string[] { 
                "AjaxControlToolkit.Accordion",
                "AjaxControlToolkit.AccordionContentPanel",
                "AjaxControlToolkit.AccordionExtender",
                "AjaxControlToolkit.AccordionPane",
                "AjaxControlToolkit.ScriptControlBase",
                "AjaxControlToolkit.AjaxFileUpload",
                "AjaxControlToolkit.AlwaysVisibleControlExtender",
                "AjaxControlToolkit.AnimationExtender",
                "AjaxControlToolkit.AreaChart",
                "AjaxControlToolkit.AsyncFileUpload",
                "AjaxControlToolkit.BarChart",
                "AjaxControlToolkit.BubbleChart",
                "AjaxControlToolkit.AutoCompleteExtender",
                "AjaxControlToolkit.BalloonPopupExtender",
                "AjaxControlToolkit.CalendarExtender",
                "AjaxControlToolkit.CascadingDropDown",
                "AjaxControlToolkit.CollapsiblePanelExtender",
                "AjaxControlToolkit.ColorPickerExtender",
                "AjaxControlToolkit.ComboBox",
                "AjaxControlToolkit.ComboBoxButton",
                "AjaxControlToolkit.ConfirmButtonExtender",
                "AjaxControlToolkit.DragPanelExtender",
                "AjaxControlToolkit.DropDownExtender",
                "AjaxControlToolkit.DropShadowExtender",
                "AjaxControlToolkit.DynamicPopulateExtender",
                "AjaxControlToolkit.FilteredTextBoxExtender",
                "AjaxControlToolkit.Gravatar",
                "AjaxControlToolkit.HoverExtender",
                "AjaxControlToolkit.HoverMenuExtender",
                "AjaxControlToolkit.HtmlEditorExtender",
                "AjaxControlToolkit.HtmlEditor.Editor",
                "AjaxControlToolkit.HtmlEditor.Popups.AttachedPopup",
                "AjaxControlToolkit.HtmlEditor.Popups.AttachedTemplatePopup",
                "AjaxControlToolkit.HtmlEditor.Popups.OkCancelAttachedTemplatePopup",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.MethodButton",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.BackColorClear",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.BackColorSelector",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Bold",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.BulletedList",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Copy",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Cut",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.DecreaseIndent",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.DesignMode",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.DesignModeBoxButton",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.FixedBackColor",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.FixedForeColor",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.FontName",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.FontSize",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.ForeColor",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.ForeColorClear",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.ForeColorSelector",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.HorizontalSeparator",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.HtmlMode",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.IncreaseIndent",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.InsertHR",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.InsertLink",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Italic",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.JustifyCenter",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.JustifyFull",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.JustifyLeft",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.JustifyRight",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Ltr",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.OrderedList",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Paragraph",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Paste",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.PasteText",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.PasteWord",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.PreviewMode",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Redo",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.RemoveAlignment",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.RemoveLink",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.RemoveStyles",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Rtl",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.StrikeThrough",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.SubScript",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.SuperScript",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Underline",
                "AjaxControlToolkit.HtmlEditor.ToolbarButtons.Undo",
                "AjaxControlToolkit.LineChart",
                "AjaxControlToolkit.ListSearchExtender",
                "AjaxControlToolkit.MaskedEditExtender",
                "AjaxControlToolkit.MaskedEditValidator",
                "AjaxControlToolkit.ModalPopupExtender",
                "AjaxControlToolkit.MultiHandleSliderExtender",
                "AjaxControlToolkit.MutuallyExclusiveCheckBoxExtender",
                "AjaxControlToolkit.NoBot",
                "AjaxControlToolkit.NoBotExtender",
                "AjaxControlToolkit.NumericUpDownExtender",
                "AjaxControlToolkit.PagingBulletedListExtender",
                "AjaxControlToolkit.PasswordStrength",
                "AjaxControlToolkit.PieChart",
                "AjaxControlToolkit.PopupControlExtender",
                "AjaxControlToolkit.PopupExtender",
                "AjaxControlToolkit.Rating",
                "AjaxControlToolkit.RatingExtender",
                "AjaxControlToolkit.BulletedList",
                "AjaxControlToolkit.BulletedListItem",
                "AjaxControlToolkit.DraggableListItemExtender",
                "AjaxControlToolkit.DropWatcherExtender",
                "AjaxControlToolkit.ReorderList",
                "AjaxControlToolkit.ReorderListItem",
                "AjaxControlToolkit.ResizableControlExtender",
                "AjaxControlToolkit.Seadragon",
                "AjaxControlToolkit.SeadragonControl",
                "AjaxControlToolkit.SeadragonFixedOverlay",
                "AjaxControlToolkit.SeadragonScalableOverlay",
                "AjaxControlToolkit.SliderExtender",
                "AjaxControlToolkit.TabContainer",
                "AjaxControlToolkit.TabPanel",
                "AjaxControlToolkit.ToggleButtonExtender",
                "AjaxControlToolkit.RoundedCornersExtender",
                "AjaxControlToolkit.SlideShowExtender",
                "AjaxControlToolkit.TextBoxWatermarkExtender",
                "AjaxControlToolkit.Twitter",
                "AjaxControlToolkit.UpdatePanelAnimationExtender",
                "AjaxControlToolkit.ValidatorCalloutExtender"};

            // Retrieve all dependencies in controls to build ControlTypeMaps
            foreach (var typeName in allActControlsNames) {
                var type = assembly.GetType(typeName);
                result[typeName] = BuildDependencyMap(type);
            }

            foreach (var type in ToolkitConfig.CustomControls) {
                result[type.FullName] = BuildDependencyMap(type);
            }

            return result;
        }

        public static ControlDependencyMap BuildDependencyMap(Type type) {
            var dependencies = new List<Type>();
            SeekDependencies(type, ref dependencies);
            var scriptDependencies = dependencies
                .Where(m => m.GetCustomAttributes(true).Any(a => a is RequiredScriptAttribute || a is ClientScriptResourceAttribute))
                .ToList();

            scriptDependencies.Add(type);

            return new ControlDependencyMap(type, scriptDependencies.Distinct().ToArray());
        }

        static void SeekDependencies(Type ctlType, ref List<Type> dependencies) {
            var deps = dependencies;

            // Retrieve all member types which are not in dependency list yet
            var members = ctlType.GetMembers(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Public | BindingFlags.Static)
                .SelectMany(info => GetMemberTypes(info))
                .Where(m => m != null && m.Namespace != null && m.Namespace.StartsWith("AjaxControlToolkit"))
                .Distinct()
                .Where(m => !deps.Contains(m))
                .ToList();

            // For extender control, we should check also the dependencies of target control type
            foreach (var targetCtlType in ctlType.GetCustomAttributes(true)
                .Where(a => a is TargetControlTypeAttribute)) {

                var targetType = ((TargetControlTypeAttribute)targetCtlType).TargetControlType;
                if (!members.Contains(targetType) && !dependencies.Contains(targetType))
                    members.Add(targetType);
            }

            // Store dependency list
            dependencies.AddRange(members.ToList());

            // Iterate every dependency to find nested dependencies
            foreach (var member in members) {
                SeekDependencies(member, ref dependencies);
            }
        }

        static IEnumerable<Type> GetMemberTypes(MemberInfo memberInfo) {
            Type type = null;

            switch (memberInfo.MemberType) {
                case MemberTypes.Event:
                    type = ((EventInfo)memberInfo).EventHandlerType;
                    break;
                case MemberTypes.Field:
                    type = ((FieldInfo)memberInfo).FieldType;
                    break;
                case MemberTypes.Method:
                    type = ((MethodInfo)memberInfo).ReturnType;
                    break;
                case MemberTypes.Property:
                    type = ((PropertyInfo)memberInfo).PropertyType;
                    break;
                case MemberTypes.NestedType:
                    // Special case for nested type, we will iterate the nested members here
                    var members = ((Type)memberInfo).GetMembers();
                    var ntypes = new List<Type>();
                    foreach (var m in members) {
                        var mtypes = GetMemberTypes(m).Where(x => !ntypes.Contains(x));
                        ntypes.AddRange(mtypes);
                    }

                    return ntypes.ToArray();
            }
            return new[] { type };
        }
    }

}

#pragma warning restore 1591