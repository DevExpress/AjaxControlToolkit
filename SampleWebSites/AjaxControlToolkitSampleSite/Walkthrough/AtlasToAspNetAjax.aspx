<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Title="Converting your web pages to ASP.NET AJAX 1.0" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
        <p><strong>Migrating your web page to the ASP.NET AJAX 1.0 Beta</strong></p>
        <p>
            The release of the ASP.NET AJAX 1.0 Beta brings with it several fundamental changes.
            One of these changes is the removal of the "TargetProperties" objects found in prior
            versions.
        </p>
        <p></p>
        <p>
            Fortunately, changing your web pages to use this new format is easy. Just follow
            the steps below.</p>
        <p></p>
        
        <p><strong>Step 1: Update references</strong></p>
        <p>
            First, the name of the Toolkit assembly has changed. Update the reference in your
            website from "AtlasControlToolkit" to "AjaxControlToolkit". Then update any Register
            directives in your pages so that
        </p>
        <p></p>
        <p>
            <code>&lt;%<font color="#0000ff" size="2">@</font><font size="2"> </font><font
                color="#800000" size="2">Register<br />
            </font><font color="#ff0000" size="2">   Assembly</font><font color="#0000ff"
                size="2">="AtlasControlToolkit"</font><font size="2"></font><font color="#ff0000"
                    size="2"><br />
                       Namespace</font><font color="#0000ff" size="2">="AtlasControlToolkit"<br />
                           </font><font color="#ff0000" size="2">TagPrefix</font><font
                            color="#0000ff" size="2">="atlasToolkit"</font><font size="2"></font>
            %&gt;
        </code>
        becomes
        <p>
        </p>
        <p>
            <code>&lt;%<font color="#0000ff" size="2">@</font><font size="2"> </font><font color="#800000"
                size="2">Register<br />
                   </font><font color="#ff0000" size="2">Assembly</font><font color="#0000ff"
                    size="2">="AjaxControlToolkit"<br />
                       </font><font color="#ff0000" size="2">Namespace</font><font
                        color="#0000ff" size="2">="AjaxControlToolkit"<br />
                           </font><font color="#ff0000" size="2">TagPrefix</font><font
                            color="#0000ff" size="2">="ajaxToolkit"</font><font size="2"></font>
                %&gt;</code></p>
        <p>
        </p>
        <p>
            <strong>
                <br />
                Step 2: Create an extender instance for each Properties object</strong></p>
        <p>
            The new ASP.NET AJAX 1.0 Extensions have moved away from the TargetProperties concept.
            For simplicity, the properties are now declared directly on the Extender. So, for
            each properties object in your old code, you'll need an extender instance.</p>
        <code><font color="#0000ff" size="2">
            <p>
            </p>
            &lt;</font><font color="#800000" size="2">atlasToolkit</font><font color="#0000ff"
                size="2">:</font><font color="#800000" size="2">ConfirmButtonExtender<br />
                </font><font color="#ff0000" size="2">  ID</font><font color="#0000ff"
                    size="2">="cbe1"</font><font size="2"> </font><font color="#ff0000" size="2">runat</font><font
                        color="#0000ff" size="2">="server"&gt;
                        <p>
                        </p>
                    </font><font size="2">
                        <p>
                        </p>
                    </font><font color="#0000ff" size="2">  &lt;</font><font color="#800000"
                        size="2">atlasToolkit</font><font color="#0000ff" size="2">:</font><font color="#800000"
                            size="2">ConfirmButtonProperties<br />
                                </font><font color="#ff0000" size="2">TargetControlID</font><font
                                color="#0000ff" size="2">="LinkButton1"<br />
                            </font><font color="#ff0000" size="2">    ConfirmText</font><font
                                color="#0000ff" size="2">="Delete Item?"</font><font size="2"> </font>
            <font color="#0000ff" size="2">/&gt;
                <p>
                </p>
            </font><font size="2">
                <p>
                </p>
            </font><font color="#0000ff" size="2">  &lt;</font><font color="#800000"
                size="2">atlasToolkit</font><font color="#0000ff" size="2">:</font><font color="#800000"
                    size="2">ConfirmButtonProperties<br />
                        </font><font color="#ff0000" size="2">TargetControlID</font><font
                        color="#0000ff" size="2">="LinkButton2"<br />
                    </font><font color="#ff0000" size="2">    ConfirmText</font><font
                        color="#0000ff" size="2">="Update Item?"</font><font size="2"> </font>
            <font color="#0000ff" size="2">/&gt;
                <p>
                </p>
                <p>
                </p>
                &lt;/</font><font color="#800000" size="2">atlasToolkit</font><font color="#0000ff"
                    size="2">:</font><font color="#800000" size="2">ConfirmButtonExtender</font><font
                        color="#0000ff" size="2">&gt;</font> </code>
        <p>
        </p>
        <p>
        </p>
        becomes
        <p>
            <span style="font-size: 10pt"></span>
        </p>
        <p>
            <code><font color="#0000ff" size="2">&lt;</font><font color="#800000" size="2">ajaxToolkit</font><font
                color="#0000ff" size="2">:</font><font color="#800000" size="2">ConfirmButtonExtender<br />
                      </font><font color="#ff0000" size="2">ID</font><font color="#0000ff"
                        size="2">="cbe1"</font><font size="2"> </font><font color="#ff0000" size="2">runat</font><font
                            color="#0000ff" size="2">="server"</font><font size="2"></font><font size="2">
                            </font><font color="#0000ff" size="2">/&gt;</font><font color="#0000ff" size="2"></font>
                <font color="#0000ff" size="2"><font size="2">
                    <br />
                </font><font color="#0000ff" size="2">&lt;</font><font color="#800000" size="2">ajaxToolkit</font><font
                    color="#0000ff" size="2">:</font><font color="#800000" size="2">ConfirmButtonExtender<br />
                          </font><font color="#ff0000" size="2">ID</font><font color="#0000ff"
                            size="2">="cbe2"</font> <font color="#ff0000" size="2">runat</font><font color="#0000ff"
                                size="2">="server"</font><font color="#0000ff" size="2">/&gt;</font><font size="2">
                                </font></font></code>
        </p>
        <p>
            <strong></strong></p>
        <p>
            <strong>Step 3: Move properties declarations to the Extender classes</strong></p>
        <p>
            Copy the properties declarations from your properties objects to the new Extender
            instances<span style="font-size: 10pt"> </span>
        </p>
        <code><font color="#0000ff" size="2">&lt;</font><font color="#800000" size="2">ajaxToolkit</font><font
            color="#0000ff" size="2">:</font><font color="#800000" size="2">ConfirmButtonExtender<br />
                  </font><font color="#ff0000" size="2">ID</font><font color="#0000ff"
                    size="2">="cbe12"<br />
                      </font><font color="#ff0000" size="2">runat</font><font color="#0000ff"
                        size="2">="server"<br />
                          </font><font color="#ff0000" size="2">TargetControlID</font><font color="#0000ff"
                            size="2">="LinkButton1"<br />
                              </font><font color="#ff0000" size="2">ConfirmText</font><font color="#0000ff"
                                size="2">="Delete Item?"</font><font size="2"> </font><font color="#0000ff" size="2">
                                    /&gt;</font><font color="#0000ff" size="2"></font><br />
            <font color="#0000ff" size="2"><font color="#0000ff" size="2">&lt;</font><font color="#800000"
                size="2">ajaxToolkit</font><font color="#0000ff" size="2">:</font><font color="#800000"
                    size="2">ConfirmButtonExtender<br />
                      </font><font color="#ff0000" size="2">ID</font><font color="#0000ff"
                        size="2">="cbe2"<br />
                          </font><font color="#ff0000" size="2">runat</font><font color="#0000ff"
                            size="2">="server"<br />
                              </font><font color="#ff0000" size="2">TargetControlID</font><font color="#0000ff"
                                size="2">="LinkButton2"<br />
                                  </font><font color="#ff0000" size="2">ConfirmText</font><font color="#0000ff"
                                    size="2">="UpdateItem?"</font><font size="2"> </font><font color="#0000ff" size="2">
                                        /&gt;</font></font><font size="2"><br />
                                        </font></code>
        <p>
        </p>
        <p>
            <strong></strong></p>
        <p>
            <strong>Step 4: (Optional) Migrate ID to BehaviorID</strong></p>
        <p>
            If you were referencing any of your components via an ID in the properties object,
            move that value to a <b>"BehaviorID"</b> on the Extender.</p>
        <p>
            <code>&lt;<font color="#800000" size="2">atlasToolkit</font><font color="#0000ff"
                size="2">:</font><font color="#800000" size="2">ConfirmButtonExtender<br />
                      </font><font color="#ff0000" size="2">ID</font><font color="#0000ff"
                        size="2">="cbe1" </font><font color="#ff0000" size="2">runat</font><font color="#0000ff"
                            size="2"></font>="server"&gt;<br />
                <font color="#0000ff" size="2">  &lt;</font><font color="#800000" size="2">atlasToolkit</font><font
                    color="#0000ff" size="2">:</font><font color="#800000" size="2">ConfirmButtonProperties<br />
                            ID="confirmBehavior1"<br />
                            </font><font color="#ff0000" size="2">TargetControlID</font><font
                            color="#0000ff" size="2">="LinkButton1"<br />
                                </font><font color="#ff0000" size="2">ConfirmText</font><font
                                color="#0000ff" size="2">="Delete?"</font><font size="2"> </font>
                <font color="#0000ff" size="2">/&gt;</font><font color="#0000ff" size="2">
                    <br />
                    &lt;/</font><font color="#800000" size="2">atlasToolkit</font><font color="#0000ff"
                        size="2">:</font><font color="#800000" size="2">ConfirmButtonExtender</font><font
                            color="#0000ff" size="2">&gt;<br />
                        </font><font color="#0000ff" size="2"><br />
                            &lt;</font><font color="#800000" size="2">script</font><font size="2"> </font>
                <font color="#ff0000" size="2">type</font><font color="#0000ff" size="2">="text/javascript"&gt;<br />
                </font><font size="2"></font><font color="#0000ff" size="2">  function</font><font
                    size="2"> doSomething() {<br />
                </font><font color="#0000ff" size="2">   var</font><font
                    size="2"> b = $object(</font><font color="#800000" size="2">"confirmBehavior1"</font><font
                        size="2">);<br />
                           b.confirm();<br />
                          }<span style="color: #0000ff"> </span>
                        <br />
                        &lt;/<font color="#800000" size="2">script</font><font color="#0000ff" size="2"></font>&gt;<br />
                    </font></code>
        </p>
        becomes
        <p>
            <code>&lt;<font color="#800000" size="2">ajaxToolkit</font><font color="#0000ff"
                size="2">:</font><font color="#800000" size="2">ConfirmButtonExtender<br />
                      </font><font color="#ff0000" size="2">ID</font><font color="#0000ff"
                        size="2">="cbe1"<br />
                          </font><strong><font color="#ff0000" size="2">BehaviorID</font><font
                            color="#0000ff" size="2">="confirmBehavior1"<br />
                              </font></strong><font color="#ff0000" size="2">runat</font><font color="#0000ff"
                                size="2">="server"<br />
                                  </font><font color="#ff0000" size="2">TargetControlID</font><font color="#0000ff"
                                    size="2">="LinkButton"<br />
                                      </font><font color="#ff0000" size="2">ConfirmText</font><font color="#0000ff"
                                        size="2">="Delete?"</font><font color="#000000" size="2"> </font>
                <font color="#0000ff" size="2"></font>/&gt;<br />
                <font color="#0000ff" size="2"><br />
                    <font color="#0000ff" size="2">&lt;</font><font color="#800000" size="2">script</font><font
                        size="2"> </font><font color="#ff0000" size="2">type</font><font color="#0000ff"
                            size="2">="text/javascript"&gt;</font><br />
                </font><font color="#0000ff" size="2">  function</font><font size="2"> doSomething()
                    {<br />
                </font><font color="#0000ff" size="2">   var</font><font
                    size="2"> b = $find(</font><font color="#800000" size="2">"confirmBehavior1"</font><font
                        size="2">);<br />
                           b.confirm();<br />
                          }</font><font color="#0000ff" size="2"><br />
                            &lt;/</font><font color="#800000" size="2">script</font><font color="#0000ff" size="2">&gt;<br />
                            </font></code>
        </p>
        <p>Done!</p>
</asp:Content>