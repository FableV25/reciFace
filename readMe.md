# Face app thing 
## What does it do
<p>for now it just gets a single image and "detects" facial landmarks like</p>
<ol>
  <li>gender</li>
  <li>eye color</li>
  <li>ethnicity </li>
  <li>Hair color</li>
</ol> 

<p>on a future is supposed to be able take a whole batch of images and do the landmarking thing and save the results on a laragon database (i tihnk), also i have to get a better model for things like ethnicity</p>

<p>anyway</p>

## Get it to run
<h3>Backend</h3>
To run the backend server youll have to:
1.  Create a virtual environment:
    
    Windows
    ```bash
    python -m venv env
    ```
    Mac/Linux
    ```bash
    python3 -m venv env
    ```
2.  Activate the virtual environment:
    
    Windows
    ```bash
    env\Scripts\activate
    ```

    Mac/Linux
    ```bash
    source myenv/bin/activate
    ```

3.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

4.  intall the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5.  Start the Django development server:
    ```bash
    python manage.py runserver
    ```
<h6>this should have put the server at: http://127.0.0.1:8000/</h6>

</br>

<h3>Frontend</h3>
next up is to get the vite server going, for that youll need to open a new terminal, then:

1.  get on the frontend directory:
    
    ```bash
    cd frontend
    ```
2.  get the dependencies
    
    ```bash
    npm install
    ```
3.  run the frontend server
    
    ```bash
    npm run dev
    ```    
<h6>this should have open at: "http://localhost:3000/", where the page is usable</h6>
