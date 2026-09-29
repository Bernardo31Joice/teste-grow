let selectedProfile = null;

const profileButtons = document.querySelectorAll(".profile-btn");
const goLoginButton = document.getElementById("go-login");
const loginButton = document.getElementById("login-btn");

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const selectedScreen = document.getElementById(screenId);

  if (selectedScreen) {
    selectedScreen.classList.add("active");
    window.scrollTo(0, 0);
  }
}

profileButtons.forEach((button) => {
  button.addEventListener("click", () => {
    profileButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    selectedProfile = button.dataset.profile;
  });
});

goLoginButton.addEventListener("click", () => {
  if (!selectedProfile) {
    alert("Selecione uma opção: Professor, Aluno ou Voluntário.");
    return;
  }

  showScreen("screen-login");
});

loginButton.addEventListener("click", () => {
  if (selectedProfile === "professor") {
    showScreen("screen-professor");
  } else if (selectedProfile === "aluno") {
    showScreen("screen-aluno");
  } else if (selectedProfile === "voluntario") {
    showScreen("screen-voluntario");
  } else {
    showScreen("screen-profile");
  }
});

const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const parentScreen = tab.closest(".screen");

    const screenTabs = parentScreen.querySelectorAll(".tab");
    const screenContents = parentScreen.querySelectorAll(".tab-content");

    screenTabs.forEach((item) => {
      item.classList.remove("active");
    });

    screenContents.forEach((content) => {
      content.classList.remove("active");
    });

    tab.classList.add("active");

    const tabId = tab.dataset.tab;
    const activeContent = document.getElementById(tabId);

    if (activeContent) {
      activeContent.classList.add("active");
    }
  });
});
/* =========================
   MENU DAS TRÊS BARRINHAS
========================= */

const menuOverlay = document.getElementById("menuOverlay");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");
const logoutBtn = document.getElementById("logoutBtn");
const menuOptions = document.getElementById("menuOptions");
const menuTitle = document.getElementById("menuTitle");
const menuSubtitle = document.getElementById("menuSubtitle");

const menus = {
  professor: {
    title: "Menu Professor",
    subtitle: "Gerencie suas turmas",
    items: [
      {
        icon: "fa-house",
        label: "Portal do Professor",
        desc: "Voltar para o painel inicial",
        screen: "professorHome"
      },
      {
        icon: "fa-users",
        label: "Minhas Turmas",
        desc: "Ver todas as turmas",
        screen: "turmasProfessor"
      },
      {
        icon: "fa-circle-check",
        label: "Presença",
        desc: "Gerenciar sessões de presença",
        screen: "presencaProfessor"
      }
    ]
  },

  aluno: {
    title: "Menu Aluno",
    subtitle: "Acesse seus estudos",
    items: [
      {
        icon: "fa-book-open",
        label: "Meus Cursos",
        desc: "Ver cursos disponíveis",
        screen: "alunoHome"
      },
      {
        icon: "fa-clipboard-list",
        label: "Atividades",
        desc: "Pendentes e entregues",
        screen: "classAluno",
        tab: "alunoAtividades"
      },
      {
        icon: "fa-circle-check",
        label: "Presença",
        desc: "Registrar presença",
        screen: "classAluno",
        tab: "alunoPresenca"
      }
    ]
  },

  voluntario: {
    title: "Menu Voluntário",
    subtitle: "Acompanhe seus projetos",
    items: [
      {
        icon: "fa-house",
        label: "Início",
        desc: "Painel institucional",
        screen: "voluntarioHome"
      },
      {
        icon: "fa-diagram-project",
        label: "Projetos",
        desc: "Portfólio e rastreador",
        screen: "voluntarioHome",
        anchor: ".tracker"
      },
      {
        icon: "fa-square-check",
        label: "Tarefas",
        desc: "Tarefas semanais",
        screen: "voluntarioHome",
        anchor: ".tasks-box"
      }
    ]
  }
};

function openMenu(role) {
  const menu = menus[role] || menus.professor;

  menuTitle.textContent = menu.title;
  menuSubtitle.textContent = menu.subtitle;
  menuOptions.innerHTML = "";

  menu.items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "menu-item";

    btn.innerHTML = `
      <i class="fa-solid ${item.icon}"></i>
      <span>
        <b>${item.label}</b>
        <small>${item.desc}</small>
      </span>
    `;

    btn.addEventListener("click", () => {
      closeSideMenu();
      showScreen(item.screen);

      if (item.tab) {
        setTimeout(() => ativarAba(item.tab), 60);
      }

      if (item.anchor) {
        setTimeout(() => {
          const telaAtual = document.querySelector(".screen.active");
          const alvo = telaAtual ? telaAtual.querySelector(item.anchor) : null;

          if (alvo) {
            alvo.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }, 120);
      }
    });

    menuOptions.appendChild(btn);
  });

  sideMenu.classList.add("active");
  menuOverlay.classList.add("active");
}

function closeSideMenu() {
  sideMenu.classList.remove("active");
  menuOverlay.classList.remove("active");
}

document.querySelectorAll(".menu-open").forEach(btn => {
  btn.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    openMenu(btn.dataset.role);
  });
});

closeMenu.addEventListener("click", closeSideMenu);
menuOverlay.addEventListener("click", closeSideMenu);

logoutBtn.addEventListener("click", () => {
  closeSideMenu();

  perfilSelecionado = null;

  document.querySelectorAll(".profile-option").forEach(btn => {
    btn.classList.remove("active");
  });

  document.querySelectorAll(".search input").forEach(input => {
    input.value = "";
  });

  clearSearchFilters();
  showScreen("perfil");
});

/* =========================
   BUSCA BÁSICA
========================= */

function clearSearchFilters() {
  document.querySelectorAll(".is-hidden-by-search").forEach(el => {
    el.classList.remove("is-hidden-by-search");
  });

  document.querySelectorAll(".search-empty").forEach(el => {
    el.remove();
  });
}

function getSearchableItems(screen) {
  return Array.from(
    screen.querySelectorAll(
      ".course-card, .quick, .metric, .student, .task-card, .session, .project, .white-card, .deadline, .alert-card, .tasks-box, .notice"
    )
  ).filter(item => !item.closest(".side-menu"));
}

function searchOnScreen(input) {
  const screen = input.closest(".screen");

  if (!screen) {
    return;
  }

  const term = input.value.trim().toLowerCase();
  const items = getSearchableItems(screen);
  let visible = 0;

  screen.querySelectorAll(".search-empty").forEach(el => {
    el.remove();
  });

  if (!term) {
    items.forEach(item => {
      item.classList.remove("is-hidden-by-search");
    });

    return;
  }

  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    const match = text.includes(term);

    item.classList.toggle("is-hidden-by-search", !match);

    if (match) {
      visible++;
    }
  });

  if (visible === 0) {
    const aviso = document.createElement("div");

    aviso.className = "search-empty active";
    aviso.textContent = `Nenhum resultado encontrado para: ${input.value}`;

    const topbar = screen.querySelector(".topbar");

    if (topbar) {
      topbar.insertAdjacentElement("afterend", aviso);
    }
  }
}

document.querySelectorAll(".search input").forEach(input => {
  input.addEventListener("input", () => {
    searchOnScreen(input);
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      input.value = "";
      searchOnScreen(input);
    }
  });
});
