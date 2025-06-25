const readline = require('readline');

// ---------------------------------------------
// RubiksCube Class
// ---------------------------------------------
class RubiksCube {
  constructor(state = null) {
    if (state) {
      this.state = JSON.parse(JSON.stringify(state));
    } else {
      this.state = {
        U: Array(9).fill('U'),
        R: Array(9).fill('R'),
        F: Array(9).fill('F'),
        D: Array(9).fill('D'),
        L: Array(9).fill('L'),
        B: Array(9).fill('B'),
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

  rotateFace(face) {
    const f = this.state[face];
    const t = [...f];
    f[0] = t[6]; f[1] = t[3]; f[2] = t[0];
    f[3] = t[7]; f[4] = t[4]; f[5] = t[1];
    f[6] = t[8]; f[7] = t[5]; f[8] = t[2];
  }

  U() {
    this.rotateFace('U');
    const t = [this.state.F[0], this.state.F[1], this.state.F[2]];
    [this.state.F[0], this.state.F[1], this.state.F[2]] = [this.state.R[0], this.state.R[1], this.state.R[2]];
    [this.state.R[0], this.state.R[1], this.state.R[2]] = [this.state.B[0], this.state.B[1], this.state.B[2]];
    [this.state.B[0], this.state.B[1], this.state.B[2]] = [this.state.L[0], this.state.L[1], this.state.L[2]];
    [this.state.L[0], this.state.L[1], this.state.L[2]] = t;
  }

  R() {
    this.rotateFace('R');
    const t = [this.state.U[2], this.state.U[5], this.state.U[8]];
    [this.state.U[2], this.state.U[5], this.state.U[8]] = [this.state.F[2], this.state.F[5], this.state.F[8]];
    [this.state.F[2], this.state.F[5], this.state.F[8]] = [this.state.D[2], this.state.D[5], this.state.D[8]];
    [this.state.D[2], this.state.D[5], this.state.D[8]] = [this.state.B[6], this.state.B[3], this.state.B[0]];
    [this.state.B[6], this.state.B[3], this.state.B[0]] = t;
  }

  F() {
    this.rotateFace('F');
    const t = [this.state.U[6], this.state.U[7], this.state.U[8]];
    [this.state.U[6], this.state.U[7], this.state.U[8]] = [this.state.L[8], this.state.L[5], this.state.L[2]];
    [this.state.L[8], this.state.L[5], this.state.L[2]] = [this.state.D[2], this.state.D[1], this.state.D[0]];
    [this.state.D[2], this.state.D[1], this.state.D[0]] = [this.state.R[0], this.state.R[3], this.state.R[6]];
    [this.state.R[0], this.state.R[3], this.state.R[6]] = t;
  }

  D() {
    this.rotateFace('D');
    const t = [this.state.F[6], this.state.F[7], this.state.F[8]];
    [this.state.F[6], this.state.F[7], this.state.F[8]] = [this.state.L[6], this.state.L[7], this.state.L[8]];
    [this.state.L[6], this.state.L[7], this.state.L[8]] = [this.state.B[6], this.state.B[7], this.state.B[8]];
    [this.state.B[6], this.state.B[7], this.state.B[8]] = [this.state.R[6], this.state.R[7], this.state.R[8]];
    [this.state.R[6], this.state.R[7], this.state.R[8]] = t;
  }

  L() {
    this.rotateFace('L');
    const t = [this.state.U[0], this.state.U[3], this.state.U[6]];
    [this.state.U[0], this.state.U[3], this.state.U[6]] = [this.state.B[8], this.state.B[5], this.state.B[2]];
    [this.state.B[8], this.state.B[5], this.state.B[2]] = [this.state.D[0], this.state.D[3], this.state.D[6]];
    [this.state.D[0], this.state.D[3], this.state.D[6]] = [this.state.F[0], this.state.F[3], this.state.F[6]];
    [this.state.F[0], this.state.F[3], this.state.F[6]] = t;
  }

  B() {
    this.rotateFace('B');
    const t = [this.state.U[0], this.state.U[1], this.state.U[2]];
    [this.state.U[0], this.state.U[1], this.state.U[2]] = [this.state.R[2], this.state.R[5], this.state.R[8]];
    [this.state.R[2], this.state.R[5], this.state.R[8]] = [this.state.D[8], this.state.D[7], this.state.D[6]];
    [this.state.D[8], this.state.D[7], this.state.D[6]] = [this.state.L[6], this.state.L[3], this.state.L[0]];
    [this.state.L[6], this.state.L[3], this.state.L[0]] = t;
  }

  applyMoves(sequence) {
    sequence.trim().split(/\s+/).forEach(m => this.applyMove(m));
  }

  applyMove(move) {
    const rotate = {
      "U": () => this.U(), "R": () => this.R(), "F": () => this.F(),
      "D": () => this.D(), "L": () => this.L(), "B": () => this.B(),
      "U'": () => { this.U(); this.U(); this.U(); }, "R'": () => { this.R(); this.R(); this.R(); },
      "F'": () => { this.F(); this.F(); this.F(); }, "D'": () => { this.D(); this.D(); this.D(); },
      "L'": () => { this.L(); this.L(); this.L(); }, "B'": () => { this.B(); this.B(); this.B(); },
      "U2": () => { this.U(); this.U(); }, "R2": () => { this.R(); this.R(); },
      "F2": () => { this.F(); this.F(); }, "D2": () => { this.D(); this.D(); },
      "L2": () => { this.L(); this.L(); }, "B2": () => { this.B(); this.B(); },
    };
    if (rotate[move]) rotate[move](); else console.warn("Invalid move:", move);
  }

  static fromScramble(scramble) {
    const cube = new RubiksCube();
    cube.applyMoves(scramble);
    return cube;
  }

  getStateString() {
    return JSON.stringify(this.state);
  }
}

// ---------------------------------------------
// KorfSolver Class
// ---------------------------------------------
class KorfSolver {
  constructor() {
    this.moves = ['U', 'R', 'F', 'D', 'L', 'B', "U'", "R'", "F'", "D'", "L'", "B'"];
    this.patternDB = new Map();
    this.buildPatternDatabase();
  }

  buildPatternDatabase() {
    const solved = new RubiksCube();
    this.patternDB.set(this.getCornerPattern(solved), 0);
    const queue = [{ cube: solved, distance: 0 }];
    const visited = new Set([solved.getStateString()]);

    while (queue.length && this.patternDB.size < 1000) {
      const { cube, distance } = queue.shift();
      if (distance >= 4) continue;

      for (const move of this.moves) {
        const newCube = cube.clone();
        newCube.applyMove(move);
        const key = newCube.getStateString();
        if (!visited.has(key)) {
          visited.add(key);
          const pattern = this.getCornerPattern(newCube);
          if (!this.patternDB.has(pattern)) {
            this.patternDB.set(pattern, distance + 1);
            queue.push({ cube: newCube, distance: distance + 1 });
          }
        }
      }
    }
  }

  getCornerPattern(cube) {
    return [
      cube.state.U[0], cube.state.U[2], cube.state.U[6], cube.state.U[8],
      cube.state.D[0], cube.state.D[2], cube.state.D[6], cube.state.D[8],
    ].join('');
  }

  heuristic(cube) {
    const pattern = this.getCornerPattern(cube);
    return this.patternDB.get(pattern) || this.roughDistance(cube);
  }

  roughDistance(cube) {
    let misplaced = 0;
    for (const face in cube.state) {
      misplaced += cube.state[face].filter(sticker => sticker !== face).length;
    }
    return Math.ceil(misplaced / 8);
  }

  solve(cube) {
    if (cube.isSolved()) return [];
    let bound = this.heuristic(cube);
    for (let i = 0; i < 20; i++) {
      const result = this.idaSearch(cube, [], 0, bound);
      if (Array.isArray(result)) return result;
      if (result === Infinity) return null;
      bound = result;
    }
    return null;
  }

  idaSearch(cube, path, g, bound) {
    const f = g + this.heuristic(cube);
    if (f > bound) return f;
    if (cube.isSolved()) return path;

    let min = Infinity;
    for (const move of this.moves) {
      if (path.length && this.isRedundant(path[path.length - 1], move)) continue;
      const next = cube.clone();
      next.applyMove(move);
      path.push(move);
      const res = this.idaSearch(next, path, g + 1, bound);
      if (Array.isArray(res)) return res;
      if (res < min) min = res;
      path.pop();
    }
    return min;
  }

  isRedundant(prev, curr) {
    return prev === curr || prev === this.inverseMove(curr);
  }

  inverseMove(move) {
    if (move.endsWith("'")) return move.slice(0, -1);
    if (move.endsWith("2")) return move;
    return move + "'";
  }
}

// ---------------------------------------------
// CubeSolver Class (Main Interface)
// ---------------------------------------------
class CubeSolver {
  constructor() {
    this.solver = new KorfSolver();
  }

  solve(scramble) {
    console.log("\n🧩 Input scramble:", scramble);
    const cube = RubiksCube.fromScramble(scramble);
    const start = Date.now();
    const solution = this.solver.solve(cube);
    const end = Date.now();

    if (solution) {
      console.log("✅ Solution:", solution.join(' '));
      console.log("📏 Move count:", solution.length);
      console.log("⏱️  Time:", (end - start), "ms");
      const test = RubiksCube.fromScramble(scramble);
      test.applyMoves(solution.join(' '));
      console.log(test.isSolved() ? "✅ Verified: Cube solved!" : "❌ Verification failed!");
    } else {
      console.log("❌ No solution found.");
    }
  }
}

// ---------------------------------------------
// Run: Example or User Input
// ---------------------------------------------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("🔢 Enter a scramble (e.g. R U R' U'): ", input => {
  const solver = new CubeSolver();
  solver.solve(input);
  rl.close();
});
