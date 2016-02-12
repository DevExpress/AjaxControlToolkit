#pragma warning disable 1591
namespace AjaxControlToolkit {

    public enum AjaxFileUploadMode {
        // Automaticallu use Mode="Client" if the browser supports HTML5 progress. 
        // If the browser does not support HTML5 progress, and the app is running on .NET 4.5, then use Mode="Server". 
        // If not using .NET 4.5, display a standard INPUT TYPE="file" tag.
        Auto,

        // If a browser supports HTML5 then show progress using HTML5, 
        // otherwise, display a standard INPUT TYPE="file" tag.
        Client,

        // If using .NET 4.5 then show progress by polling the size of the temporary file on the server. 
        // Otherwise, if not using .NET 4.5, then display a standard INPUT TYPE="file" tag.
        Server
    }

}
#pragma warning restore 1591