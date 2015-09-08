using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace AjaxControlToolkit.Reference.Core.Parsing {

    public class CommentParser {

        public IEnumerable<RawDoc> ParseFile(string[] lines, String typeFullName) {
            foreach(var block in GetCommentBlocks(lines)) {
                var blockString = String.Join(" ", block.Lines);
                blockString = blockString.Replace("<summary>", "<summary><![CDATA[").Replace("</summary>", "]]></summary>");

                var blockContent = "<root>" + blockString + "</root>";
                var element = XElement.Parse(blockContent);

                var member = element.Elements("member").FirstOrDefault();
                member.Remove();

                var memberName = member.Attribute("name").Value;
                if(memberName.Substring(3).StartsWith(typeFullName))
                    yield return new RawDoc(memberName) {
                        Elements = element.Elements()
                    };
            }
        }

        IEnumerable<CommentBlock> GetCommentBlocks(string[] lines) {
            var block = new CommentBlock();

            foreach(var line in lines) {
                if(!IsCommentLine(line)) {
                    if(!block.IsEmpty) {
                        yield return block;
                        block = new CommentBlock();
                    }
                    continue;
                }

                var trimmmedLine = line.TrimStart('/', '\t', ' ');
                if(!String.IsNullOrWhiteSpace(trimmmedLine))
                    block.AddLine(trimmmedLine);
            }

            if(!block.IsEmpty)
                yield return block;
        }

        static bool IsCommentLine(string line) {
            return Regex.IsMatch(line, "^(\t| )*///");
        }
    }
}