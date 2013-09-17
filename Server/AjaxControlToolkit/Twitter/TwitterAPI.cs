using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Web.Script.Serialization;
using System.Globalization;

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
        public List<TwitterStatus> GetSearch(string search, int count) {
            var result = Query("https://api.twitter.com/1.1/search/tweets.json",
                new[] {
                    new KeyValuePair<String, String>("q", search),
                    new KeyValuePair<String, String>("count", count.ToString())
                });
            var serializer = new JavaScriptSerializer();
            var searchResult = serializer.Deserialize<Status>(result);
            if (searchResult == null || searchResult.statuses == null)
                return null;

            return searchResult.statuses.Select(s => new TwitterStatus {
                CreatedAt = ParseDateTime(s.created_at),
                Text = s.text,
                User = new TwitterUser {
                    Id = s.user.id,
                    Description = s.user.description,
                    Location = s.user.location,
                    Name = s.user.name,
                    ProfileImageUrl = s.user.profile_image_url,
                    ScreenName = s.user.screen_name
                }
            }).ToList();
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
            var result = Query("https://api.twitter.com/1.1/statuses/user_timeline.json",
                new[] {
                    new KeyValuePair<String, String>("screen_name", screenName),
                    new KeyValuePair<String, String>("count", count.ToString()),
                    new KeyValuePair<String, String>("include_rts", includeRetweets.ToString()),
                    new KeyValuePair<String, String>("exclude_replies", (!includeReplies).ToString()),
                });

            var serializer = new JavaScriptSerializer();
            var searchResult = serializer.Deserialize<List<Response>>(result);

            return searchResult.Select(s => new TwitterStatus {
                CreatedAt = ParseDateTime(s.created_at),
                Text = s.text,
                User = new TwitterUser {
                    Id = s.user.id,
                    Description = s.user.description,
                    Location = s.user.location,
                    Name = s.user.name,
                    ProfileImageUrl = s.user.profile_image_url,
                    ScreenName = s.user.screen_name
                }
            }).ToList();
        }

        /// <summary>
        /// Send request to Twitter -- modified from https://dev.twitter.com/discussions/15206
        /// </summary>
        /// <param name="resourceUrl"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        private string Query(string resourceUrl, IEnumerable<KeyValuePair<string, string>> parameters) {

            // oauth application keys
            var oAuthToken = ConfigurationManager.AppSettings["act:TwitterAccessToken"];
            var oAuthTokenSecret = ConfigurationManager.AppSettings["act:TwitterAccessTokenSecret"];
            var oAuthConsumerKey = ConfigurationManager.AppSettings["act:TwitterConsumerKey"];
            var oAuthConsumerSecret = ConfigurationManager.AppSettings["act:TwitterConsumerSecret"];

            // oauth implementation details
            const string oAuthVersion = "1.0";
            const string oAuthSignatureMethod = "HMAC-SHA1";
            const string method = "GET";

            // unique request details
            var oAuthNonce = Convert.ToBase64String(
                new System.Text.ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString(CultureInfo.InvariantCulture)));
            var timeSpan = DateTime.UtcNow
                           - new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            var oAuthTimestamp = Convert.ToInt64(timeSpan.TotalSeconds).ToString(CultureInfo.InvariantCulture);

            //setup the parameters that we will be putting in the authorization
            var authorizationParameters = new List<KeyValuePair<string, string>> {
                new KeyValuePair<string, string>("oauth_consumer_key", oAuthConsumerKey),
                new KeyValuePair<string, string>("oauth_nonce", oAuthNonce),
                new KeyValuePair<string, string>("oauth_signature_method", oAuthSignatureMethod),
                new KeyValuePair<string, string>("oauth_timestamp", oAuthTimestamp),
                new KeyValuePair<string, string>("oauth_token", oAuthToken),
                new KeyValuePair<string, string>("oauth_version", oAuthVersion)
            };

            //combine and sort all parameters as per https://dev.twitter.com/docs/auth/creating-signature
            var allParameters = authorizationParameters.Union(parameters.ToArray()).OrderBy(tmp => tmp.Key);

            //put all paramneters into a & delimited string and make sure our values are % escaped        
            var baseString = string.Join("&",
                allParameters.Select(p => string.Format("{0}={1}", p.Key, Uri.EscapeDataString(p.Value))).ToArray());

            //finish the base string
            baseString = string.Format("{0}&{1}&{2}", method, Uri.EscapeDataString(resourceUrl),
                Uri.EscapeDataString(baseString));

            var compositeKey = string.Format("{0}&{1}", Uri.EscapeDataString(oAuthConsumerSecret),
                Uri.EscapeDataString(oAuthTokenSecret));

            //use our composite key to get the auth signature
            string oAuthSignature;
            using (
                var hash = new HMACSHA1(System.Text.Encoding.ASCII.GetBytes(compositeKey))) {
                oAuthSignature =
                    Convert.ToBase64String(hash.ComputeHash(System.Text.Encoding.ASCII.GetBytes(baseString)));
            }

            // create the request header
            const string headerFormat = "OAuth oauth_nonce=\"{0}\", oauth_signature_method=\"{1}\", " +
                                        "oauth_timestamp=\"{2}\", oauth_consumer_key=\"{3}\", " +
                                        "oauth_token=\"{4}\", oauth_signature=\"{5}\", " +
                                        "oauth_version=\"{6}\"";

            //get the actual string version of the auth header and its values
            var authHeader = string.Format(headerFormat,
                Uri.EscapeDataString(oAuthNonce),
                Uri.EscapeDataString(oAuthSignatureMethod),
                Uri.EscapeDataString(oAuthTimestamp),
                Uri.EscapeDataString(oAuthConsumerKey),
                Uri.EscapeDataString(oAuthToken),
                Uri.EscapeDataString(oAuthSignature),
                Uri.EscapeDataString(oAuthVersion));

            System.Net.ServicePointManager.Expect100Continue = false;

            //add our query string parameters to our url
            var parameterString = string.Join("&",
                parameters.Select(p => string.Format("{0}={1}", p.Key, Uri.EscapeDataString(p.Value))).ToArray());
            resourceUrl += "?" + parameterString;

            //create our request
            var request = (System.Net.HttpWebRequest) System.Net.WebRequest.Create(resourceUrl);

            //set our info
            request.Headers.Add("Authorization", authHeader);
            request.Method = method;
            request.ContentType = "application/x-www-form-urlencoded";

            //get the response and return the result from the stream
            using (var response = (System.Net.HttpWebResponse) request.GetResponse()) {
                using (var reader = new System.IO.StreamReader(response.GetResponseStream())) {
                    return reader.ReadToEnd();
                }
            }
        }

        private DateTime ParseDateTime(string date) {
            const string format = "ddd MMM dd HH:mm:ss zzzz yyyy";
            return DateTime.ParseExact(date, format, CultureInfo.InvariantCulture);
        }

        private class Status {
            public List<Response> statuses;
        }

        private class Response {
            public string created_at { get; set; }
            public string text { get; set; }
            public User user { get; set; }
        }

        private class User {
            public string id { get; set; }
            public string screen_name { get; set; }
            public string name { get; set; }
            public string description { get; set; }
            public string profile_image_url { get; set; }
            public string location { get; set; }
        }
    }
}