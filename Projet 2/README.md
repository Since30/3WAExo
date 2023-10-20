### Liste des cinémas

Le but de ce projet est de manipuler l'api [https://data.culture.gouv.fr/explore/dataset/etablissements-cinematographiques/api/](https://data.culture.gouv.fr/explore/dataset/etablissements-cinematographiques/api/).

Vous pouvez récupérer les cinémas proches de votre position à l'aide ce filtre :
within_distance(geolocalisation, geom'POINT(7.75 48.58)', 10km)

#### Instructions

1. Mettre en place une page web avec un formulaire contenant un champ texte pour l'adresse et un bouton de validation ainsi qu'un bouton pour "Me géolocaliser" à côté du champ texte
2. Lorsque l'on clique sur le bouton "Me géolocaliser" on récupère les coordonnées GPS de l'utilisateur et il faudra aller chercher l'adresse correspondante à ces coordonnées dans l'api [https://adresse.data.gouv.fr/api-doc/adresse](https://adresse.data.gouv.fr/api-doc/adresse)
3. Lorsque l'adresse a été récupérée, remplir le champ texte avec cette adresse
4. Lorsque le formulaire de recherche a été soumis, récupérer les coordonnées GPS correspondantes à l'adresse, grâce à cette [api]([https://adresse.data.gouv.fr/api-doc/adresse](https://adresse.data.gouv.fr/api-doc/adresse)
5. Une fois les coordonnées récupérées, envoyer une requête vers l'api pour récupérer la liste des cinémas proches de cette zone (dans un rayon de 10km)
6. Afficher la liste des cinémas sur la page (nom du cinéma, adresse, ville)
7. [BONUS] Trier la liste des cinémas en fonction de la distance par rapport à votre position (la distance apparaîtra également sur la liste)
8. [BONUS++] Afficher une carte interactive à côté de la liste des cinémas (moitié écran carte/moitié écran liste des cinémas) avec tous les cinémas situés à l'intérieur des limites de la carte