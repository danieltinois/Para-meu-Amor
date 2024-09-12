// Variáveis
let mobileMediaQuery = window.matchMedia("(max-width: 400px)");
let tabletMediaQuery = window.matchMedia("(min-width: 400px) and (max-width: 600px)");
const notes = document.querySelectorAll(".js-note");
const overlay = document.createElement("div");  // Cria o overlay
const fullContentDiv = document.createElement("div"); // Cria a div que mostrará o conteúdo completo

// Adiciona o overlay e a div de conteúdo ao body
overlay.classList.add("overlay");
fullContentDiv.classList.add("full-content");
document.body.appendChild(overlay);
document.body.appendChild(fullContentDiv);

// Função que redefine o tamanho das notas.
function resizeNotes() {
  notes.forEach(note => {
    if (note.classList.contains("active")) {
      note.classList.remove("active");
      gsap.set(note, {
        height: "22%",
        clearProps: "all"
      });
    }
  });
}

// Função que expande o conteúdo da carta e escurece o fundo
function expandNote(note, content) {
  // Mostra o fundo escurecido
  gsap.to(overlay, {
    opacity: 0.7, // Opacidade do fundo
    display: "block",
    duration: 0.5
  });

  // Exibe a nova div com o conteúdo completo
  fullContentDiv.innerHTML = content;
  gsap.to(fullContentDiv, {
    opacity: 1,
    display: "block",
    duration: 0.5
  });
}

// Função que colapsa a carta e remove o fundo escurecido
function collapseNote() {
  // Remove o fundo escurecido
  gsap.to(overlay, {
    opacity: 0,
    display: "none",
    duration: 0.5
  });

  // Esconde a div de conteúdo
  gsap.to(fullContentDiv, {
    opacity: 0,
    display: "none",
    duration: 0.5
  });

  // Retorna as cartas ao tamanho normal
  notes.forEach(note => {
    gsap.to(note, {
      scale: 1,
      zIndex: 1,
      duration: 0.5
    });
  });
}

// Função principal que habilita todas as notas.
function notesReady() {
  gsap.to(".js-envelop-content", {
    height: "120%",
    duration: 0.5
  });

  notes.forEach((note, i) => {
    note.addEventListener("click", function () {
      const content = note.querySelector(".js-note-content").innerHTML; // Pega o conteúdo da carta
      const heightValues = mobileMediaQuery.matches
        ? `125% + ${40 * i}%`
        : tabletMediaQuery.matches
        ? `80% + ${21 * i}%`
        : `70% + ${20 * i}%`;

      if (this.classList.contains("active")) {
        this.classList.remove("active");
        collapseNote(); // Colapsa a nota
        gsap.set(this, {
          height: "22%",
          clearProps: "all"
        });
      } else {
        notes.forEach(n => {
          if (n.classList.contains("active")) {
            n.classList.remove("active");
            gsap.set(n, {
              height: "22%",
              clearProps: "all"
            });
          }
        });
        this.classList.add("active");
        gsap.set(this, {
          height: heightValues
        });
        expandNote(this, content); // Expande a nota e mostra o texto completo
      }
    });
  });

  // Fecha o conteúdo e remove o fundo escurecido quando o overlay é clicado
  overlay.addEventListener("click", collapseNote);
}

// Função que configura o papel superior do envelope.
function setUpPaper() {
  gsap.set(".js-up-paper", {
    bottom: "97%",
    rotation: 180,
    zIndex: 200,
    clipPath: "polygon(0% 0%, 100% 0%, 50% 61%)",
    onComplete: notesReady
  });
}

// Função que inicia a transição do papel superior.
function envelopTransition() {
  gsap.to(".js-up-paper", {
    bottom: "1%",
    duration: 0.25,
    onComplete: setUpPaper
  });
  const upPaperElement = document.querySelector(".js-up-paper");
  upPaperElement.removeEventListener("click", envelopTransition);
  upPaperElement.classList.remove("cursor");
}

// Função que permite cortar o adesivo.
function sticker() {
  gsap.set(".js-sticker", { width: "20%", left: "-80%" });
  document.body.classList.remove("scissors");
  document.querySelector(".js-sticker").removeEventListener("click", sticker);
  const upPaperElement = document.querySelector(".js-up-paper");
  upPaperElement.addEventListener("click", envelopTransition);
  upPaperElement.classList.add("cursor");
}

document.querySelector(".js-sticker").addEventListener("click", sticker);

window.onresize = function () {
  resizeNotes();
};

// CSS para o overlay e para a div de conteúdo completo (adicione isso ao seu CSS)
const style = document.createElement('style');
style.innerHTML = `
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    display: none;
    z-index: 999;
  }
  
  .full-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    width: 80%;
    height: 80%;
    overflow-y: auto;
    opacity: 0;
    display: none;
    z-index: 1000;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(style);

const fullLetterOverlay = document.getElementById('fullLetterOverlay');
const closeButton = document.querySelector('.close-button');
const note = document.querySelector('.js-note');

// Abrir a carta completa
note.addEventListener('click', () => {
  fullLetterOverlay.style.display = 'flex'; // Exibe a div com a carta completa
});

// Fechar a carta completa
closeButton.addEventListener('click', () => {
  fullLetterOverlay.style.display = 'none'; // Esconde a div quando clicar em "Fechar"
});