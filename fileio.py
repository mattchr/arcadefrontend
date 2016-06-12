from config import ArcadeConfig
import os
import json
from subprocess import call


def get_roms():
    cfg = ArcadeConfig()
    roms = list()
    for filename in sorted(filter(lambda x: x.endswith('.zip'), os.listdir(cfg.roms_path))):
        internal_name = os.path.splitext(filename)[0]
        try:
            roms.append({
                'full_name': cfg.roms_list[internal_name],
                'internal_name': internal_name,
            })
        except KeyError:
            pass
    return roms

def launch_game(internal_name):
    cfg = ArcadeConfig()
    rom_path = os.path.join(cfg.roms_path, '{}.zip'.format(internal_name))
    call([cfg.emulator_path, "-rompath", cfg.roms_path, internal_name])
    print(internal_name)



if __name__ == "__main__":
    print(get_roms())