import asyncio
from database import engine
from sqlalchemy import text

async def test_db():
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("DB connected successfully:", result.fetchone())
            
            # Check if users table exists
            result = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_name = 'users'"))
            table_exists = result.fetchone()
            if table_exists:
                print("Users table exists!")
            else:
                print("Users table not found.")
    except Exception as e:
        print("DB connection failed:", e)

if __name__ == "__main__":
    asyncio.run(test_db())