import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.callbacks import EarlyStopping

# 1. Load dataset
df = pd.read_csv("diabetes_dataset.csv")
print(df.head())
print(df.columns)

# 2. Select useful columns
df = df[['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'Age', 'Outcome']]

# 3. Drop rows with missing values
df = df.dropna()
print("Dataset shape after cleaning:", df.shape)

# 4. Split features & target
X = df[['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'Age']]
y = df['Outcome']

# 5. Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Standardize data
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

import joblib

# Save the fitted scaler
joblib.dump(scaler, "C:\\Users\\hriti\\OneDrive\\Desktop\\backend\\scaler.save")


# 7. Build Neural Network
nn_model = keras.Sequential([
    keras.layers.Dense(48, activation='relu', input_shape=(X_train.shape[1],)),
    keras.layers.Dropout(0.2),  # slightly higher dropout
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(1, activation='sigmoid')  # sigmoid for binary classification
])

# 8. Compile model
nn_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# 9. Add EarlyStopping
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

# 10. Train model
history = nn_model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=16,
    validation_split=0.2,
    callbacks=[early_stop],
    verbose=1
)

# 11. Evaluate on test data
nn_eval = nn_model.evaluate(X_test, y_test, verbose=0)
print("Final Test Loss & Accuracy:", nn_eval)

# 12. Example prediction
sample = scaler.transform([[120, 70, 20, 80, 25, 35]])
prediction = nn_model.predict(sample)
print("Predicted Probability of Diabetes:", prediction[0][0]*100,"%")
print("Predicted Class:", 1 if prediction[0][0] > 0.5 else 0)


# After training
nn_model.save("diabetes_model.keras")  # Keras V3 format

