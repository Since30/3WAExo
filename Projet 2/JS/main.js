document.addEventListener("DOMContentLoaded", function () {
  const adresseAPI = "https://api-adresse.data.gouv.fr/search/";
  const cinemasAPI = "https://data.culture.gouv.fr/api/records/1.0/search/";
  let userCoords = null;
  let mapReference = null;

  // Fonction pour initialiser la carte
  function initializeMap() {
    const map = L.map("map").setView([48.8534, 2.3488], 13); // Coordonnées de Paris

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);

    return map; // Retourne la référence de la carte
  }

  // Appel de la fonction pour initialiser la carte
  mapReference = initializeMap();

  document
    .querySelector("#geolocaliserButton")
    .addEventListener("click", function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          fetchAdresseFromCoords(userCoords);
        });
      } else {
        alert(
          "La géolocalisation n'est pas prise en charge par votre navigateur."
        );
      }
    });

  document
    .querySelector("#searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const userAdresse = document.querySelector("#adresseInput").value; // Changement ici

      if (userAdresse.trim() === "") {
        // Changement ici
        alert("Veuillez entrer une adresse.");
        return;
      }

      preventAutoDisplay = true;
      fetchCoordsFromAdresse(userAdresse); // Changement ici
    });

  function fetchAdresseFromCoords(coords) {
    const url = `${adresseAPI}?q=${coords.latitude},${coords.longitude}&limit=1`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const adresse = data.features[0].properties.label;
        document.querySelector("#adresseInput").value = adresse;

        fetchCoordsFromAdresse(adresse);
      })
      .catch((error) => console.error("Erreur:", error));
  }

  function fetchCoordsFromAdresse(adresse) {
    const url = `${adresseAPI}?q=${adresse}&limit=1`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        userCoords = {
          latitude: data.features[0].geometry.coordinates[1],
          longitude: data.features[0].geometry.coordinates[0],
        };

        fetchCinemas(userCoords);
      })
      .catch((error) => console.error("Erreur:", error));
  }

  document
    .querySelector("#adresseInput")
    .addEventListener("input", function () {
      preventAutoDisplay = false;
    });

  function fetchCinemas(coords) {
    const url = `${cinemasAPI}?dataset=etablissements-cinematographiques&geofilter.distance=${coords.latitude},${coords.longitude},10000`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        displayCinemas(data.records);
      })
      .catch((error) => console.error("Erreur:", error));
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
  }

  function displayCinemas(cinemas) {
    const cinemasContainer = document.querySelector("#cinemasContainer");
    cinemasContainer.innerHTML = "";

    cinemas.forEach((cinema) => {
      const cinemaElement = document.createElement("div");
      cinemaElement.classList.add("cinema");

      const nom = document.createElement("h2");
      nom.textContent = cinema.fields.nom_etablissement;

      const adresse = document.createElement("p");
      adresse.textContent = cinema.fields.adresse;

      const ville = document.createElement("p");
      ville.textContent = cinema.fields.commune;

      const distance = document.createElement("p");
      const distanceEnKilometres = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        cinema.fields.lat || 0, // Utilisation de 0 comme valeur par défaut si non défini
        cinema.fields.lon || 0 // Utilisation de 0 comme valeur par défaut si non défini
      );

      distance.textContent = `Distance : ${distanceEnKilometres} km`;

      cinemaElement.appendChild(nom);
      cinemaElement.appendChild(adresse);
      cinemaElement.appendChild(ville);
      cinemaElement.appendChild(distance);

      cinemasContainer.appendChild(cinemaElement);

      // Vérifier si les coordonnées sont définies avant d'ajouter le marqueur
      if (cinema.fields.lat !== undefined && cinema.fields.lon !== undefined) {
        L.marker([cinema.fields.lat, cinema.fields.lon])
          .addTo(mapReference)
          .bindPopup(cinema.fields.nom_etablissement);
      }
    });
  }
});
