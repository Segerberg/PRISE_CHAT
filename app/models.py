from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import login


@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Survey(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(128), index=True, unique=True)
    active = db.Column(db.Boolean)
    persistent = db.Column(db.Boolean)
    survey_id = db.Column(db.String(128))
    chats = db.relationship('Chat', backref='Survey', lazy='dynamic')

    def __repr__(self):
        return self.name


class Chat(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(128), index=True, unique=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('survey.id'))
    posts = db.relationship('Post', backref='Post', lazy='dynamic')

    def __repr__(self):
        return self.name

    @property
    def serialize(self):
        """Return chat data in easily serializable format"""
        return {
            'id': self.id,
            'name': self.name,
            'survey_id': self.survey_id
        }

class Post(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    message = db.Column(db.Text)
    received = db.Column(db.DateTime)
    chat_name = db.Column(db.String, db.ForeignKey('chat.name'))

    def __repr__(self):
        return '<Post {}>'.format(self.text)
