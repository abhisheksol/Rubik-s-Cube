
class RubiksCube {
  constructor(state = null) {
    if (state) {
      this.state = JSON.parse(JSON.stringify(state));
    } else {
      // Initialize solved cube: each face has 9 stickers of the same color
      this.state = {
        U: ['U','U','U','U','U','U','U','U','U'], // Up (White)
        R: ['R','R','R','R','R','R','R','R','R'], // Right (Red)  
        F: ['F','F','F','F','F','F','F','F','F'], // Front (Green)
        D: ['D','D','D','D','D','D','D','D','D'], // Down (Yellow)
        L: ['L','L','L','L','L','L','L','L','L'], // Left (Orange)
        B: ['B','B','B','B','B','B','B','B','B']  // Back (Blue)
      };
    }
  }

  clone() {
    return new RubiksCube(this.state);
  }

  isSolved() {
    return Object.keys(this.state).every(face => 
      this.state[face].every(sticker => sticker === face)
    );
  }

  // Rotate a face 90 degrees clockwise
  rotateFace(face) {
    const f = this.state[face];
    const temp = [...f];
    f[0] = temp[6]; f[1] = temp[3]; f[2] = temp[0];
    f[3] = temp[7]; f[4] = temp[4]; f[5] = temp[1];
    f[6] = temp[8]; f[7] = temp[5]; f[8] = temp[2];
  }

  // All 18 possible moves (6 faces × 3 rotations each)
  U() {
    this.rotateFace('U');
    const temp = [this.state.F[0], this.state.F[1], this.state.F[2]];
    [this.state.F[0], this.state.F[1], this.state.F[2]] = [this.state.R[0], this.state.R[1], this.state.R[2]];
    [this.state.R[0], this.state.R[1], this.state.R[2]] = [this.state.B[0], this.state.B[1], this.state.B[2]];
    [this.state.B[0], this.state.B[1], this.state.B[2]] = [this.state.L[0], this.state.L[1], this.state.L[2]];
    [this.state.L[0], this.state.L[1], this.state.L[2]] = temp;
  }

  R() {
    this.rotateFace('R');
    const temp = [this.state.U[2], this.state.U[5], this.state.U[8]];
    [this.state.U[2], this.state.U[5], this.state.U[8]] = [this.state.F[2], this.state.F[5], this.state.F[8]];
    [this.state.F[2], this.state.F[5], this.state.F[8]] = [this.state.D[2], this.state.D[5], this.state.D[8]];
    [this.state.D[2], this.state.D[5], this.state.D[8]] = [this.state.B[6], this.state.B[3], this.state.B[0]];
    [this.state.B[6], this.state.B[3], this.state.B[0]] = temp;
  }

  F() {
    this.rotateFace('F');
    const temp = [this.state.U[6], this.state.U[7], this.state.U[8]];
    [this.state.U[6], this.state.U[7], this.state.U[8]] = [this.state.L[8], this.state.L[5], this.state.L[2]];
    [this.state.L[8], this.state.L[5], this.state.L[2]] = [this.state.D[2], this.state.D[1], this.state.D[0]];
    [this.state.D[2], this.state.D[1], this.state.D[0]] = [this.state.R[0], this.state.R[3], this.state.R[6]];
    [this.state.R[0], this.state.R[3], this.state.R[6]] = temp;
  }

  D() {
    this.rotateFace('D');
    const temp = [this.state.F[6], this.state.F[7], this.state.F[8]];
    [this.state.F[6], this.state.F[7], this.state.F[8]] = [this.state.L[6], this.state.L[7], this.state.L[8]];
    [this.state.L[6], this.state.L[7], this.state.L[8]] = [this.state.B[6], this.state.B[7], this.state.B[8]];
    [this.state.B[6], this.state.B[7], this.state.B[8]] = [this.state.R[6], this.state.R[7], this.state.R[8]];
    [this.state.R[6], this.state.R[7], this.state.R[8]] = temp;
  }

  L() {
    this.rotateFace('L');
    const temp = [this.state.U[0], this.state.U[3], this.state.U[6]];
    [this.state.U[0], this.state.U[3], this.state.U[6]] = [this.state.B[8], this.state.B[5], this.state.B[2]];
    [this.state.B[8], this.state.B[5], this.state.B[2]] = [this.state.D[0], this.state.D[3], this.state.D[6]];
    [this.state.D[0], this.state.D[3], this.state.D[6]] = [this.state.F[0], this.state.F[3], this.state.F[6]];
    [this.state.F[0], this.state.F[3], this.state.F[6]] = temp;
  }

