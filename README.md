# Lift Simulator 🏢

A modern, interactive web-based elevator simulation system built with vanilla HTML, CSS, and JavaScript. This project demonstrates realistic lift mechanics including door animations, floor management, and intelligent lift allocation algorithms.

## ✨ Features

- **Dynamic Floor Generation**: Create custom buildings with any number of floors
- **Multiple Lift Support**: Configure multiple elevators with independent movement
- **Realistic Animations**: Smooth lift transitions and door opening/closing animations
- **Intelligent Scheduling**: Automatic lift allocation and queue management for pending calls
- **Interactive Controls**: Up/down buttons on each floor for lift requests
- **State Management**: Real-time tracking of lift positions and availability

## 🚀 How It Works

1. **Input Configuration**: Enter the number of floors and lifts you want to simulate
2. **Visual Building**: The system generates a visual representation of your building
3. **Lift Calls**: Click the up/down arrows on any floor to request a lift
4. **Smart Allocation**: The system automatically assigns the nearest available lift
5. **Queue Management**: If all lifts are busy, requests are queued and processed sequentially

## 🛠️ Technical Implementation

### Core Components

- **HTML Structure**: Semantic markup with sections for input controls and floor visualization
- **CSS Styling**: Modern design with smooth transitions and animations
- **JavaScript Logic**: State management using Maps for efficient lift and floor tracking

### Key Algorithms

- **Lift Assignment**: Finds the nearest available lift to minimize wait times
- **Movement Calculation**: Calculates transition duration based on floor distance
- **Queue Processing**: Manages pending lift requests with FIFO processing
- **State Synchronization**: Maintains consistent lift positions and availability

### Data Structures

```javascript
// Floor to lift mapping
const floorMaping = new Map();

// Lift position tracking
const liftMaping = new Map();

// Lift availability status
const checkAvailability = new Map();
```

## 🎮 Usage

1. Open `src/index.html` in your web browser
2. Enter the desired number of floors (e.g., 10)
3. Enter the number of lifts (e.g., 3)
4. Click "Submit" to generate the building
5. Use the up/down buttons on each floor to call lifts
6. Watch as lifts respond to requests with realistic animations

## 🎨 Design Features

- **Responsive Layout**: Adapts to different screen sizes
- **Visual Feedback**: Clear indication of lift positions and door states
- **Smooth Animations**: 2.5-second door transitions and proportional lift movement
- **Color-coded Elements**: Distinct colors for floors, lifts, and control buttons
- **Modern Typography**: Clean, readable fonts for better user experience

## 📁 Project Structure

```
lift_simulator/
├── src/
│   ├── index.html          # Main application interface
│   ├── css/
│   │   └── main.css        # Styling and animations
│   └── js/
│       └── main.js         # Core simulation logic
└── README.md               # Project documentation
```

## 🧩 Key Functions

- `handleFloor()`: Generates floor elements with controls
- `handleLift()`: Creates lift elements with door animations
- `handleLiftCall()`: Processes lift requests and assignment
- `liftMovement()`: Manages lift positioning and transitions
- `doorOpenClose()`: Controls door animations and availability

## 🎯 Simulation Features

- **Realistic Timing**: Lift movement speed proportional to floor distance
- **Door Operations**: Automatic door opening/closing with 2.5-second transitions
- **Concurrent Requests**: Handles multiple simultaneous lift calls
- **Efficient Routing**: Prioritizes nearest available lift for each request
- **State Persistence**: Maintains lift positions throughout the session

## 🔧 Browser Compatibility

This simulator works on all modern browsers that support:
- ES6 JavaScript features
- CSS Grid and Flexbox
- CSS Transitions and Transforms
- HTML5 semantic elements

## 🚀 Future Enhancements

- [ ] Add floor selection inside lifts
- [ ] Implement priority lift scheduling
- [ ] Add sound effects for door operations
- [ ] Include emergency stop functionality
- [ ] Add lift capacity simulation
- [ ] Implement maintenance mode

## 📄 License

This project is open-source and available under the MIT License.

---

**Built with ❤️ using vanilla web technologies**