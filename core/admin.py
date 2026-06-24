from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Projet, Tache, Livrable, Evaluation


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'is_active']
    list_filter = ['role', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Rôle', {'fields': ('role',)}),
    )


@admin.register(Projet)
class ProjetAdmin(admin.ModelAdmin):
    list_display = ['titre', 'createur', 'statut', 'date_creation']
    list_filter = ['statut']
    search_fields = ['titre', 'createur__username']


@admin.register(Tache)
class TacheAdmin(admin.ModelAdmin):
    list_display = ['titre', 'projet', 'assigne_a', 'statut', 'priorite']
    list_filter = ['statut', 'priorite']
    search_fields = ['titre']


@admin.register(Livrable)
class LivrableAdmin(admin.ModelAdmin):
    list_display = ['titre', 'projet', 'soumis_par', 'date_soumission']
    search_fields = ['titre']


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ['livrable', 'enseignant', 'note', 'date_evaluation']