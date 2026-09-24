import os
import pymysql
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def ensure_database_exists(app):
    """
    Connects to MySQL server and creates the target database if it does not exist.
    Falls back to SQLite if MySQL service is unreachable.
    """
    host = Config.MYSQL_HOST
    port = Config.MYSQL_PORT
    user = Config.MYSQL_USER
    password = Config.MYSQL_PASSWORD
    db_name = Config.MYSQL_DB

    mysql_success = False

    try:
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f"[Database] MySQL Database '{db_name}' checked/created successfully.")
        connection.close()
        mysql_success = True
    except Exception as e:
        print(f"[Database Warning] Could not connect to MySQL server ({e}).")
        print("[Database Warning] Attempting fallback or check environment variables.")

    if mysql_success:
        app.config["SQLALCHEMY_DATABASE_URI"] = Config.SQLALCHEMY_DATABASE_URI
    else:
        # Fallback to local SQLite if MySQL daemon is not running
        sqlite_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pathfinder.db")
        app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{sqlite_path}"
        print(f"[Database] Falling back to SQLite database at: {sqlite_path}")

    db.init_app(app)
    with app.app_context():
        db.create_all()
        print("[Database] Database tables initialized successfully.")
