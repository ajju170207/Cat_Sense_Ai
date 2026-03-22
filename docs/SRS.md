**SOFTWARE REQUIREMENTS SPECIFICATION**

**CatSense AI --- Cat Emotion Recognition System**

IEEE 830-Aligned SRS \| Version 1.0

  -----------------------------------------------------------------------
  **Attribute**                       **Value**
  ----------------------------------- -----------------------------------
  Document Type                       Software Requirements Specification
                                      (SRS)

  Standard                            IEEE 830 Aligned

  Project                             Real-Time Cat Emotion Recognition
                                      --- CatSense AI

  Version                             v1.0.0

  Institute                           VKBIET Baramati --- AI & DS

  Supervisor                          Mr. Pradip Ghorpade

  Team                                Nalawade, Rathod, Sapatale, Sharma

  Date                                Fri Mar 13 2026
  -----------------------------------------------------------------------

**1. Introduction**

**1.1 Purpose**

This Software Requirements Specification (SRS) document describes all
functional, non-functional, technical, and system requirements for
CatSense AI --- a real-time cat emotion recognition system utilizing a
hybrid MobileNetV2 + BiLSTM + Attention deep learning model, deployed as
a web application.

**1.2 Scope**

CatSense AI encompasses: (1) an audio preprocessing and feature
extraction pipeline, (2) a trained hybrid deep learning model, (3) a
RESTful API backend, and (4) a responsive web frontend. The system
accepts cat vocalization audio and outputs emotion classifications with
confidence scores.

**1.3 Definitions & Acronyms**

  -----------------------------------------------------------------------
  **Term**                            **Definition**
  ----------------------------------- -----------------------------------
  SRS                                 Software Requirements Specification

  ML                                  Machine Learning

  DL                                  Deep Learning

  CNN                                 Convolutional Neural Network

  BiLSTM                              Bidirectional Long Short-Term
                                      Memory

  MFCC                                Mel Frequency Cepstral Coefficients

  API                                 Application Programming Interface

  REST                                Representational State Transfer

  JWT                                 JSON Web Token

  WCAG                                Web Content Accessibility
                                      Guidelines

  ASGI                                Asynchronous Server Gateway
                                      Interface

  SR                                  Software Requirement (prefix for
                                      requirement IDs)
  -----------------------------------------------------------------------

**2. Overall Description**

**2.1 Product Perspective**

CatSense AI is a standalone web-based system. It interfaces with the
user\'s browser (frontend), a backend REST API server, and a trained
TensorFlow/Keras model. The system communicates with no external
third-party ML APIs --- all inference is performed locally on the
server.

**2.2 Product Functions --- Summary**

  -----------------------------------------------------------------------
  **Function ID**         **Function Name**       **Description**
  ----------------------- ----------------------- -----------------------
  F-01                    Audio Ingestion         Accept audio file
                                                  upload or microphone
                                                  recording

  F-02                    Preprocessing Pipeline  Denoise, normalize,
                                                  resample audio

  F-03                    Feature Extraction      Compute Log-Mel
                                                  Spectrogram + MFCC

  F-04                    Feature Fusion          Combine features into
                                                  unified model input
                                                  tensor

  F-05                    Model Inference         Run MobileNetV2 +
                                                  BiLSTM + Attention
                                                  forward pass

  F-06                    Emotion Classification  Output 10-class emotion
                                                  with confidence scores

  F-07                    Result Display          Render emotion, icon,
                                                  confidence bars in UI

  F-08                    User Authentication     Register, Login, JWT
                                                  session management

  F-09                    Prediction History      Store and retrieve past
                                                  predictions per user

  F-10                    Responsive Navigation   Full navigation header
                                                  with toggle on mobile
  -----------------------------------------------------------------------

**2.3 User Classes**

  -----------------------------------------------------------------------
  **User Class**          **Technical Level**     **Primary Need**
  ----------------------- ----------------------- -----------------------
  Casual Pet Owner        Non-technical           Simple audio upload,
                                                  instant emotion result

  Veterinarian            Semi-technical          Batch analysis,
                                                  exportable results

  AI Researcher           Highly technical        API access, raw
                                                  confidence scores,
                                                  model transparency

  System Administrator    Technical               Monitor server, manage
                                                  users, review logs
  -----------------------------------------------------------------------

**2.4 Constraints**

- Model must run inference in \<= 3 seconds on commodity hardware

- Audio input limited to 30 seconds maximum duration and 10 MB size

- System must be accessible without specialized hardware on client side

- Must comply with Indian IT Act 2000 and relevant data privacy
  guidelines

- Must support Chrome, Firefox, Safari, and Edge (latest 2 versions)

**2.5 Assumptions**

