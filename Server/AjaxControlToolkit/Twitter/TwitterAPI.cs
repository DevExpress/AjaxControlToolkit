using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Xml;
using System.Xml.Linq;
using System.Globalization;
using System.Web;

namespace AjaxControlToolkit {


    /// <summary>
    /// Contains methods for interacting with the Twitter API over the network.
    /// </summary>
    public class TwitterAPI {

        /// <summary>
        /// Executes search query against the Twitter API
        /// </summary>
        /// <param name="search">The search query</param>
        /// <param name="count">The number of results to return</param>
        /// <returns></returns>
        public IList<TwitterStatus> GetSearch(string search, int count) {
            // Build query URL
            var sb = new StringBuilder();
            sb.AppendFormat(
                "http://search.twitter.com/search.atom?q={0}&rpp={1}", 
                HttpUtility.UrlEncode(search), 
                count
            );
            var queryUrl = sb.ToString();


            // Execute query
            var results = this.Query(queryUrl);

            // Parse results
            var defaultNS = "{http://www.w3.org/2005/Atom}";


            var statuses = new List<TwitterStatus>();
            var entries = from e in results.Descendants(defaultNS + "entry")
                          select e;


            foreach (var entry in entries) {

                var newUser = new TwitterUser {
                    Name = entry.Descendants(defaultNS + "name").FirstOrDefault().Value,
                    ProfileImageUrl = entry.Elements(defaultNS + "link")
                      .Where(link => (string)link.Attribute("rel") == "image")
                      .Select(link => (string)link.Attribute("href"))
                      .First()
                };

                var newStatus = new TwitterStatus {
                    CreatedAt = DateTime.Parse(entry.Element(defaultNS + "published").Value),
                    Text = entry.Element(defaultNS + "content").Value,
                    User = newUser
                };

                statuses.Add(newStatus);

            }


            return statuses.ToList();
        }
 


        /// <summary>
        /// Returns tweets for a particular Twitter screen name.
        /// </summary>
        /// <param name="screenName">The Twitter screen name</param>
        /// <param name="count">The number of results to return</param>
        /// <param name="includeRetweets">Include retweets of other people's tweets</param>
        /// <param name="includeReplies">Include replies</param>
        /// <returns></returns>
        public IList<TwitterStatus> GetProfile(string screenName, int count, bool includeRetweets, bool includeReplies) {
            // Build query URL
            var sb = new StringBuilder();
            sb.AppendFormat(
                "http://api.twitter.com/1/statuses/user_timeline.xml?screen_name={0}&count={1}", 
                HttpUtility.UrlEncode(screenName), 
                count
            );
            if (includeRetweets) {
                sb.AppendFormat("&include_rts=1");
            }
            if (!includeReplies) {
                sb.AppendFormat("&exclude_replies=1");
            }
            var queryUrl = sb.ToString();

            // Execute query
            var results = this.Query(queryUrl);

            // Parse results
            var statuses = from s in results.Descendants("status")
                           select new TwitterStatus {
                               CreatedAt = DateTime.ParseExact(s.Element("created_at").Value, "ddd MMM dd HH:mm:ss zzz yyyy", CultureInfo.InvariantCulture),
                               Text = s.Element("text").Value,
                               User = (from u in s.Descendants("user")
                                       select new TwitterUser {
                                           Id = u.Element("id").Value,
                                           ScreenName = u.Element("screen_name").Value,
                                           Name = u.Element("name").Value,
                                           Description = u.Element("description").Value,
                                           ProfileImageUrl = u.Element("profile_image_url").Value
                                       }).FirstOrDefault()
                           };

            return statuses.ToList();
        }


        private XDocument Query(string url) {
            return XDocument.Load(url);
        }


    }
}
