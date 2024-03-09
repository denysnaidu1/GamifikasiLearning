class QuizViewModel {
  Id = 0
  MateriId = 0
  Title = ""
  TimeLimit = 0
  finishedTime=0
  quizQuestions = new Array<QuizQuestionViewModel>[];
  mode = ""
}

class QuizQuestionViewModel {
  Id = 0
  Question = ""
  quizQuestionDetails= new Array<QuizQuestionDetailViewModel>[];
  mode = ""
}

class QuizQuestionDetailViewModel{
  Id=0
  Choice=""
  Description=""
  IsAnswer=false
  isSelected=false
  mode = ""
}

export {QuizViewModel,QuizQuestionViewModel,QuizQuestionDetailViewModel};