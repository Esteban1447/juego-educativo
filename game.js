// game.js

// === DATOS Y LÓGICA MÓDULO EMOCIONES ===
const emotionsData = [
  { id: "alegria", image: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Grinning%20face%20with%20smiling%20eyes/3D/grinning_face_with_smiling_eyes_3d.png", options: ["Alegría", "Tristeza", "Enojo"], correctAnswer: "Alegría", feedbackCorrect: "¡Súper! Esa es la Alegría. ¡Se siente muy bien!", feedbackIncorrect: "Mmm, creo que no. ¡Mira otra vez la carita!" },
  { id: "tristeza", image: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crying%20face/3D/crying_face_3d.png", options: ["Sorpresa", "Tristeza", "Miedo"], correctAnswer: "Tristeza", feedbackCorrect: "¡Así es! A veces nos sentimos tristes, y está bien.", feedbackIncorrect: "Esa no parece ser. ¡Intenta con otra, tú puedes!" },
  { id: "enojo", image: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Angry%20face/3D/angry_face_3d.png", options: ["Alegría", "Calma", "Enojo"], correctAnswer: "Enojo", feedbackCorrect: "¡Correcto! Es el Enojo. Respiramos profundo cuando aparece.", feedbackIncorrect: "¡Uy! Esa no es. ¿Cuál será? ¡Piénsalo un poquito!" },
  { id: "sorpresa", image: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Astonished%20face/3D/astonished_face_3d.png", options: ["Sorpresa", "Miedo", "Alegría"], correctAnswer: "Sorpresa", feedbackCorrect: "¡Wow, qué Sorpresa! ¡Excelente!", feedbackIncorrect: "¡Oh! Casi, casi. ¡Prueba una diferente!" },
  { id: "miedo", image: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fearful%20face/3D/fearful_face_3d.png", options: ["Enojo", "Miedo", "Calma"], correctAnswer: "Miedo", feedbackCorrect: "¡Muy bien! A veces sentimos Miedo, y podemos pedir un abrazo.", feedbackIncorrect: "No es esa emoción. ¡No te preocupes, sigue intentando!" }
];
let currentEmotionIndex = 0;
let score = 0;
let emotionFaceImgEl, emotionOptionsEl, nextEmotionButtonEl;
let correctSoundEl, incorrectSoundEl, explorationSoundEl; // Sonidos globales para módulos

// Función auxiliar global (ya la tenías en index.html, pero podría estar aquí también)
// function lunaSpeaks(message, showMascot = true) { ... } // Ya está en index.html
// function playClickSound() { ... } // Ya está en index.html


// --- INICIALIZACIÓN MÓDULO DE EMOCIONES ---
function initEmotionGame() {
  emotionFaceImgEl = document.getElementById("emotion-face-img");
  emotionOptionsEl = document.getElementById("emotion-options");
  nextEmotionButtonEl = document.getElementById("next-emotion-button");

  correctSoundEl = document.getElementById("correct-sound");
  incorrectSoundEl = document.getElementById("incorrect-sound");
  
  currentEmotionIndex = 0;
  score = 0;
  loadEmotion(currentEmotionIndex);

  nextEmotionButtonEl.addEventListener("click", () => {
    if (typeof playClickSound === 'function') playClickSound();
    currentEmotionIndex++;
    if (currentEmotionIndex < emotionsData.length) {
      loadEmotion(currentEmotionIndex);
      if (typeof lunaSpeaks === 'function') lunaSpeaks("¡Genial! ¿Y esta carita, qué emoción será?");
    } else {
      showGameEndMessage_Emotions();
    }
  });
}

function loadEmotion(index) {
  const emotion = emotionsData[index];
  emotionFaceImgEl.src = emotion.image;
  emotionFaceImgEl.alt = `Carita de ${emotion.correctAnswer}`;
  emotionFaceImgEl.classList.remove('reveal');
  void emotionFaceImgEl.offsetWidth;
  emotionFaceImgEl.classList.add('reveal');

  emotionOptionsEl.innerHTML = ""; 
  const shuffledOptions = shuffleArray([...emotion.options]);
  shuffledOptions.forEach(optionText => {
    const button = document.createElement("button");
    button.textContent = optionText;
    button.onclick = () => {
        if (typeof playClickSound === 'function') playClickSound();
        checkAnswer_Emotions(optionText, emotion, button);
    }
    emotionOptionsEl.appendChild(button);
  });
  nextEmotionButtonEl.classList.add("hidden");
  enableOptionButtons_Emotions(true);
}

function checkAnswer_Emotions(selectedOption, emotion, clickedButton) {
  enableOptionButtons_Emotions(false); 
  if (selectedOption === emotion.correctAnswer) {
    if (typeof lunaSpeaks === 'function') lunaSpeaks(emotion.feedbackCorrect);
    if (correctSoundEl) correctSoundEl.play().catch(e => console.warn("Error sonido correcto", e));
    score++;
    clickedButton.classList.add('correct');
  } else {
    if (typeof lunaSpeaks === 'function') lunaSpeaks(emotion.feedbackIncorrect);
    if (incorrectSoundEl) incorrectSoundEl.play().catch(e => console.warn("Error sonido incorrecto", e));
    clickedButton.classList.add('incorrect');
    Array.from(emotionOptionsEl.children).forEach(btn => {
        if (btn.textContent === emotion.correctAnswer) {
            setTimeout(() => btn.classList.add('correct'), 600); 
        }
    });
  }
  nextEmotionButtonEl.classList.remove("hidden");
}

function enableOptionButtons_Emotions(enable) {
    const buttons = emotionOptionsEl.getElementsByTagName('button');
    for (let button of buttons) {
        button.disabled = !enable;
        if (enable) button.classList.remove('correct', 'incorrect');
    }
}

function showGameEndMessage_Emotions() {
  emotionFaceImgEl.src = "./img/check-mark-button.png";
  emotionFaceImgEl.alt = "¡Juego completado!";
  emotionOptionsEl.innerHTML = `<p style="font-size:1.2em; color: #E85A4F;">¡Has reconocido todas las emociones!</p>`;
  if (typeof lunaSpeaks === 'function') lunaSpeaks(`¡Fantástico! Terminaste de explorar las emociones. ¡Eres un campeón/campeona!`);
  nextEmotionButtonEl.classList.add("hidden");
}

// --- INICIALIZACIÓN MÓDULO DE ARTE ---
let artCanvas, artCtx, drawing = false, currentColor = 'black', currentBrushSize = 5;
function initArtModule() {
    artCanvas = document.getElementById('drawing-canvas');
    if (!artCanvas) { console.error("Canvas de arte no encontrado"); return; }
    artCtx = artCanvas.getContext('2d');
    artCtx.lineCap = 'round';
    artCtx.lineJoin = 'round';
    artCtx.strokeStyle = currentColor;
    artCtx.lineWidth = currentBrushSize;

    // Eventos del Canvas
    artCanvas.addEventListener('mousedown', startDrawingArt);
    artCanvas.addEventListener('mouseup', stopDrawingArt);
    artCanvas.addEventListener('mousemove', drawArt);
    artCanvas.addEventListener('touchstart', startDrawingArt, { passive: false });
    artCanvas.addEventListener('touchend', stopDrawingArt, { passive: false });
    artCanvas.addEventListener('touchmove', drawArt, { passive: false });


    // Eventos de la Barra de Herramientas
    document.querySelectorAll('#toolbar-art .color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentColor = btn.dataset.color;
            artCtx.strokeStyle = currentColor;
            if (typeof playClickSound === 'function') playClickSound();
            updateArtCursor();
        });
    });
    document.getElementById('eraser-btn').addEventListener('click', () => {
        currentColor = artCanvas.style.backgroundColor || 'white';
        artCtx.strokeStyle = currentColor;
        if (typeof playClickSound === 'function') playClickSound();
        updateArtCursor();
    });
    document.getElementById('brush-size').addEventListener('input', (e) => {
        currentBrushSize = e.target.value;
        artCtx.lineWidth = currentBrushSize;
        updateArtCursor();
    });
    document.getElementById('clear-canvas-art').addEventListener('click', () => {
        artCtx.clearRect(0, 0, artCanvas.width, artCanvas.height);
        if (typeof playClickSound === 'function') playClickSound();
    });
    console.log("Módulo de Arte inicializado.");
}

function updateArtCursor() {
    const size = Math.max(8, currentBrushSize); // Mínimo 8px para visibilidad
    artCanvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size * 2}" height="${size * 2}" style="background: transparent;"><circle cx="${size}" cy="${size}" r="${size/2}" fill="${currentColor}"/></svg>') ${size} ${size}, crosshair`;
}

function startDrawingArt(e) {
    e.preventDefault();
    drawing = true;
    const pos = getMousePos(artCanvas, e.touches ? e.touches[0] : e);
    artCtx.beginPath();
    artCtx.moveTo(pos.x, pos.y);
}
function stopDrawingArt() {
    drawing = false;
    artCtx.beginPath(); // Para que no continúe la línea al levantar el mouse/dedo
}
function drawArt(e) {
    e.preventDefault();
    if (!drawing) return;
    const pos = getMousePos(artCanvas, e.touches ? e.touches[0] : e);
    artCtx.lineTo(pos.x, pos.y);
    artCtx.stroke();
    artCtx.beginPath(); // Inicia nuevo trazo para que no se unan puntos discontinuos
    artCtx.moveTo(pos.x, pos.y);
}
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// --- INICIALIZACIÓN MÓDULO DE LITERATURA ---
let stories = [];
let currentPage = 0;

function initLiteratureModule() {
    const storyContent = document.getElementById('story-content');
    const newStoryBtn = document.getElementById('new-story-btn');
    
    function showStoryByPage(page) {
        const story = stories[page];
        if (!story) return;
        
        const formattedContent = story.content.split('\n').map(p => `<p>${p}</p>`).join('');
        
        storyContent.innerHTML = `
            <h3>${story.title}</h3>
            ${formattedContent}
            <p><em>- ${story.author}</em></p>
            <p class="story-moral"><strong>Moraleja:</strong> ${story.moral}</p>
            <div class="story-pagination">
                ${page > 0 ? `<button class="page-btn prev-btn">← Anterior</button>` : ''}
                <span class="page-indicator">Página ${page + 1} de ${stories.length}</span>
                ${page < stories.length - 1 ? `<button class="page-btn next-btn">Siguiente →</button>` : ''}
            </div>
        `;
        
        // Agregar eventos a los botones de paginación
        const prevBtn = storyContent.querySelector('.prev-btn');
        const nextBtn = storyContent.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (typeof playClickSound === 'function') playClickSound();
                currentPage--;
                showStoryByPage(currentPage);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (typeof playClickSound === 'function') playClickSound();
                currentPage++;
                showStoryByPage(currentPage);
            });
        }
        
        if (typeof lunaSpeaks === 'function') {
            lunaSpeaks("¡Vamos a leer esta historia!");
        }
    }

    // Cargar historias del JSON
    fetch('stories.json')
        .then(response => response.json())
        .then(data => {
            stories = data.stories;
            showStoryByPage(currentPage);
        })
        .catch(error => {
            console.error('Error cargando historias:', error);
            storyContent.innerHTML = '<p>¡Ups! No pude cargar las historias.</p>';
        });

    // Cambiamos la funcionalidad del botón para ir a la siguiente historia
    newStoryBtn.textContent = "Siguiente Historia →";
    newStoryBtn.addEventListener('click', () => {
        if (typeof playClickSound === 'function') playClickSound();
        if (currentPage < stories.length - 1) {
            currentPage++;
            showStoryByPage(currentPage);
        } else {
            currentPage = 0;
            showStoryByPage(currentPage);
        }
    });
}

