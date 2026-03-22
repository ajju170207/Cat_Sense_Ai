**UI/UX DESIGN DOCUMENT**

**CatSense AI --- Real-Time Cat Emotion Recognition**

Web Application Design Specification

**1. Design Philosophy**

CatSense AI adopts a Dark Futuristic / Bioluminescent aesthetic --- a
premium dark-mode interface with glowing accent elements, fluid
animations, and scientific precision. The design language communicates
intelligence, trust, and approachability simultaneously.

**1.1 Design Principles**

  -----------------------------------------------------------------------
  **Principle**                       **Description**
  ----------------------------------- -----------------------------------
  Intelligence-First                  Every UI element reinforces AI
                                      precision. Data visualizations,
                                      confidence bars, and real-time
                                      feedback signal technological
                                      sophistication.

  Approachable Complexity             Complex ML outputs are wrapped in
                                      friendly, cat-themed UI metaphors.
                                      Emotion icons, warm copy, and
                                      animations lower the barrier for
                                      non-technical users.

  Progressive Disclosure              Simple for casual users; deep for
                                      experts. Advanced model stats are
                                      accessible but not prominently
                                      displayed.

  Motion-Led UX                       Micro-animations communicate state
                                      changes. Waveform animations,
                                      loading pulses, and result reveals
                                      create delight.

  Accessibility First                 WCAG 2.1 AA compliance, keyboard
                                      navigation, screen reader support,
                                      sufficient contrast ratios.
  -----------------------------------------------------------------------

**2. Design System**

**2.1 Color Palette**

  --------------------------------------------------------------------------
  **Token Name**             **Hex Value**           **Usage**
  -------------------------- ----------------------- -----------------------
  \--color-bg-primary        #0D1117                 Main page background

  \--color-bg-surface        #161B22                 Cards, panels, sidebars

  \--color-bg-elevated       #21262D                 Hover states, dropdown

  \--color-brand-primary     #3A86FF                 CTAs, links, active
                                                     states

  \--color-brand-secondary   #6C63FF                 Gradients, accents

  \--color-accent-coral      #FF6B6B                 Alerts, emotion
                                                     'Angry'

  \--color-accent-teal       #06D6A0                 Success, emotion
                                                     'Happy'

  \--color-accent-amber      #FFB347                 Emotion 'Hungry'

  \--color-accent-purple     #A78BFA                 Emotion 'Fearful'

  \--color-accent-gray       #8B949E                 Emotion 'Neutral'

  \--color-text-primary      #E6EDF3                 Primary body text

  \--color-text-secondary    #8B949E                 Labels, captions

  \--color-border            #30363D                 Card borders, dividers

  \--color-glow              rgba(58,134,255,0.15)   Glow shadows on cards
  --------------------------------------------------------------------------

**2.2 Emotion Color Mapping**

| Emotion | Color | Icon | UI Representation |
|---------|-------|------|-------------------|
| Happy | #06D6A0 (Teal) | 🐱 | Bouncing/Green Glow |
| Angry | #FF6B6B (Coral) | 😾 | Pulsing/Red Glow |
| Defense | #FFB347 (Amber) | 🛡️ | Steady/Amber Glow |
| Fighting | #FF4BD3 (Pink) | 🥊 | Flash/Pink Glow |
| HuntingMind | #A78BFA (Purple) | 🎯 | Focus/Purple Glow |
| Mating | #FF9A8B (Peach) | 💖 | Heart/Peach Glow |
| MotherCall | #60A5FA (Blue) | 🤱 | Wave/Blue Glow |
| Paining | #F87171 (Red) | 🩹 | Strobe/Red Glow |
| Resting | #94A3B8 (Slate) | 😴 | Static/Slate Glow |
| Warning | #FBBF24 (Gold) | ⚠️ | Pulse/Gold Glow |

**2.3 Typography Scale**

  --------------------------------------------------------------------------------
  **Token**            **Font**       **Size**       **Weight**     **Usage**
  -------------------- -------------- -------------- -------------- --------------
  \--font-display      Syne           56--80px       800            Hero headlines

  \--font-heading-xl   Syne           36--48px       700            Section
                                                                    headings

  \--font-heading-lg   Syne           24--32px       600            Card titles

  \--font-body-lg      DM Sans        18px           400            Feature
                                                                    descriptions

  \--font-body-md      DM Sans        16px           400            UI body text

  \--font-body-sm      DM Sans        14px           400            Labels,
                                                                    captions

  \--font-mono         JetBrains Mono 14px           400            Code,
                                                                    confidence
                                                                    scores
  --------------------------------------------------------------------------------

**2.4 Spacing Scale**

  -----------------------------------------------------------------------
  **Token**               **Value**               **Usage**
  ----------------------- ----------------------- -----------------------
  \--space-xs             4px                     Icon padding, small
                                                  gaps

  \--space-sm             8px                     Component internal
                                                  spacing

  \--space-md             16px                    Card padding

  \--space-lg             24px                    Section internal
                                                  spacing

  \--space-xl             48px                    Section vertical
                                                  padding

  \--space-2xl            80px                    Hero section padding

  \--space-3xl            120px                   Large section gaps
  -----------------------------------------------------------------------

