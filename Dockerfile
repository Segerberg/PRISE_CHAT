FROM python:3.6-alpine

RUN adduser -D chat

WORKDIR /home/chat

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY app app
COPY migrations migrations
COPY chat.py config.py boot.sh app.db ./
RUN chmod +x boot.sh

ENV FLASK_APP chat.py

RUN chown -R chat:chat ./
USER chat

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]