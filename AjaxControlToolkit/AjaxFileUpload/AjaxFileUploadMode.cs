namespace AjaxControlToolkit {

    public enum AjaxFileUploadMode {
        // If the client browser supports HTML 5, file uploads are performed via AJAX requests,
        // otherwise - by posting the HTML form to the server.
        Auto,

        // Same as Auto
        Client,

        // Files are uploaded by posting the HTML form.
        Server
    }

}
