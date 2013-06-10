
// 
// Product      : MaskedEdit Extend/Validator Control
// Version      : 1.0.0.0
// Date         : 10/23/2006
// Development  : Fernando Cerqueira 
// Version      : 1.0.0.1
// Development  : 02/22/2007 Fernando Cerqueira 
// 
using System;
using System.Data;
using System.Configuration;
using System.Globalization;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.ComponentModel;

namespace AjaxControlToolkit
{
    public static class MaskedEditCommon
    {
        const string _charEscape = "\\";
        const string _CharsEditMask = "9L$CAN?";
        const string _charNumbers = "0123456789";

        static public int GetFirstMaskPosition(string text)
        {
            bool flagescape = false;
            text = ConvertMask(text);
            int i;
            for (i = 0; i < text.Length; i++)
            {
                if (text.Substring(i, 1) == _charEscape && !flagescape)
                {
                    flagescape = true;
                }
                else if (_CharsEditMask.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) != -1 && !flagescape)
                {
                    return i;
                }
                else if (flagescape)
                {
                    flagescape = false;
                }
            }
            return -1;
        }
        static public int GetLastMaskPosition(string text)
        {
            bool flagescape = false;
            text = ConvertMask(text);
            int LastPos = -1;
            int i;
            for (i = 0; i < text.Length; i++)
            {
                if (text.Substring(i, 1) == _charEscape && !flagescape)
                {
                    flagescape = true;
                }
                else if (_CharsEditMask.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) != -1 && !flagescape)
                {
                    LastPos = i;
                }
                else if (flagescape)
                {
                    flagescape = false;
                }
            }
            return LastPos;
        }
        static public string GetValidMask(string text)
        {
            int ini = GetFirstMaskPosition(text);
            int fim = GetLastMaskPosition(text);
            text = ConvertMask(text);
            return text.Substring(ini, fim - ini + 1);
        }
        static public string ConvertMask(string text)
        {
            if (null == text)
            {
                throw new ArgumentNullException("text");
            }
            StringBuilder MaskConv = new StringBuilder();
            StringBuilder qtdmask = new StringBuilder();
            string maskchar = "";
            int i = 0;
            for (i = 0; i < text.Length; i++)
            {
                if (_CharsEditMask.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) != -1)
                {
                    if (qtdmask.Length == 0)
                    {
                        MaskConv.Append(text.Substring(i, 1));
                        qtdmask.Length = 0;
                        maskchar = text.Substring(i, 1);
                    }
                    else if (text.Substring(i, 1) == "9")
                    {
                        qtdmask.Append("9");
                    }
                    else if (text.Substring(i, 1) == "0")
                    {
                        qtdmask.Append("0");
                    }
                }
                else if (_CharsEditMask.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) == -1 && text.Substring(i, 1) != "{" && text.Substring(i, 1) != "}")
                {
                    if (qtdmask.Length == 0)
                    {
                        MaskConv.Append(text.Substring(i, 1));
                        qtdmask.Length = 0;
                        maskchar = "";
                    }
                    else
                    {
                        if (_charNumbers.IndexOf(text.Substring(i, 1), StringComparison.Ordinal) != -1)
                        {
                            qtdmask.Append(text.Substring(i, 1));
                        }
                    }
                }
                else if (text.Substring(i, 1) == "{" && qtdmask.Length == 0)
                {
                    qtdmask.Length = 0;
                    qtdmask.Append("0");
                }
                else if (text.Substring(i, 1) == "}" && qtdmask.Length != 0)
                {
                    int qtddup = int.Parse(qtdmask.ToString(), CultureInfo.InvariantCulture) - 1;
                    if (qtddup > 0)
                    {
                        int q = 0;
                        for (q = 0; q < qtddup; q++)
                        {
                            MaskConv.Append(maskchar);
                        }
                    }
                    qtdmask.Length = 0;
                    qtdmask.Append("0");
                    maskchar = "";
                }
            }
            return MaskConv.ToString();
        }
    }
}
