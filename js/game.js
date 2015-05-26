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
$("button.back").hide();
var load = "images/init.gif";
        $("#images").html("<img class = "+'"load"'+" src="+load+">");
var points = 0;
var PuntosCapi =0;
var PuntosCiudad=0; 
var PuntosEstadio =0;
var Stop;
var StartGame = false;
var hasTag="";
var Nivel;
var JuegoCapitales="CP";
var JuegoEstadios="EE";    
var JuegoCiudades ="CD";
var Juego;
var Distancia;
var FotosVistas=0;
var images = [];
var numFotos = 0;  
var ListaJuegos = [];
var latitud, longitud;
var latitudReal, longitudReal;
 var indiceCap =0;
 var indiceCiu =0;
var indiceEst=0;

 var estadoActual;
 var ciud=0;
var cap =0;
var estad =0;
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 2
});

 $( "#date" ).datepicker();


L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
}).addTo(map);
    
    //var volver =0;
    // volver = indice - estadoActual

    /*Function que obtiene los puntos */
    function GetDatos(path){
        $.getJSON(path,function(data){
        //console.log("viejo indice "+indice);
         var indice =   Math.floor((Math.random() * data.features.length) + 1)
        // console.log("nuevo indice "+indice);        
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
          //  numFotos = 0;            
            clearInterval(Stop);     // FInalizar de mostrar las fotos   
            StartGame = false;

            points = CalcularPuntos(FotosVistas);
         
            
           if(Juego == JuegoCapitales){
               // alert("jugabas a capitales");
              
                    PuntosCapi = PuntosCapi + points; 
                      //  alert(PuntosCapi);
                     $("p.puntuacion").show();
                     $("p.puntuacion").html("Solución:<h2>"+hasTag+"</h2><br><h3>Puntuacion "+PuntosCapi+ "<br>PARTIDA FINALIZADA</h3>");   
                    
                    cap++; 
                    ListaJuegos.push("capitales");
                    indiceCap = ListaJuegos.indexOf("capitales");
                    addHistory("capitales", PuntosCapi,indiceCap,cap ); 
                     
            }else if (Juego == JuegoEstadios){
                   // alert("jugabas a estadios");
                    PuntosEstadio = PuntosEstadio + points;
                    
                   // alert(PuntosEstadio);
                    $("p.puntuacion").html( "Solución:<h2>"+hasTag+"</h2><br><h3>Puntuacion "+PuntosEstadio+ "<br>PARTIDA FINALIZADA</h3>");
                    $("p.puntuacion").show();
                    estad++;
                    ListaJuegos.push("estadios");
                    indiceCap = ListaJuegos.indexOf("estadios");
                    addHistory("estadios", PuntosEstadio,indiceEst,estad );
            }else if(Juego ==JuegoCiudades ){
               // alert("jugabas a ciudades");
                  PuntosCiudad = PuntosCiudad + points; 
               //  alert(PuntosCiudad);
                  $("p.puntuacion").html("Solución:<h2>"+hasTag+"</h2><br><h3>Puntuacion "+PuntosCiudad+ "<br>PARTIDA FINALIZADA</h3>");
                  $("p.puntuacion").show();
                   ciud++;
                   ListaJuegos.push("ciudades");
                   indiceCap = ListaJuegos.indexOf("ciudades");
                   addHistory("ciudades", PuntosCiudad,indiceCiu,ciud);

            }
            //$("p.puntuacion").html("Puntuacion "+points+ "<br>FINAL DE JUEGO");
            $("button.restart").hide();       
            $("p.puntuacion").show();
            $("button.historial").hide();
            $("button.new").show();
            $("button.back").hide();
            $("p.capi").hide();
            $("p.ciudades").hide();
            $("p.estadios").hide();
            

            
            // addHistory()  aniadir una entrada nueva            
            
          //  history.replaceState({puntos:CalcularPuntos(FotosVistas)}, "page 1", location.href);     
     }


   window.onpopstate = function(evento) {
       // alert("location: " + document.location + ", state: " + JSON.stringify(evento.state));
        /*Volver a jugar al historial guardado con estado*/
        ChoiceGame();
        $("button.historial").hide();
        $("#gamesHistory").hide();
        $("button.puntuacion").hide();
        console.log(JSON.stringify(evento.state));
   };



    $("button.historial").click(function(){
          $("button.mostrar").show();       
         $("#gamesHistory").show();
        $("button.historial").hide();
        $("button.disponibles").hide();

    })

    
    //$("").


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
               // console.log(images[numFotos]);
               $("#images").html("<img src="+ images[numFotos] +">");                
          
            }    
            //alert("fin de juego");
              
         },Nivel);


        //}
         //return;
     }


        
     function CalcularPuntos(Fotos){
         var puntuacion = 100000/(Fotos*Distancia) ;
         console.log(puntuacion);
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

    /* Funcion que selecciona el nivel de dificultad*/
    function ChoiceLevel(nivel){

        Nivel = nivel;
        $("button.play").show();
        $("button.nivel-1").hide();
        $("button.nivel-2").hide();
        $("button.back").show();        

            
    }

    function bakcState(ir){
        history.go(ir);
    }

    function ChoiceGame(){
        $("button.nivel-1").show();
        $("button.nivel-2").show();
        // $("p.capi").show();
        $("button.mostrar").hide();
        $("#games").hide();

    } 

    /* Añadir Historial a la pila */
    function addHistory(nombre, puntos,index,num ){

        
         var objeto = {puntos:puntos,fecha:new Date(), nombre:nombre};
         history.pushState(objeto, "Adivinanzas", nombre);             
         estadoActual =  ListaJuegos.length;  
         var volver = index - estadoActual;
         var link=' <a id='+nombre+num+' href="javascript:history.go('+volver+')">'+nombre+num+" "+'Puntos:  '+puntos+' Fecha:'+objeto.fecha+'</a>'  ;
        $("#gamesHistory").append(link);
        
    }

/* ZONA de CONTROLES-INTERFAZ DE USUARIO */
          
    
    $("button.back").click(function(){
          history.back();
    })
    
     
    $("button.nivel-1").click(function(){
        $("#gamesHistory").hide();
        ChoiceLevel(6000);
           
    });

    $("button.nivel-2").click(function(){
         $("#gamesHistory");       
         ChoiceLevel(4000);         
    });

    $("button.play").click(function() {        	    
   
        /* Empezar a mostrar Fotos */
        var load = "images/loading.GIF";
        $("#images").html("<img class = "+'"load"'+" src="+load+">");
                       //$("#images").html("<img src="+ images[numFotos] +">");                
         images=[];
         getImages(hasTag);          
         StartGame = true;
         $("button.play").hide();
         $("button.restart").show();       
         MostrarFotos(Nivel, StartGame);            
                    
      });

 /* Programar el evento de lo que ocurre al clikear en el mapa */
  //  map.on('click', onMapClick);


    $("button.restart").click(function() {        	    
         //alert("¿Estás seguro en reiniciar el Juego?");
         numFotos =0;
         clearInterval(Stop);
         StartGame = true;
         $("p.puntuacion").html(" ");
         $("#images").html(" ");
         $("button.play").hide();
         $("button.restart").show(); 
        var load = "images/loading.GIF";
        $("#images").html("<img class = "+'"load"'+" src="+load+">");      
         MostrarFotos(Nivel, StartGame); 

     });

    $("button.new").click(function() {        	    
      //  alert("creando nuevo juego");
        var load = "images/init.gif";
        $("#images").html("<img class = "+'"load"'+" src="+load+">");
        $("button.mostrar").show();
        $("button.new").hide();
        $("button.historial").hide();
       $("button.nivel 1").hide(); 
        $("button.nivel 2").hide();
        $("button.back").hide();
        $("p.puntuacion").hide();
     });

    $("button.mostrar").click(function() {        	    
       // alert("mostrando juegos");
        $("button.historial").show();
        $("button.disponibles").show();
        $("button.mostrar").hide();
        $("#games").hide();
        $("#gamesHistory").hide();
   });
    
    $("button.disponibles").click(function(){
       $("button.mostrar").show(); 
       $("#games").show();
       $("button.disponibles").hide();
       $("button.historial").hide();
       $("#gamesHistory").hide();
       $("p.puntuacion").hide();
       
    })


    

    $("#capi").click(function(){
     //   alert("juego por capitales");
        Juego ="CP";
        $("#gamesHistory").hide();
        map.on('click', onMapClick); // Activo el evento de clickear en el mapa

        GetDatos("json/Capitales.json");        
        ChoiceGame();   
        $("p.capi").show();    
     
    })

    $("#ciudades").click(function(){
      //  alert("jugar por ciudades");
       // $("button.disponibles").show();
        Juego="CD";
        $("#gamesHistory").hide();
        map.on('click', onMapClick); // Activo el evento de clickear en el mapa
        GetDatos("json/Ciudades.json");
        ChoiceGame();        
        $("p.ciudades").show();
        
     
    })

    $("#estadios").click(function(){
       // alert("juegar por Estadios");
       // $("button.disponibles").show();
        
        Juego="EE";    
        $("#gamesHistory").hide();
        map.on('click', onMapClick); // Activo el evento de clickear en el mapa        
        GetDatos("json/Estadios.json");
        $("p.estadios").show();
        ChoiceGame();
     
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

