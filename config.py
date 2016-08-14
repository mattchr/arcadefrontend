import os
import json
import csv


class ArcadeConfig(object):
    def __init__(self):
        self.filename = os.path.join(os.path.dirname(__file__), 'config.cfg')
        with open(self.filename, 'r') as f:
            self.cfg = json.load(f)
        self.emulator_path = os.path.abspath(self.cfg['emulator_path'])
        self.roms_path = os.path.abspath(self.cfg['roms_path'])
        self.roms_list = self.parse_roms_list()
        self.rom_names = self.cfg['rom_names']
        self.only_listed_roms = True if self.cfg['only_listed_roms'] else False


    def parse_roms_list(self):
        results = dict()
        with open(os.path.join(os.path.dirname(__file__), 'romlist.txt'), 'r') as f:
            for line in f:
                split_up = line.split('|')
                full_name = split_up[1].strip()
                internal_name = split_up[6].strip()
                results[internal_name] = full_name
        return results
    
    def add_rom(self, game_info):
        self.cfg['rom_names'][game_info.internal_name] = game_info.name
        self.write_cfg()

    def blacklisted(self, internal_name):
        return internal_name in self.cfg['blacklisted_roms']

    def blacklist_rom(self, internal_name):
        blacklist = set(self.cfg['blacklisted_roms'])
        blacklist.add(internal_name)
        self.cfg['blacklisted_roms'] = sorted(blacklist)
        self.write_cfg()

    def write_cfg(self):
        with open(self.filename, 'w') as f:
            json.dump(self.cfg, f, indent=4, sort_keys=True)
