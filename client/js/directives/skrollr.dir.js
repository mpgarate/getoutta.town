app
  .directive('skrollrTag', ['skrollrService',
    function(skrollrService) {
      return {
        link: function() {
          skrollrService.skrollr().then(function(skrollr) {
            skrollr.refresh();
          });
        }
      };
    }
  ])