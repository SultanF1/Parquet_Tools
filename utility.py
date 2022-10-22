from firebase_admin import credentials, initialize_app, storage



cred = credentials.Certificate("parquet-writer-firebase-adminsdk-ibvc3-ccf6d01f9d.json")
initialize_app(cred, {'storageBucket': 'parquet-writer.appspot.com'})
bucket_name = "parquet-writer.appspot.com"
def download(path):
    source_blob_name = path
    bucket = storage.bucket()
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename("written_csv/file.csv")

def downloadToParquet(path):
    source_blob_name = path
    bucket = storage.bucket()
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename("parquet/file.parquet")

def upload(name, parquet_file):
    storage.child(name+"/written_parquet/file.parquet").put("/written_parquet/"+parquet_file)
    url = storage.child(name+"/written_parquet/file.parquet").get_url(token=None)
    return url