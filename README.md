Authentication Routes
POST /api/auth/register
* URL:bashCopier le codehttp://localhost:5000/api/auth/register
* 
* Request Body:
json
Copier le code
{
  "email": "user@example.com",
  "pseudo": "username",
  "password": "password123",
  "role": "user" // 'admin' or 'employee' if applicable
}

POST /api/auth/login
* URL:bashCopier le codehttp://localhost:5000/api/auth/login
* 
* Request Body:
json
Copier le code
{
  "email": "user@example.com",
  "password": "password123"
}

2. User Routes
GET /api/users/profile
* URL:bashCopier le codehttp://localhost:5000/api/users/profile
* 
* Headers:
    * Authorization: Bearer <your_jwt_token>

PUT /api/users/profile
* URL:bashCopier le codehttp://localhost:5000/api/users/profile
* 
* Headers:
    * Authorization: Bearer <your_jwt_token>
* Request Body:
json
Copier le code
{
  "email": "newuser@example.com",
  "pseudo": "newusername",
  "password": "newpassword123" // Optional: Only if the user wants to change their password
}

DELETE /api/users/profile
* URL:bashCopier le codehttp://localhost:5000/api/users/profile
* 
* Headers:
    * Authorization: Bearer <your_jwt_token>

3. Train Routes
GET /api/trains
* URL:bashCopier le codehttp://localhost:5000/api/trains
* 

POST /api/trains
* URL:bashCopier le codehttp://localhost:5000/api/trains
* 
* Headers:
    * Authorization: Bearer <your_admin_jwt_token>
* Request Body:
json
Copier le code
{
  "name": "Train A",
  "start_station": "Station A",
  "end_station": "Station B",
  "time_of_departure": "2024-10-14T09:00:00Z"
}

PUT /api/trains/:id
* URL:bashCopier le codehttp://localhost:5000/api/trains/:id
* 
* Headers:
    * Authorization: Bearer <your_admin_jwt_token>
* Request Body:
json
Copier le code
{
  "name": "Updated Train A",
  "start_station": "Station A",
  "end_station": "Station C",
  "time_of_departure": "2024-10-14T10:00:00Z"
}

DELETE /api/trains/:id
* URL:bashCopier le codehttp://localhost:5000/api/trains/:id
* 
* Headers:
    * Authorization: Bearer <your_admin_jwt_token>

4. Station Routes
GET /api/stations
* URL:bashCopier le codehttp://localhost:5000/api/stations
* 

POST /api/stations
* URL:bashCopier le codehttp://localhost:5000/api/stations
* 
* Headers:
    * Authorization: Bearer <your_admin_jwt_token>
* Request Body:
json
Copier le code
{
  "name": "Station A",
  "open_hour": "08:00",
  "close_hour": "22:00",
  "image": "image_url_or_base64" // For image uploads, ensure the correct format
}

PUT /api/stations/:id
* URL:bashCopier le codehttp://localhost:5000/api/stations/:id
* 
* Headers:
    * Authorization: Bearer <your_admin_jwt_token>
* Request Body:
json
Copier le code
{
  "name": "Updated Station A",
  "open_hour": "08:00",
  "close_hour": "22:00"
}

DELETE /api/stations/:id
* URL:bashCopier le codehttp://localhost:5000/api/stations/:id
* 
* Headers:
    * Authorization: Bearer <your_admin_jwt_token>

5. Ticket Routes
POST /api/tickets
* URL:bashCopier le codehttp://localhost:5000/api/tickets
* 
* Headers:
    * Authorization: Bearer <your_user_jwt_token>
* Request Body:
json
Copier le code
{
  "trainId": "train_id_here",
  "userId": "user_id_here",
  "start_station": "Station A",
  "end_station": "Station B",
  "date_of_travel": "2024-10-14T09:00:00Z"
}

PUT /api/tickets/:id/validate
* URL:rubyCopier le codehttp://localhost:5000/api/tickets/:id/validate
* 
* Headers:
    * Authorization: Bearer <your_employee_jwt_token>

Remarques
* Assurez-vous que le serveur fonctionne sur le port 5000 avant d'effectuer ces requêtes dans Postman.
* Remplacez les <your_jwt_token>, <your_admin_jwt_token>, <your_user_jwt_token>, et <your_employee_jwt_token> par les tokens appropriés obtenus lors de l'authentification.
Si vous avez besoin d'autres informations ou d'assistance supplémentaire, n'hésitez pas à demander !