**2.5 Component Tokens**

  -----------------------------------------------------------------------
  **Component**                       **Spec**
  ----------------------------------- -----------------------------------
  Border Radius (Card)                16px

  Border Radius (Button)              8px / pill: 9999px

  Border Radius (Input)               8px

  Shadow (Card)                       0 8px 32px rgba(58,134,255,0.12), 0
                                      1px 0 rgba(255,255,255,0.05) inset

  Shadow (Glow on Hover)              0 0 40px rgba(58,134,255,0.25)

  Transition Duration                 200ms (micro), 400ms (reveal),
                                      600ms (page)

  Transition Easing                   cubic-bezier(0.34, 1.56, 0.64, 1)
                                      for spring animations
  -----------------------------------------------------------------------

**3. Page Layout Specifications**

**3.1 Navigation Header**

Fixed position header (z-index: 1000). Height: 72px. Backdrop blur:
12px. Background: rgba(13,17,23,0.85).

  -----------------------------------------------------------------------
  **Zone**                **Elements**            **Alignment**
  ----------------------- ----------------------- -----------------------
  Left Zone               Hamburger menu toggle   flex-start
                          (☰), Logo/Cat icon,     
                          'CatSense AI'         
                          wordmark                

  Right Zone              History, Features, Sign flex-end
                          In (ghost button),      
                          Register (primary CTA   
                          button)                 

  Mobile                  Logo centered,          Responsive
                          hamburger left opens    
                          slide-in drawer         
  -----------------------------------------------------------------------

**3.2 Hero Section**

Full-viewport-height section (100vh). Background: full-bleed cat
silhouette image with CSS overlay.

  -----------------------------------------------------------------------
  **Layer**               **Style**               **Content**
  ----------------------- ----------------------- -----------------------
  Background              Object-fit: cover, 100% Cat silhouette/shadow
                          width, parallax scroll  photography

  Overlay                 linear-gradient(to      Darkening effect for
                          bottom,                 text contrast
                          rgba(13,17,23,0.6) 0%,  
                          rgba(13,17,23,0.9)      
                          100%)                   

  Content                 Centered, max-width     Headline, subheadline,
                          800px                   CTA button

  Headline                Font: Syne 72px 800,    'Understand Your
                          color: #E6EDF3          Cat\'s Emotions'

  Subheadline             Font: DM Sans 20px,     AI-powered real-time
                          color: #8B949E          emotion recognition
                                                  from cat vocalizations

  CTA Button              Primary blue, 56px      Analyze Cat Audio →
                          height, pill shape,     
                          arrow icon              

  Scroll Indicator        Animated chevron,       Visual scroll
                          position: absolute      affordance
                          bottom 32px             
  -----------------------------------------------------------------------

**3.3 Demo / Input Section**

Below hero. Background: --color-bg-primary. Two-column layout on
desktop, single-column on mobile.

  -----------------------------------------------------------------------
  **Component**                       **Specification**
  ----------------------------------- -----------------------------------
  Upload Zone                         Dashed border card, drag-and-drop,
                                      click to browse. Accepts .wav,
                                      .mp3, .ogg, .flac

  Record Button                       Circular red microphone button,
                                      pulse animation when recording,
                                      timer display

  Waveform Display                    WaveSurfer.js visualization, shows
                                      audio timeline post-upload

  Submit Button                       Full-width primary CTA 'Analyze
                                      Emotion', disabled until audio
                                      loaded

  Progress State                      Linear progress bar with
                                      percentage, loading skeleton for
                                      result card
  -----------------------------------------------------------------------

**3.4 Results Section**

Appears below demo section after prediction. Animated slide-up entry.
Contains:

- Large emotion icon with colored glow (emotion-specific color)

- Emotion label in 48px Syne font

- Confidence percentage badge

- Horizontal bar chart showing all 10 emotion probabilities

- Contextual description of detected emotion behavior

- 'Analyze Another' button

**3.5 Model Architecture Section**

3-column card grid. Dark glassmorphism cards with icon, title,
description.

  -------------------------------------------------------------------------
  **Card**          **Icon**          **Title**         **Description**
  ----------------- ----------------- ----------------- -------------------
  Card 1            🔍                MobileNetV2       Lightweight spatial
                                                         CNN extracting
                                                         spectrogram
                                                         patterns with
                                                         depthwise separable
                                                         convolutions

  Card 2            ⏱                 BiLSTM            Bidirectional
                                                         temporal modeling
                                                         capturing
                                                         sequential
                                                         emotional patterns
                                                         in both time
                                                         directions

  Card 3            🎯                Attention         Bahdanau attention
                                                         weights
                                                         highlighting the
                                                         most emotionally
                                                         significant audio
                                                         segments

  Card 4            📊                Multi-Feature     Fused Log-Mel
                                                         Spectrogram + MFCC
                                                         features for rich
                                                         multi-dimensional
                                                         audio
                                                         representation
  -------------------------------------------------------------------------

**4. Component Library**

