// helper function
function calculateWeightedAverage(assignments, submissions) {
    let totalScore = 0;
    let totalWeight = 0;
  
    assignments.forEach(assignment => {
      const submission = submissions.find(submission => submission.assignment_id === assignment.id);
      if (submission && submission.submission.submitted_at <= assignment.due_at) {
        const score = submission.submission.score * (1 - calculateLatePenalty(assignment.due_at, submission.submission.submitted_at));
        totalScore += score;
        totalWeight += assignment.points_possible;
      }
    });
  
    return totalWeight === 0 ? 0 : (totalScore / totalWeight) * 100;
  }
  
  function calculateLatePenalty(dueDate, submittedDate) {
    const dueDateTime = new Date(dueDate).getTime();
    const submittedDateTime = new Date(submittedDate).getTime();
    if (submittedDateTime > dueDateTime) {
      const diffInDays = (submittedDateTime - dueDateTime) / (1000 * 3600 * 24);
      return Math.min(Math.floor(diffInDays / 7) * 0.1, 1);
    }
    return 0;
  }
  
  function calculatePercentageScore(submission, assignment) {
    if (assignment.points_possible === 0) {
      return null; // Avoid division by zero
    }
    return (submission.score / assignment.points_possible) * 100;
  }

//   Real function

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  // Validate course ID
  if (assignmentGroup.course_id !== courseInfo.id) {
    throw new Error("Invalid input: AssignmentGroup does not belong to the specified course.");
  }

  const learnerData = [];

  learnerSubmissions.forEach(submission => {
    const learnerInfo = {
      id: submission.learner_id,
      avg: null,
    };

    // Calculate weighted average score
    learnerInfo.avg = calculateWeightedAverage(assignmentGroup.assignments, learnerSubmissions.filter(sub => sub.learner_id === submission.learner_id));

    // Calculate percentage scores for assignments
    assignmentGroup.assignments.forEach(assignment => {
      const learnerSubmission = learnerSubmissions.find(sub => sub.assignment_id === assignment.id && sub.learner_id === submission.learner_id); // Change 'submission' to 'learnerSubmission'
      if (learnerSubmission && learnerSubmission.submission.submitted_at <= assignment.due_at) { // Change 'submission' to 'learnerSubmission'
        learnerInfo[assignment.id] = calculatePercentageScore(learnerSubmission.submission, assignment); // Change 'submission' to 'learnerSubmission'
      }
    });

    learnerData.push(learnerInfo);
  });

  return learnerData;
}

  

//   Testing Phase
// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  // Test the getLearnerData function
  try {
    const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
  