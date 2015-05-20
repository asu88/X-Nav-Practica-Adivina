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
$("p.estadios").hide();
$("p.ciudades").hide();
var Stop;
var StartGame = false;
var hasTag;
var Nivel;
var JuegoCapitales;
var JuegoEstadios;    
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
    var JuegoCiudades;    
    var latitud, longitud;
    var latitudReal, longitudReal;
   

    /*Function que obtiene los puntos */
    function GetDatos(path){
        $.getJSON(path,function(data){
         indice =   Math.floor((Math.random() * data.features.length) + 1)
         latitudReal = data.features[indice].geometry.coordinates[0];

        longitudReal = data.features[indice].geometry.coordinates[1];
        hasTag =  data.features[indice].properties.Name;
        console.log(hasTag);
        }
     )
    }


 
    var popup = L.popup();
    function onMapClick(e) {

            vector = e.latlng.toString().split(",");
            // Obtener la latitud y longitud al pulsar en el mapa
            latitud = vector[0].split("(")[1];
            longitud = vector[1].split(")")[0];
            
            Distancia = CalcularDistancia(latitud, longitud, latitudReal , longitudReal);            
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
                        
                    if ( i === 50 ) {
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


        
     function CalcularPuntos(Fotos){
         var puntuacion = 100000/(Fotos*Distancia) ; 
         return puntuacion.toFixed(0);
     }
      

     function CalcularDistancia(lat1, lon1, lat2, lon2){


              rad = function(x) {return x*Math.PI/180;}

              var R     = 6378.137;                          //Radio de la tierra en km
              var dLat  = rad( lat2 - lat1 );
              var dLong = rad( lon2 - lon1 );

              var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              var d = R * c;

              return d.toFixed(3);                   

}

    function ChoiceLevel(nivel){

        Nivel = nivel;
        $("button.play").show();
        $("button.nivel-1").hide();
        $("button.nivel-2").hide();
            
    }

/* ZONA de CONTROLES-INTERFAZ DE USUARIO */
          
    

     $("button.nivel-1").click(function(){
        ChoiceLevel(6000);
     /*   Nivel = 6000;
      //  $("#tab1").hide();
        $("button.play").show();
        $("button.nivel-1").hide();
        $("button.nivel-2").hide();
        //alert("ha seleccionado el Nivel 1");  */
          
    });

    $("button.nivel-2").click(function(){
        ChoiceLevel(4000);
        /*Nivel = 4000;
        //$("#tab1").hide();
        $("button.play").show();
        $("button.nivel-1").hide();
        $("button.nivel-2").hide();
        alert("ha seleccionado el Nivel 2"); 
       // MostrarFotos(Nivel); */   
    });

    $("button.play").click(function() {        	    
       // alert("el juego ha comenzado");       
  
     //   while (clikeado == true);
        /* Iniciar a mostrar Fotos */
         images=[];
         
         getImages(hasTag);          
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
      //  var lat = capitales[0].madrid[0]
      //  var long = capitales[0].madrid[1]
        
        GetDatos("json/Capitales.json");        
        $("button.nivel-1").show();
        $("button.nivel-2").show();
         $("p.capi").show();
        $("button.mostrar").hide();
        $("#games").hide();
    })

    $("#ciudades").click(function(){
        alert("jugar por ciudades");
       // $("button.disponibles").show();
        GetDatos("json/Ciudades.json");        
        $("button.nivel-1").show();
        $("button.nivel-2").show();
        $("p.ciudades").show();
        $("button.mostrar").hide();
        $("#games").hide();
    })

    $("#estadios").click(function(){
        alert("juegar por Estadios");
       // $("button.disponibles").show();
        GetDatos("json/Estadios.json")
        $("button.nivel-1").show();
        $("button.nivel-2").show();
         $("p.estadios").show();
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

