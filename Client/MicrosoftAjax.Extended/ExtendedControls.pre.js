

Sys.loader.defineScripts({
},
[
  
  // common
  { name: "ExtendedCommon",
    releaseUrl: "%/extended/common/common.js",
    debugUrl: "%/extended/common/common.debug.js",
    executionDependencies: ["ComponentModel"] },
  { name: "ExtendedDateTime",
    releaseUrl: "%/extended/common/datetime.js",
    debugUrl: "%/extended/common/datetime.debug.js",
    executionDependencies: ["ExtendedCommon"] },
  { name: "ExtendedThreading",
    releaseUrl: "%/extended/common/threading.js",
    debugUrl: "%/extended/common/threading.debug.js",
    executionDependencies: ["Core"] },
  
  // compat
  //    /timer
  { name: "ExtendedTimer",
    releaseUrl: "%/extended/compat/timer/timer.js",
    debugUrl: "%/extended/compat/timer/timer.debug.js",
    executionDependencies: ["ComponentModel"] },

  // compat
  //    /dragdrop
  { name: "ExtendedDragDrop",
    releaseUrl: "%/extended/compat/dragdrop/dragdropscripts.js",
    debugUrl: "%/extended/compat/dragdrop/dragdropscripts.debug.js",
    executionDependencies: ["ExtendedTimer", "ExtendedCommon"] },
  
  // extenderbase
  { name: "ExtendedBase",
    releaseUrl: "%/extended/extenderBase/baseScripts.js",
    debugUrl: "%/extended/extenderBase/baseScripts.debug.js",
    executionDependencies: ["ComponentModel","Serialization"] },
  
  // animation
  { name: "ExtendedAnimations",
    releaseUrl: "%/extended/animation/animations.js",
    debugUrl: "%/extended/animation/animations.debug.js",
    executionDependencies: ["ExtendedCommon", "ExtendedTimer"] },
  { name: "ExtendedAnimationBehavior",
    releaseUrl: "%/extended/animation/animationbehavior.js",
    debugUrl: "%/extended/animation/animationbehavior.debug.js",
    executionDependencies: ["ExtendedAnimations", "ExtendedBase"] },
  
  // accordion
  { name: "ExtendedAccordion",
    releaseUrl: "%/extended/accordion/accordionbehavior.js",
    debugUrl: "%/extended/accordion/accordionbehavior.debug.js",
    behaviors: [{name: "accordion", typeName: "Sys.Extended.UI.AccordionBehavior"}],
    executionDependencies: ["ExtendedAnimations", "ExtendedBase"] },
    
  // alwaysvisiblecontrol
  { name: "ExtendedAlwaysVisible",
    releaseUrl: "%/extended/alwaysvisiblecontrol/alwaysvisiblecontrolbehavior.js",
    debugUrl: "%/extended/alwaysvisiblecontrol/alwaysvisiblecontrolbehavior.debug.js",
    behaviors: [{name: "alwaysVisible", typeName: "Sys.Extended.UI.AlwaysVisibleControlBehavior"}],
    executionDependencies: ["ExtendedAnimations", "ExtendedBase"] },

  // autocomplete
  { name: "ExtendedAutoComplete",
    releaseUrl: "%/extended/autocomplete/autocompletebehavior.js",
    debugUrl: "%/extended/autocomplete/autocompletebehavior.debug.js",
    behaviors: [{name: "autoComplete", typeName: "Sys.Extended.UI.AutoCompleteBehavior"}],
    executionDependencies: ["ExtendedTimer", "ExtendedAnimationBehavior", "ExtendedPopup"] },
    
  // calendar
  { name: "ExtendedCalendar",
    releaseUrl: "%/extended/calendar/calendarbehavior.js",
    debugUrl: "%/extended/calendar/calendarbehavior.debug.js",
    behaviors: [{name: "calendar", typeName: "Sys.Extended.UI.CalendarBehavior"}],
    executionDependencies: ["Globalization", "ExtendedBase", "ExtendedDateTime", "ExtendedThreading", "ExtendedAnimationBehavior", "ExtendedPopup"] },
    
  // cascadingdropdown
  { name: "ExtendedCascadingDropDown",
    releaseUrl: "%/extended/cascadingdropdown/cascadingdropdownbehavior.js",
    debugUrl: "%/extended/cascadingdropdown/cascadingdropdownbehavior.debug.js",
    behaviors: [{name: "cascadingDropDown", typeName: "Sys.Extended.UI.CascadingDropDownBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon", "WebServices"] },
  
  // collapsiblepanel
  { name: "ExtendedCollapsiblePanel",
    releaseUrl: "%/extended/collapsiblepanel/collapsiblepanelbehavior.js",
    debugUrl: "%/extended/collapsiblepanel/collapsiblepanelbehavior.debug.js",
    behaviors: [{name: "collapsiblePanel", typeName: "Sys.Extended.UI.CollapsiblePanelBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon", "ExtendedAnimations"] },
    
  // colorpicker
  { name: "ExtendedColorPicker",
    releaseUrl: "%/extended/colorpicker/colorpickerbehavior.js",
    debugUrl: "%/extended/colorpicker/colorpickerbehavior.debug.js",
    behaviors: [{name: "colorPicker", typeName: "Sys.Extended.UI.ColorPickerBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon", "ExtendedThreading", "ExtendedPopup"] },
    
  // combobox -- skipped

  // confirmbutton
  { name: "ExtendedConfirmButton",
    releaseUrl: "%/extended/confirmbutton/confirmbuttonbehavior.js",
    debugUrl: "%/extended/confirmbutton/confirmbuttonbehavior.debug.js",
    behaviors: [{name: "confirmButton", typeName: "Sys.Extended.UI.ConfirmButtonBehavior", parameters: [{name: "ConfirmText", type: "String"}]}],
    executionDependencies: ["ExtendedBase"] },
    
  // DragPanel (FloatingBehavior)
  { name: "ExtendedFloating",
    releaseUrl: "%/extended/dragpanel/floatingbehavior.js",
    debugUrl: "%/extended/dragpanel/floatingbehavior.debug.js",
    behaviors: [{name: "draggable", typeName: "Sys.Extended.UI.FloatingBehavior" }],
    executionDependencies: ["ExtendedBase", "ExtendedCommon", "ExtendedDragDrop"] },

  // DropDown
  { name: "ExtendedDropDown",
    releaseUrl: "%/extended/dropdown/dropdownbehavior.js",
    debugUrl: "%/extended/dropdown/dropdownbehavior.debug.js",
    behaviors: [{name: "dropDown", typeName: "Sys.Extended.UI.DropDownBehavior" }],
    executionDependencies: ["ExtendedDynamicPopulate", "ExtendedAnimationBehavior", "ExtendedPopup", "ExtendedHover"] },

  // DropShadow
  { name: "ExtendedDropShadow",
    releaseUrl: "%/extended/dropshadow/dropshadowbehavior.js",
    debugUrl: "%/extended/dropshadow/dropshadowbehavior.debug.js",
    behaviors: [{name: "dropShadow", typeName: "Sys.Extended.UI.DropShadowBehavior" }],
    executionDependencies: ["ExtendedBase", "ExtendedCommon", "ExtendedTimer", "ExtendedRoundedCorners"] },

  // dynamicpopulate
  { name: "ExtendedDynamicPopulate",
    releaseUrl: "%/extended/dynamicpopulate/dynamicpopulatebehavior.js",
    debugUrl: "%/extended/dynamicpopulate/dynamicpopulatebehavior.debug.js",
    behaviors: [{name: "dynamicPopulate", typeName: "Sys.Extended.UI.DynamicPopulateBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon", "Network"] },

  // filteredtextbox
  { name: "ExtendedFilteredTextBox",
    releaseUrl: "%/extended/filteredtextbox/filteredtextboxbehavior.js",
    debugUrl: "%/extended/filteredtextbox/filteredtextboxbehavior.debug.js",
    behaviors: [{name: "filteredTextBox", typeName: "Sys.Extended.UI.FilteredTextBoxBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon"] },
  
  // HoverExtender
  { name: "ExtendedHover",
    releaseUrl: "%/extended/hoverextender/hoverbehavior.js",
    debugUrl: "%/extended/hoverextender/hoverbehavior.debug.js",
    behaviors: [{name: "hover", typeName: "Sys.Extended.UI.HoverBehavior" }],
    executionDependencies: ["ExtendedBase", "ExtendedCommon"] },

  // HoverMenu
  { name: "ExtendedHoverMenu",
    releaseUrl: "%/extended/hovermenu/hovermenubehavior.js",
    debugUrl: "%/extended/hovermenu/hovermenubehavior.debug.js",
    behaviors: [{name: "hoverMenu", typeName: "Sys.Extended.UI.HoverMenuBehavior" }],
    executionDependencies: ["ExtendedDynamicPopulate", "ExtendedHover", "ExtendedAnimationBehavior", "ExtendedPopup"] },

  // ListSearch
  { name: "ExtendedListSearch",
    releaseUrl: "%/extended/listsearch/listsearchbehavior.js",
    debugUrl: "%/extended/listsearch/listsearchbehavior.debug.js",
    behaviors: [{name: "listSearch", typeName: "Sys.Extended.UI.ListSearchBehavior" }],
    executionDependencies: ["ExtendedPopupBehavior"] },
    
  // MaskedEdit
  { name: "ExtendedMaskedEdit",
    releaseUrl: "%/extended/maskededit/maskededitbehavior.js",
    debugUrl: "%/extended/maskededit/maskededitbehavior.debug.js",
    behaviors: [{name: "maskedEdit", typeName: "Sys.Extended.UI.MaskedEditBehavior" }],
    executionDependencies: ["ExtendedBase", "ExtendedTimer", "ExtendedCommon"] },
    
  // ModalPopup
  { name: "ExtendedModalPopup",
    releaseUrl: "%/extended/modalpopup/modalpopupbehavior.js",
    debugUrl: "%/extended/modalpopup/modalpopupbehavior.debug.js",
    behaviors: [{name: "modalPopup", typeName: "Sys.Extended.UI.ModalPopupBehavior" }],
    executionDependencies: ["ExtendedDynamicPopulate", "ExtendedDropShadow", "ExtendedFloating"] },
    
  // MultiHandleSlider
  { name: "ExtendedMultiHandleSlider",
    releaseUrl: "%/extended/multihandleslider/multihandlesliderbehavior.js",
    debugUrl: "%/extended/multihandleslider/multihandlesliderbehavior.debug.js",
    behaviors: [{name: "multiHandleSlider", typeName: "Sys.Extended.UI.MultiHandleSliderBehavior" }],
    executionDependencies: ["ExtendedBase", "ExtendedDragDrop", "ExtendedAnimations"] },
  
  // MutuallyExclusiveCheckbox
  { name: "ExtendedMutuallyExclusiveCheckBox",
    releaseUrl: "%/extended/mutuallyexclusivecheckbox/mutuallyexclusivecheckboxbehavior.js",
    debugUrl: "%/extended/mutuallyexclusivecheckbox/mutuallyexclusivecheckboxbehavior.debug.js",
    behaviors: [{name: "mutuallyExclusiveCheckBox", typeName: "Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior", parameters: ["Key"] }],
    executionDependencies: ["ExtendedBase", "ExtendedCommon"] },

  // NumericUpDown
  { name: "ExtendedUpDown",
    releaseUrl: "%/extended/numericupdown/numericupdownbehavior.js",
    debugUrl: "%/extended/numericupdown/numericupdownbehavior.debug.js",
    behaviors: [{name: "upDown", typeName: "Sys.Extended.UI.NumericUpDownBehavior", parameters: ["Minimum", "Maximum", "Width"] }],
    executionDependencies: ["ExtendedBase", "ExtendedCommon", "WebServices"] },
    
  // PagingBulletedList
  { name: "ExtendedPagedList",
    releaseUrl: "%/extended/pagingbulletedlist/pagingbulletedlistbehavior.js",
    debugUrl: "%/extended/pagingbulletedlist/pagingbulletedlistbehavior.debug.js",
    behaviors: [{name: "pagedList", typeName: "Sys.Extended.UI.PagingBulletedListBehavior" }],
    executionDependencies: ["ExtendedBase"] },
    
  // PasswordStrength
  { name: "ExtendedPasswordStrength",
    releaseUrl: "%/extended/passwordstrength/passwordstrengthextenderbehavior.js",
    debugUrl: "%/extended/passwordstrength/passwordstrengthextenderbehavior.debug.js",
    behaviors: [{name: "passwordStrength", typeName: "Sys.Extended.UI.PasswordStrengthExtenderBehavior" }],
    executionDependencies: ["ExtendedBase", "ExtendedCommon"] },
    
  // popupcontrol
  { name: "ExtendedPopupBehavior",
    releaseUrl: "%/extended/popupcontrol/popupcontrolbehavior.js",
    debugUrl: "%/extended/popupcontrol/popupcontrolbehavior.js",
    behaviors: [{name: "popupBehavior", typeName: "Sys.Extended.UI.PopupControlBehavior"}],
    executionDependencies: ["ExtendedDynamicPopulate", "ExtendedPopup", "ExtendedAnimationBehavior"] },

  // popupextender
  { name: "ExtendedPopup",
    releaseUrl: "%/extended/popupextender/popupbehavior.js",
    debugUrl: "%/extended/popupextender/popupbehavior.debug.js",
    behaviors: [{name: "popup", typeName: "Sys.Extended.UI.PopupBehavior"}],
    executionDependencies: ["ExtendedAnimations", "ExtendedBase"] },
    
  // rating
  { name: "ExtendedRating",
    releaseUrl: "%/extended/rating/ratingbehavior.js",
    debugUrl: "%/extended/rating/ratingbehavior.debug.js",
    behaviors: [{name: "rating", typeName: "Sys.Extended.UI.RatingBehavior"}],
    executionDependencies: ["ExtendedBase"] } ,   

  // resizablecontrol
  { name: "ExtendedResizable",
    releaseUrl: "%/extended/resizablecontrol/resizablecontrolbehavior.js",
    debugUrl: "%/extended/resizablecontrol/resizablecontrolbehavior.debug.js",
    behaviors: [{name: "resizable", typeName: "Sys.Extended.UI.ResizableControlBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon"] },

  // roundedcorners
  { name: "ExtendedRoundedCorners",
    releaseUrl: "%/extended/roundedcorners/roundedcornersbehavior.js",
    debugUrl: "%/extended/roundedcorners/roundedcornersbehavior.debug.js",
    behaviors: [{name: "rounded", typeName: "Sys.Extended.UI.RoundedCornersBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon"] },

  // slider
  { name: "ExtendedSlider",
    releaseUrl: "%/extended/slider/sliderbehavior.js",
    debugUrl: "%/extended/slider/sliderbehavior.debug.js",
    behaviors: [{name: "slider", typeName: "Sys.Extended.UI.SliderBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedDragDrop", "ExtendedAnimations"] },

  // slideshow
  { name: "ExtendedSlideShow",
    releaseUrl: "%/extended/slideshow/slideshowbehavior.js",
    debugUrl: "%/extended/slideshow/slideshowbehavior.debug.js",
    behaviors: [{name: "slideShow", typeName: "Sys.Extended.UI.SlideShowBehavior"}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon", "ExtendedTimer", "Network"] },

  // tabs
  { name: "ExtendedTabs",
    releaseUrl: "%/extended/tabs/tabs.js",
    debugUrl: "%/extended/tabs/tabs.debug.js",
    behaviors: [
        {name: "tabContainer", typeName: "Sys.Extended.UI.TabContainer", parameters: [{ name: "activeTabIndex", type: "Number" }] },
        {name: "tabPanel", typeName: "Sys.Extended.UI.TabPanel", parameters: [{ name: "owner", type: "Sys.Extended.UI.TabContainer" }, { name: "headerTab", type: "String" }] }],
    executionDependencies: ["ExtendedDynamicPopulate"] },

  // textboxwatermark
  { name: "ExtendedWatermark",
    releaseUrl: "%/extended/textboxwatermark/textboxwatermark.js",
    debugUrl: "%/extended/textboxwatermark/textboxwatermark.debug.js",
    behaviors: [{name: "watermark", typeName: "Sys.Extended.UI.TextBoxWatermarkBehavior", parameters: [{name:"WatermarkText",type:"String"}, {name:"WatermarkCssClass",type:"String"}]}],
    executionDependencies: ["ExtendedBase", "ExtendedCommon"] },

  // togglebutton
  { name: "ExtendedToggleButton",
    releaseUrl: "%/extended/togglebutton/togglebutton.js",
    debugUrl: "%/extended/togglebutton/togglebutton.debug.js",
    behaviors: [{name: "toggleButton", typeName: "Sys.Extended.UI.ToggleButtonBehavior"}],
    executionDependencies: ["ExtendedBase"] }
]
);