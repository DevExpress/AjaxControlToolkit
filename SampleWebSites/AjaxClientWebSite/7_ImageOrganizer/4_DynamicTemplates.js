/// <reference name="MicrosoftAjax.js" />
/// <reference name="MicrosoftAjaxTemplates.js" />
/// <reference name="MicrosoftAjaxDataContext.js" />
/// <reference name="MicrosoftAjaxOpenData.js" />

var imagesList, dataContext, peopleList, tagsList, detailPane, data = {}, filters = { tags: [], people: [] }, 
    fetchParameters = { $expand: "Contributor, Tags", $orderby: "Name" };

Sys.activateDom = false; 

Sys.require([Sys.components.openDataContext, Sys.components.dataView]);

Sys.onReady(function() {
    // Create DataContext pointing at a WCF Data Service
    dataContext = Sys.create.openDataContext(
        {
            serviceUri: "../Services/ImagesDataService.svc",
            mergeOption: Sys.Data.MergeOption.appendOnly
        }
    );

    Sys.query(document.documentElement).activateElements();

    imagesList = $find("imagesListView");
    peopleList = $find("peopleListView");
    tagsList = $find("tagsListView");
});

function onImagesFetched(sender, args) {
    data.images = args.get_result();
    Sys.Observer.makeObservable(data.images);
    ready();
}

function onTagsFetched(sender, args) {
    data.tags = args.get_result();
    Sys.Observer.makeObservable(data.tags);
    ready();
}

function onPeopleFetched(sender, args) {
    data.people = args.get_result();
    Sys.Observer.makeObservable(data.people);
    ready();
}

function ready() {
    if (data.tags && data.people && data.images) {
        Sys.Observer.setValue(data, "ready", true);
    }
}

function onSort(orderby) {
    fetchParameters.$orderby = orderby;
    imagesList.fetchData();
    clearFilters();
}

function onMasterRendering(sender, args) {
    var changes = dataContext.get_changes();
    if (changes === null) return;

    if (!sender.get_isFetching()) return;

    var data = args.data;

    for (var i = 0, l = changes.length; i < l; i++) {
        if ((changes[i].action === Sys.Data.ChangeOperationType.insert) && changes[i].item && (changes[i].item.__metadata.entitySet === "Images")) {
            data[data.length] = changes[i].item;
        }
    }
}

function setEditMode(newEditMode) {
    if (editMode == newEditMode) return;
    Sys.Observer.setValue(window, "editMode", newEditMode);
    if (editMode) {
        clearFilters();
        imagesList.set_data(data.images);
        data.people = peopleList.get_data();
        data.tags = tagsList.get_data();
        detailPane.set_itemTemplate("#detailViewEditTemplate");
        peopleList.set_itemTemplate("#peopleEditTemplate");
        tagsList.set_itemTemplate("#tagsEditTemplate");
    }
    else {
        detailPane.set_itemTemplate("#detailView");
        peopleList.set_itemTemplate("#peopleListView");
        tagsList.set_itemTemplate("#tagsListView");
    }
}


function saveChanges() {
    if (window.confirm("Are you sure you want to save changes to the server?")) {
        setEditMode(false);
        dataContext.saveChanges(
            function(results) {
                alert("Changes successfully saved to the server...");
            },
            function(error) {
                alert("Saving changes to the server was unsuccessful: " + error.get_message());
                cancelChanges();
            }
        );
    }
}

function cancelChanges() {
    if (dataContext.get_hasChanges()) {
        dataContext.clearChanges();
        fetchData(true);
    }
    setEditMode(false);
}

function fetchData(overwrite) {
    var mergeOption = overwrite ? Sys.Data.MergeOption.overwriteChanges : Sys.Data.MergeOption.appendOnly;
    imagesList.fetchData(null, null, mergeOption);
    tagsList.fetchData(null, null, mergeOption);
    peopleList.fetchData(null, null, mergeOption);
}

function trim(value) { return value ? value.trim() : ""; }

function convertBackName(value, binding) {
    var contributor = binding.get_source();
    if (value == "") {
        if ((binding.get_path() == "FirstName") ? contributor.LastName == "" : contributor.FirstName == "") {
            removePerson(contributor);
        }
        return value;
    }
    return trim(value);
}

