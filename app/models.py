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
    chats = db.relationship('Chat', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Survey(db.Model):
    # todo Cascade
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(128), index=True, unique=True)
    survey_id = db.Column(db.String(128))
    chats = db.relationship('Chat', backref='survey', cascade='delete', lazy='dynamic')

    def __repr__(self):
        return self.name


class Chat(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    active = db.Column(db.Boolean)
    participant_id = db.Column(db.String(128), index=True, unique=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('survey.id'))
    user_suggestion = db.Column(db.String(128))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


    def __repr__(self):
        return self.participant_id

    @property
    def serialize(self):
        """Return chat data in easily serializable format"""
        return {
            'id': self.id,
            'user_active': self.active,
            'participant_id': self.participant_id,
            'survey_id': self.survey_id,
            'user_suggestion': self.user_suggestion,
            'user_id': self.user_id,

        }



