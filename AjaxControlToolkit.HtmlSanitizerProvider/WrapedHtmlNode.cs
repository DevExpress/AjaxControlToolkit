using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    internal class WrapedHtmlNode : IHtmlNode {
        HtmlNode _wrappedNode;

        public WrapedHtmlNode(HtmlNode wrappedNode) {
            if(wrappedNode == null)
                throw new ArgumentNullException("agilityPackNode");

            _wrappedNode = wrappedNode;
        }

        public string Name {
            get { return _wrappedNode.Name; }
        }

        public IEnumerable<IHtmlNode> Children {
            get {
                return _wrappedNode.ChildNodes
                    .Where(n => n.NodeType == HtmlNodeType.Element)
                    .Select(n => new WrapedHtmlNode(n));
            }
        }

        public IEnumerable<IHtmlAttribute> Attributes {
            get { return _wrappedNode.Attributes.Select(a => new WrapedHtmlAttribute(a)); }
        }

        public void Remove() {
            _wrappedNode.ParentNode.RemoveChild(_wrappedNode);
        }
    }

}