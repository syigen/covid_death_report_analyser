import os
from flask import Flask, request

UPLOAD_FOLDER = './upload'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username


@app.route('/', methods=['GET', 'POST'])
def create_press_release_recode():
    if request.method == 'POST':
        if 'report_data' not in request.form:
            return "Please select report data"

        if 'file1' not in request.files:
            return 'there is no file1 in form!'
        uploaded_files = request.files.getlist("file1")
        for file in uploaded_files:
            path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(path)
            # return path
    return '''
        <h1>Save Corona Death Report</h1>
        <form method="post" enctype="multipart/form-data">
            <p>Report Date : <input type="date" name="report_date"> </p>            
            <p>Report Files:<input type="file" name="file1" multiple> </p>
            <p><input type="submit" value="Save"> </p>
        </form>
        '''


if __name__ == '__main__':
    app.run()
