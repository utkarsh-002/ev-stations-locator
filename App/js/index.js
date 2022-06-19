 var map;
 var ramaiah = {lat: 34.063380, lng: -118.358080};
 var infoWindow ;
 var markers = [];
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
         center: ramaiah,
        zoom: 9
    });
    var marker = new google.maps.Marker({
        position: ramaiah,
         map: map,
         label: '$'
        });
        infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
 }

 const onEnter = (e)=> {
    if(e.key == "Enter"){
        getStations();
    }
 }

 const getStations = ()=>{
    const zipCode = document.getElementById("zip-code").value;
    if(!zipCode){
        return;
    }
    const API_URL = 'http://localhost:3000/api/stations';
    const fullUrl = `${API_URL}?zip_code=${zipCode}`;
    fetch(fullUrl).then((response)=>{
        if(response.status == 200)
            return response.json();
        else
            throw new Error(response.status);
    }).then((data)=>{
        if(data.length> 0){
            clearLocations();
            searchLocationNear(data);
            setStoreList(data);
            setOnClickListener();
        }
        else{
            clearLocations();
            noStationsFound();
        }
        
    })
 }

const clearLocations = () =>{
    infoWindow.close();
    for(var i =0;i<markers.length;i++){
        markers[i].setMap(null);
    }
    markers.length = 0;
    var marker = new google.maps.Marker({
        position: ramaiah,
         map: map,
         label: '$'
        });
        infoWindow = new google.maps.InfoWindow();
}

const noStationsFound = () => {
    const html = `
        <div class= "no-stations-found">No Stations Found
        </div>
    `
    document.querySelector('.stations-list').innerHTML = html;
}

 const setOnClickListener = ()=>{
    let storeElements = document.querySelectorAll('.container');
    storeElements.forEach((elem, index)=>{
        elem.addEventListener('click',()=>{
            google.maps.event.trigger(markers[index],'click');
        })
    })
 }

 const setStoreList = (stations) => {
    let stationsHtml = '';
    stations.forEach((station, index)=>{
        stationsHtml +=`
        <div class="container">
            <div class="container-bg">
                <div class="info">
                    <div class="address">
                        <span>${station.addressLines[0]}</span>
                        <span>${station.addressLines[1]}</span>
                    </div>
                    <div class="phone">${station.phoneNumber}</div>
                </div>
                <div class="num-container">
                <div class="number">${index+1}</div>
                </div>
            </div>
         </div>
        `
    })
    document.querySelector('.stations-list').innerHTML = stationsHtml;
 }
 const searchLocationNear = (stations) => {
    let bounds  = new google.maps.LatLngBounds();
    stations.forEach((station,index) => {
        let latlng = new google.maps.LatLng(
            station.location.coordinates[1],
            station.location.coordinates[0]);
        let name = station.stationName;
        let address = station.addressLines[0];
        let phone = station.phoneNumber;
        let openStatusText = station.openStatusText;
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phone, index+1);
    });
    map.fitBounds(bounds);
 }

 const createMarker = (latlng, name, address,openStatusText, phone,stationNumber) =>{
    let html = `
        <div class="info-window">
            <div class="store-name">${name}</div>
            <div class="open-status">${openStatusText}</div>
            <div class="store-address">
            <div class="icon"><i class="fa-solid fa-location-crosshairs"></i></div>
            <span>${address}</span>
            </div>
            <div class="store-phone">
            <div class="icon"><i class="fa-solid fa-phone"></i></div>
            <span><a href="tel:${phone}">${phone}</span>
            </div>
        </div>
    `;
  var marker = new google.maps.Marker({
        position: latlng,
         map: map,
         label: `${stationNumber}`
        });
    google.maps.event.addListener(marker,'click',function(){
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    })
    markers.push(marker);
 };

 const currLocation = ()=> {
    if(navigator.geolocation)
                navigator.geolocation.getCurrentPosition(function(position){
                    let curr = {lat:position.coords.latitude,lng:position.coords.longitude}
                    ramaiah = curr;
                    initMap();
                });
 };