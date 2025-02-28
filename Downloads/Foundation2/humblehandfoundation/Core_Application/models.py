from django.db import models

# Create your models here.
class Volunteer(models.Model):
    PROFESSION_CHOICES = [
        ('STUDENT', 'Student'),
        ('PRIVATE', 'Private Employee'),
        ('GOVERNMENT', 'Government Employee'),
        ('BUSINESS', 'Self Business'),
        ('SOCIAL', 'Social Worker'),
        ('OTHER', 'Other')
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    age = models.IntegerField()
    profession = models.CharField(max_length=20, choices=PROFESSION_CHOICES)
    message = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

    # Comment out Meta class if it causes migration issues
    # class Meta:
    #     ordering = ['-date', '-time']

    def __str__(self):
        return f"{self.name} - {self.profession}"


    

class Signup(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=100)  # Store plain text only for demo (use hashing in real apps)

    def __str__(self):
        return self.username

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"

class AdminPassword(models.Model):
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Admin Password - {self.created_at.strftime('%Y-%m-%d')}"