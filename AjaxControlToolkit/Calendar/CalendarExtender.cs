using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.Collections.Generic;
using System.Drawing;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    // The Calendar control extender can be attached to any ASP.NET TextBox control. It provides client-side 
    // date-picking functionality with customizable date format and UI in a popup control. You can interact 
    // with the calendar by clicking on a day to set the date, or the "Today" link to set the current date. 
    // 
    // In addition, the left and right arrows can be used to move forward or back a month. 
    // By clicking on the title of the calendar you can change the view from Days in the current month, 
    // to Months in the current year. Another click will switch to Years in the current Decade. 
    // This action allows you to easily jump to dates in the past or the future from within 
    // the calendar control. 
    [Designer(typeof(CalendarExtenderDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(DateTimeScripts), 1)]
    [RequiredScript(typeof(PopupExtender), 2)]
    [RequiredScript(typeof(AnimationScripts), 3)]
    [RequiredScript(typeof(ThreadingScripts), 4)]
    [TargetControlType(typeof(TextBox))]
    [ClientCssResource(Constants.CalendarName)]
    [ClientScriptResource("Sys.Extended.UI.CalendarBehavior", Constants.CalendarName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.CalendarName + Constants.IconPostfix)]
    public class CalendarExtender : ExtenderControlBase {
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public virtual string CssClass {
            get { return GetPropertyValue("CssClass", String.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        // Format string used to display the selected date. The default value is "d"
        [DefaultValue("d")]
        [ExtenderControlProperty]
        [ClientPropertyName("format")]
        public virtual string Format {
            get { return GetPropertyValue("Format", "d"); }
            set { SetPropertyValue("Format", value); }
        }

        // Format string used to display today's date. The default value is "MMMM d, yyyy"
        [DefaultValue("MMMM d, yyyy")]
        [ExtenderControlProperty]
        [ClientPropertyName("todaysDateFormat")]
        public virtual string TodaysDateFormat {
            get { return GetPropertyValue("TodaysDateFormat", "MMMM d, yyyy"); }
            set { SetPropertyValue("TodaysDateFormat", value); }
        }

        // Format string used to display Days Mode Title. The default value is "MMMM, yyyy"
        [DefaultValue("MMMM, yyyy")]
        [ExtenderControlProperty]
        [ClientPropertyName("daysModeTitleFormat")]
        public virtual string DaysModeTitleFormat {
            get { return GetPropertyValue("DaysModeTitleFormat", "MMMM, yyyy"); }
            set { SetPropertyValue("DaysModeTitleFormat", value); }
        }

        /// Whether time should be cleared in edited date/time
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("clearTime")]
        public virtual bool ClearTime {
            get { return GetPropertyValue("ClearTime", false); }
            set { SetPropertyValue("ClearTime", value); }
        }

        // Whether this behavior is available for the current element
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("enabled")]
        public virtual bool EnabledOnClient {
            get { return GetPropertyValue("EnabledOnClient", true); }
            set { SetPropertyValue("EnabledOnClient", value); }
        }

        // Whether changing modes is animated
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("animated")]
        public virtual bool Animated {
            get { return GetPropertyValue("Animated", true); }
            set { SetPropertyValue("Animated", value); }
        }

        // Gets or sets the first day of week
        [DefaultValue(FirstDayOfWeek.Default)]
        [ExtenderControlProperty]
        [ClientPropertyName("firstDayOfWeek")]
        public virtual FirstDayOfWeek FirstDayOfWeek {
            get { return GetPropertyValue("FirstDayOfWeek", FirstDayOfWeek.Default); }
            set { SetPropertyValue("FirstDayOfWeek", value); }
        }

        /// The ID of a control to show the calendar popup when clicked. If this value is not set, the calendar will pop up when the textbox receives focus
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("button")]
        [ElementReference]
        [IDReferenceProperty]
        public virtual string PopupButtonID {
            get { return GetPropertyValue("PopupButtonID", String.Empty); }
            set { SetPropertyValue("PopupButtonID", value); }
        }

        // Gets or sets the popup position of the calendar. The default value is BottomLeft
        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(CalendarPosition.BottomLeft)]
        [Description("Indicates where you want the calendar displayed, bottom or top of the textbox.")]
        public virtual CalendarPosition PopupPosition {
            get { return GetPropertyValue("PopupPosition", CalendarPosition.BottomLeft); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        // Gets or sets the date that the calendar is initialized with
        [DefaultValue(null)]
        [ExtenderControlProperty]
        [ClientPropertyName("selectedDate")]
        public DateTime? SelectedDate {
            get {
                var selectedDate = GetPropertyValue<DateTime?>("SelectedDate", null);
                return selectedDate != null ? (DateTime?)DateTime.SpecifyKind(selectedDate.Value, DateTimeKind.Utc) : null;
            }
            set {
                var utcValue = value != null ? (DateTime?)DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null;
                SetPropertyValue<DateTime?>("SelectedDate", utcValue);
            }
        }

        // Gets or sets the default view of the calender. The default value is Days.
        [DefaultValue(CalendarDefaultView.Days)]
        [ExtenderControlProperty]
        [ClientPropertyName("defaultView")]
        [Description("Default view of the calendar when it first pops up.")]
        public virtual CalendarDefaultView DefaultView {
            get { return GetPropertyValue("DefaultView", CalendarDefaultView.Days); }
            set { SetPropertyValue("DefaultView", value); }
        }

        // Gets or sets the client script that executes immediately before the calendar is displayed
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("showing")]
        public virtual string OnClientShowing {
            get { return GetPropertyValue("OnClientShowing", String.Empty); }
            set { SetPropertyValue("OnClientShowing", value); }
        }

        // Gets or sets the client script that executes immediately after the calendar is displayed
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("shown")]
        public virtual string OnClientShown {
            get { return GetPropertyValue("OnClientShown", String.Empty); }
            set { SetPropertyValue("OnClientShown", value); }
        }

        // Gets or sets the client script that executes immediately before the calendar is hidden
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hiding")]
        public virtual string OnClientHiding {
            get { return GetPropertyValue("OnClientHiding", String.Empty); }
            set { SetPropertyValue("OnClientHiding", value); }
        }

        // Gets or sets the client script that executes immediately after the calendar is hidden
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hidden")]
        public virtual string OnClientHidden {
            get { return GetPropertyValue("OnClientHidden", String.Empty); }
            set { SetPropertyValue("OnClientHidden", value); }
        }

        // Gets or sets the script that executes when a new date is selected
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("dateSelectionChanged")]
        public virtual string OnClientDateSelectionChanged {
            get { return GetPropertyValue("OnClientDateSelectionChanged", String.Empty); }
            set { SetPropertyValue("OnClientDateSelectionChanged", value); }
        }

        // Gets or sets the property of the start date for range
        [DefaultValue(null)]
        [ExtenderControlProperty]
        [ClientPropertyName("startDate")]
        public DateTime? StartDate {
            get {
                var startDate = GetPropertyValue<DateTime?>("StartDate", null);
                return startDate != null ? (DateTime?)DateTime.SpecifyKind(startDate.Value, DateTimeKind.Utc) : null;
            }
            set {
                SetPropertyValue<DateTime?>("StartDate", value != null ? (DateTime?)DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null);
            }
        }

        // Gets or sets the property of the end date for range
        [DefaultValue(null)]
        [ExtenderControlProperty]
        [ClientPropertyName("endDate")]
        public DateTime? EndDate {
            get {
                var endDate = GetPropertyValue<DateTime?>("EndDate", null);
                return endDate != null ? (DateTime?)DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc) : null;
            }
            set {
                SetPropertyValue<DateTime?>("EndDate", value != null ? (DateTime?)DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null);
            }
        }
    }

}
