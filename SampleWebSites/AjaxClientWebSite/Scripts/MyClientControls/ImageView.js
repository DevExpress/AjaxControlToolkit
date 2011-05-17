/// <reference name="MicrosoftAjax.js"/>
/// <reference name="MicrosoftAjaxTemplates.js"/>

(function () {

    function execute() {
        Type._registerScript("ImageView.js", ["MicrosoftAjaxTemplates.js"]);

        Type.registerNamespace("My.Controls");

        My.Controls.ImageView = function (element) {
            My.Controls.ImageView.initializeBase(this, [element]);
            this._editMode = false;
            this.set_itemTemplate(My.Controls.ImageView.browseTemplate)
        }

        My.Controls.ImageView.browseTemplate = document.createElement('div');
        My.Controls.ImageView.editTemplate = document.createElement('div');
        My.Controls.ImageView.browseTemplate.innerHTML =
            '<span class="namedlistitem">                           \
                <img sys:src="{binding Uri}"/>                      \
                <div sys:innertext="{binding Name}"></div>          \
            </span>';
        My.Controls.ImageView.editTemplate.innerHTML =
            '<span class="editablenamedlistitem">                           \
                <img sys:src="{binding Uri}"/>                      \
                <span>Title:</span>                                 \
                <input type="text" sys:value="{binding Name}"/>     \
            </span>';

        My.Controls.ImageView.prototype = {
            set_editMode: function (value) {
                this.set_itemTemplate(value ? My.Controls.ImageView.editTemplate : My.Controls.ImageView.browseTemplate)
                this._editMode = value;
            },
            get_editMode: function () {
                return this._editMode;
            }
        }

        My.Controls.ImageView.registerClass("My.Controls.ImageView", Sys.UI.DataView);
        Sys.registerComponent(My.Controls.ImageView);
    }

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript("ImageView", null, execute);
    }
    else {
        execute();
    }

})();



