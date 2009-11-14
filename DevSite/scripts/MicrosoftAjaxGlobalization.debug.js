// Name:        MicrosoftAjaxGlobalization.debug.js
// Assembly:    System.Web.Ajax
// Version:     3.0.31106.22099
// FileVersion: 3.0.31106.0
/// <reference name="MicrosoftAjaxCore.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxGlobalization.js", ["MicrosoftAjaxCore.js"]);

var merge = Sys._merge,
	forIn = Sys._forIn;

Date._appendPreOrPostMatch = function Date$_appendPreOrPostMatch(preMatch, strBuilder) {
    var quoteCount = 0;
    var escaped = false;
    for (var i = 0, il = preMatch.length; i < il; i++) {
        var c = preMatch.charAt(i);
        switch (c) {
        case '\'':
            if (escaped) strBuilder.append("'");
            else quoteCount++;
            escaped = false;
            break;
        case '\\':
            if (escaped) strBuilder.append("\\");
            escaped = !escaped;
            break;
        default:
            strBuilder.append(c);
            escaped = false;
            break;
        }
    }
    return quoteCount;
}

Date._expandFormat = function Date$_expandFormat(dtf, format) {
    if (!format) {
        format = "F";
    }
    var len = format.length;
    if (len === 1) {
        switch (format) {
        case "d":
            return dtf["ShortDatePattern"];
        case "D":
            return dtf["LongDatePattern"];
        case "t":
            return dtf["ShortTimePattern"];
        case "T":
            return dtf["LongTimePattern"];
        case "f":
            return dtf["LongDatePattern"] + " " + dtf["ShortTimePattern"];
        case "F":
            return dtf["FullDateTimePattern"];
        case "M": case "m":
            return dtf["MonthDayPattern"];
        case "s":
            return dtf["SortableDateTimePattern"];
        case "Y": case "y":
            return dtf["YearMonthPattern"];
        default:
            throw Error.format(Sys.Res.formatInvalidString);
        }
    }
    else if ((len === 2) && (format.charAt(0) === "%")) {
        format = format.charAt(1);
    }
    return format;
}

Date._expandYear = function Date$_expandYear(dtf, year) {
    var now = new Date(),
        era = Date._getEra(now);
    if (year < 100) {
        var curr = Date._getEraYear(now, dtf, era);
        year += curr - (curr % 100);
        if (year > dtf.Calendar.TwoDigitYearMax) {
            year -= 100;
        }
    }
    return year;
}

Date._getEra = function Date$_getEra(date, eras) {
    if (!eras) return 0;
    var start, ticks = date.getTime();
    for (var i = 0, l = eras.length; i < l; i += 4) {
        start = eras[i+2];
        if ((start === null) || (ticks >= start)) {
            return i;
        }
    }
    return 0;
}
Date._getEraYear = function Date$_getEraYear(date, dtf, era, sortable) {
    var year = date.getFullYear();
    if (!sortable && dtf.eras) {
        year -= dtf.eras[era + 3];
    }    
    return year;
}

