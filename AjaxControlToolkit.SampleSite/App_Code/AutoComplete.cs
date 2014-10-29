using System;
using System.Collections.Generic;
using System.Web.Script.Services;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class AutoComplete : WebService {
    public AutoComplete() {
    }

    [WebMethod]
    public string[] GetCompletionList(string prefixText, int count) {
        if(count == 0) {
            count = 10;
        }

        if(prefixText.Equals("xyz")) {
            return new string[0];
        }

        var random = new Random();
        var items = new List<string>(count);
        for(var i = 0; i < count; i++) {
            var c1 = (char)random.Next(65, 90);
            var c2 = (char)random.Next(97, 122);
            var c3 = (char)random.Next(97, 122);

            items.Add(prefixText + c1 + c2 + c3);
        }

        return items.ToArray();
    }

}