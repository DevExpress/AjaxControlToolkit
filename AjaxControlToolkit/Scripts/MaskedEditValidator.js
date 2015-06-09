function MaskedEditSetMessage(value, msg, txt) {
    value.errormessage = msg;

    if(txt == "")
        value.text = msg;
    else
        value.text = txt;

    value.innerHTML = value.text;
}

function MaskedEditMessageShow(value, IsValid) {
    if(typeof (value.display) == "string") {
        if(value.display == "None")
            return;

        if(value.display == "Dynamic") {
            value.style.display = IsValid ? "none" : "inline";
            return;
        }
    }

    value.style.visibility = IsValid ? "hidden" : "visible";
}

function MaskedEditSetCssClass(value, Css) {
    var target = $get(value.TargetValidator);

    Sys.UI.DomElement.removeCssClass(target, value.InvalidValueCssClass);
    Sys.UI.DomElement.removeCssClass(target, value.CssBlurNegative);
    Sys.UI.DomElement.removeCssClass(target, value.CssFocus);
    Sys.UI.DomElement.removeCssClass(target, value.CssFocusNegative);

    if(Css != "")
        Sys.UI.DomElement.addCssClass(target, Css);
}

function MaskedEditValidatorDateTime(value) {
    MaskedEditSetMessage(value, "", "");
    MaskedEditSetCssClass(value, "");
    MaskedEditMessageShow(value, true);

    if(value.IsMaskedEdit == "false")
        return true;

    var target = $get(value.TargetValidator);
    if(value.ValidEmpty == "false") {
        if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value() == value.InitialValue) {
            MaskedEditSetMessage(value, value.EmptyValueMessage, value.EmptyValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value() == "")
        return true;

    var ret = true,
        mask = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value();

    // regular Exp
    if(value.ValidationExpression != "") {
        var rx = new RegExp(value.ValidationExpression),
            matches = rx.exec(mask);

        ret = (matches != null && mask == matches[0]);
        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    var PartDate = target.MaskedEditBehavior.AutoFormatDate(),
        PartTime = target.MaskedEditBehavior.AutoFormatTime(),
        MinVlDt = "",
        MinVlTm = "";

    if(value.MinimumValue != "") {
        MinVlDt = value.MinimumValue.split(" ")[0];
        MinVlTm = value.MinimumValue.split(" ")[1];
    }

    var MaxVlDt = "",
        MaxVlTm = "";
    if(value.MaximumValue != "") {
        MaxVlDt = value.MaximumValue.split(" ")[0];
        MaxVlTm = value.MaximumValue.split(" ")[1];
    }

    ret = MaskedEditValidatorPartDate(value, PartDate, MinVlDt, MaxVlDt);
    if(ret)
        ret = MaskedEditValidatorPartTime(value, PartTime, MinVlTm, MaxVlTm);

    // custom valid
    if(ret && value.ClientValidationFunction != "") {
        var args = { Value: mask, IsValid: true };
        eval(value.ClientValidationFunction + "(value, args);");
        ret = args.IsValid;

        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
        }
    }

    if(!ret)
        MaskedEditMessageShow(value, ret);

    return ret;
}

function MaskedEditValidatorPartTime(value, mask, MinVl, MaxVl) {
    var ret = true,
        AttibTmSep = value.TimeSeparator,
        AttibTmSyb = value.AmPmSymbol;

    // hh:mm or hh:mm:ss  
    var SybTm = AttibTmSyb.split(";"),
        tm = AttibTmSyb.replace(";", "|"),
        reg1 = "^(^([0][0-9]|[1][0-2])" + AttibTmSep + "([0-5][0-9])" + AttibTmSep + "([0-5][0-9])\\s(" + tm + ")$)|(^([0][0-9]|[1][0-2])" + AttibTmSep + "([0-5][0-9])\\s(" + tm + ")$)$",
        reg2 = "^(^([0-1][0-9]|[2][0-3])" + AttibTmSep + "([0-5][0-9])" + AttibTmSep + "([0-5][0-9])$)|(^([0-1][0-9]|[2][0-3])" + AttibTmSep + "([0-5][0-9])$)$",
        H = -1,
        M = -1,
        S = -1,
        aux = "",
        m_arrValue = mask.split(AttibTmSep),
        regex1 = new RegExp(reg1),
        matches1 = regex1.exec(mask),
        regex2 = new RegExp(reg2),
        matches2 = regex2.exec(mask);

    if(matches1 && (matches1[0] == mask)) {
        aux = mask.substring(mask.length - 2).substring(0, 1);
        H = parseInt(m_arrValue[0], 10);

        if(aux.toUpperCase() == SybTm[1].substring(0, 1).toUpperCase()) {
            H += 12;
            if(H == 24)
                H = 12;
        }

        M = parseInt(m_arrValue[1], 10);
        S = (value.length > 9 ? parseInt(m_arrValue[2].substring(0, 2), 10) : 0);
    } else if(matches2 && (matches2[0] == mask)) {
        H = parseInt(m_arrValue[0], 10);
        M = parseInt(m_arrValue[1], 10);
        S = (mask.length > 5 ? parseInt(m_arrValue[2], 10) : 0);
    }

    if(H == -1 || M == -1 || S == -1)
        ret = false;

    if(!ret) {
        MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
        MaskedEditSetCssClass(value, value.InvalidValueCssClass);
    }

    if(ret && (MaxVl != "" || MinVl != "")) {
        var Hr,
            Mr,
            Sr,
            m_arr;

        if(MinVl != "") {
            Hr = -1;
            Mr = -1;
            Sr = -1;
            m_arr = MinVl.split(AttibTmSep);
            matches1 = regex1.exec(MinVl);
            matches2 = regex2.exec(MinVl);

            if(matches1 && (matches1[0] == MinVl)) {
                aux = MinVl.substring(MinVl.length - 2).substring(0, 1);
                Hr = parseInt(m_arr[0], 10);

                if(aux.toUpperCase() == SybTm[1].substring(0, 1).toUpperCase()) {
                    Hr += 12;

                    if(Hr == 24)
                        Hr = 0;
                }

                Mr = parseInt(m_arr[1], 10);
                Sr = (MinVl.length > 9 ? parseInt(m_arr[2].substring(0, 2), 10) : 0);
            } else if(matches2 && (matches2[0] == MinVl)) {
                Hr = parseInt(m_arr[0], 10);
                Mr = parseInt(m_arr[1], 10);
                Sr = (MinVl.length > 5 ? parseInt(m_arr[2], 10) : 0);
            }

            ret = (H > Hr || (H == Hr && M > Mr) || (H == Hr && M == Mr && S >= Sr));
            if(!ret) {
                MaskedEditSetMessage(value, value.MinimumValueMessage, value.MinimumValueText);
                MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            }
        }

        if(MaxVl != "" && ret) {
            Hr = -1;
            Mr = -1;
            Sr = -1;
            m_arr = MaxVl.split(AttibTmSep);
            matches1 = regex1.exec(MaxVl);
            matches2 = regex2.exec(MaxVl);

            if(matches1 && (matches1[0] == MaxVl)) {
                aux = MaxVl.substring(MaxVl.length - 2).substring(0, 1);
                Hr = parseInt(m_arr[0], 10);

                if(aux.toUpperCase() == SybTm[1].substring(0, 1).toUpperCase()) {
                    Hr += 12;

                    if(Hr == 24)
                        Hr = 0;
                }

                Mr = parseInt(m_arr[1], 10);
                Sr = (MaxVl.length > 9 ? parseInt(m_arr[2].substring(0, 2), 10) : 0);
            } else if(matches2 && (matches2[0] == MaxVl)) {
                Hr = parseInt(m_arr[0], 10);
                Mr = parseInt(m_arr[1], 10);
                Sr = (MaxVl.length > 5 ? parseInt(m_arr[2], 10) : 0);
            }

            ret = (H < Hr || (H == Hr && M < Mr) || (H == Hr && M == Mr && S <= Sr));
            if(!ret) {
                MaskedEditSetMessage(value, value.MaximumValueMessage, value.MaximumValueText);
                MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            }
        }
    }

    return ret;
}

function MaskedEditValidatorPartDate(value, mask, MinVl, MaxVl) {
    var ret = true,
        AttibDtFmt = "MDY";

    switch(value.DateFormat) {
        case "DayMonthYear":
        case "DMY":
            AttibDtFmt = "DMY";
            break;
        case "DayYearMonth":
        case "DYM":
            AttibDtFmt = "DYM";
            break;
        case "MonthDayYear":
        case "MDY":
            AttibDtFmt = "MDY";
            break;
        case "MonthYearDay":
        case "MYD":
            AttibDtFmt = "MYD";
            break;
        case "YearDayMonth":
        case "YDM":
            AttibDtFmt = "YDM";
            break;
        case "YearMonthDay":
        case "YMD":
            AttibDtFmt = "YMD";
            break;
    }

    var AttibDtSep = value.DateSeparator,
        m_arrDate = mask.split(AttibDtSep);

    if(parseInt(m_arrDate.length, 10) != 3) {
        MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
        MaskedEditSetCssClass(value, value.InvalidValueCssClass);
        ret = false;
    }

    if(AttibDtFmt.indexOf("D") == -1 || AttibDtFmt.indexOf("M") == -1 || AttibDtFmt.indexOf("Y") == -1) {
        MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
        MaskedEditSetCssClass(value, value.InvalidValueCssClass);
        ret = false;
    }

    var D = -1,
        M = -1,
        Y = -1;

    if(ret) {
        D = parseInt(m_arrDate[AttibDtFmt.indexOf("D")], 10);
        M = parseInt(m_arrDate[AttibDtFmt.indexOf("M")], 10);
        Y = parseInt(m_arrDate[AttibDtFmt.indexOf("Y")], 10)
        ret = (D > 0 && M > 0 && Y > 0 && (D <= [, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][M] || D == 29 && M == 2 && Y % 4 == 0 && (Y % 100 > 0 || Y % 400 == 0)));
    }

    if(!ret) {
        MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
        MaskedEditSetCssClass(value, value.InvalidValueCssClass);
    }

    if(ret && (MaxVl != "" || MinVl != "")) {
        var m_arr,
            Dr = -1,
            Mr = -1,
            Yr = -1;

        if(MinVl != "") {
            m_arr = MinVl.split(AttibDtSep);
            Dr = parseInt(m_arr[AttibDtFmt.indexOf("D")], 10);
            Mr = parseInt(m_arr[AttibDtFmt.indexOf("M")], 10);
            Yr = parseInt(m_arr[AttibDtFmt.indexOf("Y")], 10);
            ret = (Dr > 0 && Mr > 0 && Yr > 0 && Y > Yr || (Y == Yr && M > Mr) || (Y == Yr && M == Mr && D >= Dr));

            if(!ret) {
                MaskedEditSetMessage(value, value.MinimumValueMessage, value.MinimumValueText);
                MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            }
        }

        if(ret && MaxVl != "") {
            m_arr = MaxVl.split(AttibDtSep);
            Dr = parseInt(m_arr[AttibDtFmt.indexOf("D")], 10);
            Mr = parseInt(m_arr[AttibDtFmt.indexOf("M")], 10);
            Yr = parseInt(m_arr[AttibDtFmt.indexOf("Y")], 10);
            ret = (Dr > 0 && Mr > 0 && Yr > 0 && Y < Yr || (Y == Yr && M < Mr) || (Y == Yr && M == Mr && D <= Dr));

            if(!ret) {
                MaskedEditSetMessage(value, value.MaximumValueMessage, value.MaximumValueText);
                MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            }
        }
    }

    return ret;
}

function MaskedEditValidatorDate(value) {
    MaskedEditSetMessage(value, "", "");
    MaskedEditSetCssClass(value, "");
    MaskedEditMessageShow(value, true);

    if(value.IsMaskedEdit == "false")
        return true;

    var target = $get(value.TargetValidator);
    if(value.ValidEmpty == "false") {
        if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value() == value.InitialValue) {
            MaskedEditSetMessage(value, value.EmptyValueMessage, value.EmptyValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value() == "")
        return true;

    var ret = true,
        mask = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value();

    // regular Exp
    if(value.ValidationExpression != "") {
        var rx = new RegExp(value.ValidationExpression),
            matches = rx.exec(mask);

        ret = (matches != null && mask == matches[0]);
        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    ret = MaskedEditValidatorPartDate(value, mask, value.MinimumValue, value.MaximumValue);
    if(ret && value.ClientValidationFunction != "") {
        var args = { Value: mask, IsValid: true };
        eval(value.ClientValidationFunction + "(value, args);");
        ret = args.IsValid;

        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
        }
    }

    if(!ret)
        MaskedEditMessageShow(value, ret);

    return ret;
}

// Validator time
function MaskedEditValidatorTime(value) {
    MaskedEditSetMessage(value, "", "");
    MaskedEditSetCssClass(value, "");
    MaskedEditMessageShow(value, true);

    if(value.IsMaskedEdit == "false")
        return true;

    var target = $get(value.TargetValidator);
    if(value.ValidEmpty == "false") {
        if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value() == value.InitialValue) {
            MaskedEditSetMessage(value, value.EmptyValueMessage, value.EmptyValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value() == "")
        return true;

    var ret = true,
        mask = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value();

    // regular Exp
    if(value.ValidationExpression != "") {
        var rx = new RegExp(value.ValidationExpression),
            matches = rx.exec(mask);

        ret = (matches != null && mask == matches[0]);
        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    ret = MaskedEditValidatorPartTime(value, mask, value.MinimumValue, value.MaximumValue);
    if(ret && value.ClientValidationFunction != "") {
        var args = { Value: mask, IsValid: true };
        eval(value.ClientValidationFunction + "(value, args);");
        ret = args.IsValid;

        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
        }
    }

    if(!ret)
        MaskedEditMessageShow(value, ret);

    return ret;
}

// Validator Number
function MaskedEditValidatorNumber(value) {
    MaskedEditSetMessage(value, "", "");
    MaskedEditSetCssClass(value, "");
    MaskedEditMessageShow(value, true);

    if(value.IsMaskedEdit == "false")
        return true;

    var target = $get(value.TargetValidator),
        numVal = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value().replace(new RegExp("(\[\w_.,\s\$ ])", "g"), "");

    if(value.ValidEmpty == "false") {
        if(numVal == value.InitialValue) {
            MaskedEditSetMessage(value, value.EmptyValueMessage, value.EmptyValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    if(numVal == "")
        return true;

    var ret = true,
        AttibThSep = value.Thousands,
        AttibDcSep = value.Decimal,
        AttibCuSyb = value.Money,
        AttibLastPos = value.LastMaskPosition + AttibCuSyb.length + 1;

    var mask = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value();

    if(value.ValidationExpression != "") {
        var rx = new RegExp(value.ValidationExpression),
            matches = rx.exec(mask);

        ret = (matches != null && mask == matches[0]);
        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    ret = false;
    var cleanInput = null,
        exp = null,
        m = null,
        num = null,
        Compnum = null;

    mask = mask.replace(new RegExp("(\\" + AttibThSep + ")", "g"), "");
    mask = mask.replace(new RegExp("(\\" + AttibCuSyb + ")", "g"), "");

    // trim
    m = mask.match(/^\s*(\S+(\s+\S+)*)\s*$/);
    if(m != null)
        mask = m[1];

    // integer
    exp = /^\s*[-\+]?\d+\s*$/;
    if(mask.match(exp) != null) {
        num = parseInt(mask, 10);
        ret = (num == (isNaN(num) ? null : num));
    }

    if(ret) {
        if(value.MaximumValue != "") {
            Compnum = parseInt(value.MaximumValue, 10);

            if(Compnum == (isNaN(Compnum) ? null : Compnum))
                if(num > Compnum) {
                    ret = false;
                    MaskedEditSetMessage(value, value.MaximumValueMessage, value.MaximumValueText);
                    MaskedEditSetCssClass(value, value.InvalidValueCssClass);
                }
        }
        if(ret && value.MinimumValue != "") {
            Compnum = parseInt(value.MinimumValue, 10);

            if(Compnum == (isNaN(Compnum) ? null : Compnum))
                if(num < Compnum) {
                    ret = false;
                    MaskedEditSetMessage(value, value.MinimumValueMessage, value.MinimumValueText);
                    MaskedEditSetCssClass(value, value.InvalidValueCssClass);
                }
        }
    } else {
        // float
        exp = new RegExp("^\\s*([-\\+])?(\\d+)?(\\" + AttibDcSep + "(\\d+))?\\s*$");
        m = mask.match(exp);

        if(m != null) {
            cleanInput = null;
            if(typeof (m[1]) != "undefined")
                cleanInput = m[1] + (m[2].length > 0 ? m[2] : "0") + "." + m[4];
            else
                cleanInput = (m[2].length > 0 ? m[2] : "0") + "." + m[4];

            num = parseFloat(cleanInput);
            ret = (num == (isNaN(num) ? null : num));
        }

        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
        }

        if(ret) {
            if(value.MaximumValue != "") {
                Compnum = parseFloat(value.MaximumValue);

                if(Compnum == (isNaN(Compnum) ? null : Compnum))
                    if(num > Compnum) {
                        ret = false;
                        MaskedEditSetMessage(value, value.MaximumValueMessage, value.MaximumValueText);
                        MaskedEditSetCssClass(value, value.InvalidValueCssClass);
                    }
            }

            if(ret && value.MinimumValue != "") {
                Compnum = parseFloat(value.MinimumValue);

                if(Compnum == (isNaN(Compnum) ? null : Compnum))
                    if(num < Compnum) {
                        ret = false;
                        MaskedEditSetMessage(value, value.MinimumValueMessage, value.MinimumValueText);
                        MaskedEditSetCssClass(value, value.InvalidValueCssClass);
                    }
            }
        }
    }

    if(ret && value.ClientValidationFunction != "") {
        var args = { Value: mask, IsValid: true };
        eval(value.ClientValidationFunction + "(value, args);");
        ret = args.IsValid;

        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
        }
    }

    if(!ret)
        MaskedEditMessageShow(value, ret);

    return ret;
}

// Validator None
function MaskedEditValidatorNone(value) {
    MaskedEditSetMessage(value, "", "");
    MaskedEditSetCssClass(value, "");
    MaskedEditMessageShow(value, true);

    if(value.IsMaskedEdit == "false")
        return true;

    var target = $get(value.TargetValidator);
    if(value.ValidEmpty == "false")
        if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value() == value.InitialValue) {
            MaskedEditSetMessage(value, value.EmptyValueMessage, value.EmptyValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }

    if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value() == "")
        return true;

    var ret = true,
        mask = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(target).get_Value();

    if(value.ValidationExpression != "") {
        var rx = new RegExp(value.ValidationExpression),
            matches = rx.exec(mask);

        ret = (matches != null && mask == matches[0]);
        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
            MaskedEditMessageShow(value, false);

            return false;
        }
    }

    var exp = /^\d+\s*$/,
        num = null;

    if(value.MaximumValue != "")
        if(value.MaximumValue.match(exp) != null) {
            num = parseInt(value.MaximumValue, 10);

            if(num == (isNaN(num) ? null : num))
                if(mask.length > num) {
                    ret = false;
                    MaskedEditSetMessage(value, value.MaximumValueMessage, value.MaximumValueText);
                    MaskedEditSetCssClass(value, value.InvalidValueCssClass);
                }
        }

    if(ret && value.MinimumValue != "")
        if(value.MinimumValue.match(exp) != null) {
            num = parseInt(value.MinimumValue, 10);

            if(num == (isNaN(num) ? null : num))
                if(mask.length < num) {
                    ret = false;
                    MaskedEditSetMessage(value, value.MinimumValueMessage, value.MinimumValueText);
                    MaskedEditSetCssClass(value, value.InvalidValueCssClass);
                }
        }

    if(ret && value.ClientValidationFunction != "") {
        var args = { Value: mask, IsValid: true };
        eval(value.ClientValidationFunction + "(value, args);");
        ret = args.IsValid;

        if(!ret) {
            MaskedEditSetMessage(value, value.InvalidValueMessage, value.InvalidValueText);
            MaskedEditSetCssClass(value, value.InvalidValueCssClass);
        }
    }

    if(!ret)
        MaskedEditMessageShow(value, ret);

    return ret;
}