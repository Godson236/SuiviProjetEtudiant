from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('etudiant', 'Étudiant'),
        ('enseignant', 'Enseignant'),
        ('administrateur', 'Administrateur'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='etudiant')
    
    def __str__(self):
        return f"{self.username} ({self.role})"


class Projet(models.Model):
    STATUT_CHOICES = [
        ('en_cours', 'En cours'),
        ('termine', 'Terminé'),
        ('en_pause', 'En pause'),
    ]
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    createur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projets_crees')
    membres = models.ManyToManyField(User, related_name='projets_rejoints', blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_cours')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_fin_prevue = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.titre


class Tache(models.Model):
    STATUT_CHOICES = [
        ('a_faire', 'À faire'),
        ('en_cours', 'En cours'),
        ('terminee', 'Terminée'),
    ]
    PRIORITE_CHOICES = [
        ('basse', 'Basse'),
        ('moyenne', 'Moyenne'),
        ('haute', 'Haute'),
    ]
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='taches')
    assigne_a = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='taches_assignees')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='a_faire')
    priorite = models.CharField(max_length=10, choices=PRIORITE_CHOICES, default='moyenne')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_echeance = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.titre


class Livrable(models.Model):
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    fichier_url = models.URLField(blank=True)
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='livrables')
    soumis_par = models.ForeignKey(User, on_delete=models.CASCADE, related_name='livrables_soumis')
    date_soumission = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre


class Evaluation(models.Model):
    livrable = models.OneToOneField(Livrable, on_delete=models.CASCADE, related_name='evaluation')
    enseignant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations_donnees')
    note = models.DecimalField(max_digits=4, decimal_places=2)
    commentaire = models.TextField(blank=True)
    date_evaluation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Évaluation de {self.livrable} par {self.enseignant}"