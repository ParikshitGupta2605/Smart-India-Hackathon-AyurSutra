import tkinter as tk
from tkinter import filedialog
from tkinter import *
from tensorflow.keras.models import load_model
from PIL import Image, ImageTk
import numpy as np
import os
import traceback

# --- GUI setup ---
top = tk.Tk()
top.geometry('800x600')
top.title('Herb Classifier')
top.configure(background='#CDCDCD')

label1 = Label(top, background='#CDCDCD', font=('arial',15,'bold'))
sign_image = Label(top)


COMMON_CLASS_NAMES = [
    "Star Fruit", 
    "Palm Lily", 
    "Paederia", 
    "Betel", 
    "Wild Betel", 
    "Tea Plant", 
    "Brazilian Tea"
]


IMG_SIZE = (150, 150)

# --- Load model from backend ---
MODEL_PATH = "7herbs.keras"   
model = None

try:
    model = load_model(MODEL_PATH)
    print(f" Model loaded from {MODEL_PATH}")
except Exception:
    traceback.print_exc()
    model = None
    print(" Failed to load model")


def Detect(file_path):
    global model

    if model is None:
        label1.configure(foreground="#011638", text="Model not loaded")
        return

    try:
        # Load and preprocess image
        img = Image.open(file_path).convert("RGB")
        img = img.resize(IMG_SIZE)
        img_array = np.array(img).astype("float32") / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # shape (1, h, w, 3)

        
        preds = model.predict(img_array)
        pred = COMMON_CLASS_NAMES[int(np.argmax(preds))]

        print(" Predicted Herb:", pred)
        label1.configure(foreground="#011638", text=pred)

    except Exception as e:
        traceback.print_exc()
        label1.configure(foreground="#011638", text=" Error: " + str(e))


def show_Detect_button(file_path):
    detect_b = Button(top, text="Detect Herb", command=lambda: Detect(file_path), padx=10, pady=5)
    detect_b.configure(background="#364156", foreground='white', font=('arial',10,'bold'))
    detect_b.place(relx=0.79, rely=0.46)


def upload_image():
    try:
        file_path = filedialog.askopenfilename(filetypes=[("Image files","*.jpg *.jpeg *.png *.bmp"),("All files","*.*")])
        if not file_path:
            return
        uploaded = Image.open(file_path)
        max_w = int(top.winfo_width()/2.25)
        max_h = int(top.winfo_height()/2.25)
        uploaded.thumbnail((max_w, max_h))
        im = ImageTk.PhotoImage(uploaded)

        sign_image.configure(image=im)
        sign_image.image = im
        label1.configure(text='')
        show_Detect_button(file_path)
    except Exception:
        traceback.print_exc()
        label1.configure(foreground="#011638", text=" Unable to open image")


# --- Buttons ---
upload = Button(top, text="Upload Image", command=upload_image, padx=10, pady=5)
upload.configure(background="#364156", foreground='white', font=('arial',20,'bold'))
upload.pack(side='bottom', pady=10)

sign_image.pack(side='bottom', expand=True)
label1.pack(side='bottom', expand=True)
heading = Label(top, text='Herb Classifier', pady=20, font=('arial',25,'bold'))
heading.configure(background='#CDCDCD', foreground="#364156")
heading.pack()

top.mainloop()

