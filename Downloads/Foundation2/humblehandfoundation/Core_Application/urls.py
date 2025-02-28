from django.contrib import admin
from django.urls import path, include
from Core_Application import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('contributors/', views.contribators, name='contributors'),
    path('about/', views.about, name='about'),
    path('join/', views.join, name='join'),
    path('contact/', views.contact, name='contact'),
    path('contact/submit/', views.message_sent_successfully, name='message_sent_successfully'),
    path('donate/', views.donate, name='donate'),
    path('volunteer/', views.be_a_volunteer, name='volunteer'),
    path('events/', views.events, name='events'),
    path('message_sent/', views.message_sent_successfully, name='message_sent'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('process-donation/', views.process_donation, name='process_donation'),
    path('data/', views.data_view, name='data'),
    path('verify-password/', views.verify_password, name='verify_password'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('data/volunteers/', views.volunteer_data, name='volunteer_data'),
    path('data/messages/', views.message_data, name='message_data'),
    path('data/users/', views.user_data, name='user_data'),
    path('data/donations/', views.donation_data, name='donation_data'),
    path('update-password/', views.update_password, name='update_password'),
    path('logout/', views.logout_view, name='logout'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)