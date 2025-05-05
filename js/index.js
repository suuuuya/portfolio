function resizeHeight() {
    const windowHeight = window.innerHeight;
    document.querySelector(".home__sticky").style.height = `${windowHeight}px`;
}

window.addEventListener("resize", resizeHeight);
resizeHeight();

$(function () {

    //***** ScrollTrigger 
    gsap.registerPlugin(ScrollTrigger);
    

    //***** home
    //[home] post card animation
    gsap.timeline()
        .fromTo(".home .envelope__item.center .envelope__act", 1, {opacity:0, y: '-40%', rotateY: '-90deg' }, { opacity:1, y: '0%', rotateY: '0deg',delay:3, force3D: false, });
     
    //[home] intro ani
    const homeTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".home",
            scroller: window,
            scrub: 1,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            end: "bottom bottom",
            endTrigger: '.work',
        },
    });
    homeTimeline
    .to(".header__logo", {
        scrollTrigger: {
            trigger: "#wrap",
            scroller: window,
            scrub: 1,
            start: "top top",
            end: "+=50%",
        },
        scale: 1,
        y: '-5px',
        force3D: false,
    })
    .to(".home__letter", {
        scrollTrigger: {
            trigger: "#wrap",
            scroller: window,
            scrub: 1,
            start: "top top",
            end: "+=20%",
        },
        opacity: 0,
        force3D: false,
    });

    // [home] postcard flip, home fade-out .3 animation
    const homeTimeline2 = gsap.timeline({
        scrollTrigger: {
            trigger: "#wrap",
            scroller: window,
            scrub: 1,
            start: "top top",
            end: "+=200%",
        }
    });
    homeTimeline2
    .to(".home .envelope__item.center", {
        y: "2%",
        scale:1,
        rotateY: "-360deg",
        force3D: false,
    }, 0)
    homeTimeline2.to(".home .bg", {
        opacity:.3,
        duration:1,
     },0);
    
     // [home] postcard fade-out animation
    const homeTimeline3 = gsap.timeline({
        scrollTrigger: {
            trigger: ".profile",
            scroller: window,
            scrub: 1,
            start: "top top",
            end: "+=50%",
        }
    });
    homeTimeline3
    .to(".home .envelope__wrap", {
        opacity:0
    }, '+=0.4');
          

    // [home] bg fade-out 0 animation
    const homeTimeline5 = gsap.timeline({
        scrollTrigger: {
            trigger: ".work-intro",
            scroller: window,
            scrub: 1,
            start: "top top",
            end: "bottom+=200% bottom",
        }
    });
    homeTimeline5.to(".home", {
        opacity: 0,
    });


    //***** works
    //s:work intro
    // [work] canvas JS
    var Example = Example || {};
    Example.mixed = function () {
        const {
            Engine,
            Render,
            Runner,
            Bodies,
            Composite,
            Mouse,
            Events
        } = Matter;

        const engine = Engine.create();
        engine.world.gravity.y = 2;
        const world = engine.world;

        const render = Render.create({
            element: document.getElementById("shapes-box"),
            engine: engine,
            options: {
                width: window.innerWidth - 30,
                height: window.innerHeight * 1.2,
                wireframes: false,
                background: false
            }
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        let shapes = [];
        let walls = [];

        var addWalls = function () {
            var newWalls = [
                Bodies.rectangle((window.innerWidth-30) / 2, (window.innerHeight *1.2) + 50, (window.innerWidth-30), 100, { isStatic: true, render: { fillStyle: 'rgba(255, 255, 255, 1)' } }),
                Bodies.rectangle(-50, (window.innerHeight *1.2) / 2, 100, (window.innerHeight *1.2), { isStatic: true, render: { fillStyle: 'rgb(255, 255, 255)' } }),
                Bodies.rectangle((window.innerWidth-30) + 50, (window.innerHeight *1.2) / 2, 100, (window.innerHeight *1.2), { isStatic: true, render: { fillStyle: 'rgba(255, 255, 255, 1)' } })
            ];
            Composite.add(world, newWalls);
            walls = newWalls;
        };

        addWalls();

        const addShape = (texture, options, x, y) => {
            const scale = Math.min(window.innerHeight, window.innerWidth) / 1000;
            const renderOptions = {
                restitution: 0.1,
                render: {
                    sprite: {
                        texture,
                        xScale: scale * options.scale,
                        yScale: scale * options.scale
                    }
                }
            };

            const body = options.shape === "circle"
                ? Bodies.circle(x, y, options.radius * scale, renderOptions)
                : Bodies.rectangle(x, y, options.width * scale, options.height * scale, renderOptions);

            body.initialScale = scale;
            body.options = options;
            Composite.add(world, body);
            shapes.push(body);
        };

        const addInitialShapes = () => {
            const textures = [
                './img/img-client-stamp-1.png',
                './img/img-client-stamp-2.png',
                './img/img-client-stamp-3.png',
                './img/img-client-stamp-4.png',
                './img/img-client-stamp-5.png',
                './img/img-client-stamp-6.png',
                './img/img-client-stamp-7.png',
                './img/img-client-stamp-8.png',
                './img/img-client-stamp-10.png',
                './img/img-client-stamp-11.png',
                './img/img-client-stamp-13.png',
            ];

            const isMobile = window.innerWidth <= 1279;
            const baseOptions = {
                shape: "rectangle",
                width: 720 / (isMobile ? 4.5 : 5),
                height: 887 / (isMobile ? 4.5 : 5),
                scale: isMobile ? 0.22 : 0.2
            };

            const startY = -window.innerHeight / 50;

            textures.forEach((texture, i) => {
                const padding = 60;
                const randomX = padding + Math.random() * (window.innerWidth - padding * 2);
                addShape(texture, baseOptions, randomX, startY - i * 100);
            });
        };

        addInitialShapes();

        const mouse = Mouse.create(render.canvas);

        Events.on(engine, 'beforeUpdate', () => {
            const mousePos = mouse.position;

            shapes.forEach(body => {
                const dx = body.position.x - mousePos.x;
                const dy = body.position.y - mousePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const distanceThreshold = 150;
                if (distance < distanceThreshold) {
                    const forceMagnitude = (1 - distance / distanceThreshold) * 1;
                    const force = {
                        x: (dx / distance) * forceMagnitude,
                        y: (dy / distance) * forceMagnitude
                    };
                    Matter.Body.applyForce(body, body.position, force);
                }
            });
        });

        return {
            engine,
            runner,
            render,
            canvas: render.canvas,
            stop: () => {
                Render.stop(render);
                Runner.stop(runner);
                Composite.clear(engine.world);
                engine.events = {};
            }
        };
    };

    let hasRun = false;
    let currentApp = null;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                currentApp = Example.mixed();
                initProjectsTimeline();
                hasRun = true;
            }
        });
    }, { threshold:0.6});

    const target = document.querySelector('#shapes-box');
    if (target) observer.observe(target);

    window.addEventListener("resize", () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const widthDiff = Math.abs(newWidth - lastWidth);
        const heightDiff = Math.abs(newHeight - lastHeight);

        if (widthDiff > 200 || heightDiff > 200) {
            lastWidth = newWidth;
            lastHeight = newHeight;

            if (currentApp && typeof currentApp.stop === "function") {
                currentApp.stop();
            }

            const container = document.getElementById("shapes-box");
            if (container) container.innerHTML = "";

            currentApp = Example.mixed();
        }
    });

    // [work] work intro current year JS
    const startYear = 2019;
    const endYear = 2025;
    let currentYear = startYear;
    let previousYear = startYear;
    const digits = document.querySelectorAll(".digit");
    let animationFrameId = null;

    function updateDigits(newYear, direction) {
        if (newYear === currentYear) return;

        const newYearDigits = newYear.toString().split("");
        const currentYearDigits = currentYear.toString().split("");

        digits.forEach((digit, index) => {
            const currentSpan = digit.querySelector(".current");
            const nextSpan = digit.querySelector(".next");
            const newDigit = newYearDigits[index] || "0";
            const currentDigit = currentYearDigits[index] || "0";

            if (newDigit !== currentDigit) {
                nextSpan.innerHTML = newDigit;

                gsap.killTweensOf(currentSpan);
                gsap.killTweensOf(nextSpan);

                gsap.set(nextSpan, { y: direction === "up" ? "100%" : "-100%", opacity: 1 });

                gsap.timeline()
                    .to(currentSpan, {
                        y: direction === "up" ? "-100%" : "100%",
                        duration: .4,
                        onComplete: () => {
                            currentSpan.innerHTML = newDigit;
                            gsap.set(currentSpan, { y: "0%" });
                        }
                    })
                    .to(nextSpan, {
                        y: "0%",
                        duration: .4,
                        onComplete: () => {
                            gsap.set(nextSpan, { opacity: 0 });
                        }
                    }, "-=0.4");
            }
        });

        currentYear = newYear;
    }

    // [work] work intro current year scrolltrigger
    function initProjectsTimeline() {
        const projectsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".work .work-intro",
                scroller: window,
                scrub: 0.5,
                start: "top-=500vh top",
                end: "bottom-=100vh bottom",
                onUpdate: (self) => {
                    const progress = self.progress;
                    const min = 0;
                    const max = 1;

                    if (progress >= min && progress <= max) {
                        const localProgress = (progress - min) / (max - min);
                        const newYear = Math.floor(startYear + (endYear - startYear) * localProgress);
                        const direction = newYear > previousYear ? "up" : "down";

                        previousYear = newYear;

                        if (animationFrameId) cancelAnimationFrame(animationFrameId);
                        animationFrameId = requestAnimationFrame(() => updateDigits(newYear, direction));
                    }
                },
            },
        });
    }

    
    //******** stack & tools
    // [stack] scrollTrigger animation
    const books = document.querySelectorAll(".stack__item");
    let currentIndex = -1; // 중복 호출 방지 변수

    function getOffsetValue() {
        return window.innerWidth >= 2400
            ? 300 
            : window.innerWidth >= 1920
            ? 230   // pc 
            : window.innerWidth < 767
            ? 110   // 모바일
            : 230;  // 나머지
    }

    function updateCarousel(index) {
        if (index === currentIndex) return;
        currentIndex = index;

        const offsetValue = getOffsetValue();

        books.forEach((book, i) => {
            const offset = i - index;

            let rotateY = 88 - Math.abs(offset) * 20;
            rotateY = Math.max(0, rotateY);
            rotateY *= offset < 0 ? 1 : -1;

            const zIndex = 10 - Math.abs(offset);

            gsap.set(book, { zIndex });
            gsap.to(book.querySelector(".book"), {
                x: offset * offsetValue,
                rotateY: rotateY,
                duration: 1,
            });
            gsap.to(book.querySelector(".stack__info"), {
                x: offset * offsetValue,
                left: offset * (offsetValue / 2),
                duration: 1,
            });

            book.classList.toggle("active", i === index);
        });
    }

    // [stack] ScrollTrigger timeline
    const booksTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".stack",
            scroller: window,
            scrub: false,
            pin: true,
            end: () => `bottom top-${window.innerHeight * 7}px`, 
            onUpdate: (self) => {
                let scrollProgress = self.progress;
                let maxIndex = books.length - 1;

                // 튐 방지 floor + 보정값
                let index = Math.floor(scrollProgress * maxIndex);
                updateCarousel(index);
            },
        },
    });
    updateCarousel(0);


    const stackTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".stack",
            start: "top-=300px top",
            end: "+=100%",
            scroller: window,
            scrub: 1,
        }
    });
    stackTimeline
    .to(".stack .sec__title", {
        y:'-3vh',
        scale:.9,
    },0)
    .to(".stack .stack__container", {
        y:'-4vh'
    },0);



    //******* expertise
    // [expertise] scrolltrigger pin
    const expertiseTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".expertise",
            start: "top top",
            endTrigger: ".expertise__cont",
            end: "bottom bottom",
            scroller: window,
            scrub: 1,
            pin: ".fixed-cont",
            pinSpacing: false,
        }
    });
    // [expertise] intro title fade-out, bg fade-in animation
    const expertiseTimeline2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".expertise",
            start: "top top",
            end: "+=100%",
            scroller: window,
            scrub: 1,
        }
    });
    expertiseTimeline2
    .to(".expertise .sec__title", {
        opacity:.2,
    },"+=.2");


    //[common] BG/Text color change JS
    const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
    scrollColorElems.forEach((colorSection, i) => {
        const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
        const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;
        ScrollTrigger.create({
            trigger: colorSection,
            scroller: window,
            start: "top 40%",
            onEnter: () => {
                gsap.to("#container", {
                    backgroundColor: colorSection.dataset.bgcolor,
                    color: colorSection.dataset.textcolor,
                    overwrite: "auto",
                });
                document.documentElement.style.setProperty("--bg-color", colorSection.dataset.bgcolor);
                document.documentElement.style.setProperty("--text-color", colorSection.dataset.textcolor);
            },
            onLeaveBack: () => {
                gsap.to("#container", {
                    backgroundColor: prevBg,
                    color: prevText,
                    overwrite: "auto",
                });
                document.documentElement.style.setProperty("--bg-color", prevBg);
                document.documentElement.style.setProperty("--text-color", prevText);
            }
        });
    });


});


