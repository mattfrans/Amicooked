# Amicooked

Amicooked is an app where users can post their situations and others can vote on whether they are 'cooked' or 'going to make it'.

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open your browser and go to `http://127.0.0.1:5000` to use the app.

## Endpoints
- `POST /situations`: Post a new situation.
- `GET /situations`: Retrieve all situations.
- `POST /vote`: Vote on a situation.
- `GET /results/<situation_id>`: Get voting results for a specific situation.

## License
This project is licensed under the MIT License.
