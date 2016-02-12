#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// PagingBulletedList is an ASP.NET AJAX extender that can be attached to an ASP.NET BulletedList control
    /// and provide client-side sorted paging. It is very flexible and lets you specify either the number of
    /// characters used in the heading indices or the maximum number of items to display per index. If the
    /// input is not sorted (either on the server or client), it will generate more header indices but still function appropriately.
    /// </summary>
    [Designer(typeof(PagingBulletedListExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.PagingBulletedListBehavior", Constants.PagingBulletedListName)]
    [TargetControlType(typeof(System.Web.UI.WebControls.BulletedList))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.PagingBulletedListName + Constants.IconPostfix)]
    public class PagingBulletedListExtender : ExtenderControlBase {
        public PagingBulletedListExtender() {
            EnableClientState = true;
        }

        /// <summary>
        /// The number of characters in index headings (ignored if MaxItemPerPage is set)
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(1)]
        [ClientPropertyName("indexSize")]
        public int IndexSize {
            get { return GetPropertyValue<int>("IndexSize", 1); }
            set { SetPropertyValue<int>("IndexSize", value); }
        }

        /// <summary>
        /// Bulleted list height
        /// </summary>
        [ExtenderControlProperty()]
        [ClientPropertyName("height")]
        public int? Height {
            get { return GetPropertyValue<int?>("Height", null); }
            set { SetPropertyValue<int?>("Height", value); }
        }

        /// <summary>
        /// Separator text to be placed between indices
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(" - ")]
        [ClientPropertyName("separator")]
        public string Separator {
            get { return GetPropertyValue<string>("Separator", " - "); }
            set { SetPropertyValue<string>("Separator", value); }
        }

        /// <summary>
        /// Maximum number of items per page (ignores the IndexSize property)
        /// </summary>
        [ExtenderControlProperty()]
        [ClientPropertyName("maxItemPerPage")]
        public int? MaxItemPerPage {
            get { return GetPropertyValue<int?>("MaxItemPerPage", null); }
            set { SetPropertyValue<int?>("MaxItemPerPage", value); }
        }

        /// <summary>
        /// Determines whether or not items should be sorted on the client side
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(false)]
        [ClientPropertyName("clientSort")]
        public bool ClientSort {
            get { return GetPropertyValue<bool>("ClientSort", false); }
            set { SetPropertyValue<bool>("ClientSort", value); }
        }

        /// <summary>
        /// A CSS class for the selected index
        /// </summary>
        [ExtenderControlProperty()]
        [ClientPropertyName("selectIndexCssClass")]
        public string SelectIndexCssClass {
            get { return GetPropertyValue<string>("SelectIndexCssClass", String.Empty); }
            set { SetPropertyValue<string>("SelectIndexCssClass", value); }
        }

        /// <summary>
        /// A CSS class for indices that aren't selected
        /// </summary>
        [ExtenderControlProperty()]
        [ClientPropertyName("unselectIndexCssClass")]
        public string UnselectIndexCssClass {
            get { return GetPropertyValue<string>("UnselectIndexCssClass", String.Empty); }
            set { SetPropertyValue<string>("UnselectIndexCssClass", value); }
        }
    }

}

#pragma warning restore 1591