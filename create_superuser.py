from app import app, db
import os
from app.models import User
from sqlalchemy.exc import IntegrityError

SUPERUSER_NAME = os.environ.get('SUPERUSER_NAME')
SUPERUSER_PASSWORD = os.environ.get('SUPERUSER_PASSWORD')
users = User.query.all()

if len(users) == 0:
    try:
        u = User(username=SUPERUSER_NAME)
        u.set_password(SUPERUSER_PASSWORD)
        db.session.add(u)
        db.session.commit()
        print("superuser created")
    except IntegrityError:
        print("superuser already exists")
else:
    print("Can't add superuser. DB already have Users")
