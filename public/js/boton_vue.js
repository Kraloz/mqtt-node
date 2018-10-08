// Self-Invoking Anonymous Function para encapsulamiento (seguridad)

    // Conexión SocketIO al servidor
    const socket = io.connect("http://" + document.domain + ":" + location.port);
    
    Vue.component("boton_led", {
        
        template:`<button v-on:click=switch()>Cambiar estado</button>`,
        methods:{
            getLed: function(){socket.emit("getLed");},
            switch: function(){socket.emit("switchLed")}

        },
        created: function(){
            
            this.getLed();
        }

        
    });

    socket.on("respuestaLed", (resp) => { 
        let led = resp.led;
        app.led = led;
    });