- Users have access to a microphone-enabled device or audio files of cat
  vocalizations

- The server environment includes at least 4GB RAM and Python 3.10+

- Training data is available from professional vocalization vaults, 
  expert collections, and general audio datasets.

- GPU is available for training but not required for inference
  deployment

**3. Functional Requirements**

**3.1 Audio Input Requirements**

  -------------------------------------------------------------------------
  **ID**            **Requirement**     **Priority**      **Acceptance
                                                          Criteria**
  ----------------- ------------------- ----------------- -----------------
  SR-F-001          System shall        Must Have         User can drop
                    provide a                             audio file; file
                    drag-and-drop file                    name and size
                    upload zone                           shown

  SR-F-002          System shall        Must Have         Record button
                    provide a                             activates mic;
                    browser-based                         audio captured in
                    microphone                            real time
                    recording interface                   

  SR-F-003          System shall        Should Have       WaveSurfer.js
                    display a waveform                    renders waveform
                    visualization of                      within 1 second
                    uploaded/recorded                     
                    audio                                 

  SR-F-004          System shall        Must Have         Invalid files
                    validate file                         show format error
                    format (.wav, .mp3,                   message
                    .ogg, .flac only)                     

  SR-F-005          System shall reject Must Have         Size/duration
                    files \> 10 MB or                     exceeded error
                    \> 30 seconds                         shown with limits
                    duration                              

  SR-F-006          User shall be able  Should Have       Play/pause
                    to preview audio                      control available
                    before analysis                       post-upload
  -------------------------------------------------------------------------

**3.2 Preprocessing Requirements**

  ---------------------------------------------------------------------------
  **ID**            **Requirement**    **Priority**      **Acceptance
                                                         Criteria**
  ----------------- ------------------ ----------------- --------------------
  SR-F-010          System shall apply Must Have         SNR improved by \>=
                    spectral noise                       10dB on noisy inputs
                    reduction using                      
                    noisereduce                          
                    library                              

  SR-F-011          System shall       Must Have         Peak amplitude = 1.0
                    normalize audio                      post-normalization
                    amplitude to \[-1,                   
                    1\] range                            

  SR-F-012          System shall       Must Have         Output sample rate
                    resample audio to                    == 22050
                    22,050 Hz using                      
                    librosa.resample                     

  SR-F-013          System shall pad   Must Have         All model inputs are
                    silence or trim                      fixed 5-second
                    audio to exactly                     length
                    5-second segments                    
  ---------------------------------------------------------------------------

**3.3 Feature Extraction Requirements**

  ----------------------------------------------------------------------------
  **ID**            **Requirement**        **Priority**      **Acceptance
                                                             Criteria**
  ----------------- ---------------------- ----------------- -----------------
  SR-F-020          System shall compute   Must Have         Output shape:
                    Log-Mel Spectrogram                      (128,
                    with 128 mel bins,                       time_frames)
                    FFT=2048, hop=512                        

  SR-F-021          System shall compute   Must Have         Output shape:
                    40 MFCC coefficients                     (40, time_frames)
                    per frame using                          
                    librosa.feature.mfcc                     

  SR-F-022          System shall compute   Should Have       Additional 80
                    delta and delta-delta                    features (40
                    MFCC for temporal                        delta + 40
                    context                                  delta-delta)

  SR-F-023          System shall           Must Have         Fused tensor
                    concatenate Log-Mel +                    shape ready for
                    MFCC features along                      model input
                    feature dimension                        
  ----------------------------------------------------------------------------

**3.4 Model Inference Requirements**

  -----------------------------------------------------------------------
  **ID**            **Requirement**   **Priority**      **Acceptance
                                                        Criteria**
  ----------------- ----------------- ----------------- -----------------
  SR-F-030          MobileNetV2 shall Must Have         Spectrogram
                    process                             converted to 3ch
                    spectrogram as a                    tensor, passed
                    3-channel (RGB)                     through
                    image                               MobileNetV2

  SR-F-031          BiLSTM shall      Must Have         Output: hidden
                    process temporal                    states over all
                    feature sequence                    time steps
                    (2 layers, 128+64                   
                    units)                              

  SR-F-032          Attention         Must Have         Attention weights
                    mechanism shall                     sum to 1.0,
                    produce a context                   context vector
                    vector over                         computed
                    BiLSTM outputs                      

  SR-F-033          Final Dense       Must Have         Output 10-class Softmax 
                    layers shall                        probabilities for all 
                    output 10-class                     target emotions
                    Softmax                             
                    probabilities                       

  SR-F-034          Inference time    Must Have         Benchmarked at \<
                    shall be \<= 3                      3000ms on test
                    seconds from                        server
                    audio receipt to                    
                    result                              

  SR-F-035          Model shall       Must Have         All 10
                    return confidence                   probabilities sum
                    score for each                      to 1.0
                    emotion class                       
  -----------------------------------------------------------------------

