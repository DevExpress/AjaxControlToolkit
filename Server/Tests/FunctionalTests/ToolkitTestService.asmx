<%@ WebService Language="C#" Class="ToolkitTestService" %>

using System;
using System.Collections;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Services.Protocols;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class ToolkitTestService : System.Web.Services.WebService
{
    [WebMethod]
    public string GetContextKey(string contextKey)
    {
        return contextKey;
    }

    //**********

    private static string[] autoCompleteWordList = null;

    [WebMethod]
    public String[] GetWordList(string prefixText, int count)
    {
        if (autoCompleteWordList == null)
        {
            string[] temp = "this is sample data for the extender to use".Split(' '); // File.ReadAllLines(Server.MapPath("~/App_Data/words.txt"));
            Array.Sort(temp, new CaseInsensitiveComparer());
            autoCompleteWordList = temp;
        }

        int index = Array.BinarySearch(autoCompleteWordList, prefixText, new CaseInsensitiveComparer());
        if (index < 0)
        {
            index = ~index;
        }

        int matchingCount;
        for (matchingCount = 0; matchingCount < count && index + matchingCount < autoCompleteWordList.Length; matchingCount++)
        {
            if (!autoCompleteWordList[index + matchingCount].StartsWith(prefixText, StringComparison.CurrentCultureIgnoreCase))
            {
                break;
            }
        }

        String[] returnValue = new string[matchingCount];
        if (matchingCount > 0)
        {
            Array.Copy(autoCompleteWordList, index, returnValue, 0, matchingCount);
        }

        return returnValue;
    }

    [WebMethod]
    public string[] GetCompletionList(string prefixText, int count)
    {
        if (count == 0)
        {
            count = 10;
        }

        if (prefixText.Equals("xyz"))
        {
            return new string[0];
        }

        ArrayList items = new ArrayList(count);
        Random random = new Random();
        for (int i = 0; i < count; i++)
        {
            char c1 = (char)random.Next(65, 90);
            char c2 = (char)random.Next(97, 122);
            char c3 = (char)random.Next(97, 122);

            items.Add(prefixText + c1 + c2 + c3);
        }

        return (string[])items.ToArray(typeof(string));
    }
}
