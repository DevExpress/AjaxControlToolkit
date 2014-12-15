Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.LineChart = function(element) {
    Sys.Extended.UI.LineChart.initializeBase(this, [element]);
    var id = this.get_id();
    id = id.replace("_ctl00", "");
    this._parentDiv = document.getElementById(id + "__ParentDiv");

    this._chartWidth = '300';
    this._chartHeight = '300';
    this._chartTitle = '';
    this._categoriesAxis = '';
    this._series = null;
    this._chartType = Sys.Extended.UI.LineChartType.Basic;
    this._theme = 'LineChart';
    this._valueAxisLines = 9;
    this._chartTitleColor = '';
    this._valueAxisLineColor = '';
    this._categoryAxisLineColor = '';
    this._baseLineColor = '';
    this._tooltipBackgroundColor = '#ffffff';
    this._tooltipFontColor = '#0E426C';
    this._tooltipBorderColor = '#B85B3E';
    this._areaDataLabel = '';

    // variables
    this.yMax = 0;
    this.yMin = 0;
    this.roundedTickRange = 0;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.xInterval = 0;
    this.yInterval = 0;
    this.arrXAxis;
    this.arrXAxisLength = 0;
    this.charLength = 3.5;
    this.arrCombinedData = null;
    this._toolTipDiv;
}

