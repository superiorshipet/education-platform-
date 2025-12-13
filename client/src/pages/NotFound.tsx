import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

/**
 * NotFound Page - 404 Error Page
 * Design: Consistent with platform design
 */
export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">الصفحة غير موجودة</p>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة. قد تكون قد حذفت أو تم نقلها.
        </p>
        <Button 
          onClick={() => setLocation('/')}
          className="bg-primary hover:bg-primary/90"
        >
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
