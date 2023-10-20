document.addEventListener("DOMContentLoaded", function () {
  console.log("Le DOM est chargé.");

  let preventAutoDisplay = false;

  const adresseAPI = "https://api-adresse.data.gouv.fr/search/";
  const cinemasAPI = "https://data.culture.gouv.fr/api/records/1.0/search/";
  let userCoords = null;
  let mapReference = null;

  function initializeMap() {
    console.log("Initialisation de la carte...");
    const map = L.map("map").setView([46.603354, 1.888334], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);

    return map;
  }

  mapReference = initializeMap();
  console.log("Carte initialisée.");

  document
    .querySelector("#geolocaliserButton")
    .addEventListener("click", function () {
      console.log("Bouton de géolocalisation cliqué.");
      if (navigator.geolocation) {
        console.log("La géolocalisation est supportée par le navigateur.");
        navigator.geolocation.getCurrentPosition(function (position) {
          userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("Coordonnées récupérées :", userCoords);
          fetchAdresseFromCoords(userCoords);
        });
      } else {
        alert(
          "La géolocalisation n'est pas prise en charge par votre navigateur."
        );
        console.log(
          "La géolocalisation n'est pas supportée par le navigateur."
        );
      }
    });

  document
    .querySelector("#searchForm")
    .addEventListener("submit", function (event) {
      console.log("Formulaire de recherche soumis.");
      event.preventDefault();
      const adresse = document.querySelector("#adresseInput").value;

      if (adresse.trim() === "") {
        alert("Veuillez entrer une adresse.");
        console.log("Aucune adresse saisie.");
        return;
      }

      preventAutoDisplay = true;
      console.log("Adresse saisie :", adresse);
      fetchCoordsFromAdresse(adresse);
    });

  function fetchAdresseFromCoords(coords) {
    console.log("Récupération de l'adresse à partir des coordonnées...");
    const url = `${adresseAPI}?q=${coords.latitude},${coords.longitude}&limit=1`;
    console.log("URL pour la requête d'adresse :", url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const adresse = data.features[0].properties.label;
        document.querySelector("#adresseInput").value = adresse;
        console.log("Adresse récupérée :", adresse);
      })
      .catch((error) => console.error("Erreur:", error))
      .finally(() => {
        if (!preventAutoDisplay) {
          fetchCinemas(userCoords);
        }
      });
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

  function fetchCinemas(coords) {
    console.log("Récupération des cinémas...");
    const url = `${cinemasAPI}?dataset=etablissements-cinematographiques&geofilter.distance=${coords.latitude},${coords.longitude},10000`;
    console.log("URL pour la requête des cinémas :", url);

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
    console.log("Distance calculée :", distance.toFixed(2));
  }

  function displayCinemas(cinemas) {
    console.log("Affichage des cinémas...");
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
        cinema.fields.latitude || 0,
        cinema.fields.longitude || 0
      );

      distance.textContent = `Distance : ${distanceEnKilometres} km`;

      cinemaElement.appendChild(nom);
      cinemaElement.appendChild(adresse);
      cinemaElement.appendChild(ville);
      cinemaElement.appendChild(distance);

      cinemasContainer.appendChild(cinemaElement);

      if (
        cinema.fields.latitude !== undefined &&
        cinema.fields.longitude !== undefined
      ) {
        L.marker([cinema.fields.latitude, cinema.fields.longitude])
          .addTo(mapReference)
          .bindPopup(cinema.fields.nom_etablissement);
      }
    });
  }
});
