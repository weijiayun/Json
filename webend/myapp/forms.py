from flask.ext.wtf import Form
from wtforms import StringField, BooleanField, TextAreaField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, Email, Optional
from flask.ext.wtf.file import  FileAllowed, FileRequired, FileField


class LoginForm(Form):
    username = StringField('username', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()] )
    remember_me = BooleanField( 'remember_me',default=False )
    submit = SubmitField()

class EditForm(Form):
    username = StringField('username', validators=[DataRequired()])
    # public_key = TextAreaField('public_key', validators=[DataRequired()])
    # email = StringField('email',validators=[DataRequired , Email()])
    email = StringField('email',validators=[DataRequired(),Email()])
    telephone = StringField('telephone', validators=[DataRequired()])
    introduction = TextAreaField('introduction', validators=[DataRequired()])
    submit = SubmitField()


class AccountForm(Form):
    oldpassword = StringField('oldpassword', validators=[DataRequired()])
    newpassword = StringField('newpassword', validators=[DataRequired()])
    confirmpassword = StringField('confirmpassword', validators=[DataRequired()])
    submit = SubmitField()

class KeyForm(Form):
    publickey = TextAreaField('publickey', validators=[DataRequired()])
    privatekey = TextAreaField('privatekey', validators=[DataRequired()])
    submit = SubmitField()


class AvatarForm(Form):
    avatar = FileField('avatar', validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])
    submit = SubmitField()


























