from datetime import datetime, timezone

from flask import Flask, jsonify, request


def create_app():
    app = Flask(__name__)

    @app.get("/health/")
    def health_check():
        return {"status": "ok"}

    @app.post("/notifications/")
    def receive_notification():
        payload = request.get_json(silent=True)
        required_fields = {"recipient_id", "event_type", "payload"}

        if not isinstance(payload, dict) or not required_fields.issubset(payload):
            return jsonify({"detail": "Invalid notification payload."}), 400

        return jsonify(
            {
                "status": "accepted",
                "event_type": payload["event_type"],
                "received_at": datetime.now(timezone.utc).isoformat(),
            }
        ), 202

    return app


app = create_app()
