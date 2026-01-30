# Оптимизация сайта - Внесенные изменения

## Дата: 2025-01-30

## Что было изменено:

### 1. Оптимизация загрузки видео
**Файл:** `index.html` (строка ~170-180)

**Изменения:**
- Добавлен атрибут `preload="metadata"` - видео загружает только метаданные при загрузке страницы
- Добавлен атрибут `loading="lazy"` - ленивая загрузка видео
- В `js/main.js` добавлен IntersectionObserver для загрузки видео только когда оно видно

**Как откатить:**
```html
<!-- Было: -->
<video
  class="hero__video"
  autoplay
  muted
  loop
  playsinline
  poster="IMG_20260130_115335_516.jpg"
>

<!-- Вернуть к: -->
<video
  class="hero__video"
  autoplay
  muted
  loop
  playsinline
  poster="IMG_20260130_115335_516.jpg"
>
```
Удалить строки с `preload="metadata"` и `loading="lazy"`.

В `js/main.js` удалить код IntersectionObserver из функции `initMediaOptimization()`.

---

### 2. Убрали белый блик при скролле
**Файл:** `css/main.css` (строка ~139-150)

**Изменения:**
- Уменьшена непрозрачность градиента в `.glass::before`:
  - Было: `rgba(0, 255, 136, 0.16)` с `opacity: 0.3`
  - Стало: `rgba(0, 255, 136, 0.08)` с `opacity: 0.2`
- Добавлен `will-change: auto` для оптимизации производительности

**Как откатить:**
```css
/* Вернуть к: */
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top,
    rgba(0, 255, 136, 0.16),
    transparent 55%
  );
  opacity: 0.3;
  pointer-events: none;
}
```
Удалить строку `will-change: auto;`.

---

### 3. Стрелочки в карусели услуг вместо свайпов
**Файлы:** 
- `index.html` (строка ~476-487)
- `css/main.css` (строка ~1167-1230)
- `js/main.js` (строка ~250-350)

**Изменения:**
- Заменены точки навигации на стрелочки (как у фото)
- Убраны свайп-жесты для карусели
- Стрелочки сделаны полупрозрачными с эффектом стекла
- Стрелочки расположены по бокам, не налезают на текст

**Как откатить:**

**В `index.html`:**
```html
<!-- Вернуть к точкам: -->
<div class="services__controls" aria-hidden="true">
  <!-- Точки будут созданы через JS -->
</div>
```

**В `css/main.css`:**
Вернуть стили для `.services__controls` и `.services__control` к версии с точками:
```css
.services__controls {
  position: absolute;
  inset: auto 0.25rem 0.3rem;
  display: flex;
  justify-content: center;
  gap: 0.6rem;
}

.services__control {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: background var(--transition-fast),
    transform var(--transition-fast), width var(--transition-fast);
}

.services__control--active {
  width: 1.35rem;
  background: var(--color-primary-neon);
  box-shadow: var(--shadow-neon);
}
```

**В `js/main.js`:**
Вернуть код создания точек и свайпов:
```javascript
// Build dot controls based on cards count
const controlsContainer = prevBtn?.parentElement;
if (controlsContainer) {
  controlsContainer.innerHTML = '';
  STATE.servicesControls = STATE.servicesCards.map((_, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'services__control';
    if (idx === 0) btn.classList.add(CLASSNAMES.servicesControlActive);
    btn.addEventListener('click', () => scrollToIndex(idx));
    controlsContainer.appendChild(btn);
    return btn;
  });
}

// Swipe gestures for mobile
let startX = 0;
let isSwiping = false;

track.addEventListener(
  'touchstart',
  (event) => {
    if (event.touches.length !== 1) return;
    startX = event.touches[0].clientX;
    isSwiping = true;
  },
  { passive: true }
);

track.addEventListener(
  'touchmove',
  (event) => {
    if (!isSwiping || event.touches.length !== 1) return;
    const dx = event.touches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      isSwiping = false;
      if (dx < 0) scrollToIndex(STATE.servicesIndex + 1);
      else scrollToIndex(STATE.servicesIndex - 1);
    }
  },
  { passive: true }
);

track.addEventListener('touchend', () => {
  isSwiping = false;
});
```

---

## Дополнительные рекомендации для оптимизации видео:

Если видео все еще загружается медленно, можно:

1. **Сжать видео:**
   - Использовать инструменты типа HandBrake или FFmpeg
   - Рекомендуемые настройки:
     - Разрешение: 1920x1080 или меньше
     - Битрейт: 2-3 Mbps
     - Формат: H.264
     - Кодек: libx264

2. **Создать мобильную версию видео:**
   - Более низкое разрешение (1280x720)
   - Меньший битрейт (1-1.5 Mbps)
   - Добавить в HTML:
   ```html
   <source src="video-mobile.mp4" type="video/mp4" media="(max-width: 600px)">
   <source src="5467618347061382673_(0).mp4" type="video/mp4">
   ```

3. **Использовать WebM формат:**
   - Более эффективное сжатие
   - Добавить в HTML:
   ```html
   <source src="video.webm" type="video/webm">
   <source src="5467618347061382673_(0).mp4" type="video/mp4">
   ```

4. **Полностью отключить видео на мобильных:**
   В `js/main.js` в функции `initMediaOptimization()`:
   ```javascript
   if (isSmallScreen) {
     video.style.display = 'none';
     video.pause();
   }
   ```

---

## Проверка производительности:

1. Откройте DevTools (F12)
2. Перейдите на вкладку "Network"
3. Обновите страницу
4. Проверьте размер и время загрузки видео
5. Используйте "Throttling" для симуляции медленного интернета

---

## Если что-то пошло не так:

1. Проверьте консоль браузера на наличие ошибок (F12 → Console)
2. Убедитесь, что все файлы сохранены
3. Очистите кэш браузера (Ctrl+F5)
4. Если проблемы критичны - используйте инструкции выше для отката изменений

