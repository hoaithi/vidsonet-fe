"use client";

import { useEffect, useState } from "react";

export default function AdLandingPage() {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const distance = midnight.getTime() - now;

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const products = [
    {
      id: 1,
      name: "Tai nghe Premium",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop",
      price: 2500000,
      originalPrice: 5000000,
    },
    {
      id: 2,
      name: "Đồng hồ thông minh",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop",
      price: 3000000,
      originalPrice: 6000000,
    },
    {
      id: 3,
      name: "Kính mát thời trang",
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop",
      price: 1500000,
      originalPrice: 3000000,
    },
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  const handleBuyClick = () => {
    alert(
      "🎉 Cảm ơn bạn đã quan tâm! Tính năng mua hàng đang được phát triển."
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-white text-2xl font-bold">🎯 YourBrand</div>
          <nav className="hidden md:flex gap-6">
            <a
              href="#"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              Trang chủ
            </a>
            <a
              href="#"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              Sản phẩm
            </a>
            <a
              href="#"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              Liên hệ
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          {/* Limited Time Badge */}
          <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
            ⚡ KHUYẾN MÃI CÓ HẠN
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Giảm Giá
            <span className="text-yellow-300"> 50%</span>
            <br />
            Chỉ Hôm Nay!
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Đừng bỏ lỡ cơ hội sở hữu sản phẩm cao cấp với mức giá không thể tin
            được!
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 mb-10">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-yellow-300">
                {String(countdown.hours).padStart(2, "0")}
              </div>
              <div className="text-white text-xs uppercase">Giờ</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-yellow-300">
                {String(countdown.minutes).padStart(2, "0")}
              </div>
              <div className="text-white text-xs uppercase">Phút</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-yellow-300">
                {String(countdown.seconds).padStart(2, "0")}
              </div>
              <div className="text-white text-xs uppercase">Giây</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleBuyClick}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xl font-bold px-12 py-5 rounded-full shadow-2xl transition-all transform hover:scale-105 mb-4 animate-pulse"
          >
            🎁 NHẬN ƯU ĐÃI NGAY
          </button>

          <p className="text-white/70 text-sm">
            ✓ Miễn phí vận chuyển &nbsp;•&nbsp; ✓ Đổi trả trong 30 ngày
            &nbsp;•&nbsp; ✓ Bảo hành 2 năm
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform"
            >
              <div className="relative h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -50%
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleBuyClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Mua Ngay
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: "🚚", title: "Giao hàng miễn phí", subtitle: "Toàn quốc" },
            {
              icon: "🔒",
              title: "Thanh toán an toàn",
              subtitle: "Bảo mật 100%",
            },
            {
              icon: "⭐",
              title: "Đánh giá 5 sao",
              subtitle: "10,000+ khách hàng",
            },
            {
              icon: "🎁",
              title: "Quà tặng hấp dẫn",
              subtitle: "Cho đơn đầu tiên",
            },
          ].map((badge, index) => (
            <div
              key={index}
              className="animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h4 className="text-white font-bold mb-1">{badge.title}</h4>
              <p className="text-white/70 text-sm">{badge.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center bg-white/10 backdrop-blur-md rounded-3xl p-12 border-2 border-yellow-400">
          <h2 className="text-4xl font-bold text-white mb-4">
            Còn chờ gì nữa?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Ưu đãi này sẽ kết thúc khi hết thời gian đếm ngược!
          </p>
          <button
            onClick={handleBuyClick}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-2xl font-bold px-16 py-6 rounded-full shadow-2xl transition-all transform hover:scale-105 animate-pulse"
          >
            🛒 MUA NGAY - TIẾT KIỆM 50%
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-white/70">
          <p className="mb-2">© 2024 YourBrand. All rights reserved.</p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Điều khoản dịch vụ
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Liên hệ
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