Date._getParseRegExp = function Date$_getParseRegExp(dtf, format) {
    if (!dtf._parseRegExp) {
        dtf._parseRegExp = {};
    }
    else if (dtf._parseRegExp[format]) {
        return dtf._parseRegExp[format];
    }

    var expFormat = Date._expandFormat(dtf, format);
    expFormat = expFormat.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");

    var regexp = new Sys.StringBuilder("^");
    var groups = [];
    var index = 0;
    var quoteCount = 0;
    var tokenRegExp = Date._getTokenRegExp();
    var match;

    while ((match = tokenRegExp.exec(expFormat)) !== null) {
        var preMatch = expFormat.slice(index, match.index);
        index = tokenRegExp.lastIndex;

        quoteCount += Date._appendPreOrPostMatch(preMatch, regexp);
        if ((quoteCount%2) === 1) {
            regexp.append(match[0]);
            continue;
        }

        switch (match[0]) {
            case 'dddd': case 'ddd':
            case 'MMMM': case 'MMM':
            case 'gg': case 'g':
                regexp.append("(\\D+)");
                break;
            case 'tt': case 't':
                regexp.append("(\\D*)");
                break;
            case 'yyyy':
                regexp.append("(\\d{4})");
                break;
            case 'fff':
                regexp.append("(\\d{3})");
                break;
            case 'ff':
                regexp.append("(\\d{2})");
                break;
            case 'f':
                regexp.append("(\\d)");
                break;
            case 'dd': case 'd':
            case 'MM': case 'M':
            case 'yy': case 'y':
            case 'HH': case 'H':
            case 'hh': case 'h':
            case 'mm': case 'm':
            case 'ss': case 's':
                regexp.append("(\\d\\d?)");
                break;
            case 'zzz':
                regexp.append("([+-]?\\d\\d?:\\d{2})");
                break;
            case 'zz': case 'z':
                regexp.append("([+-]?\\d\\d?)");
                break;
            case '/':
                regexp.append("(\\" + dtf.DateSeparator + ")");
                break;
        }
        Array.add(groups, match[0]);
    }
    Date._appendPreOrPostMatch(expFormat.slice(index), regexp);
    regexp.append("$");
    var regexpStr = regexp.toString().replace(/\s+/g, "\\s+");
    var parseRegExp = {'regExp': regexpStr, 'groups': groups};
    dtf._parseRegExp[format] = parseRegExp;
    return parseRegExp;
}

Date._getTokenRegExp = function Date$_getTokenRegExp() {
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
}

Date.parseLocale = function Date$parseLocale(value, formats) {
    /// <summary locid="M:J#Date.parseLocale" />
    /// <param name="value" type="String"></param>
    /// <param name="formats" parameterArray="true" optional="true" mayBeNull="true"></param>
    /// <returns type="Date"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String},
        {name: "formats", mayBeNull: true, optional: true, parameterArray: true}
    ]);
    if (e) throw e;
    return Date._parse(value, Sys.CultureInfo.CurrentCulture, arguments);
}

Date.parseInvariant = function Date$parseInvariant(value, formats) {
    /// <summary locid="M:J#Date.parseInvariant" />
    /// <param name="value" type="String"></param>
    /// <param name="formats" parameterArray="true" optional="true" mayBeNull="true"></param>
    /// <returns type="Date"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String},
        {name: "formats", mayBeNull: true, optional: true, parameterArray: true}
    ]);
    if (e) throw e;
    return Date._parse(value, Sys.CultureInfo.InvariantCulture, arguments);
}

Date._parse = function Date$_parse(value, cultureInfo, args) {
    var i, l, date, format, formats, custom = false;
    for (i = 1, l = args.length; i < l; i++) {
        format = args[i];
        if (format) {
            custom = true;
            date = Date._parseExact(value, format, cultureInfo);
            if (date) return date;
        }
    }
    if (! custom) {
        formats = cultureInfo._getDateTimeFormats();
        for (i = 0, l = formats.length; i < l; i++) {
            date = Date._parseExact(value, formats[i], cultureInfo);
            if (date) return date;
        }
    }
    return null;
}

