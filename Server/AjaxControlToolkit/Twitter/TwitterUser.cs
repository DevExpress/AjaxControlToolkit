using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    /// <summary>
    /// Represents a Twitter user
    /// </summary>
    public class TwitterUser {

        /// <summary>
        /// The unique ID of the Twitter user
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///  The full name of the Twitter user
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The registered screen name of the Twitter user
        /// </summary>
        public string ScreenName { get; set; }

        /// <summary>
        /// The description of the Twitter user
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// The geographical location of the Twitter user
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// The URL of an image of the Twitter user
        /// </summary>
        public string ProfileImageUrl { get; set; }


    }
}

