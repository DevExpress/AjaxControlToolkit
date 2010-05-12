REM Causes the 3.5 web.configs to be swapped into all websites in the solution
copy /Y SampleWebSites\AjaxControlToolkitSampleSite\Web.NET35.config.exclude SampleWebSites\AjaxControlToolkitSampleSite\web.config
copy /Y SampleWebSites\AjaxClientWebSite\Web.NET35.config.exclude SampleWebSites\AjaxClientWebSite\web.config
copy /Y Server\Tests\FunctionalTests\Web.NET35.config.exclude Server\Tests\FunctionalTests\web.config
copy /Y Client\UnitTests\Web.NET35.config Client\UnitTests\web.config
