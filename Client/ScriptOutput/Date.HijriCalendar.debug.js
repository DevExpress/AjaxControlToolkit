// (c) 2010 CodePlex Foundation
(function() {

function execute() {
Type._registerScript("Date.HijriCalendar.js", ["MicrosoftAjaxGlobalization.js"]);
__cultureInfo.dateTimeFormat.Calendar.convert = {
    ticks1970: 62135596800000,
    monthDays: [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325, 355],
    minDate: -42521673600000,
    maxDate: 253402300799999,
    adjustment: __cultureInfo.dateTimeFormat.Calendar._adjustment || 0,
    toGregorian: function(hyear, hmonth, hday) {
        var daysSinceJan0101 = this.daysToYear(hyear) + this.monthDays[hmonth] + hday - 1 - this.adjustment;
        var gdate = new Date(daysSinceJan0101 * 86400000 - this.ticks1970);
        gdate.setMinutes(gdate.getMinutes() + gdate.getTimezoneOffset());
        return gdate;
    },
    fromGregorian: function(gdate) {
        if ((gdate < this.minDate) || (gdate > this.maxDate)) return null;
        var ticks = this.ticks1970 + (gdate-0) - gdate.getTimezoneOffset() * 60000,
            daysSinceJan0101 = Math.floor(ticks / 86400000) + 1 + this.adjustment;
        var hday, hmonth, hyear = Math.floor(((daysSinceJan0101 - 227013) * 30) / 10631) + 1,
            absDays = this.daysToYear(hyear),
            daysInYear = this.isLeapYear(hyear) ? 355 : 354;
        if (daysSinceJan0101 < absDays) {
            hyear--;
            absDays -= daysInYear;
        }
        else if (daysSinceJan0101 === absDays) {
            hyear--;
            absDays = this.daysToYear(hyear);
        }
        else {
            if (daysSinceJan0101 > (absDays + daysInYear)) {
                absDays += daysInYear;
                hyear++;
            }
        }
        hmonth = 0;
        var daysIntoYear = daysSinceJan0101 - absDays;
        while (hmonth <= 11 && daysIntoYear > this.monthDays[hmonth]) {
            hmonth++;
        }
        hmonth--;
        hday = daysIntoYear - this.monthDays[hmonth];
        return [hyear, hmonth, hday];
    },
    daysToYear: function(year) {
        var yearsToYear30 = Math.floor((year - 1) / 30) * 30,
            yearsInto30 = year - yearsToYear30 - 1,
            days = Math.floor((yearsToYear30 * 10631) / 30) + 227013;
        while (yearsInto30 > 0) {
            days += (this.isLeapYear(yearsInto30) ? 355 : 354);
            yearsInto30--;
        }
        return days;
    },
    isLeapYear: function(year) {
        return ((((year * 11) + 14) % 30) < 11);
    }
}
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("HijriCalendar", null, execute);
}
else {
	execute();
}

})();
