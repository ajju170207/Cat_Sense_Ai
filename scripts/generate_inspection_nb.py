import os
import json
import base64

def create_notebook(name, keras_path):
    nb = {
        "cells": [
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    f"# Model Inspection: {name}\n",
                    "\n",
                    f"This notebook loads and inspects the model stored at `{keras_path}`."
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "import os\n",
                    "import tensorflow as tf\n",
                    "from tensorflow import keras\n",
                    "import numpy as np\n",
                    "import matplotlib.pyplot as plt\n",
                    "\n",
                    "# If the model uses custom layers (like AttentionLayer), we need to define/import them.\n",
                    "try:\n",
                    "    # Attempt to import from the project structure if available\n",
                    "    import sys\n",
                    "    sys.path.append('..')\n",
                    "    from server.src.models import AttentionLayer\n",
                    "    custom_objects = {'AttentionLayer': AttentionLayer}\n",
                    "except:\n",
                    "    custom_objects = {}\n",
                    "    print(\"Custom objects may be missing if the model requires them.\")"
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    f"MODEL_PATH = '{keras_path}'\n",
                    "if os.path.exists(MODEL_PATH):\n",
                    "    model = keras.models.load_model(MODEL_PATH, custom_objects=custom_objects)\n",
                    "    print(\"Model loaded successfully!\")\n",
                    "    model.summary()\n",
                    "else:\n",
                    "    print(f\"Model NOT FOUND at {MODEL_PATH}\")"
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# Inspecting Model Configuration\n",
                    "print(\"---- Layer Config ----\")\n",
                    "for layer in model.layers:\n",
                    "    print(f\"{layer.name}: {layer.get_config().get('activation', 'N/A')}\")"
                ]
            }
        ],
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {
                    "name": "ipython",
                    "version": 3
                },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.11"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    
    with open(f"model_insights/{name}_Inspection.ipynb", "w") as f:
        json.dump(nb, f, indent=1)

if __name__ == "__main__":
    os.makedirs("model_insights", exist_ok=True)
    weights_dir = "/Users/ajay/project/models/weights"
    keras_files = [f for f in os.listdir(weights_dir) if f.endswith(".keras")]
    
    for f in keras_files:
        name = f.replace(".keras", "")
        create_notebook(name, os.path.join(weights_dir, f))
    
    print(f"Created {len(keras_files)} inspection notebooks in model_insights/")
