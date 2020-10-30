#!/usr/bin/env python
from threading import Lock
import functools
from flask import render_template, session, request, copy_current_request_context, flash, redirect, url_for, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from app import app, db
from app.forms import LoginForm, AddSurveyForm
from app.models import User, Survey, Chat
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy.exc import IntegrityError


async_mode = None
socketio = SocketIO(app, async_mode=async_mode, cors_allowed_origins="*")
thread = None
thread_lock = Lock()

def get_or_create(session, model, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
        return instance

def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapped



@app.route('/')
@login_required
def index():
    surveys = Survey.query.all()
    return render_template('survey.html', surveys=surveys, surveyform=AddSurveyForm(), async_mode=socketio.async_mode)


@app.route('/surveys')
@login_required
def survey():
    surveys = Survey.query.all()
    return render_template('survey.html', surveys=surveys, surveyform=AddSurveyForm())

@app.route('/add_survey(<data>',methods=['POST'])
@login_required
def add_survey(data):
    form = AddSurveyForm()
    if form.validate_on_submit():
        try:
            s = Survey(name=form.name.data,survey_id=form.survey_id.data,
                       active=form.active.data, persistent=form.persistent.data)
            db.session.add(s)
            db.session.commit()
        except IntegrityError:
            flash('Survey already registered')
    return redirect(url_for('survey'))

@app.route('/delete_survey(<id>',methods=['POST'])
@login_required
def delete_survey(id):
    s = Survey.query.filter_by(id=int(id)).first()
    db.session.delete(s)
    db.session.commit()
    return redirect(url_for('survey'))

@app.route('/surveys/<id>')
@login_required
def survey_detail(id):
    #surveys = Survey.query.filter_by(survey_id=id).first_or_404()
    chats = Chat.query.filter_by(survey_id=id)
    return render_template('survey_detail.html', chats=chats)


@app.route('/_chat', methods=['GET', 'POST'])
def _chat():
    id = request.args.get('id')
    chat = Chat.query.filter_by(survey_id=123, id=id).first_or_404()
    print(chat.participant_id)
    return chat.participant_id

@app.route('/_chatlist', methods=['GET', 'POST'])
def _chatlist():
    chats = Chat.query.filter_by(survey_id=123).all()
    return jsonify(json_list=[i.serialize for i in chats])


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('survey'))
    return render_template('login.html', title='Sign In', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))


@socketio.on('my_broadcast_event', namespace='/test')
def test_broadcast_message(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']},
         broadcast=True)


@socketio.on('join', namespace='/test')
def join(message):
    get_or_create(db.session, Chat, participant_id=message['room'], survey_id=message['survey'],)
    join_room(message['room'])


@socketio.on('my_room_event', namespace='/test')
def send_room_message(message):
    # todo EXCEPT data keyerror
    print('ROOM EVENT', message['room'])
    emit('my_response',
         {'data': message['data'],'room':message['room']},
         room=message['room'])