import os
from tensorflow import keras
import src.config as config

@keras.utils.register_keras_serializable()
class AttentionLayer(keras.layers.Layer):
    """
    Bahdanau-style attention mechanism for contextual weighting of temporal features.
    """
    def __init__(self, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(name="att_weight", shape=(input_shape[-1], input_shape[-1]),
                               initializer="normal")
        self.b = self.add_weight(name="att_bias", shape=(input_shape[-1],),
                               initializer="zeros")
        self.u = self.add_weight(name="att_u", shape=(input_shape[-1],),
                               initializer="normal")
        super(AttentionLayer, self).build(input_shape)

    def call(self, x):
        # Bahdanau-style scoring
        e = keras.backend.tanh(keras.backend.dot(x, self.W) + self.b)
        # Weighting by context vector u
        a = keras.backend.softmax(keras.backend.sum(e * self.u, axis=-1, keepdims=True), axis=1)
        output = x * a
        return keras.backend.sum(output, axis=1)

    def get_config(self):
        return super(AttentionLayer, self).get_config()

def build_professionally_refined_model(n_classes=10):
    """
    The main hybrid architecture: MobileNetV2 + BiLSTM + Attention.
    """
    base = keras.applications.MobileNetV2(
        input_shape=(config.IMG_SIZE[0], config.IMG_SIZE[1], 3),
        include_top=False,
        weights='imagenet'
    )
    base.trainable = False
    
    x = base.output
    # Reshape for LSTM: (None, H, W, C) -> (None, H*W, C) or similar
    x = keras.layers.Reshape((-1, x.shape[-1]))(x)
    x = keras.layers.Bidirectional(keras.layers.LSTM(128, return_sequences=True))(x)
    x = AttentionLayer(name="attention")(x)
    
    x = keras.layers.Dense(256, activation='relu')(x)
    x = keras.layers.Dropout(0.4)(x)
    outputs = keras.layers.Dense(n_classes, activation='softmax')(x)
    
    model = keras.Model(base.input, outputs)
    model.compile(
        optimizer=keras.optimizers.Adam(config.LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model


def build_simple_cnn(n_classes=10):
    """
    Alternative lightweight CNN for rapid prototyping.
    """
    model = keras.Sequential([
        keras.layers.Input(shape=(config.IMG_SIZE[0], config.IMG_SIZE[1], 3)),
        keras.layers.Conv2D(32, (3, 3), activation='relu'),
        keras.layers.MaxPooling2D(2, 2),
        keras.layers.Conv2D(64, (3, 3), activation='relu'),
        keras.layers.MaxPooling2D(2, 2),
        keras.layers.GlobalAveragePooling2D(),
        keras.layers.Dense(128, activation='relu'),
        keras.layers.Dense(n_classes, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model
