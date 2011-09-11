using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.UI;
using System.Web.UI.Design;
using System.Text;
using System.Web.UI.Design.WebControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {
    /// <summary>
    /// TwitterDesigner class provides functionality for visual studio design view.
    /// </summary>    
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes")]
    public class TwitterDesigner : CompositeControlDesigner {
        private Twitter _twitter;

        /// <summary>
        /// Intializes the twitter component and passes to initialize event of base class.
        /// </summary>
        /// <param name="component">component of twitter type.</param>
        public override void Initialize(System.ComponentModel.IComponent component) {
            _twitter = component as Twitter;
            if (_twitter == null)
                throw new ArgumentException("Component must be a Twitter control", "component");
            base.Initialize(component);
        }

        /// <summary>
        /// GetDesignTimeHtml displays contents at design time view.
        /// </summary>
        /// <returns>string containing html contents to display at design time.</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods")]
        public override string GetDesignTimeHtml() {
            // grab original HTML for base designer so user can resize control at design time
            var originalHtml = base.GetDesignTimeHtml();
            var lastIdx = originalHtml.IndexOf("<div", 1);
            originalHtml = lastIdx > 0
                ? originalHtml.Substring(0, (originalHtml.IndexOf("<div", 1)))
                : originalHtml.Remove(originalHtml.Length - 6, 6);

            // remove all tabs and new lines
            originalHtml = originalHtml
                    .Replace("\r", "")
                    .Replace("\n", "")
                    .Replace("\t", "");

            string twitterHtml = null;
            try {
                switch (_twitter.Mode) {
                    case TwitterMode.Profile:
                        if (string.IsNullOrEmpty(_twitter.ScreenName))
                            throw new Exception("Please specify a screen name");
                        break;
                    default:
                        if (string.IsNullOrEmpty(_twitter.Search))
                            throw new Exception("Please specify a search keyword");
                        break;
                }

                string userName = null;
                var api = new TwitterAPI();
                var statuses = GenerateData();
                if (statuses.Count > 0)
                    twitterHtml = RenderLayout(statuses);
                else
                    twitterHtml = RenderEmptyData();
            } catch (Exception ex) {
                if (twitterHtml == null) {
                    twitterHtml = "<div>" + ex.Message + "</div>";
                }
            }

            var styleSheetUrl = ViewControl.Page.ClientScript.GetWebResourceUrl(
                this.GetType(), "Twitter.Twitter_resource.css");

            var styleSheetHtml = string.Format(@"<link href=""{0}"" rel=""stylesheet"" type=""text/css""/>",
                styleSheetUrl);

            return originalHtml + styleSheetHtml + twitterHtml + "</div>";
        }

        private string RenderEmptyData() {
            //var pHolder = new ListView();
            //_twitter.EmptyDataTemplate.InstantiateIn(pHolder);
            //pHolder.DataBind();
            //return RenderControl(pHolder);
            return PersistTemplate(_twitter.EmptyDataTemplate);
        }

        private IList<TwitterStatus> GenerateData() {
            if (_twitter.IsLiveContentOnDesignMode) {
                /*---- live mode---*/
                IList<TwitterStatus> statuses = null;
                var api = new TwitterAPI();
                switch (_twitter.Mode) {
                    case TwitterMode.Profile:
                        statuses = api.GetProfile(_twitter.ScreenName, _twitter.Count,
                                                    _twitter.IncludeRetweets, _twitter.IncludeReplies);
                        if (statuses != null && statuses.Count > 0) {
                            var user = statuses[0].User;
                            _twitter.Title = _twitter.Title ?? user.Name;
                            _twitter.Caption = _twitter.Caption ?? user.ScreenName;
                            _twitter.ProfileImageUrl = _twitter.ProfileImageUrl ?? user.ProfileImageUrl;
                        }
                        break;
                    default:
                        statuses = api.GetSearch(_twitter.Search, _twitter.Count);
                        break;
                }
                return statuses;
            }

            /*---- fake mode --*/
            return GenerateFakeData();
        }

        private IList<TwitterStatus> GenerateFakeData() {
            var statuses = new List<TwitterStatus>();
            var twitterLogoUrl = ViewControl.Page.ClientScript.GetWebResourceUrl(
                this.GetType(), "Twitter.Twitter32.png");

            var user = new TwitterUser {
                ScreenName = "ajaxcontroltoolkit",
                Description = "Ajax Control Toolkit",
                Id = "ajaxcontroltoolkit",
                Name = "Ajax Control Toolkit",
                Location = "US",
                ProfileImageUrl = twitterLogoUrl
            };

            string search = "";
            if (_twitter.Mode == TwitterMode.Profile) {
                statuses.Add(new TwitterStatus {
                    CreatedAt = DateTime.Now,
                    Text = "Ajax Control Toolkit",
                    User = user
                });
                _twitter.Title = _twitter.Title ?? user.Name;
                _twitter.Caption = _twitter.Caption ?? user.ScreenName;
                _twitter.ProfileImageUrl = _twitter.ProfileImageUrl ?? user.ProfileImageUrl;

            } else {
                var searchText = _twitter.Search.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var s in searchText) {
                    search += "<em>" + s + "</em> ";
                }
                search = " " + search;
            }

            var text = new string[]
                           {
                               "Lorem <a href='http://www.sample_ipsum_link.com'>ipsum</a> dolor sit amet, "+search+"consectetur adipisicing elit, sed do eiusmod tempor incididunt ut",
                               "labore et dolore magna aliqua. Ut enim ad minim veniam, quis "+search+"nostrud exercitation",
                               "ullamco laboris "+search+"nisi ut aliquip ex ea <a href='http://comodo_sample_link'>commodo</a> consequat",
                               search + "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla",
                               "Excepteur sint "+search+"occaecat cupidatat non proident, sunt in culpa qui officia deserunt"
                           };

            int i = 0;
            var random = new Random();
            foreach (var s in text) {
                statuses.Add(new TwitterStatus {
                    CreatedAt = DateTime.Now.AddMinutes(random.Next(1, 1000) * -1),
                    Text = s,
                    User = user
                });
                i++;
                if (i > _twitter.Count)
                    break;
            }

            if (_twitter.Mode == TwitterMode.Profile && statuses.Count > 1) {
                statuses.RemoveAt(statuses.Count - 1);
            }

            return statuses;
        }

        private string RenderLayout(IList<TwitterStatus> statuses) {
            var html = RenderEvalScripts(_twitter.LayoutTemplate, statuses[0]);

            if (string.IsNullOrEmpty(html))
                html = PersistTemplate(_twitter.LayoutTemplate);

            var pattern = @"<(asp:)\b([^>]*?)(ITEMPLACEHOLDER)([^>]*?)(>([^>]*?)</asp:PlaceHolder>|/>)(.*?)";
            var r = new Regex(pattern, RegexOptions.IgnoreCase);

            var htmlStatus = "";
            foreach (var status in statuses) {
                htmlStatus += RenderStatus(status);
            }

            return r.Replace(html, htmlStatus);
        }

        /// <summary>
        /// Get string value from template
        /// </summary>
        /// <param name="template"></param>
        /// <returns></returns>
        private string PersistTemplate(ITemplate template) {
            var host = (IDesignerHost)GetService(typeof(IDesignerHost));
            return ControlPersister.PersistTemplate(template, host);
        }


        private List<string> _values = new List<string>();
        private int _valCounter = 0;

        string FillStatusValue(Match match) {
            _valCounter++;
            return _values[_valCounter - 1];
        }

        /// <summary>
        /// Search eval scripts in template and render it with appropriate values from status.
        /// If template doesn't contains eval scripts, it will returns null.
        /// </summary>
        /// <param name="template">Template Target</param>
        /// <param name="status">Twitter Status</param>
        /// <returns>Returns null if no eval scripts</returns>
        private string RenderEvalScripts(ITemplate template, TwitterStatus status) {
            // search is there any eval scripts
            var tempHtml = PersistTemplate(template);
            var r1 = new Regex(@"(<%#) ?.*eval?.*%>", RegexOptions.IgnoreCase);
            var matches = r1.Matches(tempHtml);

            _valCounter = 0;
            _values = new List<string>();

            // manualy extract eval scripts if any
            if (matches.Count > 0) {
                var r2 = new Regex(@"""(.*?)""");
                foreach (var match in matches) {
                    var evalData = r2.Match(match.ToString()).ToString();
                    evalData = evalData.Substring(1, evalData.Length - 2);

                    object value = null;
                    if (evalData.Contains(".")) {
                        var props = evalData.Split(new string[] { "." }, StringSplitOptions.RemoveEmptyEntries);
                        var propVal1 = typeof(TwitterStatus).GetProperty(props[0]).GetValue(status, null);
                        if (propVal1 != null)
                            value = propVal1.GetType().GetProperty(props[1]).GetValue(propVal1, null);
                    } else {
                        value = typeof(TwitterStatus).GetProperty(evalData).GetValue(status, null);
                    }

                    if (value == null)
                        value = "[" + evalData + "]";

                    _values.Add(value.ToString());
                }

                var evaluator = new MatchEvaluator(FillStatusValue);
                return r1.Replace(tempHtml, evaluator);
            }

            return null;
        }


        /// <summary>
        /// Render twitter status from template and render it
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        private string RenderStatus(TwitterStatus status) {
            // try search if contains any eval scripts
            var html = RenderEvalScripts(_twitter.StatusTemplate, status);

            // render control directly if template not contains eval scripts
            if (string.IsNullOrEmpty(html)) {
                var pHolder = new ListViewDataItem(0, 0) { DataItem = status };
                _twitter.StatusTemplate.InstantiateIn(pHolder);
                pHolder.DataBind();
                html = RenderControl(pHolder);
            }

            return html;
        }

        private static string RenderControl(Control control) {
            var sb = new StringBuilder();
            using (var tw = new StringWriter(sb)) {
                using (var hw = new HtmlTextWriter(tw)) {
                    control.RenderControl(hw);
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// Determines whether resize is allowed.
        /// </summary>
        public override bool AllowResize {
            get { return true; }
        }

        /// <summary>
        /// Determines whether visible or not.
        /// </summary>
        protected override bool Visible {
            get { return true; }
        }

    }
}
