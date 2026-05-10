# Project Vision: Calculus Derivative Visualization (Projectile Motion)

## 1. Classroom Plan Idea: "The Ballistic Engineer"

### Scenario
Students are designing a system to launch a projectile (e.g., a ball, a rocket, or a satellite) to hit a target. They must analyze the trajectory to ensure safety and precision.

### Learning Objectives
- Understand the derivative as the rate of change of position (velocity).
- Understand the second derivative as the rate of change of velocity (acceleration).
- Visualize vectors (tangents) in 3D space.

### Flow
1. **Introduction:** A 3D stadium with a target. Launch a ball and see it miss.
2. **Interactive Phase:** 
   - Students adjust **angle** and **initial velocity** in the Web UI.
   - Observe the **Velocity Vector** (tangent to the path) growing/shrinking and changing direction.
   - Observe the **Acceleration Vector** (gravity, air resistance) always pointing down/opposing motion.
3. **Formalization:** 
   - Look at the **Live Chart** showing $y(t)$ (height) and its derivative $y'(t)$ (vertical velocity).
   - Point out where $y'(t) = 0$ (the peak of the trajectory).
4. **Hands-on:** Students modify the "environment" in Blender (add obstacles, change target positions) and export back to the app.

---

## 2. Software Artifact Architecture

### Portability: Blender ↔ WebGL
- **Blender (Modeling):**
  - Create the environment (Ground, Cannon, Targets, Obstacles).
  - Export as `.glb` (GLTF 2.0).
- **WebGL / Three.js (Interaction):**
  - Load the `.glb` environment.
  - Programmatic projectile logic (Parabolic motion + Air Resistance).
  - Dynamic Line rendering for the trajectory and vectors.
- **Chart.js (Data Visualization):**
  - Split-screen or overlay chart showing position and velocity components.

### Key Files
- `assets/stadium.blend`: The source 3D environment.
- `assets/stadium.glb`: The exported web-ready asset.
- `src/`: The WebGL application source.
  - `main.ts`: Three.js scene setup and loop.
  - `physics.ts`: Derivative calculations and position updates.
  - `ui.ts`: Sliders and Chart.js integration.
