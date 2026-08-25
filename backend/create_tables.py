from app.database.connection import engine
from app.database.base import Base

# Import the model so SQLAlchemy knows about the User table
from app.models.user import User


Base.metadata.create_all(bind=engine)

print("✅ Database tables created successfully!")   