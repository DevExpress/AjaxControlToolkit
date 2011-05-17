// (c) 2010 CodePlex Foundation
(function() {

function execute() {
Type._registerScript("Timer.js", ["MicrosoftAjaxComponentModel.js"]);
var $type, $prototype;
$type = Sys.UI._Timer = function _Timer(element) {
    Sys.UI._Timer.initializeBase(this,[element]);
    this._interval = 60000;
    this._enabled = true;
    this._postbackPending = false;
    this._raiseTickDelegate = null;
    this._endRequestHandlerDelegate = null;
    this._timer = null;
    this._pageRequestManager = null;
    this._uniqueID = null;
}
$type.prototype = {
    get_enabled: function _Timer$get_enabled() {
        /// <value type="Boolean" locid="P:J#Sys.UI._Timer.enabled"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._enabled;
    },
    set_enabled: function _Timer$set_enabled(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Boolean}]);
        if (e) throw e;
        this._enabled = value;
    },
    get_interval: function _Timer$get_interval() {
        /// <value type="Number" locid="P:J#Sys.UI._Timer.interval"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._interval;
    },
    set_interval: function _Timer$set_interval(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Number}]);
        if (e) throw e;
        this._interval = value;
    },
    get_uniqueID: function _Timer$get_uniqueID(){
        /// <value type="String" locid="P:J#Sys.UI._Timer.uniqueID"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._uniqueID;
    },
    set_uniqueID: function _Timer$set_uniqueID(value){
        var e = Function._validateParams(arguments, [{name: "value", type: String}]);
        if (e) throw e;
        this._uniqueID = value;
    },
    dispose: function _Timer$dispose(){
       this._stopTimer();
       if(this._pageRequestManager !== null){
           this._pageRequestManager.remove_endRequest(this._endRequestHandlerDelegate);
       }
       Sys.UI._Timer.callBaseMethod(this,"dispose");
    },
    _doPostback: function _Timer$_doPostback(){
        __doPostBack(this.get_uniqueID(),'');
    },
    _handleEndRequest: function _Timer$_handleEndRequest(sender, arg){
        var dataItem = arg.get_dataItems()[this.get_id()];
	    if (dataItem){
            this._update(dataItem[0],dataItem[1]);
	  	}
	  
	    if ((this._postbackPending === true) && (this._pageRequestManager !== null)&&(this._pageRequestManager.get_isInAsyncPostBack() === false)){
    	   	this._postbackPending = false;
            this._doPostback();
        }
	   
    },
    initialize: function _Timer$initialize(){
        Sys.UI._Timer.callBaseMethod(this, 'initialize');
    	this._raiseTickDelegate = Function.createDelegate(this,this._raiseTick);
    	this._endRequestHandlerDelegate = Function.createDelegate(this,this._handleEndRequest);
    	if (Sys.WebForms && Sys.WebForms.PageRequestManager){
           this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();  
    	}
    	if (this._pageRequestManager !== null ){
    	    this._pageRequestManager.add_endRequest(this._endRequestHandlerDelegate);
    	}
        if(this.get_enabled()) {
            this._startTimer();
        }
    },
    _raiseTick: function _Timer$_raiseTick() {
        this._startTimer();
        if ((this._pageRequestManager === null) || (!this._pageRequestManager.get_isInAsyncPostBack())){
            this._doPostback();
            this._postbackPending = false;
        } 
        else {
            this._postbackPending = true;
        }
    },
    _startTimer: function _Timer$_startTimer(){
        this._timer = window.setTimeout(Function.createDelegate(this,this._raiseTick),this.get_interval());
    },
    _stopTimer: function _Timer$_stopTimer(){
	    if (this._timer !== null){
	 	    window.clearTimeout(this._timer);
		    this._timer = null;
       } 	
    },
    _update: function _Timer$_update(enabled,interval) {
        var stopped = !this.get_enabled();
        var intervalChanged= (this.get_interval() !== interval);
	    if ((!stopped) && ((!enabled)||(intervalChanged))){
    	  	this._stopTimer();
    		stopped = true;
       	} 
    	this.set_enabled(enabled);
    	this.set_interval(interval);
    	if ((this.get_enabled()) && (stopped)){
    	    this._startTimer();
    	}
    }
}
$type.registerClass('Sys.UI._Timer', Sys.UI.Control);
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Timer", null, execute);
}
else {
	execute();
}

})();
