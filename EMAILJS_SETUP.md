# Инструкция по настройке EmailJS

## Шаг 1: Регистрация и создание аккаунта

1. Перейдите на https://www.emailjs.com/
2. Нажмите "Sign Up Free" и создайте бесплатный аккаунт
3. Подтвердите email адрес

## Шаг 2: Подключение Email сервиса

1. Войдите в Dashboard: https://dashboard.emailjs.com/
2. Перейдите в раздел **"Email Services"**
3. Нажмите **"Add New Service"**
4. Выберите ваш email провайдер (Gmail, Outlook, Mail.ru и т.д.)
5. Следуйте инструкциям для подключения
6. **Скопируйте Service ID** (например: `service_xxxxxxx`)

## Шаг 3: Создание Email шаблона

1. Перейдите в раздел **"Email Templates"**
2. Нажмите **"Create New Template"**
3. Вставьте содержимое файла `emailjs-template.html` в редактор
4. В настройках шаблона:
   - **To Email**: `marina_pap@mail.ru` (или ваш email)
   - **From Name**: `KleverMed Website`
   - **Subject**: `Новое сообщение с сайта KleverMed`
   - **Reply To**: `{{from_phone}}` (чтобы можно было ответить на телефон)
5. **Скопируйте Template ID** (например: `template_xxxxxxx`)

## Шаг 4: Получение Public Key

1. Перейдите в раздел **"Account"** → **"General"**
2. Найдите **"Public Key"**
3. **Скопируйте Public Key** (например: `xxxxxxxxxxxxx`)

## Шаг 5: Вставка ключей в код

Откройте файл `js/main.js` и найдите следующие строки:

### 1. Public Key (строка ~340):
```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Замените на ваш Public Key
```
Замените `YOUR_PUBLIC_KEY` на ваш Public Key из шага 4.

### 2. Service ID и Template ID (строка ~380):
```javascript
await emailjs.send(
  'YOUR_SERVICE_ID',    // Замените на ваш Service ID
  'YOUR_TEMPLATE_ID',   // Замените на ваш Template ID
  {
    from_name: form.elements.name.value.trim(),
    from_phone: form.elements.phone.value.trim(),
    message: form.elements.message.value.trim(),
    to_email: 'marina_pap@mail.ru',
  }
);
```

Замените:
- `YOUR_SERVICE_ID` на Service ID из шага 2
- `YOUR_TEMPLATE_ID` на Template ID из шага 3

## Шаг 6: Настройка Яндекс Карт

1. Перейдите на https://developer.tech.yandex.ru/services/
2. Создайте новый ключ для **JavaScript API и HTTP Геокодер**
3. Получите API ключ
4. Откройте файл `index.html` и найдите строку:
```html
<script src="https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_MAPS_API_KEY&lang=ru_RU" type="text/javascript"></script>
```
5. Замените `YOUR_YANDEX_MAPS_API_KEY` на ваш API ключ

## Проверка работы

1. Откройте сайт в браузере
2. Заполните форму обратной связи
3. Отправьте сообщение
4. Проверьте ваш email - должно прийти письмо в стиле сайта

## Важные замечания

- Бесплатный план EmailJS позволяет отправлять до 200 писем в месяц
- Для увеличения лимита можно перейти на платный план
- Все ключи хранятся на стороне клиента, но EmailJS защищает их на сервере
- Не публикуйте ключи в публичных репозиториях

## Поддержка

Если возникли проблемы:
1. Проверьте консоль браузера (F12) на наличие ошибок
2. Убедитесь, что все ключи вставлены правильно
3. Проверьте настройки Email сервиса в EmailJS Dashboard
4. Убедитесь, что шаблон использует правильные переменные: `{{from_name}}`, `{{from_phone}}`, `{{message}}`

