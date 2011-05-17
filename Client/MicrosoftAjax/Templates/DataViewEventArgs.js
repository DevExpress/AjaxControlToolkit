$type = Sys.UI.DataViewEventArgs = function UI$DataViewEventArgs(data) {
    /// <summary locid="M:J#Sys.UI.DataViewEventArgs.#ctor"></summary>
    /// <param name="data" mayBeNull="true" optional="true"></param>
    /// <field name="context" locid="P:J#Sys.UI.DataViewEventArgs.context">The template context associated with this event, if any.</field>
    /// <field name="data" locid="P:J#Sys.UI.DataViewEventArgs.data">The data associated with this event.</field>
    /// <field name="itemPlaceholder" locid="P:J#Sys.UI.DataViewEventArgs.itemPlaceholder">The location where the item template is instantiated.</field>
    /// <field name="itemTemplate" locid="P:J#Sys.UI.DataViewEventArgs.itemTemplate">The template used to render an item.</field>
    if (typeof(data) !== "undefined") {
        this.data = data;
    }
    Sys.UI.DataViewEventArgs.initializeBase(this);
}
$type.prototype = {
    data: null,
    itemTemplate: null,
    itemPlaceholder: null
};
$type.registerClass("Sys.UI.DataViewEventArgs", Sys.CancelEventArgs);
