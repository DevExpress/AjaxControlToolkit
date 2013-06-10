Type.registerNamespace("Sys.Extended.UI.HTMLEditor");

Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs = function(oldMode, newMode, editPanel)     
{     
  if (arguments.length != 3) throw Error.parameterCount();     
  
  Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs.initializeBase(this);     
  this._oldMode = oldMode;     
  this._newMode = newMode;     
  this._editPanel = editPanel;     
}     
  
Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs.prototype =     
{     
  get_oldMode : function()     
  {     
    return this._oldMode;     
  },       
  get_newMode : function()     
  {     
    return this._newMode;     
  },
  get_editPanel : function()     
  {     
    return this._editPanel;     
  }     
}     
  
Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs.registerClass('Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs', Sys.EventArgs);
