Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.TimeSpan = function() {
    // Represents a period of time
    if (arguments.length == 0) this._ctor$0.apply(this, arguments);
    else if (arguments.length == 1) this._ctor$1.apply(this, arguments);
    else if (arguments.length == 3) this._ctor$2.apply(this, arguments);
    else if (arguments.length == 4) this._ctor$3.apply(this, arguments);
    else if (arguments.length == 5) this._ctor$4.apply(this, arguments);
    else throw Error.parameterCount();
}
Sys.Extended.UI.TimeSpan.prototype = {

    _ctor$0 : function() {
        this._ticks = 0;
    }, 
    _ctor$1 : function(ticks) {
        this._ctor$0();
        this._ticks = ticks;
    },
    _ctor$2 : function(hours, minutes, seconds) {
        this._ctor$0();
        this._ticks = 
            (hours * Sys.Extended.UI.TimeSpan.TicksPerHour) +
            (minutes * Sys.Extended.UI.TimeSpan.TicksPerMinute) +
            (seconds * Sys.Extended.UI.TimeSpan.TicksPerSecond); 
    },
    _ctor$3 : function(days, hours, minutes, seconds) {
        this._ctor$0();
        this._ticks = 
            (days * Sys.Extended.UI.TimeSpan.TicksPerDay) +
            (hours * Sys.Extended.UI.TimeSpan.TicksPerHour) +
            (minutes * Sys.Extended.UI.TimeSpan.TicksPerMinute) +
            (seconds * Sys.Extended.UI.TimeSpan.TicksPerSecond); 
    },
    _ctor$4 : function(days, hours, minutes, seconds, milliseconds) {
        this._ctor$0();
        this._ticks = 
            (days * Sys.Extended.UI.TimeSpan.TicksPerDay) +
            (hours * Sys.Extended.UI.TimeSpan.TicksPerHour) +
            (minutes * Sys.Extended.UI.TimeSpan.TicksPerMinute) +
            (seconds * Sys.Extended.UI.TimeSpan.TicksPerSecond) +
            (milliseconds * Sys.Extended.UI.TimeSpan.TicksPerMillisecond); 
    },

    getDays : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerDay); 
    },
    getHours : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerHour) % 24; 
    },
    getMinutes : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerMinute) % 60; 
    },
    getSeconds : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerSecond) % 60; 
    },
    getMilliseconds : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerMillisecond) % 1000; 
    },
    getDuration : function() { 
        return new Sys.Extended.UI.TimeSpan(Math.abs(this._ticks)); 
    },
    getTicks : function() { 
        return this._ticks; 
    },
    getTotalDays : function() { 
        Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerDay); 
    },
    getTotalHours : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerHour); 
    },
    getTotalMinutes : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerMinute); 
    },
    getTotalSeconds : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerSecond); 
    },
    getTotalMilliseconds : function() { 
        return Math.floor(this._ticks / Sys.Extended.UI.TimeSpan.TicksPerMillisecond); 
    },
    add : function(value) { 
        // Adds the supplied TimeSpan to this TimeSpan
        return new Sys.Extended.UI.TimeSpan(this._ticks + value.getTicks()); 
    },
    subtract : function(value) { 
        // Subtracts the supplied TimeSpan to this TimeSpan
        return new Sys.Extended.UI.TimeSpan(this._ticks - value.getTicks()); 
    },
    negate : function() { 
        // Negates the TimeSpan
        return new Sys.Extended.UI.TimeSpan(-this._ticks); 
    },
    equals : function(value) { 
        // Whether this TimeSpan equals another TimeSpan
        return this._ticks == value.getTicks(); 
    },
    compareTo : function(value) { 
        // Whether this TimeSpan greater or less than another TimeSpan
        if(this._ticks > value.getTicks()) 
            return 1; 
        else if(this._ticks < value.getTicks()) 
            return -1; 
        else 
            return 0; 
    },
    toString : function() { 
        return this.format("F"); 
    },
    format : function(format) {    
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
    // Parses a text value into a TimeSpan
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
    // Creates a TimeSpan for the specified number of ticks
    return new Sys.Extended.UI.TimeSpan(ticks); 
}
Sys.Extended.UI.TimeSpan.fromDays = function(days) { 
    // Creates a TimeSpan for the specified number of days
    return new Sys.Extended.UI.TimeSpan(days * Sys.Extended.UI.TimeSpan.TicksPerDay); 
}
Sys.Extended.UI.TimeSpan.fromHours = function(hours) { 
    // Creates a TimeSpan for the specified number of hours
    return new Sys.Extended.UI.TimeSpan(hours * Sys.Extended.UI.TimeSpan.TicksPerHour); 
}
Sys.Extended.UI.TimeSpan.fromMinutes = function(minutes) { 
    // Creates a TimeSpan for the specified number of minutes
    return new Sys.Extended.UI.TimeSpan(minutes * Sys.Extended.UI.TimeSpan.TicksPerMinute); 
}
Sys.Extended.UI.TimeSpan.fromSeconds = function(seconds) { 
    // Creates a TimeSpan for the specified number of seconds
    return new Sys.Extended.UI.TimeSpan(minutes * Sys.Extended.UI.TimeSpan.TicksPerSecond); 
}
Sys.Extended.UI.TimeSpan.fromMilliseconds = function(milliseconds) { 
    // Creates a TimeSpan for the specified number of milliseconds
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
    // Gets a TimeSpan representing the current time of the Date
    return new Sys.Extended.UI.TimeSpan(
        0, 
        this.getHours(), 
        this.getMinutes(), 
        this.getSeconds(), 
        this.getMilliseconds());
}
Date.prototype.getDateOnly = function Date$getDateOnly() {
    // Gets a Date representing the Date only part of the Date and Adjusts for DST switch at midnight.
    var tempDate = new Date(this.getFullYear(), this.getMonth(), this.getDate());

    if (!((this.getMonth() === tempDate.getMonth()) && (this.getDate() === tempDate.getDate()))) {

        tempDate.setMinutes(120);

    }

    return tempDate;
}
Date.prototype.add = function Date$add(span) {
    // Adds a TimeSpan to the current Date
    // param "span"is the amount of time to add to the date

    return new Date(this.getTime() + span.getTotalMilliseconds());
}
Date.prototype.subtract = function Date$subtract(span) {
    // Subtracts a TimeSpan to the current Date
    // param "span" is the amount of time to subtract from the date
    return this.add(span.negate());
}
Date.prototype.getTicks = function Date$getTicks() {
    return this.getTime() * Sys.Extended.UI.TimeSpan.TicksPerMillisecond;
}

Sys.Extended.UI.FirstDayOfWeek = function() {
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

(function(){
    var D= new Date('2011-06-02T09:34:29+02:00');
    if(!D || +D!== 1307000069000){
        Date.fromISO= function(s){
            var day, tz,
            rx=/^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p= rx.exec(s) || [];
            if(p[1]){
                day= p[1].split(/\D/);
                for(var i= 0, L= day.length; i<L; i++){
                    day[i]= parseInt(day[i], 10) || 0;
                };
                day[1]-= 1;
                day= new Date(Date.UTC.apply(Date, day));
                if(!day.getDate()) return NaN;
                if(p[5]){
                    tz= (parseInt(p[5], 10)*60);
                    if(p[6]) tz+= parseInt(p[6], 10);
                    if(p[4]== '+') tz*= -1;
                    if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
                }
                return day;
            }
            return NaN;
        }
    }
    else{
        Date.fromISO= function(s){
            return new Date(s);
        }
    }
})()