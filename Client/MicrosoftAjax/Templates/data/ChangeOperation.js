$type = Sys.Data.ChangeOperation = function Data$ChangeOperation(action, item, linkSource, linkSourceField, linkTarget) {
    /// <summary locid="M:J#Sys.Data.ChangeOperation.#ctor">Describes a single change in a set of data.</summary>
    /// <param name="action" type="Sys.Data.ChangeOperationType"></param>
    /// <param name="item" mayBeNull="true">The item that was changed.</param>
    /// <param name="linkSource" mayBeNull="true" optional="true">The item that is being linked from.</param>
    /// <param name="linkSourceField" mayBeNull="true" optional="true">The field on the source item representing the relationship.</param>
    /// <param name="linkTarget" mayBeNull="true" optional="true">The item that is being linked to.</param>
    /// <field name="action" type="Sys.Data.ChangeOperationType" locid="F:J#Sys.Data.ChangeOperation.action"></field>
    /// <field name="item" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.item">The item that was changed.</field>
    /// <field name="linkSource" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkSource">The item that is being linked from.</field>
    /// <field name="linkSourceField" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkSourceField">The field on the source item representing the relationship.</field>
    /// <field name="linkTarget" mayBeNull="true" locid="F:J#Sys.Data.ChangeOperation.linkTarget">The item that is being linked to.</field>
    this.action = action;
    this.item = item;
    this.linkSourceField = linkSourceField;
    this.linkSource = linkSource;
    this.linkTarget = linkTarget;
}
$type.prototype = {
    action: null,
    item: null,
    linkSource: null,
    linkSourceField: null,
    linkTarget: null
}
$type.registerClass("Sys.Data.ChangeOperation");

