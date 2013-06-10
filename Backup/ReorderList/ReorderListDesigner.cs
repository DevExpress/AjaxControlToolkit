


namespace AjaxControlToolkit
{
    using System.Collections.Specialized;
    using System.ComponentModel;
    using System.ComponentModel.Design;
    using System.Collections;
    using System.Design;
    using System.Diagnostics;
    using System.Globalization;
    using System.Text;
    using System.Web.UI.WebControls;
    using System.Drawing;
    using System.Drawing.Imaging;
    using System.Drawing.Design;
    using System.Web.UI.Design.Util;
    using System.Web.UI.Design;
    using System.Web.UI;
    using System;
    using System.Web.UI.Design.WebControls;

    /// <summary>
    /// The designer class for the ReorderList.  It's main job in life is to display the
    /// various edit modes for the templates as well as the dropdown in the DesignerActionList.
    /// </summary>
    internal class ReorderListDesigner : DataBoundControlDesigner
    {
        private const string _designtimeHTML =
        @"<table cellspacing=0 cellpadding=0 border=0 style=""display:inline-block"">
                <tr>
                    <td nowrap align=center valign=middle style=""color:{0}; background-color:{1}; "">{2}</td>
                </tr>
                <tr>
                    <td style=""vertical-align:top;"" {3}='0'>{4}</td>
                </tr>
          </table>";
          
         

        private const string _designtimeHTML_Template =
               @"
                <table cellspacing=0 cellpadding=0 border=0 style=""display:inline-block;border:outset white 1px;"">
                <tr>
                    <td nowrap align=center valign=middle style=""background-color:{6}; ""><span style=""font:messagebox;color:{5}""><b>{8}</b> - {7}</span></td>
                </tr>               
                <tr>                
                <td>
                  <table cellspacing=0 cellpadding=2 border=0 style=""margin:2px;border:solid 1px buttonface"">
                    <tr style=""font:messagebox;background-color:lightblue;color:black"">
                      <td style=""border:solid 1px buttonshadow"">
                        &nbsp;{0}&nbsp;&nbsp;&nbsp;
                      </td>
                    </tr>
                    <tr style=""{1}"" height=100%>
                      <td style=""{2}"">
                        <div style=""width:100%;height:100%"" {3}='0'>{4}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr></table>";

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public ReorderListDesigner()
        {
        }

        private TemplateGroupCollection _templateGroups;

        private const int DefaultTemplateIndex             = 0;

        private struct TemplateItem
        {
            public readonly string Name;
            public readonly bool SupportsDataBinding;

            public TemplateItem(string name, bool supportsDataBinding)
            {
                Name = name;
                SupportsDataBinding = supportsDataBinding;
            }
        }
        
        private static TemplateItem[] TemplateItems = new TemplateItem[]{
                new TemplateItem("ItemTemplate", true),
                new TemplateItem("EditItemTemplate", true),
                new TemplateItem("DragHandleTemplate", true),
                new TemplateItem("ReorderTemplate", false),
                new TemplateItem("InsertItemTemplate", true),
                new TemplateItem("EmptyListTemplate", false)
        };

        /// <include file='doc\ReorderListDesigner.uex' path='docs/doc[@for="ReorderListDesigner.ActionLists"]/*' />
        public override DesignerActionListCollection ActionLists
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
                DesignerActionListCollection actionLists = new DesignerActionListCollection();
                actionLists.AddRange(base.ActionLists);
                actionLists.Add(new ReorderListDesignerActionList(this));

