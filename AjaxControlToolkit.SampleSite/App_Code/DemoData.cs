using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public static class DemoData {
    public static string ContentFillerText =
        "ASP.NET AJAX is a free framework for building a new generation of richer, more interactive, highly personalized cross-browser web applications.  " +
        "This new web development technology from Microsoft integrates cross-browser client script libraries with the ASP.NET 2.0 server-based development framework.  " +
        "In addition, ASP.NET AJAX offers you the same type of development platform for client-based web pages that ASP.NET offers for server-based pages.  " +
        "And because ASP.NET AJAX is an extension of ASP.NET, it is fully integrated with server-based services. ASP.NET AJAX makes it possible to easily take advantage of AJAX techniques on the web and enables you to create ASP.NET pages with a rich, responsive UI and server communication.  " +
        "However, AJAX isn't just for ASP.NET.  " +
        "You can take advantage of the rich client framework to easily build client-centric web applications that integrate with any backend data provider and run on most modern browsers.  ";

    public static IEnumerable<string> ContentFillerWords {
        get {
            var result = new[] {
                "Alfa",
                "Alpha",
                "Bravo",
                "Charlie",
                "Delta",
                "Echo",
                "Foxtrot",
                "Golf",
                "Hotel",
                "India",
                "Juliett",
                "Juliet",
                "Kilo",
                "Lima",
                "Mike",
                "November",
                "Oscar",
                "Papa",
                "Quebec",
                "Romeo",
                "Sierra",
                "Tango",
                "Uniform",
                "Victor",
                "Whiskey",
                "X-ray",
                "Xray",
                "Yankee",
                "Zulu",
                "Zero",
                "Nadazero",
                "One",
                "Unaone",
                "Two",
                "Bissotwo",
                "Three",
                "Terrathree",
                "Four",
                "Kartefour",
                "Five",
                "Pantafive",
                "Six",
                "Soxisix",
                "Seven",
                "Setteseven",
                "Eight",
                "Oktoeight",
                "Nine",
                "Novenine"
            };
            Array.Sort(result);

            return result;
        }
    }
}