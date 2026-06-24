from rest_framework.permissions import BasePermission


class EstAdministrateur(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'administrateur'


class EstEnseignant(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'enseignant'


class EstEtudiant(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'etudiant'


class EstEnseignantOuAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['enseignant', 'administrateur']


class EstEtudiantOuAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['etudiant', 'administrateur']