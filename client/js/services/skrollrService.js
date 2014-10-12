app.service('skrollrService', ['$document', '$q', '$rootScope', '$window',
    function($document, $q, $rootScope, $window) {
        var defer = $q.defer();

        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function() {
                var s = $window.skrollr.init({
                    forceHeight: false
                });
                defer.resolve(s);
            });
        }

        // Create a script tag with skrollr as the source
        // and call our onScriptLoad callback when it
        // has been loaded

        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = '/js/ui/skrollr.js';

        scriptTag.onreadystatechange = function() {
            if (this.readyState === 'complete') onScriptLoad();
        };

        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
            skrollr: function() {
                return defer.promise;
            }
        };

    }
]);