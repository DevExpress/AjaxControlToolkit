

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

namespace AjaxControlToolkit
{
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
    public class CalendarExtender : ExtenderControlBase
    {
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public virtual string CssClass
        {
            get { return GetPropertyValue("CssClass", string.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        [DefaultValue("d")]
        [ExtenderControlProperty]
        [ClientPropertyName("format")]
        public virtual string Format
        {
            get { return GetPropertyValue("Format", "d"); }
            set { SetPropertyValue("Format", value); }
        }

        [DefaultValue("MMMM d, yyyy")]
        [ExtenderControlProperty]
        [ClientPropertyName("todaysDateFormat")]
        public virtual string TodaysDateFormat
        {
            get { return GetPropertyValue("TodaysDateFormat", "MMMM d, yyyy"); }
            set { SetPropertyValue("TodaysDateFormat", value); }
        }

        [DefaultValue("MMMM, yyyy")]
        [ExtenderControlProperty]
        [ClientPropertyName("daysModeTitleFormat")]
        public virtual string DaysModeTitleFormat
        {
            get { return GetPropertyValue("DaysModeTitleFormat", "MMMM, yyyy"); }
            set { SetPropertyValue("DaysModeTitleFormat", value); }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("clearTime")]
        public virtual bool ClearTime
        {
            get { return GetPropertyValue("ClearTime", false); }
            set { SetPropertyValue("ClearTime", value); }
        }

        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("enabled")]
        public virtual bool EnabledOnClient
        {
            get { return GetPropertyValue("EnabledOnClient", true); }
            set { SetPropertyValue("EnabledOnClient", value); }
        }

        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("animated")]
        public virtual bool Animated
        {
            get { return GetPropertyValue("Animated", true); }
            set { SetPropertyValue("Animated", value); }
        }

        [DefaultValue(FirstDayOfWeek.Default)]
        [ExtenderControlProperty]
        [ClientPropertyName("firstDayOfWeek")]
        public virtual FirstDayOfWeek FirstDayOfWeek
        {
            get { return GetPropertyValue("FirstDayOfWeek", FirstDayOfWeek.Default); }
            set { SetPropertyValue("FirstDayOfWeek", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("button")]
        [ElementReference]
        [IDReferenceProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public virtual string PopupButtonID
        {
            get { return GetPropertyValue("PopupButtonID", string.Empty); }
            set { SetPropertyValue("PopupButtonID", value); }
        }        
        
        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(CalendarPosition.BottomLeft)]
        [Description("Indicates where you want the calendar displayed, bottom or top of the textbox.")]
        public virtual CalendarPosition PopupPosition
        {
            get { return GetPropertyValue("PopupPosition", CalendarPosition.BottomLeft); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        [DefaultValue(null)]
        [ExtenderControlProperty]
        [ClientPropertyName("selectedDate")]
        public DateTime? SelectedDate
        {
            get { return GetPropertyValue<DateTime?>("SelectedDate", null); }
            set { SetPropertyValue<DateTime?>("SelectedDate", value); }
        }

        [DefaultValue(CalendarDefaultView.Days)]
        [ExtenderControlProperty]
        [ClientPropertyName("defaultView")]
        [Description("Default view of the calendar when it first pops up.")]
        public virtual CalendarDefaultView DefaultView
        {
            get { return GetPropertyValue("DefaultView", CalendarDefaultView.Days); }
            set { SetPropertyValue("DefaultView", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("showing")]
        public virtual string OnClientShowing
        {
            get { return GetPropertyValue("OnClientShowing", string.Empty); }
            set { SetPropertyValue("OnClientShowing", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("shown")]
        public virtual string OnClientShown
        {
            get { return GetPropertyValue("OnClientShown", string.Empty); }
            set { SetPropertyValue("OnClientShown", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hiding")]
        public virtual string OnClientHiding
        {
            get { return GetPropertyValue("OnClientHiding", string.Empty); }
            set { SetPropertyValue("OnClientHiding", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hidden")]
        public virtual string OnClientHidden
        {
            get { return GetPropertyValue("OnClientHidden", string.Empty); }
            set { SetPropertyValue("OnClientHidden", value); }
        }

        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("dateSelectionChanged")]
        public virtual string OnClientDateSelectionChanged
        {
            get { return GetPropertyValue("OnClientDateSelectionChanged", string.Empty); }
            set { SetPropertyValue("OnClientDateSelectionChanged", value); }
        }
    }
}