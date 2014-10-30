using System;
using System.Collections;
using System.Collections.Specialized;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Design;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Design;
using System.Drawing.Imaging;
using System.Globalization;
using System.Text;
using System.Web.UI;
using System.Web.UI.Design;
using System.Web.UI.Design.Util;
using System.Web.UI.Design.WebControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    // The designer class for the ReorderList. It's main job in life is to display the
    // various edit modes for the templates as well as the dropdown in the DesignerActionList.
    internal class ReorderListDesigner : DataBoundControlDesigner {
        const string _designtimeHTML =
        @"<table cellspacing=0 cellpadding=0 border=0 style=""display:inline-block"">
                <tr>
                    <td nowrap align=center valign=middle style=""color:{0}; background-color:{1}; "">{2}</td>
                </tr>
                <tr>
                    <td style=""vertical-align:top;"" {3}='0'>{4}</td>
                </tr>
          </table>";

        const string _designtimeHTML_Template =
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

        public ReorderListDesigner() {
        }

        TemplateGroupCollection _templateGroups;

        const int DefaultTemplateIndex = 0;

        private struct TemplateItem {
            public readonly string Name;
            public readonly bool SupportsDataBinding;

            public TemplateItem(string name, bool supportsDataBinding) {
                Name = name;
                SupportsDataBinding = supportsDataBinding;
            }
        }

        static TemplateItem[] TemplateItems = new TemplateItem[]{
                new TemplateItem("ItemTemplate", true),
                new TemplateItem("EditItemTemplate", true),
                new TemplateItem("DragHandleTemplate", true),
                new TemplateItem("ReorderTemplate", false),
                new TemplateItem("InsertItemTemplate", true),
                new TemplateItem("EmptyListTemplate", false)
        };

        public override DesignerActionListCollection ActionLists {
            get {
                var actionLists = new DesignerActionListCollection();
                actionLists.AddRange(base.ActionLists);
                actionLists.Add(new ReorderListDesignerActionList(this));

                return actionLists;
            }
        }

        object CurrentObject {
            get { return Component; }
        }

        ITemplate CurrentTemplate {
            get {
                if(CurrentTemplateDescriptor != null) {
                    return (ITemplate)CurrentTemplateDescriptor.GetValue(Component);
                }
                Debug.Fail("Couldn't get current template descriptor");
                return null;
            }
        }

        PropertyDescriptor CurrentTemplateDescriptor {
            get {
                var viewName = TemplateItems[CurrentView].Name;
                var templateProp = TypeDescriptor.GetProperties(Component)[viewName];
                Debug.Assert(templateProp != null, "couldn't find template prop '" + viewName + "'");

                return templateProp;
            }
        }

        // index of the view currently visible in the designer
        int CurrentView {
            get {
                var view = DesignerState["CurrentView"];
                var index = (view == null) ? DefaultTemplateIndex : (int)view;

                if(index >= TemplateItems.Length) {
                    index = DefaultTemplateIndex;
                }
                return index;
            }
            set { DesignerState["CurrentView"] = value; }
        }

        string CurrentViewName {
            get { return TemplateItems[CurrentView].Name; }
        }

        ITemplate CurrentViewControlTemplate {
            get { return CurrentTemplate; }
        }

        ReorderList ReorderList {
            get { return (ReorderList)Component; }
        }

        TemplateDefinition TemplateDefinition {
            get {
                var td = new TemplateDefinition(this, CurrentViewName, ReorderList, CurrentViewName);
                td.SupportsDataBinding = true;
                return td;
            }
        }

        public override TemplateGroupCollection TemplateGroups {
            get {
                var groups = base.TemplateGroups;

                if(_templateGroups == null) {
                    _templateGroups = new TemplateGroupCollection();

                    foreach(TemplateItem ti in TemplateItems) {
                        var tg = new TemplateGroup(ti.Name);
                        var td = new TemplateDefinition(this, ti.Name, ReorderList, ti.Name);
                        td.SupportsDataBinding = ti.SupportsDataBinding;
                        tg.AddTemplateDefinition(td);
                        _templateGroups.Add(tg);
                    }
                }

                groups.AddRange(_templateGroups);

                return groups;
            }
        }

        protected override bool UsePreviewControl {
            get { return true; }
        }

        EditableDesignerRegion BuildRegion() {
            var region = new ReorderListDesignerRegion(CurrentObject, CurrentTemplate, CurrentTemplateDescriptor, TemplateDefinition);
            region.Description = CurrentViewName;
            return region;
        }

        public override string GetDesignTimeHtml() {

            var designTimeHtml = String.Empty;
            if(CurrentViewControlTemplate != null) {
                var ReorderList = (ReorderList)ViewControl;

                var param = new HybridDictionary(1);
                param["TemplateIndex"] = CurrentView;
                ((IControlDesignerAccessor)ReorderList).SetDesignModeState(param);

                //ReorderList.DataBind();

                designTimeHtml = base.GetDesignTimeHtml();
            }

            return designTimeHtml;
        }

        public override string GetDesignTimeHtml(DesignerRegionCollection regions) {
            var content = String.Empty;
            regions.Add(BuildRegion());

            var sb = new StringBuilder(1024);
            if(CurrentTemplate == null) {
                sb.Append(String.Format(CultureInfo.InvariantCulture,
                                        _designtimeHTML,
                                        ColorTranslator.ToHtml(SystemColors.ControlText),
                                        ColorTranslator.ToHtml(SystemColors.Control),
                                        ReorderList.ID,
                                        DesignerRegion.DesignerRegionAttributeName,
                                        content));
            } else {

                var dl = new DataList();

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

        public override string GetEditableDesignerRegionContent(EditableDesignerRegion region) {
            var rldRegion = region as ReorderListDesignerRegion;
            if(rldRegion != null) {
                var template = rldRegion.Template;
                if(template != null) {
                    var host = (IDesignerHost)Component.Site.GetService(typeof(IDesignerHost));
                    return ControlPersister.PersistTemplate(template, host);
                }
            }
            return base.GetEditableDesignerRegionContent(region);
        }

        protected override string GetEmptyDesignTimeHtml() {
            var templateEmpty = "<br />Empty " + TemplateItems[CurrentView].Name + "<br />";
            return CreatePlaceHolderDesignTimeHtml(templateEmpty);
        }

        protected override string GetErrorDesignTimeHtml(Exception e) {
            return CreatePlaceHolderDesignTimeHtml("Error rendering ReorderList:<br />" + e.Message);
        }

        public override void SetEditableDesignerRegionContent(EditableDesignerRegion region, string content) {
            var lvRegion = region as ReorderListDesignerRegion;
            if(lvRegion == null)
                return;

            var host = (IDesignerHost)Component.Site.GetService(typeof(IDesignerHost));
            Debug.Assert(host != null, "IDesignerHost is null.");

            var template = ControlParser.ParseTemplate(host, content);
            using(var transaction = host.CreateTransaction("SetEditableDesignerRegionContent")) {
                lvRegion.PropertyDescriptor.SetValue(lvRegion.Object, template);
                transaction.Commit();
            }
            lvRegion.Template = template;
        }

        class ReorderListDesignerRegion : TemplatedEditableDesignerRegion {
            ITemplate _template;
            public ITemplate Template {
                get { return _template; }
                set { _template = value; }
            }

            object _object;
            public object Object { get { return _object; } }

            PropertyDescriptor _prop;
            public PropertyDescriptor PropertyDescriptor { get { return _prop; } }

            public ReorderListDesignerRegion(object obj, ITemplate template, PropertyDescriptor descriptor, TemplateDefinition definition)
                : base(definition) {
                _template = template;
                _object = obj;
                _prop = descriptor;
                EnsureSize = true;
            }
        }

        private class ReorderListDesignerActionList : DesignerActionList {
            ReorderListDesigner _designer;

            public ReorderListDesignerActionList(ReorderListDesigner designer)
                : base(designer.Component) {
                _designer = designer;
            }

            [TypeConverter(typeof(ReorderListViewTypeConverter))]
            public string View {
                get {
                    return _designer.CurrentViewName;
                }
                set {
                    var index = Array.FindIndex<TemplateItem>(TemplateItems, delegate(TemplateItem t) { return t.Name == value; });

                    Debug.Assert(index != -1, "Invalid template name: " + value);

                    if(index != -1)
                        _designer.CurrentView = index;

                    _designer.UpdateDesignTimeHtml();
                }
            }

            class ReorderListViewTypeConverter : TypeConverter {
                public override StandardValuesCollection GetStandardValues(ITypeDescriptorContext context) {
                    var templateNames = new string[TemplateItems.Length];

                    for(var i = 0; i < templateNames.Length; i++) {
                        templateNames[i] = TemplateItems[i].Name;
                    }

                    return new StandardValuesCollection(templateNames);
                }

                public override bool GetStandardValuesExclusive(ITypeDescriptorContext context) {
                    return true;
                }

                public override bool GetStandardValuesSupported(ITypeDescriptorContext context) {
                    return true;
                }

            }
        }
    }

}