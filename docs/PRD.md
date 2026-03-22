**PRODUCT REQUIREMENTS DOCUMENT**

**Real-Time Cat Emotion Recognition System**

CatSense AI --- Web Application & Deep Learning Platform

**Hybrid MobileNetV2 + BiLSTM + Attention Mechanism**

  -----------------------------------------------------------------------
  **Field**                           **Details**
  ----------------------------------- -----------------------------------
  Project Title                       Real-Time Cat Emotion Recognition
                                      Using Hybrid MobileNetV2 and BiLSTM
                                      with Attention Mechanism

  Version                             v1.0.0

  Document Type                       Product Requirements Document (PRD)

  Domain                              Artificial Intelligence & Data
                                      Science --- Deep Learning, Audio
                                      Signal Processing

  Institute                           Vidya Pratishthan\'s Kamalnayan
                                      Bajaj Institute of Engineering &
                                      Technology, Baramati

  Department                          AI & Data Science

  Academic Year                       2025--26

  Project Supervisor                  Mr. Pradip Ghorpade

  HOD                                 Dr. C. S. Kulkarni

  CEP Coordinator                     Dr. Y. D. Sinkar (SY-A&B)

  Prepared By                         Abhijeet Nalawade, Ajay Rathod,
                                      Jaydeep Sapatale, Ajay Sharma

  Status                              Draft --- Under Review

  Date                                Fri Mar 13 2026
  -----------------------------------------------------------------------

**Table of Contents**

1\. Executive Summary

2\. Project Overview

3\. Stakeholders

4\. Problem Statement

5\. Product Vision & Goals

6\. User Personas

7\. Functional Requirements

8\. Non-Functional Requirements

9\. System Architecture

10\. AI/ML Model Specifications

11\. Website & Frontend Specifications

12\. API & Backend Specifications

13\. Dataset Specifications

14\. Tech Stack

15\. Project Plan & Milestones

16\. Risk Register

17\. Success Metrics

18\. References

**1. Executive Summary**

CatSense AI is a real-time, web-based AI system designed to recognize
and classify cat emotions from audio vocalizations. The system bridges
the communication gap between humans and pet cats by intelligently
analyzing sound signals --- including meows, purrs, hisses, and growls
--- and mapping them to five emotional categories: Happy, Angry,
Fearful, Hungry, and Neutral.

The core AI model employs a hybrid deep learning architecture combining
MobileNetV2 (spatial feature extraction), BiLSTM (temporal sequential
modeling), and an Attention mechanism (weighted emotional focus). The
system is deployed via a modern, responsive web application allowing
users to upload or record audio in real time and receive instant emotion
predictions.

**2. Project Overview**

**2.1 Background**

Cats are among the most popular domestic pets globally. Despite their
vocal expressiveness, the emotional meaning behind cat vocalizations
remains opaque to most pet owners. Audio signal processing combined with
deep learning offers a scientifically grounded approach to decoding
these emotional signals automatically.

**2.2 Scope**

- Real-time audio input (microphone) and file upload support

- Preprocessing pipeline: noise removal, normalization, resampling

- Feature extraction: Log-Mel Spectrogram + MFCC

- Hybrid DL model: MobileNetV2 + BiLSTM + Attention

- 10-class emotion classification with confidence scores

- Web-based deployment with modern UI/UX

- REST API backend (Flask / FastAPI)

**3. Stakeholders**

  -----------------------------------------------------------------------
  **Stakeholder**         **Role**                **Interest**
  ----------------------- ----------------------- -----------------------
  Pet Owners              Primary End Users       Understand cat
                                                  emotions, improve pet
                                                  care

  Veterinarians           Secondary Users         Behavioral analysis,
                                                  clinical support

  Animal Researchers      Secondary Users         Data-driven animal
                                                  emotion studies

  Project Team            Developers / ML         Build and deploy the
                          Engineers               system

  Project Supervisor      Guide / Evaluator       Academic oversight and
                                                  quality control

  Institute (VPKBIET)       Academic Stakeholder    Project approval and
                                                  accreditation
  -----------------------------------------------------------------------

**4. Problem Statement**

Existing audio classification systems have the following limitations:

- Single-feature dependency: Most systems rely only on MFCC or
  spectrograms, missing multi-dimensional emotional cues.

- No temporal modeling: CNN-only architectures cannot capture
  time-dependent emotional patterns in audio.

