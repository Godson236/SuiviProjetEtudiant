from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'projets', views.ProjetViewSet, basename='projet')
router.register(r'taches', views.TacheViewSet, basename='tache')
router.register(r'livrables', views.LivrableViewSet, basename='livrable')
router.register(r'evaluations', views.EvaluationViewSet, basename='evaluation')

urlpatterns = [
    path('', include(router.urls)),
]