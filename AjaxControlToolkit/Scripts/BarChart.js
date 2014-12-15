Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.BarChart = function(element) {
    Sys.Extended.UI.BarChart.initializeBase(this, [element]);
    var id = this.get_id();
    id = id.replace("_ctl00", "");
    this._parentDiv = document.getElementById(id + "__ParentDiv");

    this._chartWidth = '300';
    this._chartHeight = '200';
    this._chartTitle = '';
    this._categoriesAxis = '';
    this._series = null;
    this._chartType = Sys.Extended.UI.BarChartType.Column;
    this._theme = 'BarChart';
    this._valueAxisLines = 9;
    this._chartTitleColor = '';
    this._valueAxisLineColor = '';
    this._categoryAxisLineColor = '';
    this._baseLineColor = '';

    // variables
    this.yMax = 0;
    this.yMin = 0;
    this.xMax = 0;
    this.xMin = 0;
    this.roundedTickRange = 0;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.xInterval = 0;
    this.yInterval = 0;
    this.arrXAxis;
    this.arrXAxisLength = 0;
    this.arrYAxis;
    this.arrYAxisLength = 0;
    this.charLength = 3.5;
    this.arrCombinedData = null;
}

Sys.Extended.UI.BarChart.prototype = {

    initialize: function() {
        Sys.Extended.UI.BarChart.callBaseMethod(this, "initialize");

        if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) {
            throw 'Browser does not support SVG.';
        }

        if(this._valueAxisLines == 0) {
            this._valueAxisLines = 9;
        }

        if(this._chartType == Sys.Extended.UI.BarChartType.Column || this._chartType == Sys.Extended.UI.BarChartType.StackedColumn)
            this.generateColumnChart();
        else if(this._chartType == Sys.Extended.UI.BarChartType.Bar || this._chartType == Sys.Extended.UI.BarChartType.StackedBar)
            this.generateBarChart();
    },

    dispose: function() {
        Sys.Extended.UI.BarChart.callBaseMethod(this, "dispose");
    },

    generateColumnChart: function() {
        this.arrXAxis = this._categoriesAxis.split(',');
        this.arrXAxisLength = this.arrXAxis.length;

        this.calculateMinMaxValuesForColumnType();
        this.calculateIntervalForColumnType();
        this.calculateValueAxisForColumnType();

        var svgContents = this.initializeSVG();

        svgContents = svgContents + String.format('<text x="{0}" y="{1}" id="ChartTitle" style="fill:{3}">{2}</text>', parseInt(this._chartWidth) / 2 - (this._chartTitle.length * this.charLength), parseInt(this._chartHeight) * 5 / 100, this._chartTitle, this._chartTitleColor);

        svgContents = svgContents + this.drawBackgroundHorizontalLinesForColumnType();
        svgContents = svgContents + this.drawBackgroundVerticalLinesForColumnType();
        svgContents = svgContents + this.drawBaseLinesForColumnType();
        svgContents = svgContents + this.drawLegendArea();
        svgContents = svgContents + this.drawAxisValuesForColumnType();
        svgContents = svgContents + this.drawBarsForColumnType();

        svgContents = svgContents + '</svg>';
        this._parentDiv.innerHTML = svgContents;
    },

    // This calculates distance interval for the value axis.
    calculateIntervalForColumnType: function() {
        this.startX = (this._chartWidth * 10 / 100) + 0.5;
        this.endX = parseInt(this._chartWidth) - 4.5;

        if(this.yMin >= 0)
            this.startY = Math.round(parseInt(this._chartHeight) - (parseInt(this._chartHeight) * 24 / 100)) + 0.5;
        else
            this.startY = Math.round(parseInt(this._chartHeight) - (parseInt(this._chartHeight) * 12 / 100)) / 2 + 0.5;

        this.yInterval = this.startY / (this._valueAxisLines + 1);

    },

    // This calculates minimum and maximum values of the specified data.
    calculateMinMaxValuesForColumnType: function(chartType) {
        // calculate minimum and maximum value
        var seriesMax;
        var seriesMin;
        var arrData;

        if(this._chartType == Sys.Extended.UI.BarChartType.Column) {
            for(var i = 0; i < this._series.length; i++) {
                arrData = this._series[i].Data;
                seriesMax = Math.max.apply(null, arrData);
                seriesMin = Math.min.apply(null, arrData);

                if(i == 0) {
                    this.yMax = seriesMax;
                    this.yMin = seriesMin;
                }
                else {
                    if(seriesMax > this.yMax)
                        this.yMax = seriesMax;
                    if(seriesMin < this.yMin)
                        this.yMin = seriesMin;
                }
            }
        }
        else {
            this.arrCombinedData = null;
            for(var i = 0; i < this._series.length; i++) {
                arrData = new Array();
                for(var j = 0; j < this._series[i].Data.length; j++) {
                    arrData[j] = this._series[i].Data[j];
                }
                if(this.arrCombinedData == null)
                    this.arrCombinedData = arrData;
                else {
                    for(var j = 0; j < arrData.length; j++) {
                        this.arrCombinedData[j] = parseFloat(this.arrCombinedData[j]) + parseFloat(arrData[j]);
                    }
                }
            }

            for(var i = 0; i < this._series.length; i++) {
                seriesMin = Math.min.apply(null, this._series[i].Data);
                if(i == 0) {
                    this.yMin = seriesMin;
                }
                else {

                    if(seriesMin < this.yMin)
                        this.yMin = seriesMin;
                }
            }

            this.yMax = Math.max.apply(null, this.arrCombinedData);
        }

        if(this.yMin < 0) {
            this._valueAxisLines = Math.round(this._valueAxisLines / 2);
        }
    },

    // this calculates label values for Value axis to display on the chart.
    calculateValueAxisForColumnType: function() {
        // calculate value axis labels
        var range;
        var unroundedTickSize;
        var x;
        var pow10x;

        if(this.yMin >= 0) {
            range = this.yMax;
        }
        else {
            range = this.yMax > Math.abs(this.yMin) ? this.yMax : Math.abs(this.yMin);
        }

        unroundedTickSize = range / (this._valueAxisLines - 1);
        if(unroundedTickSize < 1) {
            this.roundedTickRange = unroundedTickSize.toFixed(1);
        }
        else {
            x = Math.ceil((Math.log(unroundedTickSize) / Math.log(10)) - 1);
            pow10x = Math.pow(10, x);
            this.roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;
        }

        this.startX = this.startX + (this.roundedTickRange * 10 * this._valueAxisLines / 10).toString().length * this.charLength;
    },

    // This draws background horizontal lines of the chart.
    drawBackgroundHorizontalLinesForColumnType: function() {
        var horizontalLineContents = '';
        // background grid's horizontal lines
        for(var i = 1; i <= this._valueAxisLines; i++) {
            horizontalLineContents = horizontalLineContents + String.format('<path d="M{0} {2} {1} {2}" id="HorizontalLine" style="stroke:{3}"></path>', this.startX, this.endX, this.startY - (this.yInterval * i), this._categoryAxisLineColor);
        }

        if(this.yMin < 0) {
            // background grid's horizontal lines for negative values
            for(var i = 1; i <= this._valueAxisLines; i++) {
                horizontalLineContents = horizontalLineContents + String.format('<path d="M{0} {2} {1} {2}" id="HorizontalLine" style="stroke:{3}"></path>', this.startX, this.endX, this.startY + (this.yInterval * i), this._categoryAxisLineColor);
            }
        }
        return horizontalLineContents;
    },

    // This draws background vertical lines of the chart.
    drawBackgroundVerticalLinesForColumnType: function() {
        // background grid's vertical lines
        var verticalLineContents = '';
        this.xInterval = Math.round((parseInt(this._chartWidth) - this.startX) / this.arrXAxisLength);

        for(var i = 0; i < this.arrXAxisLength; i++) {
            verticalLineContents = verticalLineContents + String.format('<path id="VerticalLine" d="M{0} {1} {0} {2}" style="stroke:{3}"></path>', ((parseInt(this._chartWidth) - 5) - (this.xInterval * i)), (this.startY - (this.yInterval * this._valueAxisLines)), this.startY, this._valueAxisLineColor);
        }

        if(this.yMin < 0) {
            for(var i = 0; i < this.arrXAxisLength; i++) {
                verticalLineContents = verticalLineContents + String.format('<path id="VerticalLine" d="M{0} {1} {0} {2}" style="stroke:{3}"></path>', ((parseInt(this._chartWidth) - 5) - (this.xInterval * i)), (this.startY + (this.yInterval * this._valueAxisLines)), this.startY, this._valueAxisLineColor);
            }
        }
        return verticalLineContents;
    },

    // This draws base lines of the chart.
    drawBaseLinesForColumnType: function() {
        var baseLineContents = '';

        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {2} {1}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.endX, this._baseLineColor);
        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, (this.startY - (this.yInterval * this._valueAxisLines)), this.startY, this._baseLineColor);
        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.startY + 4, this._baseLineColor);

        for(var i = 0; i < this.arrXAxisLength; i++) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', ((parseInt(this._chartWidth) - 5) - (this.xInterval * i)), this.startY, this.startY + 4, this._baseLineColor);
        }

        for(var i = 0; i <= this._valueAxisLines; i++) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX - 4, this.startX, this.startY - (this.yInterval * i), this._baseLineColor);
        }

        if(this.yMin < 0) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, (this.startY + (this.yInterval * this._valueAxisLines)), this.startY, this._baseLineColor);
            for(var i = 1; i <= this._valueAxisLines; i++) {
                baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX - 4, this.startX, this.startY + (this.yInterval * i), this._baseLineColor);
            }
        }
        return baseLineContents;
    },

    // This writes horizontal and vertical axis values of the chart.
    drawAxisValuesForColumnType: function() {
        var axisContents = '';
        var textLength = 0;
        for(var i = 0; i < this.arrXAxisLength; i++) {
            textLength = this.arrXAxis[i].toString().length * 5.5;
            axisContents = axisContents + String.format('<text id="SeriesAxis" x="{0}" y="{1}" fill-opacity="1">{2}</text>', Math.round(this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 50 / 100) - (textLength)), this.startY + Math.round(this.yInterval * 65 / 100), this.arrXAxis[i]);
        }

        for(var i = 0; i <= this._valueAxisLines; i++) {
            textLength = (this.roundedTickRange * 10 * i / 10).toString().length * 5.5;
            axisContents = axisContents + String.format('<text id="ValueAxis" x="{0}" y="{1}">{2}</text>', this.startX - textLength - 15, this.startY - (this.yInterval * 10 * i / 10) + 3.5, this.roundedTickRange * 10 * i / 10);
        }

        if(this.yMin < 0) {
            for(var i = 1; i <= this._valueAxisLines; i++) {
                textLength = (this.roundedTickRange * 10 * i / 10).toString().length * 5.5;
                axisContents = axisContents + String.format('<text id="ValueAxis" x="{0}" y="{1}">-{2}</text>', this.startX - textLength - 19, this.startY + (this.yInterval * 10 * i / 10), this.roundedTickRange * 10 * i / 10);
            }
        }

        return axisContents;
    },

    drawBarsForColumnType: function() {
        // Bars section
        var barContents = '';

        var numberOfBars = this._series.length;
        var widthBetweenBars = this.xInterval * 10 / 100;
        var barWidth;
        if(this._chartType == Sys.Extended.UI.BarChartType.Column) {
            barWidth = Math.round(((this.xInterval * 80 / 100) - (widthBetweenBars * numberOfBars)) / numberOfBars);
        }
        else {
            barWidth = Math.round(this.xInterval * 80 / 100);
        }

        var barColor = '';
        for(var i = 0; i < this.arrXAxisLength; i++) {
            barContents = barContents + '<g>';
            if(this._chartType == Sys.Extended.UI.BarChartType.Column) {
                for(var j = 0; j < this._series.length; j++) {
                    this.yVal = parseFloat(this._series[j].Data[i]);
                    if(i == 0) {
                        barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', this.startX + (this.xInterval * i) + (this.xInterval * 15 / 100) + ((widthBetweenBars + barWidth) * j), this.startX + (this.xInterval * i) + (this.xInterval * 15 / 100) + ((widthBetweenBars + barWidth) * j) + barWidth, this.startY, this.startY - Math.round(this.yVal * (this.yInterval / this.roundedTickRange)), j + 1, this._series[j].BarColor);
                    }
                    else {
                        barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', this.startX + (this.xInterval * i) + (this.xInterval * 12.5 / 100) + ((widthBetweenBars + barWidth) * j), this.startX + (this.xInterval * i) + (this.xInterval * 12.5 / 100) + ((widthBetweenBars + barWidth) * j) + barWidth, this.startY, this.startY - Math.round(this.yVal * (this.yInterval / this.roundedTickRange)), j + 1, this._series[j].BarColor);
                    }
                    if(this.yVal > 0)
                        barContents = barContents + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', this.startX + (this.xInterval * i) + (this.xInterval * 20 / 100) + ((widthBetweenBars + barWidth) * j) + (barWidth * 10 / 100) - Math.round((this.yVal.toString().length * this.charLength) / 2), this.startY - Math.round(this.yVal * (this.yInterval / this.roundedTickRange)) - 7.5, this.yVal);
                    else
                        barContents = barContents + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', this.startX + (this.xInterval * i) + (this.xInterval * 20 / 100) + ((widthBetweenBars + barWidth) * j) + (barWidth * 10 / 100) - Math.round((this.yVal.toString().length * this.charLength) / 2), this.startY - Math.round(this.yVal * (this.yInterval / this.roundedTickRange)) + 7.5, this.yVal);
                }
            }
            else {
                var lastStartYPositive = this.startY;
                var lastStartYNegative = this.startY;
                for(var j = 0; j < this._series.length; j++) {
                    this.yVal = parseFloat(this._series[j].Data[i]);
                    if(i == 0) {
                        if(this.yVal > 0)
                            barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 7.5 / 100), this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 7.5 / 100) + barWidth, lastStartYPositive, lastStartYPositive - Math.round(this.yVal * (this.yInterval / this.roundedTickRange)), j + 1, this._series[j].BarColor);
                        else
                            barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 7.5 / 100), this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 7.5 / 100) + barWidth, lastStartYNegative, lastStartYNegative - Math.round(this.yVal * (this.yInterval / this.roundedTickRange)), j + 1, this._series[j].BarColor);
                    }
                    else {
                        if(this.yVal > 0)
                            barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 5 / 100), this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 5 / 100) + barWidth, lastStartYPositive, lastStartYPositive - Math.round(this.yVal * (this.yInterval / this.roundedTickRange)), j + 1, this._series[j].BarColor);
                        else
                            barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 5 / 100), this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 5 / 100) + barWidth, lastStartYNegative, lastStartYNegative - Math.round(this.yVal * (this.yInterval / this.roundedTickRange)), j + 1, this._series[j].BarColor);
                    }

                    if(this.yVal > 0) {
                        barContents = barContents + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 30 / 100) + (barWidth * 10 / 100), lastStartYPositive - Math.round((this.yVal * (this.yInterval / this.roundedTickRange)) / 2), this.yVal);
                        lastStartYPositive = lastStartYPositive - Math.round(this.yVal * (this.yInterval / this.roundedTickRange));
                    }
                    else {
                        barContents = barContents + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', this.startX + (this.xInterval * 10 * i / 10) + (this.xInterval * 30 / 100) + (barWidth * 10 / 100), lastStartYNegative + Math.round((Math.abs(this.yVal) * (this.yInterval / this.roundedTickRange)) / 2), this.yVal);
                        lastStartYNegative = lastStartYNegative - Math.round(this.yVal * (this.yInterval / this.roundedTickRange));
                    }
                }
            }
            barContents = barContents + '</g>';
        }

        return barContents;
    },

    // This creates svg and its initial contents.
    initializeSVG: function() {
        var svgContents = String.format('<?xml-stylesheet type="text/css" href="{0}.css"?>', this._theme);
        svgContents = svgContents + String.format('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="{0}" height="{1}" style="position: relative; display: block;">', this._chartWidth, this._chartHeight);
        svgContents = svgContents + '<defs>';
        svgContents = svgContents + '<linearGradient gradientTransform="rotate(0)">';
        svgContents = svgContents + '<stop offset="0%" id="LinearGradient1"></stop>';
        svgContents = svgContents + '<stop offset="25%" id="LinearGradient2"></stop>';
        svgContents = svgContents + '<stop offset="100%" id="LinearGradient3"></stop></linearGradient>';
        svgContents = svgContents + '</defs>';

        svgContents = svgContents + String.format('<path fill="none" stroke-opacity="1" fill-opacity="1" stroke-linejoin="round" stroke-linecap="square" d="M5 {0} {1} {0} {1} {2} 5 {2} z"/>', parseInt(this._chartHeight) * 1 / 10 + 5, parseInt(this._chartWidth) - 5, parseInt(this._chartHeight) - parseInt(this._chartHeight) * 1 / 10);
        svgContents = svgContents + String.format('<path id="ChartBackGround" stroke="" d="M0 0 {0} 0 {0} {1} 0 {1} z"/>', this._chartWidth, this._chartHeight);
        svgContents = svgContents + String.format('<path fill="#ffffff" stroke-opacity="1" fill-opacity="0" stroke-linejoin="round" stroke-linecap="square" stroke="" d="M5 {0} {1} {0} {1} {2} 5 {2} z" />', parseInt(this._chartHeight) * 1 / 10 + 5, parseInt(this._chartWidth) - 5, parseInt(this._chartHeight) - parseInt(this._chartHeight) * 1 / 10);

        return svgContents;
    },

    // This draws legends of the chart.
    drawLegendArea: function() {
        var legendContents = '';
        // Legend Area
        var legendAreaStartHeight = (parseInt(this._chartHeight) * 84 / 100) + 5;
        var legendBoxWidth = 7.5;
        var legendBoxHeight = 7.5;
        var spaceInLegendContents = 5;

        // Get length of text to display in legend
        var legendCharLength = 0;
        for(var i = 0; i < this._series.length; i++) {
            legendCharLength = legendCharLength + this._series[i].Name.length;
        }

        var legendAreaWidth = Math.round((legendCharLength * 5) / 2) + Math.round((legendBoxWidth + (spaceInLegendContents * 2)) * this._series.length);
        var isLegendNextLine = false;
        if(legendAreaWidth > parseInt(this._chartWidth) / 2) {
            legendAreaWidth = legendAreaWidth / 2;
            isLegendNextLine = true;
        }

        legendContents = legendContents + '<g>';
        legendContents = legendContents + String.format('<path d="M{0} {1} {2} {1} {2} {3} {0} {3} z" id="LegendArea" stroke=""></path>', Math.round(parseInt(this._chartWidth) / 2 - legendAreaWidth / 2), legendAreaStartHeight, Math.round(parseInt(this._chartWidth) / 2 + legendAreaWidth / 2), Math.round(parseInt(this._chartHeight) * 97.5 / 100));

        var startText = parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2) + legendBoxWidth + spaceInLegendContents;
        var nextStartText = startText;
        var startLegend = parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2);
        var nextStartLegend = startLegend;

        for(var i = 0; i < this._series.length; i++) {
            if(isLegendNextLine && i == Math.round(this._series.length / 2)) {
                startText = parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2) + legendBoxWidth + spaceInLegendContents;
                nextStartText = startText;
                startLegend = parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2);
                nextStartLegend = startLegend;
                legendAreaStartHeight = (parseInt(this._chartHeight) * 91 / 100) + 5;
                isLegendNextLine = false;
            }
            startLegend = nextStartLegend;
            startText = nextStartText;
            legendContents = legendContents + String.format('<path d="M{0} {1} {2} {1} {2} {3} {0} {3} z" id="Legend{4}" style="fill:{5}"></path>', startLegend, legendAreaStartHeight + legendBoxHeight, startLegend + legendBoxWidth, legendAreaStartHeight + 15, i + 1, this._series[i].BarColor);
            legendContents = legendContents + String.format('<text x="{0}" y="{1}" id="LegendText">{2}</text>', startText, legendAreaStartHeight + 15, this._series[i].Name);
            if(this._series[i].Name.length > 10) {
                nextStartLegend = startLegend + (this._series[i].Name.length * 5) + legendBoxWidth + (spaceInLegendContents * 2);
                nextStartText = startText + (this._series[i].Name.length * 5) + legendBoxWidth + (spaceInLegendContents * 2);
            }
            else {
                nextStartLegend = nextStartLegend + (this._series[i].Name.length * 6) + legendBoxWidth + (spaceInLegendContents * 2);
                nextStartText = nextStartText + (this._series[i].Name.length * 6) + legendBoxWidth + (spaceInLegendContents * 2);
            }
        }
        legendContents = legendContents + '</g>';
        return legendContents;
    },

    // This generates charts of Bar type.
    generateBarChart: function() {
        this.arrYAxis = this._categoriesAxis.split(',');
        this.arrYAxisLength = this.arrYAxis.length;

        this.calculateMinMaxValuesForBarType();
        this.calculateIntervalForBarType();
        this.calculateValueAxisForBarType();

        var svgContents = this.initializeSVG();

        svgContents = svgContents + String.format('<text x="{0}" y="{1}" id="ChartTitle" style="fill:{3}">{2}</text>', parseInt(this._chartWidth) / 2 - (this._chartTitle.length * this.charLength), parseInt(this._chartHeight) * 5 / 100, this._chartTitle, this._chartTitleColor);
        svgContents = svgContents + this.drawBackgroundHorizontalLinesForBarType();
        svgContents = svgContents + this.drawBackgroundVerticalLinesForBarType();
        svgContents = svgContents + this.drawBaseLinesForBarType();
        svgContents = svgContents + this.drawLegendArea();
        svgContents = svgContents + this.drawAxisValuesForBarType();
        svgContents = svgContents + this.drawBarsForBarType();

        svgContents = svgContents + '</svg>';
        this._parentDiv.innerHTML = svgContents;
    },

    // This calculates distance interval for the value axis.
    calculateIntervalForBarType: function() {
        this.startY = Math.round(parseInt(this._chartHeight) - (parseInt(this._chartHeight) * 20 / 100)) + 0.5;
        this.endY = (parseInt(this._chartHeight) * 8 / 100) + 5;
        this.endX = parseInt(this._chartWidth) - 10 + 0.5;

        if(this.xMin >= 0) {
            this.startX = (this._chartWidth * 15 / 100) + 0.5;
        }
        else {
            this.startX = Math.round(parseInt(this._chartWidth) / 2) + 0.5;
        }

        this.xInterval = Math.round((this.endX - this.startX) / (this._valueAxisLines));
    },

    // This calculates minimum and maximum values of the specified data.
    calculateMinMaxValuesForBarType: function(chartType) {
        // calculate minimum and maximum value
        var seriesMax;
        var seriesMin;
        var arrData;
        if(this._chartType == Sys.Extended.UI.BarChartType.Bar) {
            for(var i = 0; i < this._series.length; i++) {
                arrData = this._series[i].Data;
                seriesMax = Math.max.apply(null, arrData);
                seriesMin = Math.min.apply(null, arrData);
                if(i == 0) {
                    this.xMax = seriesMax;
                    this.xMin = seriesMin;
                }
                else {
                    if(seriesMax > this.xMax)
                        this.xMax = seriesMax;
                    if(seriesMin < this.yMin)
                        this.xMin = seriesMin;
                }
            }
        }
        else {
            this.arrCombinedData = null;
            for(var i = 0; i < this._series.length; i++) {
                arrData = new Array();
                for(var j = 0; j < this._series[i].Data.length; j++) {
                    arrData[j] = this._series[i].Data[j];
                }
                if(this.arrCombinedData == null)
                    this.arrCombinedData = arrData;
                else {
                    for(j = 0; j < arrData.length; j++) {
                        this.arrCombinedData[j] = parseFloat(this.arrCombinedData[j]) + parseFloat(arrData[j]);
                    }
                }
            }

            for(var i = 0; i < this._series.length; i++) {
                seriesMin = Math.min.apply(null, this._series[i].Data);
                if(i == 0) {
                    this.xMin = seriesMin;
                }
                else {
                    if(seriesMin < this.xMin)
                        this.xMin = seriesMin;
                }
            }

            this.xMax = Math.max.apply(null, this.arrCombinedData);
        }

        if(this.xMin < 0) {
            this._valueAxisLines = Math.round(this._valueAxisLines / 2);
        }
    },

    // this calculates label values for Value axis to display on the chart.
    calculateValueAxisForBarType: function() {
        // calculate value axis labels
        var range;
        var unroundedTickSize;
        var x;
        var pow10x;

        if(this.xMin >= 0) {
            range = this.xMax;
        }
        else {
            range = this.xMax > Math.abs(this.xMin) ? this.xMax : Math.abs(this.xMin);
        }

        unroundedTickSize = range / (this._valueAxisLines - 1);
        if(unroundedTickSize < 1) {
            this.roundedTickRange = unroundedTickSize.toFixed(1);
        }
        else {
            x = Math.ceil((Math.log(unroundedTickSize) / Math.log(10)) - 1);
            pow10x = Math.pow(10, x);
            this.roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;
        }
    },

    // This draws background Vertical lines of the chart.
    drawBackgroundVerticalLinesForBarType: function() {
        // background grid's vertical lines
        var verticalLineContents = '';
        for(var i = 1; i <= this._valueAxisLines; i++) {
            verticalLineContents = verticalLineContents + String.format('<path id="VerticalLine" d="M{0} {1} {0} {2}" style="stroke:{3}"></path>', this.startX + (this.xInterval * i), this.startY, this.startY - (this.yInterval * this.arrYAxisLength), this._categoryAxisLineColor);
        }

        if(this.xMin < 0) {
            // background grid's vertical lines for negative values
            for(var i = 1; i <= this._valueAxisLines; i++) {
                verticalLineContents = verticalLineContents + String.format('<path id="VerticalLine" d="M{0} {1} {0} {2}" style="stroke:{3}"></path>', this.startX - (this.xInterval * i), this.startY, this.startY - (this.yInterval * this.arrYAxisLength), this._categoryAxisLineColor);
            }
        }
        return verticalLineContents;
    },

    // This draws background Horizontal lines of the chart.
    drawBackgroundHorizontalLinesForBarType: function() {
        // background grid's horizontal lines
        var horizontalLineContents = '';
        this.yInterval = Math.round((this.startY - this.endY) / this.arrYAxisLength);
        for(var i = 0; i <= this.arrYAxisLength; i++) {
            horizontalLineContents = horizontalLineContents + String.format('<path id="HorizontalLine" d="M{0} {2} {1} {2}" style="stroke:{3}"></path>', this.startX, this.startX + (this.xInterval * this._valueAxisLines), (this.startY - (this.yInterval * i)), this._valueAxisLineColor);
        }

        if(this.xMin < 0) {
            for(var i = 0; i <= this.arrYAxisLength; i++) {
                horizontalLineContents = horizontalLineContents + String.format('<path id="HorizontalLine" d="M{0} {2} {1} {2}" style="stroke:{3}"></path>', this.startX, this.startX - (this.xInterval * this._valueAxisLines), (this.startY - (this.yInterval * i)), this._valueAxisLineColor);
            }
        }

        return horizontalLineContents;
    },

    // This draws base lines of the chart.
    drawBaseLinesForBarType: function() {
        var baseLineContents = '';

        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.endY, this._baseLineColor);
        baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startX - 4, this.startY, this._baseLineColor);
        baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.endX, this.startY, this._baseLineColor);

        for(var i = 0; i < this.arrYAxisLength; i++) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startX - 4, this.startY - (this.yInterval * i), this._baseLineColor);
        }

        for(var i = 0; i <= this._valueAxisLines; i++) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX + (this.xInterval * i), this.startY, this.startY + 4, this._baseLineColor);
        }

        if(this.xMin < 0) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, (this.startX - (this.xInterval * this._valueAxisLines)), this.startY, this._baseLineColor);
            for(var i = 1; i <= this._valueAxisLines; i++) {
                baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX - (this.xInterval * i), this.startY, this.startY + 4, this._baseLineColor);
            }
        }

        return baseLineContents;
    },

    // This writes horizontal and vertical axis values of the chart.
    drawAxisValuesForBarType: function() {
        var axisContents = '';
        var textLength = 0;

        for(var i = 0; i < this.arrYAxisLength; i++) {
            textLength = this.arrYAxis[i].toString().length * 6.5;
            axisContents = axisContents + String.format('<text id="SeriesAxis" x="{0}" y="{1}">{2}</text>', this.startX - (this.xInterval * 15 / 100) - textLength, Math.round(this.startY - (this.yInterval * (i + 1)) + (this.yInterval * 60 / 100)), this.arrYAxis[i]);
        }

        for(var i = 0; i <= this._valueAxisLines; i++) {
            axisContents = axisContents + String.format('<text id="ValueAxis" x="{0}" y="{1}">{2}</text>', this.startX + (this.xInterval * i) - ((this.roundedTickRange * i).toString().length * this.charLength), this.startY + (this.yInterval * 35 / 100), this.roundedTickRange * i);
        }

        if(this.xMin < 0) {
            for(var i = 1; i <= this._valueAxisLines; i++) {
                axisContents = axisContents + String.format('<text id="ValueAxis" x="{0}" y="{1}">-{2}</text>', this.startX - (this.xInterval * i) - ((this.roundedTickRange * i).toString().length * this.charLength), this.startY + (this.yInterval * 35 / 100), this.roundedTickRange * i);
            }
        }

        return axisContents;
    },

    drawBarsForBarType: function() {
        // Bars section
        var barContents = '';
        var numberOfBars = this._series.length;
        var widthBetweenBars = this.yInterval * 10 / 100;
        var barWidth = this._chartType == Sys.Extended.UI.BarChartType.Bar ? Math.round(((this.yInterval * 80 / 100) - (widthBetweenBars * numberOfBars)) / numberOfBars) : Math.round(this.yInterval * 80 / 100);
        for(var i = 0; i < this.arrYAxisLength; i++) {
            barContents = barContents + '<g>';
            if(this._chartType == Sys.Extended.UI.BarChartType.Bar) {
                for(var j = 0; j < this._series.length; j++) {
                    this.xVal = this._series[j].Data[i];
                    if(i == 0) {
                        barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', this.startX, this.startX + Math.round(this.xVal * (this.xInterval / this.roundedTickRange)), this.startY - (this.yInterval * i) - (this.yInterval * 15 / 100) - ((widthBetweenBars + barWidth) * j), this.startY - (this.yInterval * i) - (this.yInterval * 15 / 100) - ((widthBetweenBars + barWidth) * j) - barWidth, j + 1, this._series[j].BarColor);
                    }
                    else {
                        barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', this.startX, this.startX + Math.round(this.xVal * (this.xInterval / this.roundedTickRange)), this.startY - (this.yInterval * i) - (this.yInterval * 12.5 / 100) - ((widthBetweenBars + barWidth) * j), this.startY - (this.yInterval * i) - (this.yInterval * 12.5 / 100) - ((widthBetweenBars + barWidth) * j) - barWidth, j + 1, this._series[j].BarColor);
                    }

                    if(this.xVal > 0)
                        barContents = barContents + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', this.startX + Math.round(this.xVal * (this.xInterval / this.roundedTickRange)) + (this.xVal.toString().length * this.charLength), this.startY - (this.yInterval * i) - (this.yInterval * 20 / 100) - ((widthBetweenBars + barWidth) * j) - (barWidth * 10 / 100), this.xVal);
                    else
                        barContents = barContents + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', this.startX + Math.round(this.xVal * (this.xInterval / this.roundedTickRange)) - ((this.xVal.toString().length + 1) * this.charLength) - 5, this.startY - (this.yInterval * i) - (this.yInterval * 20 / 100) - ((widthBetweenBars + barWidth) * j) - (barWidth * 10 / 100), this.xVal);
                }
            }
            else {
                var lastStartXPositive = this.startX;
                var lastStartXNegative = this.startX;
                for(var j = 0; j < this._series.length; j++) {
                    this.xVal = this._series[j].Data[i];
                    if(i == 0) {
                        if(this.xVal > 0)
                            barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', lastStartXPositive, lastStartXPositive + Math.round(this.xVal * (this.xInterval / this.roundedTickRange)), this.startY - (this.yInterval * i) - (this.yInterval * 10 / 100), this.startY - (this.yInterval * i) - (this.xInterval * 10 / 100) - barWidth, j + 1, this._series[j].BarColor);
                        else
                            barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', lastStartXNegative, lastStartXNegative + Math.round(this.xVal * (this.xInterval / this.roundedTickRange)), this.startY - (this.yInterval * i) - (this.yInterval * 10 / 100), this.startY - (this.yInterval * i) - (this.xInterval * 10 / 100) - barWidth, j + 1, this._series[j].BarColor);
                    }
                    else {
                        if(this.xVal > 0)
                            barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', lastStartXPositive, lastStartXPositive + Math.round(this.xVal * (this.xInterval / this.roundedTickRange)), this.startY - (this.yInterval * i) - (this.yInterval * 7.55 / 100), this.startY - (this.yInterval * i) - (this.xInterval * 7.5 / 100) - barWidth, j + 1, this._series[j].BarColor);
                        else
                            barContents = barContents + String.format('<path id="Bar{4}" style="fill:{5}" d="M{0} {2} {1} {2} {1} {3} {0} {3} z" />', lastStartXNegative, lastStartXNegative + Math.round(this.xVal * (this.xInterval / this.roundedTickRange)), this.startY - (this.yInterval * i) - (this.yInterval * 7.55 / 100), this.startY - (this.yInterval * i) - (this.xInterval * 7.5 / 100) - barWidth, j + 1, this._series[j].BarColor);
                    }

                    if(this.xVal > 0) {
                        barContents = barContents + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', lastStartXPositive + Math.round((this.xVal * (this.xInterval / this.roundedTickRange)) / 2), this.startY - (this.yInterval * i) - (this.yInterval * 30 / 100) - (barWidth * 10 / 100), this.xVal);
                        lastStartXPositive = lastStartXPositive + Math.round(this.xVal * (this.xInterval / this.roundedTickRange));
                    }
                    else {
                        barContents = barContents + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', lastStartXNegative + Math.round((this.xVal * (this.xInterval / this.roundedTickRange)) / 2), this.startY - (this.yInterval * i) - (this.yInterval * 30 / 100) - (barWidth * 10 / 100), this.xVal);
                        lastStartXNegative = lastStartXNegative + Math.round(this.xVal * (this.xInterval / this.roundedTickRange));
                    }
                }
            }
            barContents = barContents + '</g>';
        }

        return barContents;
    },

    get_chartWidth: function() {
        return this._chartWidth;
    },
    set_chartWidth: function(value) {
        this._chartWidth = value;
    },

    get_chartHeight: function() {
        return this._chartHeight;
    },
    set_chartHeight: function(value) {
        this._chartHeight = value;
    },

    get_chartTitle: function() {
        return this._chartTitle;
    },
    set_chartTitle: function(value) {
        this._chartTitle = value;
    },

    get_categoriesAxis: function() {
        return this._categoriesAxis;
    },
    set_categoriesAxis: function(value) {
        this._categoriesAxis = value;
    },

    get_ClientSeries: function() {
        return this._series;
    },
    set_ClientSeries: function(value) {
        this._series = value;
    },

    get_chartType: function() {
        return this._chartType;
    },
    set_chartType: function(value) {
        this._chartType = value;
    },

    get_theme: function() {
        return this._theme;
    },
    set_theme: function(value) {
        this._theme = value;
    },

    get_valueAxisLines: function() {
        return this._valueAxisLines;
    },
    set_valueAxisLines: function(value) {
        this._valueAxisLines = value;
    },

    get_chartTitleColor: function() {
        return this._chartTitleColor;
    },
    set_chartTitleColor: function(value) {
        this._chartTitleColor = value;
    },

    get_valueAxisLineColor: function() {
        return this._valueAxisLineColor;
    },
    set_valueAxisLineColor: function(value) {
        this._valueAxisLineColor = value;
    },

    get_categoryAxisLineColor: function() {
        return this._categoryAxisLineColor;
    },
    set_categoryAxisLineColor: function(value) {
        this._categoryAxisLineColor = value;
    },

    get_baseLineColor: function() {
        return this._baseLineColor;
    },
    set_baseLineColor: function(value) {
        this._baseLineColor = value;
    }
};

Sys.Extended.UI.BarChart.registerClass("Sys.Extended.UI.BarChart", Sys.Extended.UI.ControlBase);

Sys.Extended.UI.BarChartType = function() {    
    throw Error.invalidOperation();
}
Sys.Extended.UI.BarChartType.prototype = {
    Column: 0,
    Bar: 1,
    StackedColumn: 2,
    StackedBar: 3
}

Sys.Extended.UI.BarChartType.registerEnum("Sys.Extended.UI.BarChartType", false);