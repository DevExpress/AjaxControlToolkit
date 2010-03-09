namespace Microsoft.Internal.Test {
    using Microsoft.Win32;
    using System;
    using System.IO;
    using System.Threading;
    using System.Reflection;
    using System.Runtime.InteropServices;
    using HtmlAgilityPack;

    public class IEElement {
        Type ieType;
        object element;

        public IEElement(object element, Type ieType) {
            this.ieType = ieType;
            this.element = element;
        }

        public IEElement this[int index] {
            get {
                return GetChild(index);
            }
        }

        public object Element {
            get {
                return element;
            }
        }

        public object InvokeMethod(string methodName, params object[] pars) {
            return ieType.InvokeMember(methodName, BindingFlags.InvokeMethod, null, element, pars);
        }

        public string GetAttribute(string attributeName) {
            object retVal = ieType.InvokeMember("GetAttribute", BindingFlags.InvokeMethod, null, element, new object[] { attributeName, 0 });
            return (retVal == null ? String.Empty : retVal.ToString());
        }

        //Convert mal-formed HtmlString to well-formed XmlString
        public string ConvertFromHtmlStringToXmlString(string htmlString) {
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(htmlString);
            StringWriter wr = new StringWriter();
            doc.Save(wr);
            return wr.ToString().Trim();
        }

        public string GetProperty(string propertyName) {
            object retVal = ieType.InvokeMember(propertyName, BindingFlags.GetProperty, null, element, null);
            string htmlString = retVal == null ? String.Empty : retVal.ToString();
            return ConvertFromHtmlStringToXmlString(htmlString);
        }

        public string GetStyleText() {
            object style = ieType.InvokeMember("style", BindingFlags.GetProperty, null, element, null);
            object retVal = ieType.InvokeMember("cssText", BindingFlags.GetProperty, null, style, null);
            //We need to parse and sort style text here due to IE8 compatibility issue
            string htmlString = retVal == null ? String.Empty : retVal.ToString();
            string[] values = htmlString.Split(';');
            for (int i=0; i<values.Length; i++) {
                values[i] = values[i].Trim();
            }
            Array.Sort(values);
            return String.Join("; ", values, 0, values.Length);
        }

        public void SetProperty(string propertyName, object value) {
            ieType.InvokeMember(propertyName, BindingFlags.SetProperty, null, element, new object[] { value });
        }

        public IEElement GetItem(int itemNo) {
            object retVal = ieType.InvokeMember("item", BindingFlags.InvokeMethod,
                                null, element, new object[] { itemNo });
            if (retVal == null) {
                return null;
            }
            else {
                return new IEElement(retVal, ieType);
            }
        }

        public IEElement GetChild(int childNo) {
            object children = ieType.InvokeMember("children", BindingFlags.GetProperty, null, element, null);
            object retVal = ieType.InvokeMember("item", BindingFlags.InvokeMethod,
                                null, children, new object[] { childNo });
            if (retVal == null) {
                return null;
            }
            else {
                return new IEElement(retVal, ieType);
            }
        }

        public int ChildCount {
            get {
                object children = ieType.InvokeMember("children", BindingFlags.GetProperty, null, element, null);
                object retVal = ieType.InvokeMember("length", BindingFlags.GetProperty,
                                null, children, null);
                return (int)retVal;
            }
        }

        public IEElement[] GetChildren() {
            int count = ChildCount;
            IEElement[] result = new IEElement[count];
            for (int i = 0; i < count; i++) {
                result[i] = this[i];
            }
            return result;
        }

        public IEElement GetDescendant(params int[] path) {
            IEElement result = this;
            foreach (int pathElement in path) {
                result = result[pathElement];
                if (result == null)
                    return null;
            }
            return result;
        }

        public override string ToString() {
            return "{tag=" + GetProperty("tagName") + " children=" + ChildCount.ToString() + "}";
        }

    }
}
