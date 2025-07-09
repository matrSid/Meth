import React, { useState, useEffect } from 'react';
import { Calculator, Trophy, Star, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const MathGame = () => {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState('basic');
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [problemsSolved, setProblemsSolved] = useState(0);

  const difficulties = {
    basic: { name: 'Basic Arithmetic', color: 'bg-green-500' },
    intermediate: { name: 'Intermediate Algebra', color: 'bg-blue-500' },
    advanced: { name: 'Advanced Algebra', color: 'bg-purple-500' },
    calculus: { name: 'Calculus', color: 'bg-red-500' }
  };

  // Random number generators
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randFloat = (min, max, decimals = 2) => 
    parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

  // Problem generators for each difficulty
  const generateBasicProblem = () => {
    const operations = ['+', '-', '*', '/'];
    const op = operations[randInt(0, 3)];
    let a, b, answer, problem;

    switch (op) {
      case '+':
        a = randInt(1, 100);
        b = randInt(1, 100);
        answer = a + b;
        problem = `${a} + ${b}`;
        break;
      case '-':
        a = randInt(10, 100);
        b = randInt(1, a);
        answer = a - b;
        problem = `${a} - ${b}`;
        break;
      case '*':
        a = randInt(2, 12);
        b = randInt(2, 12);
        answer = a * b;
        problem = `${a} × ${b}`;
        break;
      case '/':
        answer = randInt(2, 12);
        b = randInt(2, 12);
        a = answer * b;
        problem = `${a} ÷ ${b}`;
        break;
    }

    return { problem, answer, solution: `${problem} = ${answer}` };
  };

  const generateIntermediateProblem = () => {
    const types = ['linear', 'quadratic_simple', 'fraction', 'exponent'];
    const type = types[randInt(0, 3)];

    switch (type) {
      case 'linear':
        const a = randInt(2, 10);
        const b = randInt(1, 20);
        const c = randInt(1, 50);
        const answer = Math.round((c - b) / a);
        return {
          problem: `Solve for x: ${a}x + ${b} = ${c}`,
          answer,
          solution: `${a}x = ${c - b}, x = ${answer}`
        };

      case 'quadratic_simple':
        const coeff = randInt(1, 5);
        const constant = randInt(1, 25);
        const root = randInt(2, 8);
        const expanded = coeff * root * root + constant;
        return {
          problem: `Solve for x: ${coeff}x² + ${constant} = ${expanded}`,
          answer: root,
          solution: `${coeff}x² = ${expanded - constant}, x² = ${(expanded - constant) / coeff}, x = ${root}`
        };

      case 'fraction':
        const num1 = randInt(1, 8);
        const den1 = randInt(2, 10);
        const num2 = randInt(1, 8);
        const den2 = randInt(2, 10);
        const resultNum = num1 * den2 + num2 * den1;
        const resultDen = den1 * den2;
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const g = gcd(resultNum, resultDen);
        const finalNum = resultNum / g;
        const finalDen = resultDen / g;
        return {
          problem: `Simplify: ${num1}/${den1} + ${num2}/${den2}`,
          answer: finalDen === 1 ? finalNum : `${finalNum}/${finalDen}`,
          solution: `= ${resultNum}/${resultDen} = ${finalDen === 1 ? finalNum : `${finalNum}/${finalDen}`}`
        };

      case 'exponent':
        const base = randInt(2, 5);
        const exp1 = randInt(2, 4);
        const exp2 = randInt(2, 4);
        const resultExp = exp1 + exp2;
        return {
          problem: `Simplify: ${base}^${exp1} × ${base}^${exp2}`,
          answer: `${base}^${resultExp}`,
          solution: `= ${base}^${exp1 + exp2} = ${base}^${resultExp}`
        };
    }
  };

  const generateAdvancedProblem = () => {
    const types = ['quadratic', 'system', 'logarithm', 'trigonometry'];
    const type = types[randInt(0, 3)];

    switch (type) {
      case 'quadratic':
        const p = randInt(1, 5);
        const q = randInt(1, 5);
        const root1 = randInt(2, 8);
        const root2 = randInt(2, 8);
        const a_coeff = 1;
        const b_coeff = -(root1 + root2);
        const c_coeff = root1 * root2;
        return {
          problem: `Solve: x² ${b_coeff >= 0 ? '+' : ''}${b_coeff}x ${c_coeff >= 0 ? '+' : ''}${c_coeff} = 0`,
          answer: `x = ${Math.min(root1, root2)}, ${Math.max(root1, root2)}`,
          solution: `Factors: (x - ${root1})(x - ${root2}) = 0`
        };

      case 'system':
        const x_val = randInt(1, 10);
        const y_val = randInt(1, 10);
        const a1 = randInt(1, 5);
        const b1 = randInt(1, 5);
        const a2 = randInt(1, 5);
        const b2 = randInt(1, 5);
        const c1 = a1 * x_val + b1 * y_val;
        const c2 = a2 * x_val + b2 * y_val;
        return {
          problem: `Solve system: ${a1}x + ${b1}y = ${c1}, ${a2}x + ${b2}y = ${c2}`,
          answer: `x = ${x_val}, y = ${y_val}`,
          solution: `Solution: (${x_val}, ${y_val})`
        };

      case 'logarithm':
        const base = randInt(2, 5);
        const result = randInt(2, 4);
        const value = Math.pow(base, result);
        return {
          problem: `Solve: log₍${base}₎(x) = ${result}`,
          answer: value,
          solution: `x = ${base}^${result} = ${value}`
        };

      case 'trigonometry':
        const angles = [30, 45, 60, 90];
        const angle = angles[randInt(0, 3)];
        const values = {
          30: { sin: '1/2', cos: '√3/2', tan: '1/√3' },
          45: { sin: '√2/2', cos: '√2/2', tan: '1' },
          60: { sin: '√3/2', cos: '1/2', tan: '√3' },
          90: { sin: '1', cos: '0', tan: 'undefined' }
        };
        const func = ['sin', 'cos', 'tan'][randInt(0, 2)];
        return {
          problem: `Find ${func}(${angle}°)`,
          answer: values[angle][func],
          solution: `${func}(${angle}°) = ${values[angle][func]}`
        };
    }
  };

  const generateCalculusProblem = () => {
    const types = ['derivative', 'integral', 'limit', 'chain_rule'];
    const type = types[randInt(0, 3)];

    switch (type) {
      case 'derivative':
        const power = randInt(2, 6);
        const coeff = randInt(1, 8);
        const newPower = power - 1;
        const newCoeff = coeff * power;
        return {
          problem: `Find d/dx of ${coeff}x^${power}`,
          answer: `${newCoeff}x^${newPower}`,
          solution: `d/dx(${coeff}x^${power}) = ${newCoeff}x^${newPower}`
        };

      case 'integral':
        const int_power = randInt(1, 5);
        const int_coeff = randInt(1, 8);
        const new_power = int_power + 1;
        const new_coeff = int_coeff / new_power;
        return {
          problem: `Find ∫${int_coeff}x^${int_power} dx`,
          answer: `${new_coeff}x^${new_power} + C`,
          solution: `∫${int_coeff}x^${int_power} dx = ${new_coeff}x^${new_power} + C`
        };

      case 'limit':
        const a = randInt(1, 8);
        const b = randInt(1, 8);
        const limit_point = randInt(1, 5);
        const result = a * limit_point + b;
        return {
          problem: `Find lim(x→${limit_point}) (${a}x + ${b})`,
          answer: result,
          solution: `lim(x→${limit_point}) (${a}x + ${b}) = ${a}(${limit_point}) + ${b} = ${result}`
        };

      case 'chain_rule':
        const outer_power = randInt(2, 4);
        const inner_coeff = randInt(2, 5);
        const inner_const = randInt(1, 8);
        return {
          problem: `Find d/dx of (${inner_coeff}x + ${inner_const})^${outer_power}`,
          answer: `${outer_power * inner_coeff}(${inner_coeff}x + ${inner_const})^${outer_power - 1}`,
          solution: `Chain rule: ${outer_power}(${inner_coeff}x + ${inner_const})^${outer_power - 1} × ${inner_coeff}`
        };
    }
  };

  const generateProblem = () => {
    let problem;
    switch (difficulty) {
      case 'basic':
        problem = generateBasicProblem();
        break;
      case 'intermediate':
        problem = generateIntermediateProblem();
        break;
      case 'advanced':
        problem = generateAdvancedProblem();
        break;
      case 'calculus':
        problem = generateCalculusProblem();
        break;
    }
    
    setCurrentProblem(problem);
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (!currentProblem || !userAnswer.trim()) return;

    const correct = userAnswer.trim().toLowerCase() === currentProblem.answer.toString().toLowerCase();
    
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
      setProblemsSolved(problemsSolved + 1);
    } else {
      setStreak(0);
      setFeedback('Not quite right. Try again!');
      setShowAnswer(true);
    }
  };

  const skipProblem = () => {
    setShowAnswer(true);
    setStreak(0);
    setFeedback('Problem skipped');
  };

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Math Challenge</h1>
          </div>
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Star className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{streak}</div>
            <div className="text-sm text-gray-600">Streak</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{problemsSolved}</div>
            <div className="text-sm text-gray-600">Solved</div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Difficulty Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(difficulties).map(([key, diff]) => (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  difficulty === key
                    ? `${diff.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Display */}
        {currentProblem && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-500 mb-2">
                {difficulties[difficulty].name}
              </div>
              <div className="text-3xl font-mono text-gray-800 mb-6 min-h-[100px] flex items-center justify-center">
                {currentProblem.problem}
              </div>
              
              <div className="flex gap-4 justify-center mb-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  placeholder="Enter your answer..."
                  className="px-4 py-2 border border-gray-300 rounded-lg w-64 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={checkAnswer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
                <button
                  onClick={skipProblem}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={generateProblem}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Problem
                </button>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="text-center mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                  feedback.includes('Correct') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {feedback.includes('Correct') ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {feedback}
                </div>
              </div>
            )}

            {/* Show Answer */}
            {showAnswer && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  Answer: {currentProblem.answer}
                </div>
                <div className="text-sm text-gray-600">
                  {currentProblem.solution}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">How to Play</h3>
          <div className="text-gray-600 space-y-2">
            <p>• Choose your difficulty level from Basic to Calculus</p>
            <p>• Each level generates unlimited unique problems</p>
            <p>• Type your answer and press Submit or Enter</p>
            <p>• Build up your streak by solving problems consecutively</p>
            <p>• For fractions, use format like "3/4" or for expressions like "2x^3"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathGame;