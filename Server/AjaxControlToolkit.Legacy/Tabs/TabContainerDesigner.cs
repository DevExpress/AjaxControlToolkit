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

namespace AjaxControlToolkit
{
    /// <summary>
    /// Control Designer for the TabContainer
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class TabContainerDesigner : System.Web.UI.Design.ControlDesigner
    {
        /// <summary>
        /// Our HTML templates for design time.
        /// </summary>
        private const string TabLink = "<a style='padding:2px;border-top:thin white inset;border-left:thin white inset; border-right:thin white inset;' href='#'>{0}</a>";
        private const string ActiveTabLink = "{0}";

        private const string ClickRegionHtml = @"<div style='float:left;padding:2px;color:{3}; background-color:{4};{5};height:20px;' {0}='{1}'>{2}</div>";
        

        private const string DesignTimeHtml =
            @"<div style=""padding:2px;width:{7};height:{8}"">
                <div style='text-align:center;color:{0}; background-color:{1};border-left:thin white outset; border-right:thin white outset;height:20px;'>{2}</div>
                <div style='color:{3}; background-color:{4};border-left:thin white outset; border-right:thin white outset;height:24px;text-align:left;'>{5}</div>
                <div style='clear:both;text-align:left;border-left:thin white outset; border-bottom:thin white outset; border-right:thin white outset;background-color:{10};height:{11}; padding:8px; overflow:{12};' {9}='0'>{6}</div>
            </div>";

        private const string EmptyDesignTimeHtml =
             @"<div style='display:inline-block;padding:2px;'>
                    <div style='color:{0}; background-color:{1};border-left:thin white outset; border-right:thin white outset;'>{2}</div>
                    <div style=""text-align:center;border-left:thin white outset; border-bottom:thin white outset; border-right:thin white outset;"" {3}='0'>
        <a href='#'>Add New Tab</a></div>
                </div>";

        private const string AddTabName = "#addtab";

        /// <summary>
        /// Initializes a new instance of the TabContainerDesigner class
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public TabContainerDesigner()
        {
        }

        /// <summary>
        /// Helper property to get the TabContainer we're designing.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private TabContainer TabContainer
        {
            get
            {
                return (TabContainer)Component;
            }
        }      
       

        /// <summary>
        /// Create and return our action list - this is what creates the flyout panel with the verb commands
        /// </summary>
        public override DesignerActionListCollection ActionLists
        {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            get
            {
                DesignerActionListCollection actionLists = new DesignerActionListCollection();
                actionLists.AddRange(base.ActionLists);
                actionLists.Add(new TabContainerDesignerActionList(this));

                return actionLists;
            }
        }

        /// <summary>
        /// Sets or gets the current tab ID.  If this is set,
        /// it will locate the tab and notify the designer of the change.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private string CurrentTabID
        {
            set
            {
                if (!String.IsNullOrEmpty(value))
                {
                    TabPanel panel = TabContainer.FindControl(value) as TabPanel;

                    if (panel == null)
                    {
                        throw new ArgumentException(String.Format(CultureInfo.InvariantCulture, "Can't find child tab '{0}'", value));
                    }

                    int index = -1;

                    // find the index.  we set by index so that the
                    // ActiveTabIndex property will get changed, which makes Undo/Redo happy.
                    //
                    TabContainer tc = TabContainer;
                    for (int i = 0; i < tc.Tabs.Count; i++)
                    {
                        if (tc.Tabs[i] == panel)
                        {
                            index = i;
                            break;
                        }
                    }

                    Debug.Assert(index != -1, "Couldn't find panel in list!");

                    if (index != -1)
                    {
                        TypeDescriptor.GetProperties(tc)["ActiveTabIndex"].SetValue(tc, index);
                    }
                }
                UpdateDesignTimeHtml();
            }

        }

        /// <summary>
        /// Tell the designer we're creating our own UI.
        /// </summary>
        protected override bool UsePreviewControl
        {
            get
            {
                return true;
            }
        }


        /// <summary>
        /// This is the main worker function for the designer.
        /// 
        /// It figures out what the HTML shape of the design-time object should be.
        /// 
        /// There are three major pieces to this
        /// 
        /// 1. The outer main HTML
        /// 2. The HTML that makes up the design time tabs
        /// 3. The HTML that is the content for the current tab
        /// 
        /// Attached to several of these bits of markup are DesignerRegions.  Some regions are editable,
        /// some are there just to catch clicks to change tabs or add new tabs.
        /// </summary>
        /// <param name="regions"></param>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetDesignTimeHtml(DesignerRegionCollection regions)
        {
            if (regions == null)
            {
                throw new ArgumentNullException("regions");
            }

            if (TabContainer.ActiveTab != null)
            {
                // create the main editable region
                //
                EditableDesignerRegion region = new EditableDesignerRegion(this, String.Format(CultureInfo.InvariantCulture, "c{0}", TabContainer.ActiveTab.ID));
                
                regions.Add(region);

                // build out the content HTML.  We'll need this later.
                //
                string contentHtml = GetTabContent(TabContainer.ActiveTab, true);               

                StringBuilder clickRegions = new StringBuilder();

                // now build out the design time tab UI.
                //
                // we do this by looping through the tabs and either building a link for clicking, and a plain DesignerRegion, or,
                // we build a plain span an attach an EditableDesigner region to it.

                int count = 2; // start with two since we've already got two regions. these numbers need to correspond to the order in the regions collection
                foreach (TabPanel tp in TabContainer.Tabs)
                {
                    bool isActive = tp.Active;

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
                        (isActive ? "border-left:thin white outset;border-right:thin white outset;" : "")
                      );


                    // the region names are arbitrary.  for this purpose, we encode them by a letter - h or t for header or tab, respectively,
                    // and then pop on the tab ID.
                    //
                    if (isActive) {
                        // the editable header region is always to be 1, so we insert it there.
                        //
                        regions.Insert(1, new EditableDesignerRegion(this, String.Format(CultureInfo.InvariantCulture, "h{0}", tp.ID)));
                    }
                    else {
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
                StringBuilder sb = new StringBuilder(1024);
                var actualHeight =
                    (!TabContainer.Height.IsEmpty && TabContainer.Height.Type == UnitType.Pixel)
                    ? (TabContainer.Height.Value - 62).ToString() + "px" :
                    "100%";

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
            }
            else
            {
                // build the empty tab html.

                StringBuilder sb = new StringBuilder(512);

                sb.AppendFormat(CultureInfo.InvariantCulture, EmptyDesignTimeHtml,
                                        ColorTranslator.ToHtml(SystemColors.ControlText),
                                        ColorTranslator.ToHtml(SystemColors.ControlDark),
                                        TabContainer.ID,
                                        DesignerRegion.DesignerRegionAttributeName);

                // add a designer region for the "AddTab" UI.
                //
                DesignerRegion dr = new DesignerRegion(this, AddTabName);
                regions.Add(dr);
                return sb.ToString();                                        
            }
        }

        /// <summary>
        /// The Designer will call us back on this for each EditableDesignerRegion that we created.
        /// In this we return the markup that we want displayed in the editable region.
        /// </summary>
        /// <param name="region"></param>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetEditableDesignerRegionContent(EditableDesignerRegion region)
        {
            if (region == null)
            {
                throw new ArgumentNullException("region");
            }

            string regionName = region.Name;

            Debug.Assert(regionName[0] == 'c' || regionName[0] == 'h', "Expected regionName to start with c or h, not " + regionName);

            // is it a content template or a header?
            //
            bool content = regionName[0] == 'c';
            regionName = regionName.Substring(1);

            TabPanel activeTab = (TabPanel)TabContainer.FindControl(regionName);
            Debug.Assert(activeTab != null, "Couldn't find tab " + regionName);

            return GetTabContent(activeTab, content);            
        }

        /// <summary>
        /// Helper method to instantiate the given template into a control
        /// an slurp out the markup.
        /// </summary>
        /// <param name="template"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private string GetTemplateContent(ITemplate template, string id)
        {
            DesignerPanel contentPanel = new DesignerPanel();
            contentPanel.ID = id;

            template.InstantiateIn(contentPanel);
            IDesignerHost host = (IDesignerHost)GetService(typeof(IDesignerHost));

            Debug.Assert(host != null, "Failed to get IDesignerHost?!?");


            StringBuilder persistedControl = new StringBuilder(1024);
            foreach (System.Web.UI.Control c in contentPanel.Controls)
            {
                persistedControl.Append(ControlPersister.PersistControl(c, host));
            }
            return persistedControl.ToString();
        }

        /// <summary>
        /// Get the content for a given tab or header
        /// </summary>
        /// <param name="tab">The tab to search</param>
        /// <param name="content">True for ContentTemplate, otherwise it'll do HeaderTemplate</param>
        /// <returns></returns>
        private string GetTabContent(TabPanel tab, bool content)            
        {
            if (tab != null)
            {
                if (content && tab.ContentTemplate != null)
                {
                    return GetTemplateContent(tab.ContentTemplate, "_content");
                }
                else if (!content)
                {
                    if (tab.HeaderTemplate != null)
                    {
                        return GetTemplateContent(tab.HeaderTemplate, "_header");
                    }                    
                    return tab.HeaderText;
                }
            }
            return "";
        }

        /// <summary>
        /// Initialize the deisigner
        /// </summary>
        /// <param name="component"></param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", MessageId = "System.InvalidOperationException.#ctor(System.String)", Justification="The designer is not localized")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override void Initialize(IComponent component)
        {
            base.Initialize(component);
            SetViewFlags(ViewFlags.TemplateEditing, true);

            // make sure all the tabs have IDs and they're sited.
            foreach (TabPanel tp in TabContainer.Tabs)
            {
                if (String.IsNullOrEmpty(tp.ID))
                {
                    throw new InvalidOperationException("TabPanels must have IDs set.");
                }
            }
        }

        /// <summary>
        /// After a editable region is edited, the designer calls back with the updated markup so we can
        /// stuff it into the right tab.
        /// </summary>
        /// <param name="region"></param>
        /// <param name="content"></param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override void SetEditableDesignerRegionContent(EditableDesignerRegion region, string content)
        {
            if (region == null)
            {
                throw new ArgumentNullException("region");
            }

            string regionName = region.Name;

            Debug.Assert(regionName[0] == 'c' || regionName[0] == 'h', "Expected regionName to start with c or h, not " + regionName);

            bool setTabContent = regionName[0] == 'c';
            regionName = regionName.Substring(1);

            // figure out which tab we have.
            TabPanel activeTab = (TabPanel)TabContainer.FindControl(regionName);
            Debug.Assert(activeTab != null, "Couldn't find tab " + regionName);


            IDesignerHost host = (IDesignerHost)GetService(typeof(IDesignerHost));

            Debug.Assert(host != null, "Failed to get IDesignerHost?!?");
            
            // push the content into the right template
            PersistTemplateContent(activeTab, host, content, (setTabContent ? "ContentTemplate" : "HeaderTemplate"));
            
        }


        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private static void PersistTemplateContent(TabPanel panel, IDesignerHost host, string content, string propertyName)
        {
            ITemplate template = ControlParser.ParseTemplate(host, content);
            PersistTemplate(panel, host, template, propertyName);
        }

        /// <summary>
        /// Helper method to save the value of a template.  This sets up all the right Undo state.
        /// </summary>
        /// <param name="panel"></param>
        /// <param name="host"></param>
        /// <param name="template"></param>
        /// <param name="propertyName"></param>
        private static void PersistTemplate(TabPanel panel, IDesignerHost host, ITemplate template, string propertyName)
        {
            using (var transaction = host.CreateTransaction("SetEditableDesignerRegionContent"))
            {
                var propertyInfo = panel.GetType().GetProperty(propertyName);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(panel, template, null);
                    transaction.Commit();
                }
            }
        }

      
        /// <summary>
        /// Called when we get aclick on a designer region.
        /// </summary>
        /// <param name="e"></param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        protected override void OnClick(DesignerRegionMouseEventArgs e)
        {
            // is it a tab?
            if (e.Region != null && e.Region.Name.StartsWith("t", StringComparison.Ordinal))
            {

                CurrentTabID = e.Region.Name.Substring(1);
                
            }
            else if (e.Region != null && e.Region.Name == AddTabName)
            {
                // is it the "AddNewTab" region?
                OnAddTabPanel();
            }

            base.OnClick(e);
        }

        /// <summary>
        /// Add a new tab panel.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private void OnAddTabPanel()
        {

            IDesignerHost host = (IDesignerHost)GetService(typeof(IDesignerHost));

            if (host != null)
            {
                TabContainer tc = TabContainer;

                using (DesignerTransaction dt = host.CreateTransaction("Add new TabPanel"))
                {

                    TabPanel tp = (TabPanel)host.CreateComponent(typeof(TabPanel));

                    if (tp != null)
                    {
                        // set up the inital state
                        //
                        tp.ID = GetUniqueName(typeof(TabPanel), tc);
                        tp.HeaderText = tp.ID;
                        IComponentChangeService changeService = (IComponentChangeService)GetService(typeof(IComponentChangeService));

                        try
                        {
                            changeService.OnComponentChanging(tc, TypeDescriptor.GetProperties(tc)["Tabs"]);
                            tc.Tabs.Add(tp);
                        }
                        finally
                        {
                            changeService.OnComponentChanged(tc, TypeDescriptor.GetProperties(tc)["Tabs"], tc.Tabs, tc.Tabs);
                        }              
                        TypeDescriptor.GetProperties(tc)["ActiveTab"].SetValue(tc, tp);
                        CurrentTabID = tp.ID;
                    }
                    dt.Commit();
                }
            }

        }

        /// <summary>
        /// Helper to get a unique name.  Since our Tabs aren't onthe designer surface,
        /// INamingSurface won't do the right thing.  Fortunately, it's easy.
        /// </summary>
        /// <returns>A unique name like "TabPanel3"</returns>
        private static string GetUniqueName(Type t, System.Web.UI.Control parent)
        {
            string baseName = t.Name;
            int count = 1;

            while (parent.FindControl(baseName + count.ToString(CultureInfo.InvariantCulture)) != null)
            {
                count++;
            }
            return baseName + count.ToString(CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Remove the active tab panel and set the active tab to be the previous one.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification="Called via reflection")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private void OnRemoveTabPanel()
        {
            TabContainer tc = TabContainer;
            if (tc.ActiveTab != null)
            {
                int oldIndex = tc.ActiveTabIndex;
                
                IDesignerHost host = (IDesignerHost)GetService(typeof(IDesignerHost));

                if (host != null)
                {
                    using (DesignerTransaction dt = host.CreateTransaction("Remove TabPanel"))
                    {
                        TabPanel activeTab = tc.ActiveTab;

                        IComponentChangeService changeService = (IComponentChangeService)GetService(typeof(IComponentChangeService));

                        try
                        {
                            changeService.OnComponentChanging(tc, TypeDescriptor.GetProperties(tc)["Tabs"]);
                            tc.Tabs.Remove(activeTab);
                        }
                        finally
                        {
                            changeService.OnComponentChanged(tc, TypeDescriptor.GetProperties(tc)["Tabs"], tc.Tabs, tc.Tabs);
                        }                        

                        activeTab.Dispose();

                        if (tc.Tabs.Count > 0)
                        {
                            TypeDescriptor.GetProperties(tc)["ActiveTabIndex"].SetValue(tc, Math.Min(oldIndex, tc.Tabs.Count - 1));
                        }


                        UpdateDesignTimeHtml();
                        dt.Commit();
                    }
                    
                }
            }
        }

        [CategoryAttribute("Design")]
        [DesignOnlyAttribute(true)]
        [DefaultValueAttribute(false)]
        [DescriptionAttribute("Hide overflow content at design-time.")]
        public bool HideOverflowContent
        {
            get 
            { 
                var state = DesignerState["HideOverflowContent"];
                return state != null && (bool)state;
            } 
            set
            {
                var state = DesignerState["HideOverflowContent"];
                if (state == null || (bool)state != value)
                {
                    DesignerState["HideOverflowContent"] = value;
                    UpdateDesignTimeHtml();
                }
            }
        }
     
        /// <summary>
        /// Manages our designer verbs
        /// </summary>
        private class TabContainerDesignerActionList : DesignerActionList
        {
            private TabContainerDesigner _designer;

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            public TabContainerDesignerActionList(TabContainerDesigner designer)
                : base(designer.Component)
            {
                _designer = designer;
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            public override DesignerActionItemCollection GetSortedActionItems()
            {
                DesignerActionItemCollection items = new DesignerActionItemCollection();

                DesignerActionMethodItem addItem = new DesignerActionMethodItem(this, "OnAddTabPanel", "Add Tab Panel", true);
                DesignerActionMethodItem removeItem = new DesignerActionMethodItem(this, "OnRemoveTabPanel", "Remove Tab Panel", true);
                DesignerActionPropertyItem hideContentOverflowItem = new DesignerActionPropertyItem("HideOverflowContent", "Hide overflow content at design-time");
                items.Add(addItem);
                items.Add(removeItem);
                items.Add(hideContentOverflowItem);

                return items;
            }

            public bool HideOverflowContent
            {
                get { return _designer.HideOverflowContent; }
                set { _designer.HideOverflowContent = value; }
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Called via reflection")]
            private void OnAddTabPanel()
            {
                _designer.OnAddTabPanel();
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Called via reflection")]
            private void OnRemoveTabPanel()
            {
                _designer.OnRemoveTabPanel();
            }
        }

        /// <summary>
        /// a simple class to use for template instantiation
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible", Justification="Required for serialization")]
        internal class DesignerPanel : System.Web.UI.WebControls.Panel, INamingContainer
        {
        }
    }
}