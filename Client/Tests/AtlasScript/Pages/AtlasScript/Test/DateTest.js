/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.DateTest = function() {
}
AtlasScript.Test.DateTest.prototype = {

    tearDown: function() {
        Date.getTimezoneOffset = AtlasScript.Test.DateTest._tzOffsetFunction;
        Sys.CultureInfo.CurrentCulture.dateTimeFormat.Calendar.convert = null;
    },

    testIsClass: function() {
        AtlasUnit.Assert.isTrue(Type.isClass(Date));
    },

    testFormat: function() {
        this._runTests("format", function(culture, test, testNum) {
            var date = new Date(test.date + AtlasScript.Test.DateTest._tzOffsetMS);
            // specific culture tests.
            var actual = date.localeFormat(test.format);
            AtlasUnit.Assert.areEqual(test.expect, actual, "Date.localeFormat failed for " + culture + " #" + testNum);
            actual = String.localeFormat("{0:" + test.format + "}", date);
            AtlasUnit.Assert.areEqual(test.expect, actual, "String.localeFormat failed for " + culture + " #" + testNum);
            // invariant culture tests.
            if (!culture.length) {
                actual = date.format(test.format);
                AtlasUnit.Assert.areEqual(test.expect, actual, "Date.format failed for " + culture + " #" + testNum);
                actual = String.format("{0:" + test.format + "}", date);
                AtlasUnit.Assert.areEqual(test.expect, actual, "String.format failed for " + culture + " #" + testNum);
            }
        });
    },

    testFormatTimezone: function() {
        // current timezone.
        var date = new Date();
        var expectedSign = (date.getTimezoneOffset() <= 0)? "+" : "-";
        var expectedHours = Math.floor(Math.abs(date.getTimezoneOffset() / 60));
        var tzFormat = date.format("xz");// single digit 'z' format is invalid.
        AtlasUnit.Assert.areEqual(expectedSign, tzFormat.charAt(1), "Timezone(z) sign is reversed.");
        AtlasUnit.Assert.areEqual(expectedHours, parseInt(tzFormat.substring(2)), "Timezone(z) hours are incorrect.");
        tzFormat = date.format("zz");
        AtlasUnit.Assert.areEqual(expectedSign, tzFormat.charAt(0), "Timezone(zz) sign is reversed.");
        // strip the leading '0' since parseInt might treat this as octal.
        var actualHours = parseInt((tzFormat.charAt(1) === '0')? tzFormat.substring(2) : tzFormat.substring(1));
        AtlasUnit.Assert.areEqual(expectedHours, actualHours, "Timezone(zz) hours are incorrect.");
        tzFormat = date.format("zzz");
        AtlasUnit.Assert.areEqual(expectedSign, tzFormat.charAt(0), "Timezone(zzz) sign is reversed.");

        // positive timezone.
        date.getTimezoneOffset = function() { return 300; }
        AtlasUnit.Assert.areEqual("x-5", date.format("xz"), "Timezone(z) should be negative");
        AtlasUnit.Assert.areEqual("-05", date.format("zz"), "Timezone(zz) should be negative");
        AtlasUnit.Assert.areEqual("-05:00", date.format("zzz"), "Timezone(zzz) should be negative");

        // negative timezone.
        date.getTimezoneOffset = function() { return -300; }
        AtlasUnit.Assert.areEqual("x+5", date.format("xz"), "Timezone(z) should be positive");
        AtlasUnit.Assert.areEqual("+05", date.format("zz"), "Timezone(zz) should be positive");
        AtlasUnit.Assert.areEqual("+05:00", date.format("zzz"), "Timezone(zzz) should be positive");
    },

    testParse: function() {
        this._runTests("parse", function(culture, test, testNum) {
            var parseAssert = function(actual) {
                if (actual === null) {
                    AtlasUnit.Assert.isNull(test.expect, "Date.parse failed for " + culture + " #" + testNum);
                }
                else {
                    // DevDiv Bugs 103805: timezoneOffset is not constant due to daylight savings time,
                    // so always base it on the date in question, not the constant which used to be created from a blank date.
                    var actualMS = actual.getTime() - actual.getTimezoneOffset() * 60000;
                    AtlasUnit.Assert.instanceOfType(Date, actual, "Date.parse did not return Date type for " + culture + " #" + testNum);
                    AtlasUnit.Assert.areEqual(test.expect, actualMS, "Date.parse failed for " + culture + " #" + testNum);
                }
            };
            parseAssert(Date.parseLocale(test.value, test.format));
            // parse should only be tested against invariant culture.
            if (!culture.length) {
                parseAssert(Date.parseInvariant(test.value, test.format));
            }
        });
    },

    testHijriCalendar: function() {
        Sys.CultureInfo.CurrentCulture.dateTimeFormat.Calendar.convert = __hijriConvert;
        var dates = [
        // year, month-zero-based, day of month, expected gregorian date
        // a public conversion tool available at: http://www.rabiah.com/convert/convert.php3
        // however it may be off by 1 day compared to the server HijriCalendar implementation
            [1, 0, 1, "0622/07/18"], // min date
            [9666, 3, 3, "9999/12/31"], // max date
            [1429, 0, 1, "2008/01/09"], // first day of a year
            [1429, 11, 29, "2008/12/27"], // last day of a year
            [3001, 0, 1, "3533/03/19"], // first day of a 30 year cycle
            [3001, 11, 29, "3534/03/07"], // last day of a 30 year cycle
            [3002, 5, 15, "3534/08/17"], // random day in a leap year
            [3002, 11, 30, "3535/02/25"], // a leap day
            [3003, 0, 1, "3535/02/26"] // day after leap day
        ];
        for (var i = 0; i < dates.length; i++) {
            var date = dates[i],
                hijriDateString = date[0].format("D4") + "/" + (date[1] + 1).format("D2") + "/" + date[2].format("D2"),
                expectedGregorianDate = Date.parseInvariant(date[3], "yyyy/MM/dd"),
                actualGregorianDate = Date.parseLocale(hijriDateString, "yyyy/MM/dd");
            AtlasUnit.Assert.isNotNull(expectedGregorianDate, "Test failure in test #" + i + ", the expected date couldn't be parsed.");
            AtlasUnit.Assert.isNotNull(actualGregorianDate, "Test failure in test #" + i + ", the actual date couldn't be parsed, expected gregorian date " + expectedGregorianDate.toString());
            AtlasUnit.Assert.areEqual(expectedGregorianDate.toString(), actualGregorianDate.toString(), "Incorrect to-gregorian conversion in test #" + i);
            // format back to hijri to test opposite conversion
            var hijriFormatted = actualGregorianDate.localeFormat("yyyy/MM/dd");
            AtlasUnit.Assert.areEqual(hijriDateString, hijriFormatted, "Incorrect to-hijri conversion in test #" + i);
        }
    },

    testUmAlQuraCalendar: function() {
        Sys.CultureInfo.CurrentCulture.dateTimeFormat.Calendar.convert = __umAlQuraConvert;
        var dates = [
        // year, month-zero-based, day of month, expected gregorian date
            [1318, 0, 1, "1900/04/30"], // min date
            [1450, 11, 29, "2029/05/13"], // max date
            [1401, 0, 1, "1980/11/08"], // first day of a year
            [1401, 11, 29, "1981/10/27"], // last day of a year
            [1408, 5, 15, "1988/02/03"], // random day in a leap year
            [1408, 11, 30, "1988/08/12"], // a leap day
            [1409, 0, 1, "1988/08/13"] // day after leap day
        ];
        for (var i = 0; i < dates.length; i++) {
            var date = dates[i],
                umAlDateString = date[0].format("D4") + "/" + (date[1] + 1).format("D2") + "/" + date[2].format("D2"),
                expectedGregorianDate = Date.parseInvariant(date[3], "yyyy/MM/dd"),
                actualGregorianDate = Date.parseLocale(umAlDateString, "yyyy/MM/dd");
            AtlasUnit.Assert.isNotNull(expectedGregorianDate, "Test failure in test #" + i + ", the expected date couldn't be parsed.");
            AtlasUnit.Assert.isNotNull(actualGregorianDate, "Test failure in test #" + i + ", the actual date couldn't be parsed, expected gregorian date " + expectedGregorianDate.toString());
            AtlasUnit.Assert.areEqual(expectedGregorianDate.toString(), actualGregorianDate.toString(), "Incorrect to-gregorian conversion in test #" + i);
            // format back to UmAlQura to test opposite conversion
            var umAlFormatted = actualGregorianDate.localeFormat("yyyy/MM/dd");
            AtlasUnit.Assert.areEqual(umAlDateString, umAlFormatted, "Incorrect to-UmAlQura conversion in test #" + i);
        }
    },

    testTypeName: function() {
        AtlasUnit.Assert.areEqual("Date", Object.getTypeName(new Date()));
    },

    _runTests: function(name, caseHandler) {
        var currentCulture = Sys.CultureInfo.CurrentCulture;
        var cultures = AtlasScript.Test.DateTest.tests.cultures;
        var suite = AtlasScript.Test.DateTest.tests[name];
        for (var i = 0, il = cultures.length; i < il; i++) {
            Sys.CultureInfo.CurrentCulture = cultures[i];
            var culture = (cultures[i].name.length > 0) ? cultures[i].name : "invariant";
            var cases = suite[Sys.CultureInfo.CurrentCulture.name];
            if (!cases) continue;
            for (var j = 0, jl = cases.length; j < jl; j++) {
                var error = cases[j].error;
                var testNum = j + 1;
                try {
                    caseHandler(culture, cases[j], testNum);
                    if (error) {
                        AtlasUnit.Assert.fail("Expected error on " + name + " for " + culture + " #" + testNum);
                    }
                }
                catch (e) {
                    if (!error) {
                        e.message += " (" + culture + " #" + testNum + ")";
                        throw e;
                    }
                    AtlasUnit.Assert.areEqual(error, e.message, "Invalid " + name + " error message for " + culture + " #" + testNum);
                }
            }
        }
        Sys.CultureInfo.CurrentCulture = currentCulture;
    }
}

