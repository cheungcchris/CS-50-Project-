# Project 2

Web Programming with Python and JavaScript

layout.html - layout template for all webpages
error.html - error page
index.html - front page to login
lobby.html - page that contains all channels when logged in
channel.html - page that user can send messages to each other

index.js - controls: current users in channel in and out, messages submitted by users, changing color of text
lobby.js - javascript to make submit field for new channel more dynamic

application.py - server side code

Personal touch: in the channel page, there is a list of users currently in the channel that updates through sockets when users enter or leave. Also dynamically updates the color of the user's text based on the drop down list.
