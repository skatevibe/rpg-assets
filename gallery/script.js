const USER = "skatevibe";
const REPO = "rpg-assets";

const FOLDER = "assets/icons";

const gallery = document.getElementById("gallery");
const search = document.getElementById("search");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");

let images = [];

async function getImages(path = FOLDER) {
    const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${path}`;

    const response = await fetch(url);
    const files = await response.json();

    let results = [];

    for (const file of files) {

        if (file.type === "file" && /\.(png|jpg|jpeg|webp|gif)$/i.test(file.name)) {
            results.push(file);
        }

        if (file.type === "dir") {
            const folderImages = await getImages(file.path);
            results = results.concat(folderImages);
        }
    }

    return results;
}


function displayImages(list) {

    gallery.innerHTML = "";

    list.forEach(file => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${file.download_url}" alt="${file.name}">
            <div class="filename">${file.name}</div>
        `;

        const image = card.querySelector("img");

        image.addEventListener("click", () => {
            lightboxImage.src = file.download_url;
            lightbox.classList.remove("hidden");
        });

        gallery.appendChild(card);

    });

}


search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = images.filter(image =>
        image.name.toLowerCase().includes(value)
    );

    displayImages(filtered);

});


lightbox.addEventListener("click", () => {
    lightbox.classList.add("hidden");
});


async function init() {

    gallery.innerHTML = "<p>Chargement...</p>";

    images = await getImages();

    displayImages(images);

}


init();
