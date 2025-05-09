"""""""""""""""""
     IMPORTS 
"""""""""""""""""
from flask import Flask, render_template, jsonify, make_response, request
from dotenv import load_dotenv
import requests

import os

"""""""""""""""""
      INIT 
"""""""""""""""""
def init():
    load_dotenv()
    assert os.getenv("BEAM_HOST")

init()


"""""""""""""""""
     GLOBALS
"""""""""""""""""
APP_SERVER = Flask( __name__,
        template_folder = "./templates",
        static_folder="./static",
        static_url_path=""
)

BEAM_HOST: str = os.getenv("BEAM_HOST")
 
"""""""""""""""""
   API ROUTES
"""""""""""""""""
@APP_SERVER.route('/api/create_session')
def get_session():
    try:
        end_point = os.getenv("BEAM_HOST") + "/external/createSession"
        r = requests.get(url = end_point)
        data = r.json()
        
        print(data)

        status = data["status"]
        session_id = data["session_id"]

        assert status
        assert session_id

        response = make_response(jsonify({
            "status": 200,
        }))

        response.set_cookie(
            "session_id", session_id, httponly=True, max_age=60*60*24
        )  # 1 day expiry

        return response

    except Exception as e:
        return jsonify({
            "status": 500,
            "status_msg": e 
        })

@APP_SERVER.route('/api/recommend')
def get_recommendations():
    try:
        session_id = request.cookies.get("session_id", None) 
        assert session_id

        end_point = os.getenv("BEAM_HOST") + "/external/recommend"

        postData = {
            "session_id": session_id,
        }

        r = requests.post(url = end_point, data=postData)
        data = r.json()
        
        print(data)

        status = data["status"]
        recs = data["recommendations"]

        assert status
        assert recs 

        response = make_response(jsonify({
            "status": 200,
            "recommendations": recs,
        }))

        return response

    except Exception as e:
        return jsonify({
            "status": 500,
            "status_msg": e 
        })

@APP_SERVER.route('/api/submit_preferences', methods=["post"])
def submit_preferences():
    try:
        session_id = request.cookies.get("session_id", None) 
        assert session_id

        # get post data
        formData = request.form
        prefs = formData["tags"]

        end_point = os.getenv("BEAM_HOST") + "/external/post/preferences"

        postData = {
            "session_id": session_id,
            "tags": prefs,
        }

        r = requests.post(url = end_point, data=postData)

        res_data = r.json()
        status = res_data["status"]
        assert status == 200

        # Create a response object and set the cookie
        response = make_response(jsonify({
            "status": 200,
        }))

        response.set_cookie(
            "preferences", prefs, httponly=True, max_age=60*60*24
        )  # 1 day expiry

        return response

    except Exception as e:
        return jsonify({
            "status": 500,
            "status_msg": e 
        })

@APP_SERVER.route('/api/like', methods=["post"])
def like_content():
    try:
        session_id = request.cookies.get("session_id", None) 
        assert session_id

        # get post data
        formData = request.form
        content_id = formData["content_id"]

        end_point = os.getenv("BEAM_HOST") + "/external/like"

        postData = {
            "session_id": session_id,
            "content_id": content_id,
        }

        r = requests.post(url = end_point, data=postData)

        res_data = r.json()
        status = res_data["status"]
        assert status == 200

        # Create a response object and set the cookie
        response = make_response(jsonify({
            "status": 200,
        }))

        return response

    except Exception as e:
        return jsonify({
            "status": 500,
            "status_msg": e 
        })


@APP_SERVER.route('/api/dislike', methods=["post"])
def dislike_content():
    try:
        session_id = request.cookies.get("session_id", None) 
        assert session_id

        # get post data
        formData = request.form
        content_id = formData["content_id"]

        end_point = os.getenv("BEAM_HOST") + "/external/dislike"

        postData = {
            "session_id": session_id,
            "content_id": content_id,
        }

        r = requests.post(url = end_point, data=postData)

        res_data = r.json()
        status = res_data["status"]
        assert status == 200

        # Create a response object and set the cookie
        response = make_response(jsonify({
            "status": 200,
        }))

        return response

    except Exception as e:
        return jsonify({
            "status": 500,
            "status_msg": e 
        })


@APP_SERVER.route('/api/switch_model', methods=["get"])
def switch_model():
    try:
        session_id = request.cookies.get("session_id", None) 
        assert session_id

        end_point = os.getenv("BEAM_HOST") + "/external/changeModel"

        postData = {
            "session_id": session_id,
            "model": "none",
        }

        r = requests.post(url = end_point, data=postData)

        res_data = r.json()
        status = res_data["status"]
        assert status == 200

        # Create a response object and set the cookie
        response = make_response(jsonify({
            "status": 200,
        }))

        return response

    except Exception as e:
        return jsonify({
            "status": 500,
            "status_msg": e 
        })


"""""""""""""""""
     ROUTES
"""""""""""""""""
@APP_SERVER.route('/')
def start():
    template = None

    session_id = request.cookies.get("session_id", None) 
    preferences_raw = request.cookies.get("preferences", None)
    session_complete = request.cookies.get("sessionComplete", None)

    preferences = preferences_raw.split(",") if preferences_raw else None

    print(session_id)
    print(preferences)

    if session_complete and session_id:
        template = render_template("session_complete.html", sid=session_id) 
    elif (not session_id) and (not preferences): 
        template = render_template("session.html", sid=session_id) 
    elif (session_id) and (not preferences): 

        session_id = request.cookies.get("session_id", None) 
        assert session_id

        end_point = os.getenv("BEAM_HOST") + "/external/get_tags"

        r = requests.get(url = end_point)

        res_data = r.json()
        status = res_data["status"]
        assert status == 200

        tags = res_data["tags"]

        template = render_template("preferences.html", sid=session_id, tags=tags) 
    else:
        template = render_template("video_player.html", sid=session_id) 

    return template
