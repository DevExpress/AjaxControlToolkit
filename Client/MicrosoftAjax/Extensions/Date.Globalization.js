function outOfRange(value, low, high) {
    return (value < low) || (value > high);
}

function expandYear(dtf, year) {
    // expands 2-digit year into 4 digits.
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
        // convert normal gregorian year to era-shifted gregorian
        // year by subtracting the era offset
        year -= dtf.eras[era + 3];
    }    
    return year;
}

Sys._appendPreOrPostMatch = function _appendPreOrPostMatch(preMatch, strings) {
    // appends pre- and post- token match strings while removing escaped characters.
    // Returns a single quote count which is used to determine if the token occurs
    // in a string literal.
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
    // expands unspecified or single character date formats into the full pattern.
    format = format || "F";
    var len = format.length;
    if (len === 1) {
        switch (format) {
        // these are quoted to aid in minimization
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
        // Dev10 580024: %X escape format -- intended as a custom format string that
        // is only one character, not a built-in format.
        format = format.charAt(1);
    }
    return format;
}

$type._getParseRegExp = function Date$_getParseRegExp(dtf, format) {
    // converts a format string into a regular expression with groups that
    // can be used to extract date fields from a date string.
    // check for a cached parse regex.
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

    // expand single digit formats, then escape regular expression characters.
    var expFormat = Date._expandFormat(dtf, format);
    expFormat = expFormat.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");

    var regexp = ["^"];
    var groups = [];
    var index = 0;
    var quoteCount = 0;
    var tokenRegExp = Date._getTokenRegExp();
    var match;

    // iterate through each date token found.
    while ((match = tokenRegExp.exec(expFormat)) !== null) {
        var preMatch = expFormat.slice(index, match.index);
        index = tokenRegExp.lastIndex;

        // don't replace any matches that occur inside a string literal.
        quoteCount += Sys._appendPreOrPostMatch(preMatch, regexp);
        if (quoteCount % 2) {
            regexp.push(match[0]);
            continue;
        }

        // add a regex group for the token.
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
            //#if DEBUGINTERNAL
            default:
                Sys.Debug.fail("Invalid date format pattern");
            //#endif
        }
        if (add) {
            regexp.push(add);
        }
        groups.push(match[0]);
    }
    Sys._appendPreOrPostMatch(expFormat.slice(index), regexp);
    regexp.push("$");
    // allow whitespace to differ when matching formats.
    var regexpStr = regexp.join('').replace(/\s+/g, "\\s+");
    var parseRegExp = {'regExp': regexpStr, 'groups': groups};
    // cache the regex for this format.
    re[format] = parseRegExp;
    return parseRegExp;
}

$type._getTokenRegExp = function Date$_getTokenRegExp() {
    // regular expression for matching dateTime tokens in format strings.
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
}

$type.parseLocale = function Date$parseLocale(value, formats) {
    /// <summary locid="M:J#Date.parseLocale">Creates a date from a locale-specific string representation.</summary>
    /// <param name="value" type="String">A locale-specific string that can parse to a date.</param>
    /// <param name="formats" parameterArray="true" optional="true" mayBeNull="true">Custom formats to match.</param>
    /// <returns type="Date"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "value", type: String},
        {name: "formats", mayBeNull: true, optional: true, parameterArray: true}
    ]);
    if (e) throw e;
    //#endif
    return Date._parse(value, Sys.CultureInfo.CurrentCulture, arguments);
}

$type.parseInvariant = function Date$parseInvariant(value, formats) {
    /// <summary locid="M:J#Date.parseInvariant">Creates a date from its string representation.</summary>
    /// <param name="value" type="String">A string that can parse to a date.</param>
    /// <param name="formats" parameterArray="true" optional="true" mayBeNull="true">Custom formats to match.</param>
    /// <returns type="Date"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "value", type: String},
        {name: "formats", mayBeNull: true, optional: true, parameterArray: true}
    ]);
    if (e) throw e;
    //#endif
    return Date._parse(value, Sys.CultureInfo.InvariantCulture, arguments);
}