                return actionLists;
            }
        }

        private object CurrentObject
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
                return Component;
            }
        }

        private ITemplate CurrentTemplate
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
                if (CurrentTemplateDescriptor != null) {
                    return (ITemplate)CurrentTemplateDescriptor.GetValue(Component);
                }
                Debug.Fail("Couldn't get current template descriptor");
                return null;
            }
        }

        private PropertyDescriptor CurrentTemplateDescriptor
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
                string viewName = TemplateItems[CurrentView].Name;

                PropertyDescriptor templateProp = TypeDescriptor.GetProperties(Component)[viewName];
                
                Debug.Assert(templateProp != null, "couldn't find template prop '" + viewName + "'");

                return templateProp;
            }
        }

        // index of the view currently visible in the designer
        private int CurrentView
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
                object view = DesignerState["CurrentView"];
                int index = (view == null) ? DefaultTemplateIndex : (int)view;

                if (index >= TemplateItems.Length)
                {
                    index = DefaultTemplateIndex;
                }
                return index;
            }
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            set
            {
                DesignerState["CurrentView"] = value;
            }
        }

        private string CurrentViewName
        {
            get
            {
                return TemplateItems[CurrentView].Name;
            }
        }

        private ITemplate CurrentViewControlTemplate
        {
            get
            {
                return CurrentTemplate;
            }
        }

        private ReorderList ReorderList{
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
                return (ReorderList)Component;
            }
        }

        private TemplateDefinition TemplateDefinition
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
               TemplateDefinition td = new TemplateDefinition(this, CurrentViewName, ReorderList, CurrentViewName);
               td.SupportsDataBinding = true;
               return td;
            }
        }

        public override TemplateGroupCollection TemplateGroups
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
                TemplateGroupCollection groups = base.TemplateGroups;

                if (_templateGroups == null)
                {
                    _templateGroups = new TemplateGroupCollection();

                    foreach(TemplateItem ti in TemplateItems) {
                        TemplateGroup tg = new TemplateGroup(ti.Name);
                        TemplateDefinition td = new TemplateDefinition(this, ti.Name, ReorderList, ti.Name);
                        td.SupportsDataBinding = ti.SupportsDataBinding;
                        tg.AddTemplateDefinition(td);
                        _templateGroups.Add(tg);
                    }
                }

                groups.AddRange(_templateGroups);

                return groups;
            }
        }

        protected override bool UsePreviewControl
        {
            get
            {
                return true;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private EditableDesignerRegion BuildRegion()
        {
            EditableDesignerRegion region = new ReorderListDesignerRegion(CurrentObject, CurrentTemplate, CurrentTemplateDescriptor, TemplateDefinition);
            region.Description = CurrentViewName;
            return region;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetDesignTimeHtml()
        {

            string designTimeHtml = String.Empty;
            if (CurrentViewControlTemplate != null)
            {
                ReorderList ReorderList = (ReorderList)ViewControl;

                IDictionary param = new HybridDictionary(1);
                param["TemplateIndex"] = CurrentView;
                ((IControlDesignerAccessor)ReorderList).SetDesignModeState(param);

                //ReorderList.DataBind();

                designTimeHtml = base.GetDesignTimeHtml();
            }

            return designTimeHtml;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetDesignTimeHtml(DesignerRegionCollection regions)
        {
            string content = String.Empty;
            regions.Add(BuildRegion());
            
            StringBuilder sb = new StringBuilder(1024);
            if (CurrentTemplate == null)
            {
                sb.Append(String.Format(CultureInfo.InvariantCulture,
                                        _designtimeHTML,
                                        ColorTranslator.ToHtml(SystemColors.ControlText),
                                        ColorTranslator.ToHtml(SystemColors.Control),
                                        ReorderList.ID,
                                        DesignerRegion.DesignerRegionAttributeName,
                                        content));
            }
            else
            {

                DataList dl = new DataList();

                sb.Append(String.Format(CultureInfo.InvariantCulture,
                                        _designtimeHTML_Template,
                                        CurrentViewName,
                                        dl.HeaderStyle,
                                        ReorderList.ControlStyle,
                                        DesignerRegion.DesignerRegionAttributeName,
                                        content,
                                        ColorTranslator.ToHtml(SystemColors.ControlText),
                                        ColorTranslator.ToHtml(SystemColors.Control),                                        
                                        ReorderList.ID,
                                        ReorderList.GetType().Name));

                dl.Dispose();
            }


            return sb.ToString();
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetEditableDesignerRegionContent(EditableDesignerRegion region)
        {
            ReorderListDesignerRegion rldRegion = region as ReorderListDesignerRegion;
            if (null != rldRegion)
            {
                ITemplate template = rldRegion.Template;
                if (template != null)
                {
                    IDesignerHost host = (IDesignerHost)Component.Site.GetService(typeof(IDesignerHost));
                    return ControlPersister.PersistTemplate(template, host);
                }
            }
            return base.GetEditableDesignerRegionContent(region);
        }

        /// <include file='doc\ReorderListDesigner.uex' path='docs/doc[@for="ReorderListDesigner.GetEmptyDesignTimeHtml"]/*' />
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        protected override string GetEmptyDesignTimeHtml()
        {
            string templateEmpty = "<br />Empty " + TemplateItems[CurrentView].Name + "<br />";
            return CreatePlaceHolderDesignTimeHtml(templateEmpty);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        protected override string GetErrorDesignTimeHtml(Exception e)
        {
            return CreatePlaceHolderDesignTimeHtml("Error rendering ReorderList:<br />" + e.Message);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override void SetEditableDesignerRegionContent(EditableDesignerRegion region, string content)
        {
            ReorderListDesignerRegion lvRegion = region as ReorderListDesignerRegion;
            if (lvRegion == null) return;

            IDesignerHost host = (IDesignerHost)Component.Site.GetService(typeof(IDesignerHost));
            Debug.Assert(host != null, "IDesignerHost is null.");

            ITemplate template = ControlParser.ParseTemplate(host, content);
            using (DesignerTransaction transaction = host.CreateTransaction("SetEditableDesignerRegionContent"))
            {
                lvRegion.PropertyDescriptor.SetValue(lvRegion.Object, template);
                transaction.Commit();
            }
            lvRegion.Template = template;
        }

        private class ReorderListDesignerRegion : TemplatedEditableDesignerRegion
        {
            ITemplate _template;
            public ITemplate Template
            {
                get { return _template; }
                set { _template = value; }
            }

            object _object;
            public object Object { get { return _object; } }

            PropertyDescriptor _prop;
            public PropertyDescriptor PropertyDescriptor { get { return _prop; } }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            public ReorderListDesignerRegion(object obj, ITemplate template, PropertyDescriptor descriptor, TemplateDefinition definition)
                : base(definition)
            {
                _template = template;
                _object = obj;
                _prop = descriptor;
                EnsureSize = true;
            }            
        }

        private class ReorderListDesignerActionList : DesignerActionList
        {
            private ReorderListDesigner _designer;

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            public ReorderListDesignerActionList(ReorderListDesigner designer)
                : base(designer.Component)
            {
                _designer = designer;
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            [TypeConverter(typeof(ReorderListViewTypeConverter))]
            public string View
            {
                [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
                get
                {
                    return _designer.CurrentViewName;
                }
                [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
                set
                {


                    int index = Array.FindIndex<TemplateItem>(TemplateItems, delegate(TemplateItem t) { return t.Name == value; });

                    Debug.Assert(index != -1, "Invalid template name: " + value);

                    if (index != -1)
                    {
                        _designer.CurrentView = index;
                    }
                    _designer.UpdateDesignTimeHtml();
                }
            }

            private class ReorderListViewTypeConverter : TypeConverter
            {
                public override StandardValuesCollection GetStandardValues(ITypeDescriptorContext context)
                {
                    string[] templateNames = new string[TemplateItems.Length];

                    for (int i = 0; i < templateNames.Length; i++)
                    {
                        templateNames[i] = TemplateItems[i].Name;
                    }

                    return new StandardValuesCollection(templateNames);
                }

                public override bool GetStandardValuesExclusive(ITypeDescriptorContext context)
                {
                    return true;
                }

                public override bool GetStandardValuesSupported(ITypeDescriptorContext context)
                {
                    return true;
                }

            }
        }
    }
}