- No attention focus: Systems treat all audio segments equally, ignoring
  emotionally salient moments.

- Not real-time deployable: Most research models are not integrated into
  production-ready applications.

- Limited cat-specific datasets: Training data for cat emotion is sparse
  and often imbalanced.

CatSense AI addresses all five limitations through a multi-feature,
attention-based hybrid architecture with real-time web deployment.

**5. Product Vision & Goals**

**5.1 Vision**

\"To be the most accurate, accessible, and real-time AI platform for
understanding cat emotions --- empowering pet owners, vets, and
researchers with actionable insights into animal communication.\"

**5.2 Product Goals**

1.  Achieve \>85% classification accuracy on 10-class cat emotion
    recognition.

2.  Process and return emotion predictions within 3 seconds of audio
    input.

3.  Deploy a user-friendly, responsive web application accessible on
    desktop and mobile.

4.  Support both real-time microphone recording and audio file upload.

5.  Provide confidence scores alongside emotion predictions.

**6. User Personas**

  -----------------------------------------------------------------------
  **Persona**       **Description**   **Goal**          **Pain Point**
  ----------------- ----------------- ----------------- -----------------
  Priya --- Pet     35-year-old cat   Know if her cat   Can\'t interpret
  Owner             owner,            is hungry or      cat sounds
                    non-technical     stressed          

  Dr. Ramesh ---    Veterinary        Analyze           No AI tool for
  Vet               professional      behavioral        audio behavior
                                      patterns in       
                                      clinic            

  Sanya ---         AI/ML student     Run experiments   No deployable
  Researcher        studying animal   on emotion data   real-time tool
                    cognition                           

  Kiran ---         Backend dev       Use REST API for  Needs clear API
  Developer         integrating the   mobile app        documentation
                    API                                 
  -----------------------------------------------------------------------

**7. Functional Requirements**

**7.1 Audio Input Module**

  -----------------------------------------------------------------------
  **ID**                  **Requirement**         **Priority**
  ----------------------- ----------------------- -----------------------
  FR-01                   System shall accept     High
                          audio files in .wav,    
                          .mp3, .ogg, .flac       
                          formats                 

  FR-02                   System shall support    High
                          real-time microphone    
                          recording via browser   

  FR-03                   System shall display    Medium
                          audio waveform          
                          visualization after     
                          upload/recording        

  FR-04                   Maximum audio file      High
                          size: 10 MB; Maximum    
                          duration: 30 seconds    

  FR-05                   System shall validate   High
                          audio format before     
                          processing              
  -----------------------------------------------------------------------

**7.2 Preprocessing Module**

  -----------------------------------------------------------------------
  **ID**                  **Requirement**         **Priority**
  ----------------------- ----------------------- -----------------------
  FR-06                   System shall apply      High
                          noise removal (spectral 
                          gating / noisereduce)   

  FR-07                   System shall normalize  High
                          audio amplitude to      
                          \[-1, 1\]               

  FR-08                   System shall resample   High
                          audio to 22,050 Hz      
                          standard                

  FR-09                   System shall pad or     High
                          trim audio clips to     
                          fixed 5-second segments 
  -----------------------------------------------------------------------

**7.3 Feature Extraction Module**

  -----------------------------------------------------------------------
  **ID**                  **Requirement**         **Priority**
  ----------------------- ----------------------- -----------------------
  FR-10                   System shall compute    High
                          Log-Mel Spectrogram     
                          (128 mel bins, hop      
                          length 512)             

  FR-11                   System shall compute 40 High
                          MFCC coefficients per   
                          audio frame             

  FR-12                   System shall apply      Medium
                          delta and delta-delta   
                          MFCCs for temporal      
                          context                 

  FR-13                   System shall fuse       High
                          Log-Mel + MFCC features 
                          into a unified tensor   
  -----------------------------------------------------------------------

**7.4 AI Model (Inference)**

  -----------------------------------------------------------------------
  **ID**                  **Requirement**         **Priority**
  ----------------------- ----------------------- -----------------------
  FR-14                   System shall run        High
                          MobileNetV2 spatial     
                          feature extraction on   
                          spectrogram input       

  FR-15                   System shall process    High
                          features through        
                          2-layer BiLSTM (128     
                          units each)             

  FR-16                   System shall apply      High
                          Bahdanau Attention over 
                          BiLSTM output           

  FR-17                   System shall produce    High
                          10-class Softmax        
                          probability output      

  FR-18                   System shall return     High
                          predicted emotion       
                          label + confidence      
                          scores                  

  FR-19                   Inference time shall be High
                          \< 3 seconds on         
                          standard hardware       
  -----------------------------------------------------------------------

