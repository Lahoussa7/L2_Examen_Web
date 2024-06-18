document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    let l = urlParams.get('num');
    let titre = "";
    let auteur = "";
    let isbn = "";
    let image = ""; // Fichier image
    let editeur = "";
    let datePublication = "";
    let genre = "";
    let resume = "";
    let langue = "";
    let nombrePages = "";
    let disponibilite = "";
    let etat = "";
    let emplacement = "";
    let contenu="";
    // pagination(5);
    const search = document.getElementById("search");
    const tableBody = document.getElementById('tables'); // Sélectionner le corps du tableau
    const divLivres = document.getElementById('livres-container');

    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Empêche la soumission du formulaire par défaut

        // Récupérer les valeurs du formulaire
        titre = document.getElementById('titre').value;
        auteur = document.getElementById('auteur').value;
        isbn = document.getElementById('isbn').value;
        image = document.getElementById('img').files[0]; // Fichier image
        editeur = document.getElementById('edit').value;
        datePublication = document.getElementById('date').value;
        genre = document.getElementById('genre').value;
        resume = document.getElementById('resume').value;
        langue = document.getElementById('langue').value;
        nombrePages = document.getElementById('page').value;
        disponibilite = document.getElementById('dispo').value;
        etat = document.getElementById('etat').value;
        emplacement = document.getElementById('place').value;
        chargerDonneesInitiale();
    });

    // Fonction pour charger les données depuis localStorage ou le fichier JSON initial
    displayContent();

    function chargerDonneesInitiale() {
        // Vérifier si des données existent dans localStorage
        const localStorageData = localStorage.getItem('livresData');
        if (localStorageData) {
            const livresData = JSON.parse(localStorageData);
            livresData.livres.push({
                titre: titre,
                auteurs: auteur.split(','),
                isbn: isbn,
                image: image ? image.name : null,
                editeur: editeur,
                date_publication: datePublication,
                genre: genre.split(','),
                resume: resume,
                langue: langue,
                nombre_pages: nombrePages,
                disponibilite: disponibilite,
                etat: etat,
                emplacement: emplacement
            });
            // Mettre à jour localStorage avec les données mises à jour
            localStorage.setItem('livresData', JSON.stringify(livresData));
            // Actualiser l'affichage des livres
            displayContent();
        } else {
            // Si aucune donnée n'existe dans localStorage, charger depuis le fichier JSON initial
            fetch('../Json/livre.json')
                .then(response => response.json())
                .then(livresData => {
                    livresData.livres.push({
                        titre: titre,
                        auteurs: auteur.split(','),
                        isbn: isbn,
                        image: image ? image.name : null,
                        editeur: editeur,
                        date_publication: datePublication,
                        genre: genre,
                        resume: resume,
                        langue: langue,
                        nombre_pages: nombrePages,
                        disponibilite: disponibilite,
                        etat: etat,
                        emplacement: emplacement
                    });
                    // Mettre à jour localStorage avec les données mises à jour
                    localStorage.setItem('livresData', JSON.stringify(livresData));
                    // Actualiser l'affichage des livres
                    displayContent();
                })
                .catch(error => {
                    console.error('Erreur lors du chargement du fichier JSON initial :', error);
                    alert('Erreur lors du chargement des données. Veuillez réessayer.');
                });
        }
    }
    Searchdata();

    // Fonction pour afficher les livres dans le tableau HTML
    function displayContent() {
        tableBody.innerHTML = ''; // Vider le contenu précédent du tableau
     
        const localStorageData = localStorage.getItem('livresData');
       
        if (localStorageData) {
            const livresData = JSON.parse(localStorageData);
            if (l !== null) {
                contenu = livresData.livres.slice(2 * (l - 1), 2 * l);
            } else {
                contenu = livresData.livres;
            }
            pagination(livresData.livres.length);
            console.log("cucou"+livresData.livres.length)
            contenu.forEach((livre, index) => {
                const row = document.createElement('tr'); // Créer une nouvelle ligne

                // Ajouter les cellules avec les données du livre
                const cellTitre = document.createElement('td');
                cellTitre.textContent = livre.titre;
                row.appendChild(cellTitre);

                const cellAuteurs = document.createElement('td');
                cellAuteurs.textContent = livre.auteurs.join(', ');
                row.appendChild(cellAuteurs);

                const cellEditeur = document.createElement('td');
                cellEditeur.textContent = livre.editeur;
                row.appendChild(cellEditeur);

                const cellImage = document.createElement('td');
                if (livre.image) {
                    const img = document.createElement('img');
                    img.classList.add("img");
                    img.src = livre.image;
                    img.alt = 'Image du livre';
                    img.style.maxWidth = '100px'; // Définir une largeur maximale pour l'image
                    cellImage.appendChild(img);
                }
                console.log(livre.image);
                row.appendChild(cellImage);

                // Ajouter une cellule pour le bouton "Effacer"
                const cellAction = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.classList.add("button");
                deleteButton.textContent = 'Effacer';
                const detailButton = document.createElement('button');
                detailButton.classList.add("button");
                detailButton.textContent = 'Details';
                deleteButton.addEventListener('click', () => {
                    // Appeler une fonction pour supprimer le livre correspondant
                    supprimerLivre(index);
                });
                detailButton.addEventListener('click', () => {
                    // Appeler une fonction pour supprimer le livre correspondant
                    pourdetails(livre)
                });
                cellAction.appendChild(detailButton);
                cellAction.appendChild(deleteButton);
                row.appendChild(cellAction);

                // Ajouter la ligne au corps du tableau
                tableBody.appendChild(row);
            });
        } else {
            console.log('Aucune donnée n\'est présente dans localStorage sous la clé "livresData".');
        }
    }
    Searchdata();
    // Fonction pour supprimer un livre
    function supprimerLivre(index) {
        const localStorageData = localStorage.getItem('livresData');
        if (localStorageData) {
            const livresData = JSON.parse(localStorageData);
            livresData.livres.splice(index, 1); // Supprimer le livre à l'index donné
            localStorage.setItem('livresData', JSON.stringify(livresData));
            // Actualiser l'affichage des livres après suppression
            displayContent();
        } else {
            console.log('Aucune donnée n\'est présente dans localStorage sous la clé "livresData".');
        }
    }
    function pourdetails(livre){
        const div = document.querySelector(".container");
        // const div1 = document.createElement("div");
        div.innerHTML=`<img src=${livre.image}>
        <p>isbn:${livre.isbn}</p>
        <p>Resume:${livre.resume}</p>
        <p>Langue:${livre.langue}</p>
        <p>Nombre de page:${livre.nombre_pages}</p>
        <p>Disponibilite:${livre.disponibilite}</p>
        <p>Etat:${livre.etat}</p>
        <p>Emplacement:${livre.emplacement}</p>`
        divLivres.appendChild(div);
    }

    function Searchdata() {
        const form = document.getElementById("form1");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
         
            const srch = search.value.trim().toLowerCase();
        
            const localStorageData = localStorage.getItem('livresData');
           
            if (localStorageData) {
                const livresData = JSON.parse(localStorageData);
                contenu = livresData.livres.filter(item => item.titre.toLowerCase().includes(srch));
                pagination(Math.ceil(contenu.length / 2));
                displayContent();
            } else {
                console.log('Aucune donnée n\'est présente dans localStorage sous la clé "livresData".');
            }
        });
    }
    
  
    function pagination(l) {
        const divLivres = document.getElementById('livres-container');
        const sec = document.getElementById("page");
        for (let i = 1; i <= l / 2; i++) {
            const a = document.createElement("a");
            const url = new URL(window.location.href);
            url.searchParams.set('num', i);
            console.log(i);
            // url.searchParams.set('num1', i);
            a.href = url.href;
            a.textContent = `${i}`;
            sec.appendChild(a);
            divLivres.appendChild(sec);
        }
    }
});
