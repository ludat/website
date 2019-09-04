# 🚀 Начало работы

Parcel&nbsp;&mdash; это упаковщик для веб-приложений для разработчиков с различным опытом. Он предлагает великолепную быструю работу с использованием многоядерной обработки и не требует настройки.

Сначала установите Parcel с помощью Yarn или npm:

Yarn:

```bash
yarn global add parcel-bundler
```

npm:

```bash
npm install -g parcel-bundler
```

Создайте файл package.json в папке вашего проекта, используя:

```bash
yarn init -y
```

или

```bash
npm init -y
```

Parcel может принимать любой тип файла в качестве точки входа, но лучше всего использовать файл HTML или JavaScript. Если вы подключили свой основной JavaScript-файл в HTML, используя относительный путь, Parcel также обработает его для вас и заменит ссылку URL-адресом на выходной файл.

Далее создайте файлы index.html и index.js.

```html
<html>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

```javascript
console.log('Привет, Мир!');
```

Parcel имеет встроенный сервер разработки, который будет автоматически пересобирать ваше приложение, так как поддерживает [горячую замену модуля](hmr.html) для увеличения скорости разработки. Просто выполните команду:

```bash
parcel index.html
```

Теперь откройте http://localhost:1234/ в браузере. Вы также можете переопределить порт по умолчанию, используя параметры с помощью опции `-p <port number>`.

Используйте сервер разработки, если у вас нет собственного сервера или ваше приложение полностью отрисовывается на клиенте. Если у вас есть собственный сервер, вы можете запустить Parcel в режиме `watch`. Этот режим по-прежнему будет автоматически пересобирать приложение при измении файлов и поддерживает модуль горячей замены, но не запускает веб-сервер.

```bash
parcel watch index.html
```

Когда вы готовы для сборки в продакшене, режим `build` не будет отслеживать изменения файлов и собирает приложение только один раз. Смотрите подробности в разделе [Работа в продакшене](production.html).