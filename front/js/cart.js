// Récupération des éléments du localstorage
let productsStorage = JSON.parse(localStorage.getItem("products"));

// Tableaux prix et quantité
let pricePack = [];
let quantityChoice = [];

//Affichage des produit ajouté au panier pas l'utilisateur 
for (let j in productsStorage) {
    // Récupération des informations des produits sélectionnés 
    const dataProduct = fetch("http://localhost:3000/api/products/"+productsStorage[j].id);

    dataProduct.then(async (responseData) => {
        const response = await responseData.json();
        console.log(response);


        // Création du block HTML des produits du panier 
        const items = document.getElementById("cart__items");
        const blockProduct = `<article class="cart__item" data-id="${productsStorage[j].id}" data-color="${productsStorage[j].color}">
        <div class="cart__item__img">
        <img src="${response.imageUrl}" alt="${response.altTxt}">
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${response.name}</h2>
            <p>${productsStorage[j].color}</p>
            <p>${response.price}</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : ${productsStorage[j].quantity} </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
        </div>
        </div>
        </article>`;

        // Affichage du block HTML des produits du panier
        items.insertAdjacentHTML("beforeend", blockProduct);

        // Calcul de la quantité d'article et du prix total du panier 
        quantityChoice.push(productsStorage[j].quantity * 1);  
        pricePack.push(productsStorage[j].quantity * response.price);

        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        
        // Affichage prix total du panier
        const totalPrice = pricePack.reduce(reducer);
        const showTotalPrice = document.getElementById("totalPrice");
        showTotalPrice.textContent = totalPrice;
        
        // Affichage quantité total du panier 
        const totalQuantity = quantityChoice.reduce(reducer);
        const showTotalQuantity = document.getElementById("totalQuantity");
        showTotalQuantity.textContent = totalQuantity;


        // Suppression de produit du panier 
        let listDeleteBtn = document.querySelectorAll(".deleteItem");
        console.log(listDeleteBtn);
        // On veut que pour chache bouton supprimer (1 par produit) le produit soit enlever du panier
        listDeleteBtn[j].addEventListener("click",()=>{

        });
    });
};
        

// Validation du formulaire au click du bouton de commande 
const order = document.getElementById("order");
order.addEventListener("click", (e) => {
    // Annulation des comportements par défaut au click d'un bouton 
    e.preventDefault();

    // Validation de la value du champ prénom
    const firstName = document.getElementById("firstName").value;
    const firstNameErr = document.getElementById("firstNameErrorMsg");

    function checkFirstName() {
        if(/^[A-Za-z]{3,20}$/.test(firstName)) {
            return true;
            firstNameErr.textContent = "";
        } else {
            firstNameErr.textContent = "Ne peut contenir que des lettres (minuscules ou majuscules), trois caractères minimum vingt maximum";
            return false;
        }
    };

    // Validation de la value du champ nom
    const lastName = document.getElementById("lastName").value;
    const lastNameErr = document.getElementById("lastNameErrorMsg");

    function checkLastName () {
        if(/^[A-Za-z]{3,20}$/.test(lastName)) {
            return true;
            lastNameErr.textContent = "";
        } else {
            lastNameErr.textContent = "Ne peut contenir que des lettres (minuscules ou majuscules), trois caractères minimum vingt maximum";
            return false;
        }
    };

    // Validation de la value du champ adresse
    const address = document.getElementById("address").value;
    const addressErr = document.getElementById("addressErrorMsg");

    function checkAdress () {
        if(/^[a-zA-Z0-9\s\,\''\-]*$/.test(address)){
            return true;
            addressErr.textContent = "";
        } else {
            addressErr.textContent = "Adresse incorrect";
            return false;
        }
    };

    // Validation de la value du champ ville
    const city = document.getElementById("city").value;
    const cityErr = document.getElementById("cityErrorMsg");

    function checkCity () {
        if(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/.test(city)) {
            return true;
            cityErr.textContent = "";
        } else {
            cityErr.textContent = "Ville incorrect";
            return false;
        }
    };

    // Validation de la value du champ email
    const email = document.getElementById("email").value;
    const emailErr = document.getElementById("emailErrorMsg");
    
    function checkEmail () {
        if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return true;
            emailErr.textContent = "";
        } else {
            emailErr.textContent = "Email incorrect";
            return false;
        }
    };

    // Cration d'un objet contenant les informations saisie par l'utilisateur pour effectuer sa commande 
    let contact = {
            firstName : `${firstName}`,
            lastName : `${lastName}`,
            address : `${address}`,
            city : `${city}`,
            email : `${email}`
    };

    // Création d'un tableau contenant les id des produits contenues dans le panier
    let products = [];

    // Récupérations des id des products du panier 
    for(k in productsStorage) {
        const idProducts = productsStorage[k].id;
        
        // On met les id dans le tableau
        products.push(`${idProducts}`);
    };
    console.log(products);

    // Dernière validation champ par champ du formulaire pour envoyer les infos si elles sont correctemet renseignées et qu'il y a bien des produits dans le panier 
    if(checkFirstName() && checkLastName() && checkAdress() && checkCity() && checkEmail() && products.lenght > 0) {
        // On envoie les infos de l'utilisateur dans le localStorage
        localStorage.setItem("contact", JSON.stringify(contact));

        // On créé un objet contenant un objet où il y a les infos de l'utilisateur et un tableau contenant les id des produitts que l'uitlisateur veut acheter
        const sendToApi = {
            contact,
            products
        };
        console.log(sendToApi);

        // On envoiee la requête POST à l'api 
        const postOrder = fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            // On  lui envoie notre objet contenant la commande de l'utilisateur
            body: JSON.stringify(sendToApi),
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            }
        });
        console.log(postOrder);

        // On traite la réponse de l'api 
        postOrder.then(async(response) => {
            try {
                console.log("response");
                console.log(response);

                // On prend le numéro de commande 
                const contentResponse = await response.json();
                console.log("contentResponse");
                console.log(contentResponse);
                // On envoie le numéro de commande dans le localStorage
                localStorage.setItem("orderNumber", JSON.stringify(contentResponse));
            } catch(e) {
                console.log("e");
                console.log(e);
            }
        });

        // On redirige l'utilisateur vers la page confirmation où il y recevra son numéro de commande
        window.location.href = document.location.origin + "/front/html/confirmation.html";
    // Si un ou plusieurs des champs n'est pas correctement renseigné ou que l'utilisateur n'a pas ajouté de produit au panier     
    }else {
        // On affiche une alerte demandant à l'utilisateur de remplir les champs correctement ou de choisir un produit
        alert("Remplissez les champs correctement /n Ou veillez sélectionner un produit");
    };
});


