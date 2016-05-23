<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="SlideShowTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.SliderTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    SlideShow
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">
    <script runat="server" type="text/c#">
    
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static AjaxControlToolkit.Slide[] GetSlides() {
            return new AjaxControlToolkit.Slide[] {
                new AjaxControlToolkit.Slide("Images/blue_hills.jpg", "Blue Hills", "Go Blue", "Images/blue_hills.jpg"),
                new AjaxControlToolkit.Slide("Images/sunset.jpg", "Sunset", "Setting sun", "Images/sunset.jpg"),
                new AjaxControlToolkit.Slide("Images/winter.jpg", "Winter", "Wintery...", "Images/winter.jpg"),
                new AjaxControlToolkit.Slide("Images/water_lillies.jpg", "Water lillies", "Lillies in the water", "Images/water_lillies.jpg"),
                new AjaxControlToolkit.Slide("Images/vertical_picture.jpg", "Sedona", "Portrait style picture", "Images/vertical_picture.jpg")};
        }
    </script>

    <asp:Label runat="server" ID="ImageTitle" CssClass="slide-title" />
    <br />

    <asp:Image ID="TestImage" runat="server"
        Height="300"
        Width="400"
        Style="border: 1px solid black;"
        AlternateText="Blue Hills image" />

    <asp:Label runat="server" ID="ImageDescription" CssClass="slide-description"></asp:Label>
    <br />
    <br />
    <asp:Button runat="Server" ID="PrevButton" Text="Previous" Font-Size="Larger" />
    <asp:Button runat="Server" ID="PlayStopButton" Text="Play" Font-Size="Larger" />
    <asp:Button runat="Server" ID="NextButton" Text="Next" Font-Size="Larger" />

    <act:SlideShowExtender ID="TestSlideShow" runat="server"
        TargetControlID="TestImage"
        SlideShowServiceMethod="GetSlides"
        AutoPlay="false"
        ImageTitleLabelID="ImageTitle"
        ImageDescriptionLabelID="ImageDescription"
        NextButtonID="NextButton"
        PlayButtonText="Play"
        StopButtonText="Stop"
        PreviousButtonID="PrevButton"
        PlayButtonID="PlayStopButton"
        Loop="true" SlideShowAnimationType="SlideRight" />

    <script>
        describe("SlideShow", function() {

            var PLAY_BUTTON_TEXT = "Play",
                STOP_BUTTON_TEXT = "Stop",
                ANIMATION_SPEED = 1000;

            var IMAGES = [
                new CreateImage("Images/blue_hills.jpg", "Blue Hills", "Go Blue", "Images/blue_hills.jpg"),
                new CreateImage("Images/sunset.jpg", "Sunset", "Setting sun", "Images/sunset.jpg"),
                new CreateImage("Images/winter.jpg", "Winter", "Wintery...", "Images/winter.jpg"),
                new CreateImage("Images/water_lillies.jpg", "Water Lillies", "Lillies in the water", "Images/water_lillies.jpg"),
                new CreateImage("Images/vertical_picture.jpg", "Sedona", "Portrait style picture", "Images/vertical_picture.jpg")
            ];

            function CreateImage(path, name, description, url) {
                this.path = path;
                this.name = name;
                this.description = description;
                this.url = url;
            }

            beforeEach(function(done) {
                this.extender = $find("<%= TestSlideShow.ClientID %>");
                this.element = this.extender._element;

                this.$playStopButton = $("#<%= PlayStopButton.ClientID %>");
                this.$prevButton = $("#<%= PrevButton.ClientID %>");
                this.$nextButton = $("#<%= NextButton.ClientID %>");

                this.imageTitleLabel = this.extender._imageTitleLabel;
                this.imageDescriptionLabel = this.extender._imageDescriptionLabel;

                var that = this;
                waitFor(function() {
                    return that.extender._slides !== null;
                }, done);
            });

            it("enables/disables prev and next buttons after play/stop button pressed", function(done) {
                var that = this;

                waitFor(
                    function() {
                        return that.$playStopButton.val() === PLAY_BUTTON_TEXT;
                    },
                    function() {
                        expect(that.$prevButton.is(":enabled")).toBeTruthy();
                        expect(that.$nextButton.is(":enabled")).toBeTruthy();

                        that.$playStopButton.click();
                   
                        waitFor(
                            function() {
                                return that.$playStopButton.val() === STOP_BUTTON_TEXT;
                            },
                            function(){
                                expect(that.$prevButton.is(":disabled")).toBeTruthy();
                                expect(that.$nextButton.is(":disabled")).toBeTruthy();

                                done();
                            });
                    });
            });

            it("gets all images from service method in proper order with correct attributes", function(done) {
                var self = this;

                waitFor(
                    function() {
                        return IMAGES.length === self.extender._images.length;
                    },
                    function() { 
                        for(var i = 0; i < IMAGES.length; i++) {
                            var imageLink = $(self.extender._images[i]).find("a");
                            var img = $(imageLink).find("img");

                            expect(IMAGES[i].url).toBe($(imageLink).attr("href"));
                            expect(IMAGES[i].path).toBe($(img).attr("src"));
                        }

                        done();
                    });
            });

            it("calls 'raisePropertyChanged' method", function() {
                var MethodValuePair = function(methodName, newValue) {
                    this.methodName = methodName;
                    this.newValue = newValue;
                };

                var changePropertyMethods = [
                    new MethodValuePair("set_contextKey", "_" + this.extender.get_contextKey()),
                    new MethodValuePair("set_useContextKey", !this.extender.get_useContextKey()),
                    new MethodValuePair("set_imageHeight", this.extender.get_imageHeight() + 1),
                    new MethodValuePair("set_imageWidth", this.extender.get_imageWidth() + 1),
                    new MethodValuePair("set_imageDescriptionLabelID", "_" + this.extender.get_imageDescriptionLabelID()),
                    new MethodValuePair("set_imageTitleLabelID", "_" + this.extender.get_imageTitleLabelID()),
                    new MethodValuePair("set_nextButtonID", "_" + this.extender.get_nextButtonID()),
                    new MethodValuePair("set_playButtonID", "_" + this.extender.get_playButtonID()),
                    new MethodValuePair("set_playButtonText", "_" + this.extender.get_playButtonText()),
                    new MethodValuePair("set_stopButtonText", "_" + this.extender.get_stopButtonText()),
                    new MethodValuePair("set_playInterval", this.extender.get_playInterval() + 1),
                    new MethodValuePair("set_previousButtonID", "_" + this.extender.get_previousButtonID()),
                    new MethodValuePair("set_slideShowServicePath", "_" + this.extender.get_slideShowServicePath()),
                    new MethodValuePair("set_slideShowServiceMethod", "_" + this.extender.get_slideShowServiceMethod()),
                    new MethodValuePair("set_loop", !this.extender.get_loop()),
                    new MethodValuePair("set_autoPlay", !this.extender.get_autoPlay()),
                    new MethodValuePair("set_slideShowAnimationType", this.extender.get_slideShowAnimationType() + 1)
                ]

                spyOn(this.extender, "raisePropertyChanged");

                for(var i = 0; i < changePropertyMethods.length; i++) {
                    this.extender[changePropertyMethods[i].methodName](changePropertyMethods[i].newValue);

                    expect(this.extender.raisePropertyChanged).toHaveBeenCalled();
                }
            });

            it("next button calls '_clickNext' method", function(done) {
                spyOn(this.extender, "_clickNext");

                var self = this;

                setTimeout(function() {
                    self.$nextButton.click();
                    expect(self.extender._clickNext).toHaveBeenCalled();
                    done();
                }, 500);
            });

            it("next button replaces image with the next one", function(done) {
                var that = this;

                var nextIndex = that.extender._currentIndex + 1;
                that.$nextButton.click();

                waitFor(
                    function() {
                        var imageLink = $(that.extender._currentImage).find("a"),
                            img = $(imageLink).find("img");

                        return IMAGES[nextIndex].url === $(imageLink).attr("href")
                        && IMAGES[nextIndex].path === $(img).attr("src")
                        && IMAGES[nextIndex].name === $(that.imageTitleLabel).text()
                        && IMAGES[nextIndex].description === $(that.imageDescriptionLabel).text();
                    }, done);
            });

            it("previous button calls '_clickPrevious' method", function(done) {
                spyOn(this.extender, "_clickPrevious");

                var self = this;
                setTimeout(function() {
                    self.$prevButton.click();
                    expect(self.extender._clickPrevious).toHaveBeenCalled();
                    done();
                }, 500);
            });

            it("previous button replaces image with the previous one", function(done) {
                var that = this;

                waitFor(
                    function() {
                        return that.extender && that.extender._slides;
                    },
                    function(){
                        var prevIndex = that.extender._currentIndex - 1;

                        if(prevIndex < 0)
                            prevIndex = that.extender._slides.length - 1;

                        that.$prevButton.click();

                        waitFor(
                            function() {
                                var imageLink = $(that.extender._currentImage).find("a"),
                                    img = $(imageLink).find("img");

                                return IMAGES[prevIndex].url === $(imageLink).attr("href")
                                && IMAGES[prevIndex].path === $(img).attr("src")
                                && IMAGES[prevIndex].name === $(that.imageTitleLabel).text()
                                && IMAGES[prevIndex].description === $(that.imageDescriptionLabel).text();
                            }, done);
                });
            });

            it("play button calls '_play' function when clicked", function() {
                spyOn(this.extender, "_play");
                this.$playStopButton.click();

                expect(this.extender._play).toHaveBeenCalled();
            });

            it("play button replaces image with the next one", function(done) {
                var nextIndex = this.extender._currentIndex + 1;

                var that = this;
                this.$playStopButton.click();

                setTimeout(function() {
                    var imageLink = $(that.extender._currentImage).find("a"),
				        img = $(imageLink).find("img");

                    expect(IMAGES[nextIndex].url).toBe($(imageLink).attr("href"));
                    expect(IMAGES[nextIndex].path).toBe($(img).attr("src"));

                    expect(IMAGES[nextIndex].name).toBe($(that.imageTitleLabel).text());
                    expect(IMAGES[nextIndex].description).toBe($(that.imageDescriptionLabel).text());

                    done();
                }, ANIMATION_SPEED + this.extender._playInterval + 300);
            });

            it("'setImage' method calls 'raise_slideChanged' and 'resetButtons'method", function() {
                spyOn(this.extender, "raise_slideChanged");
                spyOn(this.extender, "resetButtons");

                var slide = this.extender._slides[1];
                this.extender.setImage(slide);

                expect(this.extender.raise_slideChanged).toHaveBeenCalled();
                expect(this.extender.resetButtons).toHaveBeenCalled();
            });

            it("'setImage' method sets pointer cursor to its '_elementImage'", function() {
                var slide = this.extender._slides[1];
                slide.Url = null;

                this.extender.setImage(slide);

                expect(this.extender._elementImage.style.cursor).toBe("auto");

                slide.Url = "http://someurl.com";

                this.extender.setImage(slide);

                expect(this.extender._elementImage.style.cursor).toBe("pointer");
            });

            it("'setImage' method sets description label properly", function() {
                var slide = this.extender._slides[1];
                slide.Description = "some description text";

                this.extender.setImage(slide);

                expect(this.imageDescriptionLabel.innerHTML).toBe(slide.Description);
            });

            it("'setImage' method sets title label properly", function() {
                var slide = this.extender._slides[1];
                slide.Name = "some name";

                this.extender.setImage(slide);

                expect(this.imageTitleLabel.innerHTML).toBe(slide.Name);
            });
        });
    </script>
</asp:Content>
