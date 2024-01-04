class QuizViewModel {
  Id = 0
  MateriId = 0
  Title = ""
  TimeLimit = 0
  finishedTime=0
  quizQuestions = new Array<QuizQuestionViewModel>[];
}

class QuizQuestionViewModel {
  Id = 0
  Question = ""
  quizQuestionDetails= new Array<QuizQuestionDetailViewModel>[];
}

class QuizQuestionDetailViewModel{
  Id=0
  Choice=""
  Description=""
  IsAnswer=false
  isSelected=false
}

export {QuizViewModel,QuizQuestionViewModel,QuizQuestionDetailViewModel};