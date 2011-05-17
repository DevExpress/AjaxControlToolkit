// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;

public partial class ResizableControl_ResizableControl : CommonPage
{
    protected void Button2_Click(object sender, EventArgs e)
    {
        System.Drawing.Size s = ResizableControlExtender1.Size;
        ResizableControlExtender1.Size = new System.Drawing.Size(s.Width / 2, s.Height / 2);
    }
}