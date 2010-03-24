// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Threading;

public partial class Patch5484 : CommonPage
{
    /// <summary>
    /// Change the label everytime we update
    /// </summary>
    protected void btnUpdate1_Click(object sender, EventArgs e) {
        Thread.Sleep(1000);
        lblUpdate1.Text = DateTime.Now.ToString();
    }
    protected void btnUpdate2_Click(object sender, EventArgs e) {
        Thread.Sleep(1000);
        lblUpdate2.Text = DateTime.Now.ToString();
    }
}