// (c) 2010 CodePlex Foundation
//!/ <reference name="MicrosoftAjaxCore.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxGlobalization.js", ["MicrosoftAjaxCore.js"]);

var $type, $prototype,
    merge = Sys._merge,
	forIn = Sys._forIn,
    foreach = Sys._foreach,
    indexOf = Sys._indexOf;

function outOfRange(value, low, high) {
    return (value < low) || (value > high);
}

function expandYear(dtf, year) {
    var now = new Date(),
        era = getEra(now);
    if (year < 100) {
        var curr = getEraYear(now, dtf, era);
        year += curr - (curr % 100);
        if (year > dtf.Calendar.TwoDigitYearMax) {
            year -= 100;
        }
    }
    return year;
}

function getEra(date, eras) {
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

function getEraYear(date, dtf, era, sortable) {
    var year = date.getFullYear();
    if (!sortable && dtf.eras) {
        year -= dtf.eras[era + 3];
    }    
    return year;
}

Sys._appendPreOrPostMatch = function _appendPreOrPostMatch(preMatch, strings) {
    var quoteCount = 0;
    var escaped = false;
    for (var i = 0, il = preMatch.length; i < il; i++) {
        var c = preMatch.charAt(i);
        switch (c) {
        case '\'':
            if (escaped) strings.push("'");
            else quoteCount++;
            escaped = false;
            break;
        case '\\':
            if (escaped) strings.push("\\");
            escaped = !escaped;
            break;
        default:
            strings.push(c);
            escaped = false;
            break;
        }
    }
    return quoteCount;
}

$type = Date;
$type._expandFormat = function Date$_expandFormat(dtf, format) {
    format = format || "F";
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

$type._getParseRegExp = function Date$_getParseRegExp(dtf, format) {
    var re = dtf._parseRegExp;
    if (!re) {
        dtf._parseRegExp = re = {};
    }
    else {
        var reFormat = re[format];
        if (reFormat) {
            return reFormat;
        }
    }

    var expFormat = Date._expandFormat(dtf, format);
    expFormat = expFormat.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");

    var regexp = ["^"];
    var groups = [];
    var index = 0;
    var quoteCount = 0;
    var tokenRegExp = Date._getTokenRegExp();
    var match;

    while ((match = tokenRegExp.exec(expFormat)) !== null) {
        var preMatch = expFormat.slice(index, match.index);
        index = tokenRegExp.lastIndex;

        quoteCount += Sys._appendPreOrPostMatch(preMatch, regexp);
        if (quoteCount % 2) {
            regexp.push(match[0]);
            continue;
        }

        var m = match[0],
            len = m.length,
            add;
        switch (m) {
            case 'dddd': case 'ddd':
            case 'MMMM': case 'MMM':
            case 'gg': case 'g':
                add = "(\\D+)";
                break;
            case 'tt': case 't':
                add = "(\\D*)";
                break;
            case 'yyyy':
            case 'fff':
            case 'ff':
            case 'f':
                add = "(\\d{" + len + "})";
                break;
            case 'dd': case 'd':
            case 'MM': case 'M':
            case 'yy': case 'y':
            case 'HH': case 'H':
            case 'hh': case 'h':
            case 'mm': case 'm':
            case 'ss': case 's':
                add = "(\\d\\d?)";
                break;
            case 'zzz':
                add = "([+-]?\\d\\d?:\\d{2})";
                break;
            case 'zz': case 'z':
                add = "([+-]?\\d\\d?)";
                break;
            case '/':
                add = "(\\" + dtf.DateSeparator + ")";
                break;
        }
        if (add) {
            regexp.push(add);
        }
        groups.push(match[0]);
    }
    Sys._appendPreOrPostMatch(expFormat.slice(index), regexp);
    regexp.push("$");
    var regexpStr = regexp.join('').replace(/\s+/g, "\\s+");
    var parseRegExp = {'regExp': regexpStr, 'groups': groups};
    re[format] = parseRegExp;
    return parseRegExp;
}

$type._getTokenRegExp = function Date$_getTokenRegExp() {
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
}

$type.parseLocale = function Date$parseLocale(value, formats) {
    /// <summary locid="M:J#Date.parseLocale">Creates a date from a locale-specific string representation.</summary>
    /// <param name="value" type="String">A locale-specific string that can parse to a date.</param>
    /// <param name="formats" parameterArray="true" optional="true" mayBeNull="true">Custom formats to match.</param>
    /// <returns type="Date"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String},
        {name: "formats", mayBeNull: true, optional: true, parameterArray: true}
    ]);
    if (e) throw e;
    return Date._parse(value, Sys.CultureInfo.CurrentCulture, arguments);
}

