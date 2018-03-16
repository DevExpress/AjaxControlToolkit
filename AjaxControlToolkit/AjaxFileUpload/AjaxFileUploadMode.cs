namespace AjaxControlToolkit {

    public enum AjaxFileUploadMode {
        // If a browser supports HTML 5, then upload a file via AJAX request,
        // otherwise, post a form to server.
        Auto,

        // Same as Auto
        Client,

        // Upload a file by posting a form.
        Server
    }

}
