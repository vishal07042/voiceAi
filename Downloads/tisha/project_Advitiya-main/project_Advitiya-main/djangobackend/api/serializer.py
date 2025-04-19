# from rest_framework import serializers
# from .models import farmer, Contact

# class FarmerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = farmer
#         fields = ['id', 'name', 'email']
    
# class ContactSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Contact
#         fields = '__all__'

# from rest_framework import serializers
# from .models import NGOUser
# from django.contrib.auth.hashers import make_password
# from django.core.validators import RegexValidator
# from django.contrib.auth.tokens import default_token_generator
# from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
# from django.utils.encoding import force_bytes
# from django.core.mail import send_mail
# from django.conf import settings

# class NGOUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = NGOUser
#         fields = [
#             'id', 'email', 'password', 'first_name', 'last_name',
#             'organization', 'phone_number', 'postal_code', 'colony',
#             'city', 'state', 'agreed_to_terms'
#         ]
#         extra_kwargs = {
#             'password': {'write_only': True},
#             'email': {'required': True},
#             'first_name': {'required': True},
#             'last_name': {'required': True},
#             'organization': {'required': True},
#             'phone_number': {'required': True},
#             'postal_code': {'required': True},
#             'colony': {'required': True},
#             'city': {'required': True},
#             'state': {'required': True},
#             'agreed_to_terms': {'required': True}
#         }

#     def validate_phone_number(self, value):
#         phone_regex = RegexValidator(
#             regex=r'^\+?1?\d{9,15}$',
#             message="Phone number must be entered in the format: '+999999999'."
#         )
#         try:
#             phone_regex(value)
#         except:
#             raise serializers.ValidationError("Invalid phone number format")
#         return value

#     def validate_postal_code(self, value):
#         postal_regex = RegexValidator(
#             regex=r'^\d{6}$',
#             message="Postal code must be 6 digits."
#         )
#         try:
#             postal_regex(value)
#         except:
#             raise serializers.ValidationError("Invalid postal code format")
#         return value

#     def validate_agreed_to_terms(self, value):
#         if not value:
#             raise serializers.ValidationError("You must agree to the terms and conditions")
#         return value

#     def create(self, validated_data):
#         validated_data['password'] = make_password(validated_data['password'])
#         validated_data['username'] = validated_data['email']  # Set username=email
#         return super().create(validated_data)

# class RequestPasswordResetSerializer(serializers.Serializer):
#     email = serializers.EmailField()

#     def validate_email(self, value):
#         try:
#             user = NGOUser.objects.get(email=value)
#             return value
#         except NGOUser.DoesNotExist:
#             raise serializers.ValidationError("No user found with this email address")

# class PasswordResetConfirmSerializer(serializers.Serializer):
#     token = serializers.CharField()
#     email = serializers.EmailField()
#     new_password = serializers.CharField(min_length=8, write_only=True)
#     confirm_password = serializers.CharField(min_length=8, write_only=True)

#     def validate(self, data):
#         if data['new_password'] != data['confirm_password']:
#             raise serializers.ValidationError("Passwords do not match")
        
#         try:
#             user = NGOUser.objects.get(email=data['email'])
#             if not default_token_generator.check_token(user, data['token']):
#                 raise serializers.ValidationError("Invalid or expired reset token")
#         except NGOUser.DoesNotExist:
#             raise serializers.ValidationError("Invalid email address")
            
#         return data

from rest_framework import serializers
from .models import NGOUser
from django.contrib.auth.hashers import make_password
from django.core.validators import RegexValidator
from django.contrib.auth.tokens import default_token_generator

class NGOUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGOUser
        fields = [
            'id', 'email', 'password', 'first_name', 'last_name',
            'organization', 'phone_number', 'postal_code', 'colony',
            'city', 'state', 'agreed_to_terms'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_phone_number(self, value):
        RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'."
        )(value)
        return value

    def validate_postal_code(self, value):
        RegexValidator(
            regex=r'^\d{6}$',
            message="Postal code must be 6 digits."
        )(value)
        return value

    def validate_agreed_to_terms(self, value):
        if not value:
            raise serializers.ValidationError("You must agree to the terms and conditions")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not NGOUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    email = serializers.EmailField()
    new_password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")

        try:
            user = NGOUser.objects.get(email=data['email'])
        except NGOUser.DoesNotExist:
            raise serializers.ValidationError("Invalid email address")

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Invalid or expired reset token")

        return data
