var path = require('path');
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
app.get('/js/bundle.js', browserify(['path', 'lodash', 'async', 'ractive-express', 'browser-router']));
app.get(/(.*)/, function(req, res){
    res.render('page', {route: req.params[0]});
});
app.listen(3000);
console.log('listening on port 3000');