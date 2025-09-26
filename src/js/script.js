/*EMAILS*/
const formEmail = document.getElementById("formDepoimento");
const emailInput = document.getElementById("inputEmail4");

if (formEmail && emailInput) {
    // Quando o formulário for enviado
    formEmail.addEventListener("submit", (event) => {
        event.preventDefault(); // evita recarregar a página

        const email = emailInput.value.trim();

        if (email === "") {
            alert("Por favor, insira um email válido.");
            return;
        }

        // Busca a lista atual de emails no localStorage (ou cria lista vazia)
        let listaEmails = JSON.parse(localStorage.getItem("emails")) || [];

        // Verifica se já existe
        if (listaEmails.includes(email)) {
            alert("Esse email já foi cadastrado!");
            return;
        }

        // Adiciona o novo email
        listaEmails.push(email);

        // Salva de volta no localStorage
        localStorage.setItem("emails", JSON.stringify(listaEmails));
        
        console.log("Emails cadastrados:", listaEmails);

        // Limpa o campo
        emailInput.value = "";
        alert("Email cadastrado com sucesso!");
    });
}

/* DEPOIMENTOS*/
(function () {
  const STORAGE_KEY = "depoimentos";

  document.addEventListener("DOMContentLoaded", () => {
    console.log("script.js carregado —", location.pathname);
    // ✅ sempre garante que os 3 fixos estão no localStorage
    const fixos = [
    {
        id: "fixo-1",
        nome: "Mariana",
        comentario: "O aplicativo é incrível, tem todas as músicas que eu gosto e a interface é super fácil de usar!",
        timestamp: new Date().toLocaleString("pt-BR")
    },
    {
        id: "fixo-2",
        nome: "Carlos",
        comentario: "A qualidade do som é excelente e adorei as playlists prontas, sempre descubro músicas novas.",
        timestamp: new Date().toLocaleString("pt-BR")
    },
    {
        id: "fixo-3",
        nome: "Fernanda",
        comentario: "Uso todos os dias para treinar, nunca trava e funciona até offline. Recomendo demais!",
        timestamp: new Date().toLocaleString("pt-BR")
    }
    ];

    let atuais = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    // adiciona apenas os que ainda não existem (com base no id)
    fixos.forEach(f => {
    if (!atuais.find(d => d.id === f.id)) {
        atuais.push(f);
    }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(atuais));

    const read = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const save = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));


    function escapeHtml(str) {
      if (!str) return "";
      return String(str).replace(/[&<>"']/g, function (m) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
      });
    }

    // ---------- FORMULARIO ----------

    let form =
      document.getElementById("formDepoimento") ||
      (function () {
        const f = document.querySelector("form");
        if (!f) return null;
        if (f.querySelector("#inputNome") && f.querySelector("#inputComentario")) return f;
        return null;
      })();

    if (form) {
      console.log("Form detectado — configurando submit handler");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nomeEl = document.getElementById("inputNome");
        const comentarioEl = document.getElementById("inputComentario");
        const nome = nomeEl ? nomeEl.value.trim() : "";
        const comentario = comentarioEl ? comentarioEl.value.trim() : "";

        if (!nome || !comentario) {
          alert("Preencha nome e comentário.");
          return;
        }

        const novo = {
          id: Date.now().toString(),
          nome,
          comentario,
          timestamp: new Date().toLocaleString("pt-BR"),
        };

        const arr = read();
        arr.push(novo);
        save(arr);
        console.log("Depoimento salvo:", novo);
        alert("Depoimento enviado com sucesso!");

    
        const p = location.pathname;
        let destino;
        if (/contato\.html?$/.test(p)) {
          destino = p.replace(/contato\.html?$/, "depoimentos.html");
        } else if (p.includes("/src/pages/")) {
          destino = p.replace(/[^\/]+$/, "depoimentos.html");
        } else {
         
          destino = "src/pages/depoimentos.html";
        }
        console.log("Redirecionando para:", destino);
        location.href = destino;
      });
    } else {
      console.log("Nenhum form de depoimento encontrado nesta página.");
    }

    // ---------- RENDERIZA DEPOIMENTOS  ----------
    const containerDepoimentos =
      document.querySelector(".depoimentos.novos") || document.querySelector(".depoimentos");
    if (containerDepoimentos) {
      const arr = read();
      console.log("Renderizando", arr.length, "depoimentos em .depoimentos", containerDepoimentos);
      if (arr.length === 0) {
        const p = document.createElement("p");
        p.className = "text-muted";
        p.textContent = "Nenhum depoimento ainda.";
        containerDepoimentos.appendChild(p);
      } else {
 

        arr.forEach((dep) => {
          const card = document.createElement("div");
          card.className = "cardje";
          card.dataset.id = dep.id;

          card.innerHTML = `
            <div class="card-headerj">
              <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" alt="Avatar">
              <span class="user-namej">${escapeHtml(dep.nome)}</span>
            </div>
            <div class="card-contentj">
              <p>${escapeHtml(dep.comentario)}</p>
            </div>
            <div class="card-footerj">
              <span class="timestampj">${escapeHtml(dep.timestamp)}</span>
              <button class="btn btn-sm btn-danger btn-excluir" data-id="${dep.id}">Excluir</button>
            </div>
          `;
          containerDepoimentos.appendChild(card);
        });


        containerDepoimentos.addEventListener("click", (ev) => {
          const target = ev.target;
          if (target.classList.contains("btn-excluir")) {
            const id = target.getAttribute("data-id");
            if (!confirm("Confirma exclusão deste depoimento?")) return;
            let arr = read();
            arr = arr.filter((d) => d.id !== id);
            save(arr);
            const card = target.closest(".cardje");
            if (card) card.remove();
            console.log("Depoimento removido:", id);
          }
        });
      }
    } else {
      console.log("Container de depoimentos não encontrado nesta página.");
    }

    // ---------- RENDERIZA  NO INDEX ----------
    function renderDepoimentosIndex() {
    const depoimentos = JSON.parse(localStorage.getItem("depoimentos") || "[]");
    const container = document.getElementById("listaDepoimentosIndex");
    container.innerHTML = "";

    depoimentos.slice(-3).forEach(d => {
        const card = document.createElement("div");
        card.classList.add("card-depoimento");
        card.innerHTML = `
            <h5>${d.nome}</h5>
            <p>${d.comentario}</p>
            <small>${d.timestamp}</small>
        `;
        container.appendChild(card);
    });
}

renderDepoimentosIndex();


    // ---------- BOTÃO LIMPAR (opcional) ----------
    const btnClear = document.getElementById("btnClearAll");
    if (btnClear) {
      btnClear.addEventListener("click", () => {
        if (confirm("Deseja apagar TODOS os depoimentos salvos?")) {
          localStorage.removeItem(STORAGE_KEY);
          location.reload();
        }
      });
    }
  });
  
})();

