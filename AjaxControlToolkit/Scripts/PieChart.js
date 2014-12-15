Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.PieChart = function(element) {
    Sys.Extended.UI.PieChart.initializeBase(this, [element]);
    var id = this.get_id();
    id = id.replace("_ctl00", "");
    this._parentDiv = document.getElementById(id + "__ParentDiv");

    this._chartWidth = '300';
    this._chartHeight = '300';
    this._chartTitle = '';
    this._pieChartClientValues = null;
    this._theme = 'PieChart';
    this._chartTitleColor = '';
    this.charLength = 3.5;
}

Sys.Extended.UI.PieChart.prototype = {

    initialize: function() {
        Sys.Extended.UI.PieChart.callBaseMethod(this, "initialize");

        if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"))
            throw 'Current version of browser does not support SVG.';

        this.generatePieChart();
    },

    dispose: function() {
        Sys.Extended.UI.PieChart.callBaseMethod(this, "dispose");
    },

    generatePieChart: function() {
        var radius = parseInt(this._chartWidth) > parseInt(this._chartHeight) ? (parseInt(this._chartHeight) - 10) / 3 : (parseInt(this._chartWidth) - 10) / 3,
            startX = parseInt(this._chartWidth) / 2,
            startY = parseInt(this._chartHeight) / 2.25;

        // initialize SVG
        var svgContents = String.format('<?xml-stylesheet type="text/css" href="{0}.css"?>', this._theme);
        svgContents = String.format('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="{0}" height="{1}" style="position: relative; display: block;">', this._chartWidth, this._chartHeight);
        svgContents = svgContents + '<defs>';
        svgContents = svgContents + String.format('<radialGradient gradientUnits="userSpaceOnUse" r="{0}" fy="{1}" fx="{2}" cy="{1}" cx="{2}">', radius, startX, startY);
        svgContents = svgContents + '<stop offset="0%" id="RadialGradient1"></stop>';
        svgContents = svgContents + '<stop offset="25%" id="RadialGradient2"></stop>';
        svgContents = svgContents + '<stop offset="100%" id="RadialGradient3"></stop></RadialGradient>';
        svgContents = svgContents + '</defs>';
        svgContents = svgContents + String.format('<path fill="none" stroke-opacity="1" fill-opacity="1" stroke-linejoin="round" stroke-linecap="square" d="M5 {0} {1} {0} {1} {2} 5 {2} z"/>', parseInt(this._chartHeight) * 1 / 10 + 5, parseInt(this._chartWidth) - 5, parseInt(this._chartHeight) - parseInt(this._chartHeight) * 1 / 10);
        svgContents = svgContents + String.format('<path id="ChartBackGround" stroke="" d="M0 0 {0} 0 {0} {1} 0 {1} z"/>', this._chartWidth, this._chartHeight);
        svgContents = svgContents + String.format('<path fill="#ffffff" stroke-opacity="1" fill-opacity="0" stroke-linejoin="round" stroke-linecap="square" stroke="" d="M5 {0} {1} {0} {1} {2} 5 {2} z" />', parseInt(this._chartHeight) * 1 / 10 + 5, parseInt(this._chartWidth) - 5, parseInt(this._chartHeight) - parseInt(this._chartHeight) * 1 / 10);
        // Set Title of Chart
        svgContents = svgContents + String.format('<text x="{0}" y="{1}" id="ChartTitle" style="fill:{3}">{2}</text>', parseInt(this._chartWidth) / 2 - (this._chartTitle.length * this.charLength), parseInt(this._chartHeight) * 5 / 100, this._chartTitle, this._chartTitleColor);

        // Legend Area
        var legendAreaStartHeight = (parseInt(this._chartHeight) * 82 / 100) + 5,
            legendBoxWidth = 7.5,
            legendBoxHeight = 7.5,
            spaceInLegendContents = 5;

        // Get length of text to display in legend
        var legendCharLength = 0;
        for(var i = 0; i < this._pieChartClientValues.length; i++)
            legendCharLength = legendCharLength + this._pieChartClientValues[i].Category.length;

        var legendAreaWidth = Math.round((legendCharLength * 5) / 2) + Math.round((legendBoxWidth + (spaceInLegendContents * 2)) * this._pieChartClientValues.length),
            isLegendNextLine = false;

        if(legendAreaWidth > parseInt(this._chartWidth) / 2) {
            legendAreaWidth = legendAreaWidth / 2;
            isLegendNextLine = true;
        }

        svgContents = svgContents + '<g>';
        svgContents = svgContents + String.format('<path d="M{0} {1} {2} {1} {2} {3} {0} {3} z" id="LegendArea" stroke=""></path>', parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2), legendAreaStartHeight, parseInt(this._chartWidth) * 40 / 100 + (legendAreaWidth / 2), Math.round(parseInt(this._chartHeight) * 97.5 / 100));

        var startText = parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2) + 5 + legendBoxWidth + spaceInLegendContents,
            nextStartText = startText,
            startLegend = parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2) + 5,
            nextStartLegend = startLegend;

        for(var i = 0; i < this._pieChartClientValues.length; i++) {
            if(isLegendNextLine && i == Math.round(this._pieChartClientValues.length / 2)) {
                startText = parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2) + 5 + legendBoxWidth + spaceInLegendContents;
                nextStartText = startText;
                startLegend = parseInt(this._chartWidth) * 40 / 100 - (legendAreaWidth / 2) + 5;
                nextStartLegend = startLegend;
                legendAreaStartHeight = (parseInt(this._chartHeight) * 89 / 100) + 5;
                isLegendNextLine = false;
            }

            startLegend = nextStartLegend;
            startText = nextStartText;
            svgContents = svgContents + String.format('<path d="M{0} {1} {2} {1} {2} {3} {0} {3} z" id="Legend{4}" style="stroke:{6};fill:{5}"></path>', startLegend, legendAreaStartHeight + legendBoxHeight, startLegend + legendBoxWidth, legendAreaStartHeight + 15, i + 1, this._pieChartClientValues[i].PieChartValueColor, this._pieChartClientValues[i].PieChartValueStrokeColor);
            svgContents = svgContents + String.format('<text x="{0}" y="{1}" id="LegendText">{2}</text>', startText, legendAreaStartHeight + 15, this._pieChartClientValues[i].Category);

            if(this._pieChartClientValues[i].Category.length > 10) {
                nextStartLegend = startLegend + (this._pieChartClientValues[i].Category.length * 5.5) + legendBoxWidth + (spaceInLegendContents * 2);
                nextStartText = startText + (this._pieChartClientValues[i].Category.length * 5.5) + legendBoxWidth + (spaceInLegendContents * 2);
            } else {
                nextStartLegend = nextStartLegend + (this._pieChartClientValues[i].Category.length * 6) + legendBoxWidth + (spaceInLegendContents * 2);
                nextStartText = nextStartText + (this._pieChartClientValues[i].Category.length * 6) + legendBoxWidth + (spaceInLegendContents * 2);
            }
        }
        svgContents = svgContents + '</g>';

        // Draw PieChart
        var categoryValue = 0,
            totalValue = 0,
            angle = 0,
            radAngle = 0,
            textRadAngle = 0,
            endX = 0,
            endY = 0,
            arc = 0,
            lastEndX = startX,
            lastEndY = startY - radius,
            textX = startX,
            textY = startY - radius;

        for(var i = 0; i < this._pieChartClientValues.length; i++)
            totalValue = totalValue + Math.abs(parseFloat(this._pieChartClientValues[i].Data));

        this._parentDiv.innerHTML = svgContents;
        this.drawSegments(this, 0, categoryValue, totalValue, radius, angle, radAngle, textRadAngle, startX, endX, startY, endY, textX, textY, lastEndX, lastEndY, arc);
    },

    drawSegments: function(me, index, categoryValue, totalValue, radius, angle, radAngle, textRadAngle, startX, endX, startY, endY, textX, textY, lastEndX, lastEndY, arc) {
        categoryValue = categoryValue + Math.abs(parseFloat(me._pieChartClientValues[index].Data));
        angle = (categoryValue / totalValue) * 360;
        radAngle = angle * (Math.PI / 180);
        textRadAngle = (categoryValue - Math.abs(parseFloat(me._pieChartClientValues[index].Data)) + Math.abs(parseFloat(me._pieChartClientValues[index].Data)) / 2) / totalValue * 360;
        textRadAngle = textRadAngle * (Math.PI / 180);
        endX = parseFloat(Math.sin(radAngle) * radius);
        endY = parseFloat(Math.cos(radAngle) * radius);
        textX = parseFloat(Math.sin(textRadAngle) * (radius + 10));
        textY = parseFloat(Math.cos(textRadAngle) * (radius + 10));

        textX = (startX + textX) > startX ? startX + textX : (startX + textX) - (me._pieChartClientValues[index].Data.toString().length * this.charLength);
        textY = (startY + (-1 * textY)) < startY ? startY + (-1 * textY) : startY + (-1 * textY) + 10;
        me._parentDiv.innerHTML = me._parentDiv.innerHTML.replace('</svg>', '') + String.format('<g><path id="Segment{8}" d="M{0} {1} A {2} {2} 0 {3},1 {4} {5} L {6} {7} z" style="stroke:{10};fill:{9};"></path>', lastEndX, lastEndY, radius, arc, startX + endX, startY + (-1 * endY), startX, startY, index + 1, me._pieChartClientValues[index].PieChartValueColor, me._pieChartClientValues[index].PieChartValueStrokeColor) + String.format('<text fill="#000000" style="font: 11px Arial,Helvetica,sans-serif" fill-opacity="1" y="{1}" x="{0}">{2}</text></g>', textX, textY, me._pieChartClientValues[index].Data) + '</svg>';

        lastEndX = startX + endX;
        lastEndY = startY + (-1 * endY);
        index++;

        if(index < me._pieChartClientValues.length) //  if the counter < series length, call the loop function
            setTimeout(function() {
                me.drawSegments(me, index, categoryValue, totalValue, radius, angle, radAngle, textRadAngle, startX, endX, startY, endY, textX, textY, lastEndX, lastEndY, arc);
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

    get_PieChartClientValues: function() {
        return this._pieChartClientValues;
    },

    set_PieChartClientValues: function(value) {
        this._pieChartClientValues = value;
    },

    get_theme: function() {
        return this._theme;
    },

    set_theme: function(value) {
        this._theme = value;
    },

    get_chartTitleColor: function() {
        return this._chartTitleColor;
    },

    set_chartTitleColor: function(value) {
        this._chartTitleColor = value;
    }
};

Sys.Extended.UI.PieChart.registerClass("Sys.Extended.UI.PieChart", Sys.Extended.UI.ControlBase);