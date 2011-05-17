var formattingPatterns = {
    // name, negativePattern, positivePattern, multiplyBy
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
    
    // Handles expanding numbers into some specified grouping i.e. [2, 3, 5] would be ...,XXXXX,XXXXX,XXX,XX,
    function expandNumber(number, precision, groupSizes, sep, decimalChar) {
        var curSize = groupSizes[0];
        var curGroupIndex = 1;

        // Round the number off to the correct number of decimal places

        // note: we could use the built-in toFixed(precision), which would give us a rounded
        // off number with the right number of digits, but it is inconsistent across browsers
        // when it comes to rounding errors. It also only supports up to 20 digits, after which
        // all browsers start throwing an error.

        var factor = Math.pow(10, precision);
        // shift decimal place so that we can round to a whole number, then shift back again
        var rounded = (Math.round(number * factor) / factor);
        if (!isFinite(rounded)) {
            // multiplying by the factor may have caused the number to reach Infinity,
            // in which case we will not try to round it.
            rounded = number;
        }
        number = rounded;
        
        // Make the number a string
        var numberString = number+'';
        var right = "";
        var exponent;
        
        // Exponent may or may not exist with a decimal point.
        // If it does it is always after the decimal point.
        
        // Split: left is integer and decimal, right exponent.
        // e.g. 1.234e+10 or 1e+10
        var split = numberString.split(/e/i);
        numberString = split[0];
        exponent = (split.length > 1 ? parseInt(split[1]) : 0);
        // Split: left is integer, right is decimal
        // e.g. 1.234 or 1234
        split = numberString.split('.');
        numberString = split[0];
        right = split.length > 1 ? split[1] : "";
        
        // expand exponents
        var l;
        if (exponent > 0) {
            // positive exponent, shift digits from decimal to number
            // make sure decimal is at least that many digits long, padded right with 0s
            right = zeroPad(right, exponent, false);
            // add digits to the end of number
            numberString += right.slice(0, exponent);
            // and remove from beginning decimal
            right = right.substr(exponent);
        }
        else if (exponent < 0) {
            exponent = -exponent;
            // negative exponent, shift digits from number to decimal
            // make sure number is at least that many digits long, plus 1, padded left with 0s,
            // so we know it will always have at least '0' left over.
            numberString = zeroPad(numberString, exponent+1, true);
            // add digits to the beginning of decimal
            right = numberString.slice(-exponent, numberString.length) + right;
            // and remove from the end of number
            numberString = numberString.slice(0, -exponent);
        }

        // now check precision, if its 0, drop right, otherwise pad it
        if (precision > 0) {
            // trim right down to precision size and add the separator
            right = decimalChar +
                ((right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision, false));
        }
        else {
            // No precision wanted, so drop the right
            right = "";
        }

        var stringIndex = numberString.length-1;
        var ret = "";
        while (stringIndex >= 0) {
            // group size of 0 or larger than the rest of the string means take the rest of the string
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

    // Number is always positive for printing purposes (negative treated separately)
    var number = Math.abs(this);

    // Default to number format
    format = format || "D";

    var precision = -1;
    if (format.length > 1) precision = parseInt(format.slice(1), 10);

    var pattern,
        current = format.charAt(0).toUpperCase();    
    switch (current) {
    case "D":
        pattern = 'n';

        // precision for decimal is padding
        if (precision !== -1) {
            number = zeroPad(""+number, precision, true);
        }

        // We do want the negative for this scenario only
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

    // Start with an empty string
    var ret = "";

    for (;;) {

        // Save the current index
        var index = regex.lastIndex;

        // Look for the next pattern
        var ar = regex.exec(pattern);

        // Append the text before the pattern (or the end of the string if not found)
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
            // Dev10 Bug 436534: Only add '-' sign for non zero numbers.
            if (/[1-9]/.test(number)) {
                ret += nf.NegativeSign;
            }
            break;
        case "%":
            ret += nf.PercentSymbol;
            break;
        //#if DEBUGINTERNAL
        default:
            Sys.Debug.fail("Invalid number format pattern");
        //#endif
        }
    }

    return ret;
}

$type = Number;
$type.parseLocale = function Number$parseLocale(value) {
    /// <summary locid="M:J#Number.parseLocale">Creates a number from its locale string representation.</summary>
    /// <param name="value" type="String">A string that can parse to a number.</param>
    /// <returns type="Number"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ], false);
    if (e) throw e;
    //#endif
    return Number._parse(value, Sys.CultureInfo.CurrentCulture);
}
$type.parseInvariant = function Number$parseInvariant(value) {
    /// <summary locid="M:J#Number.parseInvariant">Creates a number from its string representation.</summary>
    /// <param name="value" type="String">A string that can parse to a number.</param>
    /// <returns type="Number"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "value", type: String}
    ], false);
    if (e) throw e;
    //#endif
    return Number._parse(value, Sys.CultureInfo.InvariantCulture);
}
$type._parse = function Number$_parse(value, cultureInfo) {
    // <param name="value" type="String">A string that can parse to a number.</param>
    // <param name="cultureInfo" type="Sys.CultureInfo">Culture information.</param>
    // <returns type="Number">Parsed number or Number.NaN if parsing failed.</returns>
    value = value.trim();
    
    // allow infinity or hexidecimal for javascript compatability.
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
    
    // support leading sign without space in addition to culture negative format for .NET compatability
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
    
    // strip group separators from the integer portion
    var numGroupSep = numFormat.NumberGroupSeparator
    integer = integer.split(numGroupSep).join('');
    // allow spaces in place of non-breaking spaces (\u00A0) in group separators.
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

    // don't allow multiple decimals separators, group separators after decimal or trailing strings.
    if (p.match(/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/)) {
        return parseFloat(p);
    }
    return Number.NaN;
}
$type._parseNumberNegativePattern = function Number$_parseNumberNegativePattern(value, numFormat, numberNegativePattern) {
    // <summary>
    //     Extracts the sign and number from a numeric input string using the culture-specific number format
    //     information and number negative pattern.
    // </summary>
    // <param name="value" type="String">Numerical string value.</param>
    // <param name="numFormat" type="Object">Culture-specific number formatting information.</param>
    // <param name="numberNegativePattern" type="Number">Culture-specific specifier for the negative number format.
    // </param>
    // <returns type="Array">Sign and number for the input value.  The sign is the invariant symbol or an empty
    //     string if the number was unsigned.
    // </returns>
    var neg = numFormat.NegativeSign;
    var pos = numFormat.PositiveSign;    
    switch (numberNegativePattern) {
        case 4:
            // trailing sign with space
            neg = ' ' + neg;
            pos = ' ' + pos;
        case 3:
            // trailing sign no space
            if (value.endsWith(neg)) {
                return ['-', value.substr(0, value.length - neg.length)];
            }
            else if (value.endsWith(pos)) {
                return ['+', value.substr(0, value.length - pos.length)];
            }
            break;
        case 2:
            // leading sign with space
            neg += ' ';
            pos += ' ';
        case 1:
            // leading sign no space
            if (value.startsWith(neg)) {
                return ['-', value.substr(neg.length)];
            }
            else if (value.startsWith(pos)) {
                return ['+', value.substr(pos.length)];
            }
            break;
        case 0:
            // parenthesis
            if (value.startsWith('(') && value.endsWith(')')) {
                return ['-', value.substr(1, value.length - 2)];
            }
            break;
//#if DEBUGINTERNAL
        default:
            Sys.Debug.fail("");
//#endif
    }
    return ['', value];
}

$prototype = $type.prototype;
$prototype.format = function Number$format(format) {
    /// <summary locid="M:J#Number.format">Format a number using the invariant culture.</summary>
    /// <param name="format" type="String">Format string.</param>
    /// <returns type="String">Formatted number.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    //#endif
    return Sys._toFormattedString.call(this, format, Sys.CultureInfo.InvariantCulture);
}
$prototype.localeFormat = function Number$localeFormat(format) {
    /// <summary locid="M:J#Number.localeFormat">Format a number using the current culture.</summary>
    /// <param name="format" type="String">Format string.</param>
    /// <returns type="String">Formatted number.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "format", type: String}
    ]);
    if (e) throw e;
    //#endif
    return Sys._toFormattedString.call(this, format, Sys.CultureInfo.CurrentCulture);
}
