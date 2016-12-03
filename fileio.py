from config import ArcadeConfig
import os
import json
from subprocess import call
from games import GameInfo


def get_roms():
    cfg = ArcadeConfig()
    roms = list()
    for filename in sorted(filter(lambda x: x.endswith('.zip'), os.listdir(cfg.roms_path))):
        internal_name = os.path.splitext(filename)[0]
        try:
            roms.append({
                'full_name': get_rom_fullname(internal_name),
                'internal_name': internal_name,
            })
        except KeyError:
            pass
    return roms


def get_marquee(internal_name):
    cfg = ArcadeConfig()
    filepath = os.path.join(cfg.roms_path, '../marquees/{}.png'.format(internal_name))
    if not os.path.isfile(filepath):
        print(filepath)
        raise KeyError
    return filepath


def get_rom_fullname(internal_name):
    cfg = ArcadeConfig()
    if cfg.blacklisted(internal_name):
        raise KeyError
    try:
        return cfg.rom_names[internal_name]
    except KeyError:
        print("Adding {}".format(internal_name))
        # game_info = GameInfo(internal_name)
        # try:
        # cfg.add_rom(game_info)
        # except IOError:
        #     print("blacklisting {}".format(internal_name))
        #     cfg.blacklist_rom(game_info.internal_name)
        #     print("{} not found".format(internal_name))
        #     raise KeyError
        # return game_info.name
    if cfg.only_listed_roms:
        raise KeyError
    # return cfg.roms_list[internal_name]

def launch_game(internal_name):
    prev_dir = os.getcwd()
    cfg = ArcadeConfig()
    os.chdir(os.path.dirname(cfg.emulator_path));
    call([cfg.emulator_path, "-rompath", cfg.roms_path, internal_name])
    os.chdir(prev_dir)

if __name__ == "__main__":
    print(get_roms())
