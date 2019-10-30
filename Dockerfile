FROM python:3.6-slim


RUN apt-get update && apt-get install -y \
      locales \
      g++ \
      python3-dev \
      curl \
      && curl -sL https://deb.nodesource.com/setup_12.x | bash \
      && apt-get install -y nodejs

WORKDIR /chat_app_practice/
COPY ./requirements.txt /chat_app_practice/

RUN pip install -r requirements.txt


WORKDIR /chat_app_practice/client/

COPY ./client/package.json ./client/package-lock.json /chat_app_practice/client/
RUN npm install

COPY . /chat_app_practice/
RUN npm run build

WORKDIR /chat_app_practice/

EXPOSE $PORT

CMD python manage.py runserver 0.0.0.0:$PORT
