// Seleciona os elementos
const form = document.querySelector("form");
const emailInput = document.querySelector("#emailInput");

if (form && emailInput) {
  // Quando o formulário for enviado
  form.addEventListener("submit", (event) => {
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
