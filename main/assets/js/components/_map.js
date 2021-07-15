const map = document.getElementById('mapContainer')

if (elementExists(map)) {
  //Toronto Map
	const coordinatesTen = [36.17006, -86.78382];
  const coordinatesTex = [32.51935, -94.474008];
  const coordinatesUSA = [34.91735, -90.92906];
  const mainOffice = document.getElementById('mainOffice').textContent;
  const officeII = document.getElementById('officeII').textContent;
  const details = document.querySelector('.details');

  details.addEventListener('click', (e) => {
    e.preventDefault()
    let link = e.target;
    let addressId= link.dataset.addressId;
    let address = document.getElementById(addressId).textContent
    let marker = "markerTen";
    if (addressId != "mainOffice") {
      marker = markerTex;
    }
    eval(marker).bindPopup(`<span class='font-bold'>${link.dataset.title}</span><br>${address}.`).openPopup();
  })


	const mapUSA = L.map('mapContainer').setView(coordinatesUSA, 5.5);
	createMapTile(mapUSA);
	const markerTen = L.marker(coordinatesTen).addTo(mapUSA);
  const markerTex = L.marker(coordinatesTex).addTo(mapUSA);

  //Setup how the user interacts with the map
	setMapControl(mapUSA);

  function openMarkerPopup() {
    //read data from event object for title and address and sent to marker

  }
  // markerTen.bindPopup(`<span class='font-bold'>Main Office</span><br>${mainAddress}.`).openPopup();
  // markerTex.bindPopup(`<span class='font-bold'>Office II</span><br>${officeII}.`).openPopup();

  function createMapTile(mapName) {
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 10,
			tileSize: 512,
			zoomOffset: -1,
		}).addTo(mapName);
	}

  //disable scroll zoom until user clicks on map
	function setMapControl(mapName){
			mapName.scrollWheelZoom.disable();
			mapName.on('focus', () => { mapName.scrollWheelZoom.enable(); });
			mapName.on('blur', () => { mapName.scrollWheelZoom.disable(); });
	}

}