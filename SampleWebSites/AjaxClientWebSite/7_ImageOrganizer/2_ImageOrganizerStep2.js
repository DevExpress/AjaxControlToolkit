/// <reference name="MicrosoftAjax.js" />
/// <reference name="MicrosoftAjaxTemplates.js" />
/// <reference name="MicrosoftAjaxDataContext.js" />
/// <reference name="MicrosoftAjaxOpenData.js" />

var imagesList, dataContext, detailPane, editMode = false, data = {},
    fetchParameters = { $expand: "Contributor", $orderby: "Name" };
    
Sys.activateDom = false; 

Sys.require([Sys.components.openDataContext, Sys.components.dataView]);

Sys.onReady(function() {
    // Create DataContext pointing at a WCF Data Service
    dataContext = Sys.create.openDataContext({
        serviceUri: "../Services/ImagesDataService.svc",
        mergeOption: Sys.Data.MergeOption.appendOnly
    });

    Sys.query(document.documentElement).activateElements();

    imagesList = Sys.get("$imagesListView");
    detailPane = Sys.get("$detailView");
    fetchPeople();
});
 
function fetchPeople() {
    dataContext.fetchData("People", { $expand: 'Images' }, null, null,
        function(results) {
            data.people = results;
        }
    );
}

function onImagesFetched(sender, args) {
    data.images = args.get_result();
    Sys.Observer.makeObservable(data.images);
}

function onSort(orderby) {
    fetchParameters.$orderby = orderby;
    imagesList.fetchData();
}

function setEditMode(newEditMode) {
    if (editMode == newEditMode) return;
    Sys.Observer.setValue(window, "editMode", newEditMode);
    detailPane.set_itemTemplate(editMode ? "#detailViewEditTemplate" : "#detailView");
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
        fetchData(true);
        dataContext.clearChanges();
    }
    fetchPeople();
    setEditMode(false);
}

function fetchData(overwrite) {
    var mergeOption = overwrite ? Sys.Data.MergeOption.overwriteChanges : Sys.Data.MergeOption.appendOnly;
    imagesList.fetchData(null, null, mergeOption);
}

function trim(value) { return value ? value.trim() : ""; }

function addPerson(first, last) {
    var newPerson = { FirstName: first, LastName: last, Images: [] };
    dataContext.insertEntity(newPerson, "People");
    Sys.Observer.add(data.people, newPerson)
}

function removePerson(person) {
    while (person.Images.length) {
        if (person.Images[0].Contributor != null) {
            dataContext.setLink(person.Images[0], "Contributor", null);
        }
        dataContext.removeLink(person, "Images", person.Images[0]);
    }
    dataContext.removeEntity(person);
    Sys.Observer.remove(data.people, person)
}

function convertBackName(value, binding) {
    var image = binding.get_source();
    var contributorList = Sys.get("select", binding.get_templateContext());
    if (image.Contributor == null) {
        if (!value) return "";
        (binding.get_path() == "Contributor.FirstName") ? addPerson(value, "") : addPerson("", value);
        contributorList.selectedIndex = contributorList.length - 2; // The last item is the placeholder. The added item is the next to last one...
        setContributor(contributorList);
        return trim(value);
    }
    if (value == "") {
        if ((binding.get_path() == "Contributor.FirstName") ? image.Contributor.LastName == "" : image.Contributor.FirstName == "") {
            removePerson(image.Contributor);
        }
        return trim(value);
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

function onContributorItemRendered(dataView, ctx) {
    var optionElement = Sys.get("option", ctx);

    optionElement.selected = (data.people[ctx.index] == ctx.parentContext.dataItem.Contributor);

    bindFirstAndLastNames(ctx.dataItem, optionElement, "innerHTML");
}

function onDetailViewCommand(sender, args) {
    switch (args.get_commandName()) {
        case "Delete":
            var index = imagesList.get_selectedIndex();
            var deletedImage = data.images[index];

            if (deletedImage.Contributor != null) {
                dataContext.setLink(deletedImage, "Contributor", null);
            }

            dataContext.removeEntity(deletedImage);
            data.images.remove(deletedImage);

            if (index >= data.images.length) index--;
            imagesList.set_selectedIndex(index);
            break;
    }
}

function addNewImage() {
    var newImage = { Name: "", Description: "", Contributor: null, Uri: "../images/question.jpg" };
    dataContext.insertEntity(newImage, "Images");
    data.images.add(newImage);

    var newIndex = data.images.length - 1;
    imagesList.set_selectedIndex(newIndex);
    Sys.get(".listitem", imagesList.get_contexts()[newIndex]).scrollIntoView();
}

function display(value) {
    return !!value ? "inline-block" : "none";
}

function onFetchFailed(sender, args) {
    alert("Fetch Failed: " + args.get_error().get_message());
}
