from flask import Flask, send_file, request
import fileio
import json
import os
from jinja2 import Template

app = Flask(__name__)
basedir = os.path.dirname(__file__)
staticdir = os.path.join(basedir, 'static')


@app.route('/')
def api_root():
    return Template(open(os.path.join(staticdir, 'index.html'), 'r').read()).render()


@app.route('/api/v1/roms/list')
def get_roms():
    return json.dumps(sorted(fileio.get_roms(), key=lambda x: x['full_name']))


@app.route('/api/v1/roms/play/<internal_name>')
def play_rom(internal_name):
    fileio.launch_game(internal_name)
    return ''


@app.route('/api/v1/artwork/marquee/<internal_name>')
def get_marquee(internal_name):
    try:
        filename = fileio.get_marquee(internal_name)
    except KeyError:
        return ''
    return send_file(filename, mimetype='image/gif')


if __name__ == '__main__':
    app.run()

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'
#     # return open(os.path.join(htdocsdir, 'index.html'), 'rb').read()
#
@app.route('/api/v1/roms/list')
def hello_world():
    return json.dumps(fileio.FileIO().get_roms())
#
# app.run()