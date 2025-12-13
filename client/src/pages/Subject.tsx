import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Subject {
  id: string;
  name: string;
  video_url: string;
  questions: Question[];
}

type QuizState = 'idle' | 'taking' | 'completed';

/**
 * Subject Page - Video and Quiz Display
 * Design: Modern Minimalist with Arabic Typography
 * - Clean two-column layout for video and quiz
 * - Responsive design for mobile viewing
 * - Interactive quiz with immediate feedback
 */
export default function Subject() {
  const [match, params] = useRoute('/subject/:id');
  const [, setLocation] = useLocation();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!match) return;

    fetch('/quizzes_data.json')
      .then(res => res.json())
      .then(data => {
        const found = data.subjects.find((s: Subject) => s.id === params?.id);
        if (found) {
          setSubject(found);
          setAnswers(new Array(found.questions.length).fill(-1));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load subject:', err);
        setLoading(false);
      });
  }, [match, params?.id]);

  if (!match || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">لم يتم العثور على المادة</p>
          <Button onClick={() => setLocation('/')}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (quizState === 'taking') {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = optionIndex;
      setAnswers(newAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < subject.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    answers.forEach((answer, idx) => {
      if (answer === subject.questions[idx].correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setQuizState('completed');
  };

  const handleStartQuiz = () => {
    setQuizState('taking');
    setCurrentQuestion(0);
    setAnswers(new Array(subject.questions.length).fill(-1));
  };

  const handleRestartQuiz = () => {
    setQuizState('idle');
    setCurrentQuestion(0);
    setAnswers(new Array(subject.questions.length).fill(-1));
    setScore(0);
  };

  const question = subject.questions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== -1;
  const isCorrect = isAnswered && answers[currentQuestion] === question.correct;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation('/')}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              العودة
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{subject.name}</h1>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black relative">
                <iframe
                  width="100%"
                  height="100%"
                  src={subject.video_url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0]}
                  title={subject.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardHeader>
                <CardTitle>شرح المادة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  شاهد الفيديو بعناية ثم قم بحل الكويز لاختبار معلوماتك
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">الكويز</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {quizState === 'idle' && (
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">
                      {subject.questions.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      أسئلة متعددة الخيارات
                    </p>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleStartQuiz}
                    >
                      ابدأ الكويز
                    </Button>
                  </div>
                )}

                {quizState === 'taking' && (
                  <div className="space-y-6">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-foreground">
                          السؤال {currentQuestion + 1} من {subject.questions.length}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(((currentQuestion + 1) / subject.questions.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${((currentQuestion + 1) / subject.questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground text-sm leading-relaxed">
                        {question.question}
                      </h3>

                      {/* Options */}
                      <div className="space-y-2">
                        {question.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswerSelect(idx)}
                            className={`w-full text-right p-3 rounded-lg border-2 transition-all text-sm ${
                              answers[currentQuestion] === idx
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestion === 0}
                        className="flex-1"
                      >
                        السابق
                      </Button>
                      {currentQuestion < subject.questions.length - 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextQuestion}
                          className="flex-1"
                        >
                          التالي
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={handleSubmitQuiz}
                          disabled={answers.some(a => a === -1)}
                        >
                          إرسال الإجابات
                        </Button>
                      )}
                    </div>

                    {/* Answered Indicator */}
                    <div className="text-xs text-muted-foreground text-center">
                      {answers.filter(a => a !== -1).length} من {subject.questions.length} تم الإجابة عليها
                    </div>
                  </div>
                )}

                {quizState === 'completed' && (
                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <div className="text-5xl font-bold text-primary">
                        {score}/{subject.questions.length}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((score / subject.questions.length) * 100)}% من الإجابات صحيحة
                      </p>
                    </div>

                    {/* Result Message */}
                    <div className={`p-4 rounded-lg ${
                      score >= subject.questions.length * 0.7
                        ? 'bg-green-50 text-green-800'
                        : 'bg-orange-50 text-orange-800'
                    }`}>
                      <p className="text-sm font-semibold">
                        {score >= subject.questions.length * 0.7
                          ? '🎉 ممتاز! أنت تفهم المادة جيداً'
                          : '📚 حاول مرة أخرى لتحسين النتيجة'}
                      </p>
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleRestartQuiz}
                    >
                      <RotateCcw className="w-4 h-4 ml-2" />
                      إعادة الكويز
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {quizState === 'completed' && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الإجابات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subject.questions.map((q, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        {answers[idx] === q.correct ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm mb-2">
                            السؤال {idx + 1}: {q.question}
                          </p>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-semibold">إجابتك:</span> {q.options[answers[idx]]}
                              {answers[idx] === q.correct && (
                                <span className="text-green-600 mr-2">✓</span>
                              )}
                              {answers[idx] !== q.correct && (
                                <span className="text-red-600 mr-2">✗</span>
                              )}
                            </p>
                            {answers[idx] !== q.correct && (
                              <p className="text-muted-foreground">
                                <span className="font-semibold">الإجابة الصحيحة:</span> {q.options[q.correct]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