**4.1 Button Variants**

  -----------------------------------------------------------------------
  **Variant**             **Style**               **Usage**
  ----------------------- ----------------------- -----------------------
  Primary                 bg: --brand-primary,   Main CTAs
                          text: white,            
                          border-radius: 8px,     
                          py:12px px:24px         

  Ghost                   bg: transparent,        Secondary actions
                          border: 1px solid       
                          --brand-primary, text: 
                          --brand-primary        

  Danger                  bg: --accent-coral,    Destructive actions
                          text: white             

  Icon Only               Circular, 40x40px, bg:  Toolbar actions
                          --bg-surface           

  Pill CTA                border-radius: 9999px,  Hero section CTA
                          large padding, glow     
                          shadow                  
  -----------------------------------------------------------------------

**4.2 Card Variants**

  -----------------------------------------------------------------------
  **Variant**                         **Style**
  ----------------------------------- -----------------------------------
  Feature Card                        bg: --bg-surface, border: 1px
                                      solid --border, border-radius:
                                      16px, p: 24px, hover: glow shadow

  Result Card                         bg: --bg-surface, left border: 4px
                                      solid emotion-color, animated entry

  Stat Card                           Compact, centered content, large
                                      number display

  Upload Zone                         Dashed border (2px dashed
                                      --brand-primary), bg:
                                      rgba(58,134,255,0.05)
  -----------------------------------------------------------------------

**5. Interaction & Animation Design**

  --------------------------------------------------------------------------
  **Interaction**   **Animation**       **Duration**      **Trigger**
  ----------------- ------------------- ----------------- ------------------
  Page load         Staggered fade-in + 600ms, stagger    DOMContentLoaded
                    translateY(-20px)   150ms             
                    for hero elements                     

  Card hover        translateY(-4px),   200ms ease        mouseenter
                    box-shadow glow                       

  Button click      Scale 0.97 press    100ms             mousedown
                    effect, ripple on                     
                    primary                               

  Audio upload      Progress ring fill  Async             File drop/select
                    animation                             

  Recording         Red pulse ring on   Loop              Record active
                    mic button, timer                     
                    increment                             

  Prediction        Skeleton shimmer on 800ms loop        API call pending
  loading           result card                           

  Emotion reveal    Slide up + fade in, 600ms spring      API response
                    icon bounce, bar                      
                    chart fill                            

  Navigation hover  Underline slide-in  200ms             Link hover
                    from left                             

  Scroll            Parallax on hero    Continuous        Scroll event
                    image (0.4x rate)                     

  Header            Blur + shadow       200ms             Scroll threshold
                    appear after 80px                     
                    scroll                                
  --------------------------------------------------------------------------

**6. Responsive Design Breakpoints**

  -----------------------------------------------------------------------
  **Breakpoint**          **Width**               **Layout Changes**
  ----------------------- ----------------------- -----------------------
  Mobile S                < 375px                Single column, reduced
                                                  font sizes,
                                                  bottom-fixed CTA

  Mobile                  375px--767px            Full-width cards,
                                                  hamburger nav, stacked
                                                  hero content

  Tablet                  768px--1023px           2-column grid,
                                                  side-by-side upload +
                                                  waveform

  Desktop                 1024px--1439px          3-column model cards,
                                                  full navigation bar

  Large Desktop           >= 1440px              Max-width container
                                                  1280px, centered layout
  -----------------------------------------------------------------------

**7. Figma File Structure**

**7.1 Recommended Frame Organization**

- 📁 Design System / --- Colors, Typography, Spacing, Icons

- 📁 Components / --- Buttons, Cards, Inputs, Navigation, Modals

- 📁 Pages / --- Home, Auth/Login, Auth/Register, History, 404

- 📁 Flows / --- User journey flows, interaction prototypes

- 📁 Assets / --- Cat images, illustrations, icons

**7.2 Auto Layout Rules**

  -----------------------------------------------------------------------
  **Component**     **Auto Layout     **Gap**           **Padding**
                    Direction**                         
  ----------------- ----------------- ----------------- -----------------
  Nav Header        Horizontal,       0                 0 24px
                    space-between                       

  Feature Card      Vertical          16px              24px

  Button            Horizontal,       8px               12px 24px
                    center                              

  Result Section    Vertical          24px              48px 0

  Model Cards Row   Horizontal, wrap  24px              64px 80px
  -----------------------------------------------------------------------

**7.3 Component Variants**

  ------------------------------------------------------------------------
  **Component**                       **Variants**
  ----------------------------------- ------------------------------------
  Button                              Type: Primary/Ghost/Danger/Disabled;
                                      Size: SM/MD/LG

  Card                                State: Default/Hover/Active; Type:
                                      Feature/Result/Stat

  Emotion Badge                       Emotion:
                                      Happy/Angry/Defense/Fighting/HuntingMind/Mating/MotherCall/Paining/Resting/Warning

  Input                               State: Empty/Filled/Error/Focused

  Navigation Link                     State: Default/Hover/Active; Screen:
                                      Desktop/Mobile
  ------------------------------------------------------------------------
