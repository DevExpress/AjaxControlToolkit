// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.IO;
using System.Web;

/// <summary>
/// An XML data object that lets us read/write from an XML source
/// </summary>
[DataObject(true)]
public abstract class TodoXmlDataObject
{
    // the web site physical root
    private string _rootPath;
    private DataSet _ds;

    public TodoXmlDataObject()
    {
    }

    public TodoXmlDataObject(string rootPath)
    {
        _rootPath = rootPath;
    }

    private DataSet DataSet
    {
        get
        {
            if (_ds == null)
            {
                _ds = new DataSet();
                _ds.ReadXmlSchema(XsdFile);
                LoadData();
            }
            return _ds;
        }
    }

    private DataTable Table
    {
        get { return DataSet.Tables["TodoItems"]; }
    }

    /// <summary>
    /// Figures out the physical root of the website.
    /// </summary>
    protected string RootPath
    {
        get
        {
            if (_rootPath != null)
            {
                return _rootPath;
            }
            else if (HttpContext.Current != null)
            {
                return HttpContext.Current.Server.MapPath(HttpContext.Current.Request.ApplicationPath);
            }
            else
            {
                throw new ApplicationException("Can't find server root path.");
            }
        }
    }

    protected abstract bool CanReadStream
    {
        get;
    }

    protected virtual bool CanWriteStream
    {
        get { return true; }
    }

    protected abstract Stream XmlStream
    {
        get;
    }


    private string XsdFile
    {
        get { return Path.Combine(RootPath, @"App_Code\TodoItems.xsd"); }
    }

    [DataObjectMethod(DataObjectMethodType.Select)]
    public DataView Select()
    {
        Table.DefaultView.Sort = "Priority";
        return Table.DefaultView;
    }

    [DataObjectMethod(DataObjectMethodType.Insert)]
    public int Insert(string Title, string Description, int Priority)
    {
        DataRow dr = Table.NewRow();

        dr["Title"] = Title;
        dr["Description"] = Description;
        dr["Priority"] = Priority;
        Table.Rows.Add(dr);
        SaveChanges();
        return 1;
    }

    [DataObjectMethod(DataObjectMethodType.Update)]
    public virtual int Update(string Title, string Description, int Priority, int Original_ItemID)
    {
        DataRow[] rows = Table.Select(String.Format("ItemID={0}", Original_ItemID));

        if (rows.Length > 0)
        {
            DataRow dr = rows[0];
            dr.BeginEdit();
            dr["Title"] = Title;
            if (Description == String.Empty)
            {
                dr["Description"] = null;
            }
            else
            {
                dr["Description"] = Description;
            }
            dr["Priority"] = Priority;
            dr.EndEdit();
            SaveChanges();
            return 1;
        }
        return 0;
    }

    protected virtual void LoadData()
    {
        if (CanReadStream)
        {
            _ds.ReadXml(XmlStream, XmlReadMode.IgnoreSchema);
        }
    }

    protected virtual void SaveChanges()
    {
        DataSet.AcceptChanges();
        if (CanWriteStream)
        {
            XmlStream.Flush();
            DataSet.WriteXml(XmlStream, XmlWriteMode.IgnoreSchema);
        }
        else
        {
            throw new ApplicationException("Can't write to XML stream.");
        }
    }

    [DataObjectMethod(DataObjectMethodType.Delete)]
    public virtual int Delete(int Original_ItemID)
    {
        DataRow[] rows = Table.Select(String.Format("ItemID={0}", Original_ItemID));

        if (rows.Length > 0)
        {
            Table.Rows.Remove(rows[0]);
            SaveChanges();
            return 1;
        }
        return 0;
    }
}

/// <summary>
/// A version of the data source that reads and writes from the local XML file.
/// </summary>
public class FileTodoXmlDataObject : TodoXmlDataObject
{
    private Stream _stream;

    protected override bool CanReadStream
    {
        get { return File.Exists(XmlFile); }
    }

    protected override Stream XmlStream
    {
        get
        {
            if (_stream == null)
            {
                _stream = new FileStream(XmlFile, FileMode.OpenOrCreate, FileAccess.Read, FileShare.Read);
            }
            return _stream;
        }
    }

    private string XmlFile
    {
        get { return Path.Combine(RootPath, @"App_Data\TodoItems.xml"); }
    }

    protected override void LoadData()
    {
        XmlStream.Seek(0, SeekOrigin.Begin);
        base.LoadData();
    }

    protected override void SaveChanges()
    {
        XmlStream.Position = 0;
        XmlStream.SetLength(0);
        base.SaveChanges();
        XmlStream.Flush();
    }
}

/// <summary>
/// A version of the XML source that reads from the local file originally but then 
/// writes all deltas to the session state.
/// </summary>
public class SessionTodoXmlDataObject : FileTodoXmlDataObject
{
    protected override Stream XmlStream
    {
        get
        {
            if (HttpContext.Current != null)
            {
                Stream sessionStream = HttpContext.Current.Session["TodoList"] as Stream;

                if (sessionStream == null)
                {
                    if (CanReadStream && base.XmlStream != null)
                    {
                        Stream baseStream = base.XmlStream;

                        sessionStream = new MemoryStream((int) baseStream.Length);
                        byte[] data = new byte[baseStream.Length];
                        baseStream.Read(data, 0, (int) baseStream.Length);
                        sessionStream.Write(data, 0, data.Length);
                        sessionStream.Seek(0, SeekOrigin.Begin);
                    }
                    else
                    {
                        sessionStream = new MemoryStream(256);
                    }
                    HttpContext.Current.Session["TodoList"] = sessionStream;
                }
                return sessionStream;
            }

            throw new ApplicationException("Can't get to session object to load state");
        }
    }
}