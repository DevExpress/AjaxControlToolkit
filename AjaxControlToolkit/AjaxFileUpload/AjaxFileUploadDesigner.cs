#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    public class AjaxFileUploadDesigner : ControlDesigner {

        public override string GetDesignTimeHtml(DesignerRegionCollection regions) {
            var controlPreviewHtml =
                @"<div class=""ajax__fileupload"" id=""SampleContent_AjaxFileUpload1_ctl00"" style=""padding: 4px;border: #D3D3D3 1px solid;overflow: auto;"">
	                <div style=""width: 100%; height: 60px; visibility: visible; border-style: dotted; border-width: 1px; line-height: 50px; text-align: center; margin-bottom: 2px;"">Drop files here</div>
	                <span style=""display: inline-block;overflow: hidden;position: relative;width: 80px;height: 24px;line-height: 24px;"">
	                <span style=""display: block;height: 24px;line-height: 24px;width: 80px;text-align: center;background-color: #212121;color: #D0D0D0;cursor: pointer;margin-right: 4px;font-size: 13px;"">Select File</span>
	                <div style=""overflow: hidden;"">
	                <div style=""visibility: visible;border: #A9A9A9 1px solid;border-width: 1px;margin-top: 2px;padding: 4px;clear: both;""></div></div></span>
	                <div style=""visibility: visible;border: #A9A9A9 1px solid;border-width: 1px;margin-top: 2px;padding: 4px;clear: both;"">
		                <div style=""position: relative;z-index: 0; color: #009; line-height: 20px;line-height: 20px;height: 20px;margin-bottom: 2px;overflow: hidden;"">
		                <div style=""display: inline-block;"" class=""pendingState"">
		                <span class=""ajax__fileupload_fileItemInfo"">
			                <span>File 1.jpg</span> <span class=""filetype"">(image/jpeg)</span> 
			                - 
			                <span>1.28 MB</span> 
		                </span>
		                <span> (uploading)</span></div>
		                <div style=""cursor: pointer;background-color: #900;color: white;width: 55px;height: 20px;line-height: 20px;text-align: center;display: block;float: left;position: absolute;top: 0;right: 0;"">Remove</div>
		                </div>

		                <div style=""position: relative;z-index: 0; color: #009; line-height: 20px;line-height: 20px;height: 20px;margin-bottom: 2px;overflow: hidden;"">
		                <div style=""display: inline-block;"" class=""pendingState"">
		                <span class=""ajax__fileupload_fileItemInfo"">
			                <span>File 2.jpg</span> <span class=""filetype"">(image/jpeg)</span> 
			                - 
			                <span>2.18 MB</span> 
		                </span>
		                <span> (pending)</span></div>
		                <div style=""cursor: pointer;background-color: #900;color: white;width: 55px;height: 20px;line-height: 20px;text-align: center;display: block;float: left;position: absolute;top: 0;right: 0;"">Remove</div>
		                </div>
		
		                <div style=""position: relative;z-index: 0; color: #009; line-height: 20px;line-height: 20px;height: 20px;margin-bottom: 2px;overflow: hidden;"">
		                <div style=""display: inline-block;"" class=""pendingState"">
		                <span class=""ajax__fileupload_fileItemInfo"">
			                <span>File 3.jpg</span> <span class=""filetype"">(image/jpeg)</span> 
			                - 
			                <span>99 MB</span> 
		                </span>
		                <span> (pending)</span></div>
		                <div style=""cursor: pointer;background-color: #900;color: white;width: 55px;height: 20px;line-height: 20px;text-align: center;display: block;float: left;position: absolute;top: 0;right: 0;"">Remove</div>
		                </div>
	                </div>
	
	                <div align=""right"" style=""margin-top: 2px;line-height: 20px;height: 20px;"">
		                <div>
			                <div align=""left"" style=""width: 80%; float: left; line-height: 20px;"">
			                <div style=""width: 65%; height: 20px; overflow: visible; white-space: nowrap;padding-left: 4px;background-color: #CCFFCC;"">uploaded 65%</div></div>
		                </div>
		                <div style=""width: 60px;text-align: center;cursor: pointer;color: white;font-weight: bold;background-color: #000099; line-height: 20px;"">Upload</div>
	                </div>
                </div>";

            return controlPreviewHtml;
        }

    }

}
#pragma warning restore 1591