/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.NumberTest = function() {

    this.testFormat = function() {
        this._runTests("format", function(culture, test, testNum) {
            // specific culture tests.
            var actual = test.number.localeFormat(test.format);
            AtlasUnit.Assert.areEqual(test.expect, actual, "Number.localeFormat failed for " + culture + " #" + testNum);
            actual = String.localeFormat("{0:" + test.format + "}", test.number);
            AtlasUnit.Assert.areEqual(test.expect, actual, "String.localeFormat failed for " + culture + " #" + testNum);
            // invariant culture tests.
            if (culture.length === 0) {
                actual = test.number.format(test.format);
                AtlasUnit.Assert.areEqual(test.expect, actual, "Number.format failed for " + culture + " #" + testNum);
                actual = String.format("{0:" + test.format + "}", test.number);
                AtlasUnit.Assert.areEqual(test.expect, actual, "String.format failed for " + culture + " #" + testNum);
            }
        });
    }

    this.testInfinite = function() {
        AtlasUnit.Assert.isFalse(isFinite(Number.parseInvariant('2e+308')));
        AtlasUnit.Assert.isFalse(isFinite(Number.parseInvariant('Infinity')));
        AtlasUnit.Assert.isFalse(isFinite(Number.parseInvariant('-Infinity')));

        // Opera does case insensitive parsing of infinity while others require the 'Infinity' casing
        if (Sys.Browser.agent === Sys.Browser.Opera) {
            AtlasUnit.Assert.isFalse(isFinite(Number.parseInvariant('infinity')));
            AtlasUnit.Assert.isFalse(isFinite(Number.parseInvariant('INFINITY')));
        }
        else {
            AtlasUnit.Assert.isTrue(isNaN(Number.parseInvariant('infinity')));
            AtlasUnit.Assert.isTrue(isNaN(Number.parseInvariant('INFINITY')));
        }
    }

    this.testIsClass = function() {
        AtlasUnit.Assert.isTrue(Type.isClass(Number));
    }

    this.testParse = function() {
        this._runTests("parse", function(culture, test, testNum) {
            var parseAssert = function(actual) {
                if (isNaN(actual)) {
                    AtlasUnit.Assert.isTrue(isNaN(test.expect),
                        String.format("Parse failed for '{0}' ({1} #{2})", test.value, culture, testNum));
                }
                else {
                    AtlasUnit.Assert.areEqual(test.expect, actual,
                        String.format("Parse failed for '{0}' ({1} #{2})", test.value, culture, testNum));
                }
            };
            parseAssert(Number.parseLocale(test.value));
            // parse should only be tested against invariant culture.
            if (culture.length === 0) {
                parseAssert(Number.parseInvariant(test.value));
            }
        });
    }

    this.testParseNull = function() {
        Number.parseLocale(null);
    }
    this.testParseNull["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testParseNull["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentNullException', paramName: 'value' };

    this.testParseUndefined = function() {
        Number.parseLocale(undefined);
    }
    this.testParseUndefined["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testParseUndefined["AtlasUnit.ExpectedException"] = { name: 'Sys.ArgumentUndefinedException', paramName: 'value' };

    this.testTypeName = function() {
        AtlasUnit.Assert.areEqual("Number", Object.getTypeName(0));
    }

    this.testParseLocaleExtraParametersIgnored = function() {
        AtlasUnit.Assert.areEqual(123, Number.parseLocale("123", 1, null, "hello"));
    }

    this.testParseInvariantExtraParametersIgnored = function() {
        AtlasUnit.Assert.areEqual(123, Number.parseInvariant("123", 1, null, "hello"));
    }

    this._runTests = function(name, caseHandler) {
        var currentCulture = Sys.CultureInfo.CurrentCulture;
        var cultures = AtlasScript.Test.NumberTest.tests.cultures;
        var suite = AtlasScript.Test.NumberTest.tests[name];
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
AtlasScript.Test.NumberTest.tests = {
    // The default culture infos in CultureInfo.js contain only ascii because it is
    // appended to the MicrosoftAjax.js script which gets crunched as ascii.  However,
    // these test cultures can include non-ascii characters.
    cultures: [ Sys.CultureInfo.InvariantCulture,
                Sys.CultureInfo._parse({"name":"en-US","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"â€°","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy","ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":false,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]}}),
                Sys.CultureInfo._parse({"name":"sv-SE","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":",","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":".","CurrencySymbol":"kr","NaNSymbol":"NaN","CurrencyNegativePattern":8,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-INF","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":",","NumberGroupSeparator":" ","CurrencyPositivePattern":3,"PositiveInfinitySymbol":"INF","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":",","PercentGroupSeparator":" ","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"-","FirstDayOfWeek":1,"CalendarWeekRule":2,"FullDateTimePattern":"\'den \'d MMMM yyyy HH:mm:ss","LongDatePattern":"\'den \'d MMMM yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"\'den \'d MMMM","PMDesignator":"","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"yyyy-MM-dd","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM yyyy","AbbreviatedDayNames":["sö","må","ti","on","to","fr","lö"],"ShortestDayNames":["sö","må","ti","on","to","fr","lö"],"DayNames":["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"],"AbbreviatedMonthNames":["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec",""],"MonthNames":["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december",""],"IsReadOnly":false,"NativeCalendarName":"gregoriansk kalender","AbbreviatedMonthGenitiveNames":["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec",""],"MonthGenitiveNames":["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december",""]}}),
                Sys.CultureInfo._parse({"name":"fr-FR","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":",","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":" ","CurrencySymbol":"€","NaNSymbol":"Non Numérique","CurrencyNegativePattern":8,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infini","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":",","NumberGroupSeparator":" ","CurrencyPositivePattern":3,"PositiveInfinitySymbol":"+Infini","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":",","PercentGroupSeparator":" ","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":1,"CalendarWeekRule":0,"FullDateTimePattern":"dddd d MMMM yyyy HH:mm:ss","LongDatePattern":"dddd d MMMM yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"d MMMM","PMDesignator":"","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"dd/MM/yyyy","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM yyyy","AbbreviatedDayNames":["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],"ShortestDayNames":["di","lu","ma","me","je","ve","sa"],"DayNames":["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],"AbbreviatedMonthNames":["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc.",""],"MonthNames":["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre",""],"IsReadOnly":false,"NativeCalendarName":"calendrier grégorien","AbbreviatedMonthGenitiveNames":["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc.",""],"MonthGenitiveNames":["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre",""]}}),
                Sys.CultureInfo._parse({"name":"de-DE","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":",","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":".","CurrencySymbol":"€","NaNSymbol":"n. def.","CurrencyNegativePattern":8,"NumberNegativePattern":1,"PercentPositivePattern":1,"PercentNegativePattern":1,"NegativeInfinitySymbol":"-unendlich","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":",","NumberGroupSeparator":".","CurrencyPositivePattern":3,"PositiveInfinitySymbol":"+unendlich","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":",","PercentGroupSeparator":".","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":".","FirstDayOfWeek":1,"CalendarWeekRule":2,"FullDateTimePattern":"dddd, d. MMMM yyyy HH:mm:ss","LongDatePattern":"dddd, d. MMMM yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"dd MMMM","PMDesignator":"","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"dd.MM.yyyy","ShortTimePattern":"HH:mm","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM yyyy","AbbreviatedDayNames":["So","Mo","Di","Mi","Do","Fr","Sa"],"ShortestDayNames":["So","Mo","Di","Mi","Do","Fr","Sa"],"DayNames":["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],"AbbreviatedMonthNames":["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez",""],"MonthNames":["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember",""],"IsReadOnly":false,"NativeCalendarName":"Gregorianischer Kalender","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez",""],"MonthGenitiveNames":["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember",""]}}),
                Sys.CultureInfo._parse({"name":"hr-BA","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":",","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":".","CurrencySymbol":"KM","NaNSymbol":"NaN","CurrencyNegativePattern":8,"NumberNegativePattern":2,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":",","NumberGroupSeparator":".","CurrencyPositivePattern":3,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":",","PercentGroupSeparator":".","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"","Calendar":{"MinSupportedDateTime":"\/Date(-62135568000000)\/","MaxSupportedDateTime":"\/Date(253402300799999)\/","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":".","FirstDayOfWeek":1,"CalendarWeekRule":0,"FullDateTimePattern":"d. MMMM yyyy H:mm:ss","LongDatePattern":"d. MMMM yyyy","LongTimePattern":"H:mm:ss","MonthDayPattern":"MMMM dd","PMDesignator":"","RFC1123Pattern":"ddd, dd MMM yyyy HH\u0027:\u0027mm\u0027:\u0027ss \u0027GMT\u0027","ShortDatePattern":"d.M.yyyy","ShortTimePattern":"H:mm:ss","SortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd HH\u0027:\u0027mm\u0027:\u0027ss\u0027Z\u0027","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["ned","pon","uto","sri","čet","pet","sub"],"ShortestDayNames":["ned","pon","uto","sri","čet","pet","sub"],"DayNames":["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],"AbbreviatedMonthNames":["sij","vlj","ožu","tra","svi","lip","srp","kol","ruj","lis","stu","pro",""],"MonthNames":["siječanj","veljača","ožujak","travanj","svibanj","lipanj","srpanj","kolovoz","rujan","listopad","studeni","prosinac",""],"IsReadOnly":false,"NativeCalendarName":"gregorijanski kalendar","AbbreviatedMonthGenitiveNames":["sij","vlj","ožu","tra","svi","lip","srp","kol","ruj","lis","stu","pro",""],"MonthGenitiveNames":["siječanj","veljača","ožujak","travanj","svibanj","lipanj","srpanj","kolovoz","rujan","listopad","studeni","prosinac",""]}}),
                Sys.CultureInfo._parse({"name":"ar-AE","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"د.إ.‏","NaNSymbol":"ليس برقم","CurrencyNegativePattern":3,"NumberNegativePattern":3,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-لا نهاية","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":2,"PositiveInfinitySymbol":"+لا نهاية","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"‰","NativeDigits":["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"],"DigitSubstitution":0},"dateTimeFormat":{"AMDesignator":"ص","Calendar":{"MinSupportedDateTime":"\/Date(-62135568000000)\/","MaxSupportedDateTime":"\/Date(253402300799999)\/","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":6,"CalendarWeekRule":0,"FullDateTimePattern":"dd MMMM, yyyy hh:mm:ss tt","LongDatePattern":"dd MMMM, yyyy","LongTimePattern":"hh:mm:ss tt","MonthDayPattern":"dd MMMM","PMDesignator":"م","RFC1123Pattern":"ddd, dd MMM yyyy HH\u0027:\u0027mm\u0027:\u0027ss \u0027GMT\u0027","ShortDatePattern":"dd/MM/yyyy","ShortTimePattern":"hh:mm tt","SortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\u0027-\u0027MM\u0027-\u0027dd HH\u0027:\u0027mm\u0027:\u0027ss\u0027Z\u0027","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["الاحد","الاثنين","الثلاثاء","الاربعاء","الخميس","الجمعة","السبت"],"ShortestDayNames":["أ","ا","ث","أ","خ","ج","س"],"DayNames":["الاحد","الاثنين","الثلاثاء","الاربعاء","الخميس","الجمعة","السبت"],"AbbreviatedMonthNames":["يناير","فبراير","مارس","ابريل","مايو","يونيو","يوليو","اغسطس","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""],"MonthNames":["يناير","فبراير","مارس","ابريل","مايو","يونيو","يوليو","اغسطس","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""],"IsReadOnly":false,"NativeCalendarName":"التقويم الميلادي (تسمية إنجليزية)‏","AbbreviatedMonthGenitiveNames":["يناير","فبراير","مارس","ابريل","مايو","يونيو","يوليو","اغسطس","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""],"MonthGenitiveNames":["يناير","فبراير","مارس","ابريل","مايو","يونيو","يوليو","اغسطس","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""]}}),
                // en-US cultures with modified NumberNegativePatterns not used by any culture infos.
                Sys.CultureInfo._parse({"name":"numNeg0","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":0,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"â€°","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy","ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":false,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]}}),
                Sys.CultureInfo._parse({"name":"numNeg4","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":4,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"â€°","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy","ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":false,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]}}),
                // modified negative (NN) and positive (PP) signs
                Sys.CultureInfo._parse({"name":"signs","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"NN","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"PP","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"â€°","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy","ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":false,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]}}),
                // reversed negative and positive signs
                Sys.CultureInfo._parse({"name":"revsigns","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"+","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"-","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"â€°","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy","ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":false,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]}}),
                // modified group (ggg) and decimal (ddd) separators
                Sys.CultureInfo._parse({"name":"separs","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$","NaNSymbol":"NaN","CurrencyNegativePattern":0,"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":"ddd","NumberGroupSeparator":"ggg","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"â€°","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy","ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":false,"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]}}) ],
    format: { '':      [ { format: 'n10', number: 0.5678,          expect: '0.5678000000' },
                         { format: 'C',   number: .78,             expect: '\u00A40.78' },
                         { format: 'n10', number: 124e20,          expect: "12,400,000,000,000,000,000,000.0000000000" },
                         { format: 'D10', number: 123,             expect: "0000000123" },
                         { format: 'p1',  number: 50,              expect: "5,000.0 %" },
                         { format: 'X',   number: 50,              error:  'Sys.FormatException: Format specifier was invalid.' } ],
              'en-US': [ { format: 'c',   number: 12.34,           expect: "$12.34" },
                         { format: 'C',   number: -56.78,          expect: "($56.78)" },
                         { format: 'C',   number: .78,             expect: "$0.78" },
                         { format: 'c10', number: .5678,           expect: "$0.5678000000" },
                         { format: 'c1',  number: 0.5678,          expect: "$0.6" },
                         { format: 'c0',  number: 0.5678,          expect: "$1" },
                         { format: 'c0',  number: 0.4999,          expect: "$0" },
                         { format: 'd4',  number: 123.456,         expect: "123.456" },
                         { format: 'c6',  number: 123.456,         expect: "$123.456000" },
                         { format: 'c10', number: 123.456,         expect: "$123.4560000000" },
                         { format: 'c3',  number: 123.4564,        expect: "$123.456" },
                         { format: 'c3',  number: 123.4565,        expect: "$123.457" },
                         { format: 'n',   number: 1000.34,         expect: "1,000.34" },
                         { format: 'N',   number: 1000000000.00,   expect: "1,000,000,000.00" },
                         { format: 'n',   number: -5678.67,        expect: "-5,678.67" },
                         { format: 'N',   number: -0.89,           expect: "-0.89" },
                         { format: 'n',   number: .56,             expect: "0.56" },
                         { format: 'N',   number: 0.45,            expect: "0.45" },
                         { format: 'n10', number: 0.5678,          expect: "0.5678000000" },
                         { format: 'n1',  number: 0.5678,          expect: "0.6" },
                         { format: 'n0',  number: 0.5678,          expect: "1" },
                         { format: 'n0',  number: 0.4999,          expect: "0" },
                         { format: 'n4',  number: 123.456,         expect: "123.4560" },
                         { format: 'n7',  number: 123.456,         expect: "123.4560000" },
                         { format: 'n3',  number: 123.4564,        expect: "123.456" },
                         { format: 'n3',  number: 123.4565,        expect: "123.457" },
                         { format: 'p',   number: 12.7856,         expect: "1,278.56 %" },
                         { format: 'P',   number: -56.9933,        expect: "-5,699.33 %" },
                         { format: 'p',   number: 0.00567,         expect: "0.57 %" },
                         { format: 'p',   number: 1,               expect: "100.00 %" },
                         { format: 'p',   number: 0,               expect: "0.00 %" },
                         { format: 'p1',  number: 50,              expect: "5,000.0 %" },
                         { format: 'p1',  number: 50.44,           expect: "5,044.0 %" },
                         { format: 'p1',  number: 50.4545,         expect: "5,045.5 %" },
                         { format: 'p10', number: 50,              expect: "5,000.0000000000 %" },
                         { format: 'p0',  number: 0.505,           expect: "51 %" },
                         { format: 'p',   number: 12.789849999999, expect: "1,278.98 %" },
                         { format: 'd',   number: 1234567,         expect: "1234567" },
                         { format: 'D',   number: -1234567,        expect: "-1234567" },
                         { format: 'D10', number: -123,            expect: "-123" },
                         { format: 'N3', number: -0.000023,        expect: "0.000" },
                         { format: 'P', number: -0.000023,         expect: "0.00 %" },
                         { format: 'D10', number: 123,             expect: "0000000123" },
                         { format: 'D0',  number: 123,             expect: "123" },
                         { format: 'n10', number: 124e20,          expect: "12,400,000,000,000,000,000,000.0000000000" },
                         { format: 'n10', number: 123e10,          expect: "1,230,000,000,000.0000000000" },
                         { format: 'n10', number: -123e10,         expect: "-1,230,000,000,000.0000000000" },
                         { format: 'n10', number: 123e-10,         expect: "0.0000000123" },
                         { format: 'n99', number: Number.MIN_VALUE,expect: "0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" },
                         { format: 'n1',  number: Number.MAX_VALUE,expect: "179,769,313,486,231,570,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000.0" },
                         { format: 'n0',  number: -Number.MAX_VALUE,expect: "-179,769,313,486,231,570,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000"}
                         ],
              'sv-SE': [ { format: 'n4',  number: 123.456,         expect: "123,4560" },
                         { format: 'n',   number: -1000.34,        expect: "-1 000,34" },
                         { format: 'n10', number: 124e20,          expect: "12 400 000 000 000 000 000 000,0000000000" },
                         { format: 'p1',  number: 5,               expect: "500,0 %" },
                         { format: 'C',   number: .78,             expect: "0,78 kr" } ],
              'fr-FR': [ { format: 'N',   number: 123450,          expect: "123 450,00" } ],
              'de-DE': [ { format: 'N',   number: 1234.5,          expect: '1.234,50' } ] },
    parse:  { '':      [ { value: '+23',          expect: 23 },
                         { value: '23,600',       expect: 23600 },
                         { value: '23.600',       expect: 23.6 },
                         { value: '23.6E5',       expect: 23.6E5 },
                         { value: '0xF',          expect: 0xF },
                         { value: '0xNotHex',     expect: Number.NaN } ],
              'en-US': [ { value: '23',           expect: 23 },
                         { value: '+23',          expect: 23 },
                         { value: '.5',           expect: .5 },
                         { value: '5.',           expect: 5 },
                         { value: '-23',          expect: -23 },
                         { value: '23.6',         expect: 23.6 },
                         { value: '23,600',       expect: 23600 },
                         { value: '23.6E5',       expect: 23.6E5 },
                         { value: '23.6E-5',      expect: 23.6E-5 },
                         { value: '23.6E+5',      expect: 23.6E5 },
                         { value: '0.0',          expect: 0 },
                         { value: '0xF',          expect: 0xF },
                         { value: '',             expect: Number.NaN },
                         { value: '-',            expect: Number.NaN },
                         { value: '-.',           expect: Number.NaN },
                         { value: '--4',          expect: Number.NaN },
                         { value: '-+4',          expect: Number.NaN },
                         { value: '+4-',          expect: Number.NaN },
                         { value: '- 4 . 5',      expect: Number.NaN },
                         { value: '12.00.00',     expect: Number.NaN },
                         { value: '1.200,00',     expect: Number.NaN },
                         { value: '12somechars',  expect: Number.NaN },
                         { value: 'NoNumberHere', expect: Number.NaN },
                         { value: '+1,234.5',     expect: 1234.5 },
                         { value: '-1,234.5',     expect: -1234.5 },
                         { value: '1,2,3,4,5',    expect: 12345 },
                         { value: '(1,234.5)',    expect: Number.NaN },
                         { value: '- 1,234.5',    expect: Number.NaN },
                         { value: '1,234.5-',     expect: Number.NaN },
                         { value: '1,234.5 -',    expect: Number.NaN },
                         { value: '123infinity',  expect: Number.NaN },
                         { value: '123e',         expect: Number.NaN },
                         { value: '123e+',        expect: Number.NaN },
                         { value: '123e1,1',      expect: Number.NaN } ],
              'sv-SE': [ { value: '23,600',       expect: 23.6 },
                         { value: '23 600',       expect: 23600 },
                         { value: '23,6E-5',      expect: 23.6E-5 },
                         { value: '0xF',          expect: 0xF } ],
              'fr-FR': [ { value: '123\u00A0450,00',   expect: 123450 }, // nbsp (\u00A0)
                         { value: '123 450,00',   expect: 123450 } ],    // space (\u0020)
              'de-DE': [ { value: '1.234,5',      expect: 1234.5 } ],
              // NumberNegativePattern = 2 [- n]
              'hr-BA': [ { value: '+1.234,5',     expect: 1234.5 },
                         { value: '+ 1.234,5',    expect: 1234.5 },
                         { value: '-1.234,5',     expect: -1234.5 },
                         { value: '- 1.234,5',    expect: -1234.5 },
                         { value: '- 1.234,5e-1', expect: -123.45 },
                         { value: '1.234,5-',     expect: Number.NaN },
                         { value: '1.234,5 -',    expect: Number.NaN },
                         { value: '(1.234,5)',    expect: Number.NaN } ],
              // NumberNegativePattern = 3 [n-]
              'ar-AE': [ { value: '+1,234.5',     expect: 1234.5 },
                         { value: '1,234.5+',     expect: 1234.5 },
                         { value: '-1,234.5',     expect: -1234.5 },
                         { value: '1,234.5-',     expect: -1234.5 },
                         { value: '1,234.5e-1-',  expect: -123.45 },
                         { value: '+4-',          expect: Number.NaN },
                         { value: '- 1,234.5',    expect: Number.NaN },
                         { value: '1,234.5 -',    expect: Number.NaN },
                         { value: '(1,234.5)',    expect: Number.NaN } ],
              // NumberNegativePattern = 0 [(n)]
              'numNeg0':  [ { value: '+1,234.5',     expect: 1234.5 },
                            { value: '-1,234.5',     expect: -1234.5 },
                            { value: '(1,234.5)',    expect: -1234.5 },
                            { value: '(1,234.5e-1)', expect: -123.45 },
                            { value: '(1,234.5',     expect: Number.NaN },
                            { value: '1,234.5)',     expect: Number.NaN },
                            { value: '- 1,234.5',    expect: Number.NaN },
                            { value: '1,234.5 -',    expect: Number.NaN },
                            { value: '1,234.5-',     expect: Number.NaN } ],
              // NumberNegativePattern = 4 [n -]
              'numNeg4':  [ { value: '+1,234.5',     expect: 1234.5 },
                            { value: '1,234.5 +',    expect: 1234.5 },
                            { value: '-1,234.5',     expect: -1234.5 },
                            { value: '1,234.5 -',    expect: -1234.5 },
                            { value: '1,234.5e-1 -', expect: -123.45 },
                            { value: '- 1,234.5',    expect: Number.NaN },
                            { value: '1,234.5-',     expect: Number.NaN },
                            { value: '(1,234.5)',    expect: Number.NaN } ],
              // NegativeSign=N, PositiveSign=P
              'signs':    [ { value: 'PP1,234.5',    expect: 1234.5 },
                            { value: 'NN1,234.5',    expect: -1234.5 },
                            { value: 'PP1,234.5eNN1',expect: 123.45 },
                            { value: 'NN1,234.5ePP1',expect: -12345 },
                            { value: 'NN1,234.5e-1', expect: Number.NaN },
                            { value: '-1,234.5',     expect: Number.NaN },
                            { value: '+1,234.5',     expect: Number.NaN } ],
              // NegativeSign=+, PositiveSign=-
              'revsigns': [ { value: '-1,234.5',     expect: 1234.5 },
                            { value: '+1,234.5',     expect: -1234.5 },
                            { value: '-1,234.5e+1',  expect: 123.45 },
                            { value: '+1,234.5e-1',  expect: -12345 } ],
              // NumberGroupSeparator=ggg, NumberDecimalSeparator=ddd
              'separs':   [ { value: '1ggg2ggg3ddd4',expect: 123.4 },
                            { value: '-1ggg234ddd5', expect: -1234.5 },
                            { value: '12ddd5ddd5',   expect: Number.NaN },
                            { value: '12ddd5ggg5',   expect: Number.NaN },
                            { value: '1,234.5',      expect: Number.NaN } ] }
}

AtlasScript.Test.NumberTest.registerClass("AtlasScript.Test.NumberTest");
AtlasScript.Test.NumberTest["AtlasUnit.IsTestFixture"] = true;

