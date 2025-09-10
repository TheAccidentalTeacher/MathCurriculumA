'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Grade7Curriculum() {
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  const toggleLesson = (lessonNumber: number) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonNumber)) {
      newExpanded.delete(lessonNumber);
    } else {
      newExpanded.add(lessonNumber);
    }
    setExpandedLessons(newExpanded);
  };

  const units = [
    {
      unit: 'Unit 1',
      title: 'Proportional Relationships: Ratios, Rates, and Circles',
      pages: '1-120',
      duration: '30 days',
      domain: 'Proportional Relationships',
      stemSpotlight: 'Katherine Johnson',
      standards: ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3', '7.G.B.4'],
      lessons: [
        {
          number: 1,
          title: 'Solve Problems Involving Scale',
          pages: '3-18',
          standards: ['7.RP.A.2'],
          objectives: ['Solve scale drawing problems', 'Use scale factors to find actual measurements', 'Create scale drawings'],
          vocabulary: ['scale', 'scale factor', 'scale drawing', 'similar figures'],
          assessments: ['Scale Drawing Project', 'Lesson Quiz', 'Real-World Applications'],
          sessions: [
            { day: 1, type: 'Explore', title: 'What is Scale?', focus: 'Discover scale through maps, blueprints, and models' },
            { day: 2, type: 'Develop', title: 'Scale Factor Calculations', focus: 'Learn to calculate and apply scale factors' },
            { day: 3, type: 'Develop', title: 'Create Scale Drawings', focus: 'Practice creating accurate scale drawings' },
            { day: 4, type: 'Develop', title: 'Solve Scale Problems', focus: 'Apply scale reasoning to real-world problems' },
            { day: 5, type: 'Refine', title: 'Scale Mastery Project', focus: 'Complex scale applications and assessment' }
          ]
        },
        {
          number: 2,
          title: 'Find Unit Rates Involving Ratios of Fractions',
          pages: '19-36',
          standards: ['7.RP.A.1'],
          objectives: ['Calculate unit rates with fractions', 'Compare rates involving fractions', 'Solve complex rate problems'],
          vocabulary: ['unit rate', 'complex fractions', 'rate comparison', 'fractional rates'],
          assessments: ['Unit Rate Calculations', 'Rate Comparison Tasks', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Fractional Unit Rates', focus: 'Explore rates when quantities involve fractions' },
            { day: 2, type: 'Develop', title: 'Calculate Complex Rates', focus: 'Find unit rates with fractional values' },
            { day: 3, type: 'Develop', title: 'Compare Fractional Rates', focus: 'Use unit rates to compare different fractional rates' },
            { day: 4, type: 'Develop', title: 'Real-World Rate Problems', focus: 'Apply fractional rate reasoning to authentic contexts' },
            { day: 5, type: 'Refine', title: 'Fractional Rate Mastery', focus: 'Complex rate problems and assessment' }
          ]
        },
        {
          number: 3,
          title: 'Understand Proportional Relationships',
          pages: '37-54',
          standards: ['7.RP.A.2a'],
          objectives: ['Identify proportional relationships', 'Find constant of proportionality', 'Use proportional reasoning'],
          vocabulary: ['proportional relationship', 'constant of proportionality', 'direct variation', 'ratio table'],
          assessments: ['Proportional Reasoning Tasks', 'Relationship Analysis', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'What Makes It Proportional?', focus: 'Discover the characteristics of proportional relationships' },
            { day: 2, type: 'Develop', title: 'Constant of Proportionality', focus: 'Find and interpret the constant of proportionality' },
            { day: 3, type: 'Develop', title: 'Proportional or Not?', focus: 'Distinguish proportional from non-proportional relationships' },
            { day: 4, type: 'Develop', title: 'Proportional Problem Solving', focus: 'Use proportional reasoning to solve problems' },
            { day: 5, type: 'Refine', title: 'Proportional Relationship Mastery', focus: 'Complex proportional scenarios and assessment' }
          ]
        },
        {
          number: 4,
          title: 'Graph Proportional Relationships',
          pages: '55-72',
          standards: ['7.RP.A.2b', '7.RP.A.2d'],
          objectives: ['Graph proportional relationships', 'Interpret graphs of proportional relationships', 'Connect equations and graphs'],
          vocabulary: ['coordinate graph', 'linear relationship', 'origin', 'slope'],
          assessments: ['Graphing Practice', 'Graph Interpretation', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Proportional Patterns', focus: 'Explore how proportional relationships appear on graphs' },
            { day: 2, type: 'Develop', title: 'Graph from Tables', focus: 'Create graphs from proportional relationship tables' },
            { day: 3, type: 'Develop', title: 'Interpret Proportional Graphs', focus: 'Read and analyze graphs of proportional relationships' },
            { day: 4, type: 'Develop', title: 'Connect Equations and Graphs', focus: 'Link proportional equations to their graphical representations' },
            { day: 5, type: 'Refine', title: 'Graphing Mastery', focus: 'Complex graphing tasks and assessment' }
          ]
        },
        {
          number: 5,
          title: 'Represent Proportional Relationships with Equations',
          pages: '73-90',
          standards: ['7.RP.A.2c'],
          objectives: ['Write equations for proportional relationships', 'Use y = mx form', 'Connect multiple representations'],
          vocabulary: ['proportional equation', 'y = mx', 'coefficient', 'variable'],
          assessments: ['Equation Writing', 'Multi-Representation Tasks', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'From Tables to Equations', focus: 'Explore how to write equations from proportional tables' },
            { day: 2, type: 'Develop', title: 'y = mx Form', focus: 'Learn the standard form for proportional relationships' },
            { day: 3, type: 'Develop', title: 'Multiple Representations', focus: 'Connect tables, graphs, and equations' },
            { day: 4, type: 'Develop', title: 'Equation Applications', focus: 'Use proportional equations to solve problems' },
            { day: 5, type: 'Refine', title: 'Equation Mastery', focus: 'Complex equation work and assessment' }
          ]
        },
        {
          number: 6,
          title: 'Find Area and Circumference of Circles',
          pages: '91-108',
          standards: ['7.G.B.4'],
          objectives: ['Apply circle area and circumference formulas', 'Solve circle problems', 'Work with π'],
          vocabulary: ['circle', 'radius', 'diameter', 'circumference', 'area', 'pi (π)'],
          assessments: ['Circle Calculations', 'Real-World Circle Problems', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Discovering π', focus: 'Explore the relationship between diameter and circumference' },
            { day: 2, type: 'Develop', title: 'Circumference Formula', focus: 'Learn and apply C = πd and C = 2πr' },
            { day: 3, type: 'Develop', title: 'Area Formula', focus: 'Learn and apply A = πr²' },
            { day: 4, type: 'Develop', title: 'Circle Problem Solving', focus: 'Apply formulas to real-world circle problems' },
            { day: 5, type: 'Refine', title: 'Circle Mastery', focus: 'Complex circle applications and assessment' }
          ]
        }
      ]
    },
    {
      unit: 'Unit 2',
      title: 'Rational Number Operations',
      pages: '121-240',
      duration: '35 days',
      domain: 'The Number System',
      stemSpotlight: 'Benjamin Banneker',
      standards: ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3'],
      lessons: [
        {
          number: 7,
          title: 'Understand Addition and Subtraction of Rational Numbers',
          pages: '123-138',
          standards: ['7.NS.A.1d'],
          objectives: ['Understand rational number operations conceptually', 'Use number line models', 'Connect to real-world contexts'],
          vocabulary: ['rational numbers', 'integers', 'additive inverse', 'absolute value'],
          assessments: ['Conceptual Understanding Tasks', 'Number Line Activities', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Rational Number Patterns', focus: 'Explore addition and subtraction patterns with rational numbers' },
            { day: 2, type: 'Develop', title: 'Number Line Models', focus: 'Use number lines to model rational number operations' },
            { day: 3, type: 'Develop', title: 'Opposite Operations', focus: 'Understand additive inverses and their properties' },
            { day: 4, type: 'Develop', title: 'Real-World Contexts', focus: 'Connect rational number operations to real situations' },
            { day: 5, type: 'Refine', title: 'Conceptual Mastery', focus: 'Deepen understanding and assess concepts' }
          ]
        },
        {
          number: 8,
          title: 'Add Rational Numbers',
          pages: '139-156',
          standards: ['7.NS.A.1a', '7.NS.A.1b'],
          objectives: ['Add rational numbers fluently', 'Apply addition properties', 'Solve addition problems'],
          vocabulary: ['addends', 'sum', 'commutative property', 'associative property'],
          assessments: ['Addition Fluency Practice', 'Multi-Step Problems', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Addition Strategies', focus: 'Explore different strategies for adding rational numbers' },
            { day: 2, type: 'Develop', title: 'Same Signs', focus: 'Add rational numbers with the same sign' },
            { day: 3, type: 'Develop', title: 'Different Signs', focus: 'Add rational numbers with different signs' },
            { day: 4, type: 'Develop', title: 'Complex Addition', focus: 'Add multiple rational numbers and decimals' },
            { day: 5, type: 'Refine', title: 'Addition Fluency', focus: 'Build fluency and assess addition skills' }
          ]
        },
        {
          number: 9,
          title: 'Subtract Rational Numbers',
          pages: '157-174',
          standards: ['7.NS.A.1c'],
          objectives: ['Subtract rational numbers fluently', 'Use addition to subtract', 'Solve subtraction problems'],
          vocabulary: ['minuend', 'subtrahend', 'difference', 'adding the opposite'],
          assessments: ['Subtraction Practice', 'Problem Solving', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Subtraction as Addition', focus: 'Explore subtraction as adding the opposite' },
            { day: 2, type: 'Develop', title: 'Subtract by Adding', focus: 'Use adding the opposite to subtract rational numbers' },
            { day: 3, type: 'Develop', title: 'Distance and Subtraction', focus: 'Connect subtraction to distance on number lines' },
            { day: 4, type: 'Develop', title: 'Complex Subtraction', focus: 'Subtract in multi-step problems and real contexts' },
            { day: 5, type: 'Refine', title: 'Subtraction Mastery', focus: 'Fluency building and assessment' }
          ]
        },
        {
          number: 10,
          title: 'Understand Multiplication of Rational Numbers',
          pages: '175-192',
          standards: ['7.NS.A.2a'],
          objectives: ['Understand multiplication of rational numbers conceptually', 'Use models to multiply', 'Apply multiplication properties'],
          vocabulary: ['factors', 'product', 'multiplication properties', 'sign rules'],
          assessments: ['Conceptual Tasks', 'Modeling Activities', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Multiplication Patterns', focus: 'Explore patterns in multiplying rational numbers' },
            { day: 2, type: 'Develop', title: 'Positive × Positive', focus: 'Multiply positive rational numbers' },
            { day: 3, type: 'Develop', title: 'Sign Rules', focus: 'Understand and apply multiplication sign rules' },
            { day: 4, type: 'Develop', title: 'Multiplication Models', focus: 'Use various models to understand multiplication' },
            { day: 5, type: 'Refine', title: 'Multiplication Concepts', focus: 'Consolidate understanding and assess' }
          ]
        },
        {
          number: 11,
          title: 'Multiply Rational Numbers',
          pages: '193-210',
          standards: ['7.NS.A.2a'],
          objectives: ['Multiply rational numbers fluently', 'Apply properties of multiplication', 'Solve multiplication problems'],
          vocabulary: ['commutative property', 'associative property', 'distributive property', 'multiplicative identity'],
          assessments: ['Multiplication Fluency', 'Property Applications', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Multiplication Strategies', focus: 'Explore efficient multiplication strategies' },
            { day: 2, type: 'Develop', title: 'Fraction Multiplication', focus: 'Multiply fractions and mixed numbers' },
            { day: 3, type: 'Develop', title: 'Decimal Multiplication', focus: 'Multiply decimals efficiently' },
            { day: 4, type: 'Develop', title: 'Properties in Action', focus: 'Use multiplication properties strategically' },
            { day: 5, type: 'Refine', title: 'Multiplication Fluency', focus: 'Build fluency and assess skills' }
          ]
        },
        {
          number: 12,
          title: 'Understand Division of Rational Numbers',
          pages: '211-228',
          standards: ['7.NS.A.2b'],
          objectives: ['Understand division of rational numbers conceptually', 'Connect division to multiplication', 'Use division models'],
          vocabulary: ['dividend', 'divisor', 'quotient', 'reciprocal', 'multiplicative inverse'],
          assessments: ['Conceptual Understanding', 'Division Models', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Division Meaning', focus: 'Explore what division means with rational numbers' },
            { day: 2, type: 'Develop', title: 'Division as Multiplication', focus: 'Connect division to multiplying by reciprocals' },
            { day: 3, type: 'Develop', title: 'Division Models', focus: 'Use models to understand rational number division' },
            { day: 4, type: 'Develop', title: 'Sign Rules for Division', focus: 'Apply sign rules to division problems' },
            { day: 5, type: 'Refine', title: 'Division Concepts', focus: 'Consolidate division understanding and assess' }
          ]
        },
        {
          number: 13,
          title: 'Divide Rational Numbers',
          pages: '229-246',
          standards: ['7.NS.A.2c'],
          objectives: ['Divide rational numbers fluently', 'Solve division problems', 'Apply division in real contexts'],
          vocabulary: ['division algorithm', 'complex fractions', 'unit rates'],
          assessments: ['Division Fluency', 'Real-World Applications', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Division Strategies', focus: 'Explore efficient division strategies' },
            { day: 2, type: 'Develop', title: 'Fraction Division', focus: 'Divide fractions and mixed numbers' },
            { day: 3, type: 'Develop', title: 'Decimal Division', focus: 'Divide decimals efficiently' },
            { day: 4, type: 'Develop', title: 'Complex Fractions', focus: 'Simplify complex fraction expressions' },
            { day: 5, type: 'Refine', title: 'Division Mastery', focus: 'Build fluency and assess division skills' }
          ]
        }
      ]
    },
    {
      unit: 'Unit 3',
      title: 'Expressions and Equations',
      pages: '249-368',
      duration: '30 days',
      domain: 'Expressions and Equations',
      stemSpotlight: 'Ada Lovelace',
      standards: ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4'],
      lessons: [
        {
          number: 14,
          title: 'Write and Evaluate Expressions with Rational Numbers',
          pages: '251-268',
          standards: ['7.EE.A.1'],
          objectives: ['Add, subtract, factor, and expand linear expressions', 'Evaluate expressions with rational numbers', 'Interpret expressions in context'],
          vocabulary: ['linear expression', 'coefficient', 'constant term', 'like terms', 'factoring', 'expanding'],
          assessments: ['Expression Manipulation', 'Evaluation Practice', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Expression Structure', focus: 'Explore the structure of linear expressions' },
            { day: 2, type: 'Develop', title: 'Combining Like Terms', focus: 'Add and subtract linear expressions by combining like terms' },
            { day: 3, type: 'Develop', title: 'Factoring Expressions', focus: 'Factor linear expressions using the distributive property' },
            { day: 4, type: 'Develop', title: 'Expanding Expressions', focus: 'Expand factored expressions using the distributive property' },
            { day: 5, type: 'Refine', title: 'Expression Mastery', focus: 'Complex expression work and assessment' }
          ]
        },
        {
          number: 15,
          title: 'Solve Multi-Step Linear Equations',
          pages: '269-286',
          standards: ['7.EE.B.4a'],
          objectives: ['Solve multi-step linear equations', 'Use properties of equality', 'Check solutions'],
          vocabulary: ['linear equation', 'solution', 'properties of equality', 'inverse operations'],
          assessments: ['Equation Solving', 'Solution Verification', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Multi-Step Strategies', focus: 'Explore strategies for solving multi-step equations' },
            { day: 2, type: 'Develop', title: 'Variables on One Side', focus: 'Solve equations with variables on one side' },
            { day: 3, type: 'Develop', title: 'Variables on Both Sides', focus: 'Solve equations with variables on both sides' },
            { day: 4, type: 'Develop', title: 'Equations with Fractions', focus: 'Solve equations involving fractions and decimals' },
            { day: 5, type: 'Refine', title: 'Equation Solving Mastery', focus: 'Complex equations and assessment' }
          ]
        },
        {
          number: 16,
          title: 'Write and Solve Linear Equations',
          pages: '287-304',
          standards: ['7.EE.B.4a'],
          objectives: ['Write equations from word problems', 'Solve real-world linear equation problems', 'Interpret solutions in context'],
          vocabulary: ['mathematical modeling', 'word problems', 'solution interpretation'],
          assessments: ['Modeling Tasks', 'Real-World Problems', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'From Words to Equations', focus: 'Explore how to translate word problems into equations' },
            { day: 2, type: 'Develop', title: 'One-Step Word Problems', focus: 'Write and solve one-step equation word problems' },
            { day: 3, type: 'Develop', title: 'Multi-Step Word Problems', focus: 'Write and solve multi-step equation word problems' },
            { day: 4, type: 'Develop', title: 'Complex Applications', focus: 'Solve complex real-world equation problems' },
            { day: 5, type: 'Refine', title: 'Modeling Mastery', focus: 'Complex modeling tasks and assessment' }
          ]
        },
        {
          number: 17,
          title: 'Solve and Graph Inequalities',
          pages: '305-322',
          standards: ['7.EE.B.4b'],
          objectives: ['Solve one-variable inequalities', 'Graph inequality solutions', 'Interpret inequality solutions'],
          vocabulary: ['inequality', 'solution set', 'boundary point', 'interval notation'],
          assessments: ['Inequality Solving', 'Graphing Practice', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Inequality Concepts', focus: 'Explore the meaning of inequality solutions' },
            { day: 2, type: 'Develop', title: 'Solve Simple Inequalities', focus: 'Solve one-step and two-step inequalities' },
            { day: 3, type: 'Develop', title: 'Graph Solutions', focus: 'Graph inequality solutions on number lines' },
            { day: 4, type: 'Develop', title: 'Multi-Step Inequalities', focus: 'Solve complex inequalities' },
            { day: 5, type: 'Refine', title: 'Inequality Mastery', focus: 'Complex inequalities and assessment' }
          ]
        },
        {
          number: 18,
          title: 'Write and Solve Inequalities',
          pages: '323-340',
          standards: ['7.EE.B.4b'],
          objectives: ['Write inequalities from word problems', 'Solve real-world inequality problems', 'Interpret inequality solutions'],
          vocabulary: ['inequality modeling', 'constraint', 'feasible solutions'],
          assessments: ['Inequality Modeling', 'Real-World Applications', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Inequality Situations', focus: 'Explore real-world situations involving inequalities' },
            { day: 2, type: 'Develop', title: 'Write Inequalities', focus: 'Translate word problems into inequalities' },
            { day: 3, type: 'Develop', title: 'Solve Inequality Problems', focus: 'Solve real-world inequality problems' },
            { day: 4, type: 'Develop', title: 'Interpret Solutions', focus: 'Interpret inequality solutions in context' },
            { day: 5, type: 'Refine', title: 'Inequality Applications', focus: 'Complex inequality applications and assessment' }
          ]
        },
        {
          number: 19,
          title: 'Use Properties of Operations to Generate Equivalent Expressions',
          pages: '341-358',
          standards: ['7.EE.A.1', '7.EE.A.2'],
          objectives: ['Rewrite expressions in different forms', 'Understand expression equivalence', 'Use properties strategically'],
          vocabulary: ['equivalent expressions', 'expression forms', 'strategic manipulation'],
          assessments: ['Expression Equivalence', 'Strategic Reasoning', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Equivalent Forms', focus: 'Explore different forms of equivalent expressions' },
            { day: 2, type: 'Develop', title: 'Distributive Property', focus: 'Use the distributive property to create equivalent expressions' },
            { day: 3, type: 'Develop', title: 'Factoring vs Expanding', focus: 'Choose between factoring and expanding strategically' },
            { day: 4, type: 'Develop', title: 'Expression Reasoning', focus: 'Reason about expression equivalence and form' },
            { day: 5, type: 'Refine', title: 'Equivalent Expression Mastery', focus: 'Complex expression reasoning and assessment' }
          ]
        }
      ]
    },
    {
      unit: 'Unit 4',
      title: 'Percent and Proportional Relationships',
      pages: '371-430',
      duration: '10 days',
      domain: 'Ratios and Proportional Relationships',
      stemSpotlight: 'George Washington Carver',
      standards: ['7.RP.A.3'],
      lessons: [
        {
          number: 20,
          title: 'Solve Percent Problems',
          pages: '373-390',
          standards: ['7.RP.A.3'],
          objectives: ['Solve percent increase and decrease problems', 'Find percent of change', 'Apply percents to real situations'],
          vocabulary: ['percent change', 'percent increase', 'percent decrease', 'markup', 'discount'],
          assessments: ['Percent Applications', 'Real-World Problems', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Percent Change Situations', focus: 'Explore real-world percent change scenarios' },
            { day: 2, type: 'Develop', title: 'Percent Increase', focus: 'Calculate and apply percent increases' },
            { day: 3, type: 'Develop', title: 'Percent Decrease', focus: 'Calculate and apply percent decreases' },
            { day: 4, type: 'Develop', title: 'Complex Percent Problems', focus: 'Multi-step percent applications' },
            { day: 5, type: 'Refine', title: 'Percent Problem Mastery', focus: 'Complex percent scenarios and assessment' }
          ]
        },
        {
          number: 21,
          title: 'Apply Proportional Relationships',
          pages: '391-408',
          standards: ['7.RP.A.2', '7.RP.A.3'],
          objectives: ['Apply proportional reasoning to real problems', 'Use multiple solution strategies', 'Connect different representations'],
          vocabulary: ['proportional reasoning', 'cross products', 'unit rate method', 'scaling'],
          assessments: ['Proportional Applications', 'Strategy Comparison', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Proportional Problem Types', focus: 'Explore different types of proportional problems' },
            { day: 2, type: 'Develop', title: 'Cross Products Method', focus: 'Use cross products to solve proportional problems' },
            { day: 3, type: 'Develop', title: 'Unit Rate Method', focus: 'Use unit rates to solve proportional problems' },
            { day: 4, type: 'Develop', title: 'Strategy Comparison', focus: 'Compare different solution strategies' },
            { day: 5, type: 'Refine', title: 'Proportional Reasoning Mastery', focus: 'Complex proportional applications and assessment' }
          ]
        }
      ]
    },
    {
      unit: 'Unit 5',
      title: 'Sampling and Statistical Inference',
      pages: '433-492',
      duration: '15 days',
      domain: 'Statistics and Probability',
      stemSpotlight: 'Florence Nightingale',
      standards: ['7.SP.A.1', '7.SP.A.2'],
      lessons: [
        {
          number: 22,
          title: 'Understand Statistical Questions and Sampling',
          pages: '435-452',
          standards: ['7.SP.A.1'],
          objectives: ['Distinguish statistical from non-statistical questions', 'Understand sampling concepts', 'Identify populations and samples'],
          vocabulary: ['statistical question', 'population', 'sample', 'variability', 'bias'],
          assessments: ['Question Analysis', 'Sampling Design', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'What Makes It Statistical?', focus: 'Explore characteristics of statistical questions' },
            { day: 2, type: 'Develop', title: 'Populations vs Samples', focus: 'Understand the relationship between populations and samples' },
            { day: 3, type: 'Develop', title: 'Sampling Methods', focus: 'Learn about different sampling techniques' },
            { day: 4, type: 'Develop', title: 'Bias in Sampling', focus: 'Identify and avoid bias in sampling' },
            { day: 5, type: 'Refine', title: 'Statistical Thinking', focus: 'Apply statistical reasoning and assess concepts' }
          ]
        },
        {
          number: 23,
          title: 'Draw Inferences from Random Samples',
          pages: '453-470',
          standards: ['7.SP.A.2'],
          objectives: ['Use random samples to draw inferences', 'Understand sampling variability', 'Make predictions about populations'],
          vocabulary: ['random sample', 'inference', 'sampling variability', 'population parameter'],
          assessments: ['Inference Tasks', 'Sampling Simulations', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Sampling Variability', focus: 'Explore how samples vary from the same population' },
            { day: 2, type: 'Develop', title: 'Making Inferences', focus: 'Use sample data to make inferences about populations' },
            { day: 3, type: 'Develop', title: 'Sample Size Effects', focus: 'Understand how sample size affects inference quality' },
            { day: 4, type: 'Develop', title: 'Population Predictions', focus: 'Use samples to predict population characteristics' },
            { day: 5, type: 'Refine', title: 'Inference Mastery', focus: 'Complex inference tasks and assessment' }
          ]
        },
        {
          number: 24,
          title: 'Compare Data Distributions',
          pages: '471-488',
          standards: ['7.SP.B.3', '7.SP.B.4'],
          objectives: ['Compare data distributions visually', 'Use measures of center and spread', 'Draw comparative inferences'],
          vocabulary: ['distribution', 'measures of center', 'measures of spread', 'mean', 'median', 'range'],
          assessments: ['Data Comparison', 'Statistical Analysis', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Comparing Distributions', focus: 'Explore how to compare different data sets' },
            { day: 2, type: 'Develop', title: 'Visual Comparisons', focus: 'Use graphs to compare data distributions' },
            { day: 3, type: 'Develop', title: 'Numerical Comparisons', focus: 'Use statistics to compare distributions' },
            { day: 4, type: 'Develop', title: 'Drawing Inferences', focus: 'Make conclusions based on data comparisons' },
            { day: 5, type: 'Refine', title: 'Comparative Analysis Mastery', focus: 'Complex data comparisons and assessment' }
          ]
        }
      ]
    },
    {
      unit: 'Unit 6',
      title: 'Geometric Applications',
      pages: '495-608',
      duration: '25 days',
      domain: 'Geometry',
      stemSpotlight: 'Buckminster Fuller',
      standards: ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.5', '7.G.B.6'],
      lessons: [
        {
          number: 25,
          title: 'Scale Drawings and Similar Figures',
          pages: '497-514',
          standards: ['7.G.A.1'],
          objectives: ['Work with scale drawings', 'Understand similarity', 'Solve problems involving scale'],
          vocabulary: ['scale drawing', 'scale factor', 'similar figures', 'corresponding parts'],
          assessments: ['Scale Drawing Projects', 'Similarity Tasks', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Scale in the Real World', focus: 'Explore how scale is used in maps, blueprints, and models' },
            { day: 2, type: 'Develop', title: 'Creating Scale Drawings', focus: 'Create accurate scale drawings using given scale factors' },
            { day: 3, type: 'Develop', title: 'Finding Scale Factors', focus: 'Determine scale factors from given scale drawings' },
            { day: 4, type: 'Develop', title: 'Similar Figure Problems', focus: 'Solve problems involving similar figures and proportions' },
            { day: 5, type: 'Refine', title: 'Scale and Similarity Mastery', focus: 'Complex scale and similarity applications' }
          ]
        },
        {
          number: 26,
          title: 'Draw Geometric Figures',
          pages: '515-532',
          standards: ['7.G.A.2'],
          objectives: ['Draw geometric figures with given conditions', 'Understand construction constraints', 'Analyze figure properties'],
          vocabulary: ['geometric construction', 'constraints', 'unique construction', 'triangle inequality'],
          assessments: ['Construction Projects', 'Constraint Analysis', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Construction Challenges', focus: 'Explore what makes geometric constructions possible or impossible' },
            { day: 2, type: 'Develop', title: 'Triangle Constructions', focus: 'Construct triangles given various conditions' },
            { day: 3, type: 'Develop', title: 'Angle Constructions', focus: 'Construct angles and angle relationships' },
            { day: 4, type: 'Develop', title: 'Complex Constructions', focus: 'Create complex geometric figures with multiple constraints' },
            { day: 5, type: 'Refine', title: 'Construction Mastery', focus: 'Advanced construction challenges and assessment' }
          ]
        },
        {
          number: 27,
          title: 'Describe Cross Sections of Three-Dimensional Figures',
          pages: '533-550',
          standards: ['7.G.A.3'],
          objectives: ['Describe cross sections of 3D figures', 'Visualize spatial relationships', 'Connect 2D and 3D geometry'],
          vocabulary: ['cross section', 'three-dimensional figures', 'plane', 'intersection'],
          assessments: ['Cross Section Identification', 'Spatial Reasoning Tasks', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Slicing 3D Figures', focus: 'Explore what happens when planes intersect 3D figures' },
            { day: 2, type: 'Develop', title: 'Prism Cross Sections', focus: 'Identify cross sections of various prisms' },
            { day: 3, type: 'Develop', title: 'Pyramid Cross Sections', focus: 'Identify cross sections of pyramids and cones' },
            { day: 4, type: 'Develop', title: 'Complex 3D Figures', focus: 'Analyze cross sections of complex three-dimensional figures' },
            { day: 5, type: 'Refine', title: 'Spatial Reasoning Mastery', focus: 'Advanced spatial reasoning and assessment' }
          ]
        },
        {
          number: 28,
          title: 'Find Volume and Surface Area of Cylinders',
          pages: '551-568',
          standards: ['7.G.B.6'],
          objectives: ['Calculate volume and surface area of cylinders', 'Apply formulas to real problems', 'Connect to circle geometry'],
          vocabulary: ['cylinder', 'volume', 'surface area', 'lateral surface area'],
          assessments: ['Cylinder Calculations', 'Real-World Applications', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Cylinder Properties', focus: 'Explore the structure and properties of cylinders' },
            { day: 2, type: 'Develop', title: 'Volume of Cylinders', focus: 'Learn and apply the volume formula V = πr²h' },
            { day: 3, type: 'Develop', title: 'Surface Area of Cylinders', focus: 'Learn and apply surface area formulas' },
            { day: 4, type: 'Develop', title: 'Cylinder Applications', focus: 'Apply cylinder formulas to real-world problems' },
            { day: 5, type: 'Refine', title: 'Cylinder Mastery', focus: 'Complex cylinder problems and assessment' }
          ]
        },
        {
          number: 29,
          title: 'Find Volume and Surface Area of Cones',
          pages: '569-586',
          standards: ['7.G.B.6'],
          objectives: ['Calculate volume and surface area of cones', 'Compare cones to cylinders', 'Solve real-world cone problems'],
          vocabulary: ['cone', 'apex', 'slant height', 'lateral surface'],
          assessments: ['Cone Calculations', 'Comparison Tasks', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Cone Structure', focus: 'Explore the relationship between cones and cylinders' },
            { day: 2, type: 'Develop', title: 'Volume of Cones', focus: 'Learn and apply the volume formula V = (1/3)πr²h' },
            { day: 3, type: 'Develop', title: 'Surface Area of Cones', focus: 'Calculate lateral and total surface area of cones' },
            { day: 4, type: 'Develop', title: 'Cone Applications', focus: 'Apply cone formulas to real-world situations' },
            { day: 5, type: 'Refine', title: 'Cone Mastery', focus: 'Complex cone problems and assessment' }
          ]
        }
      ]
    },
    {
      unit: 'Unit 7',
      title: 'Statistics and Probability',
      pages: '611-720',
      duration: '20 days',
      domain: 'Statistics and Probability',
      stemSpotlight: 'David Blackwell',
      standards: ['7.SP.B.5', '7.SP.B.6', '7.SP.B.7', '7.SP.B.8'],
      lessons: [
        {
          number: 30,
          title: 'Find Volume and Surface Area of Spheres',
          pages: '613-630',
          standards: ['7.G.B.6'],
          objectives: ['Calculate volume and surface area of spheres', 'Apply sphere formulas', 'Connect to real-world contexts'],
          vocabulary: ['sphere', 'hemisphere', 'great circle'],
          assessments: ['Sphere Calculations', 'Real-World Applications', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Sphere Properties', focus: 'Explore the unique properties of spheres' },
            { day: 2, type: 'Develop', title: 'Volume of Spheres', focus: 'Learn and apply V = (4/3)πr³' },
            { day: 3, type: 'Develop', title: 'Surface Area of Spheres', focus: 'Learn and apply SA = 4πr²' },
            { day: 4, type: 'Develop', title: 'Sphere Applications', focus: 'Apply sphere formulas to real-world problems' },
            { day: 5, type: 'Refine', title: 'Sphere Mastery', focus: 'Complex sphere problems and assessment' }
          ]
        },
        {
          number: 31,
          title: 'Understand Statistical Questions and Data Distributions',
          pages: '631-648',
          standards: ['7.SP.A.1'],
          objectives: ['Understand statistical questions and data distributions', 'Analyze data variability', 'Compare different distributions'],
          vocabulary: ['statistical question', 'data distribution', 'variability', 'shape', 'center', 'spread'],
          assessments: ['Distribution Analysis', 'Variability Tasks', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Data Distributions', focus: 'Explore how data can be distributed in different ways' },
            { day: 2, type: 'Develop', title: 'Measures of Center', focus: 'Calculate and interpret mean, median, and mode' },
            { day: 3, type: 'Develop', title: 'Measures of Spread', focus: 'Calculate and interpret range and interquartile range' },
            { day: 4, type: 'Develop', title: 'Distribution Shapes', focus: 'Describe and compare shapes of data distributions' },
            { day: 5, type: 'Refine', title: 'Distribution Analysis Mastery', focus: 'Complex distribution analysis and assessment' }
          ]
        },
        {
          number: 32,
          title: 'Analyze Data Distributions',
          pages: '649-666',
          standards: ['7.SP.B.3', '7.SP.B.4'],
          objectives: ['Analyze data distributions using multiple measures', 'Make comparisons between data sets', 'Draw conclusions from data'],
          vocabulary: ['box plot', 'dot plot', 'histogram', 'outlier', 'interquartile range'],
          assessments: ['Data Analysis Projects', 'Comparison Tasks', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Visual Data Analysis', focus: 'Explore how different graphs reveal different aspects of data' },
            { day: 2, type: 'Develop', title: 'Box Plots', focus: 'Create and interpret box plots' },
            { day: 3, type: 'Develop', title: 'Comparative Analysis', focus: 'Compare data sets using multiple representations' },
            { day: 4, type: 'Develop', title: 'Data-Based Conclusions', focus: 'Draw valid conclusions from data analysis' },
            { day: 5, type: 'Refine', title: 'Data Analysis Mastery', focus: 'Complex data analysis projects and assessment' }
          ]
        },
        {
          number: 33,
          title: 'Find Probability of Simple and Compound Events',
          pages: '667-684',
          standards: ['7.SP.B.5', '7.SP.B.6', '7.SP.B.7', '7.SP.B.8'],
          objectives: ['Calculate probabilities of simple and compound events', 'Use theoretical and experimental probability', 'Apply probability to real situations'],
          vocabulary: ['probability', 'sample space', 'event', 'theoretical probability', 'experimental probability', 'compound events'],
          assessments: ['Probability Calculations', 'Simulation Activities', 'Lesson Quiz'],
          sessions: [
            { day: 1, type: 'Explore', title: 'Probability Concepts', focus: 'Explore the meaning and calculation of probability' },
            { day: 2, type: 'Develop', title: 'Simple Events', focus: 'Calculate probabilities of simple events' },
            { day: 3, type: 'Develop', title: 'Compound Events', focus: 'Calculate probabilities of compound events' },
            { day: 4, type: 'Develop', title: 'Simulations', focus: 'Use simulations to estimate probabilities' },
            { day: 5, type: 'Refine', title: 'Probability Mastery', focus: 'Complex probability problems and assessment' }
          ]
        }
      ]
    }
  ];

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="text-green-600 hover:text-green-800 font-medium">
                ← Back to Curriculum
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-800">Grade 7 Mathematics</h1>
            </div>
            <div className="flex space-x-2">
              <Link href="/curriculum/grade-6" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Grade 6</Link>
              <Link href="/curriculum/grade-8" className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Grade 8</Link>
              <Link href="/curriculum/algebra-1" className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Algebra 1</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Ready Classroom Mathematics Grade 7
            </h1>
            <p className="text-lg text-gray-600">
              Complete Scope and Sequence • Proportional Reasoning Mastery
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">720</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600">Units</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">170</div>
              <div className="text-sm text-gray-600">School Days</div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mathematical Focus Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <span className="text-2xl mr-3">📐</span>
              <span className="font-medium">Proportional Relationships</span>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-3">🔢</span>
              <span className="font-medium">Rational Number Operations</span>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl mr-3">📝</span>
              <span className="font-medium">Expressions and Equations</span>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-2xl mr-3">📏</span>
              <span className="font-medium">Geometry</span>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <span className="text-2xl mr-3">📊</span>
              <span className="font-medium">Statistics and Probability</span>
            </div>
          </div>
        </div>

        {/* Standards Alignment */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Common Core Standards Alignment</h2>
          <div className="flex flex-wrap gap-2">
            {['7.RP', '7.NS', '7.EE', '7.G', '7.SP'].map(standard => (
              <span key={standard} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {standard}
              </span>
            ))}
          </div>
        </div>

        {/* Unit Breakdown with Detailed Lessons */}
        <div className="space-y-6">
          {units.map((unit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{unit.unit}: {unit.title}</h3>
                    <p className="text-green-100 mt-2">
                      <strong>Domain:</strong> {unit.domain} • <strong>Pages:</strong> {unit.pages} • <strong>Duration:</strong> {unit.duration}
                    </p>
                    <p className="text-green-100 mt-1">
                      <strong>STEM Spotlight:</strong> {unit.stemSpotlight}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unit.standards.map((standard, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-500 text-green-100 text-xs rounded">
                      {standard}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Lessons ({unit.lessons.length})</h4>
                <div className="space-y-3">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Lesson Header - Clickable */}
                      <button
                        onClick={() => toggleLesson(lesson.number)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <span className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                            {lesson.number}
                          </span>
                          <div>
                            <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                            <p className="text-sm text-gray-600">Pages {lesson.pages}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-wrap gap-1">
                            {lesson.standards.map((standard, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                                {standard}
                              </span>
                            ))}
                          </div>
                          <span className={`transform transition-transform ${expandedLessons.has(lesson.number) ? 'rotate-180' : ''}`}>
                            ⌄
                          </span>
                        </div>
                      </button>

                      {/* Expanded Lesson Details */}
                      {expandedLessons.has(lesson.number) && (
                        <div className="p-4 bg-white border-t">
                          {/* Session Breakdown */}
                          {lesson.sessions && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                              <h6 className="font-bold text-gray-800 mb-3 flex items-center">
                                📅 <span className="ml-2">5-Day Session Breakdown</span>
                              </h6>
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                {lesson.sessions.map((session, idx) => (
                                  <div key={idx} className={`p-3 rounded-lg border-2 ${
                                    session.type === 'Explore' ? 'bg-green-50 border-green-200' :
                                    session.type === 'Develop' ? 'bg-blue-50 border-blue-200' :
                                    'bg-purple-50 border-purple-200'
                                  }`}>
                                    <div className="text-center">
                                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm ${
                                        session.type === 'Explore' ? 'bg-green-500' :
                                        session.type === 'Develop' ? 'bg-blue-500' :
                                        'bg-purple-500'
                                      }`}>
                                        {session.day}
                                      </div>
                                      <div className={`text-xs font-semibold mb-1 ${
                                        session.type === 'Explore' ? 'text-green-700' :
                                        session.type === 'Develop' ? 'text-blue-700' :
                                        'text-purple-700'
                                      }`}>
                                        {session.type}
                                      </div>
                                      <div className="text-xs font-medium text-gray-800 mb-1">
                                        {session.title}
                                      </div>
                                      <div className="text-xs text-gray-600 leading-tight">
                                        {session.focus}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Learning Objectives */}
                            <div>
                              <h6 className="font-semibold text-gray-800 mb-2">🎯 Learning Objectives</h6>
                              <ul className="space-y-1">
                                {lesson.objectives.map((objective, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                                    <span className="text-green-500 mr-2">•</span>
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Key Vocabulary */}
                            <div>
                              <h6 className="font-semibold text-gray-800 mb-2">📚 Key Vocabulary</h6>
                              <div className="flex flex-wrap gap-1">
                                {lesson.vocabulary.map((term, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Assessment Types */}
                            <div>
                              <h6 className="font-semibold text-gray-800 mb-2">📝 Assessments</h6>
                              <div className="space-y-1">
                                {lesson.assessments.map((assessment, idx) => (
                                  <div key={idx} className="flex items-center text-sm text-gray-700">
                                    <span className="text-purple-500 mr-2">✓</span>
                                    {assessment}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Standards Detail */}
                            <div>
                              <h6 className="font-semibold text-gray-800 mb-2">📋 Standards Covered</h6>
                              <div className="space-y-1">
                                {lesson.standards.map((standard, idx) => (
                                  <div key={idx} className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                                    <strong>{standard}</strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pacing Options */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pacing Guide Options</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-600 mb-2">Traditional Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">180-day school year</p>
              <div className="text-2xl font-bold text-gray-800">170 days</div>
            </div>
            <div className="p-4 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-600 mb-2">Accelerated Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">160-day intensive</p>
              <div className="text-2xl font-bold text-gray-800">150 days</div>
            </div>
            <div className="p-4 border border-purple-200 rounded-lg">
              <h3 className="font-bold text-purple-600 mb-2">Block Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">90-minute periods</p>
              <div className="text-2xl font-bold text-gray-800">85 days</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/pacing-generator"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Custom Pacing Guide
          </Link>
          <Link
            href="/curriculum/grade-8"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue to Grade 8 →
          </Link>
        </div>
      </div>
    </div>
  );
}
