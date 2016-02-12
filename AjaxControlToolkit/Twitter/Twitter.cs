#pragma warning disable 1591
using AjaxControlToolkit.Design;
using AjaxControlToolkit.ToolboxIcons;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Caching;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// Displays tweets from Twitter.com. Supports the Profile mode for showing tweets
    /// for a particular user and the Search mode for showing tweets that match a search string. 
    /// </summary>
    [ClientCssResource(Constants.TwitterName)]
    [Designer(typeof(TwitterDesigner))]
    [System.Drawing.ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.TwitterName + Constants.IconPostfix)]
    public class Twitter : CompositeControl {

        ListView _listView;

        /// <summary>
        /// A Twitter Screen name used in Profile mode
        /// </summary>
        public TwitterMode Mode { get; set; }

        /// <summary>
        /// Twitter Screen Name used in Profile mode
        /// </summary>
        [Category("Profile")]
        [Description("Twitter Screen Name used when Mode=Profile")]
        public string ScreenName { get; set; }

        /// <summary>
        /// Twitter Caption that appears in the default layout template
        /// </summary>
        /// <remarks>
        /// Enables you to display caption text in the header.
        /// In Profile mode, the default value is a user screen name
        /// </remarks>
        [Category("Search")]
        [Description("Twitter Caption")]
        public string Caption { get; set; }

        /// <summary>
        /// A twitter title that appears in the default layout template
        /// </summary>
        /// <remarks>
        /// Enables you to display title text in the header.
        /// In Profile mode, the default value is a full user name
        /// </remarks>
        [Category("Search")]
        [Description("Twitter Title")]
        public string Title { get; set; }

        /// <summary>
        /// A Twitter Profile image that appears in the default layout template
        /// </summary>
        [Category("Search")]
        [Description("Twitter Profile Image Url")]
        public string ProfileImageUrl { get; set; }

        /// <summary>
        /// A twitter search query used in Search mode
        /// </summary>
        /// <remarks>
        /// You can build complex queries with search operators (https://dev.twitter.com/docs/using-search)
        /// </remarks>
        public string Search { get; set; }

        /// <summary>
        /// Indicates whether or not retweets are displayed in Profile mode
        /// </summary>
        public bool IncludeRetweets { get; set; }

        /// <summary>
        /// Indicates whether or not replies are displayed in Profile mode
        /// </summary>
        public bool IncludeReplies { get; set; }

        /// <summary>
        /// A maximum number of tweets to display. The default value is 5
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        /// Time in minutes that twitter results are cached. The default value is 300 seconds
        /// </summary>
        public int CacheDuration { get; set; }

        /// <summary>
        /// Allows getting live content from the twitter server at design time
        /// </summary>
        [Browsable(true)]
        [Description("Enable get live content from twitter server at design time")]
        public bool IsLiveContentOnDesignMode { get; set; }

        /// <summary>
        /// A template that contains each status message (tweet)
        /// </summary>
        /// <remarks>
        /// An equivalent to the ItemTemplate in ListView
        /// </remarks>
        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(ListViewItem))]
        public ITemplate StatusTemplate { get; set; }

        /// <summary>
        /// A template which is applied for alternating status messages (tweets)
        /// </summary>
        /// <remarks>
        /// An equivalent to the AlternatingItemTemplate in ListView
        /// </remarks>
        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(ListViewItem))]
        public ITemplate AlternatingStatusTemplate { get; set; }

        /// <summary>
        /// A template that displays content when there are no tweets
        /// </summary>
        /// <remarks>
        /// An equivalent to the EmptyDataTemplate in ListView
        /// </remarks>
        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(ListView))]
        public ITemplate EmptyDataTemplate { get; set; }

        /// <summary>
        /// A template that contains HTML for the root container of the ListView content
        /// </summary>
        /// <remarks>
        /// Displays the root content of the Twitter control
        /// </remarks>
        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(Twitter))]
        public ITemplate LayoutTemplate { get; set; }

        // The containing tag for the Twitter control is a DIV
        protected override HtmlTextWriterTag TagKey {
            get { return HtmlTextWriterTag.Div; }
        }

        public Twitter() {
            Mode = TwitterMode.Profile;

            CacheDuration = 5 * 60;

            Count = 5;

            CssClass = "ajax__twitter";
        }


        // We need to manually register the CSS references because the Twitter control
        // is a Composite control and not an extender control.
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);
            ToolkitResourceManager.RegisterCssReferences(this);
        }

        // Validates required properties and binds the data
        // to the ListView
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);
            ControlPropertiesValid();

            IList<TwitterStatus> statuses = null;

            switch (Mode) {
                case TwitterMode.Profile:
                    statuses = GetProfile();
                    if (statuses != null && statuses.Count > 0) {
                        var user = statuses[0].User;
                        Title = Title ?? user.Name;
                        Caption = Caption ?? user.ScreenName;
                        ProfileImageUrl = ProfileImageUrl ?? user.ProfileImageUrl;
                    }
                    break;
                case TwitterMode.Search:
                    statuses = GetSearch();
                    break;
            }

            _listView.DataSource = statuses;
            _listView.DataBind();
        }
        
        // Validates that required properties are set.
        void ControlPropertiesValid() {
            switch (Mode) {
                case TwitterMode.Profile:
                    if (String.IsNullOrEmpty(ScreenName))
                        throw new HttpException("ScreenName must have a value");
                    break;
                case TwitterMode.Search:
                    if (String.IsNullOrEmpty(Search))
                        throw new HttpException("Search must have a value");
                    break;
            }
        }

        protected override void CreateChildControls() {
            Controls.Clear();

            _listView = new ListView();
            Controls.Add(_listView);

            // Assign templates to the ListView
            PrepareTemplates();
        }

        // Assigns default templates depending on the Mode.
        void PrepareTemplates() {
            // Set appropriate default templates for each twitter mode
            switch (Mode) {
                case TwitterMode.Profile:
                    if (LayoutTemplate == null)
                        LayoutTemplate = new DefaultProfileLayoutTemplate(this);
                    if (StatusTemplate == null)
                        StatusTemplate = new DefaultProfileStatusTemplate(this);
                    break;
                case TwitterMode.Search:
                    if (LayoutTemplate == null)
                        LayoutTemplate = new DefaultSearchLayoutTemplate(this);
                    if (StatusTemplate == null)
                        StatusTemplate = new DefaultSearchStatusTemplate(this);
                    break;
            }

            // Assign default empty data template
            if (EmptyDataTemplate == null) {
                EmptyDataTemplate = new DefaultEmptyDataTemplate();
            }

            // Copy templates from Twitter control to ListView
            _listView.LayoutTemplate = LayoutTemplate;
            _listView.ItemTemplate = StatusTemplate;
            _listView.AlternatingItemTemplate = AlternatingStatusTemplate;
            _listView.EmptyDataTemplate = EmptyDataTemplate;
        }

        // Get the Profile tweets from the Twitter API. Cache the results.
        IList<TwitterStatus> GetProfile() {
            var cacheKey = String.Format("__TwitterProfile_{0}_{1}_{2}_{3}", ScreenName, Count, IncludeRetweets, IncludeReplies);

            var results = (IList<TwitterStatus>)Context.Cache[cacheKey];
            if (results == null) {
                var api = new TwitterAPI();
                try {
                    results = api.GetProfile(ScreenName, Count, IncludeRetweets, IncludeReplies);
                } catch {
                    return null;
                }
                Context.Cache.Insert(cacheKey, results, null, DateTime.UtcNow.AddSeconds(CacheDuration), Cache.NoSlidingExpiration);
            }

            return results;
        }

        // Get the search results from the Twitter API. Cache the results.
        IList<TwitterStatus> GetSearch() {
            var cacheKey = String.Format("__TwitterSearch_{0}_{1}", Search, Count);

            var results = (IList<TwitterStatus>)Context.Cache[cacheKey];
            if (results == null) {
                var api = new TwitterAPI();
                try {
                    results = api.GetSearch(Search, Count);
                } catch {
                    return null;
                }
                Context.Cache.Insert(cacheKey, results, null,
                    DateTime.UtcNow.AddSeconds(CacheDuration), Cache.NoSlidingExpiration);
            }

            return results;
        }

        // Returns the number of minutes or hours or days 
        // between current date and supplied date.
        public static string Ago(DateTime date) {
            var timeSpan = DateTime.Now - date;
            if (timeSpan.TotalMinutes < 1)
                return "Less than a minute ago";
            else if (Math.Round(timeSpan.TotalHours) < 2)
                return String.Format("{0} minutes ago", Math.Round(timeSpan.TotalMinutes));
            else if (Math.Round(timeSpan.TotalDays) < 2)
                return String.Format("{0} hours ago", Math.Round(timeSpan.TotalHours));
            else
                return String.Format("{0} days ago", Math.Round(timeSpan.TotalDays));
        }

        public static string ActivateLinks(string text) {
            var pattern = @"(((http|https)+\:\/\/)[&#95;.a-z0-9-]+\.[a-z0-9\/&#95;:@=.+?,##%&~-]*[^.|\'|\# |!|\(|?|,| |>|<|;|\)])";
            var r = new Regex(pattern, RegexOptions.IgnoreCase);
            return r.Replace(text, "<a href=\"$1\">$1</a>");
        }

        // Default template used for Status Template in Profile Mode
        internal sealed class DefaultProfileStatusTemplate : ITemplate {

            Twitter _twitter;

            internal DefaultProfileStatusTemplate(Twitter twitter) {
                _twitter = twitter;
            }

            void ITemplate.InstantiateIn(Control container) {
                var ctlStatus = new LiteralControl();
                ctlStatus.DataBinding += ctlStatus_DataBind;
                container.Controls.Add(ctlStatus);
            }

            void ctlStatus_DataBind(object sender, EventArgs e) {
                // set the Text property of the Label to the TotalPostCount property
                var ctlStatus = (LiteralControl)sender;
                var container = (ListViewDataItem)ctlStatus.NamingContainer;
                var status = ((TwitterStatus)container.DataItem);

                ctlStatus.Text = String.Format(
                    "<li>{0}<br /><span class=\"ajax__twitter_createat\">{1}</span></li>",
                    Twitter.ActivateLinks(status.Text),
                    Twitter.Ago(status.CreatedAt)
                );
            }
        }

        // Default template used for LayoutTemplate in Profile Mode
        internal sealed class DefaultProfileLayoutTemplate : ITemplate {

            Twitter _twitter;

            public DefaultProfileLayoutTemplate(Twitter twitter) {
                _twitter = twitter;
            }

            void ITemplate.InstantiateIn(Control container) {
                // Add header
                var ctlHeader = new HtmlGenericControl("div");
                ctlHeader.Attributes.Add("class", "ajax__twitter_header");
                container.Controls.Add(ctlHeader);

                // Create Profile Image Url
                var ctlProfileImage = new Image() {
                    ImageUrl = _twitter.ProfileImageUrl
                };
                ctlHeader.Controls.Add(ctlProfileImage);

                // Create Title
                var ctlTitle = new HtmlGenericControl("h3");
                ctlTitle.Controls.Add(new LiteralControl(_twitter.Title));
                ctlHeader.Controls.Add(ctlTitle);

                // Create Caption
                var ctlCaption = new HtmlGenericControl("h4");
                ctlCaption.Controls.Add(new LiteralControl(_twitter.Caption));
                ctlHeader.Controls.Add(ctlCaption);

                // Add unordered list
                var ctlList = new HtmlGenericControl("ul");
                ctlList.Attributes.Add("class", "ajax__twitter_itemlist");
                ctlList.Style.Add("margin", "0px");
                container.Controls.Add(ctlList);

                // Create item placeholder
                var plhItem = new PlaceHolder();
                plhItem.ID = "ItemPlaceholder";
                ctlList.Controls.Add(plhItem);

                var ctlFooter = new HtmlGenericControl("div");
                var smallLogoUrl = ToolkitResourceManager.GetImageHref(Constants.Twitter24Image, _twitter);
                ctlFooter.Attributes.Add("class", "ajax__twitter_footer");
                ctlFooter.Controls.Add(new Image() { ImageUrl = smallLogoUrl });
                container.Controls.Add(ctlFooter);
            }
        }

        // Default template used for StatusTemplate in Search Mode
        internal sealed class DefaultSearchStatusTemplate : ITemplate {

            Twitter _twitter;

            internal DefaultSearchStatusTemplate(Twitter twitter) {
                _twitter = twitter;
            }

            void ITemplate.InstantiateIn(Control container) {
                var ctlStatus = new LiteralControl();
                ctlStatus.DataBinding += ctlStatus_DataBind;
                container.Controls.Add(ctlStatus);
            }

            void ctlStatus_DataBind(object sender, EventArgs e) {
                // set the Text property of the Label to the TotalPostCount property
                var ctlStatus = (LiteralControl)sender;
                var container = (ListViewDataItem)ctlStatus.NamingContainer;
                var status = ((TwitterStatus)container.DataItem);

                // Show status
                ctlStatus.Text = String.Format(
                    "<li><img src=\"{0}\" /><div>{1}<br /><span class=\"ajax__twitter_createat\">{2}</span></div></li>",
                    status.User.ProfileImageUrl,
                    status.Text,
                    Twitter.Ago(status.CreatedAt)
                );
            }
        }

        // Default template used for Layout template in Search Mode
        internal sealed class DefaultSearchLayoutTemplate : ITemplate {

            Twitter _twitter;

            public DefaultSearchLayoutTemplate(Twitter twitter) {
                _twitter = twitter;
            }

            void ITemplate.InstantiateIn(Control container) {
                // Add header
                var ctlHeader = new HtmlGenericControl("div");
                ctlHeader.Attributes.Add("class", "ajax__twitter_header");
                container.Controls.Add(ctlHeader);

                // Create Title
                var ctlTitle = new HtmlGenericControl("h3");
                ctlTitle.Controls.Add(new LiteralControl(_twitter.Title));
                ctlHeader.Controls.Add(ctlTitle);

                // Create Caption
                var ctlCaption = new HtmlGenericControl("h4");
                ctlCaption.Controls.Add(new LiteralControl(_twitter.Caption));
                ctlHeader.Controls.Add(ctlCaption);

                // Add unordered list
                var ctlList = new HtmlGenericControl("ul");
                ctlList.Style.Add("margin", "0px");
                ctlList.Attributes.Add("class", "ajax__twitter_itemlist");
                container.Controls.Add(ctlList);

                // Create item placeholder
                var plhItem = new PlaceHolder();
                plhItem.ID = "ItemPlaceholder";
                ctlList.Controls.Add(plhItem);

                var ctlFooter = new HtmlGenericControl("div");
                var smallLogoUrl = ToolkitResourceManager.GetImageHref(Constants.Twitter24Image, _twitter);
                ctlFooter.Attributes.Add("class", "ajax__twitter_footer");
                ctlFooter.Controls.Add(new Image() { ImageUrl = smallLogoUrl });
                container.Controls.Add(ctlFooter);
            }
        }

        // Default template used for no results
        internal sealed class DefaultEmptyDataTemplate : ITemplate {
            void ITemplate.InstantiateIn(Control container) {
                container.Controls.Add(new LiteralControl("There are no matching tweets."));
            }
        }
    }

}

#pragma warning restore 1591