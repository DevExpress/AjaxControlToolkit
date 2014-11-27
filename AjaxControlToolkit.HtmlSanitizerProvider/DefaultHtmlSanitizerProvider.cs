using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public class DefaultHtmlSanitizerProvider : HtmlSanitizerProvider {
        HtmlSanitizer _sanitizer;

        public DefaultHtmlSanitizerProvider() {
            _sanitizer = new HtmlSanitizer();
        }

        public override string GetSafeHtmlFragment(string htmlText, Dictionary<string, string[]> tagsWhiteList) {
            var html = new HtmlDocument();
            html.OptionFixNestedTags = true;
            html.OptionAutoCloseOnEnd = true;
            html.OptionDefaultStreamEncoding = Encoding.UTF8;
            html.LoadHtml(htmlText);

            if(html == null)
                return String.Empty;

            _sanitizer.Sanitize(new WrapedHtmlNode(html.DocumentNode), tagsWhiteList);

            return html.DocumentNode.InnerHtml;
        }
    }

}