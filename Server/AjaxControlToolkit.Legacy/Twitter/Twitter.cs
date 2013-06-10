using System.Web.UI;
using System.ComponentModel;
using System.Web.UI.WebControls;
using System.Collections.Generic;
using System;
using System.Web;
using System.Web.UI.HtmlControls;
using AjaxControlToolkit;
using System.Text;
using System.Text.RegularExpressions;

[assembly: WebResource("Twitter.Twitter_resource.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("Twitter.Twitter32.png", "img/png")]
[assembly: WebResource("Twitter.Twitter24.png", "img/png")]

namespace AjaxControlToolkit {


    /// <summary>
    /// Displays tweets from Twitter.com. Supports Profile mode for showing tweets
    /// for a particular user and Search mode for showing tweets which match a 
    /// search string.
    /// </summary>


    [ClientCssResource("Twitter.Twitter_resource.css")]
    [ParseChildren(ChildrenAsProperties = true), PersistChildren(false)]
    [Designer(typeof(TwitterDesigner))]
    public class Twitter : CompositeControl {


        private ListView _listView;

        /// <summary>
        /// Determines the overall behavior of the control
        /// </summary>
        public TwitterMode Mode { get; set; }

        /// <summary>
        /// Twitter Screen Name used when Mode=Profile
        /// </summary>
        [Category("Profile")]
        [Description("Twitter Screen Name used when Mode=Profile")]
        public string ScreenName { get; set; }

        /// <summary>
        /// Twitter Caption which appears in default layout template
        /// </summary>
        [Category("Search")]
        [Description("Twitter Caption")]
        public string Caption { get; set; }

        /// <summary>
        /// Twitter Title which appears in default layout template
        /// </summary>
        [Category("Search")]
        [Description("Twitter Title")]
        public string Title { get; set; }



        /// <summary>
        /// Twitter Profile image which appears in default layout template
        /// </summary>
        [Category("Search")]
        [Description("Twitter Profile Image Url")]
        public string ProfileImageUrl { get; set; }


        /// <summary>
        /// The twitter search query used when in Mode=Search
        /// </summary>
        public string Search { get; set; }

        /// <summary>
        /// Include Retweets when displaying tweets
        /// </summary>
        public bool IncludeRetweets { get; set; }


        /// <summary>
        /// Include Replies when displaying tweets
        /// </summary>
        public bool IncludeReplies { get; set; }


        /// <summary>
        /// Maximum number of tweets to display
        /// </summary>
        public int Count { get; set; }


        /// <summary>
        /// Time in minutes that twitter results are cached.
        /// </summary>
        public int CacheDuration { get; set; }


        /// <summary>
        /// Enable get live content from twitter server at design time
        /// </summary>
        [Browsable(true)]
        [Description("Enable get live content from twitter server at design time")]
        public bool IsLiveContentOnDesignMode { get; set; }


        /// <summary>
        /// The equivalent to the ItemTemplate in a ListView
        /// </summary>
        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(ListViewItem))]
        public ITemplate StatusTemplate { get; set; }


        /// <summary>
        /// The equivalent to the AlternatingItemTemplate in a ListView
        /// </summary>
        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(ListViewItem))]
        public ITemplate AlternatingStatusTemplate { get; set; }


        /// <summary>
        /// The equivalent to the EmptyDataTemplate in a ListView
        /// </summary>
        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(ListView))]
        public ITemplate EmptyDataTemplate { get; set; }


        /// <summary>
        /// Displays the root content of the Twitter control
        /// </summary>
        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(Twitter))]
        public ITemplate LayoutTemplate { get; set; }


        /// <summary>
        /// The containing tag for the Twitter control is a DIV
        /// </summary>
        protected override HtmlTextWriterTag TagKey {
            get {
                return HtmlTextWriterTag.Div;
            }
        }


        /// <summary>
        /// Set the defaults in the constructor
        /// </summary>
        public Twitter() {
            // Default mode is Profile
            this.Mode = TwitterMode.Profile;

            // By default, cache for 5 minutes
            this.CacheDuration = 5 * 60;

            // By default, show 5 statuses
            this.Count = 5;


            this.CssClass = "ajax__twitter";
        }


        /// <summary>
        /// We need to manually register the CSS references because the Twitter control
        /// is a Composite control and not an extender control.
        /// </summary>
        /// <param name="e"></param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2109:ReviewVisibleEventHandlers", MessageId = "0#")]
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);
            ScriptObjectBuilder.RegisterCssReferences(this);
        }

        /// <summary>
        /// Validates required properties and binds the data
        /// to the ListView
        /// </summary>
        /// <param name="e"></param>
        protected override void OnPreRender(System.EventArgs e) {
            base.OnPreRender(e);
            this.ControlPropertiesValid();

            IList<TwitterStatus> statuses = null;

            switch (this.Mode) {
                case TwitterMode.Profile:
                    statuses = this.GetProfile();
                    if (statuses != null && statuses.Count > 0) {
                        var user = statuses[0].User;
                        this.Title = this.Title ?? user.Name;
                        this.Caption = this.Caption ?? user.ScreenName;
                        this.ProfileImageUrl = this.ProfileImageUrl ?? user.ProfileImageUrl;
                    }
                    break;
                case TwitterMode.Search:
                    statuses = this.GetSearch();
                    break;
            }

            _listView.DataSource = statuses;
            _listView.DataBind();
        }





        /// <summary>
        /// Validates that required properties are set.
        /// </summary>
        private void ControlPropertiesValid() {
            switch (this.Mode) {
                case TwitterMode.Profile:
                    if (String.IsNullOrEmpty(this.ScreenName)) {
                        throw new HttpException("ScreenName must have a value");
                    }
                    break;
                case TwitterMode.Search:
                    if (String.IsNullOrEmpty(this.Search)) {
                        throw new HttpException("Search must have a value");
                    }
                    break;
            }
        }


        /// <summary>
        /// Adds the ListView control to the child controls.
        /// </summary>
        protected override void CreateChildControls() {
            Controls.Clear();

            // The ListView is used to display the contents of the control
            _listView = new ListView();
            this.Controls.Add(_listView);

            // Assign templates to the ListView
            PrepareTemplates();
        }


        /// <summary>
        /// Assigns default templates depending on the Mode.
        /// </summary>
        private void PrepareTemplates() {
            // Set appropriate default templates for each twitter mode
            switch (this.Mode) {
                case TwitterMode.Profile:
                    if (this.LayoutTemplate == null) {
                        this.LayoutTemplate = new DefaultProfileLayoutTemplate(this);
                    }
                    if (this.StatusTemplate == null) {
                        this.StatusTemplate = new DefaultProfileStatusTemplate(this);
                    }
                    break;
                case TwitterMode.Search:
                    if (this.LayoutTemplate == null) {
                        this.LayoutTemplate = new DefaultSearchLayoutTemplate(this);
                    }
                    if (this.StatusTemplate == null) {
                        this.StatusTemplate = new DefaultSearchStatusTemplate(this);
                    }
                    break;
            }

            // Assign default empty data template
            if (this.EmptyDataTemplate == null) {
                this.EmptyDataTemplate = new DefaultEmptyDataTemplate();
            }

            // Copy templates from Twitter control to ListView
            _listView.LayoutTemplate = this.LayoutTemplate;
            _listView.ItemTemplate = this.StatusTemplate;
            _listView.AlternatingItemTemplate = this.AlternatingStatusTemplate;
            _listView.EmptyDataTemplate = this.EmptyDataTemplate;
        }


        /// <summary>
        /// Get the Profile tweets from the Twitter API. Cache the results.
        /// </summary>
        /// <returns></returns>
        private IList<TwitterStatus> GetProfile() {
            var cacheKey = String.Format("__TwitterProfile_{0}_{1}_{2}_{3}", this.ScreenName, this.Count, this.IncludeRetweets, this.IncludeReplies);

            var results = (IList<TwitterStatus>)this.Context.Cache[cacheKey];
            if (results == null) {
                var api = new TwitterAPI();
                try {
                    results = api.GetProfile(this.ScreenName, this.Count, this.IncludeRetweets, this.IncludeReplies);
                } catch {
                    return null;
                }
                this.Context.Cache.Insert(
                    cacheKey,
                    results,
                    null,
                    DateTime.UtcNow.AddSeconds(this.CacheDuration),
                    System.Web.Caching.Cache.NoSlidingExpiration
                );
            }

            return results;
        }


        /// <summary>
        /// Get the search results from the Twitter API. Cache the results.
        /// </summary>
        /// <returns></returns>
        private IList<TwitterStatus> GetSearch() {
            var cacheKey = String.Format("__TwitterSearch_{0}_{1}", this.Search, this.Count);

            var results = (IList<TwitterStatus>)this.Context.Cache[cacheKey];
            if (results == null) {
                var api = new TwitterAPI();
                try {
                    results = api.GetSearch(this.Search, this.Count);
                } catch {
                    return null;
                }
                this.Context.Cache.Insert(
                    cacheKey,
                    results,
                    null,
                    DateTime.UtcNow.AddSeconds(this.CacheDuration),
                    System.Web.Caching.Cache.NoSlidingExpiration
                );
            }

            return results;
        }


        #region Helper Methods

        /// <summary>
        /// Returns the number of minutes or hours or days 
        /// between current date and supplied date.
        /// </summary>
        /// <param name="date">A date</param>
        /// <returns></returns>
        public static string Ago(DateTime date) {
            var timeSpan = DateTime.Now - date;
            if (timeSpan.TotalMinutes < 1) {
                return "Less than a minute ago";
            } else if (Math.Round(timeSpan.TotalHours) < 2) {
                return String.Format("{0} minutes ago", Math.Round(timeSpan.TotalMinutes));
            } else if (Math.Round(timeSpan.TotalDays) < 2) {
                return String.Format("{0} hours ago", Math.Round(timeSpan.TotalHours));
            } else {
                return String.Format("{0} days ago", Math.Round(timeSpan.TotalDays));
            }
        }


        public static string ActivateLinks(string text) {
            string pattern = @"(((http|https)+\:\/\/)[&#95;.a-z0-9-]+\.[a-z0-9\/&#95;:@=.+?,##%&~-]*[^.|\'|\# |!|\(|?|,| |>|<|;|\)])";
            var r = new Regex(pattern, RegexOptions.IgnoreCase);
            return r.Replace(text, "<a href=\"$1\">$1</a>");
        }


        #endregion


        #region Default Templates

        /// <summary>
        /// Default template used for Status Template in Profile Mode
        /// </summary>
        internal sealed class DefaultProfileStatusTemplate : ITemplate {

            private Twitter _twitter;

            internal DefaultProfileStatusTemplate(Twitter twitter) {
                _twitter = twitter;
            }


            void ITemplate.InstantiateIn(Control container) {


                // Note: In .NET 3.5, DataItem only has a value
                // during databinding. Therefore, we write up
                // a handler
                var ctlStatus = new LiteralControl();
                ctlStatus.DataBinding += ctlStatus_DataBind;
                container.Controls.Add(ctlStatus);

            }


            private void ctlStatus_DataBind(object sender, EventArgs e) {
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




        /// <summary>
        /// Default template used for LayoutTemplate in Profile Mode
        /// </summary>
        internal sealed class DefaultProfileLayoutTemplate : ITemplate {

            private Twitter _twitter;

            public DefaultProfileLayoutTemplate(Twitter twitter) {
                this._twitter = twitter;
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
                var smallLogoUrl = _twitter.Page.ClientScript.GetWebResourceUrl(_twitter.GetType(), "Twitter.Twitter24.png");
                ctlFooter.Attributes.Add("class", "ajax__twitter_footer");
                ctlFooter.Controls.Add(new Image() { ImageUrl = smallLogoUrl });
                container.Controls.Add(ctlFooter);
            }

        }



        /// <summary>
        /// Default template used for StatusTemplate in Search Mode
        /// </summary>
        internal sealed class DefaultSearchStatusTemplate : ITemplate {

            private Twitter _twitter;

            internal DefaultSearchStatusTemplate(Twitter twitter) {
                _twitter = twitter;
            }


            void ITemplate.InstantiateIn(Control container) {

                // Note: In .NET 3.5, DataItem only has a value
                // during databinding. Therefore, we wire up
                // a handler
                var ctlStatus = new LiteralControl();
                ctlStatus.DataBinding += ctlStatus_DataBind;
                container.Controls.Add(ctlStatus);
            }




            private void ctlStatus_DataBind(object sender, EventArgs e) {
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




        /// <summary>
        /// Default template used for Layout template in Search Mode
        /// </summary>
        internal sealed class DefaultSearchLayoutTemplate : ITemplate {

            private Twitter _twitter;

            public DefaultSearchLayoutTemplate(Twitter twitter) {
                this._twitter = twitter;
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
                var smallLogoUrl = _twitter.Page.ClientScript.GetWebResourceUrl(_twitter.GetType(), "Twitter.Twitter24.png");
                ctlFooter.Attributes.Add("class", "ajax__twitter_footer");
                ctlFooter.Controls.Add(new Image() { ImageUrl = smallLogoUrl });
                container.Controls.Add(ctlFooter);
            }
        }



        /// <summary>
        /// Default template used for no results
        /// </summary>
        internal sealed class DefaultEmptyDataTemplate : ITemplate {
            void ITemplate.InstantiateIn(Control container) {
                container.Controls.Add(new LiteralControl("There are no matching tweets."));
            }
        }


        #endregion



    }
}
