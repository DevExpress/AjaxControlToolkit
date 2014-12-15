Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.BubbleChart = function(element) {
    Sys.Extended.UI.BubbleChart.initializeBase(this, [element]);
    var id = this.get_id();
    id = id.replace("_ctl00", "");
    this._parentDiv = document.getElementById(id + "__ParentDiv");

    this._chartWidth = '300';
    this._chartHeight = '200';
    this._chartTitle = '';
    this._bubbleChartClientValues = null;
    this._theme = 'BubbleChart';
    this._yAxisLines = 6;
    this._xAxisLines = 6;
    this._bubbleSizes = 5;
    this._chartTitleColor = '';
    this._yAxisLineColor = '';
    this._xAxisLineColor = '';
    this._baseLineColor = '';
    this._tooltipBackgroundColor = '#ffffff';
    this._tooltipFontColor = '#0E426C';
    this._tooltipBorderColor = '#B85B3E';
    this._xAxisLabel = '';
    this._yAxisLabel = '';
    this._bubbleLabel = '';
    this._axislabelFontColor = '#000000';

    // variables
    this.yMax = 0;
    this.yMin = 0;
    this.xMax = 0;
    this.xMin = 0;
    this.dataMax = 0;
    this.dataMin = 0;
    this.yRoundedIntervalLabelSize = 0;
    this.xRoundedIntervalLabelSize = 0;
    this.roundedBubbleSize = 0;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.xInterval = 0;
    this.yInterval = 0;
    this.charLength = 3.5;
    this._divTooltip = null;
}