Date._parseExact = function Date$_parseExact(value, format, cultureInfo) {
    value = value.trim();
    var dtf = cultureInfo.dateTimeFormat,
        parseInfo = Date._getParseRegExp(dtf, format),
        match = new RegExp(parseInfo.regExp).exec(value);
    if (match === null) return null;
    var groups = parseInfo.groups,
        era = null, year = null, month = null, date = null, weekDay = null,
        hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
        pmHour = false;
    for (var j = 0, jl = groups.length; j < jl; j++) {
        var matchGroup = match[j+1];
        if (matchGroup) {
            switch (groups[j]) {
                case 'dd': case 'd':
                    date = parseInt(matchGroup, 10);
                    if ((date < 1) || (date > 31)) return null;
                    break;
                case 'MMMM':
                    month = cultureInfo._getMonthIndex(matchGroup);
                    if ((month < 0) || (month > 11)) return null;
                    break;
                case 'MMM':
                    month = cultureInfo._getMonthIndex(matchGroup, true);
                    if ((month < 0) || (month > 11)) return null;
                    break;
                case 'M': case 'MM':
                    month = parseInt(matchGroup, 10) - 1;
                    if ((month < 0) || (month > 11)) return null;
                    break;
                case 'y': case 'yy':
                    year = Date._expandYear(dtf,parseInt(matchGroup, 10));
                    if ((year < 0) || (year > 9999)) return null;
                    break;
                case 'yyyy':
                    year = parseInt(matchGroup, 10);
                    if ((year < 0) || (year > 9999)) return null;
                    break;
                case 'h': case 'hh':
                    hour = parseInt(matchGroup, 10);
                    if (hour === 12) hour = 0;
                    if ((hour < 0) || (hour > 11)) return null;
                    break;
                case 'H': case 'HH':
                    hour = parseInt(matchGroup, 10);
                    if ((hour < 0) || (hour > 23)) return null;
                    break;
                case 'm': case 'mm':
                    min = parseInt(matchGroup, 10);
                    if ((min < 0) || (min > 59)) return null;
                    break;
                case 's': case 'ss':
                    sec = parseInt(matchGroup, 10);
                    if ((sec < 0) || (sec > 59)) return null;
                    break;
                case 'tt': case 't':
                    var upperToken = matchGroup.toUpperCase();
                    pmHour = (upperToken === dtf.PMDesignator.toUpperCase());
                    if (!pmHour && (upperToken !== dtf.AMDesignator.toUpperCase())) return null;
                    break;
                case 'f':
                    msec = parseInt(matchGroup, 10) * 100;
                    if ((msec < 0) || (msec > 999)) return null;
                    break;
                case 'ff':
                    msec = parseInt(matchGroup, 10) * 10;
                    if ((msec < 0) || (msec > 999)) return null;
                    break;
                case 'fff':
                    msec = parseInt(matchGroup, 10);
                    if ((msec < 0) || (msec > 999)) return null;
                    break;
                case 'dddd':
                    weekDay = cultureInfo._getDayIndex(matchGroup);
                    if ((weekDay < 0) || (weekDay > 6)) return null;
                    break;
                case 'ddd':
                    weekDay = cultureInfo._getDayIndex(matchGroup, true);
                    if ((weekDay < 0) || (weekDay > 6)) return null;
                    break;
                case 'zzz':
                    var offsets = matchGroup.split(/:/);
                    if (offsets.length !== 2) return null;
                    hourOffset = parseInt(offsets[0], 10);
                    if ((hourOffset < -12) || (hourOffset > 13)) return null;
                    var minOffset = parseInt(offsets[1], 10);
                    if ((minOffset < 0) || (minOffset > 59)) return null;
                    tzMinOffset = (hourOffset * 60) + (matchGroup.startsWith('-')? -minOffset : minOffset);
                    break;
                case 'z': case 'zz':
                    hourOffset = parseInt(matchGroup, 10);
                    if ((hourOffset < -12) || (hourOffset > 13)) return null;
                    tzMinOffset = hourOffset * 60;
                    break;
                case 'g': case 'gg':
                    var eraName = matchGroup;
                    if (!eraName || !dtf.eras) return null;
                    eraName = eraName.toLowerCase().trim();
                    for (var i = 0, l = dtf.eras.length; i < l; i += 4) {
                        if (eraName === dtf.eras[i + 1].toLowerCase()) {
                            era = i;
                            break;
                        }
                    }
                    if (era === null) return null;
                    break;
            }
        }
    }
    var result = new Date(), defaultYear, convert = dtf.Calendar.convert;
    if (convert) {
        defaultYear = convert.fromGregorian(result)[0];
    }
    else {
        defaultYear = result.getFullYear();
    }
    if (year === null) {
        year = defaultYear;
    }
    else if (dtf.eras) {
        year += dtf.eras[(era || 0) + 3];
    }
    if (month === null) {
        month = 0;
    }
    if (date === null) {
        date = 1;
    }
    if (convert) {
        result = convert.toGregorian(year, month, date);
        if (result === null) return null;
    }
    else {
        result.setFullYear(year, month, date);
        if (result.getDate() !== date) return null;
        if ((weekDay !== null) && (result.getDay() !== weekDay)) {
            return null;
        }
    }
    if (pmHour && (hour < 12)) {
        hour += 12;
    }
    result.setHours(hour, min, sec, msec);
    if (tzMinOffset !== null) {
        var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
        result.setHours(result.getHours() + parseInt(adjustedMin/60, 10), adjustedMin%60);
    }
    return result;
}

