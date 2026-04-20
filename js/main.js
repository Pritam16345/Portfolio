document.addEventListener("DOMContentLoaded", function () {
      initMobileMenu();
      initActiveNavigation();
      initTiltCards();
      initScoreBars();
      initGsap();
    });

    window.addEventListener("load", function () {
      initThreeHero();
    });

    function initMobileMenu() {
      const hamburger = document.getElementById("hamburger");
      const mobileMenu = document.getElementById("mobile-menu");
      const closeMenu = document.getElementById("close-menu");

      function openMenu() {
        mobileMenu.style.display = "flex";
        mobileMenu.setAttribute("aria-hidden", "false");
        document.body.classList.add("menu-open");
      }

      function hideMenu() {
        mobileMenu.style.display = "none";
        mobileMenu.setAttribute("aria-hidden", "true");
        document.body.classList.remove("menu-open");
      }

      hamburger.addEventListener("click", openMenu);
      closeMenu.addEventListener("click", hideMenu);
      mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", hideMenu);
      });
    }

    function initActiveNavigation() {
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-link");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.remove("active");
            });
            const navId = entry.target.getAttribute("data-nav") || entry.target.id;
            const active = document.querySelector('.nav-link[href="#' + navId + '"]');
            if (active) active.classList.add("active");
          }
        });
      }, { threshold: 0.4 });

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }

    function initTiltCards() {
      document.querySelectorAll(".tilt-card").forEach(function (card) {
        card.addEventListener("mousemove", function (event) {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = "perspective(800px) rotateY(" + (x * 14) + "deg) rotateX(" + (-y * 10) + "deg) scale(1.02)";
        });
        card.addEventListener("mouseleave", function () {
          card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
          card.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
        });
        card.addEventListener("mouseenter", function () {
          card.style.transition = "none";
        });
      });
    }

    function initScoreBars() {
      document.querySelectorAll(".score-fill").forEach(function (bar) {
        bar.style.setProperty("--score", bar.getAttribute("data-score") + "%");
      });
    }

    function initGsap() {
      if (!window.gsap || !window.ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" });
      gsap.from(".hero-h1 .line", { opacity: 0, y: 60, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-desc", { opacity: 0, y: 20, duration: 0.7, delay: 0.6, ease: "power2.out" });
      gsap.from(".hero-stats .stat", { opacity: 0, y: 20, stagger: 0.08, duration: 0.6, delay: 0.7 });
      gsap.from(".hero-ctas a", { opacity: 0, y: 16, stagger: 0.1, duration: 0.6, delay: 0.9 });

      document.querySelectorAll(".section-label").forEach(function (element) {
        gsap.from(element, scrollAnim(element, { y: 20, opacity: 0, duration: 0.6 }));
      });

      document.querySelectorAll(".section-title, .project-title, .research-title, .contact-title").forEach(function (element) {
        gsap.from(element, scrollAnim(element, { y: 40, opacity: 0, duration: 0.7 }));
      });

      document.querySelectorAll(".project-grid").forEach(function (grid) {
        const flipped = grid.classList.contains("flipped");
        const text = grid.querySelector(".project-text");
        const visual = grid.querySelector(".project-visual");
        if (text) gsap.from(text, scrollAnim(text, { x: -50, opacity: 0, duration: 0.8, ease: "power2.out" }));
        if (visual) gsap.from(visual, scrollAnim(visual, { x: flipped ? -50 : 50, opacity: 0, duration: 0.8, ease: "power2.out", clearProps: "transform" }));
      });

      gsap.from(".timeline-item", scrollAnim(".timeline", { x: -20, opacity: 0, duration: 0.55, stagger: 0.15 }));
      gsap.from(".education-block", scrollAnim(".education-stack", { y: 20, opacity: 0, duration: 0.55, stagger: 0.1 }));
      gsap.from(".skill-block", scrollAnim(".skills-grid", { scale: 0.96, opacity: 0, duration: 0.5, stagger: 0.06 }));
      gsap.from(".contact-card", scrollAnim(".contact-grid", { y: 24, opacity: 0, duration: 0.55, stagger: 0.08 }));

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          ScrollTrigger.refresh();
        });
      }
    }

    function scrollAnim(trigger, vars) {
      vars.scrollTrigger = {
        trigger: trigger,
        start: "top 85%",
        toggleActions: "play none none none"
      };
      return vars;
    }

    function initThreeHero() {
      const canvas = document.getElementById("hero-canvas");
      const hero = document.getElementById("hero");
      if (!canvas || !hero || !window.THREE) return;

      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.zIndex = "2";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, hero.clientWidth / hero.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 6);

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(hero.clientWidth, hero.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputEncoding = THREE.sRGBEncoding;

      const dashboard = createPanel(2.4, 1.35, 0x00e5c3, [2.7, 0.35, -1.4], [-0.08, -0.32, 0.04]);
      const apiPanel = createPanel(1.55, 1.05, 0xff6b35, [-2.9, -0.75, -2.1], [0.12, 0.28, -0.05]);
      const notesPanel = createPanel(1.1, 0.8, 0xc8b8ff, [0.85, 2.05, -2.9], [0.16, -0.18, 0.08]);
      const serverStack = createServerStack();
      scene.add(dashboard, apiPanel, notesPanel, serverStack);

      scene.add(new THREE.AmbientLight(0x0a0a1a, 0.8));

      const lightA = new THREE.PointLight(0x00e5c3, 3, 12);
      lightA.position.set(2, 3, 4);
      scene.add(lightA);

      const lightB = new THREE.PointLight(0xff6b35, 2, 10);
      lightB.position.set(-3, -2, 3);
      scene.add(lightB);

      const lightC = new THREE.PointLight(0xc8b8ff, 1.5, 8);
      lightC.position.set(0, 0, 5);
      scene.add(lightC);

      const positions = new Float32Array(420 * 3);
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({ color: 0xdde2f0, size: 0.012, transparent: true, opacity: 0.16 })
      );
      scene.add(particles);

      let targetX = 0;
      let targetY = 0;
      window.addEventListener("mousemove", function (event) {
        targetX = (event.clientX / window.innerWidth - 0.5) * 0.4;
        targetY = (event.clientY / window.innerHeight - 0.5) * 0.3;
      }, { passive: true });

      window.addEventListener("resize", function () {
        camera.aspect = hero.clientWidth / hero.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(hero.clientWidth, hero.clientHeight);
      });

      function createPanel(width, height, accent, position, rotation) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(width, height, 0.06),
          new THREE.MeshStandardMaterial({
            color: 0x0c0e17,
            metalness: 0.35,
            roughness: 0.28,
            transparent: true,
            opacity: 0.72,
            emissive: accent,
            emissiveIntensity: 0.045
          })
        );
        const edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(body.geometry),
          new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.42 })
        );
        group.add(body, edge);

        for (let i = 0; i < 4; i += 1) {
          const barWidth = width * (0.24 + i * 0.11);
          const bar = new THREE.Mesh(
            new THREE.BoxGeometry(barWidth, 0.035, 0.025),
            new THREE.MeshStandardMaterial({
              color: i === 1 ? 0xff6b35 : accent,
              metalness: 0.2,
              roughness: 0.45,
              transparent: true,
              opacity: 0.82
            })
          );
          bar.position.set(-width * 0.28 + i * 0.08, height * 0.25 - i * 0.18, 0.055);
          group.add(bar);
        }

        const statusDot = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.09, 0.03),
          new THREE.MeshStandardMaterial({ color: accent, metalness: 0.25, roughness: 0.35 })
        );
        statusDot.position.set(width * 0.38, height * 0.34, 0.065);
        group.add(statusDot);

        group.position.set(position[0], position[1], position[2]);
        group.rotation.set(rotation[0], rotation[1], rotation[2]);
        return group;
      }

      function createServerStack() {
        const group = new THREE.Group();
        for (let i = 0; i < 5; i += 1) {
          const unit = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 0.16, 0.52),
            new THREE.MeshStandardMaterial({
              color: 0x13151f,
              metalness: 0.45,
              roughness: 0.32,
              emissive: i % 2 ? 0x00e5c3 : 0xff6b35,
              emissiveIntensity: 0.035
            })
          );
          unit.position.y = i * 0.2;
          group.add(unit);

          const led = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.035, 0.03),
            new THREE.MeshStandardMaterial({ color: i % 2 ? 0x00e5c3 : 0xff6b35 })
          );
          led.position.set(-0.34, i * 0.2, 0.275);
          group.add(led);
        }
        group.position.set(3.55, -1.55, -2.4);
        group.rotation.set(0.08, -0.42, 0);
        return group;
      }

      function animate() {
        requestAnimationFrame(animate);
        dashboard.rotation.y += 0.0015;
        apiPanel.rotation.y -= 0.0012;
        notesPanel.rotation.x += 0.001;
        serverStack.rotation.y += 0.0014;
        particles.rotation.y += 0.0006;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        renderer.render(scene, camera);
      }

      animate();
    }
