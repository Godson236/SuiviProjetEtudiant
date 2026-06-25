from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Projet, Tache, Livrable, Evaluation
from .serializers import (
    UserSerializer, ProjetSerializer,
    TacheSerializer, LivrableSerializer, EvaluationSerializer
)
from .permissions import (
    EstAdministrateur, EstEnseignant,
    EstEnseignantOuAdmin, EstEtudiantOuAdmin
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action in ['list', 'destroy']:
            return [EstAdministrateur()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class ProjetViewSet(viewsets.ModelViewSet):
    serializer_class = ProjetSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'administrateur':
            return Projet.objects.all()
        if user.role == 'enseignant':
            return Projet.objects.all()
        return Projet.objects.filter(
            createur=user
        ) | Projet.objects.filter(membres=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EstEtudiantOuAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(createur=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def ajouter_membre(self, request, pk=None):
        projet = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            projet.membres.add(user)
            return Response({'message': f'{user.username} ajoute au projet.'})
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur introuvable.'}, status=404)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def retirer_membre(self, request, pk=None):
        projet = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            projet.membres.remove(user)
            return Response({'message': f'{user.username} retire du projet.'})
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur introuvable.'}, status=404)


class TacheViewSet(viewsets.ModelViewSet):
    serializer_class = TacheSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['administrateur', 'enseignant']:
            return Tache.objects.all()
        return Tache.objects.filter(
            projet__createur=user
        ) | Tache.objects.filter(assigne_a=user)

    def get_permissions(self):
        if self.action in ['destroy']:
            return [EstEtudiantOuAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'])
    def mes_taches(self, request):
        taches = Tache.objects.filter(assigne_a=request.user)
        serializer = self.get_serializer(taches, many=True)
        return Response(serializer.data)


class LivrableViewSet(viewsets.ModelViewSet):
    serializer_class = LivrableSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['administrateur', 'enseignant']:
            return Livrable.objects.all()
        return Livrable.objects.filter(projet__createur=user) | \
               Livrable.objects.filter(soumis_par=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [EstEtudiantOuAdmin()]
        if self.action == 'destroy':
            return [EstAdministrateur()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(soumis_par=self.request.user)


class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['administrateur', 'enseignant']:
            return Evaluation.objects.all()
        return Evaluation.objects.filter(livrable__soumis_par=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EstEnseignantOuAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(enseignant=self.request.user)


class StatistiquesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'administrateur':
            data = {
                'total_projets': Projet.objects.count(),
                'total_taches': Tache.objects.count(),
                'total_livrables': Livrable.objects.count(),
                'total_evaluations': Evaluation.objects.count(),
                'total_utilisateurs': User.objects.count(),
            }
        elif user.role == 'enseignant':
            data = {
                'total_projets': Projet.objects.count(),
                'total_livrables': Livrable.objects.count(),
                'total_evaluations': Evaluation.objects.filter(enseignant=user).count(),
            }
        else:
            data = {
                'mes_projets': Projet.objects.filter(createur=user).count(),
                'mes_taches': Tache.objects.filter(assigne_a=user).count(),
                'mes_livrables': Livrable.objects.filter(soumis_par=user).count(),
            }
        return Response(data)