  B() {
    this.rotateFace('B');
    const temp = [this.state.U[0], this.state.U[1], this.state.U[2]];
    [this.state.U[0], this.state.U[1], this.state.U[2]] = [this.state.R[2], this.state.R[5], this.state.R[8]];
    [this.state.R[2], this.state.R[5], this.state.R[8]] = [this.state.D[8], this.state.D[7], this.state.D[6]];
    [this.state.D[8], this.state.D[7], this.state.D[6]] = [this.state.L[6], this.state.L[3], this.state.L[0]];
    [this.state.L[6], this.state.L[3], this.state.L[0]] = temp;
  }

  // Apply a move sequence like "R U R' U'"
  applyMoves(moveSequence) {
    const moves = moveSequence.trim().split(/\s+/);
    for (const move of moves) {
      this.applyMove(move);
    }
  }

  applyMove(move) {
    const moveMap = {
      'U': () => this.U(),
      'R': () => this.R(),
      'F': () => this.F(),
      'D': () => this.D(),
      'L': () => this.L(),
      'B': () => this.B(),
      "U'": () => { this.U(); this.U(); this.U(); },
      "R'": () => { this.R(); this.R(); this.R(); },
      "F'": () => { this.F(); this.F(); this.F(); },
      "D'": () => { this.D(); this.D(); this.D(); },
      "L'": () => { this.L(); this.L(); this.L(); },
      "B'": () => { this.B(); this.B(); this.B(); },
      'U2': () => { this.U(); this.U(); },
      'R2': () => { this.R(); this.R(); },
      'F2': () => { this.F(); this.F(); },
      'D2': () => { this.D(); this.D(); },
      'L2': () => { this.L(); this.L(); },
      'B2': () => { this.B(); this.B(); }
    };

    if (moveMap[move]) {
      moveMap[move]();
    } else {
      console.warn(`Unknown move: ${move}`);
    }
  }

  // Create a scrambled cube from moves
  static fromScramble(scramble) {
    const cube = new RubiksCube();
    cube.applyMoves(scramble);
    return cube;
  }

  // Get state as string for hashing
  getStateString() {
    return JSON.stringify(this.state);
  }
}

class KorfSolver {
  constructor() {
    this.moves = ['U', 'R', 'F', 'D', 'L', 'B', "U'", "R'", "F'", "D'", "L'", "B'"];
    this.patternDB = new Map();
    this.maxDepth = 20; // God's number for Rubik's cube
    console.log("🔧 Initializing Korf's Algorithm Solver...");
    this.buildPatternDatabase();
  }

  buildPatternDatabase() {
    console.log("📊 Building pattern database (this may take a moment)...");
    
    // Build a simplified pattern database for corners
    // In a full implementation, this would be much more comprehensive
    const solvedCube = new RubiksCube();
    this.patternDB.set(this.getCornerPattern(solvedCube), 0);
    
    // BFS to build database
    const queue = [{cube: solvedCube, distance: 0}];
    const visited = new Set([solvedCube.getStateString()]);
    let processed = 0;
    
    while (queue.length > 0 && processed < 10000) { // Limit for performance
      const {cube, distance} = queue.shift();
      processed++;
      
      if (distance < 4) { // Build database to depth 4
        for (const move of this.moves) {
          const newCube = cube.clone();
          newCube.applyMove(move);
          const stateString = newCube.getStateString();
          
          if (!visited.has(stateString)) {
            visited.add(stateString);
            const pattern = this.getCornerPattern(newCube);
            
            if (!this.patternDB.has(pattern)) {
              this.patternDB.set(pattern, distance + 1);
              queue.push({cube: newCube, distance: distance + 1});
            }
          }
        }
      }
    }
    
    console.log(`✅ Pattern database built with ${this.patternDB.size} entries`);
  }

  getCornerPattern(cube) {
    // Simplified corner pattern - in reality this would be more sophisticated
    const corners = [
      cube.state.U[0], cube.state.U[2], cube.state.U[6], cube.state.U[8],
      cube.state.D[0], cube.state.D[2], cube.state.D[6], cube.state.D[8]
    ];
    return corners.join('');
  }

  heuristic(cube) {
    // Calculate heuristic using pattern database
    const pattern = this.getCornerPattern(cube);
    const dbDistance = this.patternDB.get(pattern) || this.manhattanDistance(cube);
    const manhattan = this.manhattanDistance(cube);
    
    return Math.max(dbDistance, manhattan);
  }

  manhattanDistance(cube) {
    // Count misplaced pieces
    let distance = 0;
    Object.keys(cube.state).forEach(face => {
      cube.state[face].forEach(sticker => {
        if (sticker !== face) distance++;
      });
    });
    return Math.ceil(distance / 8); // Rough estimate
  }