// --- INICIALIZACIÓN MÓDULO DE EXPLORACIÓN ---
function initExplorationModule() {
    explorationSoundEl = document.getElementById("exploration-sound");
    let discoveredItems = 0;
    const totalItems = document.querySelectorAll('#explorers-garden .explorable-item').length;

    document.querySelectorAll('#explorers-garden .explorable-item').forEach(item => {
        item.addEventListener('click', () => {
            if (typeof playClickSound === 'function') playClickSound();
            if (explorationSoundEl) explorationSoundEl.play().catch(e=>console.warn("Error sonido exploración",e));
            
            const info = item.dataset.info || "¡Has encontrado algo interesante!";
            
            if (!item.classList.contains('discovered')) {
                discoveredItems++;
                item.classList.add('discovered');
                
                if (typeof lunaSpeaks === 'function') {
                    lunaSpeaks(`${info} ¡Has descubierto ${discoveredItems} de ${totalItems} elementos!`);
                }
                
                // Efecto de descubrimiento
                item.style.transform = 'scale(1.2)';
                item.style.filter = 'drop-shadow(0 0 10px gold)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                    item.style.filter = 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))';
                }, 1000);
                
                // Si descubre todos los elementos
                if (discoveredItems === totalItems) {
                    if (typeof lunaSpeaks === 'function') {
                        setTimeout(() => {
                            lunaSpeaks("¡Fantástico! ¡Has descubierto todos los secretos del jardín!");
                        }, 1500);
                    }
                }
            } else {
                if (typeof lunaSpeaks === 'function') {
                    lunaSpeaks(info);
                }
            }
        });
    });

    console.log("Módulo de Exploración inicializado.");
}

