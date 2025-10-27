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
4.  Start the Django development server:
    ```bash
    python manage.py runserver
    ```

     <h6>got tired of searching how to do it on non windows systems</h6>