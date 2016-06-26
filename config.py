import os
import json
import csv


class ArcadeConfig(object):
    def __init__(self):
        cfg = json.loads(open(os.path.join(os.path.dirname(__file__), 'config.cfg'), 'r').read())
        self.emulator_path = os.path.abspath(cfg['emulator_path'])
        self.roms_path = os.path.abspath(cfg['roms_path'])
        self.roms_list = self.parse_roms_list()
        self.rom_names = cfg['rom_names']
        self.only_listed_roms = True if cfg['only_listed_roms'] else False


    def parse_roms_list(self):
        results = dict()
        with open(os.path.join(os.path.dirname(__file__), 'romlist.txt'), 'r') as f:
            for line in f:
                split_up = line.split('|')
                full_name = split_up[1].strip()
                internal_name = split_up[6].strip()
                results[internal_name] = full_name
        return results