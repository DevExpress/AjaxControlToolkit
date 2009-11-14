


using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class DataBinding : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            DataTable table = new DataTable();
            table.Columns.Add(new DataColumn("WatermarkText", typeof(string)));

            for (int i = 0; i < 2; i++)
            {
                DataRow row = table.NewRow();
                row["WatermarkText"] = "WatermarkText" + i;
                table.Rows.Add(row);
            }

            Repeater.DataSource = new DataView(table);

            DataBind();
        }
    }
}
