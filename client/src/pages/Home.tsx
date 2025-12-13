import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Play, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';

interface Subject {
  id: string;
  name: string;
  video_url: string;
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
}

/**
 * Home Page - Educational Platform
 * Design: Modern Minimalist with Arabic Typography
 * - Clean card-based layout with warm orange accents
 * - Deep indigo primary color for trust and focus
 * - Generous whitespace and elegant typography
 */
export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Load quiz data from public JSON file
    fetch('/quizzes_data.json')
      .then(res => res.json())
      .then(data => {
        setSubjects(data.subjects);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load quiz data:', err);
        setLoading(false);
      });
  }, []);

  const handleSubjectClick = (subjectId: string) => {
    setLocation(`/subject/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">منصة تعليمية</h1>
            </div>
            <p className="text-sm text-muted-foreground">Educational Platform</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                تعلم التقنيات الحديثة
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                منصة تعليمية شاملة تقدم دورات متخصصة في أنظمة التشغيل والشبكات والأمن السيبراني مع فيديوهات شرح وكويزات تفاعلية
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  ابدأ التعلم الآن
                </Button>
                <Button size="lg" variant="outline">
                  اعرف المزيد
                </Button>
              </div>
            </div>
            <div className="relative h-96 md:h-full">
              <img 
                src="/images/hero-banner.png" 
                alt="Educational Platform" 
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              المواد الدراسية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر المادة التي تريد تعلمها واستمتع بفيديوهات شرح عالية الجودة وكويزات تفاعلية
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card 
                  key={subject.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                  onClick={() => handleSubjectClick(subject.id)}
                >
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                    <BookOpen className="w-16 h-16 text-primary opacity-50 group-hover:opacity-70 transition-opacity" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">
                      {subject.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {subject.questions.length} أسئلة تفاعلية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Play className="w-4 h-4 text-secondary" />
                        <span>فيديو شرح متضمن</span>
                      </div>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubjectClick(subject.id);
                        }}
                      >
                        ابدأ الآن
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground text-center mb-16">
            مميزات المنصة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: 'فيديوهات شرح',
                description: 'فيديوهات عالية الجودة توضح كل مفهوم بالتفصيل'
              },
              {
                icon: CheckCircle2,
                title: 'كويزات تفاعلية',
                description: 'اختبر معلوماتك مع كويزات تلقائية التصحيح'
              },
              {
                icon: BookOpen,
                title: 'محتوى شامل',
                description: 'مواد دراسية متنوعة تغطي أساسيات التقنية'
              }
            ].map((feature, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">عن المنصة</h4>
              <p className="text-sm text-muted-foreground">
                منصة تعليمية متخصصة في تقديم دورات تقنية عالية الجودة
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">المواد</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">أنظمة التشغيل</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">الشبكات</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">الأمن السيبراني</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">التواصل</h4>
              <p className="text-sm text-muted-foreground">
                للاستفسارات والاقتراحات<br/>
                contact@platform.edu
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 منصة تعليمية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