(function () {
      const toggle = document.getElementById('menuToggle');
      const backdrop = document.getElementById('menuBackdrop');
      const menu = document.getElementById('mobileMenu');
      const panel = document.getElementById('mobilePanel');
      const iconOpen = document.getElementById('iconOpen');
      const iconClose = document.getElementById('iconClose');

      const links = menu.querySelectorAll('a[href]');

      function openMenu() {
        // mostra overlay
        menu.classList.remove('opacity-0','pointer-events-none');
        backdrop.classList.remove('opacity-0','pointer-events-none');
        // animações
        requestAnimationFrame(() => {
          menu.classList.add('opacity-100');
          backdrop.classList.add('opacity-100');
          panel.classList.remove('-translate-y-6');
          panel.classList.add('translate-y-0');
        });
        iconOpen.classList.add('hidden');
        iconClose.classList.remove('hidden');
      }

      function closeMenu() {
        menu.classList.remove('opacity-100');
        backdrop.classList.remove('opacity-100');
        panel.classList.add('-translate-y-6');
        panel.classList.remove('translate-y-0');
        setTimeout(() => {
          menu.classList.add('opacity-0','pointer-events-none');
          backdrop.classList.add('opacity-0','pointer-events-none');
        }, 250);
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }

      let isOpen = false;

      toggle?.addEventListener('click', () => {
        isOpen ? closeMenu() : openMenu();
        isOpen = !isOpen;
      });

      // fecha ao clicar no backdrop
      backdrop?.addEventListener('click', () => {
        if (isOpen) { closeMenu(); isOpen = false; }
      });

      // fecha ao clicar em qualquer link (e deixa o link funcionar normalmente)
      links.forEach(a => {
        a.addEventListener('click', () => {
          if (isOpen) { closeMenu(); isOpen = false; }
        });
      });

      // se redimensionar para desktop, garante fechado
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && isOpen) {
          closeMenu(); isOpen = false;
        }
      });
    })();