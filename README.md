# HitFit
Приложение для считываня показаний из фитнес браслетов.
-
Для установки:
-
1) Скачать репозиторий
-
2) Открыть терминал (командная строка) и сменить директорию на ту, в которую загружен репозиторий
-
3) В терминале выполнить команду: npm i
-
4) Также в терминале выполнить: npm run app
-
5) В открывшемся окне браузера включить эмулятор экрана мобильного устройства
-
6) Дальше по желанию можно запустить приложение на реальном мобильном устройстве,используя различные сервисы, например https://ngrok.com/ 
Команда для терминала { ngrok.exe http 8080 -host-header="localhost:8080" }
-
Следует принять во внимание, что приложение на реальном мобильном устройстве будет работать только при открытии его на https ( service worker и web bluetooth не позволяют использовать http)
