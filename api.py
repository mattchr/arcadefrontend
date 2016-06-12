from flask import Flask
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
def hello_world():
    return json.dumps(fileio.get_roms())

@app.route('/api/v1/roms/play/<internal_name>')
def play_rom(internal_name):
    fileio.launch_game(internal_name)
    return ''

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