Date.prototype.format = function Date$format(format) {
    /// <summary locid="M:J#Date.format" />
    /// <param name="format" type="String"></param>
    /// <returns type="String"></returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    return this._toFormattedString(format, Sys.CultureInfo.InvariantCulture);
}

Date.prototype.localeFormat = function Date$localeFormat(format) {
    /// <summary locid="M:J#Date.localeFormat" />
    /// <param name="format" type="String"></param>
    /// <returns type="String"></returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
}

Date.prototype._toFormattedString = function Date$_toFormattedString(format, cultureInfo) {
    var dtf = cultureInfo.dateTimeFormat,
        convert = dtf.Calendar.convert;
    if (!format || !format.length || (format === 'i')) {
        if (cultureInfo && cultureInfo.name.length) {
            if (convert) {
                return this._toFormattedString(dtf.FullDateTimePattern, cultureInfo);
            }
            else {
                var eraDate = new Date(this.getTime());
                var era = Date._getEra(this, dtf.eras);
                eraDate.setFullYear(Date._getEraYear(this, dtf, era));
                return eraDate.toLocaleString();
            }
        }
        else {
            return this.toString();
        }
    }

    var eras = dtf.eras,
        sortable = (format === "s");
    format = Date._expandFormat(dtf, format);

    var ret = new Sys.StringBuilder();
    var hour;

    function addLeadingZero(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num.toString();
    }

    function addLeadingZeros(num) {
        if (num < 10) {
            return '00' + num;
        }
        if (num < 100) {
            return '0' + num;
        }
        return num.toString();
    }
    function padYear(year) {
        if (year < 10) {
            return '000' + year;
        }
        else if (year < 100) {
            return '00' + year;
        }
        else if (year < 1000) {
            return '0' + year;
        }
        return year.toString();
    }
    var foundDay, checkedDay, dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g;
    function hasDay() {
        if (foundDay || checkedDay) {
            return foundDay;
        }
        foundDay = dayPartRegExp.test(format);
        checkedDay = true;
        return foundDay;
    }
    var quoteCount = 0,
        tokenRegExp = Date._getTokenRegExp(),
        converted;
    if (!sortable && convert) {
        converted = convert.fromGregorian(this);
    }
    for (;;) {

        var index = tokenRegExp.lastIndex;

        var ar = tokenRegExp.exec(format);

        var preMatch = format.slice(index, ar ? ar.index : format.length);
        quoteCount += Date._appendPreOrPostMatch(preMatch, ret);

        if (!ar) break;

        if ((quoteCount%2) === 1) {
            ret.append(ar[0]);
            continue;
        }
        function getPart(date, part) {
            if (converted) {
                return converted[part];
            }
            switch (part) {
                case 0: return date.getFullYear();
                case 1: return date.getMonth();
                case 2: return date.getDate();
            }
        }

        switch (ar[0]) {
        case "dddd":
            ret.append(dtf.DayNames[this.getDay()]);
            break;
        case "ddd":
            ret.append(dtf.AbbreviatedDayNames[this.getDay()]);
            break;
        case "dd":
            foundDay = true;
            ret.append(addLeadingZero(getPart(this, 2)));
            break;
        case "d":
            foundDay = true;
            ret.append(getPart(this, 2));
            break;
        case "MMMM":
            ret.append((dtf.MonthGenitiveNames && hasDay())
                ? dtf.MonthGenitiveNames[getPart(this, 1)]
                : dtf.MonthNames[getPart(this, 1)]);
            break;
        case "MMM":
            ret.append((dtf.AbbreviatedMonthGenitiveNames && hasDay())
                ? dtf.AbbreviatedMonthGenitiveNames[getPart(this, 1)]
                : dtf.AbbreviatedMonthNames[getPart(this, 1)]);
            break;
        case "MM":
            ret.append(addLeadingZero(getPart(this, 1) + 1));
            break;
        case "M":
            ret.append(getPart(this, 1) + 1);
            break;
        case "yyyy":
            ret.append(padYear(converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)));
            break;
        case "yy":
            ret.append(addLeadingZero((converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)) % 100));
            break;
        case "y":
            ret.append((converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)) % 100);
            break;
        case "hh":
            hour = this.getHours() % 12;
            if (hour === 0) hour = 12;
            ret.append(addLeadingZero(hour));
            break;
        case "h":
            hour = this.getHours() % 12;
            if (hour === 0) hour = 12;
            ret.append(hour);
            break;
        case "HH":
            ret.append(addLeadingZero(this.getHours()));
            break;
        case "H":
            ret.append(this.getHours());
            break;
        case "mm":
            ret.append(addLeadingZero(this.getMinutes()));
            break;
        case "m":
            ret.append(this.getMinutes());
            break;
        case "ss":
            ret.append(addLeadingZero(this.getSeconds()));
            break;
        case "s":
            ret.append(this.getSeconds());
            break;
        case "tt":
            ret.append((this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator);
            break;
        case "t":
            ret.append(((this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator).charAt(0));
            break;
        case "f":
            ret.append(addLeadingZeros(this.getMilliseconds()).charAt(0));
            break;
        case "ff":
            ret.append(addLeadingZeros(this.getMilliseconds()).substr(0, 2));
            break;
        case "fff":
            ret.append(addLeadingZeros(this.getMilliseconds()));
            break;
        case "z":
            hour = this.getTimezoneOffset() / 60;
            ret.append(((hour <= 0) ? '+' : '-') + Math.floor(Math.abs(hour)));
            break;
        case "zz":
            hour = this.getTimezoneOffset() / 60;
            ret.append(((hour <= 0) ? '+' : '-') + addLeadingZero(Math.floor(Math.abs(hour))));
            break;
        case "zzz":
            hour = this.getTimezoneOffset() / 60;
            ret.append(((hour <= 0) ? '+' : '-') + addLeadingZero(Math.floor(Math.abs(hour))) +
                ":" + addLeadingZero(Math.abs(this.getTimezoneOffset() % 60)));
            break;
        case "g":
        case "gg":
            if (dtf.eras) {
                ret.append(dtf.eras[Date._getEra(this, eras) + 1]);
            }
            break;
        case "/":
            ret.append(dtf.DateSeparator);
            break;
        }
    }
    return ret.toString();
}
String.localeFormat = function String$localeFormat(format, args) {
    /// <summary locid="M:J#String.localeFormat" />
    /// <param name="format" type="String"></param>
    /// <param name="args" parameterArray="true" mayBeNull="true"></param>
    /// <returns type="String"></returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String},
        {name: "args", mayBeNull: true, parameterArray: true}
    ]);
    if (e) throw e;
    return String._toFormattedString(true, arguments);
}
Number.parseLocale = function Number$parseLocale(value) {
    /// <summary locid="M:J#Number.parseLocale" />
    /// <param name="value" type="String"></param>
    /// <returns type="Number"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ], false);
    if (e) throw e;
    return Number._parse(value, Sys.CultureInfo.CurrentCulture);
}
Number.parseInvariant = function Number$parseInvariant(value) {
    /// <summary locid="M:J#Number.parseInvariant" />
    /// <param name="value" type="String"></param>
    /// <returns type="Number"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ], false);
    if (e) throw e;
    return Number._parse(value, Sys.CultureInfo.InvariantCulture);
}
Number._parse = function Number$_parse(value, cultureInfo) {
    value = value.trim();
    if (value.match(/^[+-]?infinity$/i)) {
        return parseFloat(value);
    }
    if (value.match(/^0x[a-f0-9]+$/i)) {
        return parseInt(value);
    }

    var numFormat = cultureInfo.numberFormat;
    var signInfo = Number._parseNumberNegativePattern(value, numFormat, numFormat.NumberNegativePattern);
    var sign = signInfo[0];
    var num = signInfo[1];
    if ((sign === '') && (numFormat.NumberNegativePattern !== 1)) {
        signInfo = Number._parseNumberNegativePattern(value, numFormat, 1);
        sign = signInfo[0];
        num = signInfo[1];
    }
    if (sign === '') sign = '+';
    var exponent;
    var intAndFraction;
    var exponentPos = num.indexOf('e');
    if (exponentPos < 0) exponentPos = num.indexOf('E');
    if (exponentPos < 0) {
        intAndFraction = num;
        exponent = null;
    }
    else {
        intAndFraction = num.substr(0, exponentPos);
        exponent = num.substr(exponentPos + 1);
    }
    var integer;
    var fraction;
    var decimalPos = intAndFraction.indexOf(numFormat.NumberDecimalSeparator);
    if (decimalPos < 0) {
        integer = intAndFraction;
        fraction = null;
    }
    else {
        integer = intAndFraction.substr(0, decimalPos);
        fraction = intAndFraction.substr(decimalPos + numFormat.NumberDecimalSeparator.length);
    }
    integer = integer.split(numFormat.NumberGroupSeparator).join('');
    var altNumGroupSeparator = numFormat.NumberGroupSeparator.replace(/\u00A0/g, " ");
    if (numFormat.NumberGroupSeparator !== altNumGroupSeparator) {
        integer = integer.split(altNumGroupSeparator).join('');
    }
    var p = sign + integer;
    if (fraction !== null) {
        p += '.' + fraction;
    }
    if (exponent !== null) {
        var expSignInfo = Number._parseNumberNegativePattern(exponent, numFormat, 1);
        if (expSignInfo[0] === '') {
            expSignInfo[0] = '+';
        }
        p += 'e' + expSignInfo[0] + expSignInfo[1];
    }

    if (p.match(/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/)) {
        return parseFloat(p);
    }
    return Number.NaN;
}
Number._parseNumberNegativePattern = function Number$_parseNumberNegativePattern(value, numFormat, numberNegativePattern) {
    var neg = numFormat.NegativeSign;
    var pos = numFormat.PositiveSign;    
    switch (numberNegativePattern) {
        case 4: 
            neg = ' ' + neg;
            pos = ' ' + pos;
        case 3: 
            if (value.endsWith(neg)) {
                return ['-', value.substr(0, value.length - neg.length)];
            }
            else if (value.endsWith(pos)) {
                return ['+', value.substr(0, value.length - pos.length)];
            }
            break;
        case 2: 
            neg += ' ';
            pos += ' ';
        case 1: 
            if (value.startsWith(neg)) {
                return ['-', value.substr(neg.length)];
            }
            else if (value.startsWith(pos)) {
                return ['+', value.substr(pos.length)];
            }
            break;
        case 0: 
            if (value.startsWith('(') && value.endsWith(')')) {
                return ['-', value.substr(1, value.length - 2)];
            }
            break;
    }
    return ['', value];
}

