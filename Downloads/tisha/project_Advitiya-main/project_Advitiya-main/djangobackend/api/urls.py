# from django.urls import path
# from api import views
# from .views import ContactCreateView

# urlpatterns = [
#     path('farmer/', views.FarmerList.as_view()),
#     path('contact/', ContactCreateView.as_view(), name='contact-create')
# ]

# from django.urls import path
# from .views import (
#     NGOUserCreateView,
#     NGOListView,
#     LoginView,
#     VerifyTokenView
# )


# urlpatterns = [
#     path('ngo/signup/', NGOUserCreateView.as_view(), name='ngo_signup'),
#     path('ngo/list/', NGOListView.as_view(), name='ngo_list'),
#     path('login/', LoginView.as_view(), name='login'),
#     path('verify-token/', VerifyTokenView.as_view(), name='verify_token'),
# ]

from django.urls import path
from .views import (
    NGOUserCreateView,
    NGOListView,
    LoginView,
    VerifyTokenView,
    RequestPasswordResetView,
    PasswordResetConfirmView,
)

urlpatterns = [
    path('ngo/signup/', NGOUserCreateView.as_view(), name='ngo_signup'),
    path('ngo/list/', NGOListView.as_view(), name='ngo_list'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify_token'),
    path('password-reset/', RequestPasswordResetView.as_view(), name='password_reset'),
    path('reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]