  solve(cube) {
    console.log("🎯 Starting Korf's Algorithm...");
    
    if (cube.isSolved()) {
      console.log("✅ Cube is already solved!");
      return [];
    }

    // IDA* (Iterative Deepening A*)
    let bound = this.heuristic(cube);
    console.log(`📏 Initial heuristic bound: ${bound}`);

    for (let iteration = 0; iteration < 25; iteration++) {
      console.log(`🔍 Searching with bound ${bound} (iteration ${iteration + 1})...`);
      
      const result = this.idaSearch(cube, [], 0, bound);
      
      if (Array.isArray(result)) {
        console.log("🎉 Solution found!");
        return result;
      }
      
      if (result === Infinity) {
        console.log("❌ No solution exists");
        return null;
      }
      
      bound = result;
      
      if (bound > this.maxDepth) {
        console.log(`⚠️  Search exceeded maximum depth (${this.maxDepth})`);
        return null;
      }
    }

    console.log("⏰ Search timed out");
    return null;
  }

  idaSearch(cube, path, g, bound) {
    const f = g + this.heuristic(cube);
    
    if (f > bound) return f;
    if (cube.isSolved()) return path;

    let min = Infinity;
    
    for (const move of this.moves) {
      // Avoid redundant moves
      if (path.length > 0 && this.isRedundantMove(path[path.length - 1], move)) {
        continue;
      }
      
      const newCube = cube.clone();
      newCube.applyMove(move);
      path.push(move);
      
      const result = this.idaSearch(newCube, path, g + 1, bound);
      
      if (Array.isArray(result)) return result;
      if (result < min) min = result;
      
      path.pop();
    }
    
    return min;
  }

  isRedundantMove(lastMove, currentMove) {
    // Avoid moves that cancel each other out
    const opposites = {
      'U': "U'", "U'": 'U', 'R': "R'", "R'": 'R',
      'F': "F'", "F'": 'F', 'D': "D'", "D'": 'D',
      'L': "L'", "L'": 'L', 'B': "B'", "B'": 'B'
    };
    
    return opposites[lastMove] === currentMove || lastMove === currentMove;
  }
}

// ===== MAIN SOLVER CLASS - THIS IS WHAT YOU USE =====
class CubeSolver {
  constructor() {
    this.solver = new KorfSolver();
  }

  /**
   * Solve a scrambled cube
   * @param {string} scramble - The scramble moves (e.g., "R U R' U' R' F R2 U' R' U' R U R' F'")
   * @returns {string} - The solution moves
   */
  solve(scramble) {
    console.log("🧩 ===== RUBIK'S CUBE SOLVER =====");
    console.log(`📝 Input scramble: ${scramble}`);
    console.log();

    try {
      // Create cube from scramble
      const cube = RubiksCube.fromScramble(scramble);
      
      // Solve the cube
      const startTime = Date.now();
      const solution = this.solver.solve(cube);
      const endTime = Date.now();
      
      if (solution) {
        const solutionString = solution.join(' ');
        console.log();
        console.log("🎉 ===== SOLUTION FOUND =====");
        console.log(`✅ Solution: ${solutionString}`);
        console.log(`📊 Number of moves: ${solution.length}`);
        console.log(`⏱️  Time taken: ${endTime - startTime}ms`);
        console.log();
        
        // Verify solution
        this.verifySolution(scramble, solutionString);
        
        return solutionString;
      } else {
        console.log("❌ No solution found");
        return null;
      }
      
    } catch (error) {
      console.error("💥 Error solving cube:", error.message);
      return null;
    }
  }

  verifySolution(scramble, solution) {
    console.log("🔍 Verifying solution...");
    
    const testCube = new RubiksCube();
    testCube.applyMoves(scramble);  // Apply scramble
    testCube.applyMoves(solution);  // Apply solution
    
    if (testCube.isSolved()) {
      console.log("✅ Solution verified - cube is solved!");
    } else {
      console.log("❌ Solution verification failed!");
    }
  }
}

// ===== HOW TO USE - EXAMPLES =====

console.log("🚀 Korf's Algorithm Cube Solver Ready!");
console.log();
console.log("📋 HOW TO USE:");
console.log("1. Create solver: const solver = new CubeSolver()");
console.log("2. Solve cube: solver.solve('R U R\\' U\\' F R F\\'')");
console.log();

// Example usage
const solver = new CubeSolver();

// Test with some example scrambles
const testScrambles = [
  "R U R' U'",                    // Simple 4-move scramble
  "R U R' U' R' F R F'",          // 8-move scramble  
  "F R U R' U' F'",               // Classic algorithm
];

console.log("🧪 TESTING WITH SAMPLE SCRAMBLES:");
console.log();

testScrambles.forEach((scramble, index) => {
  console.log(`--- Test ${index + 1} ---`);
  const solution = solver.solve(scramble);
  console.log("=" .repeat(50));
  console.log();
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CubeSolver, RubiksCube };
}