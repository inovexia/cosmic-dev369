import React from 'react';

const QuestionList = ({ questions }) => {
  // Organize questions into parent-child structure
  const questionMap = {};
  questions && questions.forEach((question) => {
    if (question.parent_id === 0) {
      questionMap[question.id] = { ...question, subquestions: [] };
    } else {
      questionMap[question.parent_id].subquestions.push(question);
    }
  });

  return (
    <div>
      {Object.values(questionMap).map((parentQuestion) => (
        <div key={parentQuestion.id}>
          <p>Direction: {parentQuestion.question}</p>
          {parentQuestion.subquestions.map((subquestion, index) => (
            <div key={subquestion.id}>
              {index + 1}. {subquestion.question}
              <ul>
                {subquestion.choice.map((item, choiceIndex) => (
                  <li key={choiceIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
