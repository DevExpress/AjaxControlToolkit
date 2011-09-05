using System.Web.UI;
using System.ComponentModel;
using System.Web.UI.WebControls;
using System.Collections.Generic;
using System;
using System.Web;
using System.Web.UI.HtmlControls;
using AjaxControlToolkit;
using System.Text;

[assembly: WebResource("Twitter.Twitter_resource.css", "text/css", PerformSubstitution = true)]


namespace AjaxControlToolkit {

    [ClientCssResource("Twitter.Twitter_resource.css")]
    [ParseChildren(ChildrenAsProperties = true), PersistChildren(false)]
    public class Twitter : CompositeControl {


        private ListView _listView;
        private TwitterUser  _user;

        /// <summary>
        /// Determines the overall behavior of the control
        /// </summary>
        public TwitterMode Mode { get; set; }

        /// <summary>
        /// Twitter Screen Name used when Mode=Profile
        /// </summary>
        public string ScreenName { get; set; }

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


        [Browsable(false)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [TemplateContainer(typeof(ListViewItem))]
        public ITemplate StatusTemplate { get; set; }



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



        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2109:ReviewVisibleEventHandlers", MessageId = "0#")]
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);
            ScriptObjectBuilder.RegisterCssReferences(this);
        }


        protected override void OnPreRender(System.EventArgs e) {
            base.OnPreRender(e);
            this.ControlPropertiesValid();

            IList<TwitterStatus> statuses = null;

            switch (this.Mode) {
                case TwitterMode.Profile:
                    statuses = this.GetProfile();
                    if (statuses.Count > 0) {
                        _user = statuses[0].User;
                    }
                    break;
                case TwitterMode.Search:
                    statuses = this.GetSearch();
                    break;
            }

            _listView.DataSource = statuses;
            _listView.DataBind();

        
        }






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



        protected override void CreateChildControls() {
            Controls.Clear();

            // The ListView is used to display the contents of the control
            _listView = new ListView();
            this.Controls.Add(_listView);

            // Assign templates to the ListView
            PrepareTemplates();
        }



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

            // Copy templates from Twitter control to ListView
            _listView.LayoutTemplate = this.LayoutTemplate;
            _listView.ItemTemplate = this.StatusTemplate;
        }



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




        internal sealed class DefaultProfileStatusTemplate : ITemplate {
 
            private Twitter _twitter;

            internal DefaultProfileStatusTemplate(Twitter twitter) {
                _twitter = twitter;
            }
            
            
            void ITemplate.InstantiateIn(Control container) {
                // Get data item
                var listItem = (ListViewItem)container;
                var status = ((TwitterStatus)listItem.DataItem);

                // Show status
                var statusToDisplay = String.Format(
                    "<li>{0}<br />{1}</li>",
                    status.Text,
                    status.CreatedAt
                );

                container.Controls.Add(new LiteralControl(statusToDisplay));
            }

        }





        internal sealed class DefaultProfileLayoutTemplate : ITemplate {

            private Twitter _twitter;

            public DefaultProfileLayoutTemplate(Twitter twitter) {
                this._twitter = twitter;
            }

            void ITemplate.InstantiateIn(Control container) {

                // Add header
                var ctlHeader = new HtmlGenericControl("div");
                ctlHeader.Attributes.Add("class", "ajax__twitter_profileheader");
                container.Controls.Add(ctlHeader);

                if (_twitter._user != null) {

                    // Create Profile Image Url
                    var profileImage = new Image() {
                        ImageUrl = _twitter._user.ProfileImageUrl
                    };
                    ctlHeader.Controls.Add(profileImage);


                    // Create Name
                    var ctlName = new HtmlGenericControl("div") {
                        InnerText = _twitter._user.Name,
                    };
                    ctlName.Attributes.Add("class", "ajax__twitter_profilename");
                    ctlHeader.Controls.Add(ctlName);
                }

                // Create ScreenName
                var ctlScreenName = new HtmlGenericControl("div");
                ctlScreenName.InnerText = _twitter.ScreenName;
                ctlScreenName.Attributes.Add("class", "ajax__twitter_profilescreenname");
                ctlHeader.Controls.Add(ctlScreenName);

                // Add unordered list
                var ctlList = new HtmlGenericControl("ul");
                ctlList.Attributes.Add("class", "ajax__twitter_itemlist");
                container.Controls.Add(ctlList);


                // Create item placeholder
                var plhItem = new PlaceHolder();
                plhItem.ID = "ItemPlaceholder";
                ctlList.Controls.Add(plhItem);
            }



        }




        internal sealed class DefaultSearchStatusTemplate : ITemplate {

            private Twitter _twitter;

            internal DefaultSearchStatusTemplate(Twitter twitter) {
                _twitter = twitter;
            }


            void ITemplate.InstantiateIn(Control container) {
                // Get data item
                var listItem = (ListViewItem)container;
                var status = ((TwitterStatus)listItem.DataItem);

                // Show status
                var statusToDisplay = String.Format(
                    "<li><img src=\"{0}\" />{1}<br />{2}</li>",
                    status.User.ProfileImageUrl,
                    status.Text,
                    status.CreatedAt
                );

                container.Controls.Add(new LiteralControl(statusToDisplay));
            }

        }





        internal sealed class DefaultSearchLayoutTemplate : ITemplate {

            private Twitter _twitter;

            public DefaultSearchLayoutTemplate(Twitter twitter) {
                this._twitter = twitter;
            }

            void ITemplate.InstantiateIn(Control container) {

                // Add header
                var ctlHeader = new HtmlGenericControl("div");
                ctlHeader.Attributes.Add("class", "ajax__twitter_profileheader");
                container.Controls.Add(ctlHeader);

                if (_twitter._user != null) {

                    // Create Profile Image Url
                    var profileImage = new Image() {
                        ImageUrl = _twitter._user.ProfileImageUrl
                    };
                    ctlHeader.Controls.Add(profileImage);


                    // Create Name
                    var ctlName = new HtmlGenericControl("div") {
                        InnerText = _twitter._user.Name,
                    };
                    ctlName.Attributes.Add("class", "ajax__twitter_profilename");
                    ctlHeader.Controls.Add(ctlName);
                }

                // Create ScreenName
                var ctlScreenName = new HtmlGenericControl("div");
                ctlScreenName.InnerText = _twitter.ScreenName;
                ctlScreenName.Attributes.Add("class", "ajax__twitter_profilescreenname");
                ctlHeader.Controls.Add(ctlScreenName);

                // Add unordered list
                var ctlList = new HtmlGenericControl("ul");
                ctlList.Attributes.Add("class", "ajax__twitter_itemlist");
                container.Controls.Add(ctlList);


                // Create item placeholder
                var plhItem = new PlaceHolder();
                plhItem.ID = "ItemPlaceholder";
                ctlList.Controls.Add(plhItem);
            }



        }






    }
}