$type._parse = function Date$_parse(value, cultureInfo, args) {
    // args is a params array with value as the first item, followed by custom formats.
    // try parse with custom formats.
    var i, l, date, format, formats, custom = false;
    for (i = 1, l = args.length; i < l; i++) {
        format = args[i];
        if (format) {
            custom = true;
            date = Date._parseExact(value, format, cultureInfo);
            if (date) return date;
        }
    }
    // try parse with culture formats.
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
    // try to parse the date string value by matching against the format string
    // while using the specified culture for date field names.
    value = value.trim();
    var dtf = cultureInfo.dateTimeFormat,
    // convert date formats into regular expressions with groupings.
    // use the regexp to determine the input format and extract the date fields.
        parseInfo = this._getParseRegExp(dtf, format),
        match = new RegExp(parseInfo.regExp).exec(value);
    // DevDiv 124696: Return null to avoid Firefox warning "does not always return a value"
    if (match === null) return null;
    
    // found a date format that matches the input.
    var groups = parseInfo.groups,
        era = null, year = null, month = null, date = null, weekDay = null,
        hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
        pmHour = false;
    
    // iterate the format groups to extract and set the date fields.
    for (var j = 0, jl = groups.length; j < jl; j++) {
        var matchGroup = match[j+1];
        if (matchGroup) {
            var current = groups[j],
                clength = current.length,
                matchInt = parseInt(matchGroup, 10);
            switch (current) {
                case 'dd': case 'd':
                    // Day of month.
                    date = matchInt;
                    // check that date is generally in valid range, also checking overflow below.
                    if (outOfRange(date, 1, 31)) return null;
                    break;
                case 'MMM':
                case 'MMMM':
                    month = cultureInfo._getMonthIndex(matchGroup, clength === 3);
                    if (outOfRange(month, 0, 11)) return null;
                    break;
                case 'M': case 'MM':
                    // Month.
                    month = matchInt - 1;
                    if (outOfRange(month, 0, 11)) return null;
                    break;
                case 'y': case 'yy':
                case 'yyyy':
                    year = clength < 4 ? expandYear(dtf,matchInt) : matchInt;
                    if (outOfRange(year, 0, 9999)) return null;
                    break;
                case 'h': case 'hh':
                    // Hours (12-hour clock).
                    hour = matchInt;
                    if (hour === 12) hour = 0;
                    if (outOfRange(hour, 0, 11)) return null;
                    break;
                case 'H': case 'HH':
                    // Hours (24-hour clock).
                    hour = matchInt;
                    if (outOfRange(hour, 0, 23)) return null;
                    break;
                case 'm': case 'mm':
                    // Minutes.
                    min = matchInt;
                    if (outOfRange(min, 0, 59)) return null;
                    break;
                case 's': case 'ss':
                    // Seconds.
                    sec = matchInt;
                    if (outOfRange(sec, 0, 59)) return null;
                    break;
                case 'tt': case 't':
                    // AM/PM designator.
                    var upperToken = matchGroup.toUpperCase();
                    pmHour = (upperToken === dtf.PMDesignator.toUpperCase());
                    if (!pmHour && (upperToken !== dtf.AMDesignator.toUpperCase())) return null;
                    break;
                case 'f':
                    // Deciseconds.
                case 'ff':
                    // Centiseconds.
                case 'fff':
                    // Milliseconds.
                    msec = matchInt * Math.pow(10, 3-clength);
                    if (outOfRange(msec, 0, 999)) return null;
                    break;
                case 'ddd':
                    // Day of week.
                case 'dddd':
                    // Day of week.
                    weekDay = cultureInfo._getDayIndex(matchGroup, clength === 3);
                    if (outOfRange(weekDay, 0, 6)) return null;
                    break;
                case 'zzz':
                    // Time zone offset in +/- hours:min.
                    var offsets = matchGroup.split(/:/);
                    if (offsets.length !== 2) return null;
                    hourOffset = parseInt(offsets[0], 10);
                    if (outOfRange(hourOffset, -12, 13)) return null;
                    var minOffset = parseInt(offsets[1], 10);
                    if (outOfRange(minOffset, 0, 59)) return null;
                    tzMinOffset = (hourOffset * 60) + (matchGroup.startsWith('-')? -minOffset : minOffset);
                    break;
                case 'z': case 'zz':
                    // Time zone offset in +/- hours.
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
                    // could not find an era with that name
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
        // year must be shifted to normal gregorian year
        // but not if year was not specified, its already normal gregorian
        // per the main if clause above.
        year += dtf.eras[(era || 0) + 3];
    }
    // Dev10 747832: set default day and month to 1 and January to be consistent with .Net behavior.
    if (month === null) {
        month = 0;
    }
    if (date === null) {
        date = 1;
    }
    // now have year, month, and date, but in the culture's calendar.
    // convert to gregorian if necessary
    if (convert) {
        result = convert.toGregorian(year, month, date);
        // conversion failed, must be an invalid match
        if (result === null) return null;
    }
    else {
        // have to set year, month and date together to avoid overflow based on current date.
        result.setFullYear(year, month, date);
        // check to see if date overflowed for specified month (only checked 1-31 above).
        if (result.getDate() !== date) return null;
        // invalid day of week.
        if ((weekDay !== null) && (result.getDay() !== weekDay)) {
            return null;
        }
    }
    // if pm designator token was found make sure the hours fit the 24-hour clock.
    if (pmHour && (hour < 12)) {
        hour += 12;
    }
    result.setHours(hour, min, sec, msec);
    if (tzMinOffset !== null) {
        // adjust timezone to utc before applying local offset.
        var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
        // Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
        // to ensure both these fields will not exceed this range.  adjustedMin will range
        // somewhere between -1440 and 1500, so we only need to split this into hours.
        result.setHours(result.getHours() + parseInt(adjustedMin/60, 10), adjustedMin%60);
    }
    return result;
}

$prototype = $type.prototype;
$prototype.format = function Date$format(format) {
    /// <summary locid="M:J#Date.format">Format a date using the invariant culture.</summary>
    /// <param name="format" type="String">Format string.</param>
    /// <returns type="String">Formatted date.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    //#endif
    return this._toFormattedString(format, Sys.CultureInfo.InvariantCulture);
}

$prototype.localeFormat = function Date$localeFormat(format) {
    /// <summary locid="M:J#Date.localeFormat">Format a date using the current culture.</summary>
    /// <param name="format" type="String">Format string.</param>
    /// <returns type="String">Formatted date.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    //#endif
    return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
}

$prototype._toFormattedString = function Date$_toFormattedString(format, cultureInfo) {
    var dtf = cultureInfo.dateTimeFormat,
        convert = dtf.Calendar.convert;
    if (!format || !format.length || (format === 'i')) {
        var ret;
        if (cultureInfo && cultureInfo.name.length) {
            if (convert) {
                // non-gregorian calendar, so we cannot use built-in toLocaleString()
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

    // Start with an empty string
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

        // Save the current index
        var index = tokenRegExp.lastIndex;

        // Look for the next pattern
        var ar = tokenRegExp.exec(format);

        // Append the text before the pattern (or the end of the string if not found)
        var preMatch = format.slice(index, ar ? ar.index : format.length);
        quoteCount += Sys._appendPreOrPostMatch(preMatch, ret);

        if (!ar) break;

        // do not replace any matches that occur inside a string literal.
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
            //Day of the week, as a three-letter abbreviation        
        case "dddd":
            // Day of the week, using the full name
            names = (clength === 3) ? dtf.AbbreviatedDayNames : dtf.DayNames;
            ret.push(names[this.getDay()]);
            break;
        case "d":
            // Day of month, without leading zero for single-digit days
        case "dd":
            // Day of month, with leading zero for single-digit days
            foundDay = true;
            ret.push(padZeros(getPart(this, 2), clength));
            break;
        case "MMM":
            // Month, as a three-letter abbreviation
        case "MMMM":
            // Month, using the full name
            var namePrefix = (clength === 3 ? "Abbreviated" : ""),
                genitiveNames = dtf[namePrefix + "MonthGenitiveNames"],
                names = dtf[namePrefix + "MonthNames"],
                part = getPart(this, 1);
            ret.push((genitiveNames && hasDay())
                ? genitiveNames[part]
                : names[part]);
            break;
        case "M":
            // Month, as digits, with no leading zero for single-digit months
        case "MM":
            // Month, as digits, with leading zero for single-digit months
            ret.push(padZeros(getPart(this, 1) + 1, clength));
            break;
        case "y":
            // Year, as two digits, but with no leading zero for years less than 10
        case "yy":
            // Year, as two digits, with leading zero for years less than 10
        case "yyyy":
            // Year represented by four full digits
            part = converted ? converted[0] : getEraYear(this, dtf, getEra(this, eras), sortable);
            if (clength < 4) {
                part = part % 100;
            }
            ret.push(padZeros(part, clength));
            break;
        case "h":
            // Hours with no leading zero for single-digit hours, using 12-hour clock
        case "hh":
            // Hours with leading zero for single-digit hours, using 12-hour clock
            hour = this.getHours() % 12;
            if (hour === 0) hour = 12;
            ret.push(padZeros(hour, clength));
            break;
        case "H":
            // Hours with no leading zero for single-digit hours, using 24-hour clock
        case "HH":
            // Hours with leading zero for single-digit hours, using 24-hour clock
            ret.push(padZeros(this.getHours(), clength));
            break;
        case "m":
            // Minutes with no leading zero  for single-digit minutes
        case "mm":
            // Minutes with leading zero  for single-digit minutes
            ret.push(padZeros(this.getMinutes(), clength));
            break;
        case "s":
            // Seconds with no leading zero for single-digit seconds
        case "ss":
            // Seconds with leading zero for single-digit seconds
            ret.push(padZeros(this.getSeconds(), clength));
            break;
        case "t":
            // One character am/pm indicator ("a" or "p")
        case "tt":
            // Multicharacter am/pm indicator
            part = (this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator;
            ret.push(clength === 1 ? part.charAt(0) : part);
            break;
        case "f":
            // Deciseconds
        case "ff":
            // Centiseconds
        case "fff":
            // Milliseconds
            ret.push(padZeros(this.getMilliseconds(), 3).substr(0, clength));
            break;
        case "z": 
            // Time zone offset, no leading zero
        case "zz":
            // Time zone offset with leading zero
            hour = this.getTimezoneOffset() / 60;
            ret.push(((hour <= 0) ? '+' : '-') + padZeros(Math.floor(Math.abs(hour)), clength));
            break;
        case "zzz":
            // Time zone offset with leading zero
            hour = this.getTimezoneOffset() / 60;
            ret.push(((hour <= 0) ? '+' : '-') + padZeros(Math.floor(Math.abs(hour)), 2) +
                // Dev10 580009: Server has hard coded ":" separator, rather than using dtf.TimeSeparator
                // Repeated here for consistency, plus ":" was already assumed in date parsing.
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
        //#if DEBUGINTERNAL
        default:
            Sys.Debug.fail("Invalid date format pattern");
        //#endif
        }
    }
    return ret.join('');
}
