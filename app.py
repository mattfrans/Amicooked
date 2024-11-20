from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///amicooked.db'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db = SQLAlchemy(app)

class Situation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    image_path = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    reply_to = db.Column(db.Integer, db.ForeignKey('situation.id'), nullable=True)
    replies = db.relationship('Situation', backref=db.backref('parent', remote_side=[id]))

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    situation_id = db.Column(db.Integer, db.ForeignKey('situation.id'), nullable=False)
    vote_type = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    situation_id = db.Column(db.Integer, db.ForeignKey('situation.id'), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/situations', methods=['POST'])
def post_situation():
    try:
        text = request.form.get('text', '')
        reply_to = request.form.get('reply_to', None, type=int)
        
        image_path = None
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
                filename = timestamp + filename
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                image_path = filename

        new_situation = Situation(
            text=text,
            image_path=image_path,
            reply_to=reply_to
        )
        db.session.add(new_situation)
        db.session.commit()
        
        return jsonify({
            'id': new_situation.id,
            'text': new_situation.text,
            'image_path': new_situation.image_path,
            'created_at': new_situation.created_at.isoformat(),
            'reply_to': new_situation.reply_to
        }), 201
    except Exception as e:
        print("Error creating situation:", str(e))
        db.session.rollback()
        return jsonify({'message': str(e), 'status': 'error'}), 500

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/vote', methods=['POST'])
def vote():
    data = request.json
    situation_id = data.get('post_id')
    vote_type = data.get('vote_type')

    if not situation_id or not vote_type:
        return jsonify({'error': 'Missing required fields'}), 400

    vote = Vote(situation_id=situation_id, vote_type=vote_type)
    db.session.add(vote)
    db.session.commit()

    # Get updated vote counts
    cooked_votes = Vote.query.filter_by(situation_id=situation_id, vote_type='cooked').count()
    wagmi_votes = Vote.query.filter_by(situation_id=situation_id, vote_type='going_to_make_it').count()

    return jsonify({
        'cooked': cooked_votes,
        'going_to_make_it': wagmi_votes
    })

@app.route('/vote/<int:situation_id>', methods=['GET'])
def get_votes(situation_id):
    try:
        cooked = Vote.query.filter_by(situation_id=situation_id, vote_type='cooked').count()
        going_to_make_it = Vote.query.filter_by(situation_id=situation_id, vote_type='going_to_make_it').count()
        return jsonify({
            'cooked': cooked,
            'going_to_make_it': going_to_make_it
        })
    except Exception as e:
        print("Error getting votes:", str(e))
        return jsonify({'message': str(e), 'status': 'error'}), 500

@app.route('/comments/<int:situation_id>', methods=['GET'])
def get_comments(situation_id):
    try:
        comments = Comment.query.filter_by(situation_id=situation_id).order_by(Comment.created_at.desc()).all()
        return jsonify([{
            'id': c.id,
            'text': c.text,
            'created_at': c.created_at.isoformat(),
            'situation_id': c.situation_id
        } for c in comments])
    except Exception as e:
        print("Error getting comments:", str(e))
        return jsonify({'message': str(e), 'status': 'error'}), 500

@app.route('/comments', methods=['POST'])
def add_comment():
    try:
        data = request.json
        new_comment = Comment(
            situation_id=data['situation_id'],
            text=data['text']
        )
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({
            'id': new_comment.id,
            'text': new_comment.text,
            'created_at': new_comment.created_at.isoformat(),
            'situation_id': new_comment.situation_id
        }), 201
    except Exception as e:
        print("Error adding comment:", str(e))
        db.session.rollback()
        return jsonify({'message': str(e), 'status': 'error'}), 500

@app.route('/situations', methods=['GET'])
def get_situations():
    try:
        # Get root threads and their votes/comments
        situations = Situation.query.filter_by(reply_to=None).order_by(Situation.created_at.desc()).all()
        
        result = []
        for s in situations:
            # Get votes for this situation
            cooked = Vote.query.filter_by(situation_id=s.id, vote_type='cooked').count()
            going_to_make_it = Vote.query.filter_by(situation_id=s.id, vote_type='going_to_make_it').count()
            
            # Get comments for this situation
            comments = Comment.query.filter_by(situation_id=s.id).order_by(Comment.created_at.desc()).all()
            
            # Get replies and their votes
            replies_data = []
            for r in s.replies:
                r_cooked = Vote.query.filter_by(situation_id=r.id, vote_type='cooked').count()
                r_going_to_make_it = Vote.query.filter_by(situation_id=r.id, vote_type='going_to_make_it').count()
                r_comments = Comment.query.filter_by(situation_id=r.id).order_by(Comment.created_at.desc()).all()
                
                replies_data.append({
                    'id': r.id,
                    'text': r.text,
                    'image_path': r.image_path,
                    'created_at': r.created_at.isoformat(),
                    'votes': {
                        'cooked': r_cooked,
                        'going_to_make_it': r_going_to_make_it
                    },
                    'comments': [{
                        'id': c.id,
                        'text': c.text,
                        'created_at': c.created_at.isoformat(),
                        'situation_id': c.situation_id
                    } for c in r_comments]
                })
            
            result.append({
                'id': s.id,
                'text': s.text,
                'image_path': s.image_path,
                'created_at': s.created_at.isoformat(),
                'votes': {
                    'cooked': cooked,
                    'going_to_make_it': going_to_make_it
                },
                'comments': [{
                    'id': c.id,
                    'text': c.text,
                    'created_at': c.created_at.isoformat(),
                    'situation_id': c.situation_id
                } for c in comments],
                'replies': replies_data
            })
        
        return jsonify(result)
    except Exception as e:
        print("Error fetching situations:", str(e))
        return jsonify({'message': str(e), 'status': 'error'}), 500

@app.route('/')
def index():
    return send_file('index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
