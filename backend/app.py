from ast import Name
from cmath import nan
import imp
import json
from re import S
import re
from flask import Flask
from flask import Flask, render_template, request, jsonify
import os
import time
from matplotlib.font_manager import json_dump
import pyspark
import pandas as pd
from pyspark.sql.functions import *
from pyspark.sql import SparkSession
import shutil
from fastparquet import ParquetFile

import pyrebase
from regex import P

config = {
  "apiKey": "AIzaSyDo_3XAnj8RI04RsDwHHfN-z0Q3IZA-bCk",
  "authDomain": "parquet-writer.firebaseapp.com",
  "projectId": "parquet-writer",
  "storageBucket": "parquet-writer.appspot.com",
  "messagingSenderId": "592906913581",
  "appId": "1:592906913581:web:555537bc3c62d0c826f5a4",
  "databaseURL": "https://parquet-writer-default-rtdb.firebaseio.com/",
  "serviceAccount":"parquet-writer-firebase-adminsdk-ibvc3-ccf6d01f9d.json"
}
firebase = pyrebase.initialize_app(config)
storage = firebase.storage()



spark = SparkSession.builder.master("local[1]").appName('SparkByExamples.com').getOrCreate()


app = Flask(__name__, static_folder='../build', static_url_path='/')

def deleteFiles(folder):
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))

def getFiles(name):
    for file in storage.list_files():
        print(file.name)
        print("--------")
        if name.lower() in file.name.lower():
            print(file.name)
            return file.name
def getFilesContains(name, substring):
    for file in storage.list_files():
        print(file.name)
        print("--------")
        if substring.lower() in file.name.lower():
            print(file.name)
            return file.name
def getLocalFiles():
    directory = 'written_parquet'
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if os.path.isfile(f) and filename.endswith('.parquet'):
            print(filename)
            return filename
def getLocalFilesCsv():
    directory = 'written_csv'
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if os.path.isfile(f) and filename.endswith('.csv'):
            print(filename)
            return filename
def deleteAll(name):
    for file in storage.list_files():
        print(file.name)
        print("--------")
        if name.lower() in file.name.lower():
            storage.delete(file.name)
    recreateLocal()
    
@app.route('/delete')
def delete():
    name = request.args.get('name')
    deleteAll(name)
    
@app.route('/write')
def add():
    shutil.rmtree('written_parquet', ignore_errors=True)    
    name = request.args.get('name')
    data = json.loads(request.args.get('data'))
    data = [tuple(record) for record in data]
    columns = json.loads(request.args.get('columns'))
    print(columns)
    print(data)
    df= spark.createDataFrame(data,columns)
    df.write.parquet("written_parquet")
    parquet_file = getLocalFiles()
    storage.child(name+"/written_parquet/file.parquet").put("written_parquet/"+parquet_file)
    url = storage.child(name+"/written_parquet/file.parquet").get_url(token=None)
    print(url)
    return jsonify(url)

@app.route('/read')
def get_current_time():
    # df = pd.read_parquet('../tmp/out/people.parquet')
    # df.to_csv('../tmp/out/people.csv')
    pf = ParquetFile("parquet/file.parquet")

    # Converting data in to pandas dataFrame
    dataFrame = pf.to_pandas()

    # Converting to CSV
    dataFrame.to_csv("csv/file.csv", index = False)


def recreateLocal():
    shutil.rmtree('csv', ignore_errors=True)
    shutil.rmtree('written_parquet', ignore_errors=True)
    shutil.rmtree('written_csv', ignore_errors=True)
    shutil.rmtree('parquet', ignore_errors=True)
    mypath = "parquet"
    if not os.path.isdir(mypath):
        os.makedirs(mypath)
    mypath = "csv"
    if not os.path.isdir(mypath):
        os.makedirs(mypath)
    mypath = "written_csv"
    if not os.path.isdir(mypath):
        os.makedirs(mypath)
    mypath = "written_parquet"
    if not os.path.isdir(mypath):
        os.makedirs(mypath)

@app.route('/getData')
def get():
    name = request.args.get('name')
    recreateLocal()
    path = getFiles(name)
    storage.child(path).download("parquet/file.parquet")
    pf = ParquetFile("parquet/file.parquet")

    # Converting data in to pandas dataFrame
    dataFrame = pf.to_pandas()

    # Converting to CSV
    dataFrame.to_csv("csv/file.csv", index = False)

    df = pd.read_csv('csv/file.csv')
    columns = df.columns
    dataSource = []
    for (idx, row) in df.iterrows():
        c = {}
        for column in columns:
            print(type(row.loc[column]))
            if type(row.loc[column]) == float and pd.isna(row.loc[column]):
                c[column] = "Nan"
            else:
                c[column] = row.loc[column]
            print(c[column])
        dataSource.append(c)
    antDColumns = []
    for column in columns:
        c= {}
        c['title'] = column
        c['dataIndex'] = column
        c['key']= column
        antDColumns.append(c)
    result = {
        "dataSource": dataSource,
        "columns": antDColumns
    }
    
    print(json.dumps(result))
    return json.dumps(result)


@app.route('/convertcsv')
def convertCsv():
    recreateLocal()
    name = request.args.get('name')
    print("name", name)
    path = getFilesContains(name,name+"/csv/")
    storage.child(path).download('written_csv/file.csv')
    df = pd.read_csv('written_csv/file.csv')
    df.to_parquet('written_parquet/file.parquet')
    parquet_file = getLocalFiles()
    storage.child(name+"/written_parquet/file.parquet").put("written_parquet/"+parquet_file)
    url = storage.child(name+"/written_parquet/file.parquet").get_url(token=None)
    print(url)
    return jsonify(url)

if __name__ == "__main__":
    app.run()