$type.parseInvariant = function Date$parseInvariant(value, formats) {
    /// <summary locid="M:J#Date.parseInvariant">Creates a date from its string representation.</summary>
    /// <param name="value" type="String">A string that can parse to a date.</param>
    /// <param name="formats" parameterArray="true" optional="true" mayBeNull="true">Custom formats to match.</param>
    /// <returns type="Date"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String},
        {name: "formats", mayBeNull: true, optional: true, parameterArray: true}
    ]);
    if (e) throw e;
    return Date._parse(value, Sys.CultureInfo.InvariantCulture, arguments);
}

$type._parse = function Date$_parse(value, cultureInfo, args) {
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

$type._parseExact = function Date$_parseExact(value, format, cultureInfo) {
    value = value.trim();
    var dtf = cultureInfo.dateTimeFormat,
        parseInfo = this._getParseRegExp(dtf, format),
        match = new RegExp(parseInfo.regExp).exec(value);
    if (match === null) return null;
    
    var groups = parseInfo.groups,
        era = null, year = null, month = null, date = null, weekDay = null,
        hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
        pmHour = false;
    
    for (var j = 0, jl = groups.length; j < jl; j++) {
        var matchGroup = match[j+1];
        if (matchGroup) {
            var current = groups[j],
                clength = current.length,
                matchInt = parseInt(matchGroup, 10);
            switch (current) {
                case 'dd': case 'd':
                    date = matchInt;
                    if (outOfRange(date, 1, 31)) return null;
                    break;
                case 'MMM':
                case 'MMMM':
                    month = cultureInfo._getMonthIndex(matchGroup, clength === 3);
                    if (outOfRange(month, 0, 11)) return null;
                    break;
                case 'M': case 'MM':
                    month = matchInt - 1;
                    if (outOfRange(month, 0, 11)) return null;
                    break;
                case 'y': case 'yy':
                case 'yyyy':
                    year = clength < 4 ? expandYear(dtf,matchInt) : matchInt;
                    if (outOfRange(year, 0, 9999)) return null;
                    break;
                case 'h': case 'hh':
                    hour = matchInt;
                    if (hour === 12) hour = 0;
                    if (outOfRange(hour, 0, 11)) return null;
                    break;
                case 'H': case 'HH':
                    hour = matchInt;
                    if (outOfRange(hour, 0, 23)) return null;
                    break;
                case 'm': case 'mm':
                    min = matchInt;
                    if (outOfRange(min, 0, 59)) return null;
                    break;
                case 's': case 'ss':
                    sec = matchInt;
                    if (outOfRange(sec, 0, 59)) return null;
                    break;
                case 'tt': case 't':
                    var upperToken = matchGroup.toUpperCase();
                    pmHour = (upperToken === dtf.PMDesignator.toUpperCase());
                    if (!pmHour && (upperToken !== dtf.AMDesignator.toUpperCase())) return null;
                    break;
                case 'f':
                case 'ff':
                case 'fff':
                    msec = matchInt * Math.pow(10, 3-clength);
                    if (outOfRange(msec, 0, 999)) return null;
                    break;
                case 'ddd':
                case 'dddd':
                    weekDay = cultureInfo._getDayIndex(matchGroup, clength === 3);
                    if (outOfRange(weekDay, 0, 6)) return null;
                    break;
                case 'zzz':
                    var offsets = matchGroup.split(/:/);
                    if (offsets.length !== 2) return null;
                    hourOffset = parseInt(offsets[0], 10);
                    if (outOfRange(hourOffset, -12, 13)) return null;
                    var minOffset = parseInt(offsets[1], 10);
                    if (outOfRange(minOffset, 0, 59)) return null;
                    tzMinOffset = (hourOffset * 60) + (matchGroup.startsWith('-')? -minOffset : minOffset);
                    break;
                case 'z': case 'zz':
                    hourOffset = matchInt;
                    if (outOfRange(hourOffset, -12, 13)) return null;
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
    defaultYear = convert ? convert.fromGregorian(result)[0] : result.getFullYear();
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

$prototype = $type.prototype;
$prototype.format = function Date$format(format) {
    /// <summary locid="M:J#Date.format">Format a date using the invariant culture.</summary>
    /// <param name="format" type="String">Format string.</param>
    /// <returns type="String">Formatted date.</returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    return this._toFormattedString(format, Sys.CultureInfo.InvariantCulture);
}

$prototype.localeFormat = function Date$localeFormat(format) {
    /// <summary locid="M:J#Date.localeFormat">Format a date using the current culture.</summary>
    /// <param name="format" type="String">Format string.</param>
    /// <returns type="String">Formatted date.</returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
}

$prototype._toFormattedString = function Date$_toFormattedString(format, cultureInfo) {
    var dtf = cultureInfo.dateTimeFormat,
        convert = dtf.Calendar.convert;
    if (!format || !format.length || (format === 'i')) {
        var ret;
        if (cultureInfo && cultureInfo.name.length) {
            if (convert) {
                ret = this._toFormattedString(dtf.FullDateTimePattern, cultureInfo);
            }
            else {
                var eraDate = new Date(this.getTime());
                var era = getEra(this, dtf.eras);
                eraDate.setFullYear(getEraYear(this, dtf, era));
                ret = eraDate.toLocaleString();
            }
        }
        else {
            ret = this.toString();
        }
        return ret;
    }

    var eras = dtf.eras,
        sortable = (format === "s");
    format = Date._expandFormat(dtf, format);

    ret = [];
    var hour;

    var zeros = ['0','00','000'];
    function padZeros(num, c) {
        var s = num+'';
        return ((c > 1) && (s.length < c)) ? (zeros[c-2]+s).substr(-c) : s;
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
        quoteCount += Sys._appendPreOrPostMatch(preMatch, ret);

        if (!ar) break;

        if (quoteCount % 2) {
            ret.push(ar[0]);
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

        var current = ar[0],
            clength = current.length;

        switch (current) {
        case "ddd":
        case "dddd":
            names = (clength === 3) ? dtf.AbbreviatedDayNames : dtf.DayNames;
            ret.push(names[this.getDay()]);
            break;
        case "d":
        case "dd":
            foundDay = true;
            ret.push(padZeros(getPart(this, 2), clength));
            break;
        case "MMM":
        case "MMMM":
            var namePrefix = (clength === 3 ? "Abbreviated" : ""),
                genitiveNames = dtf[namePrefix + "MonthGenitiveNames"],
                names = dtf[namePrefix + "MonthNames"],
                part = getPart(this, 1);
            ret.push((genitiveNames && hasDay())
                ? genitiveNames[part]
                : names[part]);
            break;
        case "M":
        case "MM":
            ret.push(padZeros(getPart(this, 1) + 1, clength));
            break;
        case "y":
        case "yy":
        case "yyyy":
            part = converted ? converted[0] : getEraYear(this, dtf, getEra(this, eras), sortable);
            if (clength < 4) {
                part = part % 100;
            }
            ret.push(padZeros(part, clength));
            break;
        case "h":
        case "hh":
            hour = this.getHours() % 12;
            if (hour === 0) hour = 12;
            ret.push(padZeros(hour, clength));
            break;
        case "H":
        case "HH":
            ret.push(padZeros(this.getHours(), clength));
            break;
        case "m":
        case "mm":
            ret.push(padZeros(this.getMinutes(), clength));
            break;
        case "s":
        case "ss":
            ret.push(padZeros(this.getSeconds(), clength));
            break;
        case "t":
        case "tt":
            part = (this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator;
            ret.push(clength === 1 ? part.charAt(0) : part);
            break;
        case "f":
        case "ff":
        case "fff":
            ret.push(padZeros(this.getMilliseconds(), 3).substr(0, clength));
            break;
        case "z": 
        case "zz":
            hour = this.getTimezoneOffset() / 60;
            ret.push(((hour <= 0) ? '+' : '-') + padZeros(Math.floor(Math.abs(hour)), clength));
            break;
        case "zzz":
            hour = this.getTimezoneOffset() / 60;
            ret.push(((hour <= 0) ? '+' : '-') + padZeros(Math.floor(Math.abs(hour)), 2) +
                ":" + padZeros(Math.abs(this.getTimezoneOffset() % 60), 2));
            break;
        case "g":
        case "gg":
            if (dtf.eras) {
                ret.push(dtf.eras[getEra(this, eras) + 1]);
            }
            break;
        case "/":
            ret.push(dtf.DateSeparator);
            break;
        }
    }
    return ret.join('');
}
String.localeFormat = function String$localeFormat(format, args) {
    /// <summary locid="M:J#String.localeFormat">Replaces the format items in a specified String with the text equivalents of the values of   corresponding object instances. The current culture will be used to format dates and numbers.</summary>
    /// <param name="format" type="String">A format string.</param>
    /// <param name="args" parameterArray="true" mayBeNull="true">The objects to format.</param>
    /// <returns type="String">A copy of format in which the format items have been replaced by the   string equivalent of the corresponding instances of object arguments.</returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String},
        {name: "args", mayBeNull: true, parameterArray: true}
    ]);
    if (e) throw e;
    return String._toFormattedString(true, arguments);
}
var formattingPatterns = {
    P: ["Percent", ["-n %", "-n%", "-%n"], ["n %", "n%", "%n" ], 100],
    N: ["Number",["(n)","-n","- n","n-","n -"], null, 1],
    C: ["Currency",["($n)","-$n","$-n","$n-","(n$)","-n$","n-$","n$-","-n $","-$ n","n $-","$ n-","$ -n","n- $","($ n)","(n $)"],["$n","n$","$ n","n $"], 1]
};

Sys._toFormattedString = function _toFormattedString(format, cultureInfo) {
    if (!format || !format.length || (format === 'i')) {
        return (cultureInfo && cultureInfo.name.length) ?
            this.toLocaleString() :
            this.toString();
    }
    
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
        
        var numberString = number+'';
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
            right = decimalChar +
                ((right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision, false));
        }
        else {
            right = "";
        }

        var stringIndex = numberString.length-1;
        var ret = "";
        while (stringIndex >= 0) {
            if (curSize === 0 || curSize > stringIndex) {
                return numberString.slice(0, stringIndex + 1) +
                    (ret.length ? (sep + ret + right) : right);
            }

            ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) +
                (ret.length ? (sep+ret) : "");

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

    format = format || "D";

    var precision = -1;
    if (format.length > 1) precision = parseInt(format.slice(1), 10);

    var pattern,
        current = format.charAt(0).toUpperCase();    
    switch (current) {
    case "D":
        pattern = 'n';

        if (precision !== -1) {
            number = zeroPad(""+number, precision, true);
        }

        if (this < 0) number = -number;
        break;
    case "C":
    case "N":
    case "P":
        current = formattingPatterns[current];
        var name = current[0];
        pattern = (this < 0) ? current[1][nf[name+"NegativePattern"]] : (current[2] ? current[2][nf[name+"PositivePattern"]] : "n");
        if (precision === -1) precision = nf[name+"DecimalDigits"];
        number = expandNumber(Math.abs(this)*current[3], precision, nf[name+"GroupSizes"], nf[name+"GroupSeparator"], nf[name+"DecimalSeparator"]);
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

$type = Number;
$type.parseLocale = function Number$parseLocale(value) {
    /// <summary locid="M:J#Number.parseLocale">Creates a number from its locale string representation.</summary>
    /// <param name="value" type="String">A string that can parse to a number.</param>
    /// <returns type="Number"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ], false);
    if (e) throw e;
    return Number._parse(value, Sys.CultureInfo.CurrentCulture);
}
$type.parseInvariant = function Number$parseInvariant(value) {
    /// <summary locid="M:J#Number.parseInvariant">Creates a number from its string representation.</summary>
    /// <param name="value" type="String">A string that can parse to a number.</param>
    /// <returns type="Number"></returns>
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ], false);
    if (e) throw e;
    return Number._parse(value, Sys.CultureInfo.InvariantCulture);
}
$type._parse = function Number$_parse(value, cultureInfo) {
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
    var decSep = numFormat.NumberDecimalSeparator
    var decimalPos = intAndFraction.indexOf(decSep);
    if (decimalPos < 0) {
        integer = intAndFraction;
        fraction = null;
    }
    else {
        integer = intAndFraction.substr(0, decimalPos);
        fraction = intAndFraction.substr(decimalPos + decSep.length);
    }
    
    var numGroupSep = numFormat.NumberGroupSeparator
    integer = integer.split(numGroupSep).join('');
    var altNumGroupSeparator = numGroupSep.replace(/\u00A0/g, " ");
    if (numGroupSep !== altNumGroupSeparator) {
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
$type._parseNumberNegativePattern = function Number$_parseNumberNegativePattern(value, numFormat, numberNegativePattern) {
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

$prototype = $type.prototype;
$prototype.format = function Number$format(format) {
    /// <summary locid="M:J#Number.format">Format a number using the invariant culture.</summary>
    /// <param name="format" type="String">Format string.</param>
    /// <returns type="String">Formatted number.</returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    return Sys._toFormattedString.call(this, format, Sys.CultureInfo.InvariantCulture);
}
$prototype.localeFormat = function Number$localeFormat(format) {
    /// <summary locid="M:J#Number.localeFormat">Format a number using the current culture.</summary>
    /// <param name="format" type="String">Format string.</param>
    /// <returns type="String">Formatted number.</returns>
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    return Sys._toFormattedString.call(this, format, Sys.CultureInfo.CurrentCulture);
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

$type = Sys.CultureInfo = function CultureInfo(name, numberFormat, dateTimeFormat) {
    /// <summary locid="M:J#Sys.CultureInfo.#ctor"></summary>
    /// <param name="name" type="String">CultureInfo name.</param>
    /// <param name="numberFormat" type="Object">CultureInfo number format information.</param>
    /// <param name="dateTimeFormat" type="Object">CultureInfo date time format information.</param>
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
$type.prototype = {
    _getDateTimeFormats: function CultureInfo$_getDateTimeFormats() {
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

$type._setup();


}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Globalization", null, execute);
}
else {
	execute();
}

})();
