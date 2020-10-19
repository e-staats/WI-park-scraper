from data.users_to_searches import UserToSearch # pylint: disable = import-error
from data.search import Search  # pylint: disable = import-error
import data.db_session as db_session  # pylint: disable = import-error
import datetime


def create_search(owner_id, start_date, end_date, preferred_region, parks, is_active):
    s = Search()
    s.owner_id = owner_id
    s.start_date = start_date
    s.end_date = end_date
    s.preferred_region = preferred_region
    s.parks = parks
    s.is_active = True
    return s


def find_search_by_id(search_id, session=None):
    if session == None:
        session = db_session.create_session()

    search = (
        session.query(Search)
        .filter(Search.id == search_id)
        .filter(Search.is_active == 1)
        .first()
    )

    return search


def find_active_searches(session=None):
    if session == None:
        session = db_session.create_session()

    searches = (
        session.query(Search)
        .filter(Search.is_active == 1)
        .all()
    )

    return searches

def find_users_interested_in_search(search_id, session=None):
    if session == None:
        session = db_session.create_session()

    users = session.query(UserToSearch).filter(UserToSearch.search_id == search_id).all()

    return users