**7.5 Web Interface**

  -----------------------------------------------------------------------
  **ID**                  **Requirement**         **Priority**
  ----------------------- ----------------------- -----------------------
  FR-20                   Website shall have a    High
                          fixed header with       
                          navigation: History,    
                          Features, Sign In,      
                          Register                

  FR-21                   Homepage shall display  High
                          full-screen hero        
                          section with shadowed   
                          cat image               

  FR-22                   Homepage shall display  High
                          AI model information    
                          below hero section      

  FR-23                   User shall be able to   High
                          upload audio or record  
                          via microphone on the   
                          main page               

  FR-24                   System shall display    High
                          emotion result with     
                          confidence bar charts   

  FR-25                   User history of past    Medium
                          predictions shall be    
                          stored and viewable     

  FR-26                   Register/Login flow     Medium
                          with session            
                          persistence             

  FR-27                   Website shall be fully  High
                          responsive (mobile,     
                          tablet, desktop)        
  -----------------------------------------------------------------------

**8. Non-Functional Requirements**

  -----------------------------------------------------------------------
  **Category**            **Requirement**         **Target**
  ----------------------- ----------------------- -----------------------
  Performance             API response time for   \< 3 seconds
                          prediction              

  Accuracy                Model classification    \> 85%
                          accuracy (10-class)     

  Availability            Web application uptime  \> 99%

  Scalability             Concurrent users        \> 50 simultaneous
                          supported               

  Security                User data encrypted in  HTTPS / TLS 1.3
                          transit                 

  Usability               First-time user task    \> 90% without help
                          completion              

  Accessibility           WCAG 2.1 AA compliance  Minimum Level AA

  Browser Support         Chrome, Firefox,        Latest 2 versions
                          Safari, Edge            

  Mobile                  Responsive on iOS and   Full feature parity
                          Android browsers        
  -----------------------------------------------------------------------

**9. System Architecture**

**9.1 Architecture Overview**

The system follows a 3-tier architecture: Frontend (React/HTML+CSS) →
Backend API (FastAPI/Flask) → ML Model (TensorFlow/Keras). The model is
served as a microservice and can be containerized with Docker for
scalable deployment.

**9.2 Data Flow**

6.  User uploads/records audio via web browser

7.  Audio is sent to backend via REST API (multipart/form-data POST)

8.  Backend applies preprocessing pipeline (noise removal, resampling,
    normalization)

9.  Feature extraction: Log-Mel Spectrogram + MFCC computation via
    Librosa

10. Feature fusion: tensors concatenated and reshaped for model input

11. MobileNetV2 extracts spatial features from spectrogram

12. BiLSTM processes temporal sequences bidirectionally

13. Attention layer weights emotionally significant segments

14. Dense + Softmax layer outputs emotion probabilities

15. JSON response returned to frontend with emotion label + confidence
    scores

**10. AI/ML Model Specifications**

  ------------------------------------------------------------------------
  **Component**           **Specification**       **Details**
  ----------------------- ----------------------- ------------------------
  Input Layer             Fused Feature Tensor    Shape: (batch,
                                                  time_steps, feature_dim)

  MobileNetV2             Spatial Encoder         Pretrained on ImageNet,
                                                  fine-tuned on
                                                  spectrograms

  BiLSTM Layer 1          Temporal Modeling       128 units,
                                                  return_sequences=True,
                                                  Dropout 0.3

  BiLSTM Layer 2          Temporal Refinement     64 units,
                                                  return_sequences=True,
                                                  Dropout 0.3

  Attention Layer         Bahdanau Attention      Softmax over time steps,
                                                  context vector
                                                  extraction

  Dense Layer 1           Classification Head     256 units, ReLU
                                                  activation,
                                                  BatchNormalization

  Dense Layer 2           Classification Head     128 units, ReLU
                                                  activation, Dropout 0.4

  Output Layer            Softmax Classifier      10 units: Angry, Defense, 
                                                  Fighting, Happy, HuntingMind, 
                                                  Mating, MotherCall, Paining, 
                                                  Resting, Warning

  Optimizer               Adam                    Learning rate 1e-4,
                                                  decay 1e-6

  Loss Function           Categorical             With label smoothing 0.1
                          Crossentropy            

  Batch Size              Training Config         32

  Epochs                  Training Config         100 with early stopping
                                                  (patience=10)

  Framework               TensorFlow 2.x / Keras  Python 3.10+
  ------------------------------------------------------------------------

