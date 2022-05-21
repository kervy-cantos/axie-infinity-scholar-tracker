# iskotracker-partial
Axie-infinity scholar/s' tracking website. Some features on progress(help)
# Additional Dependencies
mongoose - <i>npm i mongoose</i><br>
passport - <i>npm i passport</i><br>
node-fetch - <i>npm i node-fetch</i><br>
node-schedule - <i>npm i node-schedule</i><br>
nod-mailer - <i>npm i node-mailer</i>
# Website Demo
<a href="isko-tracker.herokuapp.com">Website here</a>
# Features
1.Account Login and Registration.<br>
2.Multiple ronin accounts registration.<br>
3.Reset Password w/ email(not working yet).<br>
4.Daily Stats.<br>
5.Add and Delete.<br>
-- more in the future --
# How to start
1.Install npm.<br>
2.Install dependencies.<br>
3.Create a cloud database on <a href="https://www.mongodb.com/">MongoDB</a><br>
or download local https://zarkom.net/blogs/how-to-install-mongodb-for-development-in-windows-3328<br>
4.Create a .env file on parent directory and provide the following:<br>
database ='your database link and credentials' (local or cloud)<br>
sessecret = 'provide your own secret'<br>
<i>optional(some hosting sites will provide this and in this project default is 3000)</i><br>
PORT = 'your own port'<br>
5.Run app.js
