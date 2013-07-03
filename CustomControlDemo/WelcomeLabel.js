(function () {
    
    window.welcomeLabel = {
        
        init: function (id) {
            var element = document.getElementById(id);
            $common.setStyle(element, { cursor: 'pointer' });
            element.onclick = function () {
                alert("You've been clicked!");
            };
        }
    };
    
})();