function convertBackTag(value, binding) {
    var tag = binding.get_source();
    if (value == "") {
        removeTag(tag);
        return value;
    }
    return trim(value);
}

function nameConvert(value) {
    if (value) {
        if (value.FirstName) {
            return value.FirstName + " " + value.LastName;
        }
        return value.LastName;
    }
    return "";
}

function setContributor(sender) {
    var selectedContributorIndex = sender.value;
    var currentImage = imagesList.get_selectedData();
    var oldContributor = currentImage.Contributor;
    var newContributor = data.people[selectedContributorIndex];
    if (oldContributor == newContributor) return;
    if (newContributor != null) {
        dataContext.setLink(currentImage, "Contributor", newContributor);
        dataContext.addLink(newContributor, "Images", currentImage);
    }
    else {
        dataContext.setLink(currentImage, "Contributor", null);
    }
    if (oldContributor != null) {
        dataContext.removeLink(oldContributor, "Images", currentImage);
    }
}

function bindFirstAndLastNames(contributor, target, targetProperty) {
    if (!contributor) return;
    var bindingProps = { path: "FirstName", target: target, source: contributor, targetProperty: targetProperty, mode: Sys.BindingMode.oneWay,
        convert: function() {
            return nameConvert(contributor);
        }
    };
    $create(Sys.Binding, bindingProps);
    bindingProps.path = "LastName";
    $create(Sys.Binding, bindingProps);
}

function convertImageContributor(contributor, binding) {
    bindFirstAndLastNames(contributor, binding.get_target(), "nodeValue");
    
    return nameConvert(contributor);
}

function onContributorItemRendered(sender, tc) {
    var optionElement = Sys.get("option", tc);

    optionElement.selected = (data.people[tc.index] == tc.parentContext.dataItem.Contributor);

    bindFirstAndLastNames(tc.dataItem, optionElement, "innerHTML");
}

function containsTag(parentTags, name) {
    for (var tag in parentTags) {
        if (parentTags[tag].Name == name) return true;
    }
    return false;
}

function getIndex(sender, args) {
    return sender.findContext(args.get_commandSource()).index;
}

function onTagCheckBoxListCommand(sender, args) {
    switch (args.get_commandName()) {
        case "SetTag":
            var clickedTag = data.tags[getIndex(sender, args)];
            var selectedImage = imagesList.get_selectedData();
            if (args.get_commandSource().checked) {
                dataContext.addLink(selectedImage, "Tags", clickedTag);
                dataContext.addLink(clickedTag, "Images", selectedImage);
            }
            else {
                dataContext.removeLink(selectedImage, "Tags", clickedTag);
                dataContext.removeLink(clickedTag, "Images", selectedImage);
            }
            args.set_cancel(true);
    }
}

function setFilterSelection(array, filterArray, index) {
    var selectedItem = array[index];
    filterArray[index] = !filterArray[index]
    if (filterArray[index]) {
        ensureDeferredProperty(selectedItem, "Images", filterImages, deferredRequestFailed);
    }
    else {
        filterImages();
    }
}

function ensureDeferredProperty(entity, property, succeeded, failed) {
    if (entity[property] && entity[property].__deferred) {
        dataContext.fetchDeferredProperty(entity, property, null, null, succeeded, failed)
        return;
    }
    if (succeeded) {
        succeeded();
    }
}

function onMasterTagsCommand(sender, args) {
    switch (args.get_commandName()) {
        case "MultiSelect":
            setFilterSelection(data.tags, filters.tags, getIndex(sender, args));
            sender.refresh();
            break;
    }
}

function onMasterPeopleCommand(sender, args) {
    switch (args.get_commandName()) {
        case "MultiSelect":
            setFilterSelection(data.people, filters.people, getIndex(sender, args));
            sender.refresh();
            break;
    }
}

function display(value) {
    return !!value ? "inline-block" : "none";
}

function clearFilters() {
    filters.tags = [];
    filters.people = [];
    tagsList.refresh();
    peopleList.refresh();
}

function deferredRequestFailed(entity, context, property) {
    alert("Deferred Request Failed");
}

function onFetchFailed(sender, args) {
    alert("Fetch Failed: " + args.get_error().get_message());
}
