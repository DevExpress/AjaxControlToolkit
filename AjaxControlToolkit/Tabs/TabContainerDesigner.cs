#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.Text;
using System.Web.UI;
using System.Web.UI.Design;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    public class TabContainerDesigner : ControlDesigner {
        // Our HTML templates for design time.
        const string
            TabLink = "<a style='padding:2px;border-top:thin white inset;border-left:thin white inset; border-right:thin white inset;' href='#'>{0}</a>",
            ActiveTabLink = "{0}",
            ClickRegionHtml = @"<div style='float:left;padding:2px;color:{3}; background-color:{4};{5};height:20px;' {0}='{1}'>{2}</div>",
            DesignTimeHtml =
            @"<div style=""padding:2px;width:{7};height:{8}"">
                <div style='text-align:center;color:{0}; background-color:{1};border-left:thin white outset; border-right:thin white outset;height:20px;'>{2}</div>
                <div style='color:{3}; background-color:{4};border-left:thin white outset; border-right:thin white outset;height:24px;text-align:left;'>{5}</div>
                <div style='clear:both;text-align:left;border-left:thin white outset; border-bottom:thin white outset; border-right:thin white outset;background-color:{10};height:{11}; padding:8px; overflow:{12};' {9}='0'>{6}</div>
            </div>",
            EmptyDesignTimeHtml =
             @"<div style='display:inline-block;padding:2px;'>
                    <div style='color:{0}; background-color:{1};border-left:thin white outset; border-right:thin white outset;'>{2}</div>
                    <div style=""text-align:center;border-left:thin white outset; border-bottom:thin white outset; border-right:thin white outset;"" {3}='0'>
                        <a href='#'>Add New Tab</a>
                    </div>
                </div>",

            AddTabName = "#addtab";

        TabContainer TabContainer {
            get { return (TabContainer)Component; }
        }

        public override DesignerActionListCollection ActionLists {
            get {
                var actionLists = new DesignerActionListCollection();
                actionLists.AddRange(base.ActionLists);
                actionLists.Add(new TabContainerDesignerActionList(this));

                return actionLists;
            }
        }

        // Sets or gets the current tab ID.  If this is set,
        // it will locate the tab and notify the designer of the change.
        string CurrentTabID {
            set {
                if(!String.IsNullOrEmpty(value)) {
                    var panel = TabContainer.FindControl(value) as TabPanel;

                    if(panel == null)
                        throw new ArgumentException(String.Format(CultureInfo.InvariantCulture, "Can't find child tab '{0}'", value));

                    // find the index.  we set by index so that the
                    // ActiveTabIndex property will get changed, which makes Undo/Redo happy.
                    //
                    var index = -1;
                    var tc = TabContainer;
                    for(var i = 0; i < tc.Tabs.Count; i++) {
                        if(tc.Tabs[i] != panel)
                            continue;

                        index = i;
                        break;
                    }

                    Debug.Assert(index != -1, "Couldn't find panel in list!");

                    if(index != -1)
                        TypeDescriptor.GetProperties(tc)["ActiveTabIndex"].SetValue(tc, index);
                }
                UpdateDesignTimeHtml();
            }
        }

        protected override bool UsePreviewControl {
            get { return true; }
        }

        // This is the main worker function for the designer.
        // 
        // It figures out what the HTML shape of the design-time object should be.
        // 
        // There are three major pieces to this
        // 
        // 1. The outer main HTML
        // 2. The HTML that makes up the design time tabs
        // 3. The HTML that is the content for the current tab
        // 
        // Attached to several of these bits of markup are DesignerRegions.  Some regions are editable,
        // some are there just to catch clicks to change tabs or add new tabs.
        public override string GetDesignTimeHtml(DesignerRegionCollection regions) {
            if(regions == null)
                throw new ArgumentNullException("regions");

            if(TabContainer.ActiveTab != null) {
                // create the main editable region
                //
                var region = new EditableDesignerRegion(this, String.Format(CultureInfo.InvariantCulture, "c{0}", TabContainer.ActiveTab.ID));

                regions.Add(region);

                // build out the content HTML.  We'll need this later.
                //
                var contentHtml = GetTabContent(TabContainer.ActiveTab, true);

                var clickRegions = new StringBuilder();

                // now build out the design time tab UI.
                //
                // we do this by looping through the tabs and either building a link for clicking, and a plain DesignerRegion, or,
                // we build a plain span an attach an EditableDesigner region to it.

                var count = 2; // start with two since we've already got two regions. these numbers need to correspond to the order in the regions collection
                foreach(TabPanel tp in TabContainer.Tabs) {
                    var isActive = tp.Active;

                    string headerText = GetTabContent(tp, false);

                    // Build out the HTML for one of the tabs.  No, I don't usually write code like this, but this is just kind
                    // of icky no matter how you do it.  Nothing to see here.
                    //
                    clickRegions.AppendFormat(CultureInfo.InvariantCulture, ClickRegionHtml,
                        DesignerRegion.DesignerRegionAttributeName,
                        (isActive ? 1 : count), // if it's the editable one, it has to be index 1, see below
                        String.Format(CultureInfo.InvariantCulture, isActive ? ActiveTabLink : TabLink, headerText),
                        ColorTranslator.ToHtml(SystemColors.ControlText),
                        (isActive ? ColorTranslator.ToHtml(SystemColors.Window) : "transparent"),
                        (isActive ? "border-left:thin white outset;border-right:thin white outset;" : String.Empty)
                      );


                    // the region names are arbitrary.  for this purpose, we encode them by a letter - h or t for header or tab, respectively,
                    // and then pop on the tab ID.
                    //
                    if(isActive) {
                        // the editable header region is always to be 1, so we insert it there.
                        //
                        regions.Insert(1, new EditableDesignerRegion(this, String.Format(CultureInfo.InvariantCulture, "h{0}", tp.ID)));
                    } else {
                        // otherwise, just create a plain region.
                        //
                        DesignerRegion clickRegion = new DesignerRegion(this, String.Format(CultureInfo.InvariantCulture, "t{0}", tp.ID));
                        clickRegion.Selectable = true;
                        count++;
                        regions.Add(clickRegion);
                    }
                }


                // OK build out the final full HTML for this control.
                //
                var sb = new StringBuilder(1024);
                var actualHeight = (!TabContainer.Height.IsEmpty && TabContainer.Height.Type == UnitType.Pixel)
                    ? (TabContainer.Height.Value - 62).ToString() + "px"
                    : "100%";

                sb.Append(String.Format(CultureInfo.InvariantCulture,
                                        DesignTimeHtml,
                                        ColorTranslator.ToHtml(SystemColors.ControlText),
                                        ColorTranslator.ToHtml(SystemColors.ControlDark),
                                        TabContainer.ID,
                                        ColorTranslator.ToHtml(SystemColors.ControlText),
                                        ColorTranslator.ToHtml(SystemColors.Control),
                                        clickRegions.ToString(),
                                        contentHtml,
                                        TabContainer.Width,
                                        TabContainer.Height,
                                        DesignerRegion.DesignerRegionAttributeName,
                                        ColorTranslator.ToHtml(SystemColors.Window),
                                        actualHeight,
                                        HideOverflowContent ? "hidden" : "visible"
                                        ));
                return sb.ToString();
            } else {
                // build the empty tab html.

                var sb = new StringBuilder(512);

                sb.AppendFormat(CultureInfo.InvariantCulture, EmptyDesignTimeHtml,
                                        ColorTranslator.ToHtml(SystemColors.ControlText),
                                        ColorTranslator.ToHtml(SystemColors.ControlDark),
                                        TabContainer.ID,
                                        DesignerRegion.DesignerRegionAttributeName);

                // add a designer region for the "AddTab" UI.
                //
                var dr = new DesignerRegion(this, AddTabName);
                regions.Add(dr);
                return sb.ToString();
            }
        }

        // The Designer will call us back on this for each EditableDesignerRegion that we created.
        // In this we return the markup that we want displayed in the editable region.
        public override string GetEditableDesignerRegionContent(EditableDesignerRegion region) {
            if(region == null)
                throw new ArgumentNullException("region");

            Debug.Assert(region.Name[0] == 'c' || region.Name[0] == 'h', "Expected regionName to start with c or h, not " + region.Name);

            // is it a content template or a header?
            //
            var content = region.Name[0] == 'c';
            var regionName = region.Name.Substring(1);

            var activeTab = (TabPanel)TabContainer.FindControl(regionName);
            Debug.Assert(activeTab != null, "Couldn't find tab " + regionName);

            return GetTabContent(activeTab, content);
        }

        // Helper method to instantiate the given template into a control
        // an slurp out the markup.
        string GetTemplateContent(ITemplate template, string id) {
            var contentPanel = new DesignerPanel();
            contentPanel.ID = id;

            template.InstantiateIn(contentPanel);
            var host = (IDesignerHost)GetService(typeof(IDesignerHost));

            Debug.Assert(host != null, "Failed to get IDesignerHost?!?");

            var persistedControl = new StringBuilder(1024);
            foreach(Control c in contentPanel.Controls)
                persistedControl.Append(ControlPersister.PersistControl(c, host));

            return persistedControl.ToString();
        }

        string GetTabContent(TabPanel tab, bool isContent) {
            if(tab == null)
                return String.Empty;

            if(isContent) {
                if(tab.ContentTemplate == null)
                    return String.Empty;

                return GetTemplateContent(tab.ContentTemplate, "_content");
            }

            if(tab.HeaderTemplate != null)
                return GetTemplateContent(tab.HeaderTemplate, "_header");

            return tab.HeaderText;
        }

        public override void Initialize(IComponent component) {
            base.Initialize(component);
            SetViewFlags(ViewFlags.TemplateEditing, true);

            // make sure all the tabs have IDs and they're sited.
            foreach(TabPanel tp in TabContainer.Tabs) {
                if(String.IsNullOrEmpty(tp.ID))
                    throw new InvalidOperationException("TabPanels must have IDs set.");
            }
        }

        // After a editable region is edited, the designer calls back with the updated markup so we can
        // stuff it into the right tab.
        public override void SetEditableDesignerRegionContent(EditableDesignerRegion region, string content) {
            if(region == null)
                throw new ArgumentNullException("region");

            Debug.Assert(region.Name[0] == 'c' || region.Name[0] == 'h', "Expected regionName to start with c or h, not " + region.Name);

            var setTabContent = region.Name[0] == 'c';
            var regionName = region.Name.Substring(1);

            // figure out which tab we have.
            var activeTab = (TabPanel)TabContainer.FindControl(regionName);
            Debug.Assert(activeTab != null, "Couldn't find tab " + regionName);

            var host = (IDesignerHost)GetService(typeof(IDesignerHost));

            Debug.Assert(host != null, "Failed to get IDesignerHost?!?");

            // push the content into the right template
            PersistTemplateContent(activeTab, host, content, (setTabContent ? "ContentTemplate" : "HeaderTemplate"));
        }

        static void PersistTemplateContent(TabPanel panel, IDesignerHost host, string content, string propertyName) {
            var template = ControlParser.ParseTemplate(host, content);
            PersistTemplate(panel, host, template, propertyName);
        }

        // Helper method to save the value of a template.  This sets up all the right Undo state.
        static void PersistTemplate(TabPanel panel, IDesignerHost host, ITemplate template, string propertyName) {
            using(var transaction = host.CreateTransaction("SetEditableDesignerRegionContent")) {
                var propertyInfo = panel.GetType().GetProperty(propertyName);
                if(propertyInfo == null)
                    return;

                propertyInfo.SetValue(panel, template, null);
                transaction.Commit();
            }
        }


        // Called when we get aclick on a designer region.
        protected override void OnClick(DesignerRegionMouseEventArgs e) {
            // is it a tab?
            if(e.Region != null && e.Region.Name.StartsWith("t", StringComparison.Ordinal)) {
                CurrentTabID = e.Region.Name.Substring(1);
            } else if(e.Region != null && e.Region.Name == AddTabName) {
                // is it the "AddNewTab" region?
                OnAddTabPanel();
            }

            base.OnClick(e);
        }

        void OnAddTabPanel() {
            var host = (IDesignerHost)GetService(typeof(IDesignerHost));

            if(host == null)
                return;

            var tc = TabContainer;

            using(var dt = host.CreateTransaction("Add new TabPanel")) {

                var tp = (TabPanel)host.CreateComponent(typeof(TabPanel));

                if(tp != null) {
                    // set up the inital state
                    //
                    tp.ID = GetUniqueName(typeof(TabPanel), tc);
                    tp.HeaderText = tp.ID;
                    var changeService = (IComponentChangeService)GetService(typeof(IComponentChangeService));

                    try {
                        changeService.OnComponentChanging(tc, TypeDescriptor.GetProperties(tc)["Tabs"]);
                        tc.Tabs.Add(tp);
                    } finally {
                        changeService.OnComponentChanged(tc, TypeDescriptor.GetProperties(tc)["Tabs"], tc.Tabs, tc.Tabs);
                    }
                    TypeDescriptor.GetProperties(tc)["ActiveTab"].SetValue(tc, tp);
                    CurrentTabID = tp.ID;
                }
                dt.Commit();
            }
        }

        // Helper to get a unique name.  Since our Tabs aren't onthe designer surface,
        // INamingSurface won't do the right thing.  Fortunately, it's easy.
        static string GetUniqueName(Type t, System.Web.UI.Control parent) {
            var baseName = t.Name;
            var count = 1;

            while(parent.FindControl(baseName + count.ToString(CultureInfo.InvariantCulture)) != null) {
                count++;
            }
            return baseName + count.ToString(CultureInfo.InvariantCulture);
        }

        // Remove the active tab panel and set the active tab to be the previous one.
        void OnRemoveTabPanel() {
            var tc = TabContainer;

            if(tc.ActiveTab == null)
                return;

            var oldIndex = tc.ActiveTabIndex;

            var host = (IDesignerHost)GetService(typeof(IDesignerHost));

            if(host != null) {
                using(var dt = host.CreateTransaction("Remove TabPanel")) {
                    var activeTab = tc.ActiveTab;

                    var changeService = (IComponentChangeService)GetService(typeof(IComponentChangeService));

                    try {
                        changeService.OnComponentChanging(tc, TypeDescriptor.GetProperties(tc)["Tabs"]);
                        tc.Tabs.Remove(activeTab);
                    } finally {
                        changeService.OnComponentChanged(tc, TypeDescriptor.GetProperties(tc)["Tabs"], tc.Tabs, tc.Tabs);
                    }

                    activeTab.Dispose();

                    if(tc.Tabs.Count > 0) {
                        TypeDescriptor.GetProperties(tc)["ActiveTabIndex"].SetValue(tc, Math.Min(oldIndex, tc.Tabs.Count - 1));
                    }

                    UpdateDesignTimeHtml();
                    dt.Commit();
                }
            }
        }

        [CategoryAttribute("Design")]
        [DesignOnlyAttribute(true)]
        [DefaultValueAttribute(false)]
        [DescriptionAttribute("Hide overflow content at design-time.")]
        public bool HideOverflowContent {
            get {
                var state = DesignerState["HideOverflowContent"];
                return state != null && (bool)state;
            }
            set {
                var state = DesignerState["HideOverflowContent"];
                if(state == null || (bool)state != value) {
                    DesignerState["HideOverflowContent"] = value;
                    UpdateDesignTimeHtml();
                }
            }
        }

        class TabContainerDesignerActionList : DesignerActionList {
            TabContainerDesigner _designer;

            public TabContainerDesignerActionList(TabContainerDesigner designer)
                : base(designer.Component) {
                _designer = designer;
            }

            public override DesignerActionItemCollection GetSortedActionItems() {
                var items = new DesignerActionItemCollection();

                var addItem = new DesignerActionMethodItem(this, "OnAddTabPanel", "Add Tab Panel", true);
                var removeItem = new DesignerActionMethodItem(this, "OnRemoveTabPanel", "Remove Tab Panel", true);
                var hideContentOverflowItem = new DesignerActionPropertyItem("HideOverflowContent", "Hide overflow content at design-time");
                items.Add(addItem);
                items.Add(removeItem);
                items.Add(hideContentOverflowItem);

                return items;
            }

            public bool HideOverflowContent {
                get { return _designer.HideOverflowContent; }
                set { _designer.HideOverflowContent = value; }
            }

            void OnAddTabPanel() {
                _designer.OnAddTabPanel();
            }

            void OnRemoveTabPanel() {
                _designer.OnRemoveTabPanel();
            }
        }

        // a simple class to use for template instantiation
        internal class DesignerPanel : Panel, INamingContainer {
        }
    }

}
#pragma warning restore 1591