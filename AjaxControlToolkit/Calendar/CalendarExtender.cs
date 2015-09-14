using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.Collections.Generic;
using System.Drawing;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    /// <summary>
    /// The Calendar control extender can be attached to any ASP.NET TextBox control. 
    /// It provides client-side date-picking functionality with a customizable date format and UI in a popup control.
    /// </summary>
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
        /// <summary>
        /// The name of the Cascading Style Sheet class used to style the calendar.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public virtual string CssClass {
            get { return GetPropertyValue("CssClass", String.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        /// <summary>
        /// A format string used to display the selected date.
        /// The default value is d
        /// </summary>
        [DefaultValue("d")]
        [ExtenderControlProperty]
        [ClientPropertyName("format")]
        public virtual string Format {
            get { return GetPropertyValue("Format", "d"); }
            set { SetPropertyValue("Format", value); }
        }

        /// <summary>
        /// A format string used to display today's date. 
        /// The default value is MMMM d, yyyy.
        /// </summary>
        [DefaultValue("MMMM d, yyyy")]
        [ExtenderControlProperty]
        [ClientPropertyName("todaysDateFormat")]
        public virtual string TodaysDateFormat {
            get { return GetPropertyValue("TodaysDateFormat", "MMMM d, yyyy"); }
            set { SetPropertyValue("TodaysDateFormat", value); }
        }

        /// <summary>
        /// A format string used to display the Days Mode Title.
        /// The default value is MMMM, yyyy.
        /// </summary>
        [DefaultValue("MMMM, yyyy")]
        [ExtenderControlProperty]
        [ClientPropertyName("daysModeTitleFormat")]
        public virtual string DaysModeTitleFormat {
            get { return GetPropertyValue("DaysModeTitleFormat", "MMMM, yyyy"); }
            set { SetPropertyValue("DaysModeTitleFormat", value); }
        }

        /// <summary>
        /// Sets whether or not time should be cleared in edited date/time.
        /// The default value is false
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("clearTime")]
        public virtual bool ClearTime {
            get { return GetPropertyValue("ClearTime", false); }
            set { SetPropertyValue("ClearTime", value); }
        }

        /// <summary>
        /// Sets whether or not this behavior is available for the current element.
        /// The default value is true
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("enabled")]
        public virtual bool EnabledOnClient {
            get { return GetPropertyValue("EnabledOnClient", true); }
            set { SetPropertyValue("EnabledOnClient", value); }
        }

        /// <summary>
        /// Sets whether or not changing modes is animated.
        /// The default value is true
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("animated")]
        public virtual bool Animated {
            get { return GetPropertyValue("Animated", true); }
            set { SetPropertyValue("Animated", value); }
        }

        /// <summary>
        /// The first day of the week. 
        /// The default value is Default
        /// </summary>
        [DefaultValue(FirstDayOfWeek.Default)]
        [ExtenderControlProperty]
        [ClientPropertyName("firstDayOfWeek")]
        public virtual FirstDayOfWeek FirstDayOfWeek {
            get { return GetPropertyValue("FirstDayOfWeek", FirstDayOfWeek.Default); }
            set { SetPropertyValue("FirstDayOfWeek", value); }
        }

        /// <summary>
        /// The ID of a control to show the calendar popup when clicked. If this value is not
        /// set, the calendar will pop up when the textbox receives focus.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("button")]
        [ElementReference]
        [IDReferenceProperty]
        public virtual string PopupButtonID {
            get { return GetPropertyValue("PopupButtonID", String.Empty); }
            set { SetPropertyValue("PopupButtonID", value); }
        }

        /// <summary>
        /// The popup position of the calendar. The default value is BottomLeft.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(CalendarPosition.BottomLeft)]
        [Description("Indicates where you want the calendar displayed, bottom or top of the textbox.")]
        public virtual CalendarPosition PopupPosition {
            get { return GetPropertyValue("PopupPosition", CalendarPosition.BottomLeft); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        /// <summary>
        /// The date that the calendar is initialized with.
        /// </summary>
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

        /// <summary>
        /// The default view of the calender. The default value is Days.
        /// </summary>
        [DefaultValue(CalendarDefaultView.Days)]
        [ExtenderControlProperty]
        [ClientPropertyName("defaultView")]
        [Description("Default view of the calendar when it first pops up.")]
        public virtual CalendarDefaultView DefaultView {
            get { return GetPropertyValue("DefaultView", CalendarDefaultView.Days); }
            set { SetPropertyValue("DefaultView", value); }
        }

        /// <summary>
        /// A client script that is executed immediately before the calendar is displayed.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("showing")]
        public virtual string OnClientShowing {
            get { return GetPropertyValue("OnClientShowing", String.Empty); }
            set { SetPropertyValue("OnClientShowing", value); }
        }

        /// <summary>
        /// A client script that is executed immediately after the calendar is displayed.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("shown")]
        public virtual string OnClientShown {
            get { return GetPropertyValue("OnClientShown", String.Empty); }
            set { SetPropertyValue("OnClientShown", value); }
        }

        /// <summary>
        /// A client script that is executed immediately before the calendar is hidden.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hiding")]
        public virtual string OnClientHiding {
            get { return GetPropertyValue("OnClientHiding", String.Empty); }
            set { SetPropertyValue("OnClientHiding", value); }
        }

        /// <summary>
        /// A client script that is executed immediately after the calendar is hidden.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hidden")]
        public virtual string OnClientHidden {
            get { return GetPropertyValue("OnClientHidden", String.Empty); }
            set { SetPropertyValue("OnClientHidden", value); }
        }

        /// <summary>
        /// A script that is executed when a new date is selected.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("dateSelectionChanged")]
        public virtual string OnClientDateSelectionChanged {
            get { return GetPropertyValue("OnClientDateSelectionChanged", String.Empty); }
            set { SetPropertyValue("OnClientDateSelectionChanged", value); }
        }

        /// <summary>
        /// The start date for a range.
        /// </summary>
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

        /// <summary>
        /// The end date for a range.
        /// </summary>
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
