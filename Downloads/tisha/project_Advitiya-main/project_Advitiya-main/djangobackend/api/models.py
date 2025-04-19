# from django.db import models

# # Create your models here.
# class farmer(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)

# class Contact(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField()
#     message = models.TextField()

# from django.db import models
# from django.contrib.auth.base_user import AbstractBaseUser
# from django.contrib.auth.models import PermissionsMixin

# class NGOUser(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True)
#     organization = models.CharField(max_length=255)
#     phone_number = models.CharField(max_length=20)
#     postal_code = models.CharField(max_length=20)
#     colony = models.CharField(max_length=255)
#     city = models.CharField(max_length=100)
#     state = models.CharField(max_length=100)
#     agreed_to_terms = models.BooleanField(default=False)
#     date_joined = models.DateTimeField(auto_now_add=True)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['organization']

#     def __str__(self):
#         return self.organization

from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

class NGOUser(AbstractBaseUser, PermissionsMixin):
    username = None  # <-- Add this line to remove username field from the model

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    organization = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    postal_code = models.CharField(max_length=20)
    colony = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    agreed_to_terms = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['organization']

    def __str__(self):
        return self.organization
