/* ZONA DEL MAPA */
jQuery(document).ready(function() {

$("#games").hide();
$("button.nivel-2").hide();
$("button.nivel-1").hide();
$("button.play").hide();
$("button.restart").hide();
$("button.new").hide();
$("button.mostrar").show();
$("button.historial").hide();
$("button.disponibles").hide();
$("p.capi").hide();
$("p.conti").hide();
   $("p.pais").hide();
var Stop;
var StartGame = false;
var Levels=[1,2,3];
var Nivel;
var JuegoCapitales;
var JuegoPaises;    
var Distancia;
var FotosVistas=0;
var images = [];
var numFotos = 0;  
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 2
});




L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
}).addTo(map);

    var JuegoCapitales;
    var JuegoPaises;    
    var latitud, longitud;
    var capitales = [{"madrid":[40.4378271,-3.6795367]},{"malabo":[38,-43]},{"akurenam":[23,-32]}];
    var paises = [{"españa":[45,-32]},{"guinea":[38,-43]},{"alemania":[64,-32]}];
   // console.log(capitales[0].madrid[0]); //extrae 45
   // console.log(capitales[1].malabo[0]); //extrae 38

    var popup = L.popup();
    function onMapClick(e) {

            vector = e.latlng.toString().split(",");
            //console.log(vector);
            
            // Obtener la latitud y longitud del juego elegido
            latitud = vector[0].split("(")[1];
            longitud = vector[1].split(")")[0];
            //console.log("latit: " + latitud + " ,longitud: "+longitud);
            CalcularDistancia(latitud,longitud);
            FotosVistas = numFotos;
            numFotos = 0;            
            clearInterval(Stop);     // FInalizar de mostrar las fotos   
            StartGame = false;
            console.log("Fotos Vistas "+FotosVistas);
           // console.log( "Puntuacion "+CalcularPuntos(FotosVistas));
            $("p.puntuacion").html("Puntuacion "+CalcularPuntos(FotosVistas)+ "<br>FINAL DE JUEGO");
            $("p.puntuacion").show();
    }



/* ZONA de LAS FOTOS */
   
    

    /*  funcion que hace las peticiones al Flicker*/

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
      


     /*Funcion que hace muestra las imagenes en el DOM segun el juego y nivel elegido*/

      var MostrarFotos = function (Nivel, Status){
                
        //while(Status ==true) {
            Stop = setInterval(function(){
           // console.log("NumFot "+ numFotos + " length "+ images.length);
            if(numFotos !== images.length -1 && Status ===true){            
                            
                numFotos ++;
                
               $("#images").html("<img src="+ images[numFotos] +">");                
          
            }    
            //alert("fin de juego");
              
         },Nivel);


        //}
         //return;
     }


     var CalcularDistancia = function(LatReal, LongReal){
         lat = capitales[0].madrid[0];
         long = capitales[0].madrid[1];
         var DeltaLat = LatReal -lat;
         var DeltaLong = LongReal-long;
         Distancia = Math.sqrt(Math.abs(DeltaLat - DeltaLong)^2);
      //   console.log(Distancia);
     }
    
     function CalcularPuntos(Fotos){
         var puntuacion = Distancia * Fotos; 
         return puntuacion;
     }

      //getImages("madrid");  


/* ZONA de CONTROLES-INTERFAZ DE USUARIO */
          
 
    // $("#tab2").hide();   

     $("button.nivel-1").click(function(){

        Nivel = 4000;
      //  $("#tab1").hide();
        $("button.play").show();
        $("button.nivel-1").hide();
        $("button.nivel-2").hide();
        alert("ha seleccionado el Nivel 1");  
        
        // MostrarFotos(Nivel);  
    });

    $("button.nivel-2").click(function(){

        Nivel = 5000;
        //$("#tab1").hide();
        $("button.play").show();
        $("button.nivel-1").hide();
        $("button.nivel-2").hide();
        alert("ha seleccionado el Nivel 2"); 
       // MostrarFotos(Nivel);   
    });

    $("button.play").click(function() {        	    
       // alert("el juego ha comenzado");       
  
     //   while (clikeado == true);
        /* Iniciar a mostrar Fotos */
         images=[];
         
         getImages("madrid");          
         StartGame = true;
         $("button.play").hide();
         $("button.restart").show();       
//         map.on('click', onMapClick);

         MostrarFotos(Nivel, StartGame);            
                    
            /* Programar el evento de lo que ocurre al clikear en el mapa */                 

    });

    map.on('click', onMapClick);


    $("button.restart").click(function() {        	    
         alert("¿Seguro a reiniciar el Juego?");
         numFotos =0;
        clearInterval(Stop);
       //  FotosVistas =0;
        // getImages("madrid");  
         StartGame = true;
         $("p.puntuacion").html(" ");
         $("#images").html(" ");
         $("button.play").hide();
        $("button.restart").show();       
  //       map.on('click', onMapClick);

         MostrarFotos(Nivel, StartGame); 
        //$("button.play").html("jugando");
     });

    $("button.new").click(function() {        	    
      //  alert("creando nuevo juego");
        
     });

    $("button.mostrar").click(function() {        	    
       // alert("mostrando juegos");
        $("button.historial").show();
        $("button.disponibles").show();
        $("button.mostrar").hide();
        $("#games").hide();
   });
    
    $("button.disponibles").click(function(){
       $("button.mostrar").show(); 
       $("#games").show();
       $("button.disponibles").hide();
       $("button.historial").hide();
       
    })

    $("#capi").click(function(){
        alert("juego por capitales");
       // $("button.disponibles").show();
        var lat = capitales[0].madrid[0]
        var long = capitales[0].madrid[1]
        $("button.nivel-1").show();
        $("button.nivel-2").show();
         $("p.capi").show();
        $("button.mostrar").hide();
        $("#games").hide();
    })

    $("#pais").click(function(){
        alert("jugar por paises");
       // $("button.disponibles").show();
        $("button.nivel-1").show();
        $("button.nivel-2").show();
        $("p.pais").show();
        $("button.mostrar").hide();
        $("#games").hide();
    })

    $("#conti").click(function(){
        alert("juegar por continentes");
       // $("button.disponibles").show();
        $("button.nivel-1").show();
        $("button.nivel-2").show();
         $("p.conti").show();
        $("button.mostrar").hide();
        $("#games").hide();    
    })


})






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

