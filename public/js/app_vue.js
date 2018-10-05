// Self-Invoking Anonymous Function para encapsulamiento (seguridad)
(function(){
    // Conexión SocketIO al servidor
    const socket = io.connect("http://" + document.domain + ":" + location.port);

    // Instancia de Vue.js
    var app = new Vue({
        el: "#app",
        data: {
            // array para la data que me venga del server
            sensores: []
        },
        methods:{
            // método para pedirle la data al server
            getSensores: function(){socket.emit("getSensores");}
        },
        created : function() {
            // Hook en la etapa *created* de Vue, cuando se crea la app ejecuto el método para pedir la data
            this.getSensores();
        }
    });
    
    // Cuando me llegue la data, se la paso a la app
    socket.on("respuestaSensores", (resp) => { 
        let sensores = resp.sensores;
        app.sensores = sensores;
    });

})();