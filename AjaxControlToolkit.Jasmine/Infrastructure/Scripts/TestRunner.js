(function($, suites) {

    $(function() {
        var testReporter = new TestReporter(),
            userAgent = new UserAgent(),
            suiteList = new SuiteList(testReporter);

        userAgent.show();
        suiteList.render();
    });

    var TestReporter = function() {
        var CONTROL_CONTAINER_CLASS_NAME = "control-container";

        var getStackTraceElement = function(result) {
            var $stackTraceElement,
                $stackTraceHeader,
                $stackTraceText;

            $stackTraceElement = $("<div />", {
                class: "stack-trace"
            });

            for(var i = 0; i < result.failedExpectations.length; i += 1) {
                $stackTraceHeader = $("<div />", {
                    text: result.failedExpectations[i].message,
                    class: "header"
                });

                $stackTraceText = $("<div />", {
                    text: result.failedExpectations[i].stack,
                    class: "text"
                });

                $stackTraceElement.append($stackTraceHeader).append($stackTraceText);
            }

            return $stackTraceElement;
        };

        var getSpecElement = function(result) {
            var isSuccess = result.failedExpectations.length === 0,
                description = result.description.replace(/-/g, " ");

            var $element,
                $suiteBadge,
                $countBadge;

            $element = $("<div />", {
                class: isSuccess ? "test-result-success" : "test-result-failure"
            });

            var descriptionParts = result.fullName.split(" ");
            descriptionParts = descriptionParts.slice(0, descriptionParts.length - 1);

            $suiteBadge = $("<span />", {
                text: descriptionParts.join("/"),
                class: "suite-name-badge"
            });

            $testName = $("<span />", {
                text: description,
                class: "test-name"
            });

            $countBadge = $("<span />", {
                text: result.passedExpectations.length + "/" + result.failedExpectations.length,
                class: "count-badge"
            })

            $element
                .prepend($suiteBadge)
                .append($testName)
                .append($countBadge);

            if(!isSuccess)
                $element.append(getStackTraceElement(result));

            return $element;
        };

        var $testResultContainer = $(".test-result-container");

        var suitesToRun = [];

        var $suiteCounter = $(".suite-counter"),
            $suiteCounterTotal = $suiteCounter.find(".total"),
            $suiteCounterCurrent = $suiteCounter.find(".current"),
            $suiteCounterTotalExecutionTime = $suiteCounter.find(".total-execution-time");

        var $specCounter = $(".spec-counter"),
            $specCounterTotal = $specCounter.find(".total"),
            $specCounterCurrent = $specCounter.find(".current"),

            $specCounterLoader = $specCounter.find(".loader"),

            $specCounterDone = $specCounter.find(".done"),
            $specCounterDoneFailed = $specCounterDone.find(".failed-count"),
            $specCounterDoneSuccess = $specCounterDone.find(".success-count");

        var currentSuiteIndex = 0,
            currentSpecIndex = 0,
            totalSpecIndex = 1,
            totalFailureSpecs = 0,
            totalSuccessSpecs = 0;

        var progressBar;

        var startExecutionTime = new Date().getTime();

        var that = this;

        var reset = function() {
            $testResultContainer.empty();

            $specCounterTotal.text("");
            $specCounterCurrent.text("");

            $suiteCounterTotal.text("");
            $suiteCounterCurrent.text("");

            $suiteCounterTotalExecutionTime.text("Total execution time: ");

            $specCounterDone.hide().removeClass("success failure");
            $specCounterDoneSuccess.text("");
            $specCounterDoneFailed.text("");

            currentSuiteIndex = 0;
            currentSpecIndex = 0;
            totalSpecIndex = 1;
            totalSuccessSpecs = 0;
            totalFailureSpecs = 0;

            startExecutionTime = new Date().getTime();
        };

        var insertExecutionTimeLabel = function(startExecutionTime) {
            var endExecutionTime = new Date().getTime(),
                totalExecutionTime = (endExecutionTime - startExecutionTime) / 1000;

            $suiteCounterTotalExecutionTime.text("Total execution time: " + totalExecutionTime + " s");
        };

        var getTotalSpecCount = function() {
            var totalSpecCount = 0;
            for(var i = 0; i < suitesToRun.length; i += 1)
                totalSpecCount += suitesToRun[i].specCount;

            return totalSpecCount;
        };

        var finishTests = function() {
            insertExecutionTimeLabel(startExecutionTime);

            $specCounterLoader.hide();

            $specCounterDone
                .show()
                .addClass(totalFailureSpecs > 0 ? "failure" : "success");;

            $specCounterDoneSuccess.text(totalSuccessSpecs);
            $specCounterDoneFailed.text(totalFailureSpecs);
        };

        var runNextSuite = function() {
            if(currentSuiteIndex === suitesToRun.length) {
                finishTests();                
                return;
            }

            $testResultContainer.append($("<br>"));

            $suiteCounterCurrent.text(currentSuiteIndex + 1);

            runNextSpec(true);
        };

        var runNextSpec = function(isNextSuite) {
            currentSpecIndex += 1;

            if(isNextSuite)
                currentSpecIndex = 0;

            $(CONTROL_CONTAINER_CLASS_NAME.toClassSelector()).attr("src", "Suites/" + suitesToRun[currentSuiteIndex].path + "?specIndex=" + currentSpecIndex);
        };

        var isSuiteDone = function() {
            return currentSpecIndex === suitesToRun[currentSuiteIndex].specCount - 1;
        };

        this.runTests = function(selectedSuites) {
            reset();

            $specCounterLoader.show();

            suitesToRun = suites.filter(function(suite) {
                return $.inArray(suite.path, selectedSuites) >= 0;
            });

            var totalSpecCount = getTotalSpecCount();

            $specCounterTotal.text(totalSpecCount);
            $suiteCounterTotal.text(suitesToRun.length);

            progressBar = new ProgressBar(totalSpecCount);

            runNextSuite();
        };

        window.TestRunner.Reporter = {
            specDone: function(result) {
                if(result.status === "disabled")
                    return;

                $specCounterCurrent.text(totalSpecIndex++);

                var $specElement = getSpecElement(result);
                $testResultContainer.append($specElement);

                progressBar.increment();

                if(result.failedExpectations.length > 0) {
                    $specElement.prependTo($testResultContainer);
                    totalFailureSpecs++;
                } else {
                    totalSuccessSpecs++;
                }

                if(isSuiteDone()) {
                    currentSuiteIndex += 1;
                    runNextSuite();
                } else {
                    runNextSpec();
                }
            },
        };
    };

    var UserAgent = function() {
        var ELEMENT_CLASS_NAME = "useragent-info";

        this.toString = function() {
            return navigator.userAgent;
        }

        this.show = function(container) {
            var $container = container ? $(container) : $(ELEMENT_CLASS_NAME.toClassSelector())

            $container.append(this.toString());
        }
    };

    var SuiteList = function(testReporter) {
        var SUITE_LIST_CLASS_NAME = "suite-list",
            RUN_BUTTON_CLASS_NAME = "run-button",
            SELECT_ALL_CLASS_NAME = "select-all",
            CHECK_BOX_ID = "SelectAllCheckbox";

        var that = this;

        var onRunButtonClick = function() {
            var selectedSuites = that.$element.find("input[type=checkbox][data-main]:checked").map(function() {
                return $(this).attr("data-main");
            });

            testReporter.runTests(selectedSuites);
        }

        var renderRunButton = function() {
            var $runButton = $("<input />", {
                type: "button",
                value: "Run tests",
                class: RUN_BUTTON_CLASS_NAME
            });

            $runButton.click(onRunButtonClick);

            that.$element.append($runButton);
        };

        var onSelectAllCheckboxChange = function() {
            $(this).prop("checked", !$(this).prop("checked"));
        };

        var onSelectAllContainerClick = function(e) {
            var $checkbox =  $(this).children("input[type=checkbox]");
            $checkbox.prop("checked", !$checkbox.prop("checked"));

            that.$element.find("input[type=checkbox]").prop("checked", $checkbox.prop("checked"));

            if(e.target.id !== CHECK_BOX_ID)
                return false;
        };

        var renderSelectAllCheckbox = function() {
            var $container = $("<div />", {
                class: SELECT_ALL_CLASS_NAME
            });

            var $selectAllCheckbox = $("<input>", {
                type: "checkbox",
                id: CHECK_BOX_ID
            });

            var $label = $("<label />", {
                for: CHECK_BOX_ID,
                text: "SELECT ALL"
            });

            $container.click(onSelectAllContainerClick);
            $selectAllCheckbox.change(onSelectAllCheckboxChange);

            $container
                .append($selectAllCheckbox)
                .append($label);

            that.$element.append($container);
        };

        var onSuiteLinkClick = function() {
            that.$element.find("input[type=checkbox]").prop("checked", false);

            var $checkbox = $(this).prev();
            $checkbox.prop("checked", true);

            testReporter.runTests([$checkbox.attr("data-main")]);

            return false;
        }

        this.$element = $(SUITE_LIST_CLASS_NAME.toClassSelector());

        this.render = function() {
            renderRunButton();
            renderSelectAllCheckbox();

            for(var i = 0; i < suites.length; i += 1) {
                var listItem = new SuiteListItem(suites[i].path);

                this.$element.append(listItem.getElement());
            }

            this.$element.find("a[class=link]").click(onSuiteLinkClick);
        }
    };

    var SuiteListItem = function(suitePath) {
        var SUITE_ITEM_CLASS_NAME = "suite-item",
            CHECKBOX_CLASS_NAME = "checkbox",
            LINK_CLASS_NAME = "link",

            PAGE_EXTENSION = "aspx",
            PAGE_POSTFIX = "Tests";

        var getSuiteName = function(suiteName) {
            var regExp = new RegExp("(.*)" + PAGE_POSTFIX + "\\." + PAGE_EXTENSION, "g");
            var matches = regExp.exec(suiteName);

            return matches[1];
        };

        var onContainerClick = function() {
            var $checkbox =  $(this).children(CHECKBOX_CLASS_NAME.toClassSelector());
            
            $checkbox.prop("checked", !$checkbox.prop("checked"));
        };

        var onCheckboxChange = function() {
            $(this).prop("checked", !$(this).prop("checked"));
        };

        var pathParts = suitePath.split("\\");

        // Assume that there is only two parts (2-level nesting)
        this.suiteName = getSuiteName(pathParts[pathParts.length - 1]);
        this.suiteGroupName = pathParts[pathParts.length - 2];

        this.getElement = function() {
            var $container,
                $checkbox,
                $link;

            $container = $("<div />", {
                class: SUITE_ITEM_CLASS_NAME
            });

            $checkbox = $("<input />", {
                type: "checkbox",
                class: CHECKBOX_CLASS_NAME,
                "data-main": suitePath
            });

            $link = $("<a />", {
                href: "",
                text: this.suiteName,
                class: LINK_CLASS_NAME
            });

            $container.click(onContainerClick);
            $checkbox.change(onCheckboxChange);

            return $container.append($checkbox).append($link);
        };
    };

    var ProgressBar = function(testCount) {
        var ELEMENT_CLASS_NAME = "run-progress";

        var $element = $(ELEMENT_CLASS_NAME.toClassSelector()),
            $container = $element.parent(),
            step = 100 / testCount;

        $element.width(0);

        this.increment = function() {
            $element.animate({
                width: "+=" + step + "%"
            }, 50, function() {
                var delta = $container.width() - $element.width();
                if(delta < step * $container.width() / 100)
                    $element.width($container.width());
            });
        }
    };

}(jQuery, window.TestRunner.Suites));