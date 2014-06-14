var segments_length = 7;
var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
var getSegments = function (parts) {
    var self = this;
    var colors = self.get('colors');
    var data = parts.map(function(part, i){return {id: String(i), value: part};});
    while(data.length < colors.length){data.push({id: String(data.length), value: 0});}
    while(data.length > colors.length){data.pop();}

// process the data so we can turn it into donut segments
    var total, start, segments;

    // tally up the total value
    total = data.reduce( function ( previous, current ) {
        return previous + current.value;
    }, 0 );

    // sort data, but clone first so we don't alter the original data
    /*data = data.slice().sort( function ( a, b ) {
     return b.value - a.value;
     });*/
    // nah lets not sort
    data = data.slice();

    // find the start and end point of each segment
    start = 0;

    segments = data.map( function ( datum ) {
        var size = datum.value / total, end = start + size, segment;

        segment = {
            id: datum.id,
            start: start,
            end: end
        };

        start = end;
        return segment;
    });

    return segments;
};
var getSegmentPoints = function (segment, innerRadius, outerRadius) {
// get an SVG points list for the segment
    var points = [], i, angle, start, end, getPoint;

    start = segment.start * Math.PI * 2;
    end = segment.end * Math.PI * 2;

    getPoint = function ( angle, radius ) {
        return ( ( radius * Math.sin( angle ) ).toFixed( 2 ) + ',' + ( radius * -Math.cos( angle ) ).toFixed( 2 ) );
    };

    // get points along the outer edge of the segment
    for ( angle = start; angle < end; angle += 0.05 ) {
        points[ points.length ] = getPoint( angle, outerRadius );
    }

    points[ points.length ] = getPoint( end, outerRadius );

    // get points along the inner edge of the segment
    for ( angle = end; angle > start; angle -= 0.05 ) {
        points[ points.length ] = getPoint( angle, innerRadius );
    }

    points[ points.length ] = getPoint( start, innerRadius );

    // join them up as an SVG points list
    return points.join( ' ' );
};
module.exports = function(template, cb){
    var context = this;
    var init = function(){
        var self = this;
        self.on('select', function(event, id){
            self.set('selected', event.hover ? id : -1);
        });
    };
    var Component = context.Ractive.extend({
        template: template,
        init: init,
        data: {colors: colors, getSegments: getSegments, getSegmentPoints: getSegmentPoints}
    });
    cb(null, Component);
};