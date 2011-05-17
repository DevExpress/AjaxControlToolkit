var agent = navigator.userAgent,
    browser = Sys.Browser = {
        InternetExplorer: {},
        Firefox: {},
        Safari: {},
        Opera: {},
        agent: null,
        hasDebuggerStatement: false,
        name: navigator.appName,
        version: parseFloat(navigator.appVersion),
        documentMode: 0 };

if (agent.indexOf(' MSIE ') > -1) {
    browser.agent = browser.InternetExplorer;
    browser.version = parseFloat(agent.match(/MSIE (\d+\.\d+)/)[1]);
    if ((browser.version > 7) && (document.documentMode > 6)) {
        browser.documentMode = document.documentMode;    
    }
    browser.hasDebuggerStatement = true;
}
else if (agent.indexOf(' Firefox/') > -1) {
    browser.agent = browser.Firefox;
    browser.version = parseFloat(agent.match(/ Firefox\/(\d+\.\d+)/)[1]);
    browser.name = 'Firefox';
    browser.hasDebuggerStatement = true;
}
else if (agent.indexOf(' AppleWebKit/') > -1) {
    browser.agent = browser.Safari;
    browser.version = parseFloat(agent.match(/ AppleWebKit\/(\d+(\.\d+)?)/)[1]);
    browser.name = 'Safari';
}
else if (agent.indexOf('Opera/') > -1) {
    browser.agent = browser.Opera;
}

