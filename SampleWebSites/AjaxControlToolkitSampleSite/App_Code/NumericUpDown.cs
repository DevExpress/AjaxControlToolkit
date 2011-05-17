// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class NumericUpDown : WebService
{
    public NumericUpDown()
    {
        // Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public int NextValue(int current, string tag)
    {
        return new Random().Next(Math.Min(1000, Math.Max(0, current)), 1001);
    }

    [WebMethod]
    public int PrevValue(int current, string tag)
    {
        return new Random().Next(0, Math.Min(1000, Math.Max(0, current)));
    }
}