// subir ao topo da página
function scrollToTop() {
  const scrollStep = -window.scrollY / (500 / 15);
  const scrollInterval = setInterval(() => {
    if (window.scrollY !== 0) {
      window.scrollBy(0, scrollStep);
    } else {
      clearInterval(scrollInterval);
    }
  }, 15);
}

let currentIcon = null;

function toggleMenu(icon) {
  currentIcon = icon; // guarda quem clicou
  icon.classList.toggle("active");
  document.getElementById("mobileMenu").classList.toggle("active");
}

const observers = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // anima apenas uma vez
      }
    });
  },
  {
    threshold: 0.1,
  }
);

observers.forEach((element) => {
  observer.observe(element);
});

// GSAP
let xPos = 0;

gsap
  .timeline()
  .set(".ring", { rotationY: 180, cursor: "grab" })
  .set(".img", {
    rotateY: (i) => i * -36,
    transformOrigin: "50% 50% 500px",
    z: -500,
    backgroundImage: (i) => "url(" + getImageUrl(i) + ")",
    backgroundPosition: (i) => getBgPos(i),
    backfaceVisibility: "hidden",
  })
  .from(".img", {
    duration: 1.5,
    y: 200,
    opacity: 0,
    stagger: 0.1,
    ease: "expo",
  })
  .add(() => {
    document.querySelectorAll(".img").forEach((img) => {
      img.addEventListener("mouseenter", (e) => {
        let current = e.currentTarget;
        gsap.to(".img", {
          opacity: (i, t) => (t == current ? 1 : 0.5),
          ease: "power3",
        });
      });
      img.addEventListener("mouseleave", (e) => {
        gsap.to(".img", { opacity: 1, ease: "power2.inOut" });
      });
    });
  }, "-=0.5");

document.addEventListener("mousedown", dragStart);
document.addEventListener("touchstart", dragStart);

function dragStart(e) {
  if (e.touches) e.clientX = e.touches[0].clientX;
  xPos = Math.round(e.clientX);
  gsap.set(".ring", { cursor: "grabbing" });
  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag);
}

function drag(e) {
  if (e.touches) e.clientX = e.touches[0].clientX;
  gsap.to(".ring", {
    rotationY: "-=" + ((Math.round(e.clientX) - xPos) % 360),
    onUpdate: () => {
      gsap.set(".img", { backgroundPosition: (i) => getBgPos(i) });
    },
  });

  xPos = Math.round(e.clientX);
}

document.addEventListener("mouseup", dragEnd);
document.addEventListener("touchend", dragEnd);

function dragEnd(e) {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("touchmove", drag);
  gsap.set(".ring", { cursor: "grab" });
}

function getBgPos(i) {
  return (
    100 -
    (gsap.utils.wrap(
      0,
      360,
      gsap.getProperty(".ring", "rotationY") - 180 - i * 36
    ) /
      360) *
      500 +
    "px 0px"
  );
}

function getImageUrl(i) {
  const imageUrls = [
    "assets/img/gsap-1.png",
    "assets/img/gsap-2.png",
    "assets/img/gsap-3.png",
    "assets/img/gsap-4.png",
    "assets/img/gsap-5.png",
    "assets/img/gsap-6.png",
    "assets/img/gsap-7.png",
    "assets/img/gsap-8.png",
    "assets/img/gsap-9.png",
    "assets/img/gsap-10.png",
  ];

  return imageUrls[i];
}

document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll("#mobileMenu a");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = document.querySelector(".menu-icon");

  // fecha o submenu após clique
  menuLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        // Se o link é âncora interna (ex: #destinos)
        setTimeout(function () {
          mobileMenu.classList.remove("active");
          if (currentIcon) {
            currentIcon.classList.remove("active"); // <-- remove o X e volta pro hamburguer
          }
        }, 300); // espera um pouco para o scroll acontecer antes de fechar
      }
    });
  });

  // ✅ Inicializa o vídeo de fundo com YTPlayer
  $(".player").YTPlayer();
});
