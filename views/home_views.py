# pylint thinks it can't find the infrastructure and viewmodels folders
# even though the app itself runs fine:
# pylint: disable = import-error

from services.search_services import add_search, create_search
import flask
import os
import sys
import datetime
import pprint

folder = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, folder)
from viewmodels.home.index_viewmodel import IndexViewModel
from infrastructure.view_modifiers import response
import infrastructure.request_dict as request_dict
import services.park_services as park_services
import services.region_services as region_services
from flask import jsonify
from scraper_shell import setup_info_dict, scrape_searches

blueprint = flask.Blueprint("home", __name__, template_folder="templates")


@blueprint.route("/", methods=["GET"])
@response(template_file="home/index.html")
def index():
    vm = IndexViewModel()
    return vm.to_dict()


@blueprint.route("/", methods=["POST"])
@response(template_file="home/index.html")
def scraper_post():
    vm = IndexViewModel()
    print("Not implemented yet")
    return vm.to_dict()


@blueprint.route("/about", methods=["GET", "POST"])
@response(template_file="home/about.html")
def about():
    vm = IndexViewModel()
    return vm.to_dict()


@blueprint.route("/_submit_search", methods=["POST"])
@response(template_file="home/index.html")
def submit_search():
    vm = IndexViewModel()
    request = request_dict.data_create("")
    owner_id = vm.user_id
    start_date = datetime.date.fromisoformat(request["start_date"].split("T")[0])
    end_date = datetime.date.fromisoformat(request["end_date"].split("T")[0])
    regions = request["regions"]
    parks = request["parks"]
    is_active = True
    search = create_search(owner_id, start_date, end_date, regions, parks, is_active)
    if not search:
        return jsonify(status="error")
    success = add_search(search)
    return jsonify(success)


@blueprint.route("/_load_park_data", methods=["GET"])
@response(template_file="home/index.html")
def load_park_data():
    output = {}
    regions = region_services.create_internal_region_dict()

    #get the region info:
    region_links = setup_info_dict(datetime.datetime.today(), datetime.datetime.today())
    for region_id in regions.keys():
        region_name = regions[region_id]
        app_region_name = region_name.split()[0].lower()
        output[app_region_name] = {}
        output[app_region_name]['link'] = region_links["start_urls"][region_name]
        output[app_region_name]['id'] = region_id

        #get the park info:
        park_dict = park_services.get_parks_in_region(region_id)
        output[app_region_name]['parks'] = park_dict

    return jsonify(output)
