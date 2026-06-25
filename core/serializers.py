from rest_framework import serializers
from .models import User, Projet, Tache, Livrable, Evaluation


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class TacheSerializer(serializers.ModelSerializer):
    assigne_a_detail = UserMiniSerializer(source='assigne_a', read_only=True)

    class Meta:
        model = Tache
        fields = [
            'id', 'titre', 'description', 'projet',
            'assigne_a', 'assigne_a_detail',
            'statut', 'priorite',
            'date_creation', 'date_echeance'
        ]
        read_only_fields = ['date_creation']


class LivrableSerializer(serializers.ModelSerializer):
    soumis_par_detail = UserMiniSerializer(source='soumis_par', read_only=True)

    class Meta:
        model = Livrable
        fields = [
            'id', 'titre', 'description', 'fichier_url',
            'projet', 'soumis_par', 'soumis_par_detail',
            'date_soumission'
        ]
        read_only_fields = ['date_soumission', 'soumis_par']


class EvaluationSerializer(serializers.ModelSerializer):
    enseignant_detail = UserMiniSerializer(source='enseignant', read_only=True)
    def validate_note(self, value):
        if value < 0 or value > 20:
            raise serializers.ValidationError("La note doit etre entre 0 et 20.")
        return value

    class Meta:
        model = Evaluation
        fields = [
            'id', 'livrable', 'enseignant', 'enseignant_detail',
            'note', 'commentaire', 'date_evaluation'
        ]
        read_only_fields = ['date_evaluation', 'enseignant']


class ProjetSerializer(serializers.ModelSerializer):
    createur_detail = UserMiniSerializer(source='createur', read_only=True)
    membres_detail = UserMiniSerializer(source='membres', many=True, read_only=True)
    taches = TacheSerializer(many=True, read_only=True)
    livrables = LivrableSerializer(many=True, read_only=True)

    class Meta:
        model = Projet
        fields = [
            'id', 'titre', 'description',
            'createur', 'createur_detail',
            'membres', 'membres_detail',
            'statut', 'date_creation', 'date_fin_prevue',
            'taches', 'livrables'
        ]
        read_only_fields = ['date_creation', 'createur']