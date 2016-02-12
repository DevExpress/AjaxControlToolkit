#pragma warning disable 1591
using System;
using System.Globalization;
using System.Text;

namespace AjaxControlToolkit {

    public static class MaskedEditCommon {
        const string _charEscape = "\\";
        const string _charsEditMask = "9L$CAN?";
        const string _charNumbers = "0123456789";

        public static int GetFirstMaskPosition(string text) {
            var flagescape = false;
            text = ConvertMask(text);
            int i;
            for(i = 0; i < text.Length; i++) {
                if(text.Substring(i, 1) == _charEscape && !flagescape)
                    flagescape = true;
                else if(_charsEditMask.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) != -1 && !flagescape)
                    return i;
                else if(flagescape)
                    flagescape = false;
            }

            return -1;
        }

        public static int GetLastMaskPosition(string text) {
            var flagescape = false;
            text = ConvertMask(text);
            int LastPos = -1;
            int i;
            for(i = 0; i < text.Length; i++) {
                if(text.Substring(i, 1) == _charEscape && !flagescape)
                    flagescape = true;
                else if(_charsEditMask.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) != -1 && !flagescape)
                    LastPos = i;
                else if(flagescape)
                    flagescape = false;
            }

            return LastPos;
        }

        public static string GetValidMask(string text) {
            var ini = GetFirstMaskPosition(text);
            var fim = GetLastMaskPosition(text);
            text = ConvertMask(text);

            return text.Substring(ini, fim - ini + 1);
        }

        public static string ConvertMask(string text) {
            if(text == null)
                throw new ArgumentNullException("text");

            var maskConv = new StringBuilder();
            var qtdmask = new StringBuilder();
            var maskchar = String.Empty;
            var i = 0;

            for(i = 0; i < text.Length; i++) {
                if(_charsEditMask.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) != -1) {
                    if(qtdmask.Length == 0) {
                        maskConv.Append(text.Substring(i, 1));
                        qtdmask.Length = 0;
                        maskchar = text.Substring(i, 1);
                    } else if(text.Substring(i, 1) == "9")
                        qtdmask.Append("9");
                    else if(text.Substring(i, 1) == "0")
                        qtdmask.Append("0");
                } else if(_charsEditMask.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) == -1 && text.Substring(i, 1) != "{" && text.Substring(i, 1) != "}") {
                    if(qtdmask.Length == 0) {
                        maskConv.Append(text.Substring(i, 1));
                        qtdmask.Length = 0;
                        maskchar = String.Empty;
                    } else {
                        if(_charNumbers.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) != -1)
                            qtdmask.Append(text.Substring(i, 1));
                    }
                } else if(text.Substring(i, 1) == "{" && qtdmask.Length == 0) {
                    qtdmask.Length = 0;
                    qtdmask.Append("0");
                } else if(text.Substring(i, 1) == "}" && qtdmask.Length != 0) {
                    var qtddup = int.Parse(qtdmask.ToString(), CultureInfo.InvariantCulture) - 1;
                    if(qtddup > 0) {
                        var q = 0;
                        for(q = 0; q < qtddup; q++) {
                            maskConv.Append(maskchar);
                        }
                    }
                    qtdmask.Length = 0;
                    qtdmask.Append("0");
                    maskchar = String.Empty;
                }
            }

            return maskConv.ToString();
        }
    }

}

#pragma warning restore 1591