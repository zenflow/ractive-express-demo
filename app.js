var _ = require('lodash');
var express = require('express');
var browserify = require('browserify-middleware');
var RactiveExpress = require('ractive-express');

browserify.settings.development('cache', true);

var context = new RactiveExpress();
var app = express();
app.engine('html', context.renderFile);
app.set('view engine', 'html');
app.use('/views', express.static('views'));
app.use(express.static('public'));
app.get('/js/bundle.js', browserify(['lodash', 'async', 'ractive-express']));
app.get("/*", function(req, res){
    res.render('page', {route: {url: req.url}});
});
var port = process.env.PORT || 3000; 
app.listen(port);
console.log('listening on port ' + port);