**11. Website & Frontend Specifications**

**11.1 Page Layout Structure**

  -----------------------------------------------------------------------
  **Section**             **Component**           **Description**
  ----------------------- ----------------------- -----------------------
  Header                  Navigation Bar          Logo + App Name (left),
                                                  Toggle Menu
                                                  (hamburger), History,
                                                  Features, Sign In,
                                                  Register (right)

  Hero Section            Full-Screen Background  Shadowed/silhouette cat
                                                  image, overlay text
                                                  with tagline and CTA
                                                  button

  Feature Strip           Info Cards Row          3-4 key features of the
                                                  system displayed as
                                                  animated cards

  Demo Section            Audio Input Panel       Upload file / Record
                                                  button, waveform
                                                  display, Submit for
                                                  analysis

  Results Section         Emotion Output Card     Predicted emotion icon,
                                                  confidence bar chart,
                                                  description

  Model Info Section      Architecture Cards      MobileNetV2, BiLSTM,
                                                  Attention --- explained
                                                  visually

  About Section           Team & Project Info     Team members,
                                                  institution, supervisor

  Footer                  Links & Credits         Quick links, GitHub,
                                                  copyright
  -----------------------------------------------------------------------

**11.2 Design System**

  -----------------------------------------------------------------------
  **Token**               **Value**               **Usage**
  ----------------------- ----------------------- -----------------------
  Primary Color           #3A86FF                 Buttons, links, active
                                                  states

  Accent Color            #FF6B6B                 Highlights, alerts,
                                                  emphasis

  Background Dark         #0D1117                 Main background (dark
                                                  theme)

  Surface Dark            #161B22                 Cards, panels

  Text Primary            #E6EDF3                 Main text

  Text Secondary          #8B949E                 Captions, labels

  Font Display            Syne / Clash Display    Hero headings

  Font Body               DM Sans                 Body text, UI labels

  Border Radius           12px / 20px             Cards / Buttons

  Shadow                  0 8px 32px              Glow effect on cards
                          rgba(58,134,255,0.15)   
  -----------------------------------------------------------------------

**12. API & Backend Specifications**

  ----------------------------------------------------------------------------
  **Endpoint**         **Method**        **Description**   **Response**
  -------------------- ----------------- ----------------- -------------------
  POST /api/predict    POST              Upload audio file JSON: emotion,
                                         for emotion       confidence_scores
                                         prediction        

  POST /api/record     POST              Submit recorded   JSON: emotion,
                                         audio blob        confidence_scores

  GET /api/history     GET               Retrieve user\'s  JSON: list of past
                                         prediction        predictions
                                         history           

  POST                 POST              Register new user JSON: user_id,
  /api/auth/register                     account           token

  POST /api/auth/login POST              Login existing    JSON: token, user
                                         user              profile

  GET /api/health      GET               Health check      JSON: status OK
                                         endpoint          
  ----------------------------------------------------------------------------

**13. Dataset Specifications**

  ----------------------------------------------------------------------------
  **Dataset**       **Source**        **Content**       **Usage**
  ----------------- ----------------- ----------------- ----------------------
  CatMeows          Zenodo            400+ cat          Primary training data
                                      vocalization      
                                      recordings,       
                                      labeled by        
                                      condition         

  Google AudioSet   Google Research   Labeled audio     Augmentation
                                      clips including   
                                      cat sounds        

  Kaggle Animal     Kaggle            Mixed animal      Diversity/robustness
  Audio                               audio datasets    
  ----------------------------------------------------------------------------

**13.1 Data Preprocessing Pipeline**

16. Download and organize audio files by emotion label

17. Apply spectral gating noise reduction (noisereduce library)

18. Resample all audio to 22,050 Hz

19. Normalize amplitude to \[-1, 1\]

20. Pad or trim to 5-second fixed duration

21. Augment: pitch shift, time stretch, add Gaussian noise

22. Extract Log-Mel Spectrogram + MFCC features

23. Split: 70% train, 15% validation, 15% test

