## Projets

Pour chaque projet, découper au maximum le code en plusieurs fonctions/classes et en plusieurs fichiers. Si c'est possible, essayer d'utiliser la syntaxe *async/await*.

### Liste des films

Le but de ce projet est de manipuler l'api [themoviedb](https://developer.themoviedb.org/reference/intro/getting-started).

Clé api : 60a2e5a69a97fbd2ed6179f0ba108a6a

On utilisera le endpoint "search/movie". L'url ressemblera donc à quelque chose comme ça : 
https://api.themoviedb.org/3/search/movie?api_key=60a2e5a69a97fbd2ed6179f0ba108a6a&query=batman

Pour les images, l'api ne renvoie que le nom du fichier, il faudra rajouter le chemin complet de l'image. Vous trouvez les informations [ici](https://developer.themoviedb.org/docs/image-basics)

#### Pré-requis

Créer une clé API sur le site [https://www.themoviedb.org/](https://www.themoviedb.org/). Pour cela il faut se créer un compte puis faire une demande de clé (normalement c'est instantanné).

#### Instructions

1. Mettre en place une page web avec un formulaire de recherche avec un champ texte pour la recherche et un bouton pour valider le formulaire
2. Lorsque le formulaire de recherche est soumis, envoyer une requête ajax vers l'api pour récupérer la liste des films correspondants à cette recherche
3. Créer les différents éléments sur la page avec les informations des films (titre, description si possible en français, image du film)
4. Afficher une pagination (liens vers les différentes pages) après chaque recherche
5. Lorsque l'on clique sur le numéro d'une page, on fait une autre requête vers le même film mais avec un numéro de page différent