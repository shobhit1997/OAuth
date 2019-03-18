
Infoconnect OAuth
===================================

This is an OAuth provider for the information portal of
JSS Acaddemy of Technical Education, Noida.
The web portal is live on: http://210.212.85.155

Introduction
------------

## Documentation

**To use the OAuth Service of Infoconnect follow the following steps:**

1. Visit http://52.91.35.65:3000
2. Login with your infoconnect id
3. Create a new project(Make sure that the project name is unique and redirectUrl is valid)
4. Copy and store the project id and secret
5. Get your login redirect url by using the following api
	**GET**:http://52.91.35.65:3000/oauth/loginURL?projectID=[projectID]&projectSecret=[ProjectSecret]
6. Redirect your user to the login url received in previous step when clicked on 
	***Login With Infoconnect***
7. When the user login is successful he will be redirected to the ***Redirect URL*** you provided	while creating the project with the code.
   Eg: http://redirectURL?code=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjljNjc0YjRj.. 
8. Get the user details by using the following api:
	**GET**:http://52.91.35.65:3000/oauth/userinfo?projectID=[projectID]&projectSecret=[ProjectSecret]&code=[code]