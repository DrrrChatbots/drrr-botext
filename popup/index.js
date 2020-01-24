var bkg = chrome.extension.getBackgroundPage;

function refresh_settings(){
    chrome.storage.sync.clear();
}

function open_background(){
    chrome.tabs.create({url: chrome.extension.getURL('background/index.html')});
}

$(document).ready(
    function(){
        $("#refresh").click(refresh_settings);
        $("#cog").click(open_background); 
        // ensure activate the background page
        chrome.runtime.sendMessage({ type: 'popup' },
            () => bkg().make_switch_panel($, '#switch_panel'));
    }
);
