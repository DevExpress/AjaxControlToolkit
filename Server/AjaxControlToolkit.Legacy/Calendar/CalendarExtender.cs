

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;
using AjaxControlToolkit;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("Calendar.CalendarBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Calendar.CalendarBehavior.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Calendar.Calendar_resource.css", "text/css", PerformSubstitution = true)]
[assembly: System.Web.UI.WebResource("Calendar.arrow-left.gif", "image/gif")]
[assembly: System.Web.UI.WebResource("Calendar.arrow-right.gif", "image/gif")]

#endregion

namespace AjaxControlToolkit {
    /// <summary>
    /// The Calendar control extender can be attached to any ASP.NET TextBox control. It provides client-side 
    /// date-picking functionality with customizable date format and UI in a popup control. You can interact 
    /// with the calendar by clicking on a day to set the date, or the "Today" link to set the current date. 
    /// 
    /// In addition, the left and right arrows can be used to move forward or back a month. 
    /// By clicking on the title of the calendar you can change the view from Days in the current month, 
    /// to Months in the current year. Another click will switch to Years in the current Decade. 
    /// This action allows you to easily jump to dates in the past or the future from within 
    /// the calendar control. 
    /// </summary>
    [Designer("AjaxControlToolkit.CalendarDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(DateTimeScripts), 1)]
    [RequiredScript(typeof(PopupExtender), 2)]
    [RequiredScript(typeof(AnimationScripts), 3)]
    [RequiredScript(typeof(ThreadingScripts), 4)]
    [TargetControlType(typeof(TextBox))]
    [ClientCssResource("Calendar.Calendar_resource.css")]
    [ClientScriptResource("Sys.Extended.UI.CalendarBehavior", "Calendar.CalendarBehavior.js")]
    [System.Drawing.ToolboxBitmap(typeof(CalendarExtender), "Calendar.Calendar.ico")]
    public class CalendarExtender : ExtenderControlBase {
        /// <summary>
        /// Name of the Cascading Style Sheet class used to style the calendar 
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public virtual string CssClass {
            get { return GetPropertyValue("CssClass", string.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        /// <summary>
        /// Format string used to display the selected date. The default value is "d"
        /// </summary>
        [DefaultValue("d")]
        [ExtenderControlProperty]
        [ClientPropertyName("format")]
        public virtual string Format {
            get { return GetPropertyValue("Format", "d"); }
            set { SetPropertyValue("Format", value); }
        }

        /// <summary>
        /// Format string used to display today's date. The default value is "MMMM d, yyyy"
        /// </summary>
        [DefaultValue("MMMM d, yyyy")]
        [ExtenderControlProperty]
        [ClientPropertyName("todaysDateFormat")]
        public virtual string TodaysDateFormat {
            get { return GetPropertyValue("TodaysDateFormat", "MMMM d, yyyy"); }
            set { SetPropertyValue("TodaysDateFormat", value); }
        }

        /// <summary>
        /// Format string used to display Days Mode Title. The default value is "MMMM, yyyy"
        /// </summary>
        [DefaultValue("MMMM, yyyy")]
        [ExtenderControlProperty]
        [ClientPropertyName("daysModeTitleFormat")]
        public virtual string DaysModeTitleFormat {
            get { return GetPropertyValue("DaysModeTitleFormat", "MMMM, yyyy"); }
            set { SetPropertyValue("DaysModeTitleFormat", value); }
        }

        /// <summary>
        /// Whether time should be cleared in edited date/time
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("clearTime")]
        public virtual bool ClearTime {
            get { return GetPropertyValue("ClearTime", false); }
            set { SetPropertyValue("ClearTime", value); }
        }

        /// <summary>
        /// Whether this behavior is available for the current element
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("enabled")]
        public virtual bool EnabledOnClient {
            get { return GetPropertyValue("EnabledOnClient", true); }
            set { SetPropertyValue("EnabledOnClient", value); }
        }

        /// <summary>
        /// Whether changing modes is animated
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("animated")]
        public virtual bool Animated {
            get { return GetPropertyValue("Animated", true); }
            set { SetPropertyValue("Animated", value); }
        }

        /// <summary>
        /// Gets or sets the first day of week
        /// </summary>
        [DefaultValue(FirstDayOfWeek.Default)]
        [ExtenderControlProperty]
        [ClientPropertyName("firstDayOfWeek")]
        public virtual FirstDayOfWeek FirstDayOfWeek {
            get { return GetPropertyValue("FirstDayOfWeek", FirstDayOfWeek.Default); }
            set { SetPropertyValue("FirstDayOfWeek", value); }
        }

        /// <summary>
        /// The ID of a control to show the calendar popup when clicked. If this value is not set, the calendar will pop up when the textbox receives focus
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("button")]
        [ElementReference]
        [IDReferenceProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public virtual string PopupButtonID {
            get { return GetPropertyValue("PopupButtonID", string.Empty); }
            set { SetPropertyValue("PopupButtonID", value); }
        }

        /// <summary>
        /// Gets or sets the popup position of the calendar. The default value is BottomLeft
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
        /// Gets or sets the date that the calendar is initialized with
        /// </summary>
        [DefaultValue(null)]
        [ExtenderControlProperty]
        [ClientPropertyName("selectedDate")]
        public DateTime? SelectedDate {
            get {
                DateTime? selectedDate = GetPropertyValue<DateTime?>("SelectedDate", null);
                return selectedDate != null ? (DateTime?)DateTime.SpecifyKind(selectedDate.Value, DateTimeKind.Utc) : null;
            }
            set {
                var utcValue = value != null ? (DateTime?)DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null;
                SetPropertyValue<DateTime?>("SelectedDate", utcValue);
            }

        }

        /// <summary>
        /// Gets or sets the default view of the calender. The default value is Days.
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
        /// Gets or sets the client script that executes immediately before the calendar is displayed
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("showing")]
        public virtual string OnClientShowing {
            get { return GetPropertyValue("OnClientShowing", string.Empty); }
            set { SetPropertyValue("OnClientShowing", value); }
        }

        /// <summary>
        /// Gets or sets the client script that executes immediately after the calendar is displayed
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("shown")]
        public virtual string OnClientShown {
            get { return GetPropertyValue("OnClientShown", string.Empty); }
            set { SetPropertyValue("OnClientShown", value); }
        }

        /// <summary>
        /// Gets or sets the client script that executes immediately before the calendar is hidden
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hiding")]
        public virtual string OnClientHiding {
            get { return GetPropertyValue("OnClientHiding", string.Empty); }
            set { SetPropertyValue("OnClientHiding", value); }
        }

        /// <summary>
        /// Gets or sets the client script that executes immediately after the calendar is hidden
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hidden")]
        public virtual string OnClientHidden {
            get { return GetPropertyValue("OnClientHidden", string.Empty); }
            set { SetPropertyValue("OnClientHidden", value); }
        }

        /// <summary>
        /// Gets or sets the script that executes when a new date is selected
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("dateSelectionChanged")]
        public virtual string OnClientDateSelectionChanged {
            get { return GetPropertyValue("OnClientDateSelectionChanged", string.Empty); }
            set { SetPropertyValue("OnClientDateSelectionChanged", value); }
        }

        //Issue#8109


        /// <summary>
        /// Gets or sets the property of the start date for range
        /// </summary>
        [DefaultValue(null)]
        [ExtenderControlProperty]
        [ClientPropertyName("startDate")]
        public DateTime? StartDate {
            get {
                DateTime? startDate = GetPropertyValue<DateTime?>("StartDate", null);
                return startDate != null ? (DateTime?)DateTime.SpecifyKind(startDate.Value, DateTimeKind.Utc) : null;
            }
            set {
                SetPropertyValue<DateTime?>("StartDate", value != null ? (DateTime?)DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null);
            }
        }

        /// <summary>
        /// Gets or sets the property of the end date for range
        /// </summary>
        [DefaultValue(null)]
        [ExtenderControlProperty]
        [ClientPropertyName("endDate")]
        public DateTime? EndDate {
            get {
                DateTime? endDate = GetPropertyValue<DateTime?>("EndDate", null);
                return endDate != null ? (DateTime?)DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc) : null;
            }
            set {
                SetPropertyValue<DateTime?>("EndDate", value != null ? (DateTime?)DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null);
            }
        }


    }
}