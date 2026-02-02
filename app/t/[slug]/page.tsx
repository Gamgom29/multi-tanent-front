import { notFound } from 'next/navigation';
import Link from 'next/link';

interface TenantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getTenantData(slug: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/tenants/by-slug/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { slug } = await params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const tenantName = tenant.name || tenant.companyName || 'شركتنا';
  const stats = tenant.stats || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              مرحباً بك في {tenantName}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              منصة متكاملة لإدارة أعمالك بكفاءة واحترافية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/t/${slug}/login`}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg shadow-lg"
              >
                تسجيل الدخول
              </Link>
              <Link
                href={`/t/${slug}/dashboard`}
                className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold text-lg border-2 border-white"
              >
                ابدأ الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {Object.keys(stats).length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.customersCount !== undefined && (
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {stats.customersCount.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-gray-600 font-medium">عميل نشط</div>
                </div>
              )}
              {stats.invoicesCount !== undefined && (
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                    {stats.invoicesCount.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-gray-600 font-medium">فاتورة</div>
                </div>
              )}
              {stats.revenueSum !== undefined && (
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                    {stats.revenueSum.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-gray-600 font-medium">إجمالي الإيرادات</div>
                </div>
              )}
              {stats.customersCount !== undefined && stats.invoicesCount !== undefined && (
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    {Math.round((stats.invoicesCount / stats.customersCount) * 10) / 10}
                  </div>
                  <div className="text-gray-600 font-medium">متوسط الفواتير</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              لماذا تختار {tenantName}؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              حلول متكاملة لإدارة أعمالك بكفاءة عالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">إدارة شاملة</h3>
              <p className="text-gray-600">
                إدارة العملاء والفواتير والمدفوعات من مكان واحد
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">سرعة وأداء</h3>
              <p className="text-gray-600">
                واجهة سريعة وسلسة لتجربة استخدام ممتازة
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">أمان عالي</h3>
              <p className="text-gray-600">
                حماية متقدمة لبياناتك ومعلومات عملائك
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">تقارير ذكية</h3>
              <p className="text-gray-600">
                تقارير وإحصائيات مفصلة لاتخاذ قرارات أفضل
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">سهولة الاستخدام</h3>
              <p className="text-gray-600">
                واجهة بسيطة وواضحة لا تحتاج تدريب
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">متوافق مع جميع الأجهزة</h3>
              <p className="text-gray-600">
                يعمل بسلاسة على الكمبيوتر والهاتف والتابلت
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ابدأ إدارة أعمالك الآن
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            انضم إلى آلاف الشركات التي تثق بنا في إدارة أعمالها
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/t/${slug}/login`}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg shadow-lg"
            >
              تسجيل الدخول
            </Link>
            <Link
              href={`/t/${slug}/dashboard`}
              className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold text-lg border-2 border-white"
            >
              جرب مجاناً
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{tenantName}</h3>
              <p className="text-gray-400">
                منصة متكاملة لإدارة أعمالك بكفاءة واحترافية
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`/t/${slug}/login`} className="hover:text-white transition-colors">
                    تسجيل الدخول
                  </Link>
                </li>
                <li>
                  <Link href={`/t/${slug}/dashboard`} className="hover:text-white transition-colors">
                    لوحة التحكم
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">تواصل معنا</h4>
              <p className="text-gray-400">
                لديك استفسار؟ نحن هنا لمساعدتك
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {tenantName}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
