from django.contrib import admin
from .models import NGOUser  # Import your model from models.py

# Register your models with custom admin interface
@admin.register(NGOUser)
class NGOUserAdmin(admin.ModelAdmin):
    list_display = (
        'email', 
        'organization', 
        'first_name', 
        'last_name', 
        'state', 
        'is_staff'
    )
    list_filter = ('state', 'city', 'date_joined')
    search_fields = ('email', 'organization', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': (
            'first_name', 
            'last_name', 
            'organization',
            'phone_number'
        )}),
        ('Address', {'fields': (
            'postal_code',
            'colony',
            'city',
            'state'
        )}),
        ('Permissions', {'fields': (
            'is_active', 
            'is_staff', 
            'is_superuser',
            'groups', 
            'user_permissions'
        )}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 
                'password1', 
                'password2',
                'organization',
                'first_name',
                'last_name'
            ),
        }),
    )

# Register your models here.
