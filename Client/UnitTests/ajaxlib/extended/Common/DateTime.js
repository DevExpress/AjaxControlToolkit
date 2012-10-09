


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../Common/Common.js" />

(function() {
var scriptName = "ExtendedDateTime";

function execute() {


Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.TimeSpan = function() {
    /// <summary>
    /// Represents a period of time
    /// </summary>
    
    if (arguments.length == 0) this._ctor$0.apply(this, arguments);
    else if (arguments.length == 1) this._ctor$1.apply(this, arguments);
    else if (arguments.length == 3) this._ctor$2.apply(this, arguments);
    else if (arguments.length == 4) this._ctor$3.apply(this, arguments);
    else if (arguments.length == 5) this._ctor$4.apply(this, arguments);
    else throw Error.parameterCount();
}
Sys.Extended.UI.TimeSpan.prototype = {

    _ctor$0 : function() {
        /// <summary>
        /// Initializes a new TimeSpan
        /// </summary>
        
        this._ticks = 0;
    }, 
    _ctor$1 : function(ticks) {
        /// <summary>
        /// Initializes a new TimeSpan
        /// </summary>
        /// <param name="ticks" type="Number" integer="true">The number of ticks in the TimeSpan</param>

        this._ctor$0();
        this._ticks = ticks;
    },
    _ctor$2 : function(hours, minutes, seconds) {
        /// <summary>
        /// Initializes a new TimeSpan
        /// </summary>
        /// <param name="hours" type="Number">The number of hours in the TimeSpan</param>
        /// <param name="minutes" type="Number">The number of minutes in the TimeSpan</param>
        /// <param name="seconds" type="Number">The number of seconds in the TimeSpan</param>
        
        this._ctor$0();
        this._ticks = 
            (hours * Sys.Extended.UI.TimeSpan.TicksPerHour) +
            (minutes * Sys.Extended.UI.TimeSpan.TicksPerMinute) +
            (seconds * Sys.Extended.UI.TimeSpan.TicksPerSecond); 
    },
    _ctor$3 : function(days, hours, minutes, seconds) {
        /// <summary>
        /// Initializes a new TimeSpan
        /// </summary>
        /// <param name="days" type="Number">The number of days in the TimeSpan</param>
        /// <param name="hours" type="Number">The number of hours in the TimeSpan</param>
        /// <param name="minutes" type="Number">The number of minutes in the TimeSpan</param>
        /// <param name="seconds" type="Number">The number of seconds in the TimeSpan</param>

        this._ctor$0();
        this._ticks = 
            (days * Sys.Extended.UI.TimeSpan.TicksPerDay) +
            (hours * Sys.Extended.UI.TimeSpan.TicksPerHour) +
            (minutes * Sys.Extended.UI.TimeSpan.TicksPerMinute) +
            (seconds * Sys.Extended.UI.TimeSpan.TicksPerSecond); 
    },
    _ctor$4 : function(days, hours, minutes, seconds, milliseconds) {
        /// <summary>
        /// Initializes a new TimeSpan
        /// </summary>
        /// <param name="days" type="Number">The number of days in the TimeSpan</param>
        /// <param name="hours" type="Number">The number of hours in the TimeSpan</param>
        /// <param name="minutes" type="Number">The number of minutes in the TimeSpan</param>
        /// <param name="seconds" type="Number">The number of seconds in the TimeSpan</param>
        /// <param name="milliseconds" type="Number">The number of milliseconds in the TimeSpan</param>

        this._ctor$0();
        this._ticks = 
            (days * Sys.Extended.UI.TimeSpan.TicksPerDay) +
            (hours * Sys.Extended.UI.TimeSpan.TicksPerHour) +
            (minutes * Sys.Extended.UI.TimeSpan.TicksPerMinute) +
            (seconds * Sys.Extended.UI.TimeSpan.TicksPerSecond) +
            (milliseconds * Sys.Extended.UI.TimeSpan.TicksPerMillisecond); 
    },

    getDays : function() { 
        /// <summary>
        /// Gets the days part of the TimeSpan
        /// </summary>
        /// <returns type="Number" />
        
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerDay); 
    },
    getHours : function() { 
        /// <summary>
        /// Gets the hours part of the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerHour) % 24; 
    },
    getMinutes : function() { 
        /// <summary>
        /// Gets the minutes part of the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerMinute) % 60; 
    },
    getSeconds : function() { 
        /// <summary>
        /// Gets the seconds part of the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerSecond) % 60; 
    },
    getMilliseconds : function() { 
        /// <summary>
        /// Gets the milliseconds part of the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerMillisecond) % 1000; 
    },
    getDuration : function() { 
        /// <summary>
        /// Gets the total duration of a TimeSpan
        /// </summary>
        /// <returns type="Sys.Extended.UI.TimeSpan" />

        return new Sys.Extended.UI.TimeSpan(Math.abs(this._ticks)); 
    },
    getTicks : function() { 
        /// <summary>
        /// Gets the ticks in the TimeSpan
        /// </summary>
        /// <returns type="Number" />
    
        return this._ticks; 
    },
    getTotalDays : function() { 
        /// <summary>
        /// Gets the total number of days in the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerDay); 
    },
    getTotalHours : function() { 
        /// <summary>
        /// Gets the total hours in the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerHour); 
    },
    getTotalMinutes : function() { 
        /// <summary>
        /// Gets the total minutes in the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerMinute); 
    },
    getTotalSeconds : function() { 
        /// <summary>
        /// Gets the total seconds in the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerSecond); 
    },
    getTotalMilliseconds : function() { 
        /// <summary>
        /// Gets the total milliseconds in the TimeSpan
        /// </summary>
        /// <returns type="Number" />

        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerMillisecond); 
    },
    add : function(value) { 
        /// <summary>
        /// Adds the supplied TimeSpan to this TimeSpan
        /// </summary>
        /// <param name="value" type="Sys.Extended.UI.TimeSpan">The TimeSpan to add</param>
        /// <returns type="Sys.Extended.UI.TimeSpan" />

        return new Sys.Extended.UI.TimeSpan(this._ticks + value.getTicks()); 
    },
    subtract : function(value) { 
        /// <summary>
        /// Subtracts the supplied TimeSpan to this TimeSpan
        /// </summary>
        /// <param name="value" type="Sys.Extended.UI.TimeSpan">The TimeSpan to subtract</param>
        /// <returns type="Sys.Extended.UI.TimeSpan" />

        return new Sys.Extended.UI.TimeSpan(this._ticks - value.getTicks()); 
    },
    negate : function() { 
        /// <summary>
        /// Negates the TimeSpan
        /// </summary>
        /// <returns type="Sys.Extended.UI.TimeSpan" />

        return new Sys.Extended.UI.TimeSpan(-this._ticks); 
    },
    equals : function(value) { 
        /// <summary>
        /// Whether this TimeSpan equals another TimeSpan
        /// </summary>
        /// <param name="value" type="Sys.Extended.UI.TimeSpan">The TimeSpan to test</param>
        /// <returns type="Sys.Extended.UI.TimeSpan" />

        return this._ticks == value.getTicks(); 
    },
    compareTo : function(value) { 
        /// <summary>
        /// Whether this TimeSpan greater or less than another TimeSpan
        /// </summary>
        /// <param name="value" type="Sys.Extended.UI.TimeSpan">The TimeSpan to test</param>
        /// <returns type="Sys.Extended.UI.TimeSpan" />

        if(this._ticks > value.getTicks()) 
            return 1; 
        else if(this._ticks < value.getTicks()) 
            return -1; 
        else 
            return 0; 
    },
    toString : function() { 
        /// <summary>
        /// Gets the string representation of the TimeSpan
        /// </summary>
        /// <returns type="String" />

        return this.format("F"); 
    },
    format : function(format) {    
        /// <summary>
        /// Gets the string representation of the TimeSpan
        /// </summary>
        /// <param name="format" type="String" mayBeNull="true">The format specifier used to format the TimeSpan</param>
        /// <returns type="String" />

        if (!format) {
            format = "F";
        }
        if (format.length == 1) {
            switch (format) {
                case "t": format = Sys.Extended.UI.TimeSpan.ShortTimeSpanPattern; break;
                case "T": format = Sys.Extended.UI.TimeSpan.LongTimeSpanPattern; break;
                case "F": format = Sys.Extended.UI.TimeSpan.FullTimeSpanPattern; break;
                default: throw Error.createError(String.format(Sys.Extended.UI.Resources.Common_DateTime_InvalidTimeSpan, format));
            }
        }
        var regex = /dd|d|hh|h|mm|m|ss|s|nnnn|nnn|nn|n/g;
        var builder = new Sys.StringBuilder();
        var ticks = this._ticks;
        if (ticks < 0) {
            builder.append("-");            
            ticks = -ticks;
        }
        for (;;) {
            var index = regex.lastIndex;
            var ar = regex.exec(format);
            builder.append(format.slice(index, ar ? ar.index : format.length));
            if (!ar) break;
            switch (ar[0]) {
                case "dd":
                case "d":
                    builder.append($common.padLeft(Math.floor(ticks / Sys.Extended.UI.TimeSpan.TicksPerDay, ar[0].length, '0')));
                    break;
                case "hh":
                case "h":
                    builder.append($common.padLeft(Math.floor(ticks / Sys.Extended.UI.TimeSpan.TicksPerHour) % 24, ar[0].length, '0'));
                    break;
                case "mm":
                case "m":
                    builder.append($common.padLeft(Math.floor(ticks / Sys.Extended.UI.TimeSpan.TicksPerMinute) % 60, ar[0].length, '0'));
                    break;
                case "ss":
                case "s":
                    builder.append($common.padLeft(Math.floor(ticks / Sys.Extended.UI.TimeSpan.TicksPerSecond) % 60, ar[0].length, '0'));
                    break;
                case "nnnn":
                case "nnn":
                case "nn":
                case "n":
                    builder.append($common.padRight(Math.floor(ticks / Sys.Extended.UI.TimeSpan.TicksPerMillisecond) % 1000, ar[0].length, '0', true));
                    break;
                default:
                    Sys.Debug.assert(false);
            }
        }
        return builder.toString();
    }
}
Sys.Extended.UI.TimeSpan.parse = function(text) {
    /// <summary>
    /// Parses a text value into a TimeSpan
    /// </summary>
    /// <param name="text" type="String">The text to parse</param>
    /// <returns type="Sys.Extended.UI.TimeSpan" />

    var parts = text.split(":");
    var d = 0;
    var h = 0;
    var m = 0;
    var s = 0;
    var n = 0;
    var ticks = 0;    
    switch(parts.length) {
        case 1:
            if (parts[0].indexOf(".") != -1) {
                var parts2 = parts[0].split(".");
                s = parseInt(parts2[0]);
                n = parseInt(parts2[1]);
            } else {
                ticks = parseInt(parts[0]);
            }
            break;
        case 2:
            h = parseInt(parts[0]);
            m = parseInt(parts[1]);
            break;
        case 3:
            h = parseInt(parts[0]);
            m = parseInt(parts[1]);
            if (parts[2].indexOf(".") != -1) {
                var parts2 = parts[2].split(".");
                s = parseInt(parts2[0]);
                n = parseInt(parts2[1]);
            } else {
                s = parseInt(parts[2]);
            }
            break;
        case 4:
            d = parseInt(parts[0]);
            h = parseInt(parts[1]);
            m = parseInt(parts[2]);
            if (parts[3].indexOf(".") != -1) {
                var parts2 = parts[3].split(".");
                s = parseInt(parts2[0]);
                n = parseInt(parts2[1]);
            } else {
                s = parseInt(parts[3]);
            }
            break;
    }
    ticks += (d * Sys.Extended.UI.TimeSpan.TicksPerDay) +
             (h * Sys.Extended.UI.TimeSpan.TicksPerHour) +
             (m * Sys.Extended.UI.TimeSpan.TicksPerMinute) +
             (s * Sys.Extended.UI.TimeSpan.TicksPerSecond) +
             (n * Sys.Extended.UI.TimeSpan.TicksPerMillisecond);
    if(!isNaN(ticks)) {
        return new Sys.Extended.UI.TimeSpan(ticks);
    }    
    throw Error.create(Sys.Extended.UI.Resources.Common_DateTime_InvalidFormat);
}
Sys.Extended.UI.TimeSpan.fromTicks = function(ticks) { 
    /// <summary>
    /// Creates a TimeSpan for the specified number of ticks
    /// </summary>
    /// <param name="ticks" type="Number" integer="true">The ticks for the TimeSpan instance</param>
    /// <returns type="Sys.Extended.UI.TimeSpan" />

    return new Sys.Extended.UI.TimeSpan(ticks); 
}
Sys.Extended.UI.TimeSpan.fromDays = function(days) { 
    /// <summary>
    /// Creates a TimeSpan for the specified number of days
    /// </summary>
    /// <param name="days" type="Number">The days for the TimeSpan instance</param>
    /// <returns type="Sys.Extended.UI.TimeSpan" />

    return new Sys.Extended.UI.TimeSpan(days * Sys.Extended.UI.TimeSpan.TicksPerDay); 
}
Sys.Extended.UI.TimeSpan.fromHours = function(hours) { 
    /// <summary>
    /// Creates a TimeSpan for the specified number of hours
    /// </summary>
    /// <param name="hours" type="Number">The hours for the TimeSpan instance</param>
    /// <returns type="Sys.Extended.UI.TimeSpan" />

    return new Sys.Extended.UI.TimeSpan(hours * Sys.Extended.UI.TimeSpan.TicksPerHour); 
}
Sys.Extended.UI.TimeSpan.fromMinutes = function(minutes) { 
    /// <summary>
    /// Creates a TimeSpan for the specified number of minutes
    /// </summary>
    /// <param name="minutes" type="Number">The minutes for the TimeSpan instance</param>
    /// <returns type="Sys.Extended.UI.TimeSpan" />

    return new Sys.Extended.UI.TimeSpan(minutes * Sys.Extended.UI.TimeSpan.TicksPerMinute); 
}
Sys.Extended.UI.TimeSpan.fromSeconds = function(seconds) { 
    /// <summary>
    /// Creates a TimeSpan for the specified number of seconds
    /// </summary>
    /// <param name="seconds" type="Number">The seconds for the TimeSpan instance</param>
    /// <returns type="Sys.Extended.UI.TimeSpan" />

    return new Sys.Extended.UI.TimeSpan(minutes * Sys.Extended.UI.TimeSpan.TicksPerSecond); 
}
Sys.Extended.UI.TimeSpan.fromMilliseconds = function(milliseconds) { 
    /// <summary>
    /// Creates a TimeSpan for the specified number of milliseconds
    /// </summary>
    /// <param name="days" type="Number">The milliseconds for the TimeSpan instance</param>
    /// <returns type="Sys.Extended.UI.TimeSpan" />

    return new Sys.Extended.UI.TimeSpan(minutes * Sys.Extended.UI.TimeSpan.TicksPerMillisecond); 
}
Sys.Extended.UI.TimeSpan.TicksPerDay = 864000000000;
Sys.Extended.UI.TimeSpan.TicksPerHour = 36000000000;
Sys.Extended.UI.TimeSpan.TicksPerMinute = 600000000;
Sys.Extended.UI.TimeSpan.TicksPerSecond = 10000000;
Sys.Extended.UI.TimeSpan.TicksPerMillisecond = 10000;
Sys.Extended.UI.TimeSpan.FullTimeSpanPattern = "dd:hh:mm:ss.nnnn";
Sys.Extended.UI.TimeSpan.ShortTimeSpanPattern = "hh:mm";
Sys.Extended.UI.TimeSpan.LongTimeSpanPattern = "hh:mm:ss";

Date.prototype.getTimeOfDay = function Date$getTimeOfDay() {
    /// <summary>
    /// Gets a TimeSpan representing the current time of the Date
    /// </summary>
    /// <returns type="Sys.Extended.UI.TimeSpan" />

    return new Sys.Extended.UI.TimeSpan(
        0, 
        this.getHours(), 
        this.getMinutes(), 
        this.getSeconds(), 
        this.getMilliseconds());
}
Date.prototype.getDateOnly = function Date$getDateOnly() {
    /// <summary>
    /// Gets a Date representing the Date only part of the Date and Adjusts for DST switch at midnight.
    /// </summary>
    /// <returns type="Date" />

    var tempDate = new Date(this.getFullYear(), this.getMonth(), this.getDate());

    if (!((this.getMonth() === tempDate.getMonth()) && (this.getDate() === tempDate.getDate()))) {

        tempDate.setMinutes(120);

    }

    return tempDate;
}
Date.prototype.add = function Date$add(span) {
    /// <summary>
    /// Adds a TimeSpan to the current Date
    /// </summary>
    /// <param name="span" type="Sys.Extended.UI.TimeSpan">The amount of time to add to the date</param>
    /// <returns type="Date" />

    return new Date(this.getTime() + span.getTotalMilliseconds());
}
Date.prototype.subtract = function Date$subtract(span) {
    /// <summary>
    /// Subtracts a TimeSpan to the current Date
    /// </summary>
    /// <param name="span" type="Sys.Extended.UI.TimeSpan">The amount of time to subtract from the date</param>
    /// <returns type="Date" />

    return this.add(span.negate());
}
Date.prototype.getTicks = function Date$getTicks() {
    /// <summary>
    /// Gets the number of ticks in the date
    /// </summary>
    /// <returns type="Number" />

    return this.getTime() * Sys.Extended.UI.TimeSpan.TicksPerMillisecond;
}

Sys.Extended.UI.FirstDayOfWeek = function() {
    /// <summary>
    /// Represents the first day of the week in a calendar
    /// </summary>
}
Sys.Extended.UI.FirstDayOfWeek.prototype = {
    Sunday : 0,
    Monday : 1,
    Tuesday : 2,
    Wednesday : 3,
    Thursday : 4,
    Friday : 5,
    Saturday : 6,
    Default : 7
}
Sys.Extended.UI.FirstDayOfWeek.registerEnum("Sys.Extended.UI.FirstDayOfWeek");

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedCommon"], execute);
}
else {
    execute();
}

})();
