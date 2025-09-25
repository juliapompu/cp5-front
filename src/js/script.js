document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDepoimento");

  // --- Envio do formulário ---
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = document.getElementById("inputNome").value.trim();
      const comentario = document.getElementById("inputComentario").value.trim();

      if (!nome || !comentario) {
        alert("Preencha todos os campos!");
        return;
      }

      const depoimento = {
        id: Date.now(), // id único
        nome,
        comentario,
        timestamp: new Date().toLocaleString("pt-BR")
      };

      let depoimentos = JSON.parse(localStorage.getItem("depoimentos")) || [];
      depoimentos.push(depoimento);
      localStorage.setItem("depoimentos", JSON.stringify(depoimentos));

      alert("Depoimento enviado com sucesso!");
      window.location.href = "../pages/depoimentos.html";
    });
  }

  // --- Mostrar depoimentos na página ---
  const containerDepoimentos = document.querySelector(".depoimentos.novos");
  if (containerDepoimentos) {
    let depoimentos = JSON.parse(localStorage.getItem("depoimentos")) || [];

    depoimentos.forEach((dep) => {
      const card = document.createElement("div");
      card.classList.add("cardje");

      card.innerHTML = `
        <div class="card-headerj">
          <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" alt="Avatar">
          <span class="user-namej">${dep.nome}</span>
        </div>
        <div class="card-contentj">
          <p>${dep.comentario}</p>
        </div>
        <div class="card-footerj">
          <span class="timestampj">${dep.timestamp}</span>
          <button class="btn btn-sm btn-danger btn-excluir" data-id="${dep.id}">Excluir</button>
        </div>
      `;

      containerDepoimentos.appendChild(card);
    });

    // --- Evento de excluir ---
    containerDepoimentos.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-excluir")) {
        const id = e.target.getAttribute("data-id");

        // remover do localStorage
        let depoimentos = JSON.parse(localStorage.getItem("depoimentos")) || [];
        depoimentos = depoimentos.filter(dep => dep.id != id);
        localStorage.setItem("depoimentos", JSON.stringify(depoimentos));

        // remover do DOM
        e.target.closest(".cardje").remove();
      }
    });
  }
});