Sys.Extended.UI.BubbleChart.prototype = {

    initialize: function() {
        Sys.Extended.UI.BubbleChart.callBaseMethod(this, "initialize");

        if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) {
            throw 'Current version of browser does not support SVG.';
        }

        if(this._yAxisLines == 0) {
            this._yAxisLines = 6;
        }

        if(this._xAxisLines == 0) {
            this._xAxisLines = 6;
        }

        if(this._bubbleSizes == 0) {
            this._bubbleSizes = 5;
        }

        this.generateTooltipDiv();
        this.generateBubbleChart();
    },

    dispose: function() {
        Sys.Extended.UI.BubbleChart.callBaseMethod(this, "dispose");
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

    generateBubbleChart: function() {
        this.calculateMinMaxValues();
        this.calculateBubbleSize();
        this.calculateAxisValues();

        var svgContents = this.intializeSVG();

        // Title Text
        svgContents = svgContents + String.format('<text x="{0}" y="{1}" id="ChartTitle" style="fill:{3}">{2}</text>', parseInt(this._chartWidth) / 2 - (this._chartTitle.length * this.charLength), parseInt(this._chartHeight) * 5 / 100, this._chartTitle, this._chartTitleColor);

        this.calculateIntervals();
        // Draw backgound horizontal lines        
        svgContents = svgContents + this.drawBackgroundHorizontalLines();
        //draw background vertical lines
        svgContents = svgContents + this.drawBackgroundVerticalLines();
        // draw background base lines
        svgContents = svgContents + this.drawBaseLines();
        // draw X and Y axis values
        svgContents = svgContents + this.drawAxisValues();

        this._parentDiv.innerHTML = this._parentDiv.innerHTML + svgContents;

        // Bubble section
        this.drawBubbles(this, 0);
    },

    intializeSVG: function() {
        var svgContents = String.format('<?xml-stylesheet type="text/css" href="{0}.css"?>', this._theme);
        svgContents = String.format('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="{0}" height="{1}" preserveAspectRatio="xMidYMid meet" viewbox="0 0 {2} {3}" style="position: relative; display: block;" onload="init(evt)">', this._chartWidth, this._chartHeight, parseFloat(this._chartWidth) * 0.99, parseFloat(this._chartHeight) * 0.99);
        //svgContents = svgContents + "<script type=\"text/ecmascript\"> function init(evt) { if ( window.svgDocument == null ) { gDocument = evt.target.ownerDocument;   } } function ShowTooltip(evt) {        alert('called');    } </script>";
        svgContents = svgContents + String.format('<path fill="none" stroke-opacity="1" fill-opacity="1" stroke-linejoin="round" stroke-linecap="square" d="M5 {0} {1} {0} {1} {2} 5 {2} z"/>', parseInt(this._chartHeight) * 1 / 10 + 5, parseInt(this._chartWidth) - 5, parseInt(this._chartHeight) - parseInt(this._chartHeight) * 1 / 10);
        svgContents = svgContents + String.format('<path id="ChartBackGround" stroke="" d="M0 0 {0} 0 {0} {1} 0 {1} z"/>', this._chartWidth, parseInt(this._chartHeight) - 5);
        svgContents = svgContents + String.format('<path fill="#ffffff" stroke-opacity="1" fill-opacity="0" stroke-linejoin="round" stroke-linecap="square" stroke="" d="M5 {0} {1} {0} {1} {2} 5 {2} z" />', parseInt(this._chartHeight) * 1 / 10 + 5, parseInt(this._chartWidth) - 5, parseInt(this._chartHeight) - parseInt(this._chartHeight) * 1 / 10);
        return svgContents;
    },

    drawBubbles: function(me, index) {
        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<circle id="Dot{4}" cx="{0}" cy="{1}" r="{2}" style="fill:{3};stroke:{3}" onmouseover="ShowTooltip(this, evt,\'{5}\',{6}, \'{7}\')" onmouseout="HideTooltip(this, evt)"></circle></svg>', me.startX + Math.round((parseFloat(me._bubbleChartClientValues[index].X) / me.xRoundedIntervalLabelSize) * me.xInterval), me.startY + Math.round(((-1 * parseFloat(me._bubbleChartClientValues[index].Y)) / me.yRoundedIntervalLabelSize) * me.yInterval), Math.round((parseFloat(me._bubbleChartClientValues[index].Data) / me.roundedBubbleSize) * me._bubbleSizes), me._bubbleChartClientValues[index].BubbleColor, index + 1, me._bubbleChartClientValues[index].Category, me._bubbleChartClientValues[index].Data, me._bubbleLabel);
        index++;
        if(index < me._bubbleChartClientValues.length) {            //  if the counter < series length, call the loop function
            setTimeout(function() {
                me.drawBubbles(me, index);
            }, 400);
        }
    },

    // This calculates minimum and maximum values of the specified data.
    calculateMinMaxValues: function() {
        // calculate minimum and maximum value        
        for(var i = 0; i < this._bubbleChartClientValues.length; i++) {
            if(i == 0) {
                this.dataMax = parseFloat(this._bubbleChartClientValues[i].Data);
                this.dataMin = parseFloat(this._bubbleChartClientValues[i].Data);

                this.yMax = parseFloat(this._bubbleChartClientValues[i].Y);
                this.yMin = parseFloat(this._bubbleChartClientValues[i].Y);

                this.xMax = parseFloat(this._bubbleChartClientValues[i].X);
                this.xMin = parseFloat(this._bubbleChartClientValues[i].X);
            }
            else {
                // Data values
                if(parseFloat(this._bubbleChartClientValues[i].Data) > this.dataMax)
                    this.dataMax = parseFloat(this._bubbleChartClientValues[i].Data);

                if(parseFloat(this._bubbleChartClientValues[i].Data) < this.dataMin)
                    this.dataMin = parseFloat(this._bubbleChartClientValues[i].Data);

                // X values
                if(parseFloat(this._bubbleChartClientValues[i].X) > this.xMax)
                    this.xMax = parseFloat(this._bubbleChartClientValues[i].X);

                if(parseFloat(this._bubbleChartClientValues[i].Data) < this.xMin)
                    this.xMin = parseFloat(this._bubbleChartClientValues[i].X);

                // Y values
                if(parseFloat(this._bubbleChartClientValues[i].Y) > this.yMax)
                    this.yMax = parseFloat(this._bubbleChartClientValues[i].Y);

                if(parseFloat(this._bubbleChartClientValues[i].Y) < this.yMin)
                    this.yMin = parseFloat(this._bubbleChartClientValues[i].Y);
            }
        }

        if(this.xMin < 0)
            this._xAxisLines = Math.round(this._xAxisLines / 2);

        if(this.yMin < 0)
            this._yAxisLines = Math.round(this._yAxisLines / 2);

    },

    calculateBubbleSize: function() {
        var pow10x;
        var x;
        // calculate size of bubble
        var bubbleRange;
        var unroundedBubbleSize;

        bubbleRange = this.dataMax;

        unroundedBubbleSize = bubbleRange / (this._bubbleSizes - 1);
        x = Math.ceil((Math.log(unroundedBubbleSize) / Math.log(10)) - 1);
        pow10x = Math.pow(10, x);
        this.roundedBubbleSize = Math.ceil(unroundedBubbleSize / pow10x) * pow10x;
    },

    // this calculates label values for X and Y Value axis to display on the chart.
    calculateAxisValues: function() {
        // calculate value axis labels
        var valueRange;
        var unroundedValueSize;

        if(this.yMin < 0) {
            valueRange = this.yMax > Math.abs(this.yMin) ? this.yMax : Math.abs(this.yMin);
        }
        else {
            valueRange = this.yMax;
        }

        unroundedValueSize = valueRange / (this._yAxisLines - 1);
        if(unroundedValueSize < 1) {
            this.yRoundedIntervalLabelSize = unroundedValueSize.toFixed(1);
        }
        else {
            x = Math.ceil((Math.log(unroundedValueSize) / Math.log(10)) - 1);
            pow10x = Math.pow(10, x);
            this.yRoundedIntervalLabelSize = Math.ceil(unroundedValueSize / pow10x) * pow10x;
        }

        // calculate X axis labels
        var xRange;
        var unroundedXSize;

        if(this.xMin < 0) {
            xRange = this.xMax > Math.abs(this.xMin) ? this.xMax : Math.abs(this.xMin);
        }
        else {
            xRange = this.xMax;
        }

        unroundedXSize = xRange / (this._xAxisLines - 1);
        if(unroundedValueSize < 1) {
            this.xRoundedIntervalLabelSize = unroundedXSize.toFixed(1);
        }
        else {
            x = Math.ceil((Math.log(unroundedXSize) / Math.log(10)) - 1);
            pow10x = Math.pow(10, x);
            this.xRoundedIntervalLabelSize = Math.ceil(unroundedXSize / pow10x) * pow10x;
        }
    },

    // This calculates distance interval for the value axis.
    calculateIntervals: function() {
        this.endX = parseFloat(this._chartWidth) - (parseFloat(this._chartWidth) * 5 / 100);
        if(this.xMin < 0) {
            this.startX = Math.round(parseFloat(this._chartWidth) + (parseFloat(this._chartWidth) * 10 / 100)) / 2 + 0.5;
        }
        else {
            this.startX = (parseFloat(this._chartWidth) * 20 / 100) + 0.5;
        }

        if(this.xMin < 0)
            this.xInterval = (this.endX - this.startX) / (this._xAxisLines);
        else
            this.xInterval = Math.round((this.endX - this.startX) / (this._xAxisLines));

        if(this.yMin < 0)
            this.startY = Math.round(parseInt(this._chartHeight) - (parseInt(this._chartHeight) * 5 / 100)) / 2 + 0.5;
        else
            this.startY = Math.round(parseInt(this._chartHeight) - (parseInt(this._chartHeight) * 20 / 100)) + 0.5;

        this.yInterval = this.startY / (this._yAxisLines + 1);
        this.endY = this.startY - (this.yInterval * this._yAxisLines);
    },

    // This draws background horizontal lines of the chart.
    drawBackgroundHorizontalLines: function() {
        var horizontalLineContents = '';
        // For positive values.
        for(var i = 1; i <= this._yAxisLines; i++) {
            horizontalLineContents = horizontalLineContents + String.format('<path d="M{0} {2} {1} {2}" id="HorizontalLine" style="stroke:{3}"></path>', this.startX, this.endX, this.startY - (this.yInterval * i), this._xAxisLineColor);
        }

        if(this.yMin < 0) {
            // background grid's horizontal lines for negative y values.
            for(var i = 1; i <= this._yAxisLines; i++) {
                horizontalLineContents = horizontalLineContents + String.format('<path d="M{0} {2} {1} {2}" id="HorizontalLine" style="stroke:{3}"></path>', this.startX, this.endX, this.startY + (this.yInterval * i), this._xAxisLineColor);
            }
        }

        if(this.xMin < 0) {
            // background grid's horizontal lines for negative x values.
            for(var i = 1; i <= this._yAxisLines; i++) {
                horizontalLineContents = horizontalLineContents + String.format('<path id="HorizontalLine" d="M{0} {2} {1} {2}" style="stroke:{3}"></path>', this.startX, (this.startX - (this.xInterval * this._xAxisLines)), (this.startY - (this.yInterval * i)), this._xAxisLineColor);
            }
        }

        if(this.xMin < 0 && this.yMin < 0) {
            // background grid's horizontal lines for negative values
            for(var i = 1; i <= this._yAxisLines; i++) {
                horizontalLineContents = horizontalLineContents + String.format('<path id="HorizontalLine" d="M{0} {2} {1} {2}" style="stroke:{3}"></path>', this.startX, this.startX - (this.xInterval * this._xAxisLines), (this.startY + (this.yInterval * i)), this._xAxisLineColor);
            }
        }
        return horizontalLineContents;
    },

    // This draws background vertical lines of the chart.
    drawBackgroundVerticalLines: function() {
        var verticalLineContents = '';
        // background grid's vertical lines
        for(var i = 1; i <= this._xAxisLines; i++) {
            verticalLineContents = verticalLineContents + String.format('<path d="M{0} {1} {0} {2}" id="VerticalLine" style="stroke:{3}"></path>', this.startX + (this.xInterval * i), this.startY, this.endY, this._yAxisLineColor);
        }

        if(this.xMin < 0) {
            // background grid's vertical lines for negative values
            for(var i = 1; i <= this._xAxisLines; i++) {
                verticalLineContents = verticalLineContents + String.format('<path d="M{0} {1} {0} {2}" id="VerticalLine" style="stroke:{3}"></path>', this.startX - (this.xInterval * i), this.startY, this.endY, this._yAxisLineColor);
            }
        }

        if(this.yMin < 0) {
            // background grid's vertical lines for negative values
            for(var i = 1; i <= this._xAxisLines; i++) {
                verticalLineContents = verticalLineContents + String.format('<path id="VerticalLine" d="M{0} {1} {0} {2}" style="stroke:{3}"></path>', this.startX + (this.xInterval * i), this.startY, this.startY + (this.yInterval * this._yAxisLines), this._yAxisLineColor);
            }
        }

        if(this.xMin < 0 && this.yMin < 0) {
            // background grid's vertical lines for negative values
            for(var i = 1; i <= this._xAxisLines; i++) {
                verticalLineContents = verticalLineContents + String.format('<path id="VerticalLine" d="M{0} {1} {0} {2}" style="stroke:{3}"></path>', this.startX - (this.xInterval * i), this.startY, this.startY + (this.yInterval * this._yAxisLines), this._yAxisLineColor);
            }
        }

        return verticalLineContents;
    },

    // This draws base lines of the chart.
    drawBaseLines: function() {
        var baseLineContents = '';

        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {2} {1}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.endX, this._baseLineColor);
        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.startY + 4, this._baseLineColor);

        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.endY, this._baseLineColor);
        baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {2} {1}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.startX + 4, this._baseLineColor);

        for(var i = 0; i <= this._yAxisLines; i++) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX - 4, this.startX, this.startY - (this.yInterval * i), this._baseLineColor);
        }

        if(this.yMin < 0) {
            for(var i = 1; i <= this._yAxisLines; i++) {
                baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX - 4, this.startX, this.startY + (this.yInterval * i), this._baseLineColor);
            }
            baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', (this.startX - (this.xInterval * this._xAxisLines)), this.startY, this.startY + 4, this._baseLineColor);
            baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, this.startY, this.startY + (this.yInterval * this._yAxisLines), this._baseLineColor);
        }

        for(var i = 0; i <= this._xAxisLines; i++) {
            baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX + (this.xInterval * i), this.startY, this.startY + 4, this._baseLineColor);
        }

        if(this.xMin < 0) {
            for(var i = 1; i <= this._xAxisLines; i++) {
                baseLineContents = baseLineContents + String.format('<path d="M{0} {1} {0} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX - (this.xInterval * i), this.startY, this.startY + 4, this._baseLineColor);
            }
            baseLineContents = baseLineContents + String.format('<path d="M{0} {2} {1} {2}" id="BaseLine" style="stroke:{3}"></path>', this.startX, (this.startX - (this.xInterval * this._xAxisLines)), this.startY, this._baseLineColor);
        }
        return baseLineContents;
    },

    drawAxisValues: function() {
        var axisValueContents = '';
        var textLength = 0;
        for(var i = 1; i <= this._yAxisLines; i++) {
            textLength = (this.yRoundedIntervalLabelSize * 10 * i / 10).toString().length * 5.5;
            axisValueContents = axisValueContents + String.format('<text id="ValueAxis" x="{0}" y="{1}">{2}</text>', this.startX - textLength - 10, this.startY - (this.yInterval * i) + 4, this.yRoundedIntervalLabelSize * 10 * i / 10);
        }

        if(this.yMin < 0) {
            for(var i = 1; i <= this._yAxisLines; i++) {
                textLength = (this.yRoundedIntervalLabelSize * 10 * i / 10).toString().length * 5.5 + 5.5; // add length for -ve character 
                axisValueContents = axisValueContents + String.format('<text id="ValueAxis" x="{0}" y="{1}">-{2}</text>', this.startX - textLength - 10, this.startY + (this.yInterval * i) + 4, this.yRoundedIntervalLabelSize * 10 * i / 10);
            }
        }

        for(var i = 1; i <= this._xAxisLines; i++) {
            textLength = (this.xRoundedIntervalLabelSize * 10 * i / 10).toString().length * 5.5;
            axisValueContents = axisValueContents + String.format('<text id="SeriesAxis" x="{0}" y="{1}">{2}</text>', Math.round(this.startX + (this.xInterval * i) - (textLength / 2)), this.startY + Math.round(this.yInterval * 25 / 100) + 5, this.xRoundedIntervalLabelSize * 10 * i / 10);
        }

        if(this.xMin < 0) {
            for(var i = 1; i <= this._xAxisLines; i++) {
                textLength = (this.xRoundedIntervalLabelSize * 10 * i / 10).toString().length * 5.5 + 5.5; // add length for -ve character
                axisValueContents = axisValueContents + String.format('<text id="SeriesAxis" x="{0}" y="{1}">-{2}</text>', Math.round(this.startX - (this.xInterval * i) - (textLength / 2)), this.startY + Math.round(this.yInterval * 25 / 100) + 5, this.xRoundedIntervalLabelSize * 10 * i / 10);
            }
        }

        var yLabelStart;
        if(this.yMin < 0)
            yLabelStart = Math.round((this.startY + (this.yInterval * this._yAxisLines)) - (this.startY - (this.yInterval * this._yAxisLines))) / 2;
        else
            yLabelStart = Math.round((this.startY - this.endY) / 2);

        axisValueContents = axisValueContents + String.format('<text id="AxisLabels"  x="{0}" y="{1}" style="fill:{3};" transform="rotate(-90, {0}, {1})">{2}</text>', Math.round(parseFloat(this._chartWidth) * 5 / 100), yLabelStart + (this._yAxisLabel.toString().length * this.charLength), this._yAxisLabel, this._axislabelFontColor);
        axisValueContents = axisValueContents + String.format('<text id="AxisLabels" x="{0}" y="{1}" style="fill:{3};">{2}</text>', Math.round(parseInt(this._chartWidth) / 2 - (this._xAxisLabel.toString().length * this.charLength) / 2), Math.round(parseInt(this._chartHeight) * 90 / 100 + 5), this._xAxisLabel, this._axislabelFontColor);
        return axisValueContents;
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

    get_BubbleChartClientValues: function() {
        return this._bubbleChartClientValues;
    },
    set_BubbleChartClientValues: function(value) {
        this._bubbleChartClientValues = value;
    },

    get_theme: function() {
        return this._theme;
    },
    set_theme: function(value) {
        this._theme = value;
    },

    get_yAxisLines: function() {
        return this._yAxisLines;
    },
    set_yAxisLines: function(value) {
        this._yAxisLines = value;
    },

    get_xAxisLines: function() {
        return this._xAxisLines;
    },
    set_xAxisLines: function(value) {
        this._xAxisLines = value;
    },

    get_chartTitleColor: function() {
        return this._chartTitleColor;
    },
    set_chartTitleColor: function(value) {
        this._chartTitleColor = value;
    },

    get_yAxisLineColor: function() {
        return this._yAxisLineColor;
    },
    set_yAxisLineColor: function(value) {
        this._yAxisLineColor = value;
    },

    get_xAxisLineColor: function() {
        return this._xAxisLineColor;
    },
    set_xAxisLineColor: function(value) {
        this._xAxisLineColor = value;
    },

    get_bubbleSizes: function() {
        return this._bubbleSizes;
    },
    set_bubbleSizes: function(value) {
        this._bubbleSizes = value;
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

    get_xAxisLabel: function() {
        return this._xAxisLabel;
    },
    set_xAxisLabel: function(value) {
        this._xAxisLabel = value;
    },

    get_yAxisLabel: function() {
        return this._yAxisLabel;
    },
    set_yAxisLabel: function(value) {
        this._yAxisLabel = value;
    },

    get_bubbleLabel: function() {
        return this._bubbleLabel;
    },
    set_bubbleLabel: function(value) {
        this._bubbleLabel = value;
    },

    get_axislabelFontColor: function() {
        return this._axislabelFontColor;
    },
    set_axislabelFontColor: function(value) {
        this._axislabelFontColor = value;
    }
};

Sys.Extended.UI.BubbleChart.registerClass("Sys.Extended.UI.BubbleChart", Sys.Extended.UI.ControlBase);