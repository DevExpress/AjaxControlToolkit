<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Suites/Suite.Master"  %>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">
    <iframe src="Frame.aspx" id="TestFrame"></iframe>

    <script>
        describe("Issue466", function() {

            function findInnerForm() {
                return document.getElementById("TestFrame").contentWindow.document.getElementsByTagName("form")[0];
            }

            it("is fixed", function(done) {
                waitFor(
                    function() {
                        return !!window["Issue466_UploadStarted"];
                    },
                    function() {
                        waitFor(
                            function() {
                                return findInnerForm().target !== "upload1_iframe";
                            },
                            function() {
                                expect(findInnerForm().target).not.toBe("_top");
                                done();
                            }
                        )
                    }
                );
            });

        });
    </script>
</asp:Content>