**3.5 Web Interface Requirements**

  --------------------------------------------------------------------------
  **ID**            **Requirement**     **Priority**      **Acceptance
                                                          Criteria**
  ----------------- ------------------- ----------------- ------------------
  SR-F-040          Header shall be     Must Have         Header visible at
                    fixed, showing                        all scroll
                    toggle (hamburger),                   positions
                    logo, app name on                     
                    left                                  

  SR-F-041          Header right zone   Must Have         All nav items
                    shall show:                           visible and
                    History, Features,                    functional
                    Sign In, Register                     

  SR-F-042          Mobile hamburger    Must Have         Drawer animates in
                    shall open a                          from left on
                    slide-in navigation                   mobile \< 768px
                    drawer                                

  SR-F-043          Hero section shall  Must Have         Full viewport
                    display full-screen                   height, image with
                    cat                                   gradient overlay
                    shadow/silhouette                     
                    image                                 

  SR-F-044          Hero text overlay   Must Have         Readable on all
                    shall display                         screen sizes,
                    headline,                             sufficient
                    subheadline, and                      contrast
                    CTA button                            

  SR-F-045          Model architecture  Should Have       3-4 cards with
                    cards shall appear                    scroll-triggered
                    below hero with                       reveal animation
                    animations                            

  SR-F-046          Emotion result      Must Have         Visible within 3
                    shall display icon,                   seconds of API
                    label, confidence                     response
                    score and bars                        

  SR-F-047          Website shall be    Must Have         No horizontal
                    fully responsive                      scroll, all
                    across mobile,                        elements visible
                    tablet, desktop                       at 375px+

  SR-F-048          History page shall  Should Have       Predictions listed
                    show past 20                          in reverse
                    predictions with                      chronological
                    timestamps                            order
  --------------------------------------------------------------------------

**3.6 Authentication Requirements**

  -----------------------------------------------------------------------
  **ID**            **Requirement**   **Priority**      **Acceptance
                                                        Criteria**
  ----------------- ----------------- ----------------- -----------------
  SR-F-050          System shall      Should Have       User created in
                    provide user                        DB, confirmation
                    registration with                   message shown
                    email + password                    

  SR-F-051          System shall      Should Have       Token issued on
                    authenticate                        login, validated
                    users via JWT                       on protected
                    token (24hr                         routes
                    expiry)                             

  SR-F-052          Unregistered      Must Have         Guest users get
                    users shall be                      prediction, no
                    able to use the                     history saved
                    system with                         
                    limited history                     

  SR-F-053          Passwords shall   Must Have         plaintext
                    be hashed using                     passwords never
                    bcrypt before                       stored
                    storage                             
  -----------------------------------------------------------------------

**4. Non-Functional Requirements**

**4.1 Performance Requirements**

  -----------------------------------------------------------------------
  **ID**            **Requirement**   **Target**        **Priority**
  ----------------- ----------------- ----------------- -----------------
  SR-NF-001         API Prediction    \< 3 seconds      Must Have
                    Response Time     (95th percentile) 

  SR-NF-002         Page Initial Load \< 2 seconds on   Should Have
                    Time              3G connection     

  SR-NF-003         Concurrent Users  \>= 50            Should Have
                    Supported         simultaneous      
                                      sessions          

  SR-NF-004         Model Accuracy    \>= 85% on        Must Have
                    (10-class)        held-out test set 

  SR-NF-005         Weighted F1-Score \>= 0.83          Must Have
  -----------------------------------------------------------------------

**4.2 Security Requirements**

  -----------------------------------------------------------------------
  **ID**                  **Requirement**         **Priority**
  ----------------------- ----------------------- -----------------------
  SR-NF-010               All HTTP traffic shall  Must Have
                          be served over HTTPS    
                          (TLS 1.3)               

  SR-NF-011               API shall validate all  Must Have
                          input (file type, size, 
                          duration) before        
                          processing              

  SR-NF-012               Uploaded audio files    Must Have
                          shall be deleted from   
                          server after processing 

  SR-NF-013               JWT tokens shall expire Should Have
                          after 24 hours          

  SR-NF-014               SQL injection           Must Have
                          protection via          
                          parameterized queries / 
                          ORM                     

  SR-NF-015               CORS configuration      Should Have
                          shall restrict origins  
                          to approved domains     
  -----------------------------------------------------------------------

