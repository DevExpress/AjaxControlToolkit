using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using AjaxControlToolkit.ReferenceCore.Parsing;

namespace AjaxControlToolkit.Reference.Core.Parsing {

    public class DocParser {
        const string SummaryTagName = "summary";
        const string RemarksTagName = "remarks";
        const string GetterTagName = "getter";
        const string SetterTagName = "setter";
        const string ParamTagName = "param";
        const string EventTagName = "event";

        static Lazy<DocParser> _instance = new Lazy<DocParser>(() => new DocParser());
        public static DocParser Instance {
            get { return _instance.Value; }
        }

        DocParser() { }

        public void FillInfo(TypeDoc info, IEnumerable<XElement> values, ContentType contentType) {
            GetSummaryAndRemarks(info, values, contentType);
        }

        public void FillInfo(MethodDoc info, IEnumerable<XElement> values, ContentType contentType) {
            GetSummaryAndRemarks(info, values, contentType);
            var parameters = values.Where(el => el.Name == ParamTagName);

            foreach(var param in parameters) {
                var name = param.Attribute("name").Value;
                var typeName = param.Attribute("type") != null ? param.Attribute("type").Value : null;
                var description = CleanSpaces(param.Value, true);
                info.AddParam(name, typeName, description);
            }
        }

        public void FillInfo(PropertyDoc info, IEnumerable<XElement> values, ContentType contentType) {
            GetSummaryAndRemarks(info, values, contentType);
        }

        public void FillInfo(EventDoc info, IEnumerable<XElement> values, ContentType contentType) {
            GetSummaryAndRemarks(info, values, contentType);
        }

        public void FillInfo(ClientPropertyDoc info, IEnumerable<XElement> values, ContentType contentType) {
            GetSummaryAndRemarks(info, values, contentType);
            info.GetterName = GetValue(values, GetterTagName, contentType);
            info.SetterName = GetValue(values, SetterTagName, contentType);
        }

        public void FillInfo(ClientEventDoc info, IEnumerable<XElement> values, ContentType contentType) {
            GetSummaryAndRemarks(info, values, contentType);
            var @event = values.Where(el => el.Name == EventTagName).FirstOrDefault();

            info.AddMethodName = @event.Attribute("add").Value;
            info.RemoveMethodName = @event.Attribute("remove").Value;
            info.RaiseMethodName = @event.Attribute("raise") != null ? @event.Attribute("raise").Value : null;
        }

        void GetSummaryAndRemarks(DocBase info, IEnumerable<XElement> values, ContentType contentType) {
            if(values.Any()) {
                info.Summary = GetValue(values, SummaryTagName, contentType);
                info.Remarks = GetValue(values, RemarksTagName, contentType);
            } else
                info.Summary = "<INVALID DOC MARKUP>";
        }

        string GetValue(IEnumerable<XElement> values, string elementName, ContentType contentType) {
            if(elementName != "param" &&
                values.Count(el => el.Name == elementName) > 1)
                throw new InvalidOperationException(String.Format("Invalid documentaion XML format. Element {0} appears more than once.", elementName));

            var element = values.FirstOrDefault(el => el.Name == elementName);

            if(element == null)
                return null;

            return CleanSpaces(element.Value, true);
        }

        string CleanSpaces(string value, bool cleanNewLine) {
            if(cleanNewLine)
                return Regex.Replace(value, @"\s+", " ");
            else
                return Regex.Replace(value, @"[^\S\r\n]+", " ");
        }
    }
}