<%@ Page Title="PagingBulletedList Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="PagingBulletedList.aspx.cs" Inherits="PagingBulletedList_PagingBulletedList" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    PagingBulletedList Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <script type="text/javascript">
        var bl;

        function pageLoad() {
            bl = $find('PagingBulletedListBehavior1');
            if(bl.get_IndexSize() == 1) $get('radioOption1').checked = true;
            if(bl.get_IndexSize() == 2) $get('radioOption2').checked = true;
            if(bl.get_MaxItemPerPage() == 10) $get('radioOption3').checked = true;
            if(bl.get_MaxItemPerPage() == 20) $get('radioOption4').checked = true;
            $get('clientSort').checked = bl.get_ClientSort();
        }

        function onChangeSelectOption() {

            if($get('radioOption1').checked) {
                bl.set_MaxItemPerPage(null);
                bl.set_IndexSize(1);
            }
            if($get('radioOption2').checked) {
                bl.set_MaxItemPerPage(null);
                bl.set_IndexSize(2);
            }
            if($get('radioOption3').checked) {
                bl.set_MaxItemPerPage(10);
            }
            if($get('radioOption4').checked) {
                bl.set_MaxItemPerPage(20);
            }
        }

        function onChangeClientSort() {
            bl.set_ClientSort($get('clientSort').checked);
        }
    </script>
    <div style="height: 420px; overflow: auto; overflow-y: scroll; border: solid 1px #CCCCCC;">
        <asp:BulletedList ID="BulletedList1" runat="server" DisplayMode="Text">
            <asp:ListItem>writeln</asp:ListItem>
            <asp:ListItem>1566</asp:ListItem>
            <asp:ListItem>4556</asp:ListItem>
            <asp:ListItem>9556776</asp:ListItem>
            <asp:ListItem>12234</asp:ListItem>
            <asp:ListItem>1566</asp:ListItem>
            <asp:ListItem>abort</asp:ListItem>
            <asp:ListItem>add</asp:ListItem>
            <asp:ListItem>addBehavior</asp:ListItem>
            <asp:ListItem>AddChannel</asp:ListItem>
            <asp:ListItem>AddDesktopComponent</asp:ListItem>
            <asp:ListItem>addElement</asp:ListItem>
            <asp:ListItem>AddFavorite</asp:ListItem>
            <asp:ListItem>addImport</asp:ListItem>
            <asp:ListItem>addPageRule</asp:ListItem>
            <asp:ListItem>addReadRequest</asp:ListItem>
            <asp:ListItem>addRule</asp:ListItem>
            <asp:ListItem>AddSearchProvider</asp:ListItem>
            <asp:ListItem>alert</asp:ListItem>
            <asp:ListItem>appendChild</asp:ListItem>
            <asp:ListItem>appendData</asp:ListItem>
            <asp:ListItem>applyElement</asp:ListItem>
            <asp:ListItem>assign</asp:ListItem>
            <asp:ListItem>attachEvent</asp:ListItem>
            <asp:ListItem>AutoCompleteSaveForm</asp:ListItem>
            <asp:ListItem>AutoScan</asp:ListItem>
            <asp:ListItem>back</asp:ListItem>
            <asp:ListItem>blur</asp:ListItem>
            <asp:ListItem>BrandImageUri</asp:ListItem>
            <asp:ListItem>ChooseColorDlg</asp:ListItem>
            <asp:ListItem>clear</asp:ListItem>
            <asp:ListItem>clear</asp:ListItem>
            <asp:ListItem>clearAttributes</asp:ListItem>
            <asp:ListItem>clearData</asp:ListItem>
            <asp:ListItem>clearInterval</asp:ListItem>
            <asp:ListItem>clearRequest</asp:ListItem>
            <asp:ListItem>clearTimeout</asp:ListItem>
            <asp:ListItem>click</asp:ListItem>
            <asp:ListItem>cloneNode</asp:ListItem>
            <asp:ListItem>close</asp:ListItem>
            <asp:ListItem>close</asp:ListItem>
            <asp:ListItem>collapse</asp:ListItem>
            <asp:ListItem>compareEndPoints</asp:ListItem>
            <asp:ListItem>componentFromPoint</asp:ListItem>
            <asp:ListItem>confirm</asp:ListItem>
            <asp:ListItem>contains</asp:ListItem>
            <asp:ListItem>createAttribute</asp:ListItem>
            <asp:ListItem>createCaption</asp:ListItem>
            <asp:ListItem>createComment</asp:ListItem>
            <asp:ListItem>createControlRange</asp:ListItem>
            <asp:ListItem>createDocumentFragment</asp:ListItem>
            <asp:ListItem>createElement</asp:ListItem>
            <asp:ListItem>createEventObject</asp:ListItem>
            <asp:ListItem>createPopup</asp:ListItem>
            <asp:ListItem>createRange</asp:ListItem>
            <asp:ListItem>createRangeCollection</asp:ListItem>
            <asp:ListItem>createStyleSheet</asp:ListItem>
            <asp:ListItem>createTextNode</asp:ListItem>
            <asp:ListItem>createTextRange</asp:ListItem>
            <asp:ListItem>createTFoot</asp:ListItem>
            <asp:ListItem>createTHead</asp:ListItem>
            <asp:ListItem>CustomizeSettings</asp:ListItem>
            <asp:ListItem>deleteCaption</asp:ListItem>
            <asp:ListItem>deleteCell</asp:ListItem>
            <asp:ListItem>deleteData</asp:ListItem>
            <asp:ListItem>deleteRow</asp:ListItem>
            <asp:ListItem>deleteTFoot</asp:ListItem>
            <asp:ListItem>deleteTHead</asp:ListItem>
            <asp:ListItem>detachEvent</asp:ListItem>
            <asp:ListItem>doImport</asp:ListItem>
            <asp:ListItem>doReadRequest</asp:ListItem>
            <asp:ListItem>doScroll</asp:ListItem>
            <asp:ListItem>dragDrop</asp:ListItem>
            <asp:ListItem>duplicate</asp:ListItem>
            <asp:ListItem>elementFromPoint</asp:ListItem>
            <asp:ListItem>empty</asp:ListItem>
            <asp:ListItem>execCommand</asp:ListItem>
            <asp:ListItem>execScript</asp:ListItem>
            <asp:ListItem>expand</asp:ListItem>
            <asp:ListItem>findText</asp:ListItem>
            <asp:ListItem>fireEvent</asp:ListItem>
            <asp:ListItem>firstPage</asp:ListItem>
            <asp:ListItem>focus</asp:ListItem>
            <asp:ListItem>forward</asp:ListItem>
            <asp:ListItem>getAdjacentText</asp:ListItem>
            <asp:ListItem>getAllResponseHeaders</asp:ListItem>
            <asp:ListItem>getAttribute</asp:ListItem>
            <asp:ListItem>getAttribute</asp:ListItem>
            <asp:ListItem>getAttributeNode</asp:ListItem>
            <asp:ListItem>getBookmark</asp:ListItem>
            <asp:ListItem>getBoundingClientRect</asp:ListItem>
            <asp:ListItem>getCharset</asp:ListItem>
            <asp:ListItem>getClientRects</asp:ListItem>
            <asp:ListItem>getData</asp:ListItem>
            <asp:ListItem>getElementById</asp:ListItem>
            <asp:ListItem>getElementsByName</asp:ListItem>
            <asp:ListItem>getElementsByTagName</asp:ListItem>
            <asp:ListItem>getExpression</asp:ListItem>
            <asp:ListItem>getNamedItem</asp:ListItem>
            <asp:ListItem>getResponseHeader</asp:ListItem>
            <asp:ListItem>go</asp:ListItem>
            <asp:ListItem>hasChildNodes</asp:ListItem>
            <asp:ListItem>hasFeature</asp:ListItem>
            <asp:ListItem>hasFocus</asp:ListItem>
            <asp:ListItem>hide</asp:ListItem>
            <asp:ListItem>inRange</asp:ListItem>
            <asp:ListItem>insertAdjacentElement</asp:ListItem>
            <asp:ListItem>insertAdjacentHTML</asp:ListItem>
            <asp:ListItem>insertAdjacentText</asp:ListItem>
            <asp:ListItem>insertBefore</asp:ListItem>
            <asp:ListItem>insertCell</asp:ListItem>
            <asp:ListItem>insertData</asp:ListItem>
            <asp:ListItem>insertRow</asp:ListItem>
            <asp:ListItem>isEqual</asp:ListItem>
            <asp:ListItem>item</asp:ListItem>
            <asp:ListItem>javaEnabled</asp:ListItem>
            <asp:ListItem>lastPage</asp:ListItem>
            <asp:ListItem>mergeAttributes</asp:ListItem>
            <asp:ListItem>move</asp:ListItem>
            <asp:ListItem>moveBy</asp:ListItem>
            <asp:ListItem>moveEnd</asp:ListItem>
            <asp:ListItem>moveRow</asp:ListItem>
            <asp:ListItem>moveStart</asp:ListItem>
            <asp:ListItem>moveTo</asp:ListItem>
            <asp:ListItem>moveToBookmark</asp:ListItem>
            <asp:ListItem>moveToElementText</asp:ListItem>
            <asp:ListItem>moveToPoint</asp:ListItem>
            <asp:ListItem>namedItem</asp:ListItem>
            <asp:ListItem>namedRecordset</asp:ListItem>
            <asp:ListItem>navigate</asp:ListItem>
            <asp:ListItem>nextPage</asp:ListItem>
            <asp:ListItem>normalize</asp:ListItem>
            <asp:ListItem>open</asp:ListItem>
            <asp:ListItem>parentElement</asp:ListItem>
            <asp:ListItem>pasteHTML</asp:ListItem>
            <asp:ListItem>previousPage</asp:ListItem>
            <asp:ListItem>print</asp:ListItem>
            <asp:ListItem>prompt</asp:ListItem>
            <asp:ListItem>queryCommandEnabled</asp:ListItem>
            <asp:ListItem>queryCommandIndeterm</asp:ListItem>
            <asp:ListItem>queryCommandState</asp:ListItem>
            <asp:ListItem>queryCommandSupported</asp:ListItem>
            <asp:ListItem>queryCommandValue</asp:ListItem>
            <asp:ListItem>recalc</asp:ListItem>
            <asp:ListItem>refresh</asp:ListItem>
            <asp:ListItem>releaseCapture</asp:ListItem>
            <asp:ListItem>reload</asp:ListItem>
            <asp:ListItem>remove</asp:ListItem>
            <asp:ListItem>removeAttribute</asp:ListItem>
            <asp:ListItem>removeAttributeNode</asp:ListItem>
            <asp:ListItem>removeBehavior</asp:ListItem>
            <asp:ListItem>removeChild</asp:ListItem>
            <asp:ListItem>removeExpression</asp:ListItem>
            <asp:ListItem>removeNamedItem</asp:ListItem>
            <asp:ListItem>removeNode</asp:ListItem>
            <asp:ListItem>removeRule</asp:ListItem>
            <asp:ListItem>replace</asp:ListItem>
            <asp:ListItem>replaceAdjacentText</asp:ListItem>
            <asp:ListItem>replaceChild</asp:ListItem>
            <asp:ListItem>replaceData</asp:ListItem>
            <asp:ListItem>replaceNode</asp:ListItem>
            <asp:ListItem>reset</asp:ListItem>
            <asp:ListItem>resizeBy</asp:ListItem>
            <asp:ListItem>resizeTo</asp:ListItem>
            <asp:ListItem>scroll</asp:ListItem>
            <asp:ListItem>scrollBy</asp:ListItem>
            <asp:ListItem>scrollIntoView</asp:ListItem>
            <asp:ListItem>scrollTo</asp:ListItem>
            <asp:ListItem>select</asp:ListItem>
            <asp:ListItem>select</asp:ListItem>
            <asp:ListItem>send</asp:ListItem>
            <asp:ListItem>setActive</asp:ListItem>
            <asp:ListItem>setAttribute</asp:ListItem>
            <asp:ListItem>setAttributeNode</asp:ListItem>
            <asp:ListItem>setCapture</asp:ListItem>
            <asp:ListItem>setData</asp:ListItem>
            <asp:ListItem>setEndPoint</asp:ListItem>
            <asp:ListItem>setExpression</asp:ListItem>
            <asp:ListItem>setInterval</asp:ListItem>
            <asp:ListItem>setNamedItem</asp:ListItem>
            <asp:ListItem>setRequestHeader</asp:ListItem>
            <asp:ListItem>setTimeout</asp:ListItem>
            <asp:ListItem>show</asp:ListItem>
            <asp:ListItem>showHelp</asp:ListItem>
            <asp:ListItem>showModalDialog</asp:ListItem>
            <asp:ListItem>showModelessDialog</asp:ListItem>
            <asp:ListItem>splitText</asp:ListItem>
            <asp:ListItem>start</asp:ListItem>
            <asp:ListItem>stop</asp:ListItem>
            <asp:ListItem>submit</asp:ListItem>
            <asp:ListItem>substringData</asp:ListItem>
            <asp:ListItem>swapNode</asp:ListItem>
            <asp:ListItem>tags</asp:ListItem>
            <asp:ListItem>taintEnabled</asp:ListItem>
            <asp:ListItem>urns</asp:ListItem>
            <asp:ListItem>write</asp:ListItem>
            <asp:ListItem>writeln</asp:ListItem>
        </asp:BulletedList>
        <ajaxToolkit:PagingBulletedListExtender ID="PagingBulletedListExtender1" runat="server"
            BehaviorID="PagingBulletedListBehavior1"
            TargetControlID="BulletedList1"
            ClientSort="true"
            IndexSize="1"
            Separator=" - "
            SelectIndexCssClass="selectIndex"
            UnselectIndexCssClass="unselectIndex" />
    </div>
    <input id="radioOption1" name="radioOption" type="radio" value="1" onclick="onChangeSelectOption()" />
    <label for="radioOption1">Index size 1</label>
    <input id="radioOption3" name="radioOption" type="radio" value="3" onclick="onChangeSelectOption()" />
    <label for="radioOption3">10 Items per page</label><br />
    <input id="radioOption2" name="radioOption" type="radio" value="2" onclick="onChangeSelectOption()" />
    <label for="radioOption2">Index size 2</label>
    <input id="radioOption4" name="radioOption" type="radio" value="4" onclick="onChangeSelectOption()" />
    <label for="radioOption4">20 Items per page</label>
    <br />
    <input type="checkbox" id="clientSort" onclick="onChangeClientSort()" />
    <label for="clientSort">Sort</label>
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>PagingBulletedList Description</Header>
        <Content>
            <p>
                PagingBulletedList is an ASP.NET AJAX extender that can be attached to an ASP.NET BulletedList
                control and provide client-side sorted paging.  It is very flexible and lets you specify
                either the number of characters used in the heading indices or the maximum number of items
                to display per index.  If the input is not sorted (either on the server or client), it will
                generated more header indices but still function appropriately.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>PagingBulletedList Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties
                are optional:
            </p>
            <pre>
&lt;ajaxToolkit:PagingBulletedListExtender ID="PBLE1" runat="server"
    TargetControlID="BulletedList1" 
    <em>ClientSort</em>="true"
    <em>IndexSize</em>="1"
    <em>MaxItemPerPage</em>="20"
    <em>Separator</em>=" - "
    <em>SelectIndexCssClass</em>="selectIndex"
    <em>UnselectIndexCssClass</em>="unSelectIndex" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the BulletedList to page</li>
                <li><strong>ClientSort</strong> - Whether or not the items should be sorted client-side</li>
                <li><strong>IndexSize</strong> - Number of characters in the index headings (ignored if MaxItemPerPage is set)</li>
                <li><strong>MaxItemPerPage</strong> - Maximum number of items per page (ignores the IndexSize property)</li>
                <li><strong>Separator</strong> - Separator text to be placed between indices</li>
                <li><strong>SelectIndexCssClass</strong> - CSS class for the selected index.</li>
                <li><strong>UnselectIndexCssClass</strong> - CSS class for indices that aren't selected</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
