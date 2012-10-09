<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._27218.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </act:ToolkitScriptManager>
    <div>
        <div style="padding-right: 63%;">
            <asp:Label ID="lblErrorMessages" runat="server" Text="" Visible="false"></asp:Label>
        </div>
        <div style="padding-left: 60%">
            <asp:Label ID="lblCreatedby" runat="server" Text="" Visible="true"></asp:Label>
        </div>
        <act:TabContainer ID="TabContainerMain" runat="server" ActiveTabIndex="0" Width="900px">
            <act:TabPanel ID="tpnlBasicData" runat="server" HeaderText="Basic Data">
                <ContentTemplate>
                    <div class="divfloatleft">
                        <fieldset class="mmaster">
                            <legend>Material Master Basic Data - &nbsp;<asp:Label ID="lblInternalStatus" runat="server"
                                Text="InProcess" /></legend>
                            <p>
                                <asp:Label ID="lblECN" runat="server" AssociatedControlID="txtECN">*ECN Number</asp:Label>
                                <asp:TextBox ID="txtECN" runat="server" CssClass="textEntry" MaxLength="8"></asp:TextBox>
                                <asp:RequiredFieldValidator runat="server" ErrorMessage="ECN Number is required."
                                    Text="<img src='images/error.png' alt='ECN Number is required.'/>" ID="rqdfldtxtECN"
                                    ControlToValidate="txtECN" EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblMaterialNumber" runat="server" AssociatedControlID="txtMaterialNumber">*Material Number:</asp:Label>
                                <asp:TextBox ID="txtMaterialNumber" runat="server" CssClass="textEntry" MaxLength="10"></asp:TextBox>
                                <asp:RequiredFieldValidator runat="server" ErrorMessage="Material Number is required."
                                    Text="<img src='images/error.png' alt='Material Number is required.'/>" ID="rqdfldtxtMaterialNumber"
                                    ControlToValidate="txtMaterialNumber" EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblMaterialType" runat="server" AssociatedControlID="ddlMaterialType">*Material Type:</asp:Label>
                                <asp:DropDownList ID="ddlMaterialType" runat="server" CssClass="ddlist">
                                    <asp:ListItem>Select...</asp:ListItem>
                                    <asp:ListItem Value="HAWA">HAWA - Procured Finished Goods</asp:ListItem>
                                    <asp:ListItem Value="FERT">FERT - In-house Mfg Fin Goods</asp:ListItem>
                                    <asp:ListItem Value="UNBW">UNBW - Nonvaluated materials </asp:ListItem>
                                    <asp:ListItem Value="ZREP">ZREP - Repair Parts</asp:ListItem>
                                    <asp:ListItem Value="ZREB">ZRFB - Product Seconds</asp:ListItem>
                                    <asp:ListItem Value="NLAG">NLAG - Non-stock materials</asp:ListItem>
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rqdfldddlMaterialType" runat="server" ErrorMessage="Select a value for Material Type"
                                    Text="<img src='images/error.png' alt='Select a value for Material Type'/>" ControlToValidate="ddlMaterialType"
                                    InitialValue="Select..." EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblMaterialDescription" runat="server" AssociatedControlID="txtMaterialDescription">*English Material description (36 characters):</asp:Label>
                                <asp:TextBox ID="txtMaterialDescription" runat="server" CssClass="textEntry" MaxLength="36"></asp:TextBox>
                                <asp:RequiredFieldValidator runat="server" ErrorMessage="English Materail description is required."
                                    Text="<img src='images/error.png' alt='English Materail description is required.'/>"
                                    ID="rqdfldtxtMaterialDescription" ControlToValidate="txtMaterialDescription"
                                    EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblAddlDescription" runat="server" AssociatedControlID="txtAddlDescription">English Add'l Description (40 characters):</asp:Label>
                                <asp:TextBox ID="txtAddlDescription" runat="server" CssClass="textEntry" MaxLength="40"></asp:TextBox>
                            </p>
                            <p>
                                <asp:Label ID="lblBaseUom" runat="server" AssociatedControlID="txtBaseUom">*Base Unit of Measure:</asp:Label>
                                <asp:TextBox ID="txtBaseUom" runat="server" CssClass="textEntry" Text="(Each) EA"
                                    Enabled="False" ReadOnly="True" BackColor="#FAFCDA"></asp:TextBox>
                            </p>
                            <p>
                                <asp:Label ID="lblMaterialGroup" runat="server" AssociatedControlID="ddlMaterialGroup">*Material Group:</asp:Label>
                                <asp:DropDownList ID="ddlMaterialGroup" CssClass="ddlist" runat="server" DataValueField="MaterialGroup"
                                    DataTextField="MaterialGroupDescription">
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rqdfldddlMaterialGroup" runat="server" ErrorMessage="Select a value for Material Group."
                                    Text="<img src='images/error.png' alt='Select a value for Material Group'/>"
                                    ControlToValidate="ddlMaterialGroup" EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblProductFamily" runat="server" AssociatedControlID="ddlProductFamily">*Product Family:</asp:Label>
                                <asp:DropDownList ID="ddlProductFamily" CssClass="ddlist" runat="server" DataValueField="ProductFamily"
                                    DataTextField="ProductFamilyDescription">
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rqdfldddlProductFamily" runat="server" ErrorMessage="Select a Product Family."
                                    Text="<img src='images/error.png' alt='Select a Product Family'/>" ControlToValidate="ddlProductFamily"
                                    EnableClientScript="False" />
                            </p>
                            <p>
                                <span style="font-weight: bold; font-size: 12px;">___________ *Product Hierarchy ___________</span>
                                <br />
                                <p>
                                    <p>
                                        <asp:Label ID="lblProductHierarchy" runat="server" AssociatedControlID="ddlMaterialGroup">SAP Product Hierarchy Code:</asp:Label>
                                        <asp:TextBox ID="txtProductHierarchy" runat="server" BackColor="#FAFCDA" CssClass="textEntry"
                                            Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="rqdfldtxtProductHierarchy" runat="server" ControlToValidate="txtProductHierarchy"
                                            EnableClientScript="False" ErrorMessage="Product Hierarchy is required." Text="&lt;img src='images/error.png' alt='Product Hierarchy is required.'/&gt;" />
                                        <p>
                                        </p>
                                        <p>
                                            <asp:Label ID="lbOldMaterialNumber" runat="server" AssociatedControlID="txtOldMaterialNumber">Old material number (if applicable):</asp:Label>
                                            <asp:TextBox ID="txtOldMaterialNumber" runat="server" CssClass="textEntry" MaxLength="18"></asp:TextBox>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                        <p>
                                        </p>
                                    </p>
                        </fieldset>
                    </div>
                    <div class="divfloatright">
                        <fieldset class="mmaster">
                            <legend>Material Master Basic Data (continued)</legend>
                            <p>
                                <asp:Label ID="lblProdInspMemo" runat="server" AssociatedControlID="txtProdInspMemo">Prod./insp. Memo (EMEA Legacy #):</asp:Label>
                                <asp:TextBox ID="txtProdInspMemo" runat="server" CssClass="textEntry" MaxLength="30"></asp:TextBox>
                            </p>
                            <p>
                                <asp:Label ID="lblSalesTaxProdCode" runat="server" AssociatedControlID="ddlSalesTaxProdCode">U.S. Sales Tax Product Code (For Apparel):</asp:Label>
                                <asp:DropDownList ID="ddlSalesTaxProdCode" runat="server" CssClass="ddlist">
                                    <asp:ListItem>Select...</asp:ListItem>
                                    <asp:ListItem Value="PCLO-01">PCLO-01</asp:ListItem>
                                    <asp:ListItem Value="PCLO-02">PCLO-02</asp:ListItem>
                                </asp:DropDownList>
                            </p>
                            <p>
                                <asp:Label ID="lblCountryOfOrigin" runat="server" AssociatedControlID="ddlCountryOfOrigin">*Country of Origin:</asp:Label>
                                <asp:DropDownList ID="ddlCountryOfOrigin" CssClass="ddlist" runat="server" DataValueField="country"
                                    DataTextField="countryDescription">
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rqdfldddlCountryOfOrigin" runat="server" ErrorMessage="Select a Country of Origin."
                                    Text="<img src='images/error.png' alt='Select a Country of Origin.'/>" ControlToValidate="ddlCountryOfOrigin"
                                    EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblBrand" runat="server" AssociatedControlID="ddlBrand">*Brand:</asp:Label>
                                <asp:DropDownList ID="ddlBrand" CssClass="ddlist" runat="server" DataValueField="Brand"
                                    DataTextField="BrandDescription">
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rqdfldddlBrand" runat="server" ErrorMessage="Select a Brand."
                                    Text="<img src='images/error.png' alt='Select a Brand'/>" ControlToValidate="ddlBrand"
                                    EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblXDistStatus" runat="server" AssociatedControlID="ddlXDistStatus">*X-distr. chain status:</asp:Label>
                                <asp:DropDownList ID="ddlXDistStatus" CssClass="ddlist" runat="server" DataValueField="XDistStatus"
                                    DataTextField="xDistStatusDesc">
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rqdfldddlXDistStatus" runat="server" ErrorMessage="Select a X-distr chain Status"
                                    Text="<img src='images/error.png' alt='Select a X-distr chain Status'/>" ControlToValidate="ddlXDistStatus"
                                    EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblLawLabelReq" CssClass="radiolbl" runat="server" AssociatedControlID="rdoLawLabelReq">*U.S. Law Label Required:</asp:Label>
                                <table>
                                    <tr>
                                        <td>
                                            <asp:RadioButtonList ID="rdoLawLabelReq" runat="server" RepeatDirection="Horizontal"
                                                Width="80px">
                                                <asp:ListItem Value="001" Text="Yes" />
                                                <asp:ListItem Value="002" Text="No" />
                                            </asp:RadioButtonList>
                                        </td>
                                        <td>
                                            <asp:RequiredFieldValidator ID="rqdfldrdoLawLabelReq" runat="server" ErrorMessage="Check Yes or No - US Law Label Req."
                                                Text="<img src='images/error.png' alt='Check Yes or No - US Law Label Req.'/>"
                                                ControlToValidate="rdoLawLabelReq" EnableClientScript="False" />
                                        </td>
                                    </tr>
                                </table>
                            </p>
                            <p>
                                <asp:Label ID="lblHazmat" runat="server" AssociatedControlID="rdoHazmat" CssClass="radiolbl">*Hazmat:</asp:Label>
                                <table>
                                    <tr>
                                        <td>
                                            <asp:RadioButtonList ID="rdoHazmat" runat="server" RepeatDirection="Horizontal" Width="80px">
                                                <asp:ListItem Value="1" Text="Yes" />
                                                <asp:ListItem Value="0" Text="No" />
                                            </asp:RadioButtonList>
                                        </td>
                                        <td>
                                            <asp:RequiredFieldValidator ID="rqdfldrdoHazmat" runat="server" ErrorMessage="Check Yes or No - Hazmat"
                                                Text="<img src='images/error.png' alt='Check Yes or No - Hazmat'/>" ControlToValidate="rdoHazmat"
                                                EnableClientScript="False" />
                                        </td>
                                    </tr>
                                </table>
                            </p>
                            <span style="font-weight: bold; font-size: 12px;">_______________ Shippable Units _______________</span>
                            <p>
                                <asp:Label ID="lblEachShippableUnits" CssClass="radiolbl" runat="server" AssociatedControlID="rdoEachShippableUnits">*Each:</asp:Label>
                                <table>
                                    <tr>
                                        <td>
                                            <asp:RadioButtonList ID="rdoEachShippableUnits" runat="server" RepeatDirection="Horizontal"
                                                Width="80px">
                                                <asp:ListItem Value="1" Text="Yes" />
                                                <asp:ListItem Value="0" Text="No" />
                                            </asp:RadioButtonList>
                                        </td>
                                        <td>
                                            <asp:RequiredFieldValidator ID="rqdfldrdoEachShippableUnits" runat="server" ErrorMessage="Check Yes or No - Each Shippable Units"
                                                Text="<img src='images/error.png' alt='Check Yes or No - Each Shippable Units'/>"
                                                ControlToValidate="rdoEachShippableUnits" EnableClientScript="False" />
                                        </td>
                                    </tr>
                                </table>
                            </p>
                            <p>
                                <asp:Label ID="lblCaseShippableUnits" CssClass="radiolbl" runat="server" AssociatedControlID="rdoCaseShippableUnits">*Case:</asp:Label>
                                <table>
                                    <tr>
                                        <td>
                                            <asp:RadioButtonList ID="rdoCaseShippableUnits" runat="server" RepeatDirection="Horizontal"
                                                Width="80px">
                                                <asp:ListItem Value="1" Text="Yes" />
                                                <asp:ListItem Value="0" Text="No" />
                                            </asp:RadioButtonList>
                                        </td>
                                        <td>
                                            <asp:RequiredFieldValidator ID="rqdfldrdoCaseShippableUnits" runat="server" ErrorMessage="Check Yes or No - Case Shippable Units"
                                                Text="<img src='images/error.png' alt='Check Yes or No - Case Shippable Units'/>"
                                                ControlToValidate="rdoCaseShippableUnits" EnableClientScript="False" />
                                        </td>
                                    </tr>
                                </table>
                            </p>
                            <p>
                                <asp:Label ID="lblMasterPackShippableUnits" CssClass="radiolbl" runat="server" AssociatedControlID="rdoMasterPackShippableUnits">*Master Pack:</asp:Label>
                                <table>
                                    <tr>
                                        <td>
                                            <asp:RadioButtonList ID="rdoMasterPackShippableUnits" runat="server" RepeatDirection="Horizontal"
                                                Width="80px">
                                                <asp:ListItem Value="1" Text="Yes" />
                                                <asp:ListItem Value="0" Text="No" />
                                            </asp:RadioButtonList>
                                        </td>
                                        <td>
                                            <asp:RequiredFieldValidator ID="rqdfldrdoMasterPackShippableUnits" runat="server"
                                                ErrorMessage="Check Yes or No - Master Pack Shippable Units" Text="<img src='images/error.png' alt='Check Yes or No - Master Pack Shippable Units'/>"
                                                ControlToValidate="rdoMasterPackShippableUnits" EnableClientScript="False" />
                                        </td>
                                    </tr>
                                </table>
                            </p>
                            <p>
                                <asp:Label ID="lblSkidShippableUnits" CssClass="radiolbl" runat="server" AssociatedControlID="rdoSkidShippableUnits">*Skid:</asp:Label>
                                <table>
                                    <tr>
                                        <td>
                                            <asp:RadioButtonList ID="rdoSkidShippableUnits" runat="server" RepeatDirection="Horizontal"
                                                Width="80px">
                                                <asp:ListItem Value="1" Text="Yes" />
                                                <asp:ListItem Value="0" Text="No" />
                                            </asp:RadioButtonList>
                                        </td>
                                        <td>
                                            <asp:RequiredFieldValidator ID="rqdfldSkidShippableUnits" runat="server" ErrorMessage="Check Yes or No - SKid Shippable Units"
                                                Text="<img src='images/error.png' alt='Check Yes or No - Skid Shippable Units'/>"
                                                ControlToValidate="rdoSkidShippableUnits" EnableClientScript="False" />
                                        </td>
                                    </tr>
                                </table>
                            </p>
                            <p>
                                <asp:Label ID="lblProductLifeCycle" runat="server" AssociatedControlID="ddlProductLifeCycle">*Product Life Cycle:</asp:Label>
                                <asp:DropDownList ID="ddlProductLifeCycle" CssClass="ddlist" runat="server" DataValueField="ProdLifeCycle"
                                    DataTextField="ProdLifeCycleDescription">
                                </asp:DropDownList>
                                <asp:RequiredFieldValidator ID="rqdfldddlProductLifeCyle" runat="server" ErrorMessage="Select a Product Life Cycle"
                                    Text="<img src='images/error.png' alt='Select a Product Life Cycle'/>" ControlToValidate="ddlProductLifeCycle"
                                    EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblFirstWhseAvailDate" runat="server" AssociatedControlID="txtFirstWhseAvailDate">*First Warehouse Availability Date (AV):</asp:Label>
                                <asp:TextBox ID="txtFirstWhseAvailDate" runat="server" CssClass="textEntry"></asp:TextBox>
                                <asp:RequiredFieldValidator runat="server" ErrorMessage="First Warehouse Avail date is required."
                                    Text="<img src='images/error.png' alt='First Warehouse Avail data is required.'/>"
                                    ID="rqdfldtxtFirstWhseAvailDate" ControlToValidate="txtFirstWhseAvailDate" EnableClientScript="False" />
                            </p>
                            <p>
                                <asp:Label ID="lblrdoPurchQuest" runat="server" AssociatedControlID="rdoPurchQuest">*Is this material an External Purchased Material?</asp:Label>
                                <asp:RadioButtonList ID="rdoPurchQuest" runat="server" RepeatDirection="Horizontal"
                                    Width="80px">
                                    <asp:ListItem Value="1" Text="Yes" />
                                    <asp:ListItem Value="0" Text="No" Selected="True" />
                                </asp:RadioButtonList>
                            </p>
                        </fieldset>
                        <fieldset id="fldsetExtPurch">
                            <legend>Purchase Info Record - Costing Information</legend>
                            <p>
                                <asp:HiddenField ID="hdntxtmmCostingID" runat="server" />
                                <asp:Label ID="lblMFGSku" runat="server" AssociatedControlID="txtMFGSku">Mfg SKU #:</asp:Label>
                                <asp:TextBox ID="txtMFGSku" runat="server" CssClass="textEntry" MaxLength="35"></asp:TextBox>
                            </p>
                            <p>
                                <asp:Label ID="lblVendor" runat="server" AssociatedControlID="txtVendor">*Vendor:</asp:Label><br />
                                <asp:DropDownList ID="ddlVendors" CssClass="ddlistlong" runat="server" DataValueField="VendorCode"
                                    DataTextField="VendorDisplay" AutoPostBack="True" >
                                </asp:DropDownList>
                                <act:ListSearchExtender ID="ListSearchExtddlVendors" runat="server" TargetControlID="ddlVendors"
                                    PromptCssClass="DontShowListSearchPrompt" Enabled="True">
                                </act:ListSearchExtender>
                                <asp:UpdatePanel ID="UpdatePanel2" runat="server" UpdateMode="Conditional" RenderMode="Inline">
                                    <ContentTemplate>
                                        <asp:TextBox ID="txtVendor" runat="server" CssClass="textEntry" MaxLength="35"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="rqdfldtxtVendor" runat="server" ControlToValidate="txtVendor"
                                            EnableClientScript="False" ErrorMessage="Vendor is required for External Purchase Materials."
                                            Text="&lt;img src='images/error.png' alt='Vendor is required for External Purchase Materials'/&gt;" />
                                    </ContentTemplate>
                                    <Triggers>
                                        <asp:AsyncPostBackTrigger ControlID="ddlVendors" EventName="SelectedIndexChanged" />
                                    </Triggers>
                                </asp:UpdatePanel>
                                <p>
                                </p>
                                <p>
                                    <asp:Label ID="lblMOQ" runat="server" AssociatedControlID="txtMOQ">*MOQ:</asp:Label>
                                    <br />
                                    <asp:TextBox ID="txtMOQ" runat="server" CssClass="textEntry"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="rqdfldtxtMOQ" runat="server" ControlToValidate="txtMOQ"
                                        EnableClientScript="False" Enabled="False" ErrorMessage="MOQ is required for External Purchase Materials. Format must be numeric."
                                        Text="&lt;img src='images/error.png' alt='MOQ is required for External Purchase Materials.'/&gt;"
                                        ValidationGroup="[0-9]+"></asp:RequiredFieldValidator>
                                    <asp:RegularExpressionValidator ID="rqdNumber" runat="server" ControlToValidate="txtMOQ"
                                        EnableClientScript="False" ErrorMessage="MOQ is required for External Purchase Materials. Must be numeric."
                                        Text="&lt;img src='images/error.png' alt='MOQ is required for External Purchase Materials.'/&gt; MUST BE NUMERIC."
                                        ValidationExpression="[0-9]+" />
                                </p>
                                <p>
                                    <asp:Label ID="lblVendorLeadtime" runat="server" AssociatedControlID="txtVendorLeadtime">*Vendor Leadtime (number of days):</asp:Label>
                                    <asp:TextBox ID="txtVendorLeadtime" runat="server" CssClass="textEntry"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="rqdtxtVendorLeadtime" runat="server" ControlToValidate="txtVendorLeadtime"
                                        EnableClientScript="False" Enabled="False" ErrorMessage="Vendor Leadtime is required for External Purchase Materials. Format must be numeric."
                                        Text="&lt;img src='images/error.png' alt='Vendor leadtime is required for External Purchase Materials.'/&gt;"
                                        ValidationGroup="[0-9]+"></asp:RequiredFieldValidator>
                                    <asp:RegularExpressionValidator ID="rqdExpVendorLeadtime" runat="server" ControlToValidate="txtVendorLeadtime"
                                        EnableClientScript="False" ErrorMessage="Vendor Leadtime is required for External Purchase Materials. Format must be numeric."
                                        Text="&lt;img src='images/error.png' alt='Vendor leadtime is required for External Purchase Materials.'/&gt; MUST BE NUMERIC."
                                        ValidationExpression="[0-9]+" />
                                </p>
                                <p>
                                    <asp:Label ID="lblFOBPort" runat="server" AssociatedControlID="txtFOBPort">*FOB Port:</asp:Label>
                                    <br />
                                    <asp:TextBox ID="txtFOBPort" runat="server" CssClass="textEntry" MaxLength="28"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="rqdfldtxtFOBPort" runat="server" ControlToValidate="txtFOBPort"
                                        EnableClientScript="False" Enabled="False" ErrorMessage="FOB Port is required for External Purchase Materials"
                                        Text="&lt;img src='images/error.png' alt='FOB Port is required for External Purchase Materials'/&gt;"></asp:RequiredFieldValidator>
                                </p>
                                <p>
                                    <asp:Label ID="lblFOBPrice" runat="server" AssociatedControlID="txtFOBPrice">*FOB Price:</asp:Label>
                                    <asp:TextBox ID="txtFOBPrice" runat="server" CssClass="textEntry"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="rqdfldtxtFOBPrice" runat="server" ControlToValidate="txtFOBPrice"
                                        EnableClientScript="False" Enabled="False" ErrorMessage="FOB Price is required for External Purchase Materials. Format must be decimal (99.99)."
                                        Text="&lt;img src='images/error.png' alt='FOB Price is required for External Purchase Materials'/&gt;"></asp:RequiredFieldValidator>
                                    <asp:RegularExpressionValidator ID="rqdMoney" runat="server" ControlToValidate="txtFOBPrice"
                                        EnableClientScript="False" ErrorMessage="FOB Price is required for External Purchase Materials. Format must be decimal (99.99)."
                                        Text="&lt;img src='images/error.png' alt='FOB Price is required for External Purchase Materials'/&gt; MUST BE NUMERIC."
                                        ValidationExpression="\d+(\.\d{1,2})?" />
                                </p>
                                <p>
                                    <asp:Label ID="lblARTooling" runat="server" AssociatedControlID="txtARTooling">A/R # (tooling):</asp:Label>
                                    <asp:TextBox ID="txtARTooling" runat="server" CssClass="textEntry" MaxLength="50"></asp:TextBox>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                            </p>
                        </fieldset>
                    </div>
                    <div class="clear">
                    </div>
                    <div>
                    </div>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel runat="server" ID="tpnlPlantsSalesOrg" HeaderText="Plants &amp; Sales Org.">
                <ContentTemplate>
                    <div class="divfloatleft">
                        <fieldset class="mmaster">
                            <legend>Material Master - Plants &amp; Sales Org. Info.</legend>
                            <p>
                                <span style="font-weight: bold; font-size: 12px;">___________*Set up in Plants: ___________
                                </span>
                                <asp:CheckBoxList ID="ckblPLANTID" runat="server" CssClass="chkboxlist">
                                    <asp:ListItem Value="1000">1000 / Wichita, KS</asp:ListItem>
                                    <asp:ListItem Value="1100">1100 / Sauk Rapids, MN</asp:ListItem>
                                    <asp:ListItem Value="1200">1200 / Gardner, KS</asp:ListItem>
                                    <asp:ListItem Value="1800">1800 / Arvato</asp:ListItem>
                                    <asp:ListItem Value="2000">2000 / New Braunfels, TX</asp:ListItem>
                                    <asp:ListItem Value="3000">3000 / US COO Virtual </asp:ListItem>
                                    <asp:ListItem Value="4000">4000 / US POE Virtual</asp:ListItem>
                                    <asp:ListItem Value="6000">6000 / HUDD 3PL</asp:ListItem>
                                    <asp:ListItem Value="1300">1300 / Brampton, Canada</asp:ListItem>
                                    <asp:ListItem Value="1400">1400 / Canada 3PL Fuel</asp:ListItem>
                                    <asp:ListItem Value="4100">4100 / France - ADG Gas Plant/Gas Warehouse</asp:ListItem>
                                    <asp:ListItem Value="4110">4110 / DSV Corbas</asp:ListItem>
                                    <asp:ListItem Value="4120">4120 / Italy Factory</asp:ListItem>
                                    <asp:ListItem Value="4130">4130 / Italy LED</asp:ListItem>
                                    <asp:ListItem Value="4140">4140 / Italy Tergas</asp:ListItem>
                                    <asp:ListItem Value="4150">4150 / France COO Virtual</asp:ListItem>
                                    <asp:ListItem Value="4160">4160 / France POE Virtual</asp:ListItem>
                                    <asp:ListItem Value="4170">4170 / Italy LAR S.P.A.</asp:ListItem>
                                    <asp:ListItem Value="4180">4180 / LAR S.P.A.</asp:ListItem>
                                    <asp:ListItem Value="4190">4190 / Primagaz Belgium NV/SA</asp:ListItem>
                                    <asp:ListItem Value="4200">4200 / Primagaz Netherland NY</asp:ListItem>
                                    <asp:ListItem Value="4210">4210 / Coleman Benelux BV</asp:ListItem>
                                    <asp:ListItem Value="4220">4220 / Bibby Distribution LTD - UK</asp:ListItem>
                                    <asp:ListItem Value="4230">4230 / Calor LTD - UK</asp:ListItem>
                                    <asp:ListItem Value="4240">4240 / Campinggaz (Schweiz) AG</asp:ListItem>
                                    <asp:ListItem Value="4250">4250 / Praly SA - Switzerland</asp:ListItem>
                                    <asp:ListItem Value="4260">4260 / UK FOB COO</asp:ListItem>
                                    <asp:ListItem Value="4270">4270 / UK DDP</asp:ListItem>
                                    <asp:ListItem Value="4280">4280 / Camping Gaz (Deutschland) GMBH</asp:ListItem>
                                    <asp:ListItem Value="4290">4290 / Primagaz Zentrale</asp:ListItem>
                                    <asp:ListItem Value="4300">4300 / Goetz/GMBH</asp:ListItem>
                                    <asp:ListItem Value="4310">4310 / CBL Logista</asp:ListItem>
                                    <asp:ListItem Value="4320">4320 / Camping Gaz Czech</asp:ListItem>
                                    <asp:ListItem Value="4330">4330 / DSV Solution Poland</asp:ListItem>
                                    <asp:ListItem Value="4340">4340 / GN Keri KFT Hungary</asp:ListItem>
                                </asp:CheckBoxList>
                            </p>
                        </fieldset>
                    </div>
                    <div class="divfloatright">
                        <fieldset class="mmaster">
                            <legend>Plants & Sales Org. (continued)</legend><span style="font-weight: bold; font-size: 12px;">
                                __________*Sales Organization Set Up:__________</span>
                            <br />
                            <asp:CheckBoxList ID="ckblSalesOrgID" runat="server" CssClass="chkboxlist" Width="200px">
                                <asp:ListItem Value="S217">S217 / US</asp:ListItem>
                                <asp:ListItem Value="S234">S234 / Latin</asp:ListItem>
                                <asp:ListItem Value="S317">S317 / Canada</asp:ListItem>
                                <asp:ListItem Value="2630">2630 / France</asp:ListItem>
                                <asp:ListItem Value="2640">2640 / Deutschland</asp:ListItem>
                                <asp:ListItem Value="4220">4220 / Portugal</asp:ListItem>
                                <asp:ListItem Value="4225">4225 / Italy</asp:ListItem>
                                <asp:ListItem Value="4245">4245 / Switzerland</asp:ListItem>
                                <asp:ListItem Value="4265">4265 / Czech</asp:ListItem>
                                <asp:ListItem Value="5310">5310 / UK</asp:ListItem>
                                <asp:ListItem Value="6390">6390 / Netherland</asp:ListItem>
                                <asp:ListItem Value="6785">6785 / Spain</asp:ListItem>
                            </asp:CheckBoxList>
                        </fieldset>
                    </div>
                    <div class="clear">
                    </div>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel runat="server" ID="tpnlUOM" HeaderText="Dimensions - EANs">
                <ContentTemplate>
                    <fieldset>
                        <legend>Dimensions - Weights - EANs</legend>
                        <p>
                            <asp:Label ID="lblrdoMeasureType" runat="server" Text="Specify Unit of Measure:"
                                AssociatedControlID="rdoMeasureType"></asp:Label>
                            <asp:RadioButtonList ID="rdoMeasureType" runat="server" RepeatDirection="Horizontal">
                                <asp:ListItem Value="EM" Selected="True">Imperial (IN, LB)</asp:ListItem>
                                <asp:ListItem Value="ME">Metric (CM, KG)</asp:ListItem>
                            </asp:RadioButtonList>
                        </p>
                        <br />
                        <table id="tblUOM" class="uom">
                            <tr>
                                <th id="UOMth">
                                    Units of Measure
                                </th>
                                <th>
                                    Quantity
                                </th>
                                <th>
                                    Length
                                </th>
                                <th>
                                    Width
                                </th>
                                <th>
                                    Height
                                </th>
                                <th>
                                    EAN Category
                                </th>
                                <th>
                                    EAN Code
                                </th>
                                <th>
                                    Gross Weight
                                </th>
                                <th>
                                    Net Weight
                                </th>
                            </tr>
                            <tr>
                                <!-- EACH -->
                                <td>
                                    *Each<asp:TextBox ID="txtEach" runat="server" Visible="False" Text="EA" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtQuantityEA" runat="server" CssClass="textEntryDims" />
                                    <asp:RequiredFieldValidator runat="server" ErrorMessage="A quantity for Each is required."
                                        Text="!" Font-Bold="True" ForeColor="Red" ID="rqdfldtxtQuantityEA" ControlToValidate="txtQuantityEA"
                                        EnableClientScript="False" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtLengthEA" runat="server" CssClass="textEntryDims" />
                                    <asp:RequiredFieldValidator runat="server" ErrorMessage="A length for Each is required."
                                        Text="!" Font-Bold="True" ForeColor="Red" ID="rqdfldtxtLengthEA" ControlToValidate="txtLengthEA"
                                        EnableClientScript="False" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtWidthEA" runat="server" CssClass="textEntryDims" />
                                    <asp:RequiredFieldValidator runat="server" ErrorMessage="A width for Each is required."
                                        Text="!" Font-Bold="True" ForeColor="Red" ID="rqdfldtxtWidthEA" ControlToValidate="txtWidthEA"
                                        EnableClientScript="False" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtHeightEA" runat="server" CssClass="textEntryDims" />
                                    <asp:RequiredFieldValidator runat="server" ErrorMessage="A height for Each is required."
                                        Text="!" Font-Bold="True" ForeColor="Red" ID="rqdfldtxtHeight" ControlToValidate="txtHeightEA"
                                        EnableClientScript="False" />
                                </td>
                                <td>
                                    <asp:DropDownList ID="ddlEANTypeEA" runat="server" CssClass="uom" AutoPostBack="True"
                                        >
                                        <asp:ListItem Selected="True">Select EAN type..</asp:ListItem>
                                        <asp:ListItem Value="ZE">GTIN-13 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZI">GTIN-14 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZU">GTIN-12 bar code</asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                                <td>
                                    <asp:TextBox ID="txtEANCodeEA" runat="server" CssClass="textEntryDimsEANCode" />
                                    <td>
                                        <asp:TextBox ID="txtGrossWeightEA" runat="server" CssClass="textEntryDims" />
                                        <asp:RequiredFieldValidator runat="server" ErrorMessage="Gross Weight for Each is required."
                                            Text="!" Font-Bold="True" ForeColor="Red" ID="rqdfldtxtGrossWeightEA" ControlToValidate="txtGrossWeightEA"
                                            EnableClientScript="False" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtNetWeightEA" runat="server" CssClass="textEntryDims" />
                                        <asp:RequiredFieldValidator runat="server" ErrorMessage="Net Weight for Each is required."
                                            Text="!" Font-Bold="True" ForeColor="Red" ID="rqdfldtxtNetWeightEA" ControlToValidate="txtNetWeightEA"
                                            EnableClientScript="False" />
                                    </td>
                                    <asp:HiddenField ID="txtmmUOMidEA" runat="server" Value="0" />
                            </tr>
                            <tr>
                                <td>
                                    Case / Carton<asp:TextBox ID="txtCase" runat="server" Visible="False" Text="CS" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtQuantityCS" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtLengthCS" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtWidthCS" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtHeightCS" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:DropDownList ID="ddlEANTypeCS" runat="server" CssClass="uom" AutoPostBack="True">
                                        <asp:ListItem Selected="True">Select EAN type..</asp:ListItem>
                                        <asp:ListItem Value="ZE">GTIN-13 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZI">GTIN-14 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZU">GTIN-12 bar code</asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                                <td>
                                    <asp:TextBox ID="txtEANCodeCS" runat="server" CssClass="textEntryDimsEANCode" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtGrossWeightCS" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtNetWeightCS" runat="server" CssClass="textEntryDims" />
                                </td>
                                <asp:HiddenField ID="txtmmUOMidCS" runat="server" Value="0" />
                            </tr>
                            <tr>
                                <!-- MASTERPACK -->
                                <td>
                                    Masterpack<asp:TextBox ID="txtMasterpack" runat="server" Visible="False" Text="PAK" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtQuantityPAK" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtLengthPAK" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtWidthPAK" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtHeightPAK" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:DropDownList ID="ddlEANTypePAK" runat="server" CssClass="uom" AutoPostBack="True">
                                        <asp:ListItem Selected="True">Select EAN type..</asp:ListItem>
                                        <asp:ListItem Value="ZE">GTIN-13 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZI">GTIN-14 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZU">GTIN-12 bar code</asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                                <td>
                                    <asp:TextBox ID="txtEANCodePAK" runat="server" CssClass="textEntryDimsEANCode" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtGrossWeightPAK" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtNetWeightPAK" runat="server" CssClass="textEntryDims" />
                                </td>
                                <asp:HiddenField ID="txtmmUOMidPAK" runat="server" Value="0" />
                            </tr>
                            <tr>
                                <!-- SOURCE MULTIPACK  -->
                                <td>
                                    Source Multipack<asp:TextBox ID="txtSourcedMultiPack" runat="server" Visible="False"
                                        Text="KAR" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtQuantityKAR" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtLengthKAR" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtWidthKAR" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtHeightKAR" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:DropDownList ID="ddlEANTypeKAR" runat="server" CssClass="uom" AutoPostBack="True">
                                        <asp:ListItem Selected="True">Select EAN type..</asp:ListItem>
                                        <asp:ListItem Value="ZE">GTIN-13 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZI">GTIN-14 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZU">GTIN-12 bar code</asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                                <td>
                                    <asp:TextBox ID="txtEANCodeKAR" runat="server" CssClass="textEntryDimsEANCode" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtGrossWeightKAR" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtNetWeightKAR" runat="server" CssClass="textEntryDims" />
                                </td>
                                <asp:HiddenField ID="txtmmUOMidKAR" runat="server" Value="0" />
                            </tr>
                            <tr>
                                <!-- SKID -->
                                <td>
                                    Skid<asp:TextBox ID="txtSkid" runat="server" Visible="False" Text="PAL" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtQuantityPAL" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtLengthPAL" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtWidthPAL" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtHeightPAL" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:DropDownList ID="ddlEANTypePAL" runat="server" CssClass="uom" AutoPostBack="True">
                                        <asp:ListItem Selected="True">Select EAN type..</asp:ListItem>
                                        <asp:ListItem Value="ZE">GTIN-13 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZI">GTIN-14 bar code</asp:ListItem>
                                        <asp:ListItem Value="ZU">GTIN-12 bar code</asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                                <td>
                                    <asp:TextBox ID="txtEANCodePAL" runat="server" CssClass="textEntryDimsEANCode" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtGrossWeightPAL" runat="server" CssClass="textEntryDims" />
                                </td>
                                <td>
                                    <asp:TextBox ID="txtNetWeightPAL" runat="server" CssClass="textEntryDims" />
                                </td>
                                <asp:HiddenField ID="txtmmUOMidPAL" runat="server" Value="0" />
                            </tr>
                        </table>
                    </fieldset>
                    <br />
                    <fieldset>
                        <legend>Additional EAN Numbers</legend>
                        <asp:Label ID="lblAddlUOM" runat="server" Text="Unit of Measure:"></asp:Label>
                        <asp:DropDownList ID="ddlAddlUOM" runat="server">
                            <asp:ListItem Selected="True">Select one..</asp:ListItem>
                            <asp:ListItem Value="EA">Each</asp:ListItem>
                            <asp:ListItem Value="CS">Case / Carton</asp:ListItem>
                            <asp:ListItem Value="PAK">Masterpack</asp:ListItem>
                            <asp:ListItem Value="KAR">Sourced Multipack</asp:ListItem>
                            <asp:ListItem Value="PAL">Skid</asp:ListItem>
                        </asp:DropDownList>
                        <asp:Label ID="lblAddlEANType" runat="server" Text="EAN Type:"></asp:Label>
                        <asp:DropDownList ID="ddlAddlUOMType" runat="server">
                            <asp:ListItem Selected="True">Select EAN type..</asp:ListItem>
                            <asp:ListItem Value="ZE">GTIN-13 bar code</asp:ListItem>
                            <asp:ListItem Value="ZI">GTIN-14 bar code</asp:ListItem>
                            <asp:ListItem Value="ZU">GTIN-12 bar code</asp:ListItem>
                        </asp:DropDownList>
                        <asp:Label ID="lblAddlEANNumber" runat="server" Text="EAN Number:"></asp:Label>
                        <asp:TextBox ID="txtAddlEANNumber" runat="server"></asp:TextBox>
                        <asp:Button ID="btnAddlEANAdd" runat="server" Text="Add Row" CssClass="button" />
                        <div>
                            <br />
                            <div style="padding-left: 90px;">
                                <asp:GridView ID="grdUOMAddl" runat="server" CssClass="uom" AutoGenerateColumns="False"
                                    Width="80%" DataKeyNames="mmUOMidAddid">
                                    <Columns>
                                        <asp:BoundField DataField="mmUOMidAddid" HeaderText="ID Num" Visible="False" />
                                        <asp:BoundField HeaderText="Unit of Measure" DataField="MeasureType" />
                                        <asp:BoundField HeaderText="Measure Type" DataField="EANType" />
                                        <asp:BoundField HeaderText="EAN Code" DataField="EANCode" />
                                        <asp:TemplateField HeaderText="Delete">
                                            <ItemTemplate>
                                                <asp:LinkButton ID="LinkButton1" runat="server">Delete</asp:LinkButton>
                                            </ItemTemplate>
                                        </asp:TemplateField>
                                    </Columns>
                                    <SelectedRowStyle BackColor="#C5BBAF" Font-Bold="True" ForeColor="#333333" />
                                    <EditRowStyle BackColor="#7C6F57" />
                                </asp:GridView>
                            </div>
                        </div>
                    </fieldset>
                </ContentTemplate>
            </act:TabPanel>
            <act:TabPanel runat="server" ID="tpnlClassification" HeaderText="Classification">
                <ContentTemplate>
                    <table style="width: 100%">
                        <tr>
                            <td>
                                <act:TabContainer ID="TabContainer1" runat="server" ActiveTabIndex="0" Width="887px">
                                    <act:TabPanel ID="TabPanel1" runat="server" HeaderText="TabPanel1">
                                        <HeaderTemplate>
                                            Material Class Attributes for Hang Tags (PFD Only)
                                        </HeaderTemplate>
                                        <ContentTemplate>
                                            <table style="border: 1px solid #2A4C30; width: 65%; background-color: #F7FCF7;">
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblHTWeight" runat="server" AssociatedControlID="txtHTWeight">Weight Description for Hang Tag:</asp:Label>
                                                        <asp:HiddenField ID="txtMMClassID" runat="server" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:TextBox ID="txtHTWeight" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblHTChest" runat="server" AssociatedControlID="txtHTChest">Chest Description for Hang Tag:</asp:Label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:TextBox ID="txtHTChest" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblHTColor" runat="server" AssociatedControlID="txtHTColor">Color Description for Hang Tag:</asp:Label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:TextBox ID="txtHTColor" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblHTSize" runat="server" AssociatedControlID="txtHTSize">Size Description for Hang Tag:</asp:Label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:TextBox ID="txtHTSize" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblMQType" runat="server" AssociatedControlID="txtHTSize">MQ &amp; Type:</asp:Label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:TextBox ID="txtMQType" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                            </table>
                                        </ContentTemplate>
                                    </act:TabPanel>
                                    <act:TabPanel ID="TabPanel2" runat="server" HeaderText="TabPanel2">
                                        <HeaderTemplate>
                                            Material Class Product Attributes
                                        </HeaderTemplate>
                                        <ContentTemplate>
                                            <table style="border: 1px solid #2a4c30; width: 90%; background-color: #F7FCF7;">
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAPos" runat="server" AssociatedControlID="txtPAPos">POS or Gas Bottle:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAPos" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAlanguage" runat="server" AssociatedControlID="txtPAPOSLanguage">POS Language:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAPOSLanguage" runat="server" CssClass="textEntry"></asp:TextBox>
                                                        <br />
                                                        <asp:DropDownList ID="ddlPALanguage" runat="server" AutoPostBack="True"
                                                            DataTextField="TextValue" DataValueField="SelectedValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAUseDims" runat="server" AssociatedControlID="txtPAUseDims">Usage Dimensions for Material:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAUseDims" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPACover" runat="server" AssociatedControlID="txtPACover">Cover:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPACover" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPALiner" runat="server" AssociatedControlID="txtPALiner">Liner:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPALiner" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPATempRate" runat="server" AssociatedControlID="txtPATempRate">Temperature Rating:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPATempRate" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAFillWgtType" runat="server" AssociatedControlID="txtPAFillWgtType">Fill weight/type:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAFillWgtType" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAFrameMat" runat="server" AssociatedControlID="txtPAFrameMat">Frame material:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAFrameMat" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAWgtRate" runat="server" AssociatedControlID="txtPAWgtRate">Weight Rating:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAWgtRate" runat="server" CssClass="textEntry" Height="16px"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAGasWgt" runat="server" AssociatedControlID="ddlPAGasWeight">Net Weight of Gas (g)</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlPAGasWeight" runat="server" CssClass="textEntry" DataTextField="TextValue" DataValueField="TextValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAEMEAPart" runat="server" AssociatedControlID="txtPAEMEAPart">EMEA Repair Part:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAEMEAPart" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAGasVolume" runat="server" AssociatedControlID="ddlGasVolume">Gas Volume (L):</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlGasVolume" runat="server" CssClass="textEntry" 
                                                            DataTextField="TextValue" DataValueField="TextValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPABedDim" runat="server" AssociatedControlID="txtPAInflateBedDim">Inflated Bed Dimensions:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAInflateBedDim" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPABedMaterial" runat="server" AssociatedControlID="txtPABedMaterial">Bed Material:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPABedMaterial" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPABedMaterial0" runat="server" AssociatedControlID="txtPAMaterialGaugeTop">Material Gauge - Top:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAMaterialGaugeTop" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPABedMaterial1" runat="server" AssociatedControlID="txtPAMaterialGaugeSides">Material Gauge - Sides:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAMaterialGaugeSides" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPABedMaterial2" runat="server" AssociatedControlID="txtPAMaterialGaugeBottom">Material Gauge - Bottom:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAMaterialGaugeBottom" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPASurface" runat="server" AssociatedControlID="ddlPASurfaceType">Surface Type:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlPASurfaceType" runat="server" CssClass="textEntry" DataTextField="TextValue" DataValueField="TextValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPACoilType" runat="server" AssociatedControlID="txtPACoilType">Type of Coils:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPACoilType" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAWarranty" runat="server" AssociatedControlID="txtPAWarranty">Warranty:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAWarranty" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAPumpItem" runat="server" AssociatedControlID="txtPAPumpItem">Pump Item:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAPumpItem" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAHandsFree" runat="server" AssociatedControlID="txtPAHandsFreeWand">Hands Free Wand:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAHandsFreeWand" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPACord" runat="server" AssociatedControlID="txtPACordStorage">Cord Storage:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPACordStorage" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAValve" runat="server" AssociatedControlID="txtPAValveType">Type of Valve:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAValveType" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPABedHeight" runat="server" AssociatedControlID="txtPABedHeight">Bed Height:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPABedHeight" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPACoverMaterial" runat="server" AssociatedControlID="txtPACoverMaterial">Cover Material:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPACoverMaterial" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAPantone" runat="server" AssociatedControlID="txtPAPantone">Pantone:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPAPantone" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPACarryBag" runat="server" AssociatedControlID="ddlPACarryBag">Carry Bag:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlPACarryBag" runat="server" CssClass="textEntry" DataTextField="TextValue" DataValueField="SelectedValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPACarryBagInfo" runat="server" AssociatedControlID="txtPACarryBagInfo">Carry Bag Information:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPACarryBagInfo" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblSkirt" runat="server" AssociatedControlID="ddlPASkirt">Skirt:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlPASkirt" runat="server" CssClass="textEntry" 
                                                            DataTextField="TextValue" DataValueField="SelectedValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPASkirtMaterial" runat="server" AssociatedControlID="txtPASkirtMaterial">Skirt Material:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPASkirtMaterial" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAPatternDesign" runat="server" AssociatedControlID="ddlPAPatternDesign">Pattern Design:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlPAPatternDesign" runat="server" CssClass="textEntry" 
                                                            DataTextField="TextValue" DataValueField="SelectedValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAPatternColor" runat="server" AssociatedControlID="ddlPAPatternColor">Pattern Color:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlPAPatternColor" runat="server" CssClass="textEntry" 
                                                            DataTextField="TextValue" DataValueField="SelectedValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style6">
                                                        <asp:Label ID="lblPABedColor" runat="server" AssociatedControlID="ddlPABedColor">Bed Color:</asp:Label>
                                                    </td>
                                                    <td class="style4">
                                                        <asp:DropDownList ID="ddlPABedColor" runat="server" CssClass="textEntry" 
                                                            DataTextField="TextValue" DataValueField="SelectedValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPASupportSize" runat="server" AssociatedControlID="ddlPASupportsSize">Supports up to - Size :</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlPASupportsSize" runat="server" CssClass="textEntry" 
                                                            DataTextField="TextValue" DataValueField="SelectedValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPASupportWeight" runat="server" AssociatedControlID="txtPASupportsWeight">Supports up to - Weight:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPASupportsWeight" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAContainer20" runat="server" AssociatedControlID="txtPA20ContainerQty">Container Qty - 20&#39;</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPA20ContainerQty" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAContainer40" runat="server" AssociatedControlID="txtPA40ContainerQty">Container Qty - 40&#39;</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPA40ContainerQty" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="style5">
                                                        <asp:Label ID="lblPAContainer40HC" runat="server" AssociatedControlID="txtPA40HCContainerQty">Container Qty - 40HC&#39;</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtPA40HCContainerQty" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                            </table>
                                        </ContentTemplate>
                                    </act:TabPanel>
                                    <act:TabPanel ID="TabPanel3" runat="server" HeaderText="TabPanel3">
                                        <HeaderTemplate>
                                            Licensing Classification
                                        </HeaderTemplate>
                                        <ContentTemplate>
                                            <table style="border-color: #2a4c30; border-style: solid; border-width: 1px; width: 80%;
                                                background-color: #F7FCF7;">
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="LCLicensor" runat="server" AssociatedControlID="txtLCLicensor">Licensor(s):</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtLCLicensor" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblLCRoyalBase" runat="server" AssociatedControlID="txtLCRoyalBase">Royalty Base(s):</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtLCRoyalBase" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblLCRoyalRate" runat="server" AssociatedControlID="txtLCRoyalRate">Royalty Rate(s):</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="txtLCRoyalRate" runat="server" CssClass="textEntry"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblLCLicenseAgreement" runat="server" AssociatedControlID="ddlLCLicenseAgreements">License Agreement:</asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlLCLicenseAgreements" runat="server" CssClass="textEntry"
                                                            DataTextField="TextValue" DataValueField="TextValue">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                            </table>
                                        </ContentTemplate>
                                    </act:TabPanel>
                                    <act:TabPanel ID="TabPanel4" runat="server" HeaderText="TabPanel4">
                                        <HeaderTemplate>
                                            Descriptions - Notes
                                        </HeaderTemplate>
                                        <ContentTemplate>
                                            <table style="border: 1px solid #2a4c30; width: 80%">
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblclassLang" runat="server" Text="Language:"></asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlClassLang" runat="server">
                                                            <asp:ListItem Selected="True">Select Language..</asp:ListItem>
                                                            <asp:ListItem Value="ENG">English</asp:ListItem>
                                                            <asp:ListItem Value="FRE">French</asp:ListItem>
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <asp:Label ID="lblBasicText" runat="server" AssociatedControlID="txtBasicText">Basic Text:</asp:Label>
                                                    </td>
                                                    <td>
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <asp:TextBox ID="txtBasicText" runat="server" CssClass="classtextarea" TextMode="MultiLine"></asp:TextBox>
                                                    </td>
                                                    <td>
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <asp:Label ID="lblPOText" runat="server" AssociatedControlID="txtPOText">PO Text:</asp:Label>
                                                    </td>
                                                    <td>
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <asp:TextBox ID="txtPOText" runat="server" CssClass="classtextarea" TextMode="MultiLine"></asp:TextBox>
                                                    </td>
                                                    <td>
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                            </table>
                                        </ContentTemplate>
                                    </act:TabPanel>
                                </act:TabContainer>
                            </td>
                        </tr>
                    </table>
                    <div class="clear">
                    </div>
                </ContentTemplate>
            </act:TabPanel>
        </act:TabContainer>
        <p class="submitButton">
            <asp:Button ID="btnSubmit" CssClass="button" runat="server" Text="Save for Later"
                CausesValidation="false" />
            <asp:Button ID="btnValidate" CssClass="button" runat="server" Text="Validate & Finish"
                CausesValidation="true" />
            <asp:Button ID="btnCopy" CssClass="button" runat="server" Text="Copy for New" CausesValidation="false" />
            <asp:Button ID="lbtnviewPrint" CssClass="button" runat="server" Text="Print" CausesValidation="false" />
        </p>
        <asp:Panel ID="Panel1" runat="server" BorderColor="#2b4e31" BackColor="#f7fcf7" BorderWidth="5px"
            Height="270px" Width="450px">
            <div align="center">
                <p style="vertical-align: top; margin: 20px; color: #1a3725;">
                    To Copy this MM to a new Number enter the folloiwng:</p>
                <p>
                    <asp:Label ID="lblNewECN" runat="server" Text="*New ECN Number:" AssociatedControlID="txtNewECN"></asp:Label><br />
                    <asp:TextBox ID="txtNewECN" runat="server" CssClass="textEntry"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="txtNewECN"
                        ValidationGroup="modals" Text="&lt;img src='images/error.png'&gt;" />
                </p>
                <p>
                    <asp:Label ID="lblNewMaterialNumber" runat="server" Text="New Material Number:" AssociatedControlID="txtNewMaterialNumber"></asp:Label><br />
                    <asp:TextBox ID="txtNewMaterialNumber" runat="server" CssClass="textEntry"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ControlToValidate="txtNewMaterialNumber"
                        ValidationGroup="modals" Text="&lt;img src='images/error.png'&gt;"></asp:RequiredFieldValidator>
                </p>
            </div>
            <br />
            <div align="center">
                <asp:Button CssClass="button" ID="OkButton" runat="server" Text="Create Copy" CausesValidation="true"
                    ValidationGroup="modals" />
                <asp:Button CssClass="button" ID="CancelButton" runat="server" Text="Cancel" />
            </div>
        </asp:Panel>
        <act:ModalPopupExtender ID="ModalPopupExtender1" runat="server" TargetControlID="btnCopy"
            PopupControlID="Panel1" BackgroundCssClass="modalBackground" DropShadow="true"
            CancelControlID="CancelButton" />
    </div>
    </form>
</body>
</html>
