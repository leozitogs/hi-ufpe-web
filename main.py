from fastapi import FastAPI

#SERVER 
app= FastAPI()
#ROTAS PARA O SERVER
from routes import adm_routes
from routes import auth_routes
from routes import home_routes

# uvicorn python:app --reload   // Coloco meu cod em um server local

# endpoint: 
# /ordens


