module.exports = function(template, cb){
    var context = this;

    var data = {examples: {}};

    var donutchart = data.examples.donutchart = {
        title: 'Donut Chart Component',
        parts_str: null,
        parts: null,
        colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
        colors_str: null
    };
    donutchart.colors_str = JSON.stringify(donutchart.colors);
    if (!context.on_client){donutchart.colors_str = donutchart.colors_str.replace(/\"/g, '&quot;')}

    var init = function(options){
        var self = this;

        context.initRouter(self, function(new_route){
            var subtitle;
            switch(new_route.path[0]){
                case '':
                    subtitle = 'Home';
                    break;
                case 'examples':
                    var examples = self.get('examples');
                    var example = examples[new_route.path[1]];
                    subtitle = example ? example.title : 'Examples';
                    break;
            }
            return (subtitle?subtitle+' - ':'') + 'ractive-express-demo';
        });

        //scroll to top when route changes on client
        if (context.on_client){
            self.observe('route.url', function(url){
                setTimeout(function(){$('body').animate({scrollTop: 0}, 400);}, 0);
            }, {init: false});
        }

        // --- Donut chart component example ---
        self.observe('route.url', function(){
            var path = self.get('route.path');
            // bind route to donut parts
            if ((path[0]=='examples')&&(path[1]=='donutchart')){
                self.set('examples.donutchart.parts_str', JSON.stringify(path.slice(2).map(Number)));
            }
        });
        self.observe('examples.donutchart.parts_str', function(parts_str){
            //ignore invalid changes
            var parts; try {parts = JSON.parse(parts_str);} catch (error) {return;}
            //bind donut 'parts' to route
            var path = self.get('route.path');
            if ((path[0]=='examples')&&(path[1]=='donutchart')){
                self.set('route.path', ['examples', 'donutchart'].concat(parts.map(String)));
            }
            //bind 'parts_str' to 'parts', with animation if on client & not initializing
            if (context.on_client && self.get('examples.donutchart.parts')){
                var colors = self.get('examples.donutchart.colors');
                for (var i = 0; i < colors.length; i++){
                    var keypath = 'examples.donutchart.parts.'+i;
                    if (!self.get(keypath)){self.set(keypath, 0);}
                    self.animate(keypath, parts[i] || 0);
                }
            } else {
                self.set('examples.donutchart.parts', parts);
            }
        });
        //bind 'colors_str' to 'colors'
        self.observe('examples.donutchart.colors_str', function(colors_str){
            var colors; try {colors = JSON.parse(colors_str);} catch (error) {return;}
            self.set('examples.donutchart.colors', colors);
        });
    };

    context.getResources(['lorem_ipsum'], ['donutchart'], function(error, partials, components){
        if (error){cb(error); return;}
        cb(null, context.Ractive.extend({template: template, partials: partials, components: components, data: data, init: init}));
    });
};