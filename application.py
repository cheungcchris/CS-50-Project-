import os
import requests
import time

from flask import Flask, session, render_template, request
from flask_socketio import SocketIO, emit
from flask_session import Session


app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"
socketio = SocketIO(app)

users=[]
channels=[]
msgs={}
currusers={}

@app.route("/")
def index():
    if "userid" in session:
        print (session['userid'])
        return render_template("lobby.html",name=session['userid'],channels=channels)
    else:
        return render_template("index.html",message="")

@app.route("/lobby",methods=["GET","POST"])
def lobby():
    if "userid" not in session:
        name=request.form.get("name")
        session['userid']=name
        if name not in users:
            users.append(name)
        else:
            return render_template("error.html",message="Name already in use")
    add_c=request.form.get("add_c")
    if add_c != None:  
        if add_c not in channels:
            channels.append(add_c)
            currusers[add_c]=[]
            return render_template("lobby.html",name=session['userid'],channels=channels)
    for i in channels:
        if i not in currusers:
            currusers[i]=[]
    print(msgs)          
    return render_template("lobby.html",name=session['userid'],channels=channels)
    

@app.route("/logout")
def logout():
    session.pop("userid",None)
    return render_template("index.html",message="You have been logged out")

@app.route("/channel/<channel>")
def channel(channel):
    if channel not in channels:
        if channel =="null":
            return render_template("lobby.html",name=session['userid'],channels=channels)
        else:
            return render_template("error.html",message="Channel doesn't exist")
    if channel not in msgs:
        msgs[channel]=[]
    print("in chann")
##    print (msgs[channel])
##    if session['userid'] not in currusers:
##        currusers.append(session['userid'])
    return render_template("channel.html",channel=channel,msgs=msgs[channel], name=session['userid'],currusers=currusers)

@socketio.on("submit msg")
def submit(data,channel,color):

    if len(msgs[channel])==100:
        msgs[channel].pop(0)
##    print(channel)    
    msgs[channel].append(
        {"user":session['userid'],
         "time":time.strftime("<%H:%M:%S>",time.localtime()),
         "msg":data})
    print(msgs[channel][-1])
    data={"lastmsg":msgs[channel][-1],
          "currchannel":channel,
          "msgcolor":color}
    print("color",color)
    emit("updated msgs",data,broadcast=True)

@socketio.on("change color")
def submit(color,name):
    print (color,name)
    data={"color":color,
          "name":name}
    emit("update color",data,broadcast=True)

@socketio.on("joined")
def submit(name,channel):
    print (currusers)
##    print ("in -joined")
    if name not in currusers[channel]:
        currusers[channel].append(name)
    print(currusers,'in joined')
    data={"inchannel":currusers[channel],
          "currchannel":channel}
    emit ("update users",data,broadcast=True)

@socketio.on("user left")
def submit(name,channel):
    print (currusers[channel],"before remove")
    popthis=[False,0]
    for i in range(len(currusers[channel])):
        print (i,"i")
        if currusers[channel][i]==name:
            popthis[1]=i
            popthis[0]=True
    if popthis[0]:
        currusers[channel].pop(popthis[1])
    print (currusers[channel],"after remove")
    data={"userpop":name,
          "currchannel":channel}
    emit("pop user",data,broadcast=True)
