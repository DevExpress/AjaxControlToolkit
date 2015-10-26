using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites {
    public partial class CalendarTests : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            var selectedDate = new DateTime(2015, 1, 1);

            StartDateCalendarExtender.StartDate = new DateTime(2015, 1, 1);
            StartDateCalendarExtender.SelectedDate = selectedDate;

            EndDateCalendarExtender.EndDate = new DateTime(2015, 1, 1);
            EndDateCalendarExtender.SelectedDate = selectedDate;

            BothDatesCalendarExtender.StartDate = new DateTime(2015, 1, 1);
            BothDatesCalendarExtender.EndDate = new DateTime(2015, 2, 2);
            BothDatesCalendarExtender.SelectedDate = selectedDate;

            SelectedDateCalendarExtender.SelectedDate = selectedDate;
        }
    }
}