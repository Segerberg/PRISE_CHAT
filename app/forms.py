from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')


class AddSurveyForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    survey_id= StringField('Survey ID', validators=[DataRequired()])
    active = BooleanField('Active')
    persistent = BooleanField('Persistent')
    #submit = SubmitField('Add')

class AddUserForm(FlaskForm):
    username = StringField('Name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
