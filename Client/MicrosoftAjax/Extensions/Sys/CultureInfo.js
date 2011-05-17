function toUpper(value) {
    // 'he-IL' has non-breaking space (\u00A0) in weekday names.  In this case replace
    // didn't work using the space escape code ('\s'), so must match the exact character.
    return value.split("\u00A0").join(' ').toUpperCase();
}
function toUpperArray(arr) {
    var result = [];
    foreach(arr, function(value, i) {
        result[i] = toUpper(value);
    });
    return result;
}

function clone(obj) {
    var objNew = {};
    forIn(obj, function(value, field) {
        objNew[field] = (value instanceof Array) ? (value.length === 1 ? [value] : Array.apply(null, value)) :
            ((typeof(value) === "object") ? clone(value) : value);
    });
    return objNew;
}

$type = Sys.CultureInfo = function CultureInfo(name, numberFormat, dateTimeFormat) {
    /// <summary locid="M:J#Sys.CultureInfo.#ctor"></summary>
    /// <param name="name" type="String">CultureInfo name.</param>
    /// <param name="numberFormat" type="Object">CultureInfo number format information.</param>
    /// <param name="dateTimeFormat" type="Object">CultureInfo date time format information.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "name", type: String},
        {name: "numberFormat", type: Object},
        {name: "dateTimeFormat", type: Object}
    ]);
    if (e) throw e;
    //#endif
    this.name = name;
    this.numberFormat = numberFormat;
    this.dateTimeFormat = dateTimeFormat;
}
$type.prototype = {
    _getDateTimeFormats: function CultureInfo$_getDateTimeFormats() {
        var formats = this._dateTimeFormats;
        if (!formats) {
            var dtf = this.dateTimeFormat;
            this._dateTimeFormats = formats =
            // these are quotes to aid in minimization
              [ dtf["MonthDayPattern"],
                dtf["YearMonthPattern"],
                dtf["ShortDatePattern"],
                dtf["ShortTimePattern"],
                dtf["LongDatePattern"],
                dtf["LongTimePattern"],
                dtf["FullDateTimePattern"],
                dtf["RFC1123Pattern"],
                dtf["SortableDateTimePattern"],
                dtf["UniversalSortableDateTimePattern"] ];
        }
        return formats;
    },
    _getMonthIndex: function CultureInfo$_getMonthIndex(value, abbr) {
        var name = abbr ? "_upperAbbrMonths" : "_upperMonths",
            genitiveName = name + "Genitive",
            upperMonths = this[name];
        if (!upperMonths) {
            var prefix = (abbr ? "Abbreviated" : "");
            this[name] = toUpperArray(this.dateTimeFormat[prefix+"MonthNames"]);
            this[genitiveName] = toUpperArray(this.dateTimeFormat[prefix+"MonthGenitiveNames"]);
        }
        value = toUpper(value);
        var i = indexOf(this[name], value);
        if (i < 0) {
            i = indexOf(this[genitiveName], value);
        }
        return i;
    },    
    _getDayIndex: function CultureInfo$_getDayIndex(value, abbr) {
        var name = abbr ? "_upperAbbrDays" : "_upperDays",
            upperDays = this[name];
        if (!upperDays) {
            this[name] = toUpperArray(this.dateTimeFormat[(abbr ? "Abbreviated" : "")+"DayNames"]);
        }
        return indexOf(this[name], toUpper(value));
    }
}
$type.registerClass('Sys.CultureInfo');

$type._parse = function(value) {
    var dtf = value.dateTimeFormat;
    if (dtf && !dtf.eras) {
        dtf.eras = value.eras;
    }
    return new Sys.CultureInfo(value.name, value.numberFormat, dtf);
}
$type._setup = function() {
    // The raw culture info is very long (several kb). Previously, we had the invariant and US (default) culture
    // infos completely described. But they are almost the same except for a few fields. So it saves significant
    // script size to write the code to clone the default culture and modify it to the US culture than to just have
    // the US culture straight up. We also cache a few of the objects that are the same-- for example, in the invariant
    // culture, MonthNames is the same as MonthGenitiveNames, MonthAbbreviatedNames is the same as MonthAbbreviatedGenitiveNames
    // This reduces the size of MicrosoftAjax.js by about 1500 bytes.
    //invariant: {"name":"",     "numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"\u00A4","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"\u2030","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, dd MMMM yyyy HH:mm:ss",   "LongDatePattern":"dddd, dd MMMM yyyy", "LongTimePattern":"HH:mm:ss",  "MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"MM/dd/yyyy","ShortTimePattern":"HH:mm",  "SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"yyyy MMMM", "AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], "ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]},"eras":[1,"A.D.",null,0]}
    //default  : {"name":"en-US","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$",     "NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"\u2030","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy",  "ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], "ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]},"eras":[1,"A.D.",null,0]}
    var cultureInfo = window.__cultureInfo,
        monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December",""],
        shortMonthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],
        invariant = {"name":"","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"\u00A4","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"\u2030","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, dd MMMM yyyy HH:mm:ss","LongDatePattern":"dddd, dd MMMM yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"MM/dd/yyyy","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"yyyy MMMM","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":shortMonthNames,"MonthNames":monthNames,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":Array.clone(shortMonthNames),"MonthGenitiveNames":Array.clone(monthNames)},"eras":[1,"A.D.",null,0]};
    this.InvariantCulture = this._parse(invariant);
    switch(typeof(cultureInfo)) {
        case "string":
            // this is true when the server is 3.5
            cultureInfo = window.eval("(" + cultureInfo + ")");
            // allow fallthrough to object
        case "object":
            this.CurrentCulture = this._parse(cultureInfo);
            delete __cultureInfo;    
            break;
        default:
            cultureInfo = clone(invariant);
            // fix up the differences
            cultureInfo.name = "en-US";
            cultureInfo.numberFormat.CurrencySymbol = "$";
            var dtf = cultureInfo.dateTimeFormat;
            dtf.FullDatePattern = "dddd, MMMM dd, yyyy h:mm:ss tt";
            dtf.LongDatePattern = "dddd, MMMM dd, yyyy";
            dtf.LongTimePattern = "h:mm:ss tt";
            dtf.ShortDatePattern = "M/d/yyyy";
            dtf.ShortTimePattern = "h:mm tt";
            dtf.YearMonthPattern = "MMMM, yyyy";
            this.CurrentCulture = this._parse(cultureInfo);
            break;
    }
}

$type._setup();

// Make sure the invariant and 'en-US' cultureInfos contained in this file contain unicode in
// place of the non-ascii characters so it matches the encoding of the MicrosoftAjax.js script.
// This is especially required when jsCrunch builds the release script, because it will not
// convert non-ascii characters to unicode correctly for the current MicrosoftAjax.js encoding.