**4.3 Usability Requirements**

  -----------------------------------------------------------------------
  **ID**                  **Requirement**         **Target**
  ----------------------- ----------------------- -----------------------
  SR-NF-020               System shall comply     All interactive
                          with WCAG 2.1 Level AA  elements

  SR-NF-021               Color contrast ratio    \>= 4.5:1
                          for text on background  

  SR-NF-022               All interactive         Tab order logical
                          elements shall be       
                          keyboard navigable      

  SR-NF-023               Error messages shall be User can self-correct
                          descriptive and         
                          actionable              

  SR-NF-024               New user task           \>= 90%
                          completion without      
                          documentation           
  -----------------------------------------------------------------------

**4.4 Reliability & Availability**

  -----------------------------------------------------------------------
  **ID**                  **Requirement**         **Target**
  ----------------------- ----------------------- -----------------------
  SR-NF-030               System uptime           \>= 99%
                          (scheduled downtime     
                          excluded)               

  SR-NF-031               Model shall return      0 silent failures
                          valid output or a       
                          graceful error for all  
                          inputs                  

  SR-NF-032               All API errors shall    100% of error cases
                          return structured JSON  
                          with status code +      
                          message                 
  -----------------------------------------------------------------------

**4.5 Maintainability**

  -----------------------------------------------------------------------
  **ID**                              **Requirement**
  ----------------------------------- -----------------------------------
  SR-NF-040                           All code shall follow PEP 8
                                      (Python) and ESLint standard
                                      (JavaScript)

  SR-NF-041                           All API endpoints shall be
                                      documented via OpenAPI/Swagger

  SR-NF-042                           Model training code shall be
                                      reproducible with a seed parameter

  SR-NF-043                           Git commit messages shall follow
                                      Conventional Commits specification
  -----------------------------------------------------------------------

**5. System Architecture Requirements**

  -----------------------------------------------------------------------
  **Layer**               **Technology**          **Requirement**
  ----------------------- ----------------------- -----------------------
  Frontend                HTML5/CSS3/JS or React  Responsive, WCAG 2.1 AA
                                                  compliant, \< 2s load
                                                  time

  API Gateway             FastAPI + Uvicorn       REST endpoints, JSON,
                                                  OpenAPI docs, JWT auth

  Preprocessing           Librosa + NumPy         Noise removal,
                                                  resampling, feature
                                                  extraction

  ML Inference            TensorFlow 2.x / Keras  Model loaded at
                                                  startup, \< 3s
                                                  inference

  Database                SQLite (dev) /          User accounts,
                          PostgreSQL (prod)       prediction history

  File Storage            Local temp              Audio files deleted
                          (auto-delete)           post-inference

  Containerization        Docker + docker-compose Reproducible deployment

  Hosting                 Cloud VM / On-premise   HTTPS, domain, SSL
                          server                  certificate
  -----------------------------------------------------------------------

**6. External Interface Requirements**

**6.1 User Interfaces**

- Web browser: Chrome, Firefox, Safari, Edge (latest 2 versions)

- Mobile browser: iOS Safari, Android Chrome

- No native mobile app required in v1.0

**6.2 Hardware Interfaces**

- Microphone: HTML5 getUserMedia API for browser-based audio capture

- Server: Minimum 4GB RAM, Python 3.10+, 10GB storage

- GPU (training only): CUDA-compatible NVIDIA GPU recommended

**6.3 Software Interfaces**

  -----------------------------------------------------------------------
  **Interface**           **Version**             **Purpose**
  ----------------------- ----------------------- -----------------------
  TensorFlow              2.x                     Model training and
                                                  inference

  Librosa                 0.10.x                  Audio feature
                                                  extraction

  FastAPI                 0.100+                  REST API backend

  SQLAlchemy              2.x                     Database ORM

  WaveSurfer.js           7.x                     Audio waveform
                                                  visualization in
                                                  frontend

  Chart.js                4.x                     Confidence score bar
                                                  charts

  PyJWT                   2.x                     JWT authentication

  noisereduce             2.x                     Audio noise reduction
  -----------------------------------------------------------------------

**7. Quality Attributes Summary**

  -----------------------------------------------------------------------
  **Quality Attribute**   **Measure**             **Target**
  ----------------------- ----------------------- -----------------------
  Accuracy                10-class emotion        \>= 85%
                          classification accuracy 

  Precision (weighted)    Precision across all 5  \>= 0.84
                          classes                 

  Recall (weighted)       Recall across all 5     \>= 0.83
                          classes                 

  F1-Score (weighted)     Harmonic mean of        \>= 0.83
                          precision and recall    

  Latency                 End-to-end prediction   \< 3 seconds
                          time                    

  Uptime                  System availability     \>= 99%

  Usability               SUS (System Usability   \>= 75 / 100
                          Scale)                  

  Accessibility           WCAG standard           Level AA

  Security                OWASP Top 10 coverage   All critical covered
  -----------------------------------------------------------------------
