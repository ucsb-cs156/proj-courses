# Kenny Tran, CS156 S23
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Create a Database Access User at cloud.mongodb.com/.../security/database/users
username = "DBUserUsernameHere"
password = "DBUserPasswordHere"

uri = f"mongodb+srv://{username}:{password}@cluster0.8jhud7s.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Get the entire database, then find the courses
db = client.database
coll = db.courses

# Filter by a single quarter (There might be a better filter to find all buildings)
# For example, this does not return the new ILP building from Spring 2023.
cursor = coll.find({ 'courseInfo.quarter': "20221" })

# Add all buildings found to a set.
# Some courses don't have a building assigned, hence the try/except block
bldgs = set()
for doc in cursor:
    if len(doc['section']['timeLocations']):
        try:
            bldg = doc['section']['timeLocations'][0]['building']
            bldgs.add(bldg)
        except:
            pass

print(sorted(bldgs))
