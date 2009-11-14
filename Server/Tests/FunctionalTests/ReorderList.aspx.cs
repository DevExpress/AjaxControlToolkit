


using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class ReorderList : System.Web.UI.Page
{

    protected object SimpleDataSource
    {
        get
        {
            if (ViewState["Simple"] == null)
            {
                ViewState["Simple"] = new string[] { "A", "B", "C", "D", "E", "F" };
            }
            return ViewState["Simple"];
        }
    }

    protected object IListDataSource
    {
        get
        {
            if (ViewState["IList"] == null) {
              
                List<Person> people = new List<Person>();

                people.Add(new Person("Shawn", 3036));
                people.Add(new Person("David", 3017));
                people.Add(new Person("Ted", 3027));
                ViewState["IList"] = people;
            } 
            return ViewState["IList"];
        }
    }

    private DataTable _table;

    private DataTable Table
    {

        get
        {

            if (_table != null) return _table;

            DataTable dt = (DataTable)ViewState["DT"];

            if (dt == null)
            {
                dt = new DataTable();

                DataColumn idColumn = new DataColumn("ID", typeof(int));

                dt.Columns.Add(idColumn);
                dt.Columns.Add("Name", typeof(string));
                dt.Columns.Add("Sort", typeof(int));
                dt.Constraints.Add("pk", idColumn, true);

                dt.Rows.Add(1, "Shawn", 0);
                dt.Rows.Add(2, "David", 1);
                dt.Rows.Add(3, "Ted", 2);
                dt.Rows.Add(4, "Kirti", 3);
                dt.Rows.Add(5, "Red", 4);
                dt.Rows.Add(6, "Blue", 5);
                dt.Rows.Add(7, "Green", 6);
                ViewState["DT"] = dt;
            }
            _table = dt;
            return dt;
        }
    }

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);
        ReorderList3.ItemReorder += new EventHandler<AjaxControlToolkit.ReorderListItemReorderEventArgs>(ReorderList3_ItemReorder);
        ReorderList4.ItemReorder += new EventHandler<AjaxControlToolkit.ReorderListItemReorderEventArgs>(ReorderList4_ItemReorder);
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        ReorderList2.DataSource = SimpleDataSource;
        ReorderList2.DataBind();

        ReorderList3.DataSource = IListDataSource;
        ReorderList3.DataBind();
        
        DataView dv = Table.DefaultView;
        dv.Sort = "Sort ASC";
        ReorderList4.DataSource = dv;

        ReorderList4.DataBind();
        
    }

    void ReorderList3_ItemReorder(object sender, AjaxControlToolkit.ReorderListItemReorderEventArgs e) {
        TrackViewState();
  
        ReorderList3.DataSource = IListDataSource;
        ReorderList3.DataBind();
    }

    void ReorderList4_ItemReorder(object sender, AjaxControlToolkit.ReorderListItemReorderEventArgs e)
    {
        DataTable table = ((DataView)((AjaxControlToolkit.ReorderList)sender).DataSource).Table;
        ViewState["DT"] = table;
        ReorderList4.DataBind();
    }

    [Serializable]
    public class Person
    {
        private string _name;

        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
        private int _office;

        public int Office
        {
            get { return _office; }
            set { _office = value; }
        }

        public Person()
        {
        }

        public Person(string n, int a)
        {
            _name = n;
            _office = a;
        }

        public override string ToString()
        {
            return String.Format("{0}, {1}", Name, Office);
        }

    }

    
}