**14. Technology Stack**

  -----------------------------------------------------------------------
  **Layer**               **Technology**          **Version / Notes**
  ----------------------- ----------------------- -----------------------
  Deep Learning           TensorFlow / Keras      2.x, Python 3.10+

  Audio Processing        Librosa                 0.10.x

  Data Processing         NumPy, Pandas           Latest stable

  Model Visualization     Matplotlib, Seaborn     For training charts

  Backend API             FastAPI                 With Uvicorn ASGI
                                                  server

  Frontend                HTML5, CSS3, JavaScript Responsive design
                          / React                 

  Database                SQLite (dev) /          User data & history
                          PostgreSQL (prod)       

  Authentication          JWT (JSON Web Tokens)   Secure session
                                                  management

  Containerization        Docker                  For deployment

  Version Control         Git + GitHub            Source code management

  Hardware (Training)     GPU (CUDA-enabled)      NVIDIA preferred
  -----------------------------------------------------------------------

**15. Project Plan & Milestones**

  -----------------------------------------------------------------------
  **Phase**         **Milestone**     **Target Date**   **Status**
  ----------------- ----------------- ----------------- -----------------
  Phase 1           Literature Review 7 Jan 2026        Completed
                    & Dataset                           
                    Collection                          

  Phase 2           Data              16 Jan 2026       Completed
                    Preprocessing &                     
                    Feature                             
                    Extraction                          

  Phase 3           Model Development 21 Jan 2026       In Progress
                    & Training                          

  Phase 4           Evaluation &      4 Feb 2026        Planned
                    Optimization                        

  Phase 5           Web Application   11 Feb 2026       Planned
                    Development                         

  Phase 6           Integration &     18 Feb 2026       Planned
                    Deployment                          

  Phase 7           Final Write-up &  Mar 2026          Planned
                    Thesis Submission                   
  -----------------------------------------------------------------------

**16. Risk Register**

  -------------------------------------------------------------------------
  **Risk**            **Likelihood**    **Impact**        **Mitigation**
  ------------------- ----------------- ----------------- -----------------
  Insufficient        High              High              Augment data; use
  labeled cat audio                                       transfer learning
  data                                                    

  Model overfitting   Medium            High              Dropout, L2 reg,
  on small dataset                                        early stopping

  Real-time latency   Medium            Medium            Optimize model,
  \> 3 seconds                                            use TFLite or
                                                          ONNX

  Browser microphone  Low               Medium            Polyfill,
  API compatibility                                       fallback to file
                                                          upload

  Class imbalance in  High              Medium            Oversampling,
  training data                                           class weights in
                                                          loss

  Model               Medium            High              Robust noise
  misclassification                                       augmentation
  in noisy                                                during training
  environments                                            
  -------------------------------------------------------------------------

**17. Success Metrics**

  -----------------------------------------------------------------------
  **Metric**              **Target**              **Measurement Method**
  ----------------------- ----------------------- -----------------------
  Overall Accuracy        \>= 85%                 Test set evaluation

  Weighted F1-Score       \>= 0.83                sklearn classification
                                                  report

  Inference Time          \<= 3 seconds           API response time
                                                  benchmark

  User Task Completion    \>= 90%                 Usability testing
  Rate                                            

  System Uptime           \>= 99%                 Server monitoring

  User Satisfaction       \>= 4.0/5.0             Post-use survey
  (CSAT)                                          
  -----------------------------------------------------------------------

**18. References**

\[1\] Hershey et al., \"CNN Architectures for Large-Scale Audio
Classification,\" IEEE ICASSP, 2017.

\[2\] Howard et al., \"MobileNets: Efficient CNNs for Mobile Vision
Applications,\" arXiv:1704.04861, 2017.

\[3\] Sandler et al., \"MobileNetV2: Inverted Residuals and Linear
Bottlenecks,\" IEEE CVPR, 2018.

\[4\] Hochreiter & Schmidhuber, \"Long Short-Term Memory,\" Neural
Computation, Vol. 9, 1997.

\[5\] Bahdanau et al., \"Neural Machine Translation by Jointly Learning
to Align and Translate,\" ICLR, 2015.

\[6\] McFee et al., \"Librosa: Audio and Music Signal Analysis in
Python,\" SciPy, 2015.

\[7\] Gemmeke et al., \"Audio Set: An Ontology and Human-Labeled Dataset
for Audio Events,\" IEEE ICASSP, 2017.

\[8\] Schuller et al., \"The INTERSPEECH Computational Paralinguistics
Challenge,\" INTERSPEECH, 2013.