AtlasScript.Test.DateTest._dateParseValueCalculator = function(date, month, year) {
    var defaultDate = new Date(), parsedDate;
    defaultDate.setDate((date === null) ? 1 : date);
    defaultDate.setMonth((month === null) ? 0 : month - 1); // setMonth takes in value from 0-11 for Jan-Dec
    if (year !== null) {
        defaultDate.setYear(year);
    }
    
    parsedDate = Date.parseInvariant(defaultDate.format('d'));
    return parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000;
}

// Save Date.getTimezoneOffset so it can be reset.
AtlasScript.Test.DateTest._tzOffsetFunction = Date.getTimezoneOffset;
// tzOffsetMS is required for format and parse tests in order to translate the results
// into UTC time so that they can pass in any timezone.
// DevDiv Bugs 103805: timezone offset is not constant, so this is the offset for non DST. (January is never DST, anywhere)
AtlasScript.Test.DateTest._tzOffsetMS = new Date("1/1/1970").getTimezoneOffset() * 60000;
AtlasScript.Test.DateTest.tests = {
    // The default culture infos in CultureInfo.js contain only ascii because it is
    // appended to the MicrosoftAjax.js script which gets crunched as ascii.  However,
    // these test cultures can include non-ascii characters.
    cultures: [ Sys.CultureInfo.InvariantCulture,
                Sys.CultureInfo._parse({"name":"en-US","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy","ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":false,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]},"eras":[1, "A.D.",null,0]}),
                Sys.CultureInfo._parse({"name":"sv-SE","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":",","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":".","CurrencySymbol":"kr","NaNSymbol":"NaN","CurrencyNegativePattern":8,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-INF","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":",","NumberGroupSeparator":" ","CurrencyPositivePattern":3,"PositiveInfinitySymbol":"INF","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":",","PercentGroupSeparator":" ","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"-","FirstDayOfWeek":1,"CalendarWeekRule":2,"FullDateTimePattern":"\'den \'d MMMM yyyy HH:mm:ss","LongDatePattern":"\'den \'d MMMM yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"\'den \'d MMMM","PMDesignator":"","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"yyyy-MM-dd","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM yyyy","AbbreviatedDayNames":["sö","må","ti","on","to","fr","lö"],"ShortestDayNames":["sö","må","ti","on","to","fr","lö"],"DayNames":["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"],"AbbreviatedMonthNames":["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec",""],"MonthNames":["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december",""],"IsReadOnly":false,"NativeCalendarName":"gregoriansk kalender","AbbreviatedMonthGenitiveNames":["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec",""],"MonthGenitiveNames":["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december",""]},"eras":[1, "A.D.",null,0]}),
                Sys.CultureInfo._parse({"name":"he-IL","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"₪","NaNSymbol":"לא מספר","CurrencyNegativePattern":2,"NumberNegativePattern":1,"PercentPositivePattern":1,"PercentNegativePattern":1,"NegativeInfinitySymbol":"אינסוף שלילי","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":2,"PositiveInfinitySymbol":"אינסוף חיובי","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd dd MMMM yyyy HH:mm:ss","LongDatePattern":"dddd dd MMMM yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"dd MMMM","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"dd/MM/yyyy","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM yyyy","AbbreviatedDayNames":["יום א","יום ב","יום ג","יום ד","יום ה","יום ו","שבת"],"ShortestDayNames":["א","ב","ג","ד","ה","ו","ש"],"DayNames":["יום ראשון","יום שני","יום שלישי","יום רביעי","יום חמישי","יום שישי","שבת"],"AbbreviatedMonthNames":["ינו","פבר","מרץ","אפר","מאי","יונ","יול","אוג","ספט","אוק","נוב","דצמ",""],"MonthNames":["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר",""],"IsReadOnly":false,"NativeCalendarName":"לוח שנה גרגוריאני","AbbreviatedMonthGenitiveNames":["ינו","פבר","מרץ","אפר","מאי","יונ","יול","אוג","ספט","אוק","נוב","דצמ",""],"MonthGenitiveNames":["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר",""]},"eras":[1,"לספירה",null,0]}),
                Sys.CultureInfo._parse({"name":"tr-TR","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":",","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":".","CurrencySymbol":"YTL","NaNSymbol":"NaN","CurrencyNegativePattern":8,"NumberNegativePattern":1,"PercentPositivePattern":2,"PercentNegativePattern":2,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":",","NumberGroupSeparator":".","CurrencyPositivePattern":3,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":",","PercentGroupSeparator":".","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":".","FirstDayOfWeek":1,"CalendarWeekRule":0,"FullDateTimePattern":"dd MMMM yyyy dddd HH:mm:ss","LongDatePattern":"dd MMMM yyyy dddd","LongTimePattern":"HH:mm:ss","MonthDayPattern":"dd MMMM","PMDesignator":"","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"dd.MM.yyyy","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM yyyy","AbbreviatedDayNames":["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"],"ShortestDayNames":["Pz","Pt","Sa","Ça","Pe","Cu","Ct"],"DayNames":["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],"AbbreviatedMonthNames":["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",""],"MonthNames":["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",""],"IsReadOnly":false,"NativeCalendarName":"Gregoryen Takvimi","AbbreviatedMonthGenitiveNames":["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",""],"MonthGenitiveNames":["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",""]},"eras":[1,"A.D.",null,0]}),
                Sys.CultureInfo._parse({"name":"th-TH","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":true,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"฿","NaNSymbol":"NaN","CurrencyNegativePattern":1,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["๐","๑","๒","๓","๔","๕","๖","๗","๘","๙"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"\/Date(-62135568000000)\/","MaxSupportedDateTime":"\/Date(253402300799999)\/","AlgorithmType":1,"Eras":[1],"TwoDigitYearMax":2572,"IsReadOnly":true},"DateSeparator":"/","FirstDayOfWeek":1,"CalendarWeekRule":0,"FullDateTimePattern":"d MMMM yyyy H:mm:ss","LongDatePattern":"d MMMM yyyy","LongTimePattern":"H:mm:ss","MonthDayPattern":"dd MMMM","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\u0027:\u0027mm\u0027:\u0027ss \u0027GMT\u0027","ShortDatePattern":"d/M/yyyy","ShortTimePattern":"H:mm","SortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd HH\u0027:\u0027mm\u0027:\u0027ss\u0027Z\u0027","YearMonthPattern":"MMMM yyyy","AbbreviatedDayNames":["อา.","จ.","อ.","พ.","พฤ.","ศ.","ส."],"ShortestDayNames":["อ","จ","อ","พ","พ","ศ","ส"],"DayNames":["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"],"AbbreviatedMonthNames":["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.",""],"MonthNames":["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",""],"IsReadOnly":true,"NativeCalendarName":"พุทธศักราช","AbbreviatedMonthGenitiveNames":["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.",""],"MonthGenitiveNames":["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",""]},"eras":[1,"พ.ศ.",null,-543]}),
                Sys.CultureInfo._parse({"name":"ja-JP","numberFormat":{"CurrencyDecimalDigits":0,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"¥","NaNSymbol":"NaN (非数値)","CurrencyNegativePattern":1,"NumberNegativePattern":1,"PercentPositivePattern":1,"PercentNegativePattern":1,"NegativeInfinitySymbol":"-∞","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"+∞","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"午前","Calendar":{"MinSupportedDateTime":"\/Date(-3197120400000)\/","MaxSupportedDateTime":"\/Date(253402300799999)\/","AlgorithmType":1,"Eras":[4,3,2,1],"TwoDigitYearMax":99,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027 H:mm:ss","LongDatePattern":"gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027","LongTimePattern":"H:mm:ss","MonthDayPattern":"M\u0027月\u0027d\u0027日\u0027","PMDesignator":"午後","RFC1123Pattern":"ddd, dd MMM yyyy HH\u0027:\u0027mm\u0027:\u0027ss \u0027GMT\u0027","ShortDatePattern":"gg y/M/d","ShortTimePattern":"H:mm","SortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd HH\u0027:\u0027mm\u0027:\u0027ss\u0027Z\u0027","YearMonthPattern":"gg y\u0027年\u0027M\u0027月\u0027","AbbreviatedDayNames":["日","月","火","水","木","金","土"],"ShortestDayNames":["日","月","火","水","木","金","土"],"DayNames":["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],"AbbreviatedMonthNames":["1","2","3","4","5","6","7","8","9","10","11","12",""],"MonthNames":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月",""],"IsReadOnly":false,"NativeCalendarName":"和暦","AbbreviatedMonthGenitiveNames":["1","2","3","4","5","6","7","8","9","10","11","12",""],"MonthGenitiveNames":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月",""]},"eras":[4,"平成",60022080000,1988,3,"昭和",-1357603200000,1925,2,"大正",-1812153600000,1911,1,"明治",null,1867]}),
                Sys.CultureInfo._parse({"name":"pt-PT","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":",","IsReadOnly":true,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":".","CurrencySymbol":"€","NaNSymbol":"NaN (Não é um número)","CurrencyNegativePattern":8,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinito","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":",","NumberGroupSeparator":".","CurrencyPositivePattern":3,"PositiveInfinitySymbol":"+Infinito","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":",","PercentGroupSeparator":".","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"","Calendar":{"MinSupportedDateTime":"\/Date(-62135568000000)\/","MaxSupportedDateTime":"\/Date(253402300799999)\/","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":true},"DateSeparator":"-","FirstDayOfWeek":1,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, d\u0027 de \u0027MMMM\u0027 de \u0027yyyy HH:mm:ss","LongDatePattern":"dddd, d\u0027 de \u0027MMMM\u0027 de \u0027yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"d/M","PMDesignator":"","RFC1123Pattern":"ddd, dd MMM yyyy HH\u0027:\u0027mm\u0027:\u0027ss \u0027GMT\u0027","ShortDatePattern":"dd-MM-yyyy","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd HH\u0027:\u0027mm\u0027:\u0027ss\u0027Z\u0027","YearMonthPattern":"MMMM\u0027 de \u0027yyyy","AbbreviatedDayNames":["dom","seg","ter","qua","qui","sex","sáb"],"ShortestDayNames":["D","S","T","Q","Q","S","S"],"DayNames":["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"],"AbbreviatedMonthNames":["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez",""],"MonthNames":["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",""],"IsReadOnly":true,"NativeCalendarName":"Calendário gregoriano","AbbreviatedMonthGenitiveNames":["GenJan","GenFev","GenMar","GenAbr","GenMai","GenJun","GenJul","GenAgo","GenSet","GenOut","GenNov","GenDez",""],"MonthGenitiveNames":["GenJaneiro","GenFevereiro","GenMarço","GenAbril","GenMaio","GenJunho","GenJulho","GenAgosto","GenSetembro","GenOutubro","GenNovembro","GenDezembro",""]},"eras":[1,"A.D.",null,0]})
                ],
    format: { '':      [ { date: 0, format: 'D',                     expect: 'Thursday, 01 January 1970' },
                         { date: 0, format: 'd',                     expect: '01/01/1970' },
                         { date: 0, format: 't',                     expect: '00:00' },
                         { date: 0, format: 'F',                     expect: 'Thursday, 01 January 1970 00:00:00' },
                         { date: 0, format: '%d',                    expect:  '1' },
                         { date: 0, format: 'X',                     error:  'Sys.FormatException: Input string was not in a correct format.' },
                         { date: 0, format: 'gg',                    expect: 'A.D.'} ],
              'en-US': [ { date: 0, format: 'D',                     expect: 'Thursday, January 01, 1970' },
                         { date: 0, format: 't',                     expect: '12:00 AM' },
                         { date: 0, format: 'T',                     expect: '12:00:00 AM' },
                         { date: 0, format: 'F',                     expect: 'Thursday, January 01, 1970 12:00:00 AM' },
                         { date: 0, format: 'f',                     expect: 'Thursday, January 01, 1970 12:00 AM' },
                         { date: 0, format: 'M',                     expect: 'January 01' },
                         { date: 0, format: 's',                     expect: '1970-01-01T00:00:00' },
                         { date: 0, format: 'Y',                     expect: 'January, 1970' },
                         { date: 0, format: '',                      expect: new Date(AtlasScript.Test.DateTest._tzOffsetMS).toLocaleString() },
                         { date: 0, format: 'MM/dd/yy',              expect: '01/01/70' },
                         { date: -57600000, format: 'ddd MMMM yyyy', expect: 'Wed December 1969' },
                         { date: 0, format: 'hh:mm:ss tt',           expect: '12:00:00 AM' },
                         { date: 0, format: 'h:mm:ss',               expect: '12:00:00' },
                         { date: 0, format: 'HH:mm:ss fff',          expect: '00:00:00 000' },
                         { date: 0, format: "'hh' 'hh' \\'hh\\'",    expect: "hh hh '12'" },
                         { date: 0, format: "MM/dd/yyyy g",         expect: "01/01/1970 A.D." },
                         { date: 0, format: "MM/dd/yyyy gg",         expect: "01/01/1970 A.D." } ],
              'sv-SE': [ { date: 0, format: 'F',                     expect: 'den 1 januari 1970 00:00:00' },
                         { date: 0, format: 'f',                     expect: 'den 1 januari 1970 00:00' },
                         { date: -57600000, format: 'd',             expect: '1969-12-31' },
                         { date: 0, format: 'MM/dd/yyyy gg',         expect: '01-01-1970 A.D.' } ],
              'th-TH': [ { date: 0, format: 'F',                     expect: '1 มกราคม 2513 0:00:00' },
                         { date: 0, format: 'f',                     expect: '1 มกราคม 2513 0:00' },
                         { date: 0, format: 's',                     expect: '1970-01-01T00:00:00' },
                         { date: 0, format: 'MM/dd/yyyy gg',         expect: '01/01/2513 พ.ศ.' } ],
              'ja-JP': [ { date: -3218832000000, format: 'gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027', expect: '明治 1年1月1日' },
                         { date: -1812153600000, format: 'gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027', expect: '大正 1年7月30日' },
                         { date: -1357603200000, format: 'gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027', expect: '昭和 1年12月25日' },
                         { date: 600220800000, format: 'gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027',   expect: '平成 1年1月8日' },
                         { date: -3218832000000, format: 'MM/dd/yy gg',   expect: '01/01/01 明治' } ],
              'pt-PT': [ { date: 0, format: 'MM/dd/yyyy', expect: '01-01-1970' },
                         { date: 0, format: 'MMM dd', expect: 'GenJan 01' },
                         { date: 0, format: 'd MMM', expect: '1 GenJan' },
                         { date: 0, format: 'd MMMM', expect: '1 GenJaneiro' },
                         { date: 0, format: 'ddd MMM', expect: 'qui Jan' },
                         { date: 0, format: 'MMMM dd', expect: 'GenJaneiro 01' },
                         { date: 0, format: 'MMMM dd MMMM', expect: 'GenJaneiro 01 GenJaneiro' },
                         { date: 0, format: 'MMMM ddd MMMM', expect: 'Janeiro qui Janeiro' }
                       ] },
    parse:  { '':      [ { value: 'Wednesday, 31 December 1969',         expect: -86400000 },
                         { value: '1/1/2006',                            expect: 1136073600000 },
                         // DevDiv Bugs 103805: TimeZone offset is not constant, but we know these dates are not in DST.
                         { value: '1/1/1970 -5',                         expect: -(AtlasScript.Test.DateTest._tzOffsetMS + (-5*3600000)), format: 'M/d/yyyy z' },
                         { value: '1/1/1970 +05',                        expect: -(AtlasScript.Test.DateTest._tzOffsetMS + (5*3600000)), format: 'M/d/yyyy zz' },
                         { value: '1/1/1970 +05:30',                     expect: -(AtlasScript.Test.DateTest._tzOffsetMS + (5.5*3600000)), format: 'M/d/yyyy zzz' },
                         { value: 'thursday, 1 january 1970 00:00:00',   expect: 0, format: 'F' },
                         { value: 'thursday, 1 january 70 A.D. 00:00:00',expect: 0, format: 'dddd, d MMMM yy gg HH:mm:ss' },
                         { value: 'thursday, 1 january 70 B.C. 00:00:00',expect: null, format: 'dddd, d MMMM yy gg HH:mm:ss' }, // B.C. is not a supported era in .net
                         { value: '02/2009', expect: AtlasScript.Test.DateTest._dateParseValueCalculator(null, 2, 2009), format: 'MM/yyyy' },
                         { value: '02/2009', expect: AtlasScript.Test.DateTest._dateParseValueCalculator(2, null, 2009), format: 'dd/yyyy' },
                         { value: '02/09', expect: AtlasScript.Test.DateTest._dateParseValueCalculator(2, 9, null), format: 'dd/MM' },
                         { value: '02', expect: AtlasScript.Test.DateTest._dateParseValueCalculator(2, null, null), format: 'dd' },
                         { value: '09', expect: AtlasScript.Test.DateTest._dateParseValueCalculator(null, 9, null), format: 'MM' },
                         { value: '2009', expect: AtlasScript.Test.DateTest._dateParseValueCalculator(null, null, 2009), format: 'yyyy' },
                             // DevDiv Bugs 103805: Use current timezone offset, which may vary with DST
                         { value: '00:00:00',                            expect: AtlasScript.Test.DateTest._dateParseValueCalculator(null, null, null)}],
              'en-US': [ { value: 'wednesday, december 31, 1969',        expect: -86400000 },
                         { value: 'Thursday, January 1, 1970 4:00:00 PM',expect: 57600000, format: 'F' },
                         { value: '12/31/1969',                          expect: -86400000 },
                         { value: '1970-1-1T00:00:00',                   expect: 0 },
                         { value: '2-27-2007',                           expect: 1172534400000, format: 'M-d-yyyy' },
                         { value: '^1970.1.1.00.00.00$',                 expect: 0, format: '^yyyy.MM.dd.hh.mm.ss$' },
                         { value: '',                                    expect: null },
                         { value: 'NotADate',                            expect: null },
                         { value: 'Thursday, May 29, 1969 25:00:00 PM',  expect: null },
                         { value: '1/32/2000',                           expect: null },
                         { value: '13/1/2000',                           expect: null },
                         { value: '2/27/2007', format: 'F',              expect: null },
                         { value: 'thursday, 1 january 70 A.D. 00:00:00',expect: 0, format: 'dddd, d MMMM yy gg HH:mm:ss' } ],
              'sv-SE': [ { value: '1969-12-31',                          expect: -86400000 },
                         { value: 'den 31 december 1969 08:00:00',       expect: -57600000 },
                         { value: 'den 1 januari 2006 12:00:00',         expect: 1136116800000, format: 'F' } ],
              // DevDiv Bugs 103805: Previous expected value of 1146524400000 was wrong due to timezone offset using non-DST
              // value when May is in DST
              'he-IL': [ { value: '2/5/2006',                            expect: 1146528000000 },
                         { value: 'יום שלישי 02 מאי 2006 00:00:00',      expect: 1146528000000 } ],
              'tr-TR': [ { value: '02 Mayıs 2006 Salı 00:00:00',         expect: 1146528000000 } ],
              'th-TH' : [ { value: '1 มกราคม 2513 0:00:00', expect: 0 } ],
              'ja-JP' : [ { value: '明治 1年1月1日', format: "gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027", expect: -3218832000000 },
                          { value: '大正 1年7月30日', format: "gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027", expect: -1812153600000 },
                          { value: '昭和 1年12月25日', format: "gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027", expect: -1357603200000 },
                          { value: '平成 1年1月8日', format: "gg y\u0027年\u0027M\u0027月\u0027d\u0027日\u0027", expect: 600220800000 },
                          { value: '01/01/01 明治', format: 'MM/dd/yy gg', expect: -3218832000000 }],
              'pt-PT' : [ { value: '01-01-1970', format: "MM/dd/yyyy", expect: 0 },
                          { value: 'GenJaneiro 01 1970', format: "MMMM dd yyyy", expect: 0 },
                          { value: 'GenJan 01 1970', format: "MMM dd yyyy", expect: 0 }
                        ]
               }
}
AtlasScript.Test.DateTest.registerClass("AtlasScript.Test.DateTest");
AtlasScript.Test.DateTest["AtlasUnit.IsTestFixture"] = true;

