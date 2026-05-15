import { Link } from "react-router-dom";
import { Crown, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-obsidian-900 border-t border-gold-900 border-opacity-30 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-end mb-3">
              <Crown size={18} className="text-gold-500" />
              <span className="font-cormorant text-3xl gold-text tracking-widest">MIDO STORE</span>
              <Crown size={18} className="text-gold-500" />
            </div>
            <p className="text-obsidian-400 text-sm leading-relaxed max-w-xs mx-auto md:mr-0">
              وجهتك الأولى للأزياء الراقية والفاخرة. نقدم أفضل التصميمات العالمية بأسعار مميزة وجودة لا تُضاهى.
            </p>
          </div>

          {/* Quick links */}
          <div className="text-center">
            <h4 className="font-cairo font-bold text-gold-500 mb-4 text-lg">روابط سريعة</h4>
            <ul className="space-y-2">
              {["الرئيسية", "رجالي", "نسائي", "إكسسوارات", "أحذية"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-obsidian-400 hover:text-gold-500 transition-colors text-sm font-cairo">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-cairo font-bold text-gold-500 mb-4 text-lg">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-center md:justify-start text-obsidian-400 text-sm">
                <Phone size={14} className="text-gold-600 flex-shrink-0" />
                <span dir="ltr">+20 114 330 4017</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start text-obsidian-400 text-sm">
                <MapPin size={14} className="text-gold-600 flex-shrink-0" />
                <span>مصر</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start text-obsidian-400 text-sm">
                <Clock size={14} className="text-gold-600 flex-shrink-0" />
                <span>السبت - الخميس: 10 ص - 10 م</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gold-divider"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4">
          <p className="text-obsidian-500 text-xs font-cairo">
            © 2025 Mido Store — جميع الحقوق محفوظة
          </p>
          <Link to="/admin" className="text-obsidian-600 hover:text-gold-700 text-xs font-cairo transition-colors">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  );
}
