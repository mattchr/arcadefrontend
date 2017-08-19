from flask import Flask, send_file, request
import fileio
import json
import os
from jinja2 import Template
from flask_cors import CORS
from subprocess import Popen

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

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
    Popen(["docker", "run", "-p", "80:3000", "arcade-fe"])
    print("In the background!\n")
    app.run(debug=True)

@app.route('/api/v1/roms/list')
def hello_world():
    return json.dumps(fileio.FileIO().get_roms())
