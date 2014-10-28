using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class NumericUpDown : System.Web.Services.WebService {

    [WebMethod]
    public int NextValue(int current, string tag) {
        return new Random().Next(Math.Min(1000, Math.Max(0, current)), 1001);
    }

    [WebMethod]
    public int PrevValue(int current, string tag) {
        return new Random().Next(0, Math.Min(1000, Math.Max(0, current)));
    }

}
