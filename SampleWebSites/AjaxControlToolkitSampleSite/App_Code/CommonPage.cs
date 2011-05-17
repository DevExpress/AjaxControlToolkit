// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Collections;
using System.Web.UI;

/// <summary>
/// This Page class is common to all sample pages and exists as a place to
/// implement common functionality
/// </summary>
public class CommonPage : Page
{
    public CommonPage()
    {
    }

    public string GetContentFillerText()
    {
        return
            "ASP.NET AJAX is a free framework for building a new generation of richer, more interactive, highly personalized cross-browser web applications.  " +
            "This new web development technology from Microsoft integrates cross-browser client script libraries with the ASP.NET 2.0 server-based development framework.  " +
            "In addition, ASP.NET AJAX offers you the same type of development platform for client-based web pages that ASP.NET offers for server-based pages.  " +
            "And because ASP.NET AJAX is an extension of ASP.NET, it is fully integrated with server-based services. ASP.NET AJAX makes it possible to easily take advantage of AJAX techniques on the web and enables you to create ASP.NET pages with a rich, responsive UI and server communication.  " +
            "However, AJAX isn't just for ASP.NET.  " +
            "You can take advantage of the rich client framework to easily build client-centric web applications that integrate with any backend data provider and run on most modern browsers.  ";
    }
    private static string[] wordListText;
    public string[] GetWordListText()
    {
        // This is the NATO phonetic alphabet (http://en.wikipedia.org/wiki/NATO_phonetic_alphabet)
        // and was chosen for its size, non-specificity, and presence of multiple words with the same
        // starting letter.
        if (null == wordListText)
        {
            string[] tempWordListText = new string[] {
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
            Array.Sort(tempWordListText);
            wordListText = tempWordListText;
        }
        return wordListText;
    }
}

public interface IContentPlaceHolders
{
    IList GetContentPlaceHolders();
}