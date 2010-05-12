REM Causes the 4.0 web.configs to be swapped into all websites in the solution
copy /Y SampleWebSites\AjaxControlToolkitSampleSite\Web.NET4.config.exclude SampleWebSites\AjaxControlToolkitSampleSite\web.config
copy /Y SampleWebSites\AjaxClientWebSite\Web.NET4.config.exclude SampleWebSites\AjaxClientWebSite\web.config
copy /Y Server\Tests\FunctionalTests\Web.NET4.config.exclude Server\Tests\FunctionalTests\web.config
copy /Y Client\UnitTests\Web.NET4.config Client\UnitTests\web.config
