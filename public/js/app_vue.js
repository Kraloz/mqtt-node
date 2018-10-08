// Self-Invoking Anonymous Function para encapsulamiento (seguridad)
(function(){
    // Conexión SocketIO al servidor
    const socket = io.connect("http://" + document.domain + ":" + location.port);

    // Instancia de Vue.js
    var app = new Vue({
        el: "#app",
        data: {
            // array para la data que me venga del server
            sensores: [],
            led: []
            
        },
        methods:{
            // método para pedirle la data al server
            getSensores: function(){socket.emit("getSensores");},
            switch: function(e){
                console.log("exito");
            }
            

        },
        created : function() {
            // Hook en la etapa *created* de Vue, cuando se crea la app ejecuto el método para pedir la data
            this.getSensores();
            
        }
    });

    Vue.component("boton_led", {
        
        template:`<div><button v-on:click=switchLed()>Cambiar estado</button></div>`,
        methods:{
            getLed: function(){socket.emit("getLed");},
            switchLed: function(){console.log("swtichLed");socket.emit("switchLed");}
        },
        created: function(){
            this.getLed();
        }

        
    });
    
   

    // Cuando me llegue la data, se la paso a la app
    socket.on("respuestaSensores", (resp) => { 
        let sensores = resp.sensores;
        app.sensores = sensores;
    });
    socket.on("respuestaLed", (resp) => { 
        let led = resp.led;
        app.led = led;
    });

    

})();