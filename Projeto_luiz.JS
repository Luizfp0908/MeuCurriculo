window.addEventListener("scroll", function () {
    var texto = document.getElementById("TextoHome");
    if (window.scrollY > 50) {
        texto.style.opacity = "0";
        texto.style.transition = "opacity 0.5s ease-in-out";
    } else {
        texto.style.opacity = "1";
        texto.style.transition = "opacity 0.5s ease-in-out";
    }
});

window.addEventListener("scroll", function () {
    var texto = document.getElementById("Contato");
    if (window.scrollY > 1000) {
        texto.style.opacity = "1";
        texto.style.transition = "opacity 0.5s ease-in-out";
    } else {
        texto.style.opacity = "0";
        texto.style.transition = "opacity 0.5s ease-in-out";
    }
});

window.addEventListener("scroll", function () {
    var navbar = document.getElementById("navbar");

    if (window.scrollY > 100) { 
        navbar.style.opacity = "0.9";  // Levemente transparente ao rolar
    } else {
        navbar.style.opacity = "1";  // Totalmente visível no topo
    }

    
});



  
function adicionarComentario() {
    const comentarioTexto = document.getElementById("comentarioInput").value.trim();
    const nomeUsuario = document.getElementById("nomeInput").value.trim();

    if (comentarioTexto === "" || nomeUsuario === "") {
        alert("Por favor, preencha seu nome e o comentário!");
        return;
    }

    const espacoComentarios = document.getElementById("espacoComentarios");

    const comentarioCard = document.createElement("div");
    comentarioCard.className = "card p-3 mb-3 d-flex flex-row justify-content-between align-items-center";

   
    const nomeText = document.createElement("strong");
    nomeText.textContent = nomeUsuario;
    nomeText.className = "me-2";

   
    const comentarioText = document.createElement("span");
    comentarioText.textContent = comentarioTexto;
    comentarioText.className = "text-muted";

    
    const botaoExcluir = document.createElement("button");
    botaoExcluir.className = "btn btn-sm btn-danger";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.onclick = () => {
        comentarioCard.remove();
    };

    
    comentarioCard.appendChild(nomeText);
    comentarioCard.appendChild(comentarioText);
    comentarioCard.appendChild(botaoExcluir);

   
    espacoComentarios.appendChild(comentarioCard);

    
    document.getElementById("comentarioInput").value = "";
    document.getElementById("nomeInput").value = "";
}