/* ZONA DEL MAPA */
jQuery(document).ready(function() {

var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 2
});


 L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map);


/* ZONA de LAS FOTOS */

   var  getImages =  function(valor) {
                var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
                $.getJSON( flickerAPI, {
                    tags: valor,
                    tagmode: "any",
                    format: "json"
                })
                .done(function( data ) {
                    $.each( data.items, function( i, item ) {
                    $( "<br><img>" ).attr( "src", item.media.m ).appendTo( "#images" );
                    if ( i === 5 ) {
                        return false;
                }

                });
            });
            
        }
      
             
        getImages("madrid");





/* ZONA de CONTROLES */



})