Sys.Extended.UI.LineChart.prototype = {

    initialize: function() {
        Sys.Extended.UI.LineChart.callBaseMethod(this, "initialize");

        if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"))
            throw 'Browser does not support SVG.';

        if(this._valueAxisLines == 0)
            this._valueAxisLines = 9;

        this.generateTooltipDiv();
        this.generateLineChart();
    },

    dispose: function() {
        Sys.Extended.UI.LineChart.callBaseMethod(this, "dispose");
    },

    generateTooltipDiv: function() {
        this._divTooltip = $common.createElementFromTemplate({
            nodeName: 'div',
            properties: {
                id: this.get_id() + '_tooltipDiv',
                style: {
                    position: 'absolute',
                    backgroundColor: this._tooltipBackgroundColor,
                    borderStyle: 'solid',
                    borderWidth: '5px',
                    borderColor: this._tooltipBorderColor,
                    left: '0px',
                    top: '0px',
                    color: this._tooltipFontColor,
                    visibility: 'hidden',
                    zIndex: '10000',
                    padding: '10px'
                }
            }
        }, this._parentDiv);
    },

    generateLineChart: function() {
        this.arrXAxis = this._categoriesAxis.split(',');
        this.arrXAxisLength = this.arrXAxis.length;

        this.calculateMinMaxValues();
        this.calculateInterval();
        this.calculateValueAxis();
        var svgContents = this.initializeSVG();
        svgContents = svgContents + String.format('<text x="{0}" y="{1}" id="ChartTitle" style="fill:{3}">{2}</text>', parseInt(this._chartWidth) / 2 - (this._chartTitle.length * this.charLength), parseInt(this._chartHeight) * 5 / 100, this._chartTitle, this._chartTitleColor);

        svgContents = svgContents + this.drawBackgroundHorizontalLines();
        svgContents = svgContents + this.drawBackgroundVerticalLines();
        svgContents = svgContents + this.drawBaseLines();
        svgContents = svgContents + this.drawLegendArea();
        svgContents = svgContents + this.drawAxisValues();

        this._parentDiv.innerHTML = this._parentDiv.innerHTML + svgContents;
        this.drawLines();
    },

    // This calculates distance interval for the value axis.
    calculateInterval: function() {
        this.startX = (this._chartWidth * 10 / 100) + 0.5;
        this.endX = parseInt(this._chartWidth) - 4.5;

        if(this.yMin >= 0)
            this.startY = Math.round(parseInt(this._chartHeight) - (parseInt(this._chartHeight) * 24 / 100)) + 0.5;
        else
            this.startY = Math.round(parseInt(this._chartHeight) - (parseInt(this._chartHeight) * 12 / 100)) / 2 + 0.5;

        this.yInterval = this.startY / (this._valueAxisLines + 1);
    },

    // This calculates minimum and maximum values of the specified data.
    calculateMinMaxValues: function(chartType) {
        var seriesMax,
            seriesMin,
            arrData;

        if(this._chartType == Sys.Extended.UI.LineChartType.Basic) {
            for(var i = 0; i < this._series.length; i++) {
                arrData = new Array();
                for(var j = 0; j < this._series[i].Data.length; j++)
                    arrData[j] = this._series[i].Data[j];

                seriesMax = Math.max.apply(null, arrData);
                seriesMin = Math.min.apply(null, arrData);

                if(i == 0) {
                    this.yMax = seriesMax;
                    this.yMin = seriesMin;
                } else {
                    if(seriesMax > this.yMax)
                        this.yMax = seriesMax;
                    if(seriesMin < this.yMin)
                        this.yMin = seriesMin;
                }
            }
        } else {
            this.arrCombinedData = null;
            for(var i = 0; i < this._series.length; i++) {
                arrData = new Array();
                for(var j = 0; j < this._series[i].Data.length; j++)
                    arrData[j] = this._series[i].Data[j];

                if(this.arrCombinedData == null)
                    this.arrCombinedData = arrData;
                else {
                    for(j = 0; j < this._series[i].Data.length; j++)
                        this.arrCombinedData[j] = parseFloat(this.arrCombinedData[j]) + parseFloat(arrData[j]);
                }
            }

            for(var i = 0; i < this._series.length; i++) {
                seriesMin = Math.min.apply(null, this._series[i].Data);

                if(i == 0) {
                    this.yMin = seriesMin;
                } else {
                    if(seriesMin < this.yMin)
                        this.yMin = seriesMin;
                }
            }

            this.yMax = Math.max.apply(null, this.arrCombinedData);
        }

        if(this.yMin < 0)
            this._valueAxisLines = Math.round(this._valueAxisLines / 2);
    },

    // this calculates label values for Value axis to display on the chart.
    calculateValueAxis: function() {
        // calculate value axis labels
        var range,
            unroundedTickSize,
            x,
            pow10x;

        if(this.yMin >= 0)
            range = this.yMax;
        else
            range = this.yMax > Math.abs(this.yMin) ? this.yMax : Math.abs(this.yMin);

        unroundedTickSize = range / (this._valueAxisLines - 1);
        if(unroundedTickSize < 1) {
            this.roundedTickRange = unroundedTickSize.toFixed(1);
        } else {
            x = Math.ceil((Math.log(unroundedTickSize) / Math.log(10)) - 1);
            pow10x = Math.pow(10, x);
            this.roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;
        }

        this.startX = this.startX + (this.roundedTickRange * 10 * this._valueAxisLines / 10).toString().length * this.charLength;
    },

    // This draws background horizontal lines of the chart.
    drawBackgroundHorizontalLines: function() {
        var horizontalLineContents = '';

        // background grid's horizontal lines
        for(var i = 1; i <= this._valueAxisLines; i++)
            horizontalLineContents = horizontalLineContents + String.format('<path d="M{0} {2} {1} {2}" id="HorizontalLine" style="stroke:{3}"></path>', this.startX, this.endX, this.startY - (this.yInterval * i), this._categoryAxisLineColor);

        if(this.yMin < 0) {
            // background grid's horizontal lines for negative values
            for(var i = 1; i <= this._valueAxisLines; i++)
                horizontalLineContents = horizontalLineContents + String.format('<path d="M{0} {2} {1} {2}" id="HorizontalLine" style="stroke:{3}"></path>', this.startX, this.endX, this.startY + (this.yInterval * i), this._categoryAxisLineColor);
        }
        return horizontalLineContents;
    },

    // This draws background vertical lines of the chart.
    drawBackgroundVerticalLines: function() {
        // background grid's vertical lines
        var verticalLineContents = '';
        this.xInterval = Math.round((parseInt(this._chartWidth) - this.startX) / this.arrXAxisLength);

        for(var i = 0; i < this.arrXAxisLength; i++)
            verticalLineContents = verticalLineContents + String.format('<path id="VerticalLine" d="M{0} {1} {0} {2}" style="stroke:{3}"></path>', ((parseInt(this._chartWidth) - 5) - (this.xInterval * i)), (this.startY - (this.yInterval * this._valueAxisLines)), this.startY, this._valueAxisLineColor);

        if(this.yMin < 0)
            for(var i = 0; i < this.arrXAxisLength; i++)
                verticalLineContents = verticalLineContents + String.format('<path id="VerticalLine" d="M{0} {1} {0} {2}" style="stroke:{3}"></path>', ((parseInt(this._chartWidth) - 5) - (this.xInterval * i)), (this.startY + (this.yInterval * this._valueAxisLines)), this.startY, this._valueAxisLineColor);

        return verticalLineContents;
    },

    // This draws base lines of the chart.
    drawBaseLines: function() {
        var baseLineContents = '';

        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {2} {1}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.endX, this._baseLineColor);
        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, (this.startY - (this.yInterval * this._valueAxisLines)), this.startY, this._baseLineColor);
        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.startY + 4, this._baseLineColor);

        for(var i = 0; i < this.arrXAxisLength; i++)
            baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', ((parseInt(this._chartWidth) - 5) - (this.xInterval * i)), this.startY, this.startY + 4, this._baseLineColor);

        for(var i = 0; i <= this._valueAxisLines; i++)
            baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX - 4, this.startX, this.startY - (this.yInterval * i), this._baseLineColor);

        if(this.yMin < 0) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, (this.startY + (this.yInterval * this._valueAxisLines)), this.startY, this._baseLineColor);

            for(var i = 1; i <= this._valueAxisLines; i++)
                baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX - 4, this.startX, this.startY + (this.yInterval * i), this._baseLineColor);
        }

        return baseLineContents;
    },

    // This draws legends of the chart.
    drawLegendArea: function() {
        var legendContents = '';
        // Legend Area
        var legendAreaStartHeight = (parseInt(this._chartHeight) * 82 / 100) + 5,
            legendBoxWidth = 7.5,
            legendBoxHeight = 7.5,
            spaceInLegendContents = 5;

        // Get length of text to display in legend
        var legendCharLength = 0;
        for(var i = 0; i < this._series.length; i++)
            legendCharLength = legendCharLength + this._series[i].Name.length;

        var legendAreaWidth = Math.round((legendCharLength * 5) / 2) + Math.round((legendBoxWidth + (spaceInLegendContents * 2)) * this._series.length),
            isLegendNextLine = false;

        if(legendAreaWidth > parseInt(this._chartWidth) / 2) {
            legendAreaWidth = legendAreaWidth / 2;
            isLegendNextLine = true;
        }

        legendContents = legendContents + '<g>';
        legendContents = legendContents + String.format('<path d="M{0} {1} {2} {1} {2} {3} {0} {3} z" id="LegendArea" stroke=""></path>', parseInt(this._chartWidth) * 50 / 100 - (legendAreaWidth / 2), legendAreaStartHeight, Math.round(parseInt(this._chartWidth) * 50 / 100 + (legendCharLength * 5)) + Math.round((legendBoxWidth + (spaceInLegendContents * 2)) * this._series.length), Math.round(parseInt(this._chartHeight) * 97.5 / 100));

        var startText = parseInt(this._chartWidth) * 50 / 100 - (legendAreaWidth / 2) + 5 + legendBoxWidth + spaceInLegendContents,
            nextStartText = startText,
            startLegend = parseInt(this._chartWidth) * 50 / 100 - (legendAreaWidth / 2) + 5,
            nextStartLegend = startLegend;

        for(var i = 0; i < this._series.length; i++) {
            if(isLegendNextLine && i == Math.round(this._series.length / 2)) {
                startText = parseInt(this._chartWidth) * 50 / 100 - (legendAreaWidth / 2) + 5 + legendBoxWidth + spaceInLegendContents;
                nextStartText = startText;
                startLegend = parseInt(this._chartWidth) * 50 / 100 - (legendAreaWidth / 2) + 5;
                nextStartLegend = startLegend;
                legendAreaStartHeight = (parseInt(this._chartHeight) * 89 / 100) + 5;
                isLegendNextLine = false;
            }

            startLegend = nextStartLegend;
            startText = nextStartText;

            legendContents = legendContents + String.format('<path d="M{0} {1} {2} {1} {2} {3} {0} {3} z" id="Legend{4}" style="fill:{5}"></path>', startLegend, legendAreaStartHeight + legendBoxHeight, startLegend + legendBoxWidth, legendAreaStartHeight + 15, i + 1, this._series[i].LineColor);
            legendContents = legendContents + String.format('<text x="{0}" y="{1}" id="LegendText">{2}</text>', startText, legendAreaStartHeight + 15, this._series[i].Name);

            if(this._series[i].Name.length > 10) {
                nextStartLegend = startLegend + (this._series[i].Name.length * 5) + legendBoxWidth + (spaceInLegendContents * 2);
                nextStartText = startText + (this._series[i].Name.length * 5) + legendBoxWidth + (spaceInLegendContents * 2);
            } else {
                nextStartLegend = nextStartLegend + (this._series[i].Name.length * 6) + legendBoxWidth + (spaceInLegendContents * 2);
                nextStartText = nextStartText + (this._series[i].Name.length * 6) + legendBoxWidth + (spaceInLegendContents * 2);
            }
        }
        legendContents = legendContents + '</g>';

        return legendContents;
    },

    // This writes horizontal and vertical axis values of the chart.
    drawAxisValues: function() {
        var axisContents = '',
            textLength = 0;

        for(var i = 0; i < this.arrXAxisLength; i++) {
            textLength = this.arrXAxis[i].toString().length * this.charLength;
            axisContents = axisContents + String.format('<text id="SeriesAxis" x="{0}" y="{1}" fill-opacity="1">{2}</text>', Math.round(this.startX + (this.xInterval * i) + (this.xInterval * 50 / 100) - (textLength)), this.startY + Math.round(this.yInterval * 65 / 100), this.arrXAxis[i]);
        }

        for(var i = 0; i <= this._valueAxisLines; i++)
            axisContents = axisContents + String.format('<text id="ValueAxis" x="{0}" y="{1}">{2}</text>', this.startX - ((this.roundedTickRange * 10 * i / 10).toString().length * 5.5) - 10, this.startY - (this.yInterval * i) + 3.5, this.roundedTickRange * 10 * i / 10);

        if(this.yMin < 0)
            for(var i = 1; i <= this._valueAxisLines; i++)
                axisContents = axisContents + String.format('<text id="ValueAxis" x="{0}" y="{1}">-{2}</text>', this.startX - ((this.roundedTickRange * 10 * i / 10).toString().length * 5.5) - 15, this.startY + (this.yInterval * i), this.roundedTickRange * 10 * i / 10);

        return axisContents;
    },

    // This creates svg and its initial contents.
    initializeSVG: function() {
        var svgContents = String.format('<?xml-stylesheet type="text/css" href="{0}.css"?>', this._theme);

        svgContents = svgContents + String.format('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="{0}" height="{1}" style="position: relative; display: block;">', this._chartWidth, this._chartHeight);
        svgContents = svgContents + '<defs>';
        svgContents = svgContents + '<linearGradient gradientTransform="rotate(0)">';
        svgContents = svgContents + '<stop offset="0%" id="LinearGradient-Stop1"></stop>';
        svgContents = svgContents + '<stop offset="25%" id="LinearGradient-Stop2"></stop>';
        svgContents = svgContents + '<stop offset="100%" id="LinearGradient-Stop3"></stop></linearGradient>';
        svgContents = svgContents + '</defs>';

        svgContents = svgContents + String.format('<path fill="none" stroke-opacity="1" fill-opacity="1" stroke-linejoin="round" stroke-linecap="square" d="M5 {0} {1} {0} {1} {2} 5 {2} z"/>', parseInt(this._chartHeight) * 1 / 10 + 5, parseInt(this._chartWidth) - 5, parseInt(this._chartHeight) - parseInt(this._chartHeight) * 1 / 10);
        svgContents = svgContents + String.format('<path id="ChartBackGround" stroke="" d="M0 0 {0} 0 {0} {1} 0 {1} z"/>', this._chartWidth, this._chartHeight);
        svgContents = svgContents + String.format('<path fill="#fff" stroke-opacity="1" fill-opacity="0" stroke-linejoin="round" stroke-linecap="square" stroke="" d="M5 {0} {1} {0} {1} {2} 5 {2} z" />', parseInt(this._chartHeight) * 1 / 10 + 5, parseInt(this._chartWidth) - 5, parseInt(this._chartHeight) - parseInt(this._chartHeight) * 1 / 10);

        return svgContents;
    },

    // This draws Lines on the chart.
    drawLines: function() {
        // Lines section    
        var lineContents = '',
            yVal = 0,
            lastStartX,
            lastStartY;

        lastStartX = new Array();
        lastStartY = new Array();

        for(var j = 0; j < this._series.length; j++) {
            lastStartX[j] = this.startX;
            lastStartY[j] = this.startY;
        }

        this.animateLines(this, lastStartX, lastStartY, 0, 0);
    },

    animateLines: function(me, lastStartX, lastStartY, yVal, index) {
        for(var j = 0; j < me._series.length; j++) {
            yVal = 0;

            if(me._chartType == Sys.Extended.UI.LineChartType.Stacked) {
                for(k = 0; k <= j; k++)
                    yVal = parseFloat(yVal) + parseFloat(me._series[k].Data[index]);
            } else {
                yVal = me._series[j].Data[index];
            }

            if(me._chartType == Sys.Extended.UI.LineChartType.Stacked) {
                if(me.arrCombinedData[index] > 0) {
                    if(index > 0)
                        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{2}" cx="{0}" cy="{1}" r="4" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt, {4}, \'{5}\')" onmouseout="HideTooltip(this, evt)"></circle>', me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor, yVal, me._areaDataLabel) + String.format('<path d="M{0} {1} {2} {3}" id="Line{4}" style="fill:{5};stroke:{5}"></path>', lastStartX[j], lastStartY[j], me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor) + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', me.startX + (me.xInterval * index) + (me.xInterval * 20 / 100), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)) - 7.5, yVal);
                    else
                        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{2}" cx="{0}" cy="{1}" r="4" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt, {4}, \'{5}\')" onmouseout="HideTooltip(this, evt)"></circle>', me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor, yVal, me._areaDataLabel) + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', me.startX + (me.xInterval * index) + (me.xInterval * 20 / 100), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)) - 7.5, yVal);
                } else {
                    if(index > 0)
                        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{2}" cx="{0}" cy="{1}" r="4" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt, {4}, \'{5}\')" onmouseout="HideTooltip(this, evt)"></circle>', me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor, yVal, me._areaDataLabel) + String.format('<path d="M{0} {1} {2} {3}" id="Line{4}" style="fill:{5};stroke:{5}"></path>', lastStartX[j], lastStartY[j], me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor) + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', me.startX + (me.xInterval * index) + (me.xInterval * 20 / 100), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)) + 7.5, yVal);
                    else
                        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{2}" cx="{0}" cy="{1}" r="4" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt, {4}, \'{5}\')" onmouseout="HideTooltip(this, evt)"></circle>', me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor, yVal, me._areaDataLabel) + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', me.startX + (me.xInterval * index) + (me.xInterval * 20 / 100), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)) + 7.5, yVal);
                }
            } else {
                if(yVal > 0) {
                    if(index > 0)
                        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{2}" cx="{0}" cy="{1}" r="4" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt, {4}, \'{5}\')" onmouseout="HideTooltip(this, evt)"></circle>', me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor, yVal, me._areaDataLabel) + String.format('<path d="M{0} {1} {2} {3}" id="Line{4}" style="fill:{5};stroke:{5}"></path>', lastStartX[j], lastStartY[j], me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor) + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', me.startX + (me.xInterval * index) + (me.xInterval * 20 / 100), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)) - 7.5, yVal);
                    else
                        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{2}" cx="{0}" cy="{1}" r="4" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt, {4}, \'{5}\')" onmouseout="HideTooltip(this, evt)"></circle>', me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor, yVal, me._areaDataLabel) + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', me.startX + (me.xInterval * index) + (me.xInterval * 20 / 100), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)) - 7.5, yVal);
                } else {
                    if(index > 0)
                        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{2}" cx="{0}" cy="{1}" r="4" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt, {4}, \'{5}\')" onmouseout="HideTooltip(this, evt)"></circle>', me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor, yVal, me._areaDataLabel) + String.format('<path d="M{0} {1} {2} {3}" id="Line{4}" style="fill:{5};stroke:{5}"></path>', lastStartX[j], lastStartY[j], me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor) + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', me.startX + (me.xInterval * index) + (me.xInterval * 20 / 100), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)) + 7.5, yVal);
                    else
                        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{2}" cx="{0}" cy="{1}" r="4" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt, {4}, \'{5}\')" onmouseout="HideTooltip(this, evt)"></circle>', me.startX + (me.xInterval * index) + (me.xInterval / 2), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)), j + 1, me._series[j].LineColor, yVal, me._areaDataLabel) + String.format('<text id="LegendText" x="{0}" y="{1}">{2}</text>', me.startX + (me.xInterval * index) + (me.xInterval * 20 / 100), me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange)) + 7.5, yVal);
                }
            }

            lastStartX[j] = me.startX + (me.xInterval * index) + (me.xInterval / 2) + 3;
            lastStartY[j] = me.startY - Math.round(yVal * (me.yInterval / me.roundedTickRange));
        }

        index++;

        if(index < me.arrXAxisLength)
            setTimeout(function() {
                me.animateLines(me, lastStartX, lastStartY, 0, index);
            }, 400);
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
    },

    get_tooltipBackgroundColor: function() {
        return this.tooltipBackgroundColor;
    },

    set_tooltipBackgroundColor: function(value) {
        this.tooltipBackgroundColor = value;
    },

    get_tooltipFontColor: function() {
        return this._tooltipFontColor;
    },

    set_tooltipFontColor: function(value) {
        this._tooltipFontColor = value;
    },

    get_tooltipBorderColor: function() {
        return this._tooltipBorderColor;
    },

    set_tooltipBorderColor: function(value) {
        this._tooltipBorderColor = value;
    },

    get_areaDataLabel: function() {
        return this._areaDataLabel;
    },

    set_areaDataLabel: function(value) {
        this._areaDataLabel = value;
    }
};

Sys.Extended.UI.LineChart.registerClass("Sys.Extended.UI.LineChart", Sys.Extended.UI.ControlBase);

Sys.Extended.UI.LineChartType = function() {
    /// Type of Line Chart
    throw Error.invalidOperation();
}

Sys.Extended.UI.LineChartType.prototype = {
    Basic: 0,
    Stacked: 1
}

Sys.Extended.UI.LineChartType.registerEnum("Sys.Extended.UI.LineChartType", false);