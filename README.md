# mongodb__project--rest_api-1
1) npm i 
2) npm start 

#### Регистрация
URL:  {service}/signup

Method: POST

Data params:

+ first_name - обязательное
+ surname - обязательное
+ phone - обязательное, уникальное, ровно 11 цифр, может быть с ведущими нулями
+ password - обязательное

Success response:
+ Code: 201 Created
+ Content: id - идентификатор созданного пользователя

Error Response: 
+ Code: 422 Unprocessable entity
+ Content - объект, где ключи - это поля, которые не прошли валидацию, а их значения - текст ошибки валидации

#### Авторизация
URL: {service}/login

Method: POST

Data params:
+ phone - обязательное
+ password - обязательное

Success response:
+ Code: 200 OK
+ Content: token -  сгенерированный токен для дальнейшего доступа к странице

Error Response (ошибка валидации): 
+ Code: 422 Unprocessable entity
+ Content - объект, где ключи - это поля, которые не прошли валидацию, а их значения - текст ошибки валидации

Error Response (неверный логин или пароль): 
+ Code: 404 Not found
+ Content: login: “Incorrect login or password”

Все последующие запросы требуют авторизации с использованием Bearer-токена. Токен должен быть отправлен в заголовке Authorization.

При отправке запроса без заголовка авторизации сервер должен вернуть следующий ответ:

Error Response:
+ Code: 403 Forbidden
+ Content: message: You need authorization

#### Выход
URL: {service}/logout
Method: POST
Success response
Code: 200 OK

#### Загрузка фотографии
URL: {service}/photo

Method: POST

Content-Type: FormData

Data params:
+ photo – обязательное, файл с изображением, только jpg, jpeg или png. 

Success response 
+ Code: 201 Created
+ Content:
  + id – уникальный идентификатор фотографии
  + name – название фотографии
  + url – абсолютная ссылка на фотографию (с http://)
  
Error Response: 
 + Code: 422 Unprocessable entity
 + Content - объект, где ключи - это поля, которые не прошли валидацию, а их значения - текст ошибки валидации


#### Получение всех фотографий
URL: {service}/photo

Method: GET 

Success response:
+ Code: 200 OK
+ Content: массив объектов – всех фотографий пользователя, где каждый объект имеет следующие свойства:
  + id
  + name
  + url
  + owner_id – id пользователя, которому принадлежит фотография

#### Получение одной фотографии
URL: {service}/photo/{ID}

Method: GET 

Success response
+ Code: 200 OK
+ Content: 
  + id
  + name
  + url
  + owner_id – id пользователя, которому принадлежит фотография

#### Удаление фотографии
URL: {service}/photo/{ID}

Method: DELETE

Success response:
+ Code: 204 Deleted
Error Response (Ошибка доступа) - В случае, если пользователь пытается изменить не свою фотографию, ему возвращаются следующие параметры: 
+ Code: 403 Forbidden
