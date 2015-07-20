var HtmlEditorWrapper = (function($) {

    var HTML_EDITOR_TABS = {
        "source": "ajax__html_editor_extender_source",
        "content": "ajax__html_editor_extender_content"
    };

    var HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX = "ajax__html_editor_extender_",
        HTML_EDITOR_BUTTONS = {
        "bold": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Bold",
        "italic": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Italic",
        "underline": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Underline",
        "undo": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Undo",
        "redo": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Redo",
        "strike-through": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "StrikeThrough",
        "subscript": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Subscript",
        "superscript": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Superscript",
        "justify-left": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "JustifyLeft",
        "justify-center": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "JustifyCenter",
        "justify-right": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "JustifyRight",
        "justify-full": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "JustifyFull",
        "insert-ordered-list": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "insertOrderedList",
        "insert-unordered-list": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "insertUnorderedList",
        "create-link": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "createLink",
        "unlink": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "UnLink",
        "remove-format": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "RemoveFormat",
        "select-all": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "SelectAll",
        "unselect": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "UnSelect",
        "delete": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Delete",
        //"cut": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Cut",
        //"copy": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Copy",
        //"paste": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Paste",
        "back-color-selector": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "BackColor",
        "fore-color-selector": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "ForeColor",
        "indent": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Indent",
        "outdent": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "Outdent",
        "insert-hor-rule": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "InsertHorizontalRule",
        "insert-image": HTML_EDITOR_BUTTON_CLASS_NAME_PREFIX + "InsertImage",
    };

    function HtmlEditorWrapper(htmlEditorExtender) {
        var that = this;

        var extender = htmlEditorExtender,
            $editableDiv = $(extender._editableDiv),
            $sourceViewDiv = $(extender._sourceViewDiv),
            $container = $(extender._container);

        this.TOOLBAR_BUTTONS = HTML_EDITOR_BUTTONS;

        this.currentState = {
            tab: function() {
                if($editableDiv.is(":visible"))
                    return "content";

                return "source";
            },
            //NOTE: we need to switch the tab of HtmlEditorExtender to apply setting of content
            editorContent: function(tab) {
                tab = tab || "content";

                var currentTab = this.tab();

                var selection = window.getSelection(),
                    range,
                    relativeOffsets;

                if(selection.rangeCount) {
                    range = selection.getRangeAt(0);
                    relativeOffsets = getRelativeOffsetsFromRange(range, currentTab == "content" ? $editableDiv.text() : $sourceViewDiv.text());
                }

                that.switchTab(tab);
                var result = extender[tab === "source" ? "_sourceViewDiv" : "_editableDiv"].textContent;
                that.switchTab(currentTab);

                if(selection.rangeCount) {
                    var selectionParams = getSelectionParams(relativeOffsets.start, relativeOffsets.end);
                    range = createRangeFromSelectionParams(selectionParams);

                    setSelectionRange(range);
                }

                return result;
            },
            containsElement: function($element) {
                return !!$container.find($element).length;
            }
        };

        this.getButtonElement = function(buttonName) {
            return $container.find(HTML_EDITOR_BUTTONS[buttonName].toClassSelector()).get(0);
        }

        this.pressToolbarButtons = function(buttonNames) {
            var $container = $(extender._container);

            for(var i = 0; i < buttonNames.length; i++)
                if(HTML_EDITOR_BUTTONS[buttonNames[i]])
                    $container.find(HTML_EDITOR_BUTTONS[buttonNames[i]].toClassSelector()).click();

            return this;
        };

        this.switchTab = function(tab) {
            if(HTML_EDITOR_TABS[tab])
                $container.find(HTML_EDITOR_TABS[tab].toClassSelector()).click();

            return this;
        };

        this.selectText = function(startOffset, endOffset) {
            var selection = getSelectionParams(startOffset, endOffset),
                range = createRangeFromSelectionParams(selection);

            setSelectionRange(range);

            return this;
        };

        //NOTE: we need to switch the tab of HtmlEditorExtender to apply setting of content
        this.setContent = function(htmlContent, tab) {
            tab = tab || "content";

            var currentTab = this.currentState.tab();
            this.switchTab(tab);

            var content = (htmlContent instanceof HTMLElement) ? htmlContent.outerHTML : htmlContent;
            if(tab === "content")
                $editableDiv.text(content);
            else
                $sourceViewDiv.text(content);

            this.switchTab(currentTab);

            return this;
        };

        var getChildSelection = function($element, selection, selectionRange) {
            var childElements = $element.contents();

            if(childElements.length === 0) {
                var text = $element.text();

                for(var i = 0; i < text.length; i++) {
                    if(selectionRange.counter === selectionRange.start) {
                        selection.start.offset = i;
                        selection.start.node = $element.get(0);
                    }

                    if(selectionRange.counter === selectionRange.end) {
                        selection.end.offset = i;
                        selection.end.node = $element.get(0);
                    }

                    selectionRange.counter++;
                }

                if(selection.end.node === null) {
                    selection.end.node = $element.get(0);
                    selection.end.offset = text.length;
                }

                return selection;
            }

            for(var i = 0; i < childElements.length; i++)
                getChildSelection($(childElements[i]), selection, selectionRange);

            return selection;
        };

        var getSelectionParams = function(startOffset, endOffset) {
            var selection = {
                start: {
                    node: null,
                    offset: 0
                },
                end: {
                    node: null,
                    offset: 0
                }
            };

            var selectionRange = {
                start: startOffset || 0,
                end: endOffset || $editableDiv.text().length,
                counter: 0
            };

            return getChildSelection($editableDiv, selection, selectionRange);
        };

        var setSelectionRange = function(range) {
            if(!range) return;

            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        };

        var createRangeFromSelectionParams = function(selection) {
            if(!selection.start.node || !selection.end.node)
                return null;

            var range = document.createRange();

            range.setStart(selection.start.node, selection.start.offset);
            range.setEnd(selection.end.node, selection.end.offset);

            return range;
        };

        var getRelativeOffsetsFromRange = function(range, content) {
            var startIndex = content.indexOf(range.toString());

            return {
                start: startIndex,
                end: startIndex + range.toString().length
            };
        };

        return this;
    };

    return HtmlEditorWrapper;
}(jQuery));