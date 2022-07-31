(function() {

    const lat = document.querySelector('#lat').value ||  -31.417509999999936;
    const lng = document.querySelector('#lng').value || -64.18170999999995;
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    let marker;
    //Utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // el pin
    marker = new L.marker([lat,lng],{
        draggable: true,
        autoPan: true
    }).addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend',function(e){
        marker = e.target

        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        //obetener la informacion de la calle a soltar el pin

        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){
            console.log(resultado)
            marker.bindPopup(resultado.address.LongLabel)

            //Llenar los campos

            document.querySelector('.calle').textContent = resultado?.address?.Address ?? ''
            document.querySelector('#calle').value = resultado?.address?.Address ?? ''
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''
        })
    })
})()