// --- INICIALIZACIÓN MÓDULO DE JUEGO LIBRE ---
const letters = [
  { letter: 'A', sound: './sounds/alphabet-a.mp3' },
  { letter: 'B', sound: './sounds/alphabet-b.mp3' },
  { letter: 'C', sound: './sounds/alphabet-c.mp3' },
  { letter: 'D', sound: './sounds/alphabet-d.mp3' },
  { letter: 'E', sound: './sounds/alphabet-e.mp3' },
  { letter: 'F', sound: './sounds/alphabet-f.mp3' },
  { letter: 'G', sound: './sounds/alphabet-g.mp3' },
  { letter: 'H', sound: './sounds/alphabet-h.mp3' },
  { letter: 'I', sound: './sounds/alphabet-i.mp3' },
  { letter: 'J', sound: './sounds/alphabet-j.mp3' },
  { letter: 'K', sound: './sounds/alphabet-k.mp3' },
  { letter: 'L', sound: './sounds/alphabet-l.mp3' },
  { letter: 'M', sound: './sounds/alphabet-m.mp3' },
  { letter: 'N', sound: './sounds/alphabet-n.mp3' },
  { letter: 'O', sound: './sounds/alphabet-o.mp3' },
  { letter: 'P', sound: './sounds/alphabet-p.mp3' },
  { letter: 'Q', sound: './sounds/alphabet-q.mp3' },
  { letter: 'R', sound: './sounds/alphabet-r.mp3' },
  { letter: 'S', sound: './sounds/alphabet-s.mp3' },
  { letter: 'T', sound: './sounds/alphabet-t.mp3' },
  { letter: 'U', sound: './sounds/alphabet-u.mp3' },
  { letter: 'V', sound: './sounds/alphabet-v.mp3' },
  { letter: 'W', sound: './sounds/alphabet-w.mp3' },
  { letter: 'X', sound: './sounds/alphabet-x.mp3' },
  { letter: 'Y', sound: './sounds/alphabet-y.mp3' },
  { letter: 'Z', sound: './sounds/alphabet-z.mp3' }
];



function initFreeplayModule() {
  const soundButtonsContainer = document.getElementById('sound-buttons');
  const currentLetterDisplay = document.getElementById('current-letter');
  let currentLetterObj = null;
  let audioElements = {};

  // Precarga de sonidos
  letters.forEach(letterObj => {
    const audio = new Audio();
    audio.src = letterObj.sound;
    audio.preload = 'auto';
    audioElements[letterObj.letter] = audio;
    audio.onerror = () => {
      console.error(`Error cargando sonido para letra ${letterObj.letter}`);
      if (typeof lunaSpeaks === 'function') {
        lunaSpeaks(`¡Ups! Tuve problemas cargando algunos sonidos`);
      }
    };
  });

  function getRandomLetters(targetLetter, count = 3) {
    // Obtener todas las letras excepto la objetivo
    let availableLetters = letters.filter(l => l.letter !== targetLetter);
    // Mezclar y tomar solo count letras (3 aleatorias + 1 correcta = 4 total)
    let selectedLetters = shuffleArray(availableLetters).slice(0, count);
    // Agregar la letra objetivo
    selectedLetters.push(letters.find(l => l.letter === targetLetter));
    // Mezclar el orden final
    return shuffleArray(selectedLetters);
  }

  function playLetterSound(letter) {
    const audio = audioElements[letter];
    if (audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.warn("Error reproduciendo sonido:", error);
        });
      }
    }
  }

  function selectNewLetter() {
    // Limpiar botones anteriores
    soundButtonsContainer.innerHTML = '';
    
    // Seleccionar nueva letra objetivo
    currentLetterObj = letters[Math.floor(Math.random() * letters.length)];
    currentLetterDisplay.textContent = currentLetterObj.letter;
    
    // Obtener 5 letras (4 aleatorias + la correcta) y ordenarlas alfabéticamente
    const displayLetters = getRandomLetters(currentLetterObj.letter);
    
    // Crear los botones para cada letra
    displayLetters.forEach(letterObj => {
        const button = document.createElement('button');
        button.className = 'letter-card';
        button.innerHTML = '🔊'; // Emoji de sonido en lugar de la letra
        
        button.addEventListener('click', () => {
            playLetterSound(letterObj.letter);
            
            if (letterObj.letter === currentLetterObj.letter) {
                button.classList.add('matched');
                if (typeof lunaSpeaks === 'function') {
                    lunaSpeaks(`¡Muy bien! ¡Encontraste el sonido correcto!`);
                }
                if (correctSoundEl) correctSoundEl.play().catch(e => console.warn("Error sonido correcto", e));
                
                setTimeout(() => {
                    button.classList.remove('matched');
                    selectNewLetter();
                }, 1500);
            } else {
                if (typeof lunaSpeaks === 'function') {
                    lunaSpeaks('Ese no es el sonido, ¡sigue intentando!');
                }
            }
        });
        
        soundButtonsContainer.appendChild(button);
    });
  }

  selectNewLetter();
  console.log("Módulo de Juego Libre inicializado con juego de sonidos.");
}


// --- FUNCIONES AUXILIARES ---
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Asegurarse que las funciones de inicialización estén disponibles globalmente
window.initEmotionGame = initEmotionGame;
window.initArtModule = initArtModule;
window.initLiteratureModule = initLiteratureModule;
window.initExplorationModule = initExplorationModule;
window.initFreeplayModule = initFreeplayModule;