/* ZONA DEL MAPA */
jQuery(document).ready(function() {

var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 2
});


/* L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map); visto como geográfica */

/* L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
	type: 'sat',
	ext: 'jpg',
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
	subdomains: '1234'
}).addTo(map);  Visto como tierra */
/*
L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day.grey/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
	attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
	subdomains: '1234',
	mapID: 'newest',
	app_id: 'Y8m9dK2brESDPGJPdrvs',
	app_code: 'dq2MYIvjAotR8tHvY8Q_Dg',
	base: 'base',
	maxZoom: 20
}).addTo(map); */


/* L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
	type: 'map',
	ext: 'jpg',
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: '1234'
}).addTo(map); */

/* L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map); */


L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
}).addTo(map);


/* ZONA de LAS FOTOS */
   var images = [];
   var numFotos = 1;  
   var Nivel;
    var  getImages =  function(valor) {
                var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
                $.getJSON( flickerAPI, {
                    tags: valor,
                    tagmode: "any",
                    format: "json"
                })
                .done(function( data ) {

                //    console.log(data.items[1].media);
                    $.each( data.items, function( i, item ) {
                        images.push(item.media.m);     
                     
                    if ( i === 10 ) {
                        return false;
                    }
       //             console.log(images[i]);
                });
            });
            
        }
      

        getImages("madrid");  
        
     //   $("#images").html("<img src="+ images[numFotos] +">");                
        
      var MostrarFotos = function (Nivel){
        setInterval(function(){
           // console.log("NumFot "+ numFotos + " length "+ images.length);
            if(numFotos != images.length -1){            
                            
                numFotos ++;
                
               $("#images").html("<img src="+ images[numFotos] +">");                
          
            }
            
         },Nivel);

      }
/* ZONA de CONTROLES */
          
 
     $("#tab2").hide();   

     $("button.nivel-1").click(function(){

        Nivel = 10000;
        alert("ha seleccionado el Nivel 1");  
        MostrarFotos(Nivel);  
    });

    $("button.nivel-2").click(function(){

        Nivel = 5000;
        alert("ha seleccionado el Nivel 2"); 
        MostrarFotos(Nivel);   
    });

    $("button.play").click(function() {        	    
       // alert("el juego ha comenzado");
        $("button.play").hide();
     });

    $("button.restart").click(function() {        	    
       // alert("has reseteado el juego");
        $("button.play").show();
        MostrarFotos(Nivel);
        //$("button.play").html("jugando");
     });

    $("button.new").click(function() {        	    
      //  alert("creando nuevo juego");
        
     });

    $("button.mostrar").click(function() {        	    
       // alert("mostrando juegos");
        $("#tab1").hide();
        $("#tab2").show();
     });

})
