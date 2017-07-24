from django import forms

from django.contrib.auth.forms import AuthenticationForm


class RememberMeAuthenticationForm(AuthenticationForm):
    remember = forms.BooleanField(required=False, widget=forms.CheckboxInput())
