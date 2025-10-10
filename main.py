from fastapi import FastAPI

#SERVER 
site = FastAPI()

#ROTAS PARA O SERVER
from routes.adm_routes import routes_adm
from routes.auth_routes import routes_auth
from routes.home_routes import routes_home

site.include_router(routes_adm)
site.include_router(routes_auth)
site.include_router(routes_home)