Number.prototype.format = function Number$format(format) {
    /// <summary locid="M:J#Number.format" />
    /// <param name="format" type="String"></param>
    /// <returns type="String"></returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    return this._toFormattedString(format, Sys.CultureInfo.InvariantCulture);
}
Number.prototype.localeFormat = function Number$localeFormat(format) {
    /// <summary locid="M:J#Number.localeFormat" />
    /// <param name="format" type="String"></param>
    /// <returns type="String"></returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
}
Number.prototype._toFormattedString = function Number$_toFormattedString(format, cultureInfo) {
    if (!format || (format.length === 0) || (format === 'i')) {
        if (cultureInfo && (cultureInfo.name.length > 0)) {
            return this.toLocaleString();
        }
        else {
            return this.toString();
        }
    }
    var _percentPositivePattern = ["n %", "n%", "%n" ];
    var _percentNegativePattern = ["-n %", "-n%", "-%n"];
    var _numberNegativePattern = ["(n)","-n","- n","n-","n -"];
    var _currencyPositivePattern = ["$n","n$","$ n","n $"];
    var _currencyNegativePattern = ["($n)","-$n","$-n","$n-","(n$)","-n$","n-$","n$-","-n $","-$ n","n $-","$ n-","$ -n","n- $","($ n)","(n $)"];

    function zeroPad(str, count, left) {
        for (var l=str.length; l < count; l++) {
            str = (left ? ('0' + str) : (str + '0'));
        }
        return str;
    }
    function expandNumber(number, precision, groupSizes, sep, decimalChar) {
        var curSize = groupSizes[0];
        var curGroupIndex = 1;



        var factor = Math.pow(10, precision);
        var rounded = (Math.round(number * factor) / factor);
        if (!isFinite(rounded)) {
            rounded = number;
        }
        number = rounded;
        var numberString = number.toString();
        var right = "";
        var exponent;
        var split = numberString.split(/e/i);
        numberString = split[0];
        exponent = (split.length > 1 ? parseInt(split[1]) : 0);
        split = numberString.split('.');
        numberString = split[0];
        right = split.length > 1 ? split[1] : "";
        var l;
        if (exponent > 0) {
            right = zeroPad(right, exponent, false);
            numberString += right.slice(0, exponent);
            right = right.substr(exponent);
        }
        else if (exponent < 0) {
            exponent = -exponent;
            numberString = zeroPad(numberString, exponent+1, true);
            right = numberString.slice(-exponent, numberString.length) + right;
            numberString = numberString.slice(0, -exponent);
        }

        if (precision > 0) {
            if (right.length > precision) {
                right = right.slice(0, precision);
            }
            else {
                right = zeroPad(right, precision, false);
            }
            right = decimalChar + right;
        }
        else { 
            right = "";
        }

        var stringIndex = numberString.length-1;
        var ret = "";
        while (stringIndex >= 0) {

            if (curSize === 0 || curSize > stringIndex) {
                if (ret.length > 0)
                    return numberString.slice(0, stringIndex + 1) + sep + ret + right;
                else
                    return numberString.slice(0, stringIndex + 1) + right;
            }

            if (ret.length > 0)
                ret = numberString.slice(stringIndex - curSize + 1, stringIndex+1) + sep + ret;
            else
                ret = numberString.slice(stringIndex - curSize + 1, stringIndex+1);

            stringIndex -= curSize;

            if (curGroupIndex < groupSizes.length) {
                curSize = groupSizes[curGroupIndex];
                curGroupIndex++;
            }
        }
        return numberString.slice(0, stringIndex + 1) + sep + ret + right;
    }
    var nf = cultureInfo.numberFormat;

    var number = Math.abs(this);

    if (!format)
        format = "D";

    var precision = -1;
    if (format.length > 1) precision = parseInt(format.slice(1), 10);

    var pattern;
    switch (format.charAt(0)) {
    case "d":
    case "D":
        pattern = 'n';

        if (precision !== -1) {
            number = zeroPad(""+number, precision, true);
        }

        if (this < 0) number = -number;
        break;
    case "c":
    case "C":
        if (this < 0) pattern = _currencyNegativePattern[nf.CurrencyNegativePattern];
        else pattern = _currencyPositivePattern[nf.CurrencyPositivePattern];
        if (precision === -1) precision = nf.CurrencyDecimalDigits;
        number = expandNumber(Math.abs(this), precision, nf.CurrencyGroupSizes, nf.CurrencyGroupSeparator, nf.CurrencyDecimalSeparator);
        break;
    case "n":
    case "N":
        if (this < 0) pattern = _numberNegativePattern[nf.NumberNegativePattern];
        else pattern = 'n';
        if (precision === -1) precision = nf.NumberDecimalDigits;
        number = expandNumber(Math.abs(this), precision, nf.NumberGroupSizes, nf.NumberGroupSeparator, nf.NumberDecimalSeparator);
        break;
    case "p":
    case "P":
        if (this < 0) pattern = _percentNegativePattern[nf.PercentNegativePattern];
        else pattern = _percentPositivePattern[nf.PercentPositivePattern];
        if (precision === -1) precision = nf.PercentDecimalDigits;
        number = expandNumber(Math.abs(this) * 100, precision, nf.PercentGroupSizes, nf.PercentGroupSeparator, nf.PercentDecimalSeparator);
        break;
    default:
        throw Error.format(Sys.Res.formatBadFormatSpecifier);
    }

    var regex = /n|\$|-|%/g;

    var ret = "";

    for (;;) {

        var index = regex.lastIndex;

        var ar = regex.exec(pattern);

        ret += pattern.slice(index, ar ? ar.index : pattern.length);

        if (!ar)
            break;

        switch (ar[0]) {
        case "n":
            ret += number;
            break;
        case "$":
            ret += nf.CurrencySymbol;
            break;
        case "-":
            if (/[1-9]/.test(number)) {
                ret += nf.NegativeSign;
            }
            break;
        case "%":
            ret += nf.PercentSymbol;
            break;
        }
    }

    return ret;
}
function toUpper(value) {
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

Sys.CultureInfo = function Sys$CultureInfo(name, numberFormat, dateTimeFormat) {
    /// <summary locid="M:J#Sys.CultureInfo.#ctor" />
    /// <param name="name" type="String"></param>
    /// <param name="numberFormat" type="Object"></param>
    /// <param name="dateTimeFormat" type="Object"></param>
    var e = Function._validateParams(arguments, [
        {name: "name", type: String},
        {name: "numberFormat", type: Object},
        {name: "dateTimeFormat", type: Object}
    ]);
    if (e) throw e;
    this.name = name;
    this.numberFormat = numberFormat;
    this.dateTimeFormat = dateTimeFormat;
}

    function Sys$CultureInfo$_getDateTimeFormats() {
        var formats = this._dateTimeFormats;
        if (!formats) {
            var dtf = this.dateTimeFormat;
            this._dateTimeFormats = formats =
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
    }
    function Sys$CultureInfo$_getMonthIndex(value, abbr) {
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
    }
    function Sys$CultureInfo$_getDayIndex(value, abbr) {
        var name = abbr ? "_upperAbbrDays" : "_upperDays",
            upperDays = this[name];
        if (!upperDays) {
            this[name] = toUpperArray(this.dateTimeFormat[(abbr ? "Abbreviated" : "")+"DayNames"]);
        }
        return indexOf(this[name], toUpper(value));
    }
Sys.CultureInfo.prototype = {
    _getDateTimeFormats: Sys$CultureInfo$_getDateTimeFormats,
    _getMonthIndex: Sys$CultureInfo$_getMonthIndex,    
    _getDayIndex: Sys$CultureInfo$_getDayIndex
}
Sys.CultureInfo.registerClass('Sys.CultureInfo');

merge(Sys.CultureInfo, {
_parse: function(value) {
    var dtf = value.dateTimeFormat;
    if (dtf && !dtf.eras) {
        dtf.eras = value.eras;
    }
    return new Sys.CultureInfo(value.name, value.numberFormat, dtf);
},
_setup: function() {
    var cultureInfo = window.__cultureInfo,
        monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December",""],
        shortMonthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],
        invariant = {"name":"","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"\u00A4","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"\u2030","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, dd MMMM yyyy HH:mm:ss","LongDatePattern":"dddd, dd MMMM yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"MM/dd/yyyy","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"yyyy MMMM","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":shortMonthNames,"MonthNames":monthNames,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":Array.clone(shortMonthNames),"MonthGenitiveNames":Array.clone(monthNames)},"eras":[1,"A.D.",null,0]};
    this.InvariantCulture = this._parse(invariant);
    switch(typeof(cultureInfo)) {
        case "string":
            cultureInfo = window.eval("(" + cultureInfo + ")");
        case "object":
            this.CurrentCulture = this._parse(cultureInfo);
            delete __cultureInfo;    
            break;
        default:
            cultureInfo = clone(invariant);
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
});

Sys.CultureInfo._setup();






}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Globalization", null, execute);
}
else {
	execute();
}

})();

