$type = Sys.Net.WebServiceOperation = function WebServiceOperation(operation, parameters, httpVerb) {
    /// <summary locid="M:J#Sys.Net.WebServiceOperation.#ctor">Defines a seb service operation.</summary>
    /// <param name="operation"></param>
    /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
    /// <param name="httpVerb" type="String" mayBeNull="true" optional="true"></param>
    /// <field name="operation" locid="F:J#Sys.Net.WebServiceOperation.operation"></field>
    /// <field name="parameters" type="Object" mayBeNull="true" locid="F:J#Sys.Net.WebServiceOperation.parameters"></field>
    /// <field name="httpVerb" type="String" mayBeNull="true" locid="F:J#Sys.Net.WebServiceOperation.httpVerb"></field>
    if (typeof(operation) === "undefined") {
        // cant just use "operation || null" since operation could be empty string or 0 or false
        operation = null;
    }
    this.operation = operation;
    this.parameters = parameters || null;
    this.httpVerb = httpVerb || null;
}
$type.prototype = {
    operation: null,
    parameters: null,
    httpVerb: null
}
$type.registerClass("Sys.Net.WebServiceOperation");

