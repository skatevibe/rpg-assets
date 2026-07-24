const USER="skatevibe";
const REPO="rpg-assets";
const ROOT="assets/icons";
 
const gallery=document.getElementById("gallery");
const back=document.getElementById("back");

let currentPath=ROOT;

// récupérer le contenu d'un dossier github
async function getFolder(path){
    const url=`https://api.github.com/repos/${USER}/${REPO}/contents/${path}`;
    const res=await fetch(url);
    return await res.json();
} 

// affiche les dossiers
function showFolders(folders){
    gallery.innerHTML="";
    folders.forEach(folder=>{
        const card=document.createElement("div");
        card.className="card";
        card.innerHTML=`📁<div class="name">${folder.name}</div>`;

        // entrer dans le dossier
        card.onclick=()=>{
            currentPath=folder.path;
            loadFolder(currentPath);
        };
        gallery.appendChild(card);
    });
}

function showImages(images){
    gallery.innerHTML="";

    images.forEach(image=>{
        const card=document.createElement("div");
        card.className="card";
        card.innerHTML=`
            <img src="${image.download_url}" alt="">
            <button class="copy" title="Copier l'URL">⧉</button>
        `;
        const button = card.querySelector(".copy");
        button.onclick = (e)=>{
            e.stopPropagation();
            navigator.clipboard.writeText(image.download_url);
            button.textContent="✓";
            setTimeout(()=>{
                button.textContent="⧉";
            },1000);
        };
        gallery.appendChild(card);
    });
}

// charge un dossier
async function loadFolder(path){
    const files=await getFolder(path);
    const folders=files.filter(f=>f.type==="dir");
    const images=files.filter(f=>
        f.type==="file" &&
        /\.(png|jpg|jpeg|webp|gif)$/i.test(f.name)
    );
    if(folders.length){
        showFolders(folders);
    }else{
        showImages(images);
    }

    // affiche le bouton retour si pas à la racine
    if(path!==ROOT){
        back.classList.remove("hidden");
    }
}

// back to homepage 
back.onclick=()=>{
    currentPath=ROOT;
    back.classList.add("hidden");
    loadFolder(ROOT);
};

// lance  la galerie
loadFolder